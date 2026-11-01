# Components

Recipes in plain HTML/CSS. They use the shared contract variables that every theme file defines (`--bg`, `--surface`, `--surface-2`, `--ink`, `--ink-muted`, `--accent`, `--accent-ink`, `--accent-2`, `--accent-2-ink`, `--ok`, `--bad`, `--display`, `--body`, `--mono`), so they work in any of the six themes. Each theme file also ships its own styled versions of the base classes. Use those first, and use these recipes for the pieces a theme file doesn't have. React versions of the starred ones are in `assets/react/`.

## Contents
- Tooltip (★ `WordTip`)
- Buttons: game button, primary, secondary, split button with upward menu
- Kind chips and agent labels
- Step header and explain strip (★ `StageHeader`)
- Pills, chips, meters
- KPI tiles and fact chips
- Charts (line with crosshair, dumbbell, stacked bar)
- Dialog (★ `Popup`)
- Chat box
- Rule rows
- Connectors
- Loading screen and runway lights
- Toggle switch
- Footer

## Tooltip

This tooltip is small and has no dependencies. The trigger is a real button with an `aria-label`. The tip text lives in a visually hidden `role="tooltip"` element that screen readers reach through `aria-describedby`, and `::after` draws the visible bubble from `data-tip`. `&#10;` in the attribute plus `white-space: pre-line` gives multi-line tips.
```html
<button type="button" class="i" aria-label="About the Scout" aria-describedby="tip-scout"
  data-tip="Finds stalls that match your cravings&#10;• Reads the sample stall list&#10;Why: you name a craving, not a stall">i</button>
<span id="tip-scout" role="tooltip" class="sr-only">Finds stalls that match your cravings. Reads the sample stall list. Why: you name a craving, not a stall.</span>
```
```css
.i { display: inline-grid; place-items: center; width: 1.25rem; height: 1.25rem; padding: 0; border-radius: 50%; border: 1.5px solid currentColor;
  background: none; font: 700 .7rem var(--mono); color: var(--ink-muted); cursor: help; position: relative; margin-left: .4rem; vertical-align: middle; }
.i:hover, .i:focus-visible, .i.open { color: var(--accent); }
.i[data-tip]:is(:hover, :focus-visible, .open)::after { content: attr(data-tip); position: absolute; left: 50%; bottom: calc(100% + 10px);
  transform: translateX(-50%); width: min(320px, 80vw); padding: 10px 12px; background: var(--ink); color: var(--bg);
  font: 500 .85rem/1.45 var(--body); border-radius: 6px; box-shadow: 0 6px 0 rgb(0 0 0 / 33%); z-index: 200;
  white-space: pre-line; pointer-events: none; text-align: left; text-transform: none; letter-spacing: 0; }
.i.down[data-tip]:is(:hover, :focus-visible, .open)::after { bottom: auto; top: calc(100% + 10px); }
.i.left[data-tip]:is(:hover, :focus-visible, .open)::after { left: auto; right: -10px; transform: none; }
.i.right[data-tip]:is(:hover, :focus-visible, .open)::after { left: -10px; transform: none; }
:has(> .i:is(:hover, :focus-visible, .open)) { z-index: 60; }  /* lift the parent so neighbours never cover the tip */
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
```
```js
// tap or click toggles a tip; Escape or a tap elsewhere closes it
document.addEventListener('click', (e) => {
  const t = e.target.closest('.i[data-tip]');
  document.querySelectorAll('.i.open').forEach((o) => o !== t && o.classList.remove('open'));
  if (t) t.classList.toggle('open');
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.i.open').forEach((o) => o.classList.remove('open')); });
```
Use `.down` near the top of a panel and `.left`/`.right` near edges. Under about 600px, show tips as a bottom sheet (`position: fixed; left: 8px; right: 8px; bottom: 8px`) if they can't fit beside the trigger. For a richer tip (title strip, sections, square pixel bullets, flips above when there's no room), use the React `WordTip`, which uses the Popover API so it sits in the top layer. Inline variant: a word with `border-bottom: 2px dotted var(--accent)` and `cursor: help`, built the same way.

Tip copy: 3 to 8 short lines, starting with what it does and ending with *why*.

## Buttons

Game button (all themes, put it on `:where()` so it never fights other selectors):
```css
:where(button, .btn) { transition: transform .14s ease, box-shadow .14s ease, filter .14s ease; }
@media (prefers-reduced-motion: no-preference) {
  :where(button, .btn):not(:disabled):hover  { transform: translateY(-2px); filter: brightness(1.06); }
  :where(button, .btn):not(:disabled):active { transform: translateY(1px);  filter: brightness(.97); } }
```
Glass button: white or orange fill, `2px solid var(--ink)`, 12px radius, 700 weight, `box-shadow: 0 3px 0 rgb(16 70 100 / 30%), 0 6px 14px rgb(16 70 100 / 14%)`, min-height 44px.

Apron primary `.go`: yellow fill, dark text, `800 18px Anybody`, `font-stretch: 110%`, uppercase, radius 4, padding `13px 24px`, `:disabled { opacity: .35; cursor: not-allowed }`. Secondary `.btn`: transparent, `2px solid #ffffff40`, `700 13px` mono, `.08em`, uppercase. On hover the border and text turn yellow.

Split button with a menu that opens upward (for a primary action near the bottom of the hero):
```html
<div class="play"><button id="playBtn"><span>▶ Play sample</span><small>See how it works in operation</small></button>
  <button class="caret" aria-label="Choose a sample" aria-expanded="false">▾</button><div class="menu" id="menu"></div></div>
```
```css
.play { display: inline-flex; border: 2px solid var(--accent); border-radius: 6px; position: relative; }
.play > button { background: var(--accent); color: var(--accent-ink); border: 0; font: 800 19px var(--display); padding: 14px 22px; text-align: left; }
.play > button small { display: block; font: 500 12px var(--mono); }
.play .caret { border-left: 2px solid var(--accent-ink); padding: 0 16px; }
.menu { position: absolute; bottom: calc(100% + 8px); left: 0; width: 340px; background: var(--surface-2); border: 1px solid #ffffff30;
  border-radius: 6px; padding: 6px; display: none; z-index: 100; box-shadow: 0 10px 30px #000a; }
.menu.open { display: block; }
.menu button { display: grid; grid-template-columns: 40px 1fr; gap: 10px; width: 100%; padding: 8px 10px; border-radius: 4px; text-align: left; }
```
Toggle `.open` on the caret (with `stopPropagation`), close on a document click and on Escape, update `aria-expanded`.

## Kind chips and agent labels

```html
<div class="alab" style="left:11%;top:55%"><b>Agent</b> Pilot <span class="i" tabindex="0" data-tip="...">i</span></div>
<div class="alab code" style="left:84%;top:69%"><b>Code</b> Safety rules</div>
```
```css
.alab { position: absolute; transform: translateX(-50%); padding: 5px 10px; background: var(--surface); border: 2px solid var(--ink-muted);
  border-radius: 4px; font: 800 14px var(--display); text-transform: uppercase; z-index: 5; white-space: nowrap; }
.alab b { font: 700 10px var(--mono); letter-spacing: .1em; background: var(--accent-2); color: var(--accent-2-ink); padding: 2px 5px;
  border-radius: 2px; margin-right: 6px; vertical-align: 2px; }
.alab.code b { background: var(--accent); } .alab.you b { background: var(--ink); color: var(--bg); }
```
Small glyphs when there's no room for a sprite: 22px, a mono letter, and a different shape per actor (`border-radius: 3px` square, `50%` circle, `clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)` hexagon).

## Step header and explain strip

```html
<div class="step" id="st1"><span class="n">1</span><h3>Fill your fridge</h3><button type="button" class="i" aria-label="About stage 1" aria-describedby="tip-st1" data-tip="...">i</button></div>
<div class="explain"><span>You tick what's in the fridge</span><i>→</i><span>The Chef reads the list</span><i>→</i><span>Fewer things to buy</span></div>
```
```css
.step { display: flex; align-items: center; gap: 12px; margin: 26px 0 12px; scroll-margin-top: 76px; }
.step .n { display: grid; place-items: center; width: 34px; height: 34px; background: var(--accent); color: var(--accent-ink);
  font: 800 18px var(--mono); border-radius: 4px; }
.step h3 { margin: 0; font: 800 24px var(--display); text-transform: uppercase; }
.explain { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 12px; }
.explain span { padding: 6px 10px; background: var(--surface-2); border-radius: 4px; font-size: 14px; }
.explain i { font-style: normal; font-weight: 900; color: var(--accent); }
```
Glass version: a frosted plate with a teal "Stage n" pill (`border-radius: 999px; background: var(--teal-dark); color: #fff; font-weight: 800`), the title in the body font at 800, and an emoji-led one-line description.

## Pills, chips, meters

```css
.pill { display: inline-block; font: 700 11px var(--mono); padding: 3px 8px; border-radius: 3px; white-space: nowrap; }
.pill.ok { background: var(--ok); color: #10291a; } .pill.bad { background: var(--bad); color: #fff; }
.pill.amb { background: var(--accent); color: #241e00; } .pill.q { background: #ffffff14; color: var(--ink-muted); }
```
Always pair a mark with the word: `✓ Accepted`, `✕ Ignored`, `? Unclear`, `… Reading`.

Fixed-width category chips line up in table columns: `.dept { width: 122px; display: inline-flex; gap: 6px; padding: 3px 9px 3px 4px; border-radius: 4px; font: 800 12px var(--display); text-transform: uppercase; color: var(--accent-ink); white-space: nowrap; overflow: hidden; }` with an 18px icon tile (`background: #ffffffb0; border-radius: 3px`). Give the legend row the same fixed width per chip.

Confidence meter with a threshold tick:
```html
<span class="meter"><i class="hi" style="width:84%"></i><b style="left:60%"></b></span><span class="mono">84%</span>
```
```css
.meter { position: relative; display: inline-block; width: 64px; height: 8px; background: #ffffff14; border-radius: 4px; margin-right: 8px; vertical-align: middle; }
.meter i { position: absolute; inset: 0 auto 0 0; border-radius: 4px; } .meter i.hi { background: var(--ok); } .meter i.lo { background: var(--accent); }
.meter b { position: absolute; top: -3px; bottom: -3px; width: 2px; background: var(--ink); }
```
Glass segmented meter: `repeating-linear-gradient(90deg, transparent 0 calc(10% - 2px), var(--ink) calc(10% - 2px) 10%)`.

## KPI tiles and fact chips

```html
<div class="kpis"><div class="kpi good"><small>Taxi fuel saved</small><b>1,384 kg</b><span>4,373 kg CO₂, estimate</span></div> ...</div>
```
```css
.kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.kpi { padding: 8px 12px; background: var(--surface-2); border-radius: 6px; border-top: 3px solid #ffffff25; display: flex; flex-direction: column; gap: 2px; }
.kpi small { font: 700 10px var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--ink-muted); }
.kpi b { font: 900 22px var(--display); color: var(--ink); }
.kpi span { font-size: 11.5px; color: #b9bbc0; }
.kpi.good { border-top-color: var(--ok); } .kpi.bad { border-top-color: var(--bad); }
```
A dashboard row under the tiles: `grid-template-columns: 1.25fr 1.25fr .8fr` (chart, chart, small stacked bars). Size SVG charts to their real pixel width (measure the container) so text doesn't scale up.

## Charts

Hand-built SVG, no library, sized from the container:
- A line chart has three gridlines (0, half, max), mono axis labels, `stroke-width: 2` lines, end-of-line direct labels ("Before", "After") nudged apart if they collide, plus a small legend. A transparent hit `<rect>` over the plot moves a vertical crosshair, two ringed dots and an HTML tooltip.
- A dumbbell chart has one thin row per item, with a grey connector between a before dot and an after dot, sorted by improvement. Each row is a hover target and clickable.
- A stacked bar is plain HTML flex, `display: flex; gap: 2px; height: 16px; border-radius: 4px; overflow: hidden` with `<span style="flex:N; background:C">`, plus a legend of swatch, label and bold count.
- Dots get a 2px ring in the card colour so they lift off lines. The chart tooltip is dark, with a `1px #ffffff30` border, a bold mono title and rows of swatch + label + right-aligned mono value.
- Text stays in ink colours, never in the series colour. Use the checked palette in `references/themes.md`.

## Dialog

Use native `<dialog>`: Escape, focus trap and backdrop come free. Close on backdrop click, return focus to the opener. The card radius is 22px (Glass), or 8px with a `2px solid var(--accent)` border (Apron). The header strip has an icon tile, the title and a Close pill (`Close ✕`). Entrance `pop-in .18s`. On phones make it a near full-width sheet (`calc(100vw - .75rem)`, `94dvh`).

## Chat box

A game-style chat inside a scene that opens the full transcript:
```css
.chat { position: absolute; left: 10px; bottom: 10px; width: min(62%, 420px); height: 128px; background: #0b0c0dcc; border: 1px solid #ffffff22;
  border-radius: 4px; display: flex; flex-direction: column; cursor: pointer; }
.chat-h { display: flex; justify-content: space-between; padding: 4px 8px; font: 700 10px var(--mono); text-transform: uppercase; color: var(--ink-muted); }
.chat-lines { flex: 1; overflow-y: auto; padding: 4px 8px; font: 500 12.5px/1.45 var(--body); color: #e8e6e0; }
.cl { text-shadow: 0 1px 0 #000; animation: clin .25s ease-out; }
@keyframes clin { from { opacity: 0; transform: translateY(4px); } }
```
Lines read `<b style="color: actor colour">Chef</b> <i>suggests:</i> text`. The box is `role="button" tabindex="0"` with Enter and Space opening a transcript `<dialog>`. Transcript bubbles: square top-left corner pointing at the speaker's glyph (`border-radius: 0 8px 8px 8px`), 3px left border in the actor colour.

## Rule rows

```css
.rgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.rule { display: grid; grid-template-columns: 68px 1fr; gap: 8px; padding: 6px 8px; background: var(--surface-2); border-radius: 4px;
  font-size: 13px; line-height: 1.3; border-left: 3px solid #ffffff20; transition: background .2s, border-color .2s; }
.rule .mono { font-size: 11px; color: var(--accent); }
.rule.hit { background: #ff5a4e30; border-left-color: var(--bad); } .rule.hit .mono { color: var(--bad); }
```
Rule ID first in mono, then a plain-English sentence. Add `.hit` from JS when a rule blocks something.

## Connectors

Dashed elbow connectors that flow between stages, drawn from gradients so they animate cheaply:
```css
.feed i { position: absolute; display: block; animation: flowd .7s linear infinite; }
.feed .v { width: 4px; background-image: linear-gradient(var(--accent) 50%, transparent 50%); background-size: 4px 12px; }
.feed .h { height: 4px; background-image: linear-gradient(90deg, transparent 50%, var(--accent) 50%); background-size: 12px 4px; animation-name: flowh; }
@keyframes flowd { to { background-position: 0 12px; } } @keyframes flowh { to { background-position: 12px 0; } }
```
End with a CSS triangle arrowhead and a tiny mono label ("rules feed the agents"). Make sure the arrow lands inside the target panel and that no label sits on top of it.

## Loading screen and runway lights

A full-screen loader that shows immediately on click. Inject it from JS so it doesn't wait for the server:
```css
.load { position: fixed; inset: 0; z-index: 9999; background: var(--bg); display: flex; align-items: center; justify-content: center; }
.load-rwy { --w: min(560px, 90vw); position: relative; height: 44px; width: var(--w); border-radius: 4px; overflow: hidden;
  background: linear-gradient(#ffffffaa, #ffffffaa) 0 21px / 100% 2px no-repeat, #0b0c0d; }
/* slide the lights as one layer one dot-step wide: seamless, and nothing repaints */
.load-rwy::before { content: ""; position: absolute; top: 0; bottom: 0; left: -26px; width: calc(100% + 26px); animation: lights .6s linear infinite;
  background: radial-gradient(circle, #ffd400 0 3px, transparent 4px) 0 4px / 26px 10px repeat-x,
              radial-gradient(circle, #ffd400 0 3px, transparent 4px) 0 34px / 26px 10px repeat-x; }
@keyframes lights { to { transform: translateX(26px); } }
.load-plane { position: absolute; top: 4px; left: 0; font-size: 30px; transform: translateX(-40px); animation: taxi 2.2s cubic-bezier(.5,0,.4,1) infinite; text-shadow: -10px 0 14px #ff6b1a; }
@keyframes taxi { to { transform: translateX(calc(var(--w) + 10px)); } }
@media (prefers-reduced-motion: reduce) { .load-rwy::before, .load-plane { animation: none; } }
```
Above the runway: brand, a mono "Loading" label, the destination in huge display type, and one plain line saying what's loading. The same dotted-gradient trick makes edge lights down both sides of the viewport (`position: fixed; width: 12px; background: radial-gradient(...) 0 0 / 12px 40px`).

## Toggle switch

Build it on native radios (a `radiogroup` of two) so arrow keys and screen readers work: a 56 × 30 track with a 2px ink border, the knob sliding `transform .18s`, and the chosen label underlined so colour isn't the only cue. A simpler on/off pill: a 34 × 18 knob, grey off, green on, with the text "on"/"off" next to it.

## Footer

A panel with a 4px accent top border, a grid `1.4fr 1fr 1fr 1fr` (brand and one-line blurb, Data, Built with, Project), mono uppercase `h5` headings in `--dim`, links in the accent colour, and a bottom row with `© year Name`. Collapse to one column under 1100px.
