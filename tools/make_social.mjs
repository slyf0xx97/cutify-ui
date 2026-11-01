// Saves a still of tools/cover.html as docs/social-preview.png (1280 x 640, the size GitHub's social preview expects).
// The README cover GIF records the same page, so the two always match.
// Run from tools/ with a static server on the repo root: node make_social.mjs http://127.0.0.1:8811
import { chromium } from "playwright";
import { allowFraming } from "./framing.mjs";

const base = process.argv[2] ?? "http://127.0.0.1:8811";
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 1 });
await allowFraming(context);
const page = await context.newPage();
await page.goto(`${base}/tools/cover.html`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(15000); // SkyQueue is a Streamlit app and takes a few seconds to draw
await page.locator(".card").screenshot({ path: "../docs/social-preview.png" });
await browser.close();
console.log("docs/social-preview.png");
