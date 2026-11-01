// Renders every React component in assets/react to HTML and checks the accessible markup. Run from tools/.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const src = new URL("../plugin/skills/cutify-ui/assets/react/", import.meta.url);
const out = new URL("./.react-test/", import.meta.url);
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const f of readdirSync(src).filter((f) => /\.tsx?$/.test(f))) {
  const js = ts.transpileModule(readFileSync(new URL(f, src), "utf8"), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  writeFileSync(new URL(f.replace(/\.tsx?$/, ".mjs"), out), js.replace(/from "\.\/(\w+)"/g, 'from "./$1.mjs"'));
}
const load = (name) => import(pathToFileURL(join(out.pathname.replace(/^\/([A-Za-z]:)/, "$1"), name + ".mjs")).href);

const fails = [];
const expect = (name, html, checks) => {
  for (const [what, ok] of checks) if (!ok(html)) fails.push(`${name}: ${what}\n    ${html.slice(0, 200)}`);
  console.log(`  ${checks.every(([, ok]) => ok(html)) ? "✓" : "✕"} ${name} renders`);
};

const { PixelSprite } = await load("PixelSprite");
const grid = Array.from({ length: 16 }, (_, y) => (y === 5 ? "....aa....aa...." : "................"));
expect("PixelSprite", renderToStaticMarkup(h(PixelSprite, { grid, palette: { a: "#111" }, label: "Bolt the robot" })), [
  ["has role=img and its label", (s) => /role="img"/.test(s) && /Bolt the robot/.test(s)],
  ["draws crisp pixels", (s) => /crispEdges|pixelated/.test(s) && /<rect/.test(s)],
]);
expect("PixelSprite (decorative)", renderToStaticMarkup(h(PixelSprite, { grid, palette: { a: "#111" } })), [
  ["is hidden from screen readers", (s) => /aria-hidden="true"/.test(s)],
]);
const { PixelIcon } = await load("PixelIcon");
expect("PixelIcon", renderToStaticMarkup(h(PixelIcon, { name: "check", label: "Done" })), [
  ["is an svg with a label", (s) => /<svg/.test(s) && /Done/.test(s)],
]);
const { KindChip } = await load("KindChip");
expect("KindChip", renderToStaticMarkup(h(KindChip, { kind: "ai" })), [["says AI", (s) => /AI/.test(s)]]);
const { StageHeader } = await load("StageHeader");
expect("StageHeader", renderToStaticMarkup(h(StageHeader, { n: 2, title: "Pick your dinners", line: "Seven ideas from your fridge.", icon: h(PixelIcon, { name: "book" }) })), [
  ["numbers the stage", (s) => /Stage 2/.test(s)],
  ["uses a real heading", (s) => /<h2[^>]*>Pick your dinners<\/h2>/.test(s)],
  ["hides the decorative icon", (s) => /aria-hidden="true"/.test(s)],
]);
const { WordTip } = await load("WordTip");
expect("WordTip", renderToStaticMarkup(h(WordTip, { word: "i", label: "About the menu board", title: "Why a menu board" }, "It shows tonight's plan.")), [
  ["trigger is a button", (s) => /<button[^>]*type="button"/.test(s)],
  ["trigger has an accessible name", (s) => /aria-label="About the menu board"/.test(s)],
  ["the tip it points to exists", (s) => { const id = s.match(/aria-(?:describedby|controls)="([^"]+)"/)?.[1]; return !!id && s.includes(`id="${id}"`); }],
]);
const { Popup } = await load("Popup");
expect("Popup", renderToStaticMarkup(h(Popup, { open: true, onClose() {}, title: "Confirm the menu" }, "Three dinners.")), [
  ["uses a native dialog", (s) => /<dialog/.test(s)],
  ["has a labelled close button", (s) => /<button[^>]*aria-label="[^"]+"/.test(s)],
]);

rmSync(out, { recursive: true, force: true });
if (fails.length) { console.log("\n" + fails.join("\n")); process.exit(1); }
