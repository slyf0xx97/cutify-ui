// Records live example pages as smooth looping GIFs (and, with a .mp4 output, as video for the website).
// Chrome's recorder only captures about 25 frames a second, so the page runs at RATE speed while recording
// (CSS animations through the DevTools protocol, JavaScript clocks and timers through an init script),
// and ffmpeg speeds the video back up. At RATE 0.4 that is about 62 captured frames per second of motion,
// which becomes a 50 fps GIF, the fastest frame rate browsers play GIFs at.
// Run from tools/ with a static server on the repo root, ffmpeg on PATH or in FFMPEG, and optionally gifsicle in GIFSICLE:
//   node make_gif.mjs <base> <page> <out> [width] [seconds]
//   node make_gif.mjs http://127.0.0.1:8811 tools/cover.html ../docs/gallery/cover.gif
//   node make_gif.mjs http://127.0.0.1:8811 examples/sprout/ ../docs/gallery/sprout.gif 640 4
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { allowFraming } from "./framing.mjs";

const [base = "http://127.0.0.1:8811", target = "tools/cover.html", out = "../docs/gallery/cover.gif", width, seconds] = process.argv.slice(2);
const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
const sizes = { "tools/cover.html": { width: 1280, height: 640 } };
const size = sizes[target] ?? { width: 1280, height: 800 }; // an example page is recorded at a desktop size
const outWidth = Number(width ?? size.width);
const LENGTH = Number(seconds ?? 6); // seconds of motion; six lines up with the Sprout watering cycle on the cover
const LOAD = target === "tools/cover.html" ? 25 : 5; // seconds to settle; the cover waits for SkyQueue (Streamlit) to start
const RATE = 0.4;                    // the page runs at 0.4x speed while recording
const SCALE = 2;                     // drawn at twice the size with CSS zoom, then scaled down, for sharp pixel art

const slowClock = `(() => {
  const R = ${RATE}, pnow = performance.now.bind(performance), p0 = pnow(), dnow = Date.now, d0 = dnow();
  const now = () => Math.round(d0 + (dnow() - d0) * R);
  performance.now = () => p0 + (pnow() - p0) * R;
  const D = Date;
  window.Date = class extends D { constructor(...a) { a.length ? super(...a) : super(now()); } static now() { return now(); } };
  const st = setTimeout, si = setInterval, raf = requestAnimationFrame;
  window.setTimeout = (f, t = 0, ...a) => st(f, t / R, ...a);
  window.setInterval = (f, t = 0, ...a) => si(f, t / R, ...a);
  window.requestAnimationFrame = (cb) => raf((ts) => cb(p0 + (ts - p0) * R));
})();`;

const dir = mkdtempSync(join(tmpdir(), "cutify-gif-"));
const browser = await chromium.launch();
// the video recorder ignores deviceScaleFactor, so the page itself is drawn at twice the size
const video = { width: size.width * SCALE, height: size.height * SCALE };
const context = await browser.newContext({ viewport: video, recordVideo: { dir, size: video } });
await context.addInitScript(slowClock); // runs in the page and in every example iframe
await allowFraming(context);
const started = Date.now();
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send("Animation.enable");
await cdp.send("Animation.setPlaybackRate", { playbackRate: RATE });
// "load", not "networkidle": the live SkyQueue preview keeps a connection open
await page.goto(`${base}/${target}`, { waitUntil: "load", timeout: 60000 });
await page.evaluate((z) => { document.documentElement.style.zoom = z; }, SCALE);
await page.waitForTimeout(LOAD * 1000);
const clipStart = (Date.now() - started) / 1000;
// Sprout on the cover: a watering cycle that loops with the clip (these timers run at page speed)
await page.evaluate((length) => {
  const w = [...document.querySelectorAll("iframe")].find((f) => /sprout/.test(f.src))?.contentWindow;
  if (!w?.setHealth) return;
  const cycle = () => {
    w.setHealth(0);
    setTimeout(() => w.pour(), 900);
    setTimeout(() => w.setHealth(1), 1500);
    setTimeout(() => w.pour(), 2500);
    setTimeout(() => w.setHealth(2), 3100);
    setTimeout(() => w.setHealth(3), 3900);
  };
  cycle();
  setInterval(cycle, length * 1000);
}, LENGTH);
await page.waitForTimeout((LENGTH / RATE) * 1000 + 800);
const recorded = await page.video().path();
await context.close();
await browser.close();

const speedUp = `setpts=PTS*${RATE},fps=50,scale=${outWidth}:-2:flags=lanczos`;
const args = ["-y", "-loglevel", "error", "-ss", clipStart.toFixed(2), "-t", String(LENGTH / RATE), "-i", recorded];
// one recording can produce several files: list them with commas, e.g. sprout.gif,sprout.mp4
for (const file of out.split(",")) {
  if (file.endsWith(".mp4")) {
    execFileSync(ffmpeg, [...args, "-vf", speedUp, "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "26", "-preset", "slow", "-movflags", "+faststart", file]);
  } else {
    // one palette for the whole clip keeps colours steady
    execFileSync(ffmpeg, [...args, "-vf", `${speedUp},split[a][b];[a]palettegen=max_colors=160:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`, "-loop", "0", file]);
    // gifsicle's lossy compression roughly halves a 50 fps GIF; skipped when it isn't installed
    if (process.env.GIFSICLE) execFileSync(process.env.GIFSICLE, ["-O3", "--lossy=80", "-b", file]);
  }
  console.log(file);
}
rmSync(dir, { recursive: true, force: true });
