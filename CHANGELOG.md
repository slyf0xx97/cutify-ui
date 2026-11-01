# Changelog

All notable changes to cutify-ui are listed here. The project uses [semantic versioning](https://semver.org).

## [Unreleased]

### Changed

- The plugin now lives in `plugin/`, with the skill in `plugin/skills/cutify-ui/`. Installing it downloads about 350 KB of skill files and leaves out the gallery, examples and tooling. `plugin/README.md` lists what the plugin contains, runs and sends.

### Fixed

- Pages could scroll sideways on phones when a grid column was a bare `1fr`, because the column can't shrink below its widest child. `SKILL.md` now asks for `minmax(0, 1fr)` columns, including single-column stacks, and `scripts/lint_page.py` warns about bare `fr` columns. An evaluation run found the bug on a 390px screen, and a rerun with the fix had no overflow.

## [0.3.0] (2026-11-01)

### Added

- An "Avoid the default AI look" section in `SKILL.md` that names the common tells of generated pages, such as purple-to-blue gradients, soft-shadowed cards, emoji icons and a centred hero over three feature boxes.
- Support for a `taste.md` file of the user's likes and dislikes, which Claude reads before designing and offers to update.
- Workflow steps for writing the real copy before the layout and for checking the draft against the brief at 1440px and 390px.
- A Stripe donation link in the README, the gallery and every example footer.
- Search metadata, link previews and a sitemap for the gallery site.
- `scripts/lint_page.py`, a checker with no dependencies that Claude runs on each page it builds and fixes until it passes.
- A copyable progress checklist at the top of the workflow in `SKILL.md`.
- Install as a Claude Code plugin (`/plugin install cutify-ui --marketplace slyf0xx97/cutify-ui`) or with `npx skills add slyf0xx97/cutify-ui`.
- Repo checks for valid CSS, smooth animation loops, page weight, React rendering and accessible markup, and the plugin manifests.

### Changed

- The README is reorganised around features, with a contents list.
- The example pages use pixel icons instead of emoji, and their spacing was reviewed at 375px to 1440px.
- The wording across the skill, references and docs is plainer.
- The skill description is in the third person, as Anthropic's authoring guide asks.
- The Apron theme's pulse, runway lights and taxiing plane move only `transform` and `opacity`, so they no longer repaint every frame, and they stop when reduced motion is on.

## [0.2.0] (2026-11-01)

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
- README:
  - corrected the network wording (pages load Google Fonts)
  - added a self-hosting note, a non-affiliation notice and full copyright names
- All six themes now define the same contract variables (`--bg`, `--surface`, `--accent`, `--display`, `--body`, `--mono` and more) and base classes, checked in CI. Apron's text colour `--body` is now `--body-ink`.
- `assets/react/cutify-react.css` styles `WordTip`, `Popup` and `StageHeader` for any theme, and `WordTip` takes a `label` for icon triggers.
- Component recipes use the contract variables, and the tooltip recipe is a labelled button linked with `aria-describedby` that opens on hover, focus and tap.
- `SKILL.md` additions:
  - output sized to the request
  - a default when two themes fit
  - guidance for mobile, dark mode and performance
  - per-theme depth in the checklist
- Examples changed after a cold design review:
  - accessible tooltips on every page
  - redrawn Pantry Pals sprites
  - readable Moonlit Market characters
  - real dishes in Sunday Spread
  - name chips beside their sprites
  - plain bricks in Beep & Build
  - new hero layouts for Gridline and StudyBuddy
- Two new evals check theme choice on an open brief and keeping a small request small.

## [0.1.0] (2026-10-31)

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
