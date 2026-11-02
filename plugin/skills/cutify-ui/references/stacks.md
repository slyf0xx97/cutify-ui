# Vue, Svelte, Astro and Tailwind

How to build cutify-ui pages in Vue 3, Svelte 5, Astro 5 and with Tailwind CSS v4. The themes, sprites and motion rules don't change. Only the wiring does. This file is a sibling of `react.md`, so read the React patterns there first if you want the long version of any idea below.

## Contents
- Choosing a stack
- Shared across all four
- Vue 3
- Svelte 5
- Astro 5
- Tailwind CSS v4

## Choosing a stack

- If the user names no stack, keep plain HTML (`assets/starter.html`).
- If the user names one, use it. React and Next.js are in `react.md`, Streamlit is in `streamlit.md`.
- If the user asks for "a cute page" inside an existing project, match the project's framework and styling.
- Tailwind is a styling layer, not a framework. It goes on top of any of the others or plain HTML, and only when the user asks for it or the project already has it.
- Astro suits a mostly static page (event, portfolio, landing) with a few interactions. Vue and Svelte suit a page that is mostly an app.

Checked against the official docs in November 2026: Vue 3.5, Svelte 5 (attachments need 5.29+, `$props.id()` needs 5.20+), SvelteKit, Astro (the docs now describe 6, and every feature used here works the same in 5.x), Tailwind CSS v4.

## Shared across all four

### Theme CSS

- Copy one `assets/<theme>.css` into the project as a plain `.css` file and import it once, at the root (see each stack). It holds the tokens as `:root` custom properties, the base classes (`.panel`, `.btn`, `.kind`, `.step`), the keyframes, the pixel classes (`.px-blink`, `.px-wl`, `.px-wr`), `.is-off` and the reduced-motion kill switch.
- Components read the tokens with `var(--accent)` and friends. Don't copy tokens into JS objects, and don't redeclare them inside a component.
- Never put theme CSS in a scoped `<style>`. Vue `scoped`, Svelte and Astro all rewrite selectors to match their own elements. Sprite pixels, keyframes and elements created from script would then lose their styles. Component-local `<style>` is only for that component's own layout.
- `assets/react/cutify-react.css` is plain CSS with no React in it. Copy it too and the class names `.word-tip`, `dialog.pop` and `.stage-header` work in every stack below.
- Each theme file starts with an `@import url(...)` for its Google Fonts. Keep it as the first line of the file. With Tailwind, move it to a `<link>` in the head (see the Tailwind section).

### Sprites

`assets/pixel-sprites.js` writes `<symbol>`s into one `<defs id="pixdefs">` and you `<use href="#ch-name">` them anywhere, so any component can draw any sprite. Two ways to get the symbols onto the page:

1. Runtime: copy the file to `public/` (Vite, Astro) or `static/` (SvelteKit), load it with a plain `<script src="/pixel-sprites.js"></script>` before the app script, and call it after mount. It touches `document`, so never call it during server rendering. Calling it twice is safe because it replaces symbols with the same id.
2. Build time: render the `<symbol>`s from the same grids in a component. Nothing runs in the browser, so it is SSR-safe and there is no flash of empty sprites. Use this in Astro and in any server-rendered Vue or Svelte app.

Both ways share two framework-free files:
```ts
// src/lib/sprite-rects.ts
export type Animate = Record<string, string | readonly [string, string]>;
export function spriteRects(grid: readonly string[], palette: Record<string, string>, animate: Animate = {}) {
  return grid.flatMap((row, y) => [...row].flatMap((ch, x) => {
    const fill = palette[ch];
    if (ch === "." || !fill) return [];
    const a = animate[ch];
    return [{ key: `${x}-${y}`, x, y, fill, cls: !a ? undefined : typeof a === "string" ? a : a[x < 8 ? 0 : 1] }];
  }));
}

// src/lib/sprites.ts (runtime route)
export type SpriteSet = { palette: Record<string, string>; sprites: Record<string, string[]>; animate?: Animate };
export const mountSprites = (set: SpriteSet) =>
  (window as unknown as { pixelSprites(s: SpriteSet): void }).pixelSprites(set);
```
`CAST` is a `SpriteSet` in `src/lib/cast.ts`. Draw your own cast (see `pixel-art.md`).

### Framework-free helpers

Two small modules carry the "Play sample" story and the off-screen pause. They are `motion.md` Engine 1 and the off-screen snippet, wrapped so each stack can start and stop them.
```ts
// src/lib/story.ts
export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
type Ctx = { sleep: (ms: number) => Promise<void>; live: () => boolean };
export function createStory() {
  let runId = 0, timers: number[] = [];
  const sleep = (ms: number) => new Promise<void>((r) => { timers.push(window.setTimeout(r, reducedMotion() ? Math.min(ms, 120) : ms)); });
  const cancel = () => { runId++; timers.forEach(clearTimeout); timers = []; };
  async function play(run: (ctx: Ctx) => Promise<void>) {
    cancel(); const id = runId;                       // pressing Play again cancels the old run
    await run({ sleep, live: () => id === runId });   // steps check live() after any await that isn't sleep
  }
  return { play, cancel };
}

// src/lib/offscreen.ts
export function pauseOffscreen(selector = ".hero, .stage, #how") {
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.target.classList.toggle("is-off", !e.isIntersecting)), { rootMargin: "100% 0px" });
  document.querySelectorAll(selector).forEach((el) => io.observe(el));
  return () => io.disconnect();
}
```
A section that mounts later (behind an `if`) needs `pauseOffscreen()` called again after it appears, or the `MutationObserver` from `assets/react/useOffscreenPause.ts`.

Use `story.play` like this. Scrolling honours reduced motion because the behaviour is chosen in JS:
```ts
story.play(async ({ sleep, live }) => {
  for (const id of ["st1", "st2", "st3"]) {
    if (!live()) return;
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
    await sleep(1400);
  }
});
```

### Hydration-safe motion

Wherever a page is server-rendered, render the still version first and start JS-driven motion (rAF loops, `story`, WAAPI) only after mount and only when `prefers-reduced-motion` is `no-preference`. CSS animations behind `@media` are already safe. Use each framework's stable id helper for tooltip ids (`useId` in Vue, `$props.id()` in Svelte), never `Math.random()`.

## Vue 3

Single-file components with `<script setup lang="ts">`, scaffolded with `npm create vue@latest` (Vite). Needs Vue 3.5 for `useTemplateRef`, `useId` and defaults in destructured props.

### Where things go

- `src/styles/glass.css` (the theme) and `cutify-react.css` imported once in `src/main.ts`, before `createApp`: `import "./styles/glass.css"`. Nothing global goes in `<style scoped>`.
- An SFC `<style scoped>` is fine for layout only. If a rule must reach a child component's root, use `:global(.x)` or `:deep(.x)`. Elements made by `v-html` or script don't get the scope attribute.
- Dynamic values in CSS: `color: v-bind(tone)` in a `<style>` block compiles to a custom property, so it still ends up as a token-style variable.
- Fonts: one `<link>` in `index.html`, or keep the theme's `@import`.

### Sprites

Runtime route, in the root component. Give the empty `<defs>` in the template so the first render matches the server:
```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue"
import { mountSprites } from "@/lib/sprites"
import { pauseOffscreen } from "@/lib/offscreen"
import { CAST } from "@/lib/cast"
let stop = () => {}
onMounted(() => { mountSprites(CAST); stop = pauseOffscreen() })
onUnmounted(() => stop())
</script>
<template>
  <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs id="pixdefs" /></svg>
  <RouterView />
</template>
```
Component route (server-safe, mirrors `PixelSprite.tsx`):
```vue
<script setup lang="ts">
import { computed } from "vue"
import { spriteRects, type Animate } from "@/lib/sprite-rects"
const { grid, palette, animate = {}, size = 96, label } =
  defineProps<{ grid: readonly string[]; palette: Record<string, string>; animate?: Animate; size?: number; label?: string }>()
const rects = computed(() => spriteRects(grid, palette, animate))
</script>
<template>
  <svg viewBox="0 0 16 16" :width="size" :height="size" shape-rendering="crispEdges" class="sprite"
    :role="label ? 'img' : undefined" :aria-label="label" :aria-hidden="label ? undefined : 'true'">
    <rect v-for="r in rects" :key="r.key" :x="r.x" :y="r.y" width="1.02" height="1.02" :fill="r.fill" :class="r.cls" />
  </svg>
</template>
```

### Patterns

Native `<dialog>` with a template ref (Escape, focus trap and backdrop are native, as in `Popup.tsx`):
```vue
<script setup lang="ts">
import { useId, useTemplateRef, watch } from "vue"
const props = defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ close: [] }>()
const dlg = useTemplateRef<HTMLDialogElement>("dlg")
const titleId = useId()
watch(() => props.open, (open) => {
  const d = dlg.value
  if (open && d && !d.open) d.showModal()
  else if (!open && d?.open) d.close()
})
</script>
<template>
  <dialog ref="dlg" class="pop" :aria-labelledby="titleId" @close="emit('close')" @click.self="emit('close')">
    <header class="pop-head">
      <h2 :id="titleId" class="pop-title">{{ title }}</h2>
      <button type="button" class="pop-close" @click="emit('close')">Close <span aria-hidden="true">✕</span></button>
    </header>
    <div class="pop-body"><slot /></div>
  </dialog>
</template>
```
Use it as `<Popup :open="legal" title="Legal" @close="legal = false">`. Escape fires the native `close` event, which updates the parent, so state and dialog stay in step.

Tooltip on the Popover API, using the classes from `cutify-react.css`. Copy `place()` (the fixed-position and flip maths) from `assets/react/WordTip.tsx` unchanged, because it only uses DOM APIs:
```vue
<script setup lang="ts">
import { nextTick, ref, useId, useTemplateRef } from "vue"
defineProps<{ word: string; label?: string; title: string }>()
const open = ref(false), id = useId()
const btn = useTemplateRef<HTMLButtonElement>("btn"), tip = useTemplateRef<HTMLElement>("tip")
async function show() {
  open.value = true; await nextTick()
  try { tip.value?.showPopover() } catch {}
  // place(btn.value, tip.value)
}
function hide() { open.value = false; try { tip.value?.hidePopover() } catch {} }
</script>
<template>
  <span class="word-tip-wrap" @pointerenter="(e) => e.pointerType === 'mouse' && show()" @pointerleave="hide">
    <button ref="btn" type="button" class="word-tip-word" :aria-label="label" :aria-describedby="id"
      @focus="show" @blur="hide" @keydown.esc="hide">{{ word }}</button>
    <div ref="tip" :id="id" class="word-tip" popover="manual" role="tooltip" :hidden="!open">
      <div class="word-tip-head">{{ title }}</div><div class="word-tip-body"><slot /></div>
    </div>
  </span>
</template>
```
The CSS-only tooltip in `components.md` also works as-is in a template (`data-tip`, `aria-describedby`), plus its small click-toggle script in `onMounted`.

"Play sample" with `createStory`, with the active stage as a ref so the template can add `.on` to it:
```ts
const story = createStory(), active = ref("")
onUnmounted(story.cancel)
const playSample = () => story.play(async ({ sleep, live }) => {
  for (const id of stages) { if (!live()) return; active.value = id; await sleep(1400) }
})
```
Vue's `<Transition>` runs on CSS classes, so the theme's reduced-motion kill switch already covers it. Give any `<TransitionGroup>` a stable `key`.

Hydration (Vite SSR or Nuxt): `onMounted` doesn't run on the server, so start rAF loops and `story` there. `<ClientOnly>` is Nuxt's, and `data-allow-mismatch` silences a known harmless mismatch. Prefer fixing the cause. In Nuxt the global stylesheet goes in `css: ["~/assets/css/main.css"]` in `nuxt.config.ts`.

### Avoid in Vue
- The Options API or `defineComponent` objects when the rest of the project uses `<script setup>`.
- Theme CSS in `<style scoped>`, or `<style>` blocks that restate tokens.
- `v-html` for sprite markup. Render rects with `v-for`.
- A `reactive` object per frame in an rAF loop. Write `el.style.transform` and keep the state in plain variables.
- Two `watch` calls that open and close the same dialog. One source of truth, the `open` prop.
- `Math.random()` or `Date.now()` in a template, which breaks hydration.

## Svelte 5

Runes only. Scaffold with `npm create vite@latest` (choose Svelte) for a plain SPA, or `npx sv create` for SvelteKit. SvelteKit is optional. Nothing below needs it.

### Where things go

- Import the theme once at the root. In SvelteKit that is `src/routes/+layout.svelte`: `import "../app.css"` in its `<script>`, with `let { children } = $props()` and `{@render children()}` below. In a Vite SPA it is `import "./app.css"` in `src/main.ts`. Put `@import "./glass.css"` in `app.css`.
- Svelte scopes every component `<style>`, and it scopes `@keyframes` too. A keyframe that other CSS references must be written `@keyframes -global-name`, or live in the global file. Use `:global(...)` or a `:global { ... }` block for the few rules that must leave a component.
- Tokens stay as custom properties. Pass a per-instance value with `style:--tone={tone}` and read it with `var(--tone)`.

### Sprites

Runtime route with an attachment (5.29+). It runs in the browser only, like an effect, and re-runs if its dependencies change:
```svelte
<!-- +layout.svelte -->
<script lang="ts">
  import { mountSprites } from "$lib/sprites";
  import { pauseOffscreen } from "$lib/offscreen";
  import { CAST } from "$lib/cast";
  let { children } = $props();
  $effect(() => pauseOffscreen());          // returns the teardown, so it cleans up
</script>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs id="pixdefs" {@attach () => mountSprites(CAST)} />
</svg>
{@render children()}
```
Before 5.29 use an action instead: `export const sprites = (_: SVGDefsElement, set: SpriteSet) => mountSprites(set)` and `<defs id="pixdefs" use:sprites={CAST} />`.

Component route (server-safe):
```svelte
<script lang="ts">
  import { spriteRects, type Animate } from "$lib/sprite-rects";
  let { grid, palette, animate = {}, size = 96, label }:
    { grid: readonly string[]; palette: Record<string, string>; animate?: Animate; size?: number; label?: string } = $props();
  const rects = $derived(spriteRects(grid, palette, animate));
</script>
<svg viewBox="0 0 16 16" width={size} height={size} shape-rendering="crispEdges" class="sprite"
  role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
  {#each rects as r (r.key)}<rect x={r.x} y={r.y} width="1.02" height="1.02" fill={r.fill} class={r.cls} />{/each}
</svg>
```
Classes on the rects (`px-blink`) come from the global theme file, so Svelte's scoping never touches them.

### Patterns

Native `<dialog>`. Svelte 5 has no `|self` modifier, so check the target. Event handlers are plain attributes:
```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  let { open = $bindable(false), title, children }: { open?: boolean; title: string; children: Snippet } = $props();
  const id = $props.id();
  let dlg: HTMLDialogElement | undefined = $state();
  $effect(() => {
    if (open && !dlg?.open) dlg?.showModal();
    else if (!open && dlg?.open) dlg.close();
  });
</script>
<dialog bind:this={dlg} class="pop" aria-labelledby={id} onclose={() => (open = false)}
  onclick={(e) => { if (e.target === dlg) open = false; }}>
  <header class="pop-head">
    <h2 {id} class="pop-title">{title}</h2>
    <button type="button" class="pop-close" onclick={() => (open = false)}>Close <span aria-hidden="true">✕</span></button>
  </header>
  <div class="pop-body">{@render children()}</div>
</dialog>
```
Use it as `<Popup bind:open={legal} title="Legal">...</Popup>`.

Tooltip on the Popover API. The effect runs after the DOM update, so `hidden` is already off when `showPopover()` is called:
```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  let { word, label, title, children }: { word: string; label?: string; title: string; children: Snippet } = $props();
  const id = $props.id();
  let open = $state(false), btn: HTMLButtonElement | undefined = $state(), tip: HTMLElement | undefined = $state();
  $effect(() => {
    if (!open || !btn || !tip) return;
    try { tip.showPopover(); } catch {}
    // place(btn, tip)  copy from assets/react/WordTip.tsx
    return () => { try { tip?.hidePopover(); } catch {} };
  });
</script>
<span class="word-tip-wrap" onpointerenter={(e) => e.pointerType === "mouse" && (open = true)} onpointerleave={() => (open = false)}>
  <button bind:this={btn} type="button" class="word-tip-word" aria-label={label} aria-describedby={id}
    onfocus={() => (open = true)} onblur={() => (open = false)} onkeydown={(e) => e.key === "Escape" && (open = false)}>{word}</button>
  <div bind:this={tip} {id} class="word-tip" popover="manual" role="tooltip" hidden={!open}>
    <div class="word-tip-head">{title}</div><div class="word-tip-body">{@render children()}</div>
  </div>
</span>
```

"Play sample": create the story once and cancel it in an effect teardown:
```svelte
<script lang="ts">
  import { createStory } from "$lib/story";
  const story = createStory();
  let active = $state("");
  $effect(() => story.cancel);                // cancel on destroy
  const play = () => story.play(async ({ sleep, live }) => {
    for (const id of stages) { if (!live()) return; active = id; await sleep(1400); }
  });
</script>
<button type="button" class="btn" onclick={play}>Play sample</button>
```

Reduced motion in Svelte:
- CSS animations and transitions are covered by the theme's kill switch.
- Svelte's built-in `transition:`, `in:` and `out:` run on the Web Animations API, so that CSS rule does not stop them. Read `prefersReducedMotion.current` from `svelte/motion` and set the duration to 0, or skip the directive.
- `prefersReducedMotion` and `MediaQuery` report `false` on the server, so markup that depends on them can change at hydration. For JS-decided motion, keep `let live = $state(false)` and set it in `onMount` or an `$effect`.

### Avoid in Svelte
- `export let`, `$:`, `on:click`, `<slot>` and `createEventDispatcher` in new code. Use `$props()`, `$derived`, `onclick` and snippets.
- `$effect` to compute a value. That is `$derived`. Keep effects for DOM, timers and listeners, and return the teardown.
- Reading `window` or `matchMedia` at the top of `<script>`, which runs on the server. Do it in `onMount` or `$effect`.
- Keyframes inside a component `<style>` that other components need.
- `transition:fly` and friends without a reduced-motion check.

## Astro 5

Astro ships HTML and no JavaScript by default. That fits cutify-ui: sprites, stages and tooltips are static, and only "Play sample", the dialog and the tooltip toggle need a script. Use at most one island, and only when something needs real component state. Scaffold with `npm create astro@latest`. Astro 6 needs Node 22.12 or newer.

### Where things go

- Import the theme in the layout's frontmatter. It becomes a global stylesheet for every page that uses the layout:
```astro
---
// src/layouts/Base.astro
import "../styles/glass.css";          // tokens, base classes, keyframes, kill switch
import "../styles/cutify-react.css";   // optional: .word-tip, dialog.pop
import SpriteDefs from "../components/SpriteDefs.astro";
const { title } = Astro.props;
---
<html lang="en">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /><title>{title}</title></head>
  <body><SpriteDefs /><slot /></body>
</html>
```
- A component `<style>` is scoped, because Astro adds a `data-astro-cid-*` attribute to its selectors. Elements created by script don't get that attribute. Use `<style is:global>` when a component's CSS must reach script-made elements or sprite pixels, and keep tokens in the theme file.
- Pass server values to client scripts through `data-*` attributes, since frontmatter does not run in the browser.
- Astro 6 renders `<script>` and `<style>` tags in the order written, not reversed. If a rule depends on order, check it.

### Sprites

Build-time symbols are the best fit. The frontmatter runs once at build, so there is no runtime and no flash:
```astro
---
// src/components/SpriteDefs.astro
import { spriteRects } from "../lib/sprite-rects";
import { CAST } from "../lib/cast";
---
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    {Object.entries(CAST.sprites).map(([id, grid]) => (
      <symbol id={id} viewBox="0 0 16 16" shape-rendering="crispEdges">
        {spriteRects(grid, CAST.palette, CAST.animate).map((r) => (
          <rect x={r.x} y={r.y} width="1.02" height="1.02" fill={r.fill} class={r.cls} />
        ))}
      </symbol>
    ))}
  </defs>
</svg>
```
Then draw them with `<svg class="sprite" viewBox="0 0 16 16" width="96" height="96" role="img" aria-label="Pilot"><use href="#ch-pilot" /></svg>`.

If you would rather drop in the original file, put `pixel-sprites.js` in `public/` and load it with `<script is:inline src="/pixel-sprites.js"></script>`. `is:inline` skips Astro's bundling, which is what a file in `public/` needs. Call `pixelSprites(CAST)` from a normal `<script>` that imports the cast.

### Patterns

A normal `<script>` in an `.astro` file is bundled, typed as TypeScript, runs as a module and appears once however many times its component is used. So use delegated listeners instead of one per instance.
```astro
<button type="button" class="btn" data-open="legal">Legal</button>
<dialog id="legal" class="pop" aria-labelledby="legal-title">
  <header class="pop-head"><h2 id="legal-title" class="pop-title">Legal</h2>
    <form method="dialog"><button class="pop-close">Close <span aria-hidden="true">✕</span></button></form></header>
  <div class="pop-body"><slot /></div>
</dialog>
<script>
  import { createStory, reducedMotion } from "../lib/story";
  import { pauseOffscreen } from "../lib/offscreen";
  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    const opener = t.closest<HTMLElement>("[data-open]");
    if (opener) (document.getElementById(opener.dataset.open!) as HTMLDialogElement | null)?.showModal();
    else if (t instanceof HTMLDialogElement && t.open) t.close();       // backdrop click
  });
  const story = createStory();
  document.getElementById("play")?.addEventListener("click", () => story.play(async ({ sleep, live }) => {
    for (const id of ["st1", "st2", "st3"]) {
      if (!live()) return;
      document.getElementById(id)?.classList.add("on");
      document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
      await sleep(1400);
    }
  }));
  pauseOffscreen();
</script>
```
`<form method="dialog">` closes the dialog with no script at all.

Tooltips: use the CSS-only recipe in `components.md` (`data-tip`, `aria-describedby`, `.sr-only` text) and put its two document listeners in the same `<script>`. It needs no island. A `popover` version is the same markup as the Vue one with a delegated `pointerenter`/`focusin` handler.

Islands: add one only for real state (an order form, a live tracker). Install the integration (`npx astro add svelte` or `vue`), then mount with a directive:
```astro
<OrderTracker client:visible orders={orders} />
```
- `client:visible` loads the JS when the island enters the viewport. `client:load` loads at once. `client:only="svelte"` skips server rendering, so the still version never exists. Avoid it.
- Props must be serialisable (objects, arrays, strings, numbers, `Date`, `Map`, `Set`). A function prop cannot reach the browser.
- Inside the island, follow the Vue or Svelte section above, including the hydration rule. Use one framework per page.

If you enable view transitions, run set-up code on the `astro:page-load` event instead of at the top of the script, and guard anything that must not run twice.

### Avoid in Astro
- A `client:*` directive on a component that has no state. A plain `.astro` component or a delegated script does the same job with no JavaScript.
- Several islands on one page, or islands in two frameworks.
- Scoped `<style>` for rules that target sprite pixels or script-made nodes.
- `client:only` for anything with a sprite, because it renders blank until the JS arrives.
- A fresh `addEventListener` per component instance. The script is deduplicated, so delegate.
- `<script is:inline>` for code that imports modules. Inline scripts are not bundled.

## Tailwind CSS v4

Tailwind v4 is configured in CSS. There is no `tailwind.config.js` and no `@tailwind base` line. It works for browsers from Safari 16.4, Chrome 111 and Firefox 128. The theme file stays the source of truth for tokens and for the depth and type recipes, and Tailwind adds layout utilities and token-named utilities on top.

### Install

| Host | Steps |
|---|---|
| Vue (Vite), Svelte (Vite) | `npm install tailwindcss @tailwindcss/vite`, add `tailwindcss()` to `plugins` in `vite.config`, put `@import "tailwindcss";` in `src/app.css`, import that file once |
| SvelteKit | the same, with `tailwindcss()` listed before `sveltekit()`, and `import "../app.css"` in `+layout.svelte` |
| Astro 5.2+ | `npx astro add tailwind`, then import `src/styles/global.css` (which holds `@import "tailwindcss";`) in the layout frontmatter |
| Plain HTML | `npm install tailwindcss @tailwindcss/cli`, then `npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch`, and link `output.css` |

The Play CDN script is for sketches only. A finished page loads no outside scripts, and `lint_page.py` fails on one.

### Theme CSS stays the source of truth

Unlayered CSS beats every Tailwind layer, so a theme file imported as-is would override utilities like `px-6` on any element that also has `.btn`. Import the theme into the `components` layer. Utilities then win over it, and it still wins over Preflight:
```css
/* src/app.css */
@import "tailwindcss";
@import "./cutify/glass.css" layer(components);   /* delete its first-line @import url(fonts): add a <link> to the head instead */

@theme {
  --color-*: initial;          /* drop the default palette so bg-purple-500 doesn't exist */
}
@theme inline {                /* inline: utilities emit var(--accent), so a dark-mode swap of the token still applies */
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-accent: var(--accent);
  --color-accent-ink: var(--accent-ink);
  --color-accent-2: var(--accent-2);
  --color-accent-2-ink: var(--accent-2-ink);
  --color-ok: var(--ok);
  --color-bad: var(--bad);
  --font-display: var(--display);
  --font-body: var(--body);
  --font-mono: var(--mono);
}
```
This gives `bg-surface`, `text-ink-muted`, `border-accent`, `font-display` and so on, and the values still come from the theme file. Add a `--shadow-*` entry only for a token the theme really has (Glass has `--btn-shadow`), and read the theme file first because the depth tokens differ per theme. Pixel animation utilities can live in `@theme` with `steps()` timing:
```css
@theme { --animate-hop: hop .4s steps(2) infinite alternate;  @keyframes hop { to { transform: translateY(-5px); } } }
```
Always write the animated class as `motion-safe:animate-hop`.

### Use the utilities for layout, the theme classes for everything else

```html
<section class="panel grid gap-4 p-6 md:grid-cols-3">
  <article class="card grid gap-2"><span class="kind">AI</span> ...</article>
  <button class="btn primary motion-safe:hover:-translate-y-0.5">Choose plan</button>
</section>
```
- `grid-cols-3` already emits `minmax(0, 1fr)`. Don't write `grid-cols-[1fr_2fr]`, because a bare `fr` track can't shrink on a phone.
- Use complete class names. `` `bg-${tone}` `` is never generated. Map a prop to a full class string, or keep the tone in a CSS variable.
- `motion-safe:` and `motion-reduce:` are the variants for reduced motion. The theme's kill switch still applies underneath.
- `outline-none` is now `outline-hidden`, and `ring` is 1px. Never remove the theme's `:focus-visible` outline.
- `<style>` blocks in Vue, Svelte and Astro can't see your theme or utilities. Add `@reference "../app.css";` at the top of that block before using `@apply`, or skip `@apply` and write `var(--accent)`.
- Dark pairs: switch the contract variables in the theme file. Don't add `dark:` variants on top of tokens that already switch.

### Avoid with Tailwind
- Rebuilding a theme as long utility strings (`rounded-2xl bg-white/80 shadow-xl backdrop-blur ...`). The theme already has the card, the button and the depth.
- Default purple, indigo or blue gradient utilities, and any decorative gradient utility.
- Soft `shadow-md`, `shadow-lg` and `shadow-xl` on small interactive pieces. Depth comes from the theme's hard offset, glow or ledge.
- The same `rounded-xl` on everything.
- `font-sans` or Inter as a display face. Use `font-display`.
- `@apply` on large blocks to hide the long strings. If you need a repeated recipe, write it as a theme class.
- Tailwind's Play CDN, or a second Google Fonts request for a font the theme already loads.
- A `tailwind.config.js` for tokens. Tokens belong in the theme CSS and `@theme`.
