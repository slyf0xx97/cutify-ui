# Themes

Six themes share one grammar. Glass and Apron come from shipped projects; Picnic, Riso Club, Lantern Night and Toy Box were designed from the reference survey in `docs/INSPIRATION.md`. Copy the matching file from `assets/` and build on its variables. To make a new theme, keep the variable *roles* and swap the values.

| Theme | Light/dark | Backdrop | Shadow language | Display voice | Suits |
|---|---|---|---|---|---|
| Glass | light | painted scene | frosted blur + soft sticker | Pixelify Sans | consumer apps, careers, learning, outdoors |
| Apron | dark | dot grid | hard sticker | Anybody, wide | operations, control rooms, data |
| Picnic | light | gingham + grain | soft offset, cocoa 25% | Fredoka | food, weekends, booking, family |
| Riso Club | light | newsprint + halftone | slipped pink/blue double offset | Bricolage Grotesque | events, zines, portfolios, launches |
| Lantern Night | dark | dusk sky, stars, dither skyline | warm glow, stepped pixel border | Jersey 10 | night, sleep, games, markets |
| Toy Box | light | graph paper + isometric floor | bottom ledge that presses | Dela Gothic One | kids, learning, building, progress |

Pick by the product's mood, then pick a backdrop from `references/backgrounds.md` that belongs to the product (a theme's default backdrop is a starting point, not a rule).

## Contents
- Glass (light)
- Apron (dark)
- Picnic (light)
- Riso Club (light)
- Lantern Night (dark)
- Toy Box (light)
- Palettes
- Fonts and privacy
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

## Picnic (light)

A cosy picnic: gingham under cream napkin cards, rounded Fredoka, jam-jar-lid numbers. File: `assets/picnic.css`.

- **Backdrop:** translucent red gingham over napkin cream, with riso grain at half strength.
- **Surfaces:** cream cards with 14px radius and a 2px cocoa border; an optional scalloped top edge.
- **Shadow:** a soft offset, `3px 4px 0 rgb(58 46 42 / .25)`. Softer than a sticker: a blanket, not a decal.
- **Signature:** stage numbers on round butter-yellow "jar lid" badges; tooltips as paper tags tied with a dotted string.
- **Type:** Fredoka 600 display, Nunito body, DM Mono for data.

| Variable | Value | Role |
|---|---|---|
| `--bg` | `#FFFDF8` | napkin |
| `--surface` / `--surface-2` | `#FFF4E0` / `#FFFFFF` | bread / cup |
| `--ink` / `--ink-muted` | `#3A2E2A` / `#6B5A52` | cocoa text (6.44:1 muted) |
| `--accent` | `#C2272D` | jam red, white text 5.80:1 |
| `--accent-2` | `#FFD86E` | butter, ink text 9.54:1 |
| `--ok` / `--bad` | `#3E7D48` / `#C2272D` | clover / jam |

Gingham red `#E5484D` is decoration only (3.85:1 on napkin).

## Riso Club (light)

A riso-printed zine: newsprint, flat white cards with sharp corners, and shadows that look like a slipped print plate. File: `assets/riso.css`.

- **Backdrop:** newsprint `#F6F1E7` with grain, and a pink halftone fading from the hero corner.
- **Surfaces:** flat white, 2px radius, 2px ink border.
- **Shadow:** misregistered double offset, `-3px -2px 0 #FF48B0, 4px 3px 0 #0078BF`. No blur.
- **Signature:** headings with a 2px blue ghost (`text-shadow: 2px 1px 0 rgb(0 120 191 / .55)`); big outlined stage numbers; pink over blue overlaps with `mix-blend-mode: multiply` turn purple.
- **Type:** Bricolage Grotesque 700 display, Rethink Sans body, Space Mono tags.

| Variable | Value | Role |
|---|---|---|
| `--bg` | `#F6F1E7` | newsprint |
| `--surface` / `--surface-2` | `#FFFFFF` / `#FFE800` | paper / riso yellow |
| `--ink` / `--ink-muted` | `#1D1D3B` / `#3D2E8C` | ink / overprint purple (9.48:1) |
| `--accent` | `#0078BF` | riso blue fill, white text 4.73:1 |
| `--accent-2` | `#FF48B0` | fluoro pink fill, ink text 5.27:1 |
| `--link` | `#3D2E8C` | riso blue is large-text only on newsprint (4.20:1) |

## Lantern Night (dark)

A night market in pixels: a dusk sky with stars, a dithered skyline, glowing lantern borders. File: `assets/lantern.css`.

- **Backdrop:** a dusk-to-night gradient with scattered stars, and a 1-bit dither band rising from the bottom like a skyline.
- **Surfaces:** awning-purple panels with no rounding and a 2px stepped pixel border; a string of lantern dots along the top.
- **Shadow:** a lantern glow, `0 0 0 2px #FF9F43, 0 0 24px rgb(255 159 67 / .25)`. This is the one theme where the light source replaces the hard offset.
- **Signature:** pixel lanterns above stage numbers that sway gently; the active stage's lantern lights up. Motion uses `steps()`.
- **Type:** Jersey 10 headings, Silkscreen tags, Lexend body, Sometype Mono data.

| Variable | Value | Role |
|---|---|---|
| `--bg` | `#14132B` | night |
| `--surface` / `--surface-2` | `#221F45` / `#2C2858` | awning / panel |
| `--ink` / `--ink-muted` | `#F7EBD9` / `#C9BBD9` | rice-paper text (8.59:1 muted on surface) |
| `--accent` | `#FF9F43` | lantern, night text 8.89:1 |
| `--accent-2` | `#2EC4A0` | jade, night text 8.22:1 |
| `--bad` | `#FF7A82` | readable red on surfaces (6.19:1) |

## Toy Box (light)

Plastic toys on graph paper: white cards, primary bricks, buttons with a ledge that presses down. File: `assets/toybox.css`.

- **Backdrop:** graph paper on a play-mat colour; an isometric floor under the hero character only.
- **Surfaces:** white cards, 18px radius, no border; brick chips with two small "studs" on top.
- **Shadow:** a ledge, `0 5px 0` in a darker shade of the surface, which collapses when pressed (`translateY(5px)`, ledge gone). It replaces the sticker offset.
- **Signature:** stage numbers as stacked bricks; each finished stage adds a brick to a little tower in the corner.
- **Type:** Dela Gothic One display, Outfit body, JetBrains Mono data.

| Variable | Value | Role |
|---|---|---|
| `--bg` | `#FAF7F0` | play mat |
| `--surface` | `#FFFFFF` | plastic |
| `--ink` / `--ink-muted` | `#1A1A1A` / `#4A4A4A` | text (8.28:1 muted) |
| `--accent` / ledge | `#2B59C3` / `#1C3D8C` | blue brick, white text 6.33:1 |
| `--accent-2` / ledge | `#FFC93C` / `#C99412` | yellow brick, ink text 11.33:1 |
| `--ok` / `--bad` | `#1F7A47` / `#C1121F` | dark green / dark red |

Red brick `#E63946` fails 4.5:1 with both white and black text; use it for big bold labels only, or use `#C1121F`.

---

## Palettes

Spare palettes for reskinning any theme. Ratios are WCAG 2.x contrast, calculated from the hex values.

| Palette | Colours | Text that passes 4.5:1 |
|---|---|---|
| Strawberry Milk | `#FFF1F3` `#FFFFFF` `#FFD6E0` `#FF8FAB` `#D6336C` `#B0245A` `#4A2030` `#7BC67E` | cocoa `#4A2030` and berry `#B0245A` on milk; cocoa on strawberry fills. Leaf and strawberry are decoration only |
| Matcha Latte | `#F3F1E4` `#FFFDF5` `#E6EBD0` `#8DB360` `#5E7F3A` `#3F5A2A` `#8B5E3C` `#2B2A22` | ink, deep tea and bean on foam; ink on matcha fills |
| Bubblegum Arcade (dark) | `#1E1B3A` `#2C2858` `#FF5FA2` `#3DE0FF` `#FFE45E` `#FFF6FB` | everything on the cabinet colour; cabinet colour as text on pink, cyan and yellow fills |
| Night Market (dark) | `#14132B` `#221F45` `#FF9F43` `#E8505B` `#FF7A82` `#2EC4A0` `#F7EBD9` | all on night; use `#FF7A82` for small red text on awning |
| Riso Blue / Pink | `#F6F1E7` `#FFFFFF` `#FFE800` `#FF48B0` `#D9258F` `#0078BF` `#3D2E8C` `#1D1D3B` | ink and purple on newsprint; riso blue only on white |
| Toy Primaries | `#FAF7F0` `#FFC93C` `#E63946` `#2B59C3` `#2A9D5C` `#C1121F` `#1F7A47` `#1A1A1A` | ink, blue, dark red, dark green on the mat; white on blue |
| Picnic Gingham | `#FFFDF8` `#FFF4E0` `#FFD86E` `#E5484D` `#C2272D` `#5DAA68` `#3E7D48` `#3A2E2A` | ink, jam red, clover on napkin; ink on butter |
| Sleepy Dusk (dark) | `#2B2545` `#3A3260` `#B8A6FF` `#FFB8A0` `#FFF3B0` `#F4F0FF` | every listed text colour on dusk and cloud; dusk as text on lavender and peach |

Common traps: riso blue (4.20:1), toy red (3.90:1) and gingham red (3.85:1) on their light backgrounds; white text on pink, cyan or yellow fills.

---

## Fonts and privacy

Both theme files load their fonts from Google Fonts with an `@import`, which is the quickest way to start. It also means every visitor's browser contacts Google's servers and shares its IP address. For sites with users in the EU, or anywhere you'd rather not involve a third party, self-host the fonts:

- **Next.js**: `next/font/google` downloads the fonts at build time and serves them from your own domain, so no request goes to Google at runtime.
- **Plain HTML**: download the `.woff2` files (for example from the google/fonts repository or a font helper tool), put them next to your CSS, declare them with `@font-face`, and delete the `@import` line.
- Every font used here is under the SIL Open Font License 1.1. When you bundle the files, keep each family's `OFL.txt` alongside them.

## Making a new theme

Start from the theme file closest in mood, keep its class names, and set the shared contract variables. Every recipe in `references/components.md` and `assets/react/cutify-react.css` reads these, so they must exist in every theme:

| Variable | Role | Glass | Apron | Picnic | Riso Club | Lantern Night | Toy Box |
|---|---|---|---|---|---|---|---|
| `--bg` | page | `#a9d8e8` + scene | `#121315` | `#FFFDF8` | `#F6F1E7` | `#14132B` | `#FAF7F0` |
| `--surface` | panels | frosted white | `#1b1c1f` | `#FFF4E0` | `#FFFFFF` | `#221F45` | `#FFFFFF` |
| `--surface-2` | raised cards, tips | `#d9f0fb` | `#232428` | `#FFFFFF` | `#FFE800` | `#2C2858` | `#F3EFE5` |
| `--ink` / `--ink-muted` | text | `#1f2430` / `#3a4955` | `#f2f0ea` / `#8d9097` | `#3A2E2A` / `#6B5A52` | `#1D1D3B` / `#3D2E8C` | `#F7EBD9` / `#C9BBD9` | `#1A1A1A` / `#4A4A4A` |
| `--accent` / `--accent-ink` | actions, numbers, focus | orange / ink | yellow / dark | jam red / white | riso blue / white | lantern / night | blue / white |
| `--accent-2` / `--accent-2-ink` | second accent | lime / ink | hi-vis orange / dark | butter / cocoa | fluoro pink / ink | jade / night | yellow / ink |
| `--ok` / `--bad` | status | `#1f7a4d` / `#c93a25` | `#5ccf8a` / `#ff5a4e` | `#3E7D48` / `#C2272D` | `#1F7A47` / `#C1121F` | `#2EC4A0` / `#FF7A82` | `#1F7A47` / `#C1121F` |
| `--display` / `--body` / `--mono` | type | Pixelify Sans / Atkinson / Atkinson | Anybody / Anybody / Spline Sans Mono | Fredoka / Nunito / DM Mono | Bricolage / Rethink Sans / Space Mono | Jersey 10 / Lexend / Sometype Mono | Dela Gothic One / Outfit / JetBrains Mono |

Then decide the theme's depth (sticker offset, blanket offset, print plate, glow or ledge) and its signature detail (how stage numbers look, how tooltips look). Check every text/background pair for 4.5:1 contrast after swapping.
