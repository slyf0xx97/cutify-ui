// Records a looping GIF that visits several example pages, about two seconds each, for the README.
// Run from tools/ with a static server on the repo root:
//   node make_gif.mjs http://127.0.0.1:8811 studybuddy,fleet-queue,sunday-spread ../docs/gallery/demo.gif
import { chromium } from "playwright";
import { PNG } from "pngjs";
import gifenc from "gifenc";
import { writeFileSync } from "node:fs";

const [base = "http://127.0.0.1:8811", list = "fleet-queue", out = "../docs/gallery/demo.gif"] = process.argv.slice(2);
const W = 720, H = 405, PER_PAGE = 13, STEP = 90; // about 1.7 s per page at 8 fps keeps six pages near 3 MB
const { GIFEncoder, quantize, applyPalette } = gifenc;

const browser = await chromium.launch();
// lay each page out at desktop width (1280px), then scale the frames down to W x H
const page = await browser.newPage({ viewport: { width: 1280, height: 1280 * H / W }, deviceScaleFactor: W / 1280 });
const shots = [];
for (const name of list.split(",")) {
  await page.goto(`${base}/examples/${name}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  // each screenshot takes real time, so every frame's delay is the measured gap, keeping playback at real speed
  for (let i = 0, t = Date.now(); i < PER_PAGE; i++) {
    const png = await page.screenshot();
    await page.waitForTimeout(STEP);
    const now = Date.now();
    shots.push({ png, delay: now - t });
    t = now;
  }
  shots.at(-1).delay += 400; // a short hold before the next page
}
await browser.close();
const gif = GIFEncoder();
for (const { png, delay } of shots) {
  const { data } = PNG.sync.read(png);
  const palette = quantize(data, 256);
  gif.writeFrame(applyPalette(data, palette), W, H, { palette, delay: Math.round(delay / 10) * 10 });
}
gif.finish();
writeFileSync(out, gif.bytes());
console.log(`${out} ${shots.length} frames, ${(gif.bytes().length / 1024).toFixed(0)} KB`);
