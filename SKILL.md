---
name: cutify-ui
description: Builds cute, playful, game-like web pages and UIs. Use it for any page the user wants to feel cute, cosy, playful, friendly, kawaii or game-like, such as "a cute landing page for my study app", "a cosy pre-order page for my bakery", a product demo, portfolio, hackathon UI, explainer, dashboard or multi-agent visualisation, and whenever pixel art, sprites, mascots or a non-generic, not-AI-looking design comes up, even if the skill isn't named. Pages get pixel-art characters, numbered story stages, tooltips that explain why and motion that shows the product at work, in React/Next.js or plain HTML/CSS/SVG (including inside Streamlit). Six themes cover frosted glass over scenery, dark control-room signage, picnic gingham, riso print, a lantern-lit night market and toy-box bricks, with 19 backdrops, OFL font pairings including kawaii Japanese, and a page linter.
---

# cutify-ui

cutify-ui turns a product into a small game world the visitor walks through. The actors in the product (AI helpers, the user, sometimes a mascot) are pixel sprites, and the content is a numbered path of stages. Labels say who does what, and motion shows what the product does.

It comes from two shipped projects, itsa10but (a résumé checker) and SkyQueue (a multi-agent airport queue planner). It has six themes that share one grammar:

| Theme | Light or dark | Look |
|---|---|---|
| Glass | light | frosted glass over painted scenery, Pixelify Sans, lime highlighter |
| Apron | dark | airfield signage on a dot grid, wide Anybody, taxiway yellow |
| Picnic | light | gingham and napkin cards, rounded Fredoka, jam-jar-lid numbers |
| Riso Club | light | newsprint, flat cards, a slipped pink/blue print shadow, Bricolage Grotesque |
| Lantern Night | dark | dusk sky, dithered skyline, glowing pixel borders, Jersey 10 |
| Toy Box | light | graph paper, plastic cards and buttons with a ledge that presses, Dela Gothic One |

## How to work

For a full page, copy this checklist into your reply and tick it off as you go:

```
cutify-ui progress:
- [ ] 1 Size the job
- [ ] 2 Theme, backdrop and fonts chosen and stated
- [ ] 3 Cast taken from the brief
- [ ] 4 Real copy written
- [ ] 5 Journey laid out
- [ ] 6 References read
- [ ] 7 Built from the assets
- [ ] 8 lint_page.py passes and screenshots checked
```

1. Size the job to the request. A "landing page" is a hero, three to five stages, How it works and a footer. A single component, card or section is just that piece in the theme. An app screen keeps the theme's tokens, type and depth but drops the story stages and ambient motion, and holds more information per screen. Don't add dashboards, charts, approval flows or extra sections the brief didn't ask for.
   - If the project has a `taste.md` (in the root or in `.claude/`), read it first. It holds the user's past reactions ("too busy", "love this spacing") and sites they like, and it outranks the defaults in this skill. When the user reacts to a draft, offer to add that line to `taste.md` so the next page starts from it.
2. Pick the theme, the backdrop and the fonts for this product. Match the theme to the mood:
   - Glass for careers, learning or outdoors
   - Apron for operations or data
   - Picnic for food, weekends or family
   - Riso Club for events, zines or portfolios
   - Lantern Night for night, sleep or games
   - Toy Box for kids, toys or building

   If two fit, pick the one closest to the product's main noun (a recipe app is food before it is family) and say which you chose and why in one line. If nothing fits, use Glass. If the user is unsure what they want, offer three directions first, each one line naming a theme, a backdrop and a font pairing, and let them choose. If they share a screenshot or a site they like, take its type scale, spacing and density into the theme, and keep its logos, art and copy out. Then choose a backdrop from `references/backgrounds.md` and a font pairing from `references/fonts.md` that belong to this product. Two different products should look like two different products, so don't reuse one backdrop or display face for everything. A new theme made by swapping tokens is welcome as long as the grammar below stays.
3. Name the cast from the brief, and only from the brief. List the actors the user described (their AI helpers, the user themself) and give each a pixel sprite, one colour and one shape cue. Don't add actors, mechanics or story beats the product doesn't have: no invented rule checkers, negotiation rounds, backup plans or "code" characters. If the product has no agents, the cast is one mascot plus the steps of the user's journey.
4. Write the real copy before the layout. Use the product's own names, numbers and steps from the brief. Never use lorem ipsum or filler like "Unlock your potential", because the length and shape of real copy decide the layout. If the brief has no copy, write specific sample copy and label it "sample".
5. Lay out the journey. Start with the hero (what it is in one line, up to three short benefits, one primary action), then numbered stages in the order the user meets them, then "How it works", then the footer. Vary the hero composition (see the layout skeleton) so it suits the product.
6. Read only the references you need, then build. A single landing page usually needs `themes.md`, `backgrounds.md`, `fonts.md`, `pixel-art.md` and the first half of `components.md`. Read `motion.md` when the page animates the product at work, and read `react.md` or `streamlit.md` only for those stacks.
   - Tokens, surfaces, shadows and palettes for all six themes: `references/themes.md`
   - Backdrops (19 pure-CSS and inline-SVG recipes) and how to choose one: `references/backgrounds.md`
   - Font pairings and readability rules (all SIL OFL): `references/fonts.md`
   - Pixel sprites and pixel icons: `references/pixel-art.md`
   - Motion rules, keyframes, animation engines and micro-interactions: `references/motion.md`
   - Component recipes (tooltips, buttons, pills, stage headers, KPI tiles, charts, dialogs, split buttons, meters, loading screens): `references/components.md`
   - React / Next.js patterns and ready components: `references/react.md`
   - Plain HTML pages and Streamlit hosting (iframes, bridges, restyling): `references/streamlit.md`
   - Copy and labels: `references/voice.md`
7. Start from the assets. Each theme file (`assets/glass.css`, `assets/apron.css`, `assets/picnic.css`, `assets/riso.css`, `assets/lantern.css`, `assets/toybox.css`) defines the same contract variables (`--bg`, `--surface`, `--surface-2`, `--ink`, `--ink-muted`, `--accent`, `--accent-ink`, `--accent-2`, `--accent-2-ink`, `--ok`, `--bad`, `--display`, `--body`, `--mono`) and the same base classes (`.panel`, `.card`, `.lab`, `.hl`, `.step`, `.btn`, `.kind`, `.i`, `.pill`, `.kpi`, `.sprite`). `assets/pixel-sprites.js` turns string-grid sprites into SVG symbols. `assets/react/` has typed components and `cutify-react.css` for them. `assets/streamlit/` has the bridge helpers. `scripts/lint_page.py` checks a finished page (step 8). Copy what you need into the project instead of rewriting it.
8. Check the page and fix it until it passes:
   - Run `python scripts/lint_page.py <your page>.html`. It finds repainting animations, missing reduced-motion handling, emoji used as icons, outside scripts, lorem ipsum, unlabelled "i" buttons, a generic display font and unlabelled sample data, and prints a line number and a fix for each. Fix every FAIL and run it again. Read each WARN and keep the thing only if it's deliberate.
   - Critique the draft against the brief, the "Avoid the default AI look" list below and the checklist at the end of this file.
   - Screenshot it at 1440px and 390px if you can. Fix what you find one element at a time, and keep what already works unchanged.

## Avoid the default AI look

Generated interfaces look alike because the model fills every open decision with the safest default. The themes above already make the big decisions (exact fonts, exact colours, a kind of depth), so don't undo them with these common tells:

- Purple-to-blue gradients as decoration. A painted sky inside a scene is fine.
- Big rounded white cards with soft grey shadows on every section. Use the theme's own depth.
- Emoji as icons. Draw a pixel icon instead (`references/pixel-art.md`). Text marks such as ✓ and ✕ are fine.
- A centred hero above three identical feature boxes. Use one of the hero compositions in the layout skeleton and give each stage its own content.
- Inter, Roboto or the system font as the display face.
- The same corner radius on every element whatever its size.
- Every section fading up as it scrolls into view. Save motion for what the product does.
- Lorem ipsum, or vague benefit copy that could describe any product.

## The grammar (keep these in every theme)

These rules are what make a UI read as cutify-ui. Tokens change between themes, but these rules stay the same.

### Characters carry the story

Draw each actor as a 16 × 16 pixel sprite with a dark outline, rendered crisp (`shape-rendering: crispEdges` or `image-rendering: pixelated`) and large enough to read (48px or more in a hero). Parts of a sprite (a blinking beacon, waving arms) move with stepped `steps()` timing like 8-bit frames, and a whole sprite may bob gently with an ease. The talking or working character hops while the others dim. A visitor follows "the chef picked three dinners" far more easily than "the model returned results".

### Identity never rests on colour alone

Pair each actor's colour with a shape (square / circle / hexagon glyph), a name or a kind tag, placed next to the sprite. Status pairs a mark with a word: `✓ Done`, `✕ Ignored`, `? Unclear`.

### Say who does what

When the product mixes AI with people, tag each block with who does it: AI for the helpers, You for the user's choices, and Code only if the brief has a real non-AI step. Show the tags as small chips in fixed colours per theme. Label samples "sample" or "made-up", estimates "estimate" and recordings "Recorded".

### A numbered path

Content is a journey of stages. Each stage has one number (a badge, jar lid, lantern, brick or outlined digit, by theme), a short imperative title, an info tooltip and an optional one-line explain strip (`chip → chip → chip`).

### Tooltips on everything that could confuse

A small `i` button (or a dotted-underlined word) opens a tip on hover, keyboard focus and tap, with 3 to 8 short lines that say *why*. The trigger is a real `<button type="button">` with an `aria-label` naming the subject, and the tip text is linked with `aria-describedby` (see `references/components.md`). Tips stay on screen, and neighbours never cover them.

### Physical depth

Interactive pieces feel like objects you can press, and each theme does it in its own way: a hard sticker offset (Glass, Apron), a soft blanket offset (Picnic), a slipped two-colour print plate (Riso Club), a lantern glow (Lantern Night) or a ledge that collapses when pressed (Toy Box). Buttons respond on hover and press. Only large floating layers (menus, dialogs) get soft blurred shadows.

### A display face with character, a body face that reads easily

Headings use the theme's display face. IDs, times, numbers and chips use a mono face in small, letter-spaced uppercase. Body copy stays in a plain face at 16px or more. Never set paragraphs in a pixel, handwritten or single-weight display face.

### Motion explains the system

Animate what the product does: a parcel follows the delivery route, a note flies to the helper who reads it, a plant perks up as care happens. Each animation answers "what just happened?" Ambient loops stay slow and small. Everything respects `prefers-reduced-motion` and pauses off screen.

### Native elements first

Use `<dialog>` for modals and for confirming anything the user commits to, real `<button>`s, native radios behind toggle switches, and `ol` for ordered steps. Decorative art is `aria-hidden`, and sprites that carry meaning get `role="img"` and a label.

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

### Widths

Design at 1280px and make it hold at 375px with no sideways scroll. Stack columns, shrink scenes, keep sprites 32px or more, and move tooltips to a bottom sheet on narrow screens if they can't fit. Write grid columns as `minmax(0, 1fr)` and never a bare `1fr`, and give single-column stacks `grid-template-columns: minmax(0, 1fr)` too. A bare `1fr` column can't shrink below its widest child, so one timetable or long word pushes the whole page past a phone screen. Dense dashboards hosted in Streamlit can scale down instead (see `references/streamlit.md`).

### Light and dark

Each theme is either light or dark by design. If the user asks for both, pair a light theme with a dark one (Picnic with Lantern Night, Glass with Apron) and switch the contract variables under `@media (prefers-color-scheme: dark)`. Check contrast again for every pair.

### Performance

Use inline SVG and CSS only, with no animation libraries. Blur only top-level surfaces. Animate `transform` and `opacity`. Pause loops off screen. Make one web-font request (two or three families). Aim for a page under about 150 KB before fonts.

## Before you finish

- Nothing from "Avoid the default AI look" appears, and the copy is the product's own.
- The size of the output matches the request, and the cast is exactly the actors in the brief, each with a sprite, a colour and a non-colour cue beside it.
- The hero says what it is in one line, with up to three short benefits and one primary action.
- Stages are numbered once each, titled in plain imperative words, and each has a tooltip.
- Tooltip triggers are buttons with `aria-label`s, and tips open on hover, focus and tap.
- Interactive pieces use the theme's depth (sticker offset, blanket offset, print plate, glow or ledge) and respond to hover and press.
- Every animation has a reason, uses stepped timing for pixel parts, stops under reduced motion and pauses off screen.
- IDs and numbers are in mono, the display face is only on headings, and body text is 16px or more.
- Made-up values say "sample" or "made-up", and estimates say "estimate".
- Text contrast is at least 4.5:1, and focus rings are visible.
- No third-party logos, characters or brand marks appear unless the user supplies them.
- You looked at it in a browser at 1440px and 390px (and 375px for the narrowest phones): no overlaps, no clipped text or tooltips, no horizontal scroll.
