# Changelog

All notable changes to cutify-ui are listed here. The project uses [semantic versioning](https://semver.org).

## [0.2.0] - 2026-11-01

### Added

- Four new themes, each with its own stylesheet and shadow language: Picnic (`assets/picnic.css`), Riso Club (`assets/riso.css`), Lantern Night (`assets/lantern.css`) and Toy Box (`assets/toybox.css`).
- `references/backgrounds.md`: 19 pure-CSS and inline-SVG backdrops, with a guide for choosing one per product.
- `references/fonts.md`: ten font pairings, every font checked as SIL OFL 1.1, with readability rules for pixel, handwritten and single-weight faces.
- Eight palettes with calculated contrast in `references/themes.md`, and ten micro-interactions in `references/motion.md`.
- Six new examples: Sunday Spread, Zine Night, Moonlit Market, Beep & Build (playable), Snooze Log and Penpal Post (Japanese text).
- `docs/INSPIRATION.md`: the sources behind the themes and what was taken from each.
- Tools: `qa.mjs` (layout QA at four widths), `shots.mjs` (gallery screenshots), `make_cover.py` and `readme_gallery.py`.

### Changed

- `SKILL.md` now asks Claude to pick a theme, backdrop and font pairing for each product, and to build only the cast the brief describes.
- The first six examples passed a layout QA at 375 to 1440px: 13 fixes to tooltips, tables, charts and sticky-nav anchors.
- The sample portfolio's character is now Sam Sample, an obviously made-up name.
- README: corrected the network wording (pages load Google Fonts), added a self-hosting note, a non-affiliation notice and full copyright names.
- All six themes now define the same contract variables (`--bg`, `--surface`, `--accent`, `--display`, `--body`, `--mono` and more) and base classes, checked in CI. Apron's text colour `--body` is now `--body-ink`.
- `assets/react/cutify-react.css` styles `WordTip`, `Popup` and `StageHeader` for any theme; `WordTip` takes a `label` for icon triggers.
- Component recipes use the contract variables, and the tooltip recipe is a labelled button linked with `aria-describedby` that opens on hover, focus and tap.
- `SKILL.md`: output sized to the request, a default when two themes fit, guidance for mobile, dark mode and performance, and per-theme depth in the checklist.
- Examples after a cold design review: accessible tooltips on every page, redrawn Pantry Pals sprites, readable Moonlit Market characters, real dishes in Sunday Spread, name chips beside their sprites, plain bricks in Beep & Build, and new hero layouts for Gridline and StudyBuddy.
- Two new evals check theme choice on an open brief and keeping a small request small.

## [0.1.0] - 2026-10-31

First public release.

### Added

- `SKILL.md` with the cutify-ui grammar, a build workflow and a final checklist.
- Two themes: Glass (light frosted glass over painted scenery, from itsa10but) and Apron (dark airfield signage, from SkyQueue).
- References for themes, pixel art, motion, components, React, plain HTML and Streamlit, and voice.
- Assets: theme stylesheets, a pixel sprite builder with an example cast, typed React 19 components, and Streamlit helpers.
- Six gallery examples: StudyBuddy, Fleet Queue, Sprout, Gridline, Pantry Pals (Next.js) and a sample portfolio.
- Three test prompts in `evals/` with graders.
- A GitHub Pages gallery, CI checks and a release zip.

[0.2.0]: https://github.com/slyf0xx97/cutify-ui/releases/tag/v0.2.0
[0.1.0]: https://github.com/slyf0xx97/cutify-ui/releases/tag/v0.1.0
