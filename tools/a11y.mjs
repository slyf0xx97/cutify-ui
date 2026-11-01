// Automated accessibility audit with axe-core (WCAG 2.1 A and AA rules) on every example and the gallery, at 390px and 1280px.
// Usage, from tools/ with the repo served on 8811: node a11y.mjs [http://127.0.0.1:8811] [example-name]
// This is an automated check. It doesn't replace testing with a real screen reader.
import { chromium } from "playwright";
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const base = process.argv[2] ?? "http://127.0.0.1:8811";
const only = process.argv[3];
const axe = readFileSync(new URL("./node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const pages = [...readdirSync(root + "examples").map((n) => [n, `examples/${n}/`]), ["gallery", "site/"]].filter(([n]) => !only || n === only);

const browser = await chromium.launch();
const report = {};
let serious = 0;
try {
  for (const [name, path] of pages) {
    for (const width of [390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(`${base}/${path}`, { waitUntil: "load" });
      await page.waitForTimeout(800);
      await page.addScriptTag({ content: axe });
      const result = await page.evaluate(() => window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } }));
      const found = result.violations.map((v) => ({ id: v.id, impact: v.impact, count: v.nodes.length, help: v.help, targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")) }));
      report[`${name}@${width}`] = found;
      serious += found.filter((v) => v.impact === "serious" || v.impact === "critical").length;
      console.log(`${name.padEnd(16)} ${String(width).padStart(4)}px  ${found.length ? found.map((v) => `${v.id}(${v.impact},${v.count})`).join(" ") : "no violations"}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
mkdirSync(root + "tools/qa-output", { recursive: true });
writeFileSync(root + "tools/qa-output/a11y.json", JSON.stringify(report, null, 2));
console.log(serious ? `\n${serious} serious or critical finding(s). Details in tools/qa-output/a11y.json` : "\nNo serious or critical findings.");
process.exit(serious ? 1 : 0);
