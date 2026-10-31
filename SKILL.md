---
name: cutify-ui
description: Build playful, game-like web interfaces in the cutify-ui style - pixel-art characters, story-style numbered stages, sticker shadows, tooltips on everything, animated "how it works" maps and journeys - in React/Next.js or plain HTML/CSS/SVG (including inside Streamlit). Use this skill whenever the user asks for a landing page, demo site, hackathon UI, product walkthrough, AI-agent or multi-agent visualisation, dashboard or explainer that should feel friendly, animated, characterful or "cute", or mentions pixel art, sprites, frosted glass, a dark airfield/signage look, cutify, itsa10but or SkyQueue style - even if they don't name the skill.
---

# cutify-ui

cutify-ui turns a product into a small game world the visitor walks through. Every screen has characters (the AI agents or roles in the product) drawn as pixel sprites, a numbered path of stages, honest labels saying who did what, and motion that explains rather than decorates.

It comes from two shipped projects that share one grammar and differ in theme:
- **Glass** (light): frosted glass panels over painted flat-vector scenery, Pixelify Sans headings, lime highlighter marks, game buttons. From itsa10but, a résumé checker.
- **Apron** (dark): airfield signage on a dark dot grid, wide Anybody headings, taxiway-yellow accents, mono labels. From SkyQueue, a multi-agent airport queue planner.

## How to work

1. **Pick the theme.** Ask only if the brief gives no hint. Light, friendly, consumer, education, careers, wellbeing → Glass. Dark, technical, operations, data-heavy, "control room", night → Apron. A user can also invent a third theme by swapping tokens (see `references/themes.md`), as long as the grammar below stays.
2. **Name the cast from the brief, and only from the brief.** List the actors the user described (their AI helpers, the user themself) and give each a pixel sprite, one colour and one shape cue. Don't add actors, mechanics or story beats the product doesn't have: no invented rule checkers, negotiation rounds, backup plans or "code" characters. Those came from SkyQueue, where they were real. If the product has no agents at all, the cast is a mascot plus the steps of the user's journey.
3. **Lay out the journey.** Hero (what it is in one line plus three short benefits plus one primary action), then numbered stages in the order the user meets them, then a "How it works" section, then the footer.
4. **Read only the references you need, then build.** A single landing page usually needs `themes.md`, `pixel-art.md` and the first half of `components.md`. Read `motion.md` when the page animates the product at work, and `react.md` or `streamlit.md` only for those stacks.
   - Tokens, fonts, surfaces, shadows for both themes: `references/themes.md`
   - Pixel sprites and pixel icons: `references/pixel-art.md`
   - Motion rules, keyframes and the animation engines: `references/motion.md`
   - Component recipes (tooltips, buttons, pills, stage headers, KPI tiles, charts, dialogs, split buttons, meters, loading screens): `references/components.md`
   - React / Next.js patterns and ready components: `references/react.md`
   - Plain HTML pages and Streamlit hosting (iframes, bridges, restyling): `references/streamlit.md`
   - Copy and labels: `references/voice.md`
5. **Start from the assets.** `assets/glass.css` and `assets/apron.css` hold the tokens and base components for each theme. `assets/pixel-sprites.js` turns string-grid sprites into SVG symbols. `assets/react/` has typed components. `assets/streamlit/` has the bridge helpers. Copy what you need into the project rather than rewriting it.
6. **Check against the list at the end of this file** before you call it done, and look at the result in a browser if you can.

## The grammar (keep these in every theme)

These are what make a UI read as cutify-ui. Tokens can change, these shouldn't.

**Characters carry the story.** Draw each actor as a 16 × 16 pixel sprite with a dark outline, rendered crisp (`shape-rendering: crispEdges` or `image-rendering: pixelated`). Give each an idle loop (bob, blink, wave) with stepped easing so it moves like an 8-bit frame, never a smooth float. The talking or working character hops; the others dim. People remember characters, and a visitor can follow "the marshal moved the plane" far more easily than "the optimiser updated the schedule".

**Identity never rests on colour alone.** Pair each actor's colour with a shape (square / circle / hexagon glyph), a name, or a kind tag. Status pairs a mark with a word: `✓ Done`, `✕ Ignored`, `? Unclear`. This keeps the UI usable for colour-blind visitors and in greyscale screenshots.

**Say who did what.** When the product mixes AI with people, tag each block with who does it: **AI** for the helpers, **You** for the user's choices and approvals, and **Code** only if the brief has a real non-AI step (a rules engine, a calculator). Show it as small chips on labels, steps and diagram boxes, in fixed colours per theme. Honest provenance builds trust: label samples "made-up", estimates "estimate", recordings "Recorded".

**A numbered path.** Content is a journey of stages: a square number badge, a short imperative title ("Read the ops inbox", "Add your résumé"), an info tooltip, and a one-line explain strip (`chip → chip → chip`). Stages follow the order the user meets them.

**Tooltips on everything that could confuse.** A small circled `i` (or a dotted-underlined word) opens a tip on hover, focus and tap, with a short title and 3 to 8 point-form lines that say *why*, not just what. Tips are keyboard reachable and never covered by neighbours.

**Sticker depth.** Interactive and floating bits get a hard offset shadow with no blur (`0 6px 0 #00000055` dark, `0 3px 0 rgb(16 70 100 / 30%)` light). Buttons lift 2px on hover and sink 1px on press, like game buttons. Only big floating layers (menus, dialogs) get soft shadows.

**Mono for data, wide or pixel for headings.** Headings use the theme's display face (Pixelify Sans in Glass, heavy wide Anybody in Apron). IDs, times, numbers, labels and chips use a mono face in small, letter-spaced uppercase. Body copy stays plain and readable at 16px or more.

**Motion explains the system.** Animate the thing the product does: planes taxi along the real route, a note flies from the inbox to the reader, sprites walk the journey as you scroll. Each animation answers "what just happened?" Ambient loops stay slow and small. Everything respects `prefers-reduced-motion` and pauses off screen. See `references/motion.md`.

**Native first.** `<dialog>` for modals and for confirming anything the user approves or commits to, the Popover API or a focusable `::after` tip for tooltips, real `<button>`s, native radios behind toggle switches, `ol` for ordered steps. Decorative art is `aria-hidden`; sprites that carry meaning get `role="img"` and a label.

## Layout skeleton

```
[pinned nav: brand | How it works | primary action]
[HERO  text column: big title (2nd word in accent) / tagline / ✓ 3 benefits / live badge / split primary button
       art column: scene with the cast placed on it + labelled with kind chips + tiny legend]
[STAGE 1  number | title | (i)   explain strip   → content panel(s)]
   connector (dashed, animated) feeding the next stage
[STAGE 2  ...]
[STAGE 3  decision / result: KPI tiles + small charts + approve action]
[HOW IT WORKS  left: vertical route of numbered cards with a moving token / right: architecture diagram]
[FOOTER  brand + blurb | Data | Built with | Project, © line]
```
Design at 1280px wide and make sure it holds at 375px (Glass) or scale the content down on small laptops (Apron, see `references/streamlit.md`). Never let the page scroll sideways.

## Before you finish

- The cast: every actor the user described has a sprite, a colour and a non-colour cue, and nothing was invented beyond the brief.
- The hero says what it is in one line, has three short benefits and one primary action.
- Stages are numbered, titled in plain imperative words, and each has a tooltip.
- Every animation has a reason, uses stepped easing for pixel things, stops under reduced motion and pauses off screen.
- Hard offset shadows on interactive pieces; buttons lift and sink.
- Mono for IDs and numbers; display face only for headings.
- Made-up values say "made-up" or "sample"; estimates say "estimate".
- Text contrast is at least 4.5:1; focus rings are visible (3px, theme accent or ink).
- No third-party logos copied in unless the user supplies them; use text chips instead.
- Looked at in a browser at desktop and narrow widths, with no overlaps (tooltips, planes, labels) and no horizontal scroll.
