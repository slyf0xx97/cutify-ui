// Loads assets/starter.html with each theme pasted into the theme slot, at 390px and 1280px.
// Reports page errors and sideways overflow, saves screenshots to tools/qa-output/starter/. Run from tools/: node starter-check.mjs
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const assets = join(here, "../plugin/skills/cutify-ui/assets");
const out = join(here, "qa-output/starter");
mkdirSync(out, { recursive: true });
const starter = readFileSync(join(assets, "starter.html"), "utf8");
const slot = '<style id="theme">/* paste one assets/<theme>.css here */</style>';
if (!starter.includes(slot)) throw new Error("theme slot not found in starter.html");

const browser = await chromium.launch();
const rows = [];
let bad = 0;
for (const theme of ["glass", "apron", "picnic", "riso", "lantern", "toybox"]) {
  const css = readFileSync(join(assets, `${theme}.css`), "utf8");
  const file = join(out, `${theme}.html`);
  writeFileSync(file, starter.replace(slot, () => `<style id="theme">${css}</style>`));
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto("file:///" + file.replace(/\\/g, "/"), { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    await page.screenshot({ path: join(out, `${theme}-${width}.png`), fullPage: true });
    if (errors.length || overflow > 0) bad++;
    rows.push({ theme, width, errors: errors.length, overflow, first: errors[0] ?? "" });
    await page.close();
  }
}
await browser.close();
console.table(rows);
process.exit(bad ? 1 : 0);
