# Backgrounds

The backdrop sets the mood before any word is read, so pick one for the product, never by default. Two pages from the same skill should not share a backdrop unless they belong to the same product.

Every recipe here is pure CSS or a small inline SVG, with no image files. Colours use theme variables (`--bg`, `--ink`) where possible. Keep patterns low-contrast behind text, or put text on a solid surface card. Put busy patterns on a pseudo-element so they can fade or sit behind content.

## Contents
- How to choose
- Paper and print: notebook, graph paper, riso grain, halftone
- Fabric and surfaces: gingham, checkerboard, terrazzo
- Soft and sky: pastel blobs, cloud wallpaper, dusk with stars
- Playful: sticker scatter, confetti, wavy stripes
- Game and screen: dot grid, 1-bit dither, CRT scanlines, isometric floor
- Outdoor and story: painted scene, topographic lines
- Motion on backgrounds

## How to choose

| Product feels like... | Try |
|---|---|
| study, notes, journaling | notebook, graph paper |
| food, recipes, weekends, booking | gingham, checkerboard, terrazzo |
| zines, events, portfolios, launches | riso grain, halftone, confetti |
| wellbeing, AI chat, onboarding | pastel blobs, clouds |
| sleep, night, end-of-day | dusk with stars, Lantern Night theme |
| kids, toys, creative tools | sticker scatter, checkerboard, graph paper |
| operations, data, control rooms | dot grid, isometric floor, CRT panel |
| retro, handheld, arcade | 1-bit dither, CRT scanlines |
| journeys, outdoors, maps | painted scene, topographic lines |

Pair the backdrop with a surface that contrasts with it. A busy pattern needs plain cards, and a plain gradient can carry translucent or frosted cards.

## Paper and print

### Notebook (study, journaling)
```css
.bg-notebook { background:
  linear-gradient(90deg, transparent 63px, #F4A6A6 63px 65px, transparent 65px),
  repeating-linear-gradient(0deg, #CFE3F5 0 1px, transparent 1px 28px), #FFFEF9; }
```

### Graph paper (planners, data, layout)

It pairs with Toy Box:
```css
.bg-graph { background:
  linear-gradient(#0001 1px, transparent 1px) 0 0 / 20px 20px,
  linear-gradient(90deg, #0001 1px, transparent 1px) 0 0 / 20px 20px,
  linear-gradient(#0002 1px, transparent 1px) 0 0 / 100px 100px,
  linear-gradient(90deg, #0002 1px, transparent 1px) 0 0 / 100px 100px, #FBFAF5; }
```

### Riso grain (zines, editorial, events)

It adds warmth to any flat colour:
```css
.bg-riso { background:
  url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"),
  var(--bg, #F6F1E7); }
```

### Halftone fade (comic, launch, riso)

Put it on a pseudo-element behind the hero so only the dots fade:
```css
.hero::before { content: ""; position: absolute; inset: 0; z-index: -1;
  background: radial-gradient(circle, var(--dot, #FF48B0) 1.6px, transparent 2px) 0 0 / 10px 10px;
  mask-image: linear-gradient(160deg, #000 0%, transparent 70%); }
```

## Fabric and surfaces

### Gingham (food, picnics, weekend planners)

Overlapping translucent stripes make the darker squares:
```css
.bg-gingham { --c: rgb(229 72 77 / .22); background:
  repeating-linear-gradient(0deg, var(--c) 0 16px, transparent 16px 32px),
  repeating-linear-gradient(90deg, var(--c) 0 16px, transparent 16px 32px), var(--bg, #FFFDF8); }
```

### Checkerboard (toys, games, start/finish states)

At low contrast it reads as a tablecloth:
```css
.bg-checker { background: repeating-conic-gradient(#FFE3EC 0 25%, #FFF5F8 0 50%) 0 0 / 48px 48px; }
```

### Terrazzo (cafes, interiors, calm shops)

Odd tile sizes hide the repeat:
```css
.bg-terrazzo { background:
  radial-gradient(6px 4px at 12% 18%, #FF9F8A 99%, transparent), radial-gradient(4px 6px at 38% 72%, #8DB360 99%, transparent),
  radial-gradient(5px 3px at 66% 30%, #F2C14E 99%, transparent), radial-gradient(3px 5px at 82% 80%, #7A9CC6 99%, transparent),
  radial-gradient(4px 4px at 55% 52%, #2B2A22 99%, transparent), #F3EEE6;
  background-size: 180px 180px, 220px 220px, 200px 200px, 160px 160px, 240px 240px, auto; }
```

## Soft and sky

### Pastel blobs (wellbeing, AI chat, onboarding)

The soft opposite of stickers:
```css
.bg-blobs { background:
  radial-gradient(40% 50% at 15% 20%, #FFD6E0 0, transparent 70%),
  radial-gradient(35% 45% at 85% 15%, #D8F3DC 0, transparent 70%),
  radial-gradient(50% 50% at 70% 85%, #E0E7FF 0, transparent 70%), #FFFBF7; }
```

### Cloud wallpaper (kawaii, weather, travel, kids)

Two offset copies of one cloud make a staggered pattern:
```css
.bg-clouds { --cloud: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Cpath d='M40 90a22 22 0 0 1 4-43 30 30 0 0 1 56-8 24 24 0 0 1 40 18 18 18 0 0 1 0 33z' fill='%23fff'/%3E%3C/svg%3E");
  background: var(--cloud) 0 0 / 200px 120px, var(--cloud) 100px 60px / 200px 120px, #BFE6FF; }
```

### Dusk with stars (sleep, journaling, night modes)

Different tile sizes stop the stars lining up:
```css
.bg-dusk { background:
  radial-gradient(1.5px 1.5px at 20% 30%, #FFF3B0, transparent), radial-gradient(1px 1px at 70% 20%, #fff, transparent),
  radial-gradient(1.5px 1.5px at 40% 60%, #fff, transparent), radial-gradient(1px 1px at 85% 45%, #FFF3B0, transparent),
  linear-gradient(#2B2545 0%, #5B4B8A 55%, #FFB8A0 100%);
  background-size: 300px 300px, 260px 260px, 340px 340px, 280px 280px, 100% 100%; }
```

## Playful

### Sticker scatter (kids, creator tools, empty states, community)

Add a second copy offset by half a tile to break the repeat:
```css
.bg-stickers { background:
  url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cg stroke='%231A1A1A' stroke-width='2'%3E%3Ccircle cx='40' cy='50' r='14' fill='%23FFD86E'/%3E%3Cpath d='M160 30l8 16 18 3-13 12 3 18-16-9-16 9 3-18-13-12 18-3z' fill='%23FF8FAB'/%3E%3Crect x='150' y='150' width='30' height='30' rx='8' fill='%233DE0FF' transform='rotate(12 165 165)'/%3E%3Cpath d='M50 170q15-20 30 0t30 0' fill='none' stroke='%237BC67E' stroke-width='5' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E") 0 0 / 240px 240px,
  var(--bg, #FFFDF8); }
```

### Confetti (celebration, results, leaderboards)

It's static, so it doesn't distract:
```css
.bg-confetti { background:
  linear-gradient(35deg, transparent 46%, #FF5FA2 46% 54%, transparent 54%) 10px 20px / 60px 70px,
  linear-gradient(-50deg, transparent 46%, #3DE0FF 46% 54%, transparent 54%) 40px 5px / 80px 60px,
  radial-gradient(#FFE45E 3px, transparent 3.5px) 25px 45px / 70px 90px, #1E1B3A; }
```

### Wavy stripes (music, pools, calm progress screens)
```css
.bg-waves { background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='24'%3E%3Cpath d='M0 12q20-12 40 0t40 0' fill='none' stroke='%23B8A6FF' stroke-width='3'/%3E%3C/svg%3E") 0 0 / 80px 24px, #F7F4FF; }
```

## Game and screen

### Dot grid (operations, control rooms)

The Apron default:
```css
.bg-dots { background: radial-gradient(#ffffff08 1px, transparent 1.5px) 0 0/14px 14px, linear-gradient(135deg, #1e1f22, #161719); }
```

### 1-bit dither (handheld, retro, dark game pages)

This is a checker faded by a mask. A true ordered dither needs an SVG Bayer tile:
```css
.bg-dither::before { content: ""; position: absolute; inset: 0; z-index: -1;
  background: conic-gradient(var(--ink) 25%, transparent 0 50%, var(--ink) 0 75%, transparent 0) 0 0 / 4px 4px;
  mask-image: linear-gradient(transparent 20%, #000 100%); image-rendering: pixelated; }
```

### CRT scanlines (arcade, terminal, fake boot screens)

Use it on one "screen" panel, never behind body copy:
```css
.screen { background: repeating-linear-gradient(0deg, rgb(0 0 0 / .18) 0 1px, transparent 1px 3px),
  radial-gradient(ellipse at center, transparent 55%, rgb(0 0 0 / .45)), #151A2E; }
```

### Isometric floor (game-like dashboards, builders, logistics toys)
```css
.bg-iso { background:
  linear-gradient(30deg, #0000 49%, #0001 49% 51%, #0000 51%) 0 0 / 40px 23px,
  linear-gradient(150deg, #0000 49%, #0001 49% 51%, #0000 51%) 0 0 / 40px 23px, #F2F7F2; }
```

## Outdoor and story

### Painted scene (the Glass default)

A flat-vector SVG landscape on a fixed `body::before` (see `references/themes.md`). Draw a scene that belongs to the product: a window sill for a plant app, a kitchen for a recipe app, a street for an energy app.

### Topographic lines (hiking, maps, journeys)

Two ring centres interfere into contour-like shapes:
```css
.bg-topo { background:
  repeating-radial-gradient(circle at 30% 40%, transparent 0 18px, rgb(63 90 42 / .18) 18px 19.5px),
  repeating-radial-gradient(circle at 80% 75%, transparent 0 22px, rgb(63 90 42 / .12) 22px 23.5px), #F3F1E4; }
```

## Motion on backgrounds

Keep the backdrop calm and let one thing on the page move: the product at work. Backgrounds stay still by default. If one moves, it moves slowly (clouds drifting over 120s or more, blobs over 60s), uses `transform` on a layer instead of `background-position` on a large element, stops under `prefers-reduced-motion`, and pauses off screen.

Sources: these recipes were written for cutify-ui after the reference survey in `docs/INSPIRATION.md`. They use common, generic techniques, and no code was copied from the sites listed there.
