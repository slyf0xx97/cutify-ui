// Pictures for the README's Features table, each captured from the repo's own example pages or tools.
// Run from tools/ with a static server on the repo root (python -m http.server 8811 --bind 127.0.0.1),
// ffmpeg in FFMPEG (or on PATH) and optionally gifsicle in GIFSICLE:
//   node make_feature_shots.mjs            every picture
//   node make_feature_shots.mjs routes     only the named ones
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.env.BASE ?? "http://127.0.0.1:8811";
const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const OUT = join(ROOT, "docs/features");
const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
const tmp = mkdtempSync(join(tmpdir(), "cutify-features-"));
const W = 320;   // CSS width of every picture; drawn at 2x, so 640 px files shown at about 300 px in the README
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

// Opens an example (or any repo path) at 2x, runs fn(page) and closes the context.
async function withPage(path, fn, { width = 1280, height = 800, reducedMotion = "no-preference" } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, reducedMotion });
  const page = await context.newPage();
  await page.goto(`${BASE}/${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  try { return await fn(page); } finally { await context.close(); }
}

const dataUri = (buf) => `data:image/png;base64,${buf.toString("base64")}`;
const shotOf = (page, selector) => page.locator(selector).first().screenshot({ animations: "allow" });
const hideContent = (page) => page.addStyleTag({ content: "body > * { visibility: hidden !important; }" });

// Lays out captured images on a small page and saves it as a palette PNG.
const CARD = `<style>
  body { margin: 0; background: #fff; font: 600 11px/1.3 ui-monospace, Consolas, monospace; color: #3a3a3a; }
  #c { width: ${W}px; padding: 8px; box-sizing: border-box; display: grid; gap: 8px; background: #fff; }
  #c img { display: block; width: 100%; border-radius: 6px; }
  figure { margin: 0; display: grid; gap: 4px; } figcaption { text-align: center; }
  .row { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 8px; align-items: center; }
  .code { background: #1d1f27; border-radius: 8px; overflow: hidden; }
  .code .ct { background: #2a2d38; color: #aab0c0; padding: 5px 10px; font-weight: 500; }
  .code pre { margin: 0; padding: 9px 10px; color: #e6e6e6; font: 500 9.5px/1.5 ui-monospace, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
  i { font-style: normal; } .s { color: #b5e08c; } .c { color: #7d8496; } .t { color: #7cc4ff; } .p { color: #ffd479; } .f { color: #ff7a7a; } .w { color: #8fe3a8; }
</style>`;
async function compose(name, body, { colors = 256 } = {}) {
  const context = await browser.newContext({ viewport: { width: W, height: 400 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.setContent(`<!doctype html><meta charset="utf-8">${CARD}<div id="c">${body}</div>`, { waitUntil: "load" });
  const raw = join(tmp, `${name}.png`);
  await page.locator("#c").screenshot({ path: raw });
  await context.close();
  savePng(raw, join(OUT, `${name}.png`), colors);
}
// palette PNG: pixel art and flat UI keep their edges and the file shrinks to a fraction
function savePng(raw, out, colors) {
  execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-i", raw, "-vf",
    `split[a][b];[a]palettegen=max_colors=${colors}:reserve_transparent=0[p];[b][p]paletteuse=dither=none`, out]);
  console.log(out);
}
// a dark code or terminal card; the text is read from the repo or from a real run, never typed here
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// strings are tinted first so the quotes of later tags are never touched; terminal output only colours its prompt and levels
const tint = (t, terminal) => (terminal ? esc(t) : esc(t)
  .replace(/("[^"\n]*"|'[^'\n]*')/g, '<i class="s">$1</i>')
  .replace(/(^\s*|  )(#.*|\/\/.*)$/gm, '$1<i class="c">$2</i>')
  .replace(/(&lt;\/?)([A-Z]\w*)/g, '$1<i class="t">$2</i>'))
  .replace(/^(\$ .*)$/gm, '<i class="p">$1</i>')
  .replace(/^(FAIL)/gm, '<i class="f">$1</i>').replace(/^(OK|WARN)/gm, '<i class="w">$1</i>');
const code = (title, text, terminal = false) => `<div class="code"><div class="ct">${esc(title)}</div><pre>${tint(text, terminal)}</pre></div>`;
// runs of spaces before a trailing comment shrink to two, so aligned comments don't wrap in a 320px card
const lines = (file, from, to, indent = 0) => readFileSync(join(ROOT, file), "utf8").split(/\r?\n/).slice(from - 1, to)
  .map((l) => l.slice(indent).replace(/ {3,}(#|\/\/)/, "  $1")).join("\n");
const fig = (buf, caption) => `<figure><img src="${dataUri(buf)}" alt="">${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;

// The page clock and CSS animations run at RATE speed while recording, so the recorder's 25 fps
// becomes smooth motion once ffmpeg speeds it back up (the same idea as make_gif.mjs).
const RATE = 0.5;
const slowClock = `(() => {
  const R = ${RATE}, pnow = performance.now.bind(performance), p0 = pnow(), dnow = Date.now, d0 = dnow();
  const now = () => Math.round(d0 + (dnow() - d0) * R);
  performance.now = () => p0 + (pnow() - p0) * R;
  const D = Date;
  window.Date = class extends D { constructor(...a) { a.length ? super(...a) : super(now()); } static now() { return now(); } };
  const st = setTimeout, si = setInterval, raf = requestAnimationFrame;
  window.setTimeout = (f, t = 0, ...a) => st(f, t / R, ...a);
  window.setInterval = (f, t = 0, ...a) => si(f, t / R, ...a);
  window.requestAnimationFrame = (cb) => raf((ts) => cb(p0 + (ts - p0) * R));
})();`;

// Records one element for `seconds` of page time and returns a cropped, full-speed mp4.
async function record(path, selector, { seconds = 3, width = 1280, height = 800, reducedMotion = "no-preference", prepare } = {}) {
  const dir = mkdtempSync(join(tmp, "rec-"));
  const Z = 2;   // the recorder ignores deviceScaleFactor, so the page is drawn at twice the size with CSS zoom
  const size = { width: width * Z, height: height * Z };
  const context = await browser.newContext({ viewport: size, reducedMotion, recordVideo: { dir, size } });
  await context.addInitScript(slowClock);
  const started = Date.now();
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Animation.enable");
  await cdp.send("Animation.setPlaybackRate", { playbackRate: RATE });
  await page.goto(`${BASE}/${path}`, { waitUntil: "networkidle" });
  await page.evaluate((z) => { document.documentElement.style.zoom = z; }, Z);
  const els = [selector].flat().map((sel) => page.locator(sel).first());   // several selectors record the box around them all
  await els[0].scrollIntoViewIfNeeded();
  if (prepare) await prepare(page);
  await page.waitForTimeout(1500);
  const boxes = await Promise.all(els.map((e) => e.boundingBox()));
  const x = Math.min(...boxes.map((b) => b.x)), y = Math.min(...boxes.map((b) => b.y));
  const box = { x, y, width: Math.max(...boxes.map((b) => b.x + b.width)) - x, height: Math.max(...boxes.map((b) => b.y + b.height)) - y };
  const start = (Date.now() - started) / 1000;
  await page.waitForTimeout((seconds / RATE) * 1000 + 500);
  const video = await page.video().path();
  await context.close();
  const even = (n) => Math.floor(n / 2) * 2;
  const crop = `crop=${even(box.width)}:${even(box.height)}:${even(box.x)}:${even(box.y)}`;
  const mp4 = join(dir, "clip.mp4");
  execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-ss", start.toFixed(2), "-t", String(seconds / RATE), "-i", video,
    "-vf", `${crop},setpts=PTS*${RATE},fps=25`, "-an", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", mp4]);
  return mp4;
}
// mp4 (or an ffmpeg filter graph over several) to a small looping GIF, `px` wide
function gif(inputs, name, px, filter = "[0:v]null") {
  const out = join(OUT, `${name}.gif`);
  execFileSync(ffmpeg, ["-y", "-loglevel", "error", ...inputs.flatMap((f) => ["-i", f]), "-filter_complex",
    `${filter},scale=${px}:-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`,
    "-loop", "0", out]);
  if (process.env.GIFSICLE) execFileSync(process.env.GIFSICLE, ["-O3", "--lossy=60", "-b", out]);
  console.log(out);
}

const ex = (name) => `examples/${name}/`;

const shots = {
  // the six themes, from the gallery screenshots the repo already keeps
  async themes() {
    const six = [["pantry-pals", "Glass"], ["fleet-queue", "Apron"], ["sunday-spread", "Picnic"],
      ["zine-night", "Riso Club"], ["moonlit-market", "Lantern Night"], ["beep-and-build", "Toy Box"]];
    const cells = six.map(([n, t]) => fig(readFileSync(join(ROOT, `docs/gallery/${n}.png`)), t)).join("");
    await compose("themes", `<div class="row" style="grid-template-columns:1fr 1fr;grid-auto-flow:row">${cells}</div>`);
  },
  // each page's real backdrop with its content hidden
  async backdrops() {
    // [page, label, x, y, size]: a square of each backdrop, small where the pattern is fine
    const six = [["sunday-spread", "gingham", 0, 0, 240], ["pantry-pals", "painted scene", 0, 350, 450], ["penpal-post", "cloud wallpaper", 0, 0, 300],
      ["moonlit-market", "starry dusk", 30, 520, 180], ["beep-and-build", "graph paper", 0, 0, 240], ["zine-night", "riso grain", 0, 0, 90]];
    const cells = [];
    for (const [n, label, x, y, size] of six) {
      cells.push(fig(await withPage(ex(n), async (p) => { await hideContent(p); return p.screenshot({ clip: { x, y, width: size, height: size } }); }), label));
    }
    await compose("backdrops", `<div class="row" style="grid-template-columns:1fr 1fr 1fr;grid-auto-flow:row">${cells.join("")}</div>`);
  },
  // the display face of six pages, captioned with the font each page really uses
  async fonts() {
    const six = ["pantry-pals", "fleet-queue", "sunday-spread", "zine-night", "moonlit-market", "beep-and-build"];
    const cells = [];
    for (const n of six) {
      cells.push(await withPage(ex(n), async (p) => {
        const face = await p.evaluate(() => getComputedStyle(document.querySelector("h1")).fontFamily.split(",")[0].replace(/["']/g, ""));
        return fig(await shotOf(p, "h1"), face);
      }));
    }
    await compose("fonts", `<div class="row" style="grid-template-columns:1fr 1fr;grid-auto-flow:row">${cells.join("")}</div>`);
  },
  // pixel sprites from six pages, each on its own page's background
  async characters() {
    const picks = [["sunday-spread", 1], ["beep-and-build", 3], ["fleet-queue", 1], ["zine-night", 0], ["moonlit-market", 7], ["gridline", 4]];
    const cells = [];
    for (const [n, i] of picks) {
      cells.push(fig(await withPage(ex(n), async (p) => { const s = p.locator(".sprite").nth(i); await s.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); return s.screenshot(); })));
    }
    await compose("characters", `<div class="row" style="grid-template-columns:repeat(6,1fr);grid-auto-flow:row">${cells.join("")}</div>`);
  },
  // hero legends: each character has its own shape and an AI or You chip
  async tags() {
    const a = await withPage(ex("fleet-queue"), (p) => shotOf(p, ".hero .legend"), { width: 390 });
    const b = await withPage(ex("beep-and-build"), (p) => shotOf(p, ".hero .legend"), { width: 390 });
    await compose("tags", fig(a) + fig(b));
  },
  // three numbered stage headers from one page, in order
  async stages() {
    const heads = await withPage(ex("fleet-queue"), async (p) => {
      const out = [];
      for (const id of ["#st1", "#st2", "#st3"]) {
        const el = p.locator(id);
        await el.scrollIntoViewIfNeeded();
        const b = await el.boundingBox();
        out.push(await p.screenshot({ clip: { x: b.x - 6, y: b.y - 6, width: 420, height: b.height + 12 } }));
      }
      return out;
    });
    await compose("stages", heads.map((h) => fig(h)).join(""));
  },
  // the Toy Box ledge press: the same button at rest and held down
  async interactions() {
    const [rest, down] = await withPage(ex("beep-and-build"), async (p) => {
      const b = await p.locator(".hero .btn.primary").first().boundingBox();
      const clip = { x: b.x - 10, y: b.y - 10, width: b.width + 20, height: b.height + 20 };
      const rest = await p.screenshot({ clip });
      await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
      await p.mouse.down();
      await p.waitForTimeout(400);
      const down = await p.screenshot({ clip });
      await p.mouse.up();
      return [rest, down];
    });
    await compose("interactions", `<div class="row">${fig(rest, "resting")}${fig(down, "pressed")}</div>`);
  },
  // a tooltip opened by hovering the i button of stage 1
  async tooltips() {
    const shot = await withPage(ex("fleet-queue"), async (p) => {
      const i = p.locator("#st1 .i");
      await i.scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      const b = await i.boundingBox();
      await i.hover();
      await p.waitForTimeout(500);
      return p.screenshot({ clip: { x: b.x - 175, y: b.y - 205, width: 360, height: 236 } });
    });
    await compose("tooltips", fig(shot));
  },
  // number tiles from one page and the native dialog from another
  async components() {
    const kpis = await withPage(ex("fleet-queue"), async (p) => { const k = p.locator("#kpis"); await k.scrollIntoViewIfNeeded(); await p.waitForTimeout(800); return k.screenshot(); }, { width: 600 });
    const dlg = await withPage(ex("gridline"), async (p) => { await p.evaluate(() => document.getElementById("dlg").showModal()); await p.waitForTimeout(500); return shotOf(p, "#dlg"); }, { width: 600 });
    await compose("components", fig(kpis) + fig(dlg));
  },
  // a real line from the Next.js example and the header it renders in that example's static copy
  async react() {
    const head = await withPage(ex("pantry-pals"), async (p) => { const h = p.locator(".stage-header").first(); await h.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); return h.screenshot(); }, { width: 760 });
    const file = "examples/pantry-pals/components/Planner.tsx";
    await compose("react", code(file, lines(file, 80, 80, 8)) + fig(head, "what it renders"));
  },
  // the helper's own usage lines and the browser side that talks back to Python
  async streamlit() {
    await compose("streamlit", code("assets/streamlit/cutify_streamlit.py", lines("assets/streamlit/cutify_streamlit.py", 3, 6, 4))
      + code("assets/streamlit/cutify-bridge.js", lines("assets/streamlit/cutify-bridge.js", 11, 12)));
  },
  // robots driving along the drawn aisle routes of the Fleet Queue floor map
  async routes() {
    gif([await record(ex("fleet-queue"), "#heroFloor", { width: 900 })], "routes", 480);
  },
  // Gridline's clock-driven simulation: the clock and the power packets run from one requestAnimationFrame loop
  async patterns() {
    // the page's own clock starts at noon; jump it to late afternoon so the homes light up inside the clip
    gif([await record(ex("gridline"), [".status", "#sceneSvg"], { width: 1000, prepare: (p) => p.evaluate("clockT = 17.4") })], "patterns", 560);
  },
  // the same floor map side by side, with reduced motion off (left) and on (right)
  async motion() {
    const on = await record(ex("fleet-queue"), "#heroFloor", { width: 900 });
    const off = await record(ex("fleet-queue"), "#heroFloor", { width: 900, reducedMotion: "reduce" });
    gif([on, off], "reduced-motion", 600, "[0:v][1:v]scale2ref=iw:ih[n][r];[n]pad=iw+16:ih:0:0:white[n2];[n2][r]hstack");
  },
  // the linter's real output on a scratch page full of tells, then on an example
  async linter() {
    const bad = join(tmp, "draft.html");
    writeFileSync(bad, [
      "<!doctype html><title>Draft</title>",
      "<style>.card { animation: glow 2s infinite; }",
      "@keyframes glow { to { box-shadow: 0 0 20px #f0f; } }</style>",
      "<h1>Welcome \u{1F680}</h1><p>Lorem ipsum, a sample.</p>",
      '<span class="i">i</span>'].join("\n"));
    const run = (file, shown) => {
      let out;
      try { out = execFileSync(process.platform === "win32" ? "python" : "python3", [join(ROOT, "scripts/lint_page.py"), file], { encoding: "utf8" }); }
      catch (e) { out = e.stdout; }
      return `$ python scripts/lint_page.py ${shown}\n${out.split(file).join(shown).trim()}`;
    };
    await compose("linter", code("terminal", `${run(bad, "draft.html")}\n\n${run(join(ROOT, "examples/fleet-queue/index.html"), "examples/fleet-queue/index.html")}`, true));
  },
};

const want = process.argv.slice(2);
try {
  for (const [name, run] of Object.entries(shots)) if (!want.length || want.includes(name)) await run();
} finally {
  await browser.close();
  rmSync(tmp, { recursive: true, force: true });
}
