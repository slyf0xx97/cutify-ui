---
name: cutify-ui
description: Build playful, game-like, cute web interfaces with pixel-art characters, numbered story stages, tooltips that explain why, and motion that shows the product at work, in React/Next.js or plain HTML/CSS/SVG (including inside Streamlit). Six themes cover cosy picnic and gingham, riso zine and print, night market and lantern-lit pixel, toy-box and kids' building blocks, frosted glass over painted scenery, and dark control-room signage, with 19 backdrops and OFL font pairings including kawaii Japanese. Use this skill whenever the user asks for a landing page, demo site, hackathon UI, product walkthrough, portfolio, AI-agent or multi-agent visualisation, dashboard or explainer that should feel friendly, cosy, animated, characterful, kawaii or "cute", or mentions pixel art, sprites, mascots, cutify, itsa10but or SkyQueue style, even if they don't name the skill.
---

# cutify-ui

cutify-ui turns a product into a small game world the visitor walks through. The actors in the product (AI helpers, the user, sometimes a mascot) are pixel sprites; the content is a numbered path of stages; labels say honestly who does what; motion shows what the product does.

It comes from two shipped projects (itsa10but, a résumé checker, and SkyQueue, a multi-agent airport queue planner) and has six themes that share one grammar:
- **Glass** (light): frosted glass over painted scenery, Pixelify Sans, lime highlighter.
- **Apron** (dark): airfield signage on a dot grid, wide Anybody, taxiway yellow.
- **Picnic** (light): gingham and napkin cards, rounded Fredoka, jam-jar-lid numbers.
- **Riso Club** (light): newsprint, flat cards, a slipped pink/blue print shadow, Bricolage Grotesque.
- **Lantern Night** (dark): dusk sky, dithered skyline, glowing pixel borders, Jersey 10.
- **Toy Box** (light): graph paper, plastic cards and buttons with a ledge that presses, Dela Gothic One.

## How to work

1. **Size the job to the request.** A "landing page" is a hero, three to five stages, How it works and a footer. A single component, card or section is just that piece in the theme. Don't add dashboards, charts, approval flows or extra sections the brief didn't ask for.
2. **Pick the theme, the backdrop and the fonts for this product.** Match the mood: careers, learning or outdoors, Glass; operations or data, Apron; food, weekends or family, Picnic; events, zines or portfolios, Riso Club; night, sleep or games, Lantern Night; kids, toys or building, Toy Box. If two fit, pick the one closest to the product's main noun (a recipe app is food before it is family) and say which you chose and why in one line; if nothing fits, use Glass. Then choose a backdrop from `references/backgrounds.md` and a font pairing from `references/fonts.md` that belong to this product. Two different products should look like two different products, so don't reuse one backdrop or display face for everything. A new theme made by swapping tokens is welcome as long as the grammar below stays.
3. **Name the cast from the brief, and only from the brief.** List the actors the user described (their AI helpers, the user themself) and give each a pixel sprite, one colour and one shape cue. Don't add actors, mechanics or story beats the product doesn't have: no invented rule checkers, negotiation rounds, backup plans or "code" characters. If the product has no agents, the cast is one mascot plus the steps of the user's journey.
4. **Lay out the journey.** Hero (what it is in one line, up to three short benefits, one primary action), then numbered stages in the order the user meets them, then "How it works", then the footer. Vary the hero composition (see the layout skeleton) so it suits the product.
5. **Read only the references you need, then build.** A single landing page usually needs `themes.md`, `backgrounds.md`, `fonts.md`, `pixel-art.md` and the first half of `components.md`. Read `motion.md` when the page animates the product at work, and `react.md` or `streamlit.md` only for those stacks.
   - Tokens, surfaces, shadows and palettes for all six themes: `references/themes.md`
   - Backdrops (19 pure-CSS and inline-SVG recipes) and how to choose one: `references/backgrounds.md`
   - Font pairings and readability rules (all SIL OFL): `references/fonts.md`
   - Pixel sprites and pixel icons: `references/pixel-art.md`
   - Motion rules, keyframes, animation engines and micro-interactions: `references/motion.md`
   - Component recipes (tooltips, buttons, pills, stage headers, KPI tiles, charts, dialogs, split buttons, meters, loading screens): `references/components.md`
   - React / Next.js patterns and ready components: `references/react.md`
   - Plain HTML pages and Streamlit hosting (iframes, bridges, restyling): `references/streamlit.md`
   - Copy and labels: `references/voice.md`
6. **Start from the assets.** Each theme file (`assets/glass.css`, `assets/apron.css`, `assets/picnic.css`, `assets/riso.css`, `assets/lantern.css`, `assets/toybox.css`) defines the same contract variables (`--bg`, `--surface`, `--surface-2`, `--ink`, `--ink-muted`, `--accent`, `--accent-ink`, `--accent-2`, `--accent-2-ink`, `--ok`, `--bad`, `--display`, `--body`, `--mono`) and the same base classes (`.panel`, `.card`, `.lab`, `.hl`, `.step`, `.btn`, `.kind`, `.i`, `.pill`, `.kpi`, `.sprite`). `assets/pixel-sprites.js` turns string-grid sprites into SVG symbols. `assets/react/` has typed components and `cutify-react.css` for them. `assets/streamlit/` has the bridge helpers. Copy what you need into the project rather than rewriting it.
7. **Check against the list at the end of this file**, and look at the result in a browser at desktop and phone widths if you can.

## The grammar (keep these in every theme)

These are what make a UI read as cutify-ui. Tokens change between themes; these don't.

**Characters carry the story.** Draw each actor as a 16 × 16 pixel sprite with a dark outline, rendered crisp (`shape-rendering: crispEdges` or `image-rendering: pixelated`), large enough to read (48px or more in a hero). Parts of a sprite (a blinking beacon, waving arms) move with stepped `steps()` timing like 8-bit frames; a whole sprite may bob gently with an ease. The talking or working character hops; the others dim. A visitor follows "the chef picked three dinners" far more easily than "the model returned results".

**Identity never rests on colour alone.** Pair each actor's colour with a shape (square / circle / hexagon glyph), a name or a kind tag, placed next to the sprite. Status pairs a mark with a word: `✓ Done`, `✕ Ignored`, `? Unclear`.

**Say who does what.** When the product mixes AI with people, tag each block with who does it: **AI** for the helpers, **You** for the user's choices, and **Code** only if the brief has a real non-AI step. Show it as small chips in fixed colours per theme. Label samples "sample" or "made-up", estimates "estimate", recordings "Recorded".

**A numbered path.** Content is a journey of stages: one number per stage (a badge, jar lid, lantern, brick or outlined digit, by theme), a short imperative title, an info tooltip and an optional one-line explain strip (`chip → chip → chip`).

**Tooltips on everything that could confuse.** A small `i` button (or a dotted-underlined word) opens a tip on hover, keyboard focus and tap, with 3 to 8 short lines that say *why*. The trigger is a real `<button type="button">` with an `aria-label` naming the subject, and the tip text is linked with `aria-describedby` (see `references/components.md`). Tips stay on screen and are never covered by neighbours.

**Physical depth.** Interactive pieces feel like objects you can press, each theme in its own way: a hard sticker offset (Glass, Apron), a soft blanket offset (Picnic), a slipped two-colour print plate (Riso Club), a lantern glow (Lantern Night) or a ledge that collapses when pressed (Toy Box). Buttons respond on hover and press. Only large floating layers (menus, dialogs) get soft blurred shadows.

**A display face with character, a body face that reads easily.** Headings use the theme's display face; IDs, times, numbers and chips use a mono face in small, letter-spaced uppercase; body copy stays in a plain face at 16px or more. Never set paragraphs in a pixel, handwritten or single-weight display face.

**Motion explains the system.** Animate what the product does: a parcel follows the delivery route, a note flies to the helper who reads it, a plant perks up as care happens. Each animation answers "what just happened?" Ambient loops stay slow and small. Everything respects `prefers-reduced-motion` and pauses off screen.

**Native first.** `<dialog>` for modals and for confirming anything the user commits to, real `<button>`s, native radios behind toggle switches, `ol` for ordered steps. Decorative art is `aria-hidden`; sprites that carry meaning get `role="img"` and a label.

## Layout skeleton

```
[pinned nav: brand | How it works | primary action]
[HERO   one of: text left + scene right | centred title over a wide scene | full-width scene with a compact text panel
        | stacked: scene first, then title]   cast labelled with name and kind chips beside each sprite, tiny legend
[STAGE 1  number | title | (i)   explain strip   → content panel(s)]
[STAGE 2  ...]
[STAGE n  the result, or the user's decision if the product has one]
[HOW IT WORKS  a route of numbered cards with a moving token, optionally beside a who-does-what diagram]
[FOOTER  brand + blurb | links | © line]
```

**Widths.** Design at 1280px and make it hold at 375px with no sideways scroll: stack columns, shrink scenes, keep sprites 32px or more, and move tooltips to a bottom sheet on narrow screens if they can't fit. Dense dashboards hosted in Streamlit can scale down instead (see `references/streamlit.md`).

**Light and dark.** Each theme is either light or dark by design. If the user asks for both, pair a light theme with a dark one (Picnic with Lantern Night, Glass with Apron) and switch the contract variables under `@media (prefers-color-scheme: dark)`; check contrast again for every pair.

**Performance.** Inline SVG and CSS only, no animation libraries. Blur only top-level surfaces. Animate `transform` and `opacity`. Pause loops off screen. One web-font request (two or three families). Aim for a page under about 150 KB before fonts.

## Before you finish

- The size of the output matches the request, and the cast is exactly the actors in the brief, each with a sprite, a colour and a non-colour cue beside it.
- The hero says what it is in one line, with up to three short benefits and one primary action.
- Stages are numbered once each, titled in plain imperative words, and each has a tooltip.
- Tooltip triggers are buttons with `aria-label`s; tips open on hover, focus and tap.
- Interactive pieces use the theme's depth (sticker offset, blanket offset, print plate, glow or ledge) and respond to hover and press.
- Every animation has a reason, uses stepped timing for pixel parts, stops under reduced motion and pauses off screen.
- Mono for IDs and numbers; display face only for headings; body text 16px or more.
- Made-up values say "sample" or "made-up"; estimates say "estimate".
- Text contrast is at least 4.5:1; focus rings are visible.
- No third-party logos, characters or brand marks unless the user supplies them.
- Looked at in a browser at 1280px and 375px: no overlaps, no clipped text or tooltips, no horizontal scroll.
