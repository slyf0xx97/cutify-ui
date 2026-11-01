// Renders tools/social.html to docs/social-preview.png (1280 x 640, the size GitHub's social preview expects).
// Run from tools/ with a static server on the repo root: node make_social.mjs http://127.0.0.1:8811
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:8811";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 640 } });
await page.goto(`${base}/tools/social.html`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.locator(".card").screenshot({ path: "../docs/social-preview.png" });
await browser.close();
console.log("docs/social-preview.png");
