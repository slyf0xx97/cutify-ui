# Contributing to cutify-ui

Thanks for helping. New themes, components, animation engines and gallery examples are all welcome.

## Before you start

- Open an issue first for anything bigger than a fix, so we can agree on the shape. There are templates for bugs, ideas and new examples.
- Read `SKILL.md`. The grammar section is the part every change has to keep: a cast of pixel characters taken from the brief, numbered stages, tooltips that explain why, physical depth in the theme's own style, motion that explains, and honest labels.

## Ground rules

- **Original work only.** No third-party logos, brand marks, character art or copied site code. Fonts must be under the SIL Open Font License or similar, loaded from Google Fonts or bundled with their licence.
- **Accessible by default.** Text contrast of at least 4.5:1, visible focus rings, keyboard-reachable tooltips, `prefers-reduced-motion` support, and no state shown by colour alone.
- **Plain words.** Copy follows `references/voice.md`: second person, sentence case, no marketing filler, no middle-dot separators.
- **Small files.** Keep `SKILL.md` under 500 lines and put detail in `references/`. Claude reads only what a request needs.

## Adding a theme

1. Add its tokens and base components as `assets/<theme>.css`, keeping the variable roles listed at the end of `references/themes.md`.
2. Document it in `references/themes.md` with its colours, type, surfaces and signature details.
3. Add at least one example built with it.

## Adding an example

1. Create `examples/<name>/index.html`, fully self-contained apart from Google Fonts. React examples also include their source tree and a static `index.html` copy.
2. Label every made-up value as sample data.
3. Run the layout QA (below) and look at its screenshots: no overlaps, no clipped tooltips, no sideways scroll, no console errors.
4. Add `examples/<name>/README.md` with the brief, then take the gallery screenshot with `node shots.mjs http://127.0.0.1:8811 <name>`.
5. Add a card to `index.html`, an entry to `tools/readme_gallery.py`, then run `python tools/readme_gallery.py` and `python tools/make_cover.py`.

## Checks

CI runs on every push and pull request. You can run the same checks locally:

```bash
cd tools && npm install && npm run check
```

They type-check the React components in strict mode, syntax-check every JavaScript and Python file, check `SKILL.md` frontmatter and size, and make sure every example has its page, README and screenshot.

### Layout QA

```bash
cd tools && npm install && npx playwright install chromium
python -m http.server 8811 --bind 127.0.0.1   # from the repo root, in another terminal
node qa.mjs                                     # or: node qa.mjs http://127.0.0.1:8811 <name>
```

It loads every page at 375, 768, 1280 and 1440px and reports sideways overflow, overlapping or clipped text, tooltips that leave the screen or get covered, dialogs that don't fit, console errors, fonts that didn't load and low contrast. Screenshots and `results.json` go to `tools/qa-output/`.

Some flags are expected and can be ignored after a look at the screenshot: number badges that hang outside a card on purpose, a marquee that runs past the edge, a chat log that scrolls, and contrast readings over patterned backdrops, where the script can take a star or a dot for the background.

## Commits and pull requests

Write commit messages in plain English that say what changed. Fill in the pull request template, including before and after screenshots for anything visual.
