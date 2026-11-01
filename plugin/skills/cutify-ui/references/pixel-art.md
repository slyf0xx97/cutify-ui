# Pixel art

Characters and icons are drawn as tiny grids and rendered as crisp SVG, so they stay sharp at any size, need no image files and can be recoloured with CSS.

## Contents
- Sprites from string grids (plain HTML and React)
- Pixel icons from rectangle arrays
- Sprite sheets (PNG)
- Designing a cast
- Idle behaviours

## Sprites from string grids

A sprite is 16 rows of 16 characters. Each character is a palette key, and `.` is empty. `assets/pixel-sprites.js` turns a set of grids into `<symbol>`s you can `<use>` anywhere:

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs id="pixdefs"></defs></svg>
<script src="pixel-sprites.js"></script>
<script>
  pixelSprites({
    palette: { k: '#16171a', b: '#6aa8ff', w: '#cfe3ff', g: '#5b6472', r: '#ff5a4e' },
    sprites: { tower: [ '.......rr.......', '.......kk.......', /* ...16 rows */ ] },
    animate: { r: 'px-blink' }            // palette key → class on those pixels
  });
</script>
<svg class="sprite" viewBox="0 0 16 16" role="img" aria-label="Control tower"><use href="#tower"/></svg>
```
```css
.sprite { width: 96px; height: 96px; image-rendering: pixelated; }
```

Why it works:
- Each pixel is a `<rect>` 1.02 wide, not 1.0, so no hairline seams show between pixels when scaled. If faint lines still appear while a sprite moves by fractions of a pixel, raise it to 1.1 or move the sprite in whole steps.
- `shape-rendering="crispEdges"` on the symbol keeps edges hard.
- Palette keys can carry classes, so one letter can blink (a beacon) or wave (a wand) with CSS alone. Use `steps()` timing so it moves in frames.

`assets/pixel-sprites.js` ships four example characters (tower, pilot, marshal, reader diamond) drawn for SkyQueue. Use them as models, and draw a new cast for each product.

In React, use `assets/react/PixelSprite.tsx`, which does the same from props.

## Pixel icons from rectangle arrays

For one-colour UI icons, store `[x, y, w, h]` rectangles and compile them into one path. The icon takes the text colour through `currentColor`.

```ts
type Rect = [x: number, y: number, w: number, h: number];
const path = (rects: Rect[]) => rects.map(([x, y, w, h]) => `M${x} ${y}h${w}v${h}h${-w}z`).join("");
const signals: Rect[] = [[1, 11, 2, 3], [5, 8, 2, 6], [9, 5, 2, 9], [13, 2, 2, 12]];
// <svg viewBox="0 0 16 16" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true"><path d={path(signals)}/></svg>
```
`assets/react/PixelIcon.tsx` has this with a starter set (signals, search, check, cross, gear, book, plug, compass). Line icons from a library (for example lucide-react, ISC licence) are fine for small UI glyphs like Info, Play, Pause and Check. Keep pixel icons for anything that belongs to the story.

## Sprite sheets (PNG)

When characters are drawn in an art tool, put them on one sheet in a grid and cut with CSS:
```css
.pixel-sprite { width: 5.5rem; height: 5.5rem; background: url('team.png') no-repeat; background-size: 200% 200%;
  image-rendering: pixelated; animation: bob 3.6s ease-in-out infinite; }
.sprite-a { background-position: left top; }      .sprite-b { background-position: right top; animation-delay: -.9s; }
.sprite-c { background-position: left bottom; animation-delay: -1.8s; } .sprite-d { background-position: right bottom; animation-delay: -2.7s; }
```
Inside SVG, crop the same sheet with a nested `<svg viewBox="x y w h">` around an `<image style="image-rendering:pixelated">`. Staggered negative delays stop the cast bobbing in sync.

## Designing a cast

- One sprite per actor the brief describes (the AI helpers, the user, a mascot). Two to four works best. Don't add actors to fill a scene.
- Give each a silhouette you can tell apart at 24px: a hat shape, a held prop (binoculars, clipboard, wands), a body shape. A non-person actor (a parser, a reader) can be an object, like a diamond or a scroll, so it reads as a tool.
- Outline every sprite with the same near-black (`#16171a`), then two or three fills. Keep one accent pixel group for animation.
- Pair each sprite with its theme colour and a geometric glyph (square, circle, hexagon via `clip-path`) for places too small for the sprite.
- Never put real brand logos, airline liveries or agency marks on characters.

## Idle behaviours

Use stepped keyframes so the motion matches the art:
```css
@keyframes px-bob   { 50% { transform: translateY(-1px); } }            /* inside the 16-unit viewBox */
@keyframes px-blink { 50% { opacity: .2; } }
@keyframes px-wave  { 50% { transform: translateY(-2px); } }
.px-blink { animation: px-blink 1.2s steps(1) infinite; }
.px-wl    { animation: px-wave .5s steps(1) infinite; }
.px-wr    { animation: px-wave .5s steps(1) infinite reverse; }
.talking  { animation: hop .4s steps(2) infinite alternate; }          /* the one speaking or working */
.quiet    { opacity: .45; }                                            /* everyone else while one speaks */
@keyframes hop { to { transform: translateY(-5px); } }
```
Glass uses softer full-sprite motion instead: `bob` 3.6s ease-in-out at `translateY(-4px)`, a hop `translateY(-14px) scale(1.06)` on hover, and moods (walk, look, sit, sleep with a floating "z") for waiting states. Split motion across nested wrappers (one for position swaps, one for bob, one for hops) so transforms don't fight.
