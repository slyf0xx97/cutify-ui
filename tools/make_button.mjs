// Render the README buttons to PNG at 2x. Run from tools/: node make_button.mjs
//   tools/donate-button.html  -> docs/support-button.png
//   tools/gallery-button.html -> docs/gallery-button.png
//   tools/kofi-button.html    -> docs/kofi-button.png
//   tools/features.html       -> docs/features.png
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const buttons = [["donate-button.html", "support-button.png"], ["gallery-button.html", "gallery-button.png"], ["kofi-button.html", "kofi-button.png"], ["features.html", "features.png"]];
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  for (const [html, png] of buttons) {
    await page.goto(pathToFileURL(root + "tools/" + html).href);
    await page.evaluate(() => document.fonts.ready);
    await page.locator("#shot").screenshot({ path: root + "docs/" + png, omitBackground: true });
    console.log("wrote docs/" + png);
  }
} finally {
  await browser.close();
}
