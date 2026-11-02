# Changelog

All notable changes to cutify-ui are listed here. The project uses [semantic versioning](https://semver.org).

## [0.6.0] (2026-11-02)

### Added

- `references/cast.md`, a method for drawing an original pixel cast from each brief: five body plans, 30 role cues that turn what an actor does into a prop or hat, six states built from one grid, rules that tell AI, You and Code apart without colour, and a worked example. The skill still has no ready-made characters.
- `references/stories.md`, 12 story templates for the stages and Play sample, such as an agent hand-off, onboarding, approval, checkout, order tracking and a pipeline, each with a reduced-motion version.
- `references/stacks.md`, adding Vue 3, Svelte 5, Astro and Tailwind CSS v4. Each new stack has a test prompt, and all four projects built, type-checked where the stack has a checker, and loaded with no errors at 390px and 1280px.

### Changed

- The skill description names the new stacks and the story templates.

## [0.5.1] (2026-11-01)

### Changed

- Each release zip now comes with a signed build-provenance attestation (`cutify-ui.zip.intoto.jsonl`), so you can check it was built by this repo's release workflow. Run `gh attestation verify cutify-ui.zip -R slyf0xx97/cutify-ui` to confirm.
- The security policy gives an email address, response times and a disclosure process.
- The repo runs OpenSSF Scorecard and CodeQL code scanning, pins every workflow action to a commit, and has a `CITATION.cff` file.

 (2026-11-01)

### Added

- `assets/starter.html`, a page skeleton that works with every theme. Claude pastes in the theme and replaces the placeholders, so every page starts with the tooltip wiring, confirm dialog, How it works route, reduced motion and phone-safe grid columns in place. It loads with no errors or sideways scroll in all six themes at 390px and 1280px.
- New linter checks: pixel sprite rows of the wrong width, script syntax errors (parsed with Node when it's installed, never run), fixed widths and grid minimums too wide for a phone, and a self-test in `tools/lint-test.py` that runs with the repo checks.
- Guidance to give rules short IDs, such as `AISLE-01`, beside a plain-English line, so a blocked plan can name the rule it broke.
- Two test cases for a clickable app prototype and a process flow with rules, an accessibility audit (`tools/a11y.mjs`, axe-core with WCAG 2.1 A and AA rules) and a starter check (`tools/starter-check.mjs`).

### Changed

- The skill description now names event and game-jam sites, mini-games, prototypes, animated explainers and process flows, and says the six themes are a starting point. In a 20-prompt test it triggered on 20 of 20, up from 19.

### Fixed

- Sprout's "You" tags were grey on orange at a 3.76:1 contrast, because a more specific rule overrode their colour. They now pass WCAG AA, and every example passes the accessibility audit.

## [0.4.0] (2026-11-01)

### Added

- Six new gallery examples that go beyond AI-helper pages, and none of them has AI in the product: Pocket Money (a phone app prototype with a flow diagram), Ship It (a CI/CD pipeline explainer), Tally (an expense approval workflow), Parcel Pigeon (delivery tracking on a hand-drawn map), Pixel Fest (an event site with a playable mini-game) and Ramen Route (a staff training flow). Three use themes made up from the brief: Terminal Candy, Arcade Night and Noren.

### Changed

- The Stripe link is now a tip, not a donation, with a new `buy.stripe.com` address. The old address still opens the same checkout. The gallery footer and README give a contact email and a 30-day refund rule for tips made by mistake.
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
