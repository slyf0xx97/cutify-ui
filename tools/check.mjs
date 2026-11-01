// Checks for the cutify-ui repo. Run from tools/: npm install && npm run check
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { validate as validateCss } from "csstree-validator";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const fails = [];
const ok = (msg) => console.log("  ✓ " + msg);
const fail = (msg) => { fails.push(msg); console.log("  ✕ " + msg); };
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  if (["node_modules", ".git", ".next", "dist"].includes(f)) return [];
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = walk(root);

console.log("SKILL.md");
const skill = readFileSync(join(root, "SKILL.md"), "utf8").replace(/\r\n/g, "\n");   // Windows checkouts
const fm = skill.match(/^---\n([\s\S]*?)\n---/);
if (!fm) fail("SKILL.md has no frontmatter");
else {
  /^name:\s*cutify-ui\s*$/m.test(fm[1]) ? ok("name is cutify-ui") : fail("frontmatter name must be cutify-ui");
  const d = fm[1].match(/^description:\s*(.+)$/m);
  d && d[1].length > 50 && d[1].length <= 1024 ? ok(`description is ${d[1].length} characters`) : fail("description missing, too short or over 1024 characters");
}
const lines = skill.split("\n").length;
lines < 500 ? ok(`${lines} lines (under 500)`) : fail(`SKILL.md is ${lines} lines; move detail into references/`);
const missing = [...skill.matchAll(/`((?:references|assets|scripts)\/[^`*<]+?)`/g)].map((m) => m[1]).filter((p) => !existsSync(join(root, p)));
missing.length ? missing.forEach((p) => fail(`SKILL.md points to missing ${p}`)) : ok("every path SKILL.md mentions exists");
const before = fails.length;
for (const theme of ["glass", "apron", "picnic", "riso", "lantern", "toybox"]) {
  const css = readFileSync(join(root, `assets/${theme}.css`), "utf8");
  const vars = ["bg", "surface", "surface-2", "ink", "ink-muted", "accent", "accent-ink", "accent-2", "accent-2-ink", "ok", "bad", "display", "body", "mono"]
    .filter((v) => !css.includes(`--${v}:`));
  const classes = ["panel", "card", "lab", "hl", "step", "btn", "kind", "i", "pill", "kpi", "sprite"].filter((c) => !new RegExp(`\\.${c}\\b`).test(css));
  vars.length || classes.length ? fail(`${theme}.css is missing ${[...vars.map((v) => "--" + v), ...classes.map((c) => "." + c)].join(", ")}`) : null;
}
fails.length === before ? ok("all six themes define the shared contract variables and classes") : null;

console.log("TypeScript (strict)");
try {
  execFileSync(process.execPath, [join(root, "tools/node_modules/typescript/bin/tsc"), "-p", join(root, "tools/tsconfig.json")], { stdio: "inherit" });
  ok("assets/react type-checks");
} catch { fail("TypeScript errors in assets/react"); }

console.log("React render test");
try {
  execFileSync(process.execPath, [join(root, "tools/react-test.mjs")], { stdio: "inherit", cwd: join(root, "tools") });
} catch { fail("a React component failed its render test"); }

console.log("JavaScript and Python syntax");
for (const f of files.filter((f) => f.endsWith(".js") || f.endsWith(".mjs"))) {
  try { execFileSync(process.execPath, ["--check", f]); } catch { fail(`syntax error in ${relative(root, f)}`); }
}
ok("all .js files parse");
const py = files.filter((f) => f.endsWith(".py"));
for (const f of py) {
  try { execFileSync(process.platform === "win32" ? "python" : "python3", ["-m", "py_compile", f]); } catch { fail(`syntax error in ${relative(root, f)}`); }
}
ok(`${py.length} Python files compile`);

console.log("Examples");
for (const name of readdirSync(join(root, "examples"))) {
  const need = [`examples/${name}/index.html`, `examples/${name}/README.md`, `docs/gallery/${name}.png`];
  const missing = need.filter((p) => !existsSync(join(root, p)));
  missing.length ? fail(`${name}: missing ${missing.join(", ")}`) : ok(`${name} has its page, README and screenshot`);
  const html = readFileSync(join(root, `examples/${name}/index.html`), "utf8");
  /prefers-reduced-motion/.test(html) ? null : fail(`${name}: no prefers-reduced-motion handling`);
  /sample|made-up/i.test(html) ? null : fail(`${name}: made-up data isn't labelled`);
  const external = [...html.matchAll(/(?:src|href)=["'](https?:\/\/[^"']+)/g)].map((m) => m[1]).filter((u) => !/fonts\.(googleapis|gstatic)\.com|donate\.stripe\.com|github\.com|ghernie\.com|linkedin\.com|github\.io|slyf0xx97/.test(u));
  external.length ? fail(`${name}: loads from ${external.join(", ")}`) : null;
}

console.log("CSS");
// csstree doesn't know @page descriptors, which are valid in print styles
const cssErrors = (css, name) => validateCss(css, name).filter((e) => !/at-rule descriptor `margin/.test(e.message));
const styleOf = (html) => [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");
const cssFiles = files.filter((f) => f.endsWith(".css") && !/examples[\/]pantry-pals[\/]app/.test(f) && !/qa-output/.test(f));
const cssSources = [...cssFiles.map((f) => [relative(root, f), readFileSync(f, "utf8")]),
  ...readdirSync(join(root, "examples")).map((n) => [`examples/${n}/index.html`, styleOf(readFileSync(join(root, `examples/${n}/index.html`), "utf8"))]),
  ["index.html", styleOf(readFileSync(join(root, "index.html"), "utf8"))]];
let cssBefore = fails.length;
for (const [name, css] of cssSources) cssErrors(css, name).slice(0, 3).forEach((e) => fail(`${name}: ${e.message} (line ${e.line})`));
fails.length === cssBefore ? ok(`${cssSources.length} stylesheets and <style> blocks are valid CSS`) : null;

console.log("Smooth motion");
// properties that make the browser repaint or re-layout on every frame of a loop
const heavy = /(?:^|[;{\s])(box-shadow|filter|background-position|left|top|right|bottom|width|height|margin[\w-]*)\s*:/;
const keyframes = /@keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}/g;
cssBefore = fails.length;
for (const [name, css] of cssSources) {
  for (const m of css.matchAll(keyframes)) if (heavy.test(m[2])) fail(`${name}: @keyframes ${m[1]} animates ${m[2].match(heavy)[1]}; move a layer with transform or opacity instead`);
}
fails.length === cssBefore ? ok("every @keyframes animates only transform, opacity or other cheap properties") : null;

console.log("Page linter");
// the same script the skill tells Claude to run on every page it builds
const pages = [...readdirSync(join(root, "examples")).map((n) => join(root, `examples/${n}/index.html`)), join(root, "index.html")];
try {
  execFileSync(process.platform === "win32" ? "python" : "python3", [join(root, "scripts/lint_page.py"), ...pages], { encoding: "utf8" });
  ok(`scripts/lint_page.py passes on ${pages.length} pages`);
} catch (e) {
  for (const l of String(e.stdout).split("\n").filter((l) => l.startsWith("FAIL"))) fail(l.slice(5).replace(root, "").replace(/^[\\/]/, ""));
}

console.log("Page weight");
cssBefore = fails.length;
for (const name of readdirSync(join(root, "examples"))) {
  const kb = statSync(join(root, `examples/${name}/index.html`)).size / 1024;
  kb > 150 ? fail(`${name}: index.html is ${kb.toFixed(0)} KB, over the 150 KB budget`) : null;
}
fails.length === cssBefore ? ok("every example page is under 150 KB before fonts") : null;

console.log("Plugin manifest");
try {
  const plugin = JSON.parse(readFileSync(join(root, ".claude-plugin/plugin.json"), "utf8"));
  const market = JSON.parse(readFileSync(join(root, ".claude-plugin/marketplace.json"), "utf8"));
  const changelog = readFileSync(join(root, "CHANGELOG.md"), "utf8").match(/^## \[(\d+\.\d+\.\d+)\]/m)?.[1];
  plugin.name === "cutify-ui" && market.plugins?.[0]?.name === plugin.name ? ok("plugin and marketplace names match") : fail("plugin.json and marketplace.json names don't match");
  plugin.version === changelog && market.plugins[0].version === changelog ? ok(`plugin version ${plugin.version} matches the changelog`) : fail(`plugin version ${plugin.version} / ${market.plugins[0].version} doesn't match the changelog's ${changelog}`);
  existsSync(join(root, ".claude-plugin/icon.png")) ? ok("plugin icon exists") : fail("missing .claude-plugin/icon.png");
} catch (e) { fail(`plugin manifests: ${e.message}`); }

console.log("Copy");
for (const f of ["README.md", "SKILL.md", "index.html", ...files.filter((f) => /examples[\/][^\/]+[\/]README\.md$/.test(f)).map((f) => relative(root, f))]) {
  readFileSync(join(root, f), "utf8").includes("·") ? fail(`${f} uses a middle dot separator`) : null;
}
ok("no middle-dot separators in the main copy");

console.log(fails.length ? `\n${fails.length} problem(s) found.` : "\nAll checks passed.");
process.exit(fails.length ? 1 : 0);
