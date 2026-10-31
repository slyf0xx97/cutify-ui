# Motion

Motion in cutify-ui shows what the product does. Each animation should answer "what just happened?" or "where does this go next?". Ambient loops are small and slow.

## Contents
- Rules
- Keyframe catalogue
- Signature: a vehicle following a real path (offset-path)
- Engine 1: scripted story with cancellable sleeps
- Engine 2: simulation clock with requestAnimationFrame
- Engine 3: hand-offs with the Web Animations API
- Engine 4: scroll-linked journey
- Engine 5: route with stops (getPointAtLength)
- Off-screen pause and reduced motion

---

## Rules

- Animate only `transform` and `opacity` (and `offset-distance`, `stroke-dashoffset`, `background-position` on small elements). Never animate layout.
- Pixel things use `steps(n)` timing so they move in frames. Vector scenery and UI use eases: entrances `cubic-bezier(.2, .8, .2, 1)`, springy sprites `cubic-bezier(.34, 1.56, .64, 1)`, travel `cubic-bezier(.5, 0, .3, 1)`.
- Gate animations behind `@media (prefers-reduced-motion: no-preference)` and keep a global kill switch:
```css
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; } }
```
- In JS, read `matchMedia('(prefers-reduced-motion: reduce)').matches` and snap to end states (cap waits at about 120ms, skip flights, place sprites directly).
- Pause loops when off screen (see the end of this file).
- Nothing flashes faster than three times a second.

## Keyframe catalogue

| Name | What | Timing |
|---|---|---|
| `reveal` | Entrance: `from { opacity: 0; transform: translateX(-24px) }` | `.8s ease-out forwards`, stagger `.15s` steps via inline `animation-delay` |
| `fade-up` | Card entrance from 14px below | `.45 to .55s` |
| `pop-in` | Dialog: `translateY(10px) scale(.98)` → none | `.18s ease-out` |
| `tip-in` | Tooltip: 4px rise | `.15s ease-out` |
| `bob` | Sprite idle `translateY(-4px)` | `3.6s ease-in-out infinite`, staggered negative delays |
| `hop` | Speaker hops 5px | `.4s steps(2) infinite alternate` |
| `px-blink` | Beacon pixel | `1.2s steps(1) infinite` |
| `live` | Pulse ring `box-shadow 0 0 0 0 c → 0 0 0 12px transparent` | `1.6s infinite` |
| `march` | Dashed path flow `stroke-dashoffset: -52` | `1.6s linear infinite` |
| `draw` | Arrow draws in: `pathLength="1"`, `stroke-dasharray: 1 1`, offset 1 → 0 | `1.6s ease-out both` |
| `flow` | Connector dashes from `background-image` gradients, moving `background-position` 12px | `.7s linear infinite` |
| `shake` | Rejected shield / gate | `.5s` once |
| `stamp` | Verdict stamp `scale(2.2) → 1` | `.22s cubic-bezier(.5, 1.8, .6, 1)` |
| `drift` | Clouds: one tiled layer `translate3d(-1100px, 0, 0)` | `160s linear infinite` |
| `lights` | Runway lights: dotted gradients scroll `background-position` | `.6 to 1.1s linear infinite` |

Button feel (all themes): hover `translateY(-2px)` with a bigger hard shadow, active `translateY(1px)` with a smaller one, `.14s ease`. Put it on `:where(button, .btn)` so specificity stays zero.

## Signature: a vehicle following a real path

Draw the route once, then move a sprite along the same path with CSS. The planes in SkyQueue taxi down the drawn taxiway, turn onto the runway and take off.

```css
.fly { offset-path: path('M150 240 C150 400 190 440 330 440 L540 440 C566 440 574 462 574 490 L574 548 L70 548');
  offset-rotate: auto 90deg;            /* the art points up (-y); turn it to face along the path */
  animation: fly 9s linear infinite; opacity: 0; }
.fly.second { animation-delay: 4.5s; }  /* half a cycle apart so two never meet */
@keyframes fly {
  0% { offset-distance: 0%; opacity: 0; transform: scale(1); } 4% { opacity: 1; }
  62% { offset-distance: 62%; transform: scale(1); animation-timing-function: ease-in; }
  90% { offset-distance: 100%; transform: scale(1.2); opacity: 1; }
  95%, 100% { offset-distance: 100%; opacity: 0; transform: scale(1.2); } }
```
Put the moving layer in a second SVG with the same `viewBox` on top of the scene, so path coordinates line up with what's drawn. Keep the path's last segment and the largest scale inside the scene box, or the sprite will overlap the panel border. Add a blurred coloured ellipse behind the vehicle for exhaust or a glow.

Any product can use this: a parcel along a delivery route, a document along a pipeline, a character along a trail.

## Engine 1: scripted story with cancellable sleeps

For a "Play sample" that walks through stages in order. Each run bumps an id; every `await` checks it, so pressing Play again cancels the old run cleanly.
```js
let timers = [], runId = 0;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = ms => new Promise(r => timers.push(setTimeout(r, reduced ? Math.min(ms, 120) : ms)));
async function play() {
  timers.forEach(clearTimeout); timers = []; const id = ++runId;
  document.getElementById('st1').scrollIntoView({ behavior: 'smooth', block: 'start' });
  await sleep(300); await stageOne(id); if (id !== runId) return;
  await sleep(400); document.getElementById('st2').scrollIntoView({ behavior: 'smooth' });
  await sleep(600); await stageTwo(id); if (id !== runId) return;
}
```

## Engine 2: simulation clock with requestAnimationFrame

For things that move continuously from data (vehicles, queues, workers). Keep a sim time `t`, compute each object's target from a pure function `place(obj, t)`, and ease toward it.
```js
let t = 0, last = performance.now(), playing = true;
function frame(now) {
  const dt = Math.min(1, (now - last) / 1000); last = now;
  if (playing) { t += dt * SPEED; if (t > END) t = START; }      // loops
  for (const s of sprites) {
    const p = place(s, t);                                        // pure: time → {x, y, rot, state}
    s.x += (p.x - s.x) * .25; s.y += (p.y - s.y) * .25;           // ease 25% per frame
    s.el.setAttribute('transform', `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${p.rot})`);
    s.el.dataset.state = p.state;                                 // CSS shows rings, glows, labels per state
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```
Add a spacing pass so objects in a queue never overlap (sort by position, clamp each to `ahead - gap`). Show a before/after pair side by side with the same clock to make the improvement visible.

## Engine 3: hand-offs with the Web Animations API

To fly an item (a note, a packet) from one character to another in an arc, with pixel-stepped easing:
```js
paper.animate([
  { transform: `translate(${sx}px,${sy}px) scale(.6) rotate(-8deg)`, opacity: 0, easing: 'steps(3)' },
  { transform: `translate(${sx}px,${sy}px) scale(1) rotate(-8deg)`, opacity: 1, offset: .12, easing: 'steps(8)' },
  { transform: `translate(${mx}px,${my}px) scale(1.1) rotate(6deg)`, opacity: 1, offset: .55, easing: 'steps(8)' },
  { transform: `translate(${ex}px,${ey}px) scale(1)`, opacity: 1, offset: .92 },
  { transform: `translate(${ex}px,${ey}px) scale(.8)`, opacity: 0 }], { duration: 520, fill: 'both' });
receiver.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18) rotate(-4deg)' }, { transform: 'scale(1)' }],
  { duration: 260, delay: 440, easing: 'steps(4)' });
```
The arc midpoint is `my = Math.min(sy, ey) - 50`. For simpler moves (a packet between seats), set `left`/`top` and let `transition: left .7s cubic-bezier(.5,0,.3,1), top .7s ...` animate it.

## Engine 4: scroll-linked journey

A landscape strip fixed to the bottom of the screen where the cast walks a trail as the visitor scrolls. Build the trail path, sample it once into a lookup table, then ease each sprite toward its target every frame with a slight lag per follower so the party strings out.
```ts
// climbs, with a wiggle that dies out at both ends
const y = y0 + (y1 - y0) * Math.pow(t, 1.3) + amp * Math.sin(t * Math.PI * 2 * waves) * Math.sin(t * Math.PI);
// per frame, frame-rate independent
cur[k] = c + (target - c) * (1 - Math.pow(1 - SMOOTH * (1 - LAG * k), dt));   // SMOOTH .12, LAG .1
el.style.transform = `translate3d(${x}px, ${yy - lift}px, 0) rotate(${tilt}deg)`;
```
Scroll handlers only queue a frame; read layout on resize, never on scroll. Draw the walked part with `stroke-dashoffset`. Hide the strip over the hero.

## Engine 5: route with stops

For a vertical "How it works" route: a path runs down beside numbered cards and a token moves with `path.getPointAtLength(d)` at about 160px/s, stops 1.5s at each card (card gets `.on`), marks passed cards `.done`, then loops. Offer Pause and Reset buttons. Re-lay the path with a `ResizeObserver`. For a map built in SVG, a single SMIL clock (`<animateMotion calcMode="spline">`) also works; pause it with `svg.pauseAnimations()` off screen and don't mount it under reduced motion.

## Off-screen pause and reduced motion

```js
const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-off', !e.isIntersecting)),
  { rootMargin: '100% 0px' });
document.querySelectorAll('.hero, .stage, #how').forEach(el => io.observe(el));
```
```css
.is-off, .is-off *, .is-off *::before, .is-off *::after { animation-play-state: paused !important; }
```
Stop rAF loops too when their section is off screen. Under reduced motion, show the final state of every animation, keep Play/Reset controls but disable them with a `title` explaining why.
