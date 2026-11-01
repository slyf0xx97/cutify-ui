// Records a page of live examples as video, then turns it into a smooth looping GIF with ffmpeg.
// Run from tools/ with a static server on the repo root and ffmpeg on PATH or in FFMPEG:
//   node make_gif.mjs http://127.0.0.1:8811 cover.html ../docs/gallery/cover.gif
//   node make_gif.mjs http://127.0.0.1:8811 demo-grid.html ../docs/gallery/demo.gif
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [base = "http://127.0.0.1:8811", file = "cover.html", out = "../docs/gallery/cover.gif"] = process.argv.slice(2);
const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
const sizes = { "cover.html": { width: 1280, height: 640 }, "demo-grid.html": { width: 1216, height: 528 } };
const size = sizes[file];
const LOAD = 6, LENGTH = 6; // seconds: skip the page loads, then keep one six-second cycle so the loop lines up
const SCALE = 2;            // lay the page out twice as large with CSS zoom, then scale the video down, for sharp pixel art

const dir = mkdtempSync(join(tmpdir(), "cutify-gif-"));
const browser = await chromium.launch();
// the video recorder ignores deviceScaleFactor, so the page itself is drawn at twice the size
const video = { width: size.width * SCALE, height: size.height * SCALE };
const context = await browser.newContext({ viewport: video, recordVideo: { dir, size: video } });
const started = Date.now();
const page = await context.newPage();
await page.goto(`${base}/tools/${file}`, { waitUntil: "networkidle" });
await page.evaluate((z) => { document.documentElement.style.zoom = z; }, SCALE);
await page.waitForTimeout(LOAD * 1000);
const clipStart = (Date.now() - started) / 1000;
// Sprout: water the plant on a six-second cycle so it droops, gets watered twice and perks up in every loop
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
await page.waitForTimeout(LENGTH * 1000 + 500);
const recorded = await page.video().path();
await context.close();
await browser.close();

// start the clip where the watering cycle starts, one palette for steady colours, 25 fps for smooth motion
const filters = `fps=25,scale=${size.width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=160:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`;
execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-ss", clipStart.toFixed(2), "-t", String(LENGTH), "-i", recorded, "-vf", filters, "-loop", "0", out]);
rmSync(dir, { recursive: true, force: true });
console.log(out);
