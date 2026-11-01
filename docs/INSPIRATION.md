# Inspiration library

These sources shaped cutify-ui's themes, backgrounds, fonts and motion. The table says what stands out on each site and what idea cutify-ui took from it. cutify-ui describes ideas in its own words. It doesn't copy code, artwork, logos or text from any of these sites, and every recipe in the skill was written for this project.

All names and marks belong to their owners. Listing a site here doesn't mean its owner endorses or is connected with cutify-ui. Surveyed on 31 October 2026: sites marked *measured* were opened in a headless browser and their computed styles were read. Details marked *described* come from listings or the site's own text.

## Where cutify-ui started

| Source | What it gave cutify-ui |
|---|---|
| [itsa10but](https://ghernie.com/projects/itsa10but) by Ghernie Encinas | The Glass theme: frosted panels over painted scenery, Pixelify Sans headings, a lime highlighter, game buttons, a scroll-linked journey of walking sprites, `<dialog>` and Popover API components |
| [SkyQueue](https://skyqueue.ghernie.com) by Ghernie Encinas (Autonomous SG 2026, Airbus Challenge #2) | The Apron theme: airfield signage on a dot grid, string-grid pixel sprites, vehicles on `offset-path`, the AI / Code / You tags, the Streamlit iframe bridge |

## Reference sites

| Site | What stands out | Idea cutify-ui took | Where it shows up |
|---|---|---|---|
| [Playdate](https://play.date) by Panic | *Measured:* one typeface for everything, a warm putty background, one toy yellow and one violet accent, tiny corner radii, gently wobbling blobs | One warm neutral, one toy colour and one shock accent, plus a "1-bit screen" panel | The 1-bit dither backdrop and Lantern Night's skyline |
| [Gumroad](https://gumroad.com) | *Measured:* pill radii everywhere, a speech-bubble radius with one sharp corner, a marquee strip, numbered coin illustrations | One-sharp-corner speech bubbles, and a marquee as a section divider | Riso Club's `.marquee` and the Penpal Post tooltips |
| [Poolsuite](https://poolsuite.net) | *Measured:* a pixel-face "boot screen" in teal, cream and blush, flashing loading dots, copy that plays at retro software | A fake boot or loading stage, and flashing dots for "thinking" | Typing dots in `motion.md` |
| [Neal.fun](https://neal.fun) by Neal Agarwal | *Measured:* plain tiles with big rounded thumbnails, and a tiny persistent toy in the header that counts how often it's been watered | A small persistent toy that reacts to use, as a page's signature detail | The "idle pet" micro-interaction and Snooze Log's sleepy cat |
| [mmm.page](https://mmm.page) | *Measured:* a collage site builder with deliberately mixed fonts and many slightly rotated elements | Scrapbook layouts with cards at slight angles | The gallery page's tilted cards and the sticker-scatter backdrop |
| [San-X](https://www.san-x.co.jp/ja/) (Japanese character goods) | *Measured:* rounded Japanese and Latin fonts, a one-hue sky-blue palette on white, pill buttons, repeated inline SVG motifs | Rounded Japanese + Latin pairings, and repeating SVG motifs as wallpaper | The Kawaii JP pairing in `fonts.md` and the cloud wallpaper backdrop |
| [Josh W. Comeau](https://www.joshwcomeau.com) | *Measured:* a sky-gradient header, animations for pop and self-drawing strokes, sound effects with an off switch | Self-drawing lines for diagrams, "pop" on hover and opt-in sound | The self-drawing line micro-interaction |
| [Duolingo](https://www.duolingo.com) | *Measured:* rounded custom fonts, a pale sky background, buttons with a 4px bottom ledge they press into | The ledge button, a shadow language distinct from the sticker offset | Toy Box's ledge buttons |
| [Stardew Valley](https://www.stardewvalley.net) | *Measured:* pixel art scaled with `image-rendering: pixelated` over plain, readable body text, layered parallax hills | Pixel art for pictures only, never for paragraphs | The readability rules in `fonts.md` |
| [Bruno Simon](https://bruno-simon.com) | *Described:* a portfolio you drive through as a toy car in a 3D world (WebGL, not measured) | "The page is a playground": one pushable toy on the hero | A suggestion in `motion.md` |
| [Henry Heffernan](https://henryheffernan.com) | *Described:* a portfolio shown inside a 3D retro computer you zoom into (WebGL, not measured) | Showing the product inside a cute device frame | The CRT "screen" panel backdrop |
| [teenage engineering](https://teenage.engineering) | *Measured:* near-black and greys, small radii, almost no shadows, lowercase micro-labels | Toy-minimal restraint as a counterweight to sweet palettes | Toy Box's plain white plastic cards |
| [Tiny Glade](https://pouncelight.games/tiny-glade/) by Pouncelight | *Measured:* almost no UI, one sentence of copy, the game footage carries the page | On a cosy page, one sentence and one living scene can be enough | The "calm backdrop, one moving thing" rule in `backgrounds.md` |
| [Lapa Ninja, Illustration](https://www.lapa.ninja/category/illustration/) | *Measured:* a gallery of 1,454 illustration-led landing pages with Minimal and Creative filters | A place to browse playful landing pages | Further browsing |
| [Awwwards, Alternative Aesthetics](https://www.awwwards.com/alt_aesthetics/) | *Described:* an illustrator profile of "darkly adorable" characters with expressive lettering | Cute characters on a dark theme | Lantern Night |

## Typefaces

Every font the skill recommends is listed with its specimen link in [`references/fonts.md`](../plugin/skills/cutify-ui/references/fonts.md). All are under the SIL Open Font License 1.1, checked against the `ofl/` folders of the [google/fonts](https://github.com/google/fonts) repository on 31 October 2026. The four used by the original themes:

| Font | Designers | Licence |
|---|---|---|
| [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans) | Stefie Justprince | [SIL OFL 1.1](https://github.com/google/fonts/blob/main/ofl/pixelifysans/OFL.txt) |
| [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible) | Braille Institute, Applied Design Works | [SIL OFL 1.1](https://github.com/google/fonts/blob/main/ofl/atkinsonhyperlegible/OFL.txt) |
| [Anybody](https://fonts.google.com/specimen/Anybody) | Tyler Finck | [SIL OFL 1.1](https://github.com/google/fonts/blob/main/ofl/anybody/OFL.txt) |
| [Spline Sans Mono](https://fonts.google.com/specimen/Spline+Sans+Mono) | Eben Sorkin, Mirko Velimirović | [SIL OFL 1.1](https://github.com/google/fonts/blob/main/ofl/splinesansmono/OFL.txt) |

## Techniques

The background, palette and motion recipes in `references/` use standard CSS features (repeating gradients, conic gradients, masks, SVG `feTurbulence`, `offset-path`, the Web Animations API). They're common techniques described in [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS), written fresh for cutify-ui. Contrast ratios were calculated with the WCAG 2.x relative-luminance formula ([W3C](https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio)).

## Adding a source

When a new theme or recipe comes from looking at someone's work, add a row here: the link, what you saw, and the idea you took. Describe the idea in your own words and build it from scratch. Don't copy code, images, icons, fonts without a licence, or brand colours as a set.
