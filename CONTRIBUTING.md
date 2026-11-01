# Contributing to cutify-ui

Thanks for helping. New themes, components, animation engines and gallery examples are all welcome.

## Before you start

- Open an issue first for anything bigger than a fix, so we can agree on the shape. There are templates for bugs, ideas and new examples.
- Read `plugin/skills/cutify-ui/SKILL.md`. Every change has to keep the grammar section, which covers:
  - a cast of pixel characters taken from the brief
  - numbered stages
  - tooltips that explain why
  - physical depth in the theme's own style
  - motion that explains what the product does
  - labels that say who does what and what's made up

## Ground rules

- Submit original work only. No third-party logos, brand marks, character art or copied site code. Fonts must be under the SIL Open Font License or similar, loaded from Google Fonts or bundled with their licence.
- Make it accessible by default:
  - text contrast of at least 4.5:1
  - visible focus rings
  - keyboard-reachable tooltips
  - `prefers-reduced-motion` support
  - no state shown by colour alone
- Use plain words. Copy follows `references/voice.md`: second person, sentence case, no marketing filler, no middle-dot separators.
- Keep files small. `SKILL.md` stays under 500 lines and detail goes in `references/`, because Claude reads only what a request needs.

## Adding a theme

1. Add its tokens and base components as `plugin/skills/cutify-ui/assets/<theme>.css`, keeping the variable roles listed at the end of `references/themes.md`.
2. Document it in `plugin/skills/cutify-ui/references/themes.md` with its colours, type, surfaces and signature details.
3. Add at least one example built with it.

## Adding an example

1. Create `examples/<name>/index.html`, fully self-contained apart from Google Fonts. React examples also include their source tree and a static `index.html` copy.
2. Label every made-up value as sample data.
3. Run the layout QA (below) and look at its screenshots: no overlaps, no clipped tooltips, no sideways scroll, no console errors.
4. Add `examples/<name>/README.md` with the brief, then take the gallery screenshot with `node shots.mjs http://127.0.0.1:8811 <name>`.
5. Record the moving preview with `node make_gif.mjs http://127.0.0.1:8811 examples/<name>/ ../docs/gallery/<name>.gif,../docs/gallery/<name>.mp4 560 4`. It needs ffmpeg, either on your PATH or named in the `FFMPEG` environment variable. If you have gifsicle, name it in `GIFSICLE` and the GIF comes out about half the size.
6. Add a card to `index.html`, an entry to `tools/readme_gallery.py`, then run `python tools/readme_gallery.py`.

## Checks

CI runs on every push and pull request. You can run the same checks locally:

```bash
cd tools && npm install && npm run check
```

The checks:

- type-check the React components in strict mode
- syntax-check every JavaScript and Python file
- check the `SKILL.md` frontmatter and size
- make sure every example has its page, README and screenshot

### Layout QA

```bash
cd tools && npm install && npx playwright install chromium
python -m http.server 8811 --bind 127.0.0.1   # from the repo root, in another terminal
node qa.mjs                                     # or: node qa.mjs http://127.0.0.1:8811 <name>
```

It loads every page at 375, 768, 1280 and 1440px and reports:

- sideways overflow
- overlapping or clipped text
- tooltips that leave the screen or get covered
- dialogs that don't fit
- console errors
- fonts that didn't load
- low contrast

Screenshots and `results.json` go to `tools/qa-output/`.

To check Firefox and WebKit (Safari's engine) as well, run `npx playwright install firefox webkit` once, then `node xbrowser.mjs http://127.0.0.1:8811`. It loads every example at 375px and 1280px and lists page errors and sideways scrolling, with screenshots in `tools/qa-output/xbrowser/`.

Some flags are expected, and you can ignore them after a look at the screenshot:

- number badges that hang outside a card on purpose
- a marquee that runs past the edge
- a chat log that scrolls
- contrast readings over patterned backdrops, where the script can take a star or a dot for the background

## Commits and pull requests

Write commit messages in plain English that say what changed. Fill in the pull request template, including before and after screenshots for anything visual.
