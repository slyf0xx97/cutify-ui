// Gallery screenshots: a 1280 x 800 shot of the top of each example, saved to docs/gallery/<name>.png.
// Usage (from tools/): serve the repo root (python -m http.server 8811 --bind 127.0.0.1), then
//   node shots.mjs [baseUrl] [nameFilter]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] || 'http://127.0.0.1:8811';
const FILTER = process.argv[3] || '';
const names = fs.readdirSync(path.join(ROOT, 'examples'))
  .filter((d) => fs.existsSync(path.join(ROOT, 'examples', d, 'index.html')) && d.includes(FILTER));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
for (const name of names) {
  await page.goto(`${BASE}/examples/${name}/index.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(3000);           // let entrance animations settle
  const out = path.join(ROOT, 'docs', 'gallery', `${name}.png`);
  await page.screenshot({ path: out });
  console.log('saved', path.relative(ROOT, out));
}
await browser.close();
