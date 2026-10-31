# Themes

Two shipped themes share one grammar. Copy the matching file from `assets/` (`glass.css` or `apron.css`) and build on its variables. To make a new theme, keep the variable *roles* and swap the values.

## Contents
- Glass (light)
- Apron (dark)
- Making a new theme

---

## Glass (light)

A sunny outdoor scene fixed behind the page, frosted white glass panels on top, pixel-game accents.

### Colour roles

| Variable | Value | Role |
|---|---|---|
| `--sky` / `--sky-soft` | `#8fd0f0` / `#d9f0fb` | Sky in scenes, page fallback, popup header strip |
| `--water` / `--water-deep` | `#3bb4d6` / `#1b86a8` | Rivers, selected-card ring, scrollbar thumb |
| `--grass`, `--leaf`, `--leaf-deep` | `#7cc65a`, `#3f9e57`, `#2d7d46` | Meadow fills, success |
| `--link` | `#0f6a88` | Links on glass (6:1 on white); hover goes coral |
| `--ink` / `--ink-soft` | `#1f2430` / `#3a4955` | All text and outlines on glass; focus ring |
| `--teal` / `--teal-dark` | `#1fa98a` / `#167a66` | "Stage n" pills, switch track. White text only on `--teal-dark` |
| `--orange` / `--orange-dark` | `#e8912d` / `#b9651a` | Primary buttons, tags, active tab. Ink text on orange |
| `--lime` | `#dbe86a` | Highlighter mark, number badges, walked trail |
| `--coral` | `#c93a25` | Gaps, errors, link hover |
| pastel softs | `--teal-soft #d7eff2`, `--mint-soft #dbf2e5`, `--coral-soft #fde4de`, `--yellow-soft #fcefc2` | One per character; status pills (mint done, yellow working, coral gap) |

Character hues for a four-member cast: teal `#8fd6df`, mint `#a8e2bd`, coral `#f6b5a6`, yellow `#f6d877`.

### Type
- Display: **Pixelify Sans** 600 for h1/h2, logo, badges, tooltip titles (`letter-spacing: .01em`). Fallback `"Trebuchet MS"`.
- Body: **Atkinson Hyperlegible** 400/700, 17px (`1.0625rem/1.6`), minimum 16px. Use it for nav tabs and small titles too, because the pixel font misreads at small sizes.
- Hero h1 `clamp(1.8rem, 3.2vw, 2.5rem)/1.1`; stage title `clamp(1.3rem, 2.3vw, 1.7rem)` 800 in the body font; tags `.78rem` 700 uppercase `.04em`.
- In Next.js load both with `next/font/google` (self-hosted, no runtime request). In plain HTML use the Google Fonts link in `assets/glass.css`.

### Surfaces
Glass recipe (top-level surfaces only):
```css
background: linear-gradient(145deg, rgb(255 255 255 / 94%), rgb(255 255 255 / 88%));
border: 1.5px solid rgb(255 255 255 / 85%);
border-radius: 18px;
box-shadow: 0 10px 30px rgb(16 70 100 / 18%), 0 0 0 1px rgb(31 36 48 / 14%), inset 0 1px 0 rgb(255 255 255 / 90%);
backdrop-filter: blur(14px) saturate(1.25);
```
Nested cards are flat translucent white (`rgb(255 255 255 / 78%)`) with no blur: a blur per card is the biggest scroll cost, and a blur over a frosted panel shows nothing. Add `@supports not (backdrop-filter: blur(1px))` fallbacks at 92 to 96% white.

Shadows are blue-tinted, never black: `rgb(16 70 100 / x)`. Interactive bits add a hard offset in ink: `0 2px 0 rgb(31 36 48 / 25%)`.

### Backdrop
A painted flat-vector SVG (mountains, meadow, clouds) on a fixed pseudo-element, because iOS ignores `background-attachment: fixed`:
```css
html { background: #a9d8e8; }
body::before { content: ""; position: fixed; inset: 0; height: 100lvh; z-index: -1; pointer-events: none;
  transform: translateZ(0); background: url('scenes/landscape.svg') center bottom / cover no-repeat, #a9d8e8; }
```
Each stage can carry its own sticky scene (`.stage::before { position: sticky; top: 0; height: 100svh; margin-bottom: -100svh; background: var(--stage-scene) center / cover; }`). Clouds drift as one tiled layer moved by `transform` (cheap) rather than `background-position` (repaints).

### Signature details
- Lime highlighter on one key phrase per line: `background: linear-gradient(transparent 55%, var(--lime) 55%, var(--lime) 92%, transparent 92%)`. Use lime, not red, on a hero word so nothing reads as an error.
- Number badges: lime, 4px radius, 2px ink border, `2px 2px 0` hard shadow, pixel font.
- Radii: 18px panels, 22px dialogs, 14px tooltips and icon tiles, 12px buttons, 999px pills, 4px badges and meters (deliberately boxy).
- Outdoor props as UI: a hanging wooden sign for a map title, wooden-plank scrollbars, a torch, a flag.

---

## Apron (dark)

Night airfield signage: a dark dot grid, yellow taxiway lines, hi-vis orange, chalk text.

### Colour roles

| Variable | Value | Role |
|---|---|---|
| `--bg` | `#121315` | Page background |
| `--panel` / `--panel-2` | `#1b1c1f` / `#232428` | Panels / raised cards, inputs, menus, KPI tiles |
| `--line` | `#ffd400` | Taxiway yellow. Accent: primary buttons, key words, active state, focus ring, step numbers, routes |
| `--vis` | `#ff6b1a` | Hi-vis orange. Tagline, **AI** chips, constraints, exhaust glow, backup path |
| `--chalk` | `#f2f0ea` | Main text; light fills (tooltips, bubbles, planes) |
| `--dim` | `#8d9097` | Secondary text and mono labels |
| `--ok` / `--bad` | `#5ccf8a` / `#ff5a4e` | Pass / fail |
| cast colours | `#6aa8ff` blue, `#b98cff` violet, `#ff9a4a` orange | One per actor |

Body grey `#cfd0d3`, sub-copy `#b9bbc0`. Dark text on bright fills `#1e1f22`. Hairlines are white with alpha: `#ffffff14` borders, `#ffffff22` dashed rules, `#ffffff40` button outlines. Tints are role colour plus alpha (`#ffd4001f`, `#5ccf8a22`).

### Type
- Display: **Anybody** (variable, width 50 to 150, weight 400 to 900) at 800 to 900 with `font-stretch: 105%` to `125%`, uppercase, for wide airport-signage titles. Hero h1 `900 112px/.86`, stretch 118%, `letter-spacing: -.02em`, second word in `--line`.
- Labels: **Spline Sans Mono** 500/700. The recurring pairing is a heavy wide title next to a tiny mono label: `500 12px`, `letter-spacing: .14em`, uppercase, `--dim`. Micro labels `700 10px`, `.1em`.
- Body: Anybody 400 to 600 at normal width, 14 to 19px.

### Surfaces
```css
.panel { background: radial-gradient(#ffffff08 1px, transparent 1.5px) 0 0/14px 14px, linear-gradient(135deg, #1e1f22, #161719);
  border: 1px solid #ffffff14; border-radius: 6px; }
```
A 14px grid of faint dots over a 135° gradient. Inner cards use flat `--panel-2` with no dots. Accent edges: `border-top: 3px solid <role>` on KPI tiles and forms, `border-left: 3px solid` on rule rows. The active-state ring is the same everywhere: `border-color: var(--line); box-shadow: 0 0 0 4px #ffd40022`.

Shadows are hard and blurless (`0 6px 0 #00000055`); soft shadows only on menus (`0 10px 30px #000a`) and modals. Glows: `filter: blur(4px)` on orange exhaust ellipses, `drop-shadow(0 0 6px #ffd400)` on lights.

Radii: 4px default (buttons, inputs, chips), 6px panels and tooltips, 8px hero and modal, 10px speech bubbles.

### Chart palette
Checked for colour-blind separation against `#232428`: before `#e04438`, after `#3f8ee6`; categories `#9b6be0`, `#a98a00`, `#d94f8a`. Use these in charts instead of `--bad`/`--ok`, and direct-label lines as well as giving a legend.

### Signature details
- Kind chips: AI = `--vis` orange, Code = `--line` yellow, You = `--chalk`, dark text on all three.
- Runway lights made only of CSS gradients (see `references/components.md`, loading screen).
- Dashed yellow connectors that flow (`3px dashed #ffd40055` or animated gradient dashes).
- Aviation micro-copy only when the product is about aviation. Otherwise borrow the *signage* feel (wide caps, mono codes) and keep the words plain.

---

## Making a new theme

Keep these roles and swap values:

| Role | Glass | Apron |
|---|---|---|
| page / backdrop | painted scene | `#121315` dot grid |
| surface | frosted white | `#1b1c1f` dots |
| raised card | translucent white | `#232428` |
| text / outline | `#1f2430` ink | `#f2f0ea` chalk |
| accent (actions, numbers, focus) | orange `#e8912d` + lime `#dbe86a` | yellow `#ffd400` |
| AI kind | teal or a cast colour | orange `#ff6b1a` |
| Code kind | ink outline | yellow `#ffd400` |
| You kind | orange | chalk |
| ok / bad | `#1f7a4d` / `#c93a25` | `#5ccf8a` / `#ff5a4e` |
| display font | Pixelify Sans | Anybody wide |
| label font | Atkinson Hyperlegible bold caps | Spline Sans Mono caps |
| hard shadow | `0 3px 0 rgb(16 70 100 / 30%)` | `0 6px 0 #00000055` |

Check every text/background pair for 4.5:1 contrast after swapping.
