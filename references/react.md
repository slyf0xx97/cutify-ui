# React and Next.js

How the Glass theme was built in Next.js (App Router) with React 19, plain global CSS and no animation library. The same patterns work with Vite.

## Contents
- Project setup
- Ready components in `assets/react/`
- Patterns worth copying
- What to avoid

---

## Project setup

- **CSS**: plain global CSS split by feature and imported in order from `app/globals.css` (tokens first, a `theme.css` that overrides older values, `buttons.css` last). Short class prefixes per feature (`.pop-*` dialog, `.sh-*` scroll hint, `.jbar-*` journey bar). No Tailwind or CSS-in-JS is needed; if the project uses Tailwind, put the tokens in `@theme` and keep the recipes as component classes.
- **Fonts**: `next/font/google`, exposed as CSS variables on `<html>`:
```tsx
import { Atkinson_Hyperlegible, Pixelify_Sans } from "next/font/google";
const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel", display: "swap" });
const read = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-read", display: "swap" });
// <html lang="en" className={`${pixel.variable} ${read.variable}`}>
```
For Apron use `Anybody` (with `axes: ["wdth"]`) and `Spline_Sans_Mono` the same way.
- **Icons**: `lucide-react` for small UI glyphs (`size={16|18|20}`, `aria-hidden`), `PixelIcon` for story icons.
- **State**: React hooks only. `useSyncExternalStore` over `localStorage` (with an in-memory fallback when storage throws) for saved progress.
- **Layout**: container queries over media queries for anything inside a panel (`container-type: inline-size; container-name: stage` then `@container stage (min-width: 700px)`), and `subgrid` so rows line up across sibling cards (`grid-row: span 3; grid-template-rows: subgrid`).
- **Assets**: save logos and images locally, never hotlink; long cache headers for `/assets/*`.

## Ready components in `assets/react/`

Copy these into `components/` and import the matching CSS from `assets/glass.css` or `assets/apron.css`.

| File | What it is |
|---|---|
| `PixelSprite.tsx` | 16 × 16 string-grid sprite rendered as crisp SVG, with palette keys that can animate |
| `PixelIcon.tsx` | one-colour pixel icons from rectangle arrays, `currentColor` |
| `Popup.tsx` | native `<dialog>` modal: Escape, focus return, backdrop click, tone colours |
| `WordTip.tsx` | tooltip / peek panel on the Popover API, opens on hover, focus and tap, flips above when there's no room |
| `StageHeader.tsx` | numbered stage header: pill, title, one-line description, optional aside |
| `KindChip.tsx` | AI / Code / You tag |
| `useOffscreenPause.ts` | pauses CSS animations in sections that are off screen |
| `glideTo.ts` | smooth anchor scroll that clears a sticky header and respects reduced motion |

## Patterns worth copying

**Dialogs on `<dialog>`.** Store the opener, call `showModal()`, close on backdrop click (`event.target === dialogRef.current`), restore focus on close. One `useState<"legal" | "license" | null>` can drive several dialogs.

**Tooltips on the Popover API.** `popover="manual"` + `showPopover()` puts the tip in the top layer, so no ancestor `overflow` or `z-index` can clip it. Position with fixed coordinates in `useLayoutEffect`, flip above when the space below is smaller, set `data-side` for the arrow. Use `role="tooltip"` and `aria-describedby` for small tips, `role="dialog"` and `aria-haspopup` for panels. Add invisible 14px "hover bridges" so the pointer can travel into the bubble.

**Glossary-driven jargon.** `<Term id="ats" />` looks up a `GLOSSARY` entry and renders a `WordTip`. Every technical word gets one.

**Accessible tabs.** `role="tablist"`, roving `tabIndex`, ArrowLeft/ArrowRight/Home/End handlers, `aria-selected`. The active tab is "pressed in" (`translateY(2px)`, shadow gone) so the state isn't colour alone.

**Lazy sections.** `WhenSeen` renders children only once an `IntersectionObserver` with `rootMargin: "400px"` sees it, so fetches wait until the visitor scrolls near.

**Async states as a union.** `idle | loading | ok | error`, an `AbortController` with a timeout, a `role="status" aria-live="polite"` line for every state, and a skeleton while loading. Error copy says what failed and what still works.

**Scannable rows.** An icon tile, a bold 2 to 4 word lead, one short line with at most one highlighted phrase:
```tsx
export function Item({ icon, lead, text }: { icon: string; lead: ReactNode; text: ReactNode }) {
  return <li className="cl-item"><span className="cl-icon" aria-hidden="true">{icon}</span>
    <p className="cl-text"><strong className="cl-lead">{lead}</strong> {text}</p></li>;
}
```

**Horizontal scroll hints.** A wrapper measures overflow with a `ResizeObserver`, shows edge fades and round arrow buttons only on the side with more content, and does a one-time 24px peek (skipped under reduced motion).

**Characters in several places.** One `PixelSprite` (or sprite-sheet `PixelAgent`) component reused in the hero, cards, dialogs (tone colour), dashboard and journey bar. Split hero motion across nested wrappers so transforms don't fight. Waiting cards: `opacity: .55; filter: grayscale(.5)`; working cards: the sprite does a small `rotate(±3deg)` work loop and a status pill with animated dots.

**Hydration-safe motion.** Start motion state as `null` so the still version renders on the server, then mount the live animation only when `prefers-reduced-motion` is `no-preference`.

## What to avoid

- A blur on every card (scroll jank). Blur only top-level surfaces.
- Black shadows in Glass; soft blurred shadows on small interactive bits in either theme.
- Animating layout properties, or reading layout inside scroll handlers.
- Colour as the only signal for state, kind or identity.
- Copying third-party logos into a template. Use text chips, or let the user add their own.
