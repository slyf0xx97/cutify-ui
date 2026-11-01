// Loads every example in Firefox and WebKit (Safari's engine) at a phone and a desktop width,
// and reports page errors and sideways scrolling. Screenshots go to tools/qa-output/xbrowser/.
// Run from tools/ with a static server on the repo root: node xbrowser.mjs http://127.0.0.1:8811
import { firefox, webkit } from "playwright";
import { mkdirSync, readdirSync } from "node:fs";

const base = process.argv[2] ?? "http://127.0.0.1:8811";
const out = "qa-output/xbrowser";
mkdirSync(out, { recursive: true });
const names = readdirSync("../examples");
const widths = [{ width: 375, height: 812 }, { width: 1280, height: 800 }];
const problems = [];
for (const [label, engine] of [["firefox", firefox], ["webkit", webkit]]) {
  const browser = await engine.launch();
  for (const viewport of widths) {
    const page = await browser.newPage({ viewport });
    for (const name of names) {
      const errors = [];
      const onError = (e) => errors.push(e.message ?? String(e));
      const onConsole = (m) => m.type() === "error" && errors.push(m.text());
      page.on("pageerror", onError);
      page.on("console", onConsole);
      await page.goto(`${base}/examples/${name}/`, { waitUntil: "load" });
      await page.waitForTimeout(1500);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      await page.screenshot({ path: `${out}/${name}-${label}-${viewport.width}.png` });
      page.off("pageerror", onError);
      page.off("console", onConsole);
      const tag = `${name} ${label} ${viewport.width}px`;
      if (overflow > 1) problems.push(`${tag}: scrolls sideways by ${overflow}px`);
      for (const e of errors) problems.push(`${tag}: ${e.slice(0, 160)}`);
    }
    await page.close();
  }
  await browser.close();
}
console.log(problems.length ? problems.join("\n") : "No errors or sideways scrolling in Firefox or WebKit.");
