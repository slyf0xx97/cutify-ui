# cutify-ui

A Claude skill for cute, pixel-art, game-like web pages. Ask Claude for a landing page, a prototype, a product demo or an animated process flow, and the skill gives it themes, pixel characters, numbered story stages, tooltips and motion patterns to build from. Claude builds in React 19, Next.js or plain HTML, CSS and SVG.

See the example pages at [cutify.ghernie.com](https://cutify.ghernie.com/). The full project, with the gallery, tests and contributing guide, is at [github.com/slyf0xx97/cutify-ui](https://github.com/slyf0xx97/cutify-ui).

## Install

In Claude Code:

```
/plugin install cutify-ui --marketplace slyf0xx97/cutify-ui
```

Then ask for a page in plain words, for example "Make a cute landing page for my study app with three AI tutors."

## What's in this plugin

The plugin has one skill, `skills/cutify-ui`:

- `SKILL.md`, the workflow Claude follows
- `references/`, Markdown guides that Claude reads when a request needs them
- `assets/`, a starter page, theme stylesheets, a pixel sprite helper, typed React components and Streamlit helpers that Claude copies into the pages it builds
- `scripts/lint_page.py`, a checker that uses only the Python standard library
- `evals/`, test prompts for `claude plugin eval`

## What it runs and sends

The plugin has no hooks, no MCP servers and no commands, and it holds no keys. The skill asks Claude to run `scripts/lint_page.py` on each page it builds. The script reads that page and prints problems to the terminal. If Node is installed, it also passes the page's inline scripts to Node to check their syntax, without running them. It doesn't write files or use the network.

The theme stylesheets that Claude copies into your pages load fonts from Google Fonts, so a visitor's browser asks Google for the font files. `references/themes.md` explains how to host the fonts yourself instead.

## License

MIT. See [LICENSE](LICENSE).
