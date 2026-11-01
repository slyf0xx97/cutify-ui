"""Check a page built with cutify-ui for the problems the skill rules out. Standard library only.

Usage: python scripts/lint_page.py page.html [more.html or styles.css ...]
Prints one line per problem with a line number and a fix. Exits 1 if any FAIL is found, 0 if only WARNs or nothing.
Run it on every page you build, fix each FAIL, and run it again until it passes.
"""
import colorsys
import re
import sys
from pathlib import Path

# Emoji pictographs. Text marks such as ✓ ✕ ★ ↺ sit outside these ranges and are fine.
EMOJI = re.compile("[\U0001F300-\U0001FAFF⚡⭐✅❌]")
# Properties that repaint or re-layout on every frame when they change inside a looping animation.
HEAVY = re.compile(r"(?:^|[;{\s])(box-shadow|filter|background-position|left|top|right|bottom|width|height|margin[\w-]*)\s*:")
KEYFRAMES = re.compile(r"@keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}")
# Scripts and stylesheets only: a canonical or preconnect <link> doesn't load anything
EXTERNAL = re.compile(r"""<script\b[^>]*\bsrc=["'](https?://[^"']+)|<link\b(?=[^>]*\brel=["']?(?:stylesheet|preload|modulepreload))[^>]*\bhref=["'](https?://[^"']+)""", re.I)
ALLOWED_HOSTS = ("fonts.googleapis.com", "fonts.gstatic.com")
GENERIC_DISPLAY = re.compile(r"""--display\s*:\s*["']?(Inter|Roboto|Arial|Helvetica|system-ui|-apple-system)\b""", re.I)
GRADIENT = re.compile(r"linear-gradient\(([^;{}]*)\)")
HEX = re.compile(r"#([0-9a-f]{6}|[0-9a-f]{3})\b", re.I)
PAGE_BUDGET_KB = 150  # the skill's budget for one page before fonts; an animated page is usually 60 to 80 KB


def line_of(text, index):
    return text.count("\n", 0, index) + 1


def hue(hex_code):
    h = hex_code if len(hex_code) == 6 else "".join(c * 2 for c in hex_code)
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    hh, _, s = colorsys.rgb_to_hls(r, g, b)
    return hh * 360, s


def lint(path):
    text = Path(path).read_text(encoding="utf-8")
    css = text if path.endswith(".css") else "\n".join(re.findall(r"<style[^>]*>([\s\S]*?)</style>", text))
    found = []
    add = lambda level, idx, msg, src=text: found.append((level, line_of(src, idx) if idx is not None else None, msg))

    for m in KEYFRAMES.finditer(css):
        prop = HEAVY.search(m.group(2))
        if prop:
            found.append(("FAIL", None, f"@keyframes {m.group(1)} animates {prop.group(1)}, which repaints every frame. Move a pseudo-element layer with transform or opacity instead"))
    if ("@keyframes" in css or "transition" in css) and "prefers-reduced-motion" not in text:
        add("FAIL", None, "the page animates but never checks prefers-reduced-motion. Stop loops and entrances under (prefers-reduced-motion: reduce)")

    if not path.endswith(".css"):
        for m in EMOJI.finditer(text):
            add("FAIL", m.start(), f"emoji {m.group(0)} used in the page. Draw a pixel icon instead (references/pixel-art.md)")
        for m in EXTERNAL.finditer(text):
            url = m.group(1) or m.group(2)
            if not url.split("/")[2].endswith(ALLOWED_HOSTS):
                add("FAIL", m.start(), f"loads {url}. Inline it or copy it into the project; only Google Fonts may load from outside")
        for m in re.finditer(r"lorem ipsum|dolor sit amet", text, re.I):
            add("FAIL", m.start(), "placeholder lorem ipsum. Write the product's real copy, or specific sample copy labelled \"sample\"")
        for m in re.finditer(r"<(div|span|a)\b[^>]*\bclass=[\"']([^\"'$]*)[\"'][^>]*>", text):
            if "i" in m.group(2).split() and "aria-hidden" not in m.group(0):
                add("FAIL", m.start(), f"an info trigger is a <{m.group(1)}>. Make it <button type=\"button\"> with an aria-label")
        for m in re.finditer(r"<button\b[^>]*>\s*i\s*</button>", text):
            if "aria-label" not in m.group(0):
                add("FAIL", m.start(), "an 'i' button has no aria-label, so screen readers announce \"i\". Name its subject, e.g. aria-label=\"About the menu board\"")
        for m in re.finditer(r"<img\b(?![^>]*\balt=)[^>]*>", text):
            add("WARN", m.start(), "an <img> has no alt. Describe it, or use alt=\"\" if it's decoration")
        if not re.search(r"\b(sample|made-up|made up|estimate)\b", text, re.I):
            add("WARN", None, "nothing is labelled \"sample\", \"made-up\" or \"estimate\". Label any invented names, numbers or data")
        kb = len(text.encode("utf-8")) / 1024
        if kb > PAGE_BUDGET_KB:
            add("WARN", None, f"the page is {kb:.0f} KB, over the {PAGE_BUDGET_KB} KB budget. Move repeated markup into JS templates or trim sprites")

    m = GENERIC_DISPLAY.search(css)
    if m:
        found.append(("FAIL", None, f"the display face is {m.group(1)}, the default AI look. Use the theme's display face (references/fonts.md)"))
    for m in GRADIENT.finditer(css):
        hues = [hue(h) for h in HEX.findall(m.group(1))]
        if any(250 <= h <= 290 and s > .35 for h, s in hues) and any(200 <= h < 250 and s > .35 for h, s in hues):
            found.append(("WARN", None, "a purple-to-blue gradient, a common AI tell. Keep it only if it's a painted sky inside a scene"))
    bare = [m for m in re.finditer(r"grid-template-columns\s*:\s*([^;}]+)", css) if re.search(r"(?<![\w.-])\d*\.?\d+fr\b", re.sub(r"minmax\([^()]*\)", "", m.group(1)))]
    if bare:
        first = bare[0].group(0)
        add("WARN", text.find(first) if first in text else None, f"{len(bare)} grid column list(s) use a bare fr, such as \"{first.strip()}\". Write minmax(0, 1fr) so a wide child can't push the page past a phone screen")
    radii = set(re.findall(r"border-radius\s*:\s*([^;}]+)", css))
    if len(radii) == 1 and css.count("border-radius") > 6:
        found.append(("WARN", None, f"every element uses border-radius {radii.pop().strip()}. Vary corners with the size and role of each element"))
    if css.count("will-change") > 6:
        found.append(("WARN", None, f"will-change appears {css.count('will-change')} times. Keep it for the few elements that animate all the time"))
    return found


def main(paths):
    failed = False
    for path in paths:
        problems = lint(path)
        if not problems:
            print(f"OK   {path}")
        for level, line, msg in problems:
            failed |= level == "FAIL"
            print(f"{level} {path}{f':{line}' if line else ''}  {msg}")
    return 1 if failed else 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1:]))
