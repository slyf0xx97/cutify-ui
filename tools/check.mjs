// Checks for the cutify-ui repo. Run from tools/: npm install && npm run check
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

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
for (const ref of skill.matchAll(/`((?:references|assets)\/[^`*]+?)`/g)) {
  existsSync(join(root, ref[1])) ? null : fail(`SKILL.md points to missing ${ref[1]}`);
}
ok("every path SKILL.md mentions exists");

console.log("TypeScript (strict)");
try {
  execFileSync(process.execPath, [join(root, "tools/node_modules/typescript/bin/tsc"), "-p", join(root, "tools/tsconfig.json")], { stdio: "inherit" });
  ok("assets/react type-checks");
} catch { fail("TypeScript errors in assets/react"); }

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
  const external = [...html.matchAll(/(?:src|href)=["'](https?:\/\/[^"']+)/g)].map((m) => m[1]).filter((u) => !/fonts\.(googleapis|gstatic)\.com|github\.com|ghernie\.com|github\.io|slyf0xx97/.test(u));
  external.length ? fail(`${name}: loads from ${external.join(", ")}`) : null;
}

console.log("Copy");
for (const f of ["README.md", "SKILL.md", "index.html", ...files.filter((f) => /examples[\/][^\/]+[\/]README\.md$/.test(f)).map((f) => relative(root, f))]) {
  readFileSync(join(root, f), "utf8").includes("·") ? fail(`${f} uses a middle dot separator`) : null;
}
ok("no middle-dot separators in the main copy");

console.log(fails.length ? `\n${fails.length} problem(s) found.` : "\nAll checks passed.");
process.exit(fails.length ? 1 : 0);
