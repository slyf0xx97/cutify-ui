# cutify-ui

A Claude skill for building playful, game-like interfaces: pixel-art characters, numbered story stages, sticker shadows, tooltips on everything and motion that shows what the product does. Ask Claude for a landing page, a demo or a dashboard that should feel friendly and alive, and the skill gives it the design system, the components and the animation patterns to build it in React or plain HTML.

**[Open the live gallery →](https://slyf0xx97.github.io/cutify-ui/)**

![cutify-ui gallery](docs/gallery/cover.png)

## Gallery

Every example below was built by Claude with this skill from a short brief. Click one to open it live.

<!-- GALLERY:START -->
<table>
<tr><td width="50%"><a href="https://slyf0xx97.github.io/cutify-ui/examples/studybuddy/"><img src="docs/gallery/studybuddy.png" alt="StudyBuddy"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/studybuddy/">StudyBuddy</a></b><br>Three AI tutors plan, quiz and check in. You approve the week.<br><sub>Glass, HTML</sub></td><td width="50%"><a href="https://slyf0xx97.github.io/cutify-ui/examples/fleet-queue/"><img src="docs/gallery/fleet-queue.png" alt="Fleet Queue"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/fleet-queue/">Fleet Queue</a></b><br>Warehouse robots plan the order queue, code blocks unsafe moves, a manager approves.<br><sub>Apron, HTML</sub></td></tr>
<tr><td width="50%"><a href="https://slyf0xx97.github.io/cutify-ui/examples/sprout/"><img src="docs/gallery/sprout.png" alt="Sprout"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/sprout/">Sprout</a></b><br>Dr. Leaf diagnoses your plant, Drip plans the watering, and the plant perks up.<br><sub>Glass, HTML</sub></td><td width="50%"><a href="https://slyf0xx97.github.io/cutify-ui/examples/gridline/"><img src="docs/gallery/gridline.png" alt="Gridline"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/gridline/">Gridline</a></b><br>A microgrid control room on a heatwave evening, with power flowing along the wires.<br><sub>Apron, HTML</sub></td></tr>
<tr><td width="50%"><a href="https://slyf0xx97.github.io/cutify-ui/examples/pantry-pals/"><img src="docs/gallery/pantry-pals.png" alt="Pantry Pals"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/pantry-pals/">Pantry Pals</a></b><br>A Chef and a Shopper plan your week from what's in the fridge.<br><sub>Glass, Next.js + static copy</sub></td><td width="50%"><a href="https://slyf0xx97.github.io/cutify-ui/examples/portfolio/"><img src="docs/gallery/portfolio.png" alt="Mika Tan, portfolio"></a><br><b><a href="https://slyf0xx97.github.io/cutify-ui/examples/portfolio/">Mika Tan, portfolio</a></b><br>A sample designer portfolio where the avatar walks a trail as you scroll.<br><sub>Glass, HTML, no AI</sub></td></tr>
</table>
<!-- GALLERY:END -->

## Two themes, one grammar

The skill comes from two shipped projects that look different but follow the same rules.

| | Glass (light) | Apron (dark) |
|---|---|---|
| Feel | Frosted glass panels over painted flat-vector scenery | Airfield signage on a dark dot grid |
| Display type | Pixelify Sans | Anybody, heavy and wide |
| Labels | Atkinson Hyperlegible, bold caps | Spline Sans Mono, tiny letter-spaced caps |
| Accent | Orange buttons, lime highlighter | Taxiway yellow, hi-vis orange |
| Came from | [itsa10but](https://ghernie.com/projects/itsa10but), a résumé checker | [SkyQueue](https://skyqueue.ghernie.com), a multi-agent airport queue planner |

What every cutify-ui page shares:
- Each actor in the product (an AI helper, a robot, you) is a 16 × 16 pixel sprite with its own colour and a shape cue, so identity never rests on colour alone.
- Content is a numbered journey of stages with short imperative titles and a tooltip on each.
- Interactive pieces have hard offset "sticker" shadows; buttons lift on hover and sink on press.
- Blocks are tagged by who does them (AI, Code, You), and made-up data says it's made up.
- Motion explains the system (a robot drives the aisle, power flows to the battery), uses stepped 8-bit easing for pixel art, respects `prefers-reduced-motion` and pauses off screen.

## Install

**Claude Code**
```bash
git clone https://github.com/slyf0xx97/cutify-ui ~/.claude/skills/cutify-ui
```
Then ask for something like "make a cute landing page for my study app with three AI tutors". Claude loads the skill when a request fits.

**Claude.ai** (Settings → Capabilities → Skills): download the `cutify-ui.zip` from the latest release and upload it.

**Claude API**: upload the same zip with the Skills API and attach it to your requests.

## What's inside

```
SKILL.md                 when to use it, the grammar, the workflow and a final checklist
references/
  themes.md              tokens, fonts and surfaces for Glass and Apron, and how to make your own theme
  pixel-art.md           string-grid sprites, pixel icons, sprite sheets, designing a cast
  motion.md              motion rules, keyframes and five animation engines
  components.md          tooltips, buttons, chips, stage headers, KPI tiles, charts, dialogs, loaders
  react.md               Next.js / React 19 patterns
  streamlit.md           plain HTML pages, and hosting them inside Streamlit
  voice.md               copy and labels
assets/
  glass.css, apron.css   theme tokens and base components
  pixel-sprites.js       turns string grids into crisp SVG symbols (with an example cast)
  react/                 PixelSprite, PixelIcon, Popup, WordTip, StageHeader, KindChip, hooks
  streamlit/             page builder, iframe bridge, small-laptop scaling, instant loader
examples/                the gallery above, each a working page
evals/                   test prompts used to check the skill
```

## Credits

Made by [Ghernie](https://github.com/slyf0xx97). The design language comes from itsa10but and SkyQueue (Autonomous SG 2026, Airbus Challenge #2).

Fonts are loaded from Google Fonts and are under the SIL Open Font License: Pixelify Sans, Atkinson Hyperlegible, Anybody and Spline Sans Mono. All characters, icons and examples in this repo are original. Third-party logos are deliberately left out; add your own where you have the right to.

Released under the [MIT License](LICENSE).
