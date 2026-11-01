// Records tools/demo-grid.html (six examples animating side by side) as smooth video, then turns it into a GIF with ffmpeg.
// Run from tools/ with a static server on the repo root and ffmpeg on PATH or in FFMPEG:
//   node make_gif.mjs http://127.0.0.1:8811 ../docs/gallery/demo.gif
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [base = "http://127.0.0.1:8811", out = "../docs/gallery/demo.gif"] = process.argv.slice(2);
const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
const size = { width: 1216, height: 528 };
const LOAD = 6, LENGTH = 5; // seconds: skip the page loads, then keep five seconds of motion

const dir = mkdtempSync(join(tmpdir(), "cutify-gif-"));
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: size, recordVideo: { dir, size } });
const page = await context.newPage();
await page.goto(`${base}/tools/demo-grid.html`, { waitUntil: "networkidle" });
await page.waitForTimeout((LOAD + LENGTH) * 1000 + 500);
const video = await page.video().path();
await context.close();
await browser.close();

// one palette for the whole clip keeps colours steady, and 20 fps keeps the motion smooth
const filters = "fps=20,scale=1000:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=160:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle";
execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-ss", String(LOAD), "-t", String(LENGTH), "-i", video, "-vf", filters, "-loop", "0", out]);
rmSync(dir, { recursive: true, force: true });
console.log(out);
