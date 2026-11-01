// Render tools/donate-button.html to docs/support-button.png at 2x. Run from tools/: node make_button.mjs
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(root + "tools/donate-button.html").href);
  await page.evaluate(() => document.fonts.ready);
  await page.locator("#shot").screenshot({ path: root + "docs/support-button.png", omitBackground: true });
  console.log("wrote docs/support-button.png");
} finally {
  await browser.close();
}
