// Records a short looping GIF of an example page for the README. Run from tools/ with a static server on the repo root:
//   node make_gif.mjs http://127.0.0.1:8811 gridline ../docs/gallery/demo.gif
import { chromium } from "playwright";
import { PNG } from "pngjs";
import gifenc from "gifenc";
import { writeFileSync } from "node:fs";

const [base = "http://127.0.0.1:8811", name = "gridline", out = "../docs/gallery/demo.gif"] = process.argv.slice(2);
const W = 800, H = 450, FRAMES = 40, STEP = 100; // 4 seconds at 10 fps keeps the file small enough for a README
const { GIFEncoder, quantize, applyPalette } = gifenc;

const browser = await chromium.launch();
// lay the page out at desktop width (1280px), then scale the frames down to W x H
const page = await browser.newPage({ viewport: { width: 1280, height: 1280 * H / W }, deviceScaleFactor: W / 1280 });
await page.goto(`${base}/examples/${name}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const gif = GIFEncoder();
// each screenshot takes real time, so every frame's delay is the measured gap, keeping playback at real speed
const shots = [];
for (let i = 0, t = Date.now(); i < FRAMES; i++) {
  shots.push(await page.screenshot());
  await page.waitForTimeout(STEP);
  const now = Date.now(); shots[i] = { png: shots[i], delay: now - t }; t = now;
}
for (const { png, delay } of shots) {
  const { data } = PNG.sync.read(png);
  const palette = quantize(data, 256);
  gif.writeFrame(applyPalette(data, palette), W, H, { palette, delay: Math.round(delay / 10) * 10 });
}
await browser.close();
gif.finish();
writeFileSync(out, gif.bytes());
console.log(`${out} ${(gif.bytes().length / 1024).toFixed(0)} KB`);
