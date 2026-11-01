// Layout QA for the cutify-ui gallery and examples: sideways overflow, overlapping or clipped text,
// tooltips off screen or covered, dialogs, console errors, fonts and a contrast spot-check.
// Usage (from tools/): npm install && npx playwright install chromium
//   then serve the repo root, e.g. python -m http.server 8811 --bind 127.0.0.1
//   then: node qa.mjs [baseUrl] [pageFilter]
// Contrast results can be false alarms over patterned backdrops (a star or dot is read as the background).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const BASE = process.argv[2] || 'http://127.0.0.1:8811';
const FILTER = process.argv[3] || '';
const EXAMPLES = fs.readdirSync(path.join(ROOT, 'examples')).filter(d => fs.existsSync(path.join(ROOT, 'examples', d, 'index.html')));
const PAGES = ['site/index.html', ...EXAMPLES.map(p => `examples/${p}/index.html`)].filter(p => p.includes(FILTER));
const WIDTHS = [375, 768, 1280, 1440];
const SHOTS = path.join(HERE, 'qa-output');
fs.mkdirSync(SHOTS, { recursive: true });

// Runs in the page: overflow, overlap, clipping, cover, contrast. Returns plain data.
function audit() {
  const W = innerWidth, H = innerHeight;
  const sel = el => {
    if (!el || el.nodeType !== 1) return String(el);
    const one = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : (e.className?.baseVal ? '.' + e.className.baseVal.split(/\s+/)[0] : ''));
    const parts = []; let e = el;
    for (let i = 0; e && e.nodeType === 1 && i < 3; i++, e = e.parentElement) { parts.unshift(one(e)); if (e.id) break; }
    return parts.join('>');
  };
  const shown = el => {
    if (el.closest('dialog:not([open]), [hidden], template, [popover]:not(:popover-open)')) return false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return false;
      if (cs.clipPath && cs.clipPath !== 'none' && /inset\(50%|rect\(0/.test(cs.clipPath)) return false;
    }
    const cs = getComputedStyle(el);
    if (cs.position === 'absolute' && cs.clip && cs.clip.startsWith('rect(0')) return false; // sr-only
    return true;
  };
  const isSrOnly = el => { const r = el.getBoundingClientRect(); return r.width <= 1 && r.height <= 1; };
  // visible rect after clipping by overflow ancestors
  const clipRect = (el, r) => {
    let { left, top, right, bottom } = r;
    for (let e = el.parentElement; e && e !== document.documentElement; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (/hidden|clip|auto|scroll/.test(cs.overflowX + cs.overflowY) && e !== document.body) {
        const p = e.getBoundingClientRect();
        if (cs.overflowX !== 'visible') { left = Math.max(left, p.left); right = Math.min(right, p.right); }
        if (cs.overflowY !== 'visible') { top = Math.max(top, p.top); bottom = Math.min(bottom, p.bottom); }
      }
    }
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  };
  const sy = scrollY, sx = scrollX;
  const abs = r => ({ x: Math.round(r.left + sx), y: Math.round(r.top + sy), w: Math.round(r.width), h: Math.round(r.height) });

  // ---- text items: elements with own text, measured by their text-node ranges ----
  const items = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const byEl = new Map();
  for (let n; (n = walker.nextNode());) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (!el || /^(SCRIPT|STYLE|NOSCRIPT|TITLE|OPTION)$/.test(el.tagName)) continue;
    (byEl.get(el) || byEl.set(el, []).get(el)).push(n);
  }
  for (const [el, nodes] of byEl) {
    if (!shown(el) || isSrOnly(el)) continue;
    let L = Infinity, T = Infinity, R = -Infinity, B = -Infinity;
    const rects = [];
    for (const n of nodes) {
      const rg = document.createRange(); rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) { if (r.width < 1 || r.height < 1) continue; rects.push(r); L = Math.min(L, r.left); T = Math.min(T, r.top); R = Math.max(R, r.right); B = Math.max(B, r.bottom); }
    }
    if (!rects.length) continue;
    const vis = rects.map(r => clipRect(el, r)).filter(r => r.width > 1 && r.height > 1);
    if (!vis.length) continue;
    items.push({ el, rects: vis, box: { left: L, top: T, right: R, bottom: B, width: R - L, height: B - T }, text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) });
  }

  // ---- 1. horizontal overflow ----
  const overflow = [];
  const sw = document.documentElement.scrollWidth;
  if (sw > W) {
    for (const el of document.querySelectorAll('body *')) {
      if (!shown(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.right + sx > W + 1 && r.width > 0) {
        const vr = clipRect(el, r); if (vr.right + sx <= W + 1) continue;
        // report only outermost offenders
        if (![...overflow].some(o => o.el.contains(el))) overflow.push({ el, right: Math.round(r.right + sx) });
      }
    }
  }

  // ---- 2. text overlap ----
  const overlaps = [];
  const inter = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 4 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 4;
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const A = items[i], B = items[j];
    if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
    if (!inter(A.box, B.box)) continue;
    if (A.rects.some(a => B.rects.some(b => inter(a, b)))) overlaps.push({ a: sel(A.el), at: A.text, b: sel(B.el), bt: B.text, where: abs(A.box) });
  }

  // ---- 3. clipping ----
  const clipped = [];
  const panelOf = el => {
    for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      const hasBg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none';
      if ((hasBg || parseFloat(cs.borderLeftWidth) > 0) && !/^(SPAN|B|STRONG|EM|I|A|SMALL|CODE|LABEL)$/.test(e.tagName)) return e;
    }
    return null;
  };
  for (const it of items) {
    const el = it.el, cs = getComputedStyle(el);
    if (el.closest('svg')) { // SVG text: check against svg box
      const s = el.closest('svg').getBoundingClientRect();
      if (it.box.left < s.left - 2 || it.box.right > s.right + 2) clipped.push({ el: sel(el), text: it.text, why: 'svg text outside svg box', where: abs(it.box) });
      continue;
    }
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0 && cs.overflowX !== 'visible' && cs.display !== 'inline') clipped.push({ el: sel(el), text: it.text, why: `scrollWidth ${el.scrollWidth} > clientWidth ${el.clientWidth} (${cs.textOverflow === 'ellipsis' ? 'ellipsis' : 'cut'})`, where: abs(it.box) });
    // full (unclipped) text box vs visible: text cut by an overflow ancestor
    const full = it.box, cut = clipRect(el, full);
    if (cut.right < full.right - 2 || cut.left > full.left + 2 || cut.bottom < full.bottom - 2) {
      if (!(cut.width < 1 || cut.height < 1)) clipped.push({ el: sel(el), text: it.text, why: 'text cut by overflow ancestor', where: abs(full) });
    }
    const p = panelOf(el);
    if (p) { const pr = p.getBoundingClientRect(); if (full.right > pr.right + 2 || full.left < pr.left - 2) clipped.push({ el: sel(el), text: it.text, why: `text spills out of panel ${sel(p)}`, where: abs(full) }); }
    if (full.left < -1 || full.right > W + 1) clipped.push({ el: sel(el), text: it.text, why: 'partly off-screen', where: abs(full) });
  }

  // ---- covered text (at this scroll position, inside viewport) ----
  const covered = [];
  for (const it of items) {
    const r = it.rects[0]; const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
    if (cx < 0 || cy < 0 || cx > W || cy > H) continue;
    if (it.el.closest('svg')) continue;
    const hit = document.elementFromPoint(cx, cy);
    if (!hit || hit === it.el || it.el.contains(hit) || hit.contains(it.el)) continue;
    // label wrapping or same control is fine
    if (hit.closest('label, button, a') && hit.closest('label, button, a') === it.el.closest('label, button, a')) continue;
    covered.push({ el: sel(it.el), text: it.text, by: sel(hit), where: abs(r) });
  }

  // ---- 8. contrast ----
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
  const lum = ({ r, g, b }) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const blend = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
  const bgOf = el => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage !== 'none' && !/gradient/.test(cs.backgroundImage)) return null; // image: unknown
      if (/gradient/.test(cs.backgroundImage)) { const c = parse(cs.backgroundImage.match(/rgba?\([^)]+\)/)?.[0] || ''); if (c) { layers.push(c); if (c.a >= 1) break; } }
      const c = parse(cs.backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) bg = blend(layers[i], bg);
    return bg;
  };
  const contrast = [];
  const seen = new Set();
  for (const it of items) {
    const el = it.el;
    if (el.closest('svg') || el.closest('[aria-hidden="true"]')) continue;
    if (!el.closest('p, h1, h2, h3, h4, h5, h6, button, a, li, label, td, th, dd, dt, figcaption, small, .btn')) continue;
    const cs = getComputedStyle(el);
    let fg = parse(cs.color); if (!fg) continue;
    const bg = bgOf(el); if (!bg) continue;
    let op = 1; for (let e = el; e; e = e.parentElement) op *= +getComputedStyle(e).opacity;
    fg = blend({ ...fg, a: fg.a * op }, bg);
    const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
    if (el.closest('button:disabled, [aria-disabled="true"]')) continue; // disabled controls are exempt
    if (ratio < need) { const k = sel(el) + cs.color; if (seen.has(k)) continue; seen.add(k); contrast.push({ el: sel(el), text: it.text, ratio: +ratio.toFixed(2), need, fg: cs.color, size }); }
  }

  return {
    scrollWidth: sw, innerWidth: W,
    overflow: overflow.map(o => ({ el: sel(o.el), right: o.right })).slice(0, 15),
    overlaps: overlaps.slice(0, 40), clipped: clipped.slice(0, 40), covered: covered.slice(0, 30), contrast: contrast.slice(0, 30),
  };
}

// Measure the tooltip shown for the focused trigger el. Returns {rect, hitOk, kind} or null.
function measureTip(el) {
  const W = innerWidth, H = innerHeight;
  // CSS ::after tip
  const ps = getComputedStyle(el, '::after');
  if (ps.content && ps.content !== 'none' && ps.content !== 'normal' && ps.content !== '""' && el.dataset.tip) {
    const d = document.createElement('div');
    for (let i = 0; i < ps.length; i++) { const p = ps[i]; d.style.setProperty(p, ps.getPropertyValue(p)); }
    d.style.pointerEvents = 'auto'; d.style.animation = 'none'; d.style.opacity = '1';
    d.textContent = el.dataset.tip; d.dataset.qaClone = '1';
    el.appendChild(d);
    const r = d.getBoundingClientRect();
    const pts = [[r.left + r.width / 2, r.top + r.height / 2], [r.left + 6, r.top + 6], [r.right - 6, r.bottom - 6]];
    const blockers = pts.map(([x, y]) => { const h = document.elementFromPoint(x, y); return h && !d.contains(h) ? h : null; }).filter(Boolean);
    d.remove();
    return { kind: '::after', rect: { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom) }, out: r.left < -0.5 || r.top < -0.5 || r.right > W + 0.5 || r.bottom > H + 0.5, blockedBy: blockers.map(b => b.tagName.toLowerCase() + (b.id ? '#' + b.id : '') + (typeof b.className === 'string' && b.className ? '.' + b.className.split(' ')[0] : ''))[0] || null };
  }
  // real tooltip element
  const tips = [...document.querySelectorAll('[role="tooltip"]')].filter(t => { const r = t.getBoundingClientRect(); const cs = getComputedStyle(t); return !t.hidden && r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; });
  if (!tips.length) return { kind: 'none', out: false, rect: null, blockedBy: null, missing: true };
  const t = tips[tips.length - 1];
  const r = t.getBoundingClientRect();
  const old = t.style.pointerEvents; t.style.pointerEvents = 'auto';
  const pts = [[r.left + r.width / 2, r.top + r.height / 2], [r.left + 6, r.top + 6], [r.right - 6, r.bottom - 6]];
  const blockers = pts.map(([x, y]) => { const h = document.elementFromPoint(x, y); return h && !t.contains(h) ? h : null; }).filter(Boolean);
  t.style.pointerEvents = old;
  return { kind: 'element', rect: { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom) }, out: r.left < -0.5 || r.top < -0.5 || r.right > W + 0.5 || r.bottom > H + 0.5, blockedBy: blockers.map(b => b.tagName.toLowerCase() + (b.id ? '#' + b.id : '') + (typeof b.className === 'string' && b.className ? '.' + b.className.split(' ')[0] : ''))[0] || null };
}

const results = {};
const browser = await chromium.launch();
for (const pg of PAGES) {
  results[pg] = {};
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    const errors = [], failed = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
    page.on('pageerror', e => errors.push('pageerror: ' + e.message.slice(0, 200)));
    page.on('requestfailed', r => failed.push(r.url() + ' ' + (r.failure()?.errorText || '')));
    page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
    await page.goto(`${BASE}/${pg}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);

    const r = await page.evaluate(audit);
    // fonts
    r.fonts = await page.evaluate(() => {
      const fams = [...document.querySelectorAll('link[href*="fonts.googleapis"]')].flatMap(l => [...new URL(l.href).searchParams.getAll('family')].map(f => f.split(':')[0].replace(/\+/g, ' ')));
      return fams.map(f => ({ family: f, loaded: [...document.fonts].some(ff => ff.family.replace(/"/g, '') === f && ff.status === 'loaded') }));
    });
    const slug = pg.replace(/\/index\.html$/, '').replace(/^examples\//, '').replace('site/index.html', 'gallery');
    await page.screenshot({ path: path.join(SHOTS, `${slug}-${w}.png`), fullPage: true });

    // 4. tooltips
    r.tips = [];
    const n = await page.evaluate(() => document.querySelectorAll('[data-tip], .word-tip-word').length);
    await page.evaluate(`window.__measureTip = ${measureTip.toString()}`);
    await page.keyboard.press('Tab'); // keyboard modality so :focus-visible applies
    for (let i = 0; i < n; i++) {
      const info = await page.evaluate(i => {
        const el = document.querySelectorAll('[data-tip], .word-tip-word')[i];
        const vis = el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
        if (!vis) return { skip: true };
        el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
        return { skip: false, label: (el.getAttribute('aria-label') || (el.dataset.tip || el.textContent.trim()).split(String.fromCharCode(10))[0]).slice(0, 40) };
      }, i);
      if (info.skip) continue;
      await page.waitForTimeout(150);
      await page.evaluate(i => document.querySelectorAll('[data-tip], .word-tip-word')[i].focus(), i);
      await page.waitForTimeout(250);
      const m = await page.evaluate(i => window.__measureTip(document.querySelectorAll('[data-tip], .word-tip-word')[i]), i);
      if (m.out || m.blockedBy || m.missing) r.tips.push({ trigger: info.label, ...m });
      await page.evaluate(() => document.activeElement?.blur());
    }
    r.tipCount = n;
    // real keyboard pass: Tab through the page from the top; the browser scrolls each trigger in
    if (n) {
      await page.goto('about:blank'); await page.goto(`${BASE}/${pg}`, { waitUntil: 'networkidle' }); // fresh load: reload would restore the old scroll position mid-test await page.waitForTimeout(1500);
      await page.evaluate(`window.__measureTip = ${measureTip.toString()}`);
      const seen = new Set();
      for (let k = 0; k < 400 && seen.size < n; k++) {
        await page.keyboard.press('Tab');
        const idx = await page.evaluate(() => [...document.querySelectorAll('[data-tip], .word-tip-word')].indexOf(document.activeElement));
        if (idx < 0 || seen.has(idx)) continue;
        seen.add(idx);
        // let smooth scrolling settle: wait until scrollY is stable
        for (let y0 = -1, t = 0; t < 30; t++) { await page.waitForTimeout(100); const y = await page.evaluate(() => scrollY); if (y === y0) break; y0 = y; }
        await page.waitForTimeout(200);
        const m = await page.evaluate(i => window.__measureTip(document.querySelectorAll('[data-tip], .word-tip-word')[i]), idx);
        const label = await page.evaluate(i => { const el = document.querySelectorAll('[data-tip], .word-tip-word')[i]; return (el.getAttribute('aria-label') || (el.dataset.tip || el.textContent.trim()).split(String.fromCharCode(10))[0]).slice(0, 40); }, idx);
        if (m.out || m.blockedBy || m.missing) r.tips.push({ trigger: label, via: 'Tab', ...m });
      }
      r.tabReached = seen.size;
    }

    // 5. dialogs
    r.dialogs = [];
    const dlgIds = await page.evaluate(() => [...document.querySelectorAll('dialog')].map(d => d.id));
    for (const id of dlgIds) {
      await page.evaluate(() => scrollTo(0, 0));
      const trig = await page.evaluate(() => {
        const t = document.querySelector('[aria-haspopup="dialog"]:not(dialog *)') || document.querySelector('#approveBtn:not(dialog *), #reviewBtn, [data-open]');
        if (!t) return null; t.disabled = false; t.removeAttribute('disabled'); t.scrollIntoView({ block: 'center' }); t.id ||= 'qaTrig'; return '#' + t.id;
      });
      if (!trig) { r.dialogs.push({ id, issue: 'no trigger found' }); continue; }
      await page.focus(trig);
      await page.click(trig).catch(e => r.dialogs.push({ id, issue: 'click failed ' + e.message.slice(0, 80) }));
      await page.waitForTimeout(400);
      const d = await page.evaluate(id => {
        const dl = document.getElementById(id); if (!dl.open) return { open: false };
        const r = dl.getBoundingClientRect();
        const close = [...dl.querySelectorAll('button')].find(b => b.matches('[data-close], [aria-label*="lose" i]') || /close|cancel|not yet|×|✕/i.test(b.textContent));
        const cr = close?.getBoundingClientRect();
        const closeVis = !!cr && cr.width > 0 && cr.top >= 0 && cr.bottom <= innerHeight && cr.left >= 0 && cr.right <= innerWidth;
        return { open: true, rect: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)], fits: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight, closeVis, closeText: close?.textContent.trim().slice(0, 20) || null, innerOverflowX: dl.scrollWidth > dl.clientWidth + 1 };
      }, id);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      d.closedByEsc = await page.evaluate(id => !document.getElementById(id).open, id);
      d.focusReturned = await page.evaluate(t => document.activeElement === document.querySelector(t), trig);
      d.focusOn = await page.evaluate(() => { const a = document.activeElement; return a ? a.tagName + '#' + a.id : null; });
      r.dialogs.push({ id, trigger: trig, ...d });
    }

    r.errors = errors; r.failed = failed;
    results[pg][w] = r;
    await ctx.close();
    const bad = r.overflow.length + r.overlaps.length + r.clipped.length + r.covered.length + r.contrast.length + r.tips.length + r.errors.length + r.failed.length + r.fonts.filter(f => !f.loaded).length + r.dialogs.filter(d => !d.open || !d.fits || !d.closeVis || !d.closedByEsc || !d.focusReturned).length;
    console.log(`${pg} @${w}: overflow ${r.overflow.length} overlap ${r.overlaps.length} clip ${r.clipped.length} covered ${r.covered.length} contrast ${r.contrast.length} tips ${r.tips.length}/${n} dialogs ${JSON.stringify(r.dialogs.map(d => [d.open, d.fits, d.closeVis, d.closedByEsc, d.focusReturned]))} err ${r.errors.length} failed ${r.failed.length} fonts ${r.fonts.map(f => f.loaded ? 1 : 0).join('')} => ${bad ? 'ISSUES' : 'clean'}`);
  }
}
await browser.close();
fs.writeFileSync(path.join(SHOTS, FILTER ? `results-${FILTER.replace(/\W/g, '_')}.json` : 'results.json'), JSON.stringify(results, null, 1));
