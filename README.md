<p align="center"><img src="docs/gallery/cover.png" alt="cutify-ui: twelve example sites built by Claude with the skill, from a gingham potluck planner to a lantern-lit night market" width="820"></p>

# 🧸 cutify-ui

**A Claude skill for cute, game-like web pages with pixel characters, story stages and motion that shows your product at work.**

[![Live gallery](https://img.shields.io/badge/gallery-slyf0xx97.github.io%2Fcutify--ui-ff8fab?style=flat-square)](https://slyf0xx97.github.io/cutify-ui/)
[![Release](https://img.shields.io/github/v/release/slyf0xx97/cutify-ui?style=flat-square&color=e8912d)](https://github.com/slyf0xx97/cutify-ui/releases/latest)
![License](https://img.shields.io/badge/license-MIT-167a66?style=flat-square)
![Agent skill](https://img.shields.io/badge/agent-skill-7a5af8?style=flat-square)
![React 19](https://img.shields.io/badge/React-19-1f2430?style=flat-square)
![Plain HTML](https://img.shields.io/badge/plain-HTML%2FCSS%2FSVG-2b8fb3?style=flat-square)
[![CI](https://img.shields.io/github/actions/workflow/status/slyf0xx97/cutify-ui/ci.yml?style=flat-square&label=checks)](https://github.com/slyf0xx97/cutify-ui/actions)
[![Support](https://img.shields.io/badge/support-Stripe-635bff?style=flat-square)](https://donate.stripe.com/00w4gr2TU7wC52iaXf18c01)

cutify-ui is an open-source [Claude skill](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview). Ask Claude for a landing page, a product demo or a portfolio, and the skill gives it six themes, ready components and animation patterns to build from. It works in Claude Code, Claude.ai and the Claude API, and builds in React and Next.js or in plain HTML, CSS and SVG.

🌐 See all twelve examples in the [live gallery](https://slyf0xx97.github.io/cutify-ui/).

<p align="center"><img src="docs/gallery/demo.gif" alt="Six example pages in turn, one per theme: StudyBuddy, Fleet Queue, Sunday Spread, Zine Night, Moonlit Market and Beep and Build, each with its pixel characters moving" width="720"><br><sub>Six of the twelve examples, one per theme, recorded at 1280px.</sub></p>

## Contents

- [Install](#%EF%B8%8F-install)
- [Why it doesn't look AI-made](#-why-it-doesnt-look-ai-made)
- [Features](#-features)
- [Gallery](#%EF%B8%8F-gallery)
- [Themes](#-themes)
- [Sample prompts](#-sample-prompts)
- [What's inside](#-whats-inside)
- [Testing and validation](#-testing-and-validation)
- [Privacy and limits](#%EF%B8%8F-privacy-and-limits)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

## 🛠️ Install

In Claude Code, paste this one line into the chat:

```
/plugin install cutify-ui --marketplace slyf0xx97/cutify-ui
```

For Cursor, Codex, Gemini CLI or another coding agent, run this one line in your terminal and pick your agent:

```bash
npx skills add slyf0xx97/cutify-ui
```

That's all. Ask for a cute landing page and your agent uses the skill on its own.

<details>
<summary>Claude.ai, the Claude API and older versions of Claude Code</summary>

- Claude.ai: download `cutify-ui.zip` from the [latest release](https://github.com/slyf0xx97/cutify-ui/releases/latest) and upload it under Settings → Capabilities → Skills.
- Claude API: upload the same zip with the Skills API and attach it to your requests.
- Claude Code older than 2.1.275: run `/plugin marketplace add slyf0xx97/cutify-ui`, then `/plugin install cutify-ui@cutify-ui`.

</details>

## 🙅 Why it doesn't look AI-made

Pages that Claude designs on its own often look alike, because it falls back on the safest choice for every font, colour and layout. cutify-ui makes those choices before Claude writes any CSS:

- Each theme fixes exact fonts, hex colours and one kind of depth, so Claude never has to guess at "modern".
- The skill names the usual tells and tells Claude to avoid them: purple-to-blue gradients, soft-shadowed rounded cards everywhere, emoji as icons, a centred hero over three feature boxes, Inter as the headline font and lorem ipsum.
- Claude writes the real copy from your brief before the layout, and labels anything made up as "sample".
- If your project has a `taste.md` file of things you like and dislike, Claude reads it first and offers to add your reactions to it.
- Before showing you a page, Claude checks the draft against your brief and the list of tells, then screenshots it at 1440px and 390px.

## ✨ Features

Look and feel

- 🎨 Six themes, each with its own fonts, palette and kind of depth: Glass, Apron, Picnic, Riso Club, Lantern Night and Toy Box.
- 🧺 19 backdrops in pure CSS or inline SVG, from gingham and riso grain to a starry dusk and 1-bit dither, with a guide for picking one that fits the product.
- 🔤 Ten font pairings. Every font is under the SIL Open Font License, and the guide says which faces stay readable at small sizes.

Characters and story

- 👾 Pixel sprites drawn as text grids that render as crisp SVG at any size. Single pixels can blink or wave.
- 🗺️ Numbered stages that walk a visitor through the product in order.
- 🏷️ AI and You tags with a shape for each character, so nobody has to tell characters apart by colour alone.

Motion

- ✈️ Sprites that follow a real drawn route, using CSS `offset-path`.
- ⏯️ Five ways to animate a product at work, such as a story you can replay, a clock-driven simulation and a journey that follows your scroll.
- 🍬 Ten small interactions, including a ledge press, a peel corner, typing dots and confetti.
- 🧘 Every animation stops for visitors who ask for reduced motion, and pauses when it's off screen.

Components

- 💬 Tooltips that open on hover, keyboard focus and tap, with labels that screen readers can read.
- 🎮 Buttons, pills, meters, number tiles, small SVG charts, native `<dialog>` modals and loading screens.
- ⚛️ Typed React 19 components (`PixelSprite`, `PixelIcon`, `Popup`, `WordTip`, `StageHeader` and `KindChip`) that pass strict type-checking.
- 🐍 Helpers for hosting the pages inside Streamlit.

## 🖼️ Gallery

Claude built each example with the skill from a brief of a few sentences, then checked it in a browser at widths from 375px to 1440px. The first six briefs described only the product and its characters. The newer six also named a theme or palette, to show each one. Click a picture to open the page, or open its folder to read the exact brief.

<!-- GALLERY:START -->
<table>
<tr><td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/examples/studybuddy/"><img src="docs/gallery/studybuddy.png" alt="StudyBuddy"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/studybuddy/">StudyBuddy</a></b> (<a href="examples/studybuddy">source</a>)<br>Three AI tutors plan, quiz and check in. You approve the week.<br><sub>🪟 Glass, HTML</sub></td><td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/examples/fleet-queue/"><img src="docs/gallery/fleet-queue.png" alt="Fleet Queue"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/fleet-queue/">Fleet Queue</a></b> (<a href="examples/fleet-queue">source</a>)<br>Warehouse robots plan the order queue, code blocks unsafe moves, a manager approves.<br><sub>🛫 Apron, HTML</sub></td></tr>
<tr><td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/examples/sunday-spread/"><img src="docs/gallery/sunday-spread.png" alt="Sunday Spread"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/sunday-spread/">Sunday Spread</a></b> (<a href="examples/sunday-spread">source</a>)<br>A Host and a Baker plan a potluck so nothing doubles up. You confirm the menu.<br><sub>🧺 Picnic, HTML</sub></td><td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/examples/zine-night/"><img src="docs/gallery/zine-night.png" alt="Zine Night"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/zine-night/">Zine Night</a></b> (<a href="examples/zine-night">source</a>)<br>The Curator draws a route through a 40-table zine fair. You star tables and print the map.<br><sub>🖨️ Riso Club, HTML</sub></td></tr>
<tr><td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/examples/moonlit-market/"><img src="docs/gallery/moonlit-market.png" alt="Moonlit Market"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/moonlit-market/">Moonlit Market</a></b> (<a href="examples/moonlit-market">source</a>)<br>A Scout and a Queue Guesser plan a night-market food crawl under swaying lanterns.<br><sub>🏮 Lantern Night, HTML</sub></td><td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/examples/beep-and-build/"><img src="docs/gallery/beep-and-build.png" alt="Beep and Build"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/beep-and-build/">Beep &amp; Build</a></b> (<a href="examples/beep-and-build">source</a>)<br>Kids snap code blocks to guide Bolt the robot. Every solved level adds a brick to the tower.<br><sub>🧱 Toy Box, HTML, playable</sub></td></tr>
<tr><td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/examples/sprout/"><img src="docs/gallery/sprout.png" alt="Sprout"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/sprout/">Sprout</a></b> (<a href="examples/sprout">source</a>)<br>Dr. Leaf diagnoses your plant, Drip plans the watering, and the plant perks up.<br><sub>🪟 Glass, HTML</sub></td><td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/examples/gridline/"><img src="docs/gallery/gridline.png" alt="Gridline"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/gridline/">Gridline</a></b> (<a href="examples/gridline">source</a>)<br>A microgrid control room on a heatwave evening, with power flowing along the wires.<br><sub>🛫 Apron, electric palette, HTML</sub></td></tr>
<tr><td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/examples/snooze-log/"><img src="docs/gallery/snooze-log.png" alt="Snooze Log"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/snooze-log/">Snooze Log</a></b> (<a href="examples/snooze-log">source</a>)<br>A sleep journal with a cat that dozes when you don't. The Night Owl suggests one small change.<br><sub>🌙 Custom: Sleepy Dusk, HTML</sub></td><td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/examples/penpal-post/"><img src="docs/gallery/penpal-post.png" alt="Penpal Post"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/penpal-post/">Penpal Post</a></b> (<a href="examples/penpal-post">source</a>)<br>Write to a penpal in Japan. A Translator and a Postie help, then the letter folds and flies off.<br><sub>🍓 Custom: Strawberry Milk + Kawaii JP, HTML</sub></td></tr>
<tr><td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/examples/pantry-pals/"><img src="docs/gallery/pantry-pals.png" alt="Pantry Pals"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/pantry-pals/">Pantry Pals</a></b> (<a href="examples/pantry-pals">source</a>)<br>A Chef and a Shopper plan your week from what's in the fridge.<br><sub>🪟 Glass, Next.js + static copy</sub></td><td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/examples/portfolio/"><img src="docs/gallery/portfolio.png" alt="Sam Sample, portfolio"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/portfolio/">Sam Sample, portfolio</a></b> (<a href="examples/portfolio">source</a>)<br>A sample designer portfolio where the avatar walks a trail as you scroll.<br><sub>🪟 Glass, HTML, no AI</sub></td></tr>
</table>
<!-- GALLERY:END -->

## 🎨 Themes

| Theme | Look | Display font | Depth | Good for |
|---|---|---|---|---|
| 🪟 Glass | Frosted glass over painted scenery | Pixelify Sans | Hard sticker shadow | Consumer apps, careers, outdoors |
| 🛫 Apron | Airfield signage on a dark dot grid | Anybody | Hard sticker shadow | Operations, control rooms, data |
| 🧺 Picnic | Gingham under napkin cards | Fredoka | Soft blanket shadow | Food, weekends, family |
| 🖨️ Riso Club | Newsprint and halftone | Bricolage Grotesque | A pink and blue shadow like a slipped print | Events, zines, portfolios |
| 🏮 Lantern Night | Dusk sky over a dithered skyline | Jersey 10 | Lantern glow and stepped pixel borders | Night, sleep, games |
| 🧱 Toy Box | Plastic cards on graph paper | Dela Gothic One | A ledge that presses down | Kids, learning, building |

Glass and Apron come from [itsa10but](https://ghernie.com/projects/itsa10but), a résumé reviewer, and [SkyQueue](https://skyqueue.ghernie.com), a multi-agent airport queue planner. The other four came from a survey of playful sites, games and type, and the [inspiration library](docs/INSPIRATION.md) lists every source and what each one taught us.

All six themes share the same variable and class names, so a component written for one works in the others.

## 💬 Sample prompts

Each prompt below ran in Claude Code with cutify-ui installed. On the left is the session, redrawn from its log with nothing reworded. On the right is the page it built, unedited, and clicking it opens the page live.

### 1. A landing page for a study app

```
Use the cutify-ui skill. Make a cute landing page for my study app with three AI tutors. Write it as a single index.html in the current folder.
```

<table><tr>
<td width="50%" valign="top"><img src="docs/prompts/studybuddy-prompt-terminal.png" alt="The Claude Code session for this prompt"></td>
<td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/prompts/studybuddy-prompt/"><img src="docs/prompts/studybuddy-prompt-result.png" alt="The page Claude built for this prompt"></a></td>
</tr></table>

Claude picked Glass: "I used the Glass theme because the skill matches it to learning apps." About 6 minutes.

### 2. A dark demo for warehouse robots

```
Build a dark control-room demo for our warehouse robots, with sample numbers. Write it as a single index.html in the current folder.
```

<table><tr>
<td width="50%" valign="top"><img src="docs/prompts/warehouse-prompt-terminal.png" alt="The Claude Code session for this prompt"></td>
<td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/prompts/warehouse-prompt/"><img src="docs/prompts/warehouse-prompt-result.png" alt="The page Claude built for this prompt"></a></td>
</tr></table>

Claude picked Apron, "the skill's pick for operations/data", built it as an app screen and fixed its own phone overflow. About 5 minutes.

### 3. A pre-order page for a bakery

```
Use the cutify-ui skill. Make a cosy pre-order page for my neighbourhood bakery, with one AI helper that suggests what to bake. Write it as a single index.html in the current folder.
```

<table><tr>
<td width="50%" valign="top"><img src="docs/prompts/bakery-prompt-terminal.png" alt="The Claude Code session for this prompt"></td>
<td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/prompts/bakery-prompt/"><img src="docs/prompts/bakery-prompt-result.png" alt="The page Claude built for this prompt"></a></td>
</tr></table>

Claude picked Picnic "because a bakery is about food" and swapped the gingham for a terrazzo counter. About 6 minutes.

### 4. Just one component

```
Just a Toy Box pricing card for my budgeting app, please. Write it as a single index.html in the current folder.
```

<table><tr>
<td width="50%" valign="top"><img src="docs/prompts/pricing-prompt-terminal.png" alt="The Claude Code session for this prompt"></td>
<td width="50%" valign="top"><a href="https://slyf0xx97.github.io/cutify-ui/prompts/pricing-prompt/"><img src="docs/prompts/pricing-prompt-result.png" alt="The page Claude built for this prompt"></a></td>
</tr></table>

Claude built only the card, with a yellow brick for the plan name and a button that presses down. About 1 minute.

### The same prompt on three models

Anthropic suggests testing a skill on every model you plan to use, so the pricing-card prompt also ran on Sonnet and Haiku. All three loaded the skill and passed the page linter.

| Model | Time | What it built |
|---|---|---|
| Opus 5.5 | 65 s | [One card](https://slyf0xx97.github.io/cutify-ui/prompts/pricing-prompt/) with a brick-shaped plan name and a piggy bank |
| Sonnet 5.5 | 44 s | [One centred card](https://slyf0xx97.github.io/cutify-ui/prompts/pricing-prompt-sonnet/) with a monthly and yearly switch |
| Haiku 5.5 | 54 s | [Three plans and a heading](https://slyf0xx97.github.io/cutify-ui/prompts/pricing-prompt-haiku/), more than the prompt asked for |

### What these runs showed

- The study-app and bakery prompts needed "Use the cutify-ui skill." at the start, because Claude reached for other installed skills first. The skill's description now leads with requests like these. Two new prompts in the same style, for a language-learning app and a cake stall, then loaded cutify-ui without being told to.
- The study-app page has one linter failure, a sprite that moves with `left` instead of `transform`. The other five pages passed.
- The runs used the author's own Claude Code setup, with other plugins installed, so a clean install may behave a little differently.

### Tips

Claude picks a theme that fits the product and tells you which one it chose. Name a theme in your request if you want a particular look, or ask for three directions to choose from. A screenshot of a site you like also helps, because Claude carries over its spacing and type sizes.

To steer every page the same way, keep a `taste.md` file in your project with notes like "too busy", "love this spacing" or a link to a site you like.

## 📁 What's inside

```
SKILL.md                 when to use the skill, the design rules, the workflow and a final checklist
references/
  themes.md              the six themes, their palettes, and how to make your own
  backgrounds.md         19 backdrops and how to choose one
  fonts.md               font pairings and readability rules
  pixel-art.md           sprites, pixel icons and designing characters
  motion.md              motion rules, animation patterns and small interactions
  components.md          tooltips, buttons, stage headers, number tiles, charts, dialogs and loaders
  react.md               React 19 and Next.js patterns
  streamlit.md           plain HTML pages and hosting them in Streamlit
  voice.md               how labels and copy should read
scripts/
  lint_page.py           checks a finished page for the problems the skill rules out
assets/
  <theme>.css            one stylesheet per theme, all with the same class names
  pixel-sprites.js       turns text grids into crisp SVG sprites
  react/                 typed React 19 components and their stylesheet
  streamlit/             helpers for hosting pages in Streamlit
examples/                the twelve gallery pages, each with its brief
docs/INSPIRATION.md      the sources behind the themes
evals/                   test prompts and graders for the skill
tools/                   repo checks, layout QA and gallery screenshot scripts
```

## 🧪 Testing and validation

### Automatic checks

Every push runs these checks on GitHub Actions, and you can run them yourself with `cd tools && npm install && npm run check`.

| Area | What's checked | How |
|---|---|---|
| Skill file | `SKILL.md` has the right name, a description under 1,024 characters, fewer than 500 lines, and every file it mentions exists | [`check.mjs`](tools/check.mjs) |
| Themes | All six theme stylesheets define the same 14 variables and 11 classes, so a component works in any theme | [`check.mjs`](tools/check.mjs) |
| CSS | Every stylesheet and every `<style>` block in the gallery and examples is valid CSS | [csstree-validator](https://github.com/csstree/validator) |
| Smooth motion | No animation loop changes `box-shadow`, `filter`, `background-position` or layout properties, which make the browser repaint every frame | [`check.mjs`](tools/check.mjs) |
| Page linter | [`lint_page.py`](scripts/lint_page.py), the script the skill has Claude run on each page it builds, passes on every example and the gallery | Python, no packages |
| React types | The React 19 components pass TypeScript in strict mode | `tsc --strict` |
| React rendering | Each component renders, and its markup is accessible: sprites have `role="img"` and a label, tooltip triggers are labelled buttons that point at a tip that exists, and modals use a native `<dialog>` | [`react-test.mjs`](tools/react-test.mjs) |
| JavaScript and Python | Every `.js`, `.mjs` and `.py` file parses | `node --check`, `py_compile` |
| Examples | Each example has its page, README and screenshot, stops moving for reduced motion, labels made-up data as "sample", and loads nothing from outside except fonts | [`check.mjs`](tools/check.mjs) |
| Page weight | Each example page is under 150 KB before fonts | [`check.mjs`](tools/check.mjs) |
| Plugin | The Claude Code plugin and marketplace files pass strict validation, their names match, and the version matches the changelog | `claude plugin validate --strict` |

<details>
<summary>Output of the last <code>npm run check</code></summary>

```
SKILL.md
  ✓ name is cutify-ui
  ✓ description is 930 characters
  ✓ 159 lines (under 500)
  ✓ every path SKILL.md mentions exists
  ✓ all six themes define the shared contract variables and classes
TypeScript (strict)
  ✓ assets/react type-checks
React render test
  ✓ PixelSprite renders
  ✓ PixelSprite (decorative) renders
  ✓ PixelIcon renders
  ✓ KindChip renders
  ✓ StageHeader renders
  ✓ WordTip renders
  ✓ Popup renders
JavaScript and Python syntax
  ✓ all .js files parse
  ✓ 5 Python files compile
Examples
  ✓ beep-and-build has its page, README and screenshot
  ✓ fleet-queue has its page, README and screenshot
  ✓ gridline has its page, README and screenshot
  ✓ moonlit-market has its page, README and screenshot
  ✓ pantry-pals has its page, README and screenshot
  ✓ penpal-post has its page, README and screenshot
  ✓ portfolio has its page, README and screenshot
  ✓ snooze-log has its page, README and screenshot
  ✓ sprout has its page, README and screenshot
  ✓ studybuddy has its page, README and screenshot
  ✓ sunday-spread has its page, README and screenshot
  ✓ zine-night has its page, README and screenshot
CSS
  ✓ 21 stylesheets and <style> blocks are valid CSS
Smooth motion
  ✓ every @keyframes animates only transform, opacity or other cheap properties
Page linter
  ✓ scripts/lint_page.py passes on 13 pages
Page weight
  ✓ every example page is under 150 KB before fonts
Plugin manifest
  ✓ plugin and marketplace names match
  ✓ plugin version 0.3.0 matches the changelog
  ✓ plugin icon exists
Copy
  ✓ no middle-dot separators in the main copy
All checks passed.
```

</details>

### Layout checks

[`qa.mjs`](tools/qa.mjs) opens every example in Chromium at 375px, 768px, 1280px and 1440px. It reports sideways scrolling, overlapping or clipped text, tooltips that leave the screen or get covered, dialogs that don't fit, console errors, fonts that didn't load and low contrast. [CONTRIBUTING.md](CONTRIBUTING.md#layout-qa) explains how to read its report.

### Prompt tests

The skill was tested the way Anthropic's skill-creator suggests. The same prompts ran with and without the skill, and each page was graded on checks such as crisp pixel art, reduced motion, AI and You tags, numbered stages and keyboard tooltips.

| Test prompt | With cutify-ui | Without |
|---|---|---|
| StudyBuddy landing page (HTML) | 6 / 6 | 2 / 6 |
| Warehouse robot demo, dark (HTML) | 9 / 9 | 3 / 9 |
| Pantry Pals meal planner (Next.js) | 6 / 7 | 3 / 7 |

Two later tests checked how the skill picks a theme and how much it builds:

| Test prompt | Result |
|---|---|
| A bakery pre-order page with one AI helper, no theme named | Picked Picnic, said why, and kept to the two characters in the brief (4 / 4) |
| Just a Toy Box pricing card | Built only the card, in Toy Box fonts with a ledge button (3 / 3) |

Each prompt ran once, so read these numbers as a direction, not a benchmark. The prompts and graders are in [`evals/`](evals).

## 🛡️ Privacy and limits

What the skill does

- It's instructions plus CSS and small JavaScript, TypeScript and Python files. It holds no keys and sends no data anywhere.
- The theme stylesheets load fonts from Google Fonts, so every visitor's browser asks Google for the font files and shares its IP address with Google. If that matters for your users, for example under the GDPR, host the fonts yourself as `references/themes.md` describes.
- The characters, icons, scenes and example data were drawn or written for this project. The skill leaves out third-party logos and tells Claude not to add them.

What to expect

- Claude still makes the final design decisions, so results vary with the prompt and the model.
- A page with a lot of animation took Claude about 5 to 10 minutes to build and check.
- The examples were checked in Chromium. They weren't tested in Safari or Firefox, or with a screen reader.

## 🤝 Contributing

New themes, components and examples are welcome. [CONTRIBUTING.md](CONTRIBUTING.md) explains how to add each one and how to run the checks.

- Issues labelled [good first issue](https://github.com/slyf0xx97/cutify-ui/labels/good%20first%20issue) are small and well described, such as testing the examples in Safari or with a screen reader.
- Ask questions or share a page you built in [Discussions](https://github.com/slyf0xx97/cutify-ui/discussions).
- Everyone taking part follows the [code of conduct](CODE_OF_CONDUCT.md).
- Report security problems privately, as [SECURITY.md](SECURITY.md) describes.

## 💖 Support

If cutify-ui saves you time, you can [support it through Stripe](https://donate.stripe.com/00w4gr2TU7wC52iaXf18c01). You choose the amount on Stripe's own checkout page, and the gallery and every example page have the same link in their footer.

## 📄 License

MIT, copyright 2026 [Ghernie Encinas](https://www.linkedin.com/in/ghernie). See [LICENSE](LICENSE).

Every font the skill uses comes from Google Fonts under the SIL Open Font License 1.1, and [`references/fonts.md`](references/fonts.md) lists them with links. If you host the fonts yourself, keep each font's `OFL.txt` file with them.

cutify-ui is an independent project and isn't affiliated with or endorsed by Anthropic. Claude is a trademark of Anthropic. The product and character names in the examples (StudyBuddy, Fleet Queue, Sprout, Gridline, Pantry Pals, Sunday Spread, Zine Night, Moonlit Market, Beep & Build, Snooze Log, Penpal Post and Sam Sample) are made up and don't refer to real products or people.
