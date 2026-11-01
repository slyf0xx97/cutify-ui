"""Rebuild the README gallery table between <!-- GALLERY:START --> and <!-- GALLERY:END -->,
and refresh each card's prompt and preview on the gallery page (site/index.html).

Run from the repo root: python tools/readme_gallery.py
Each example's title, one-line description and tags come from the ITEMS list below.
The prompt under each picture is the quoted brief in examples/<name>/README.md, and the picture is
docs/gallery/<name>.gif when that file exists, else the .png.
"""
import html
import pathlib
import re

LIVE = "https://cutify.ghernie.com/examples/"
ITEMS = [
    ("studybuddy", "StudyBuddy", "Three AI tutors plan, quiz and check in. You approve the week.", "🪟 Glass, HTML"),
    ("fleet-queue", "Fleet Queue", "Warehouse robots plan the order queue, code blocks unsafe moves, a manager approves.", "🛫 Apron, HTML"),
    ("sunday-spread", "Sunday Spread", "A Host and a Baker plan a potluck so nothing doubles up. You confirm the menu.", "🧺 Picnic, HTML"),
    ("zine-night", "Zine Night", "The Curator draws a route through a 40-table zine fair. You star tables and print the map.", "🖨️ Riso Club, HTML"),
    ("moonlit-market", "Moonlit Market", "A Scout and a Queue Guesser plan a night-market food crawl under swaying lanterns.", "🏮 Lantern Night, HTML"),
    ("beep-and-build", "Beep & Build", "Kids snap code blocks to guide Bolt the robot. Every solved level adds a brick to the tower.", "🧱 Toy Box, HTML, playable"),
    ("sprout", "Sprout", "Dr. Leaf diagnoses your plant, Drip plans the watering, and the plant perks up.", "🪟 Glass, HTML"),
    ("gridline", "Gridline", "A microgrid control room on a heatwave evening, with power flowing along the wires.", "🛫 Apron, electric palette, HTML"),
    ("snooze-log", "Snooze Log", "A sleep journal with a cat that dozes when you don't. The Night Owl suggests one small change.", "🌙 Custom: Sleepy Dusk, HTML"),
    ("penpal-post", "Penpal Post", "Write to a penpal in Japan. A Translator and a Postie help, then the letter folds and flies off.", "🍓 Custom: Strawberry Milk + Kawaii JP, HTML"),
    ("pantry-pals", "Pantry Pals", "A Chef and a Shopper plan your week from what's in the fridge.", "🪟 Glass, Next.js + static copy"),
    ("portfolio", "Sam Sample, portfolio", "A sample designer portfolio where the avatar walks a trail as you scroll.", "🪟 Glass, HTML, no AI"),
    ("pocket-money", "Pocket Money", "A clickable phone prototype that helps kids save their allowance. A parent approves each spend.", "🧺 Picnic, HTML, phone prototype"),
    ("ship-it", "Ship It", "A CI/CD pipeline explainer for new engineers. A pixel bot crew runs each step and a failing test stops the deploy.", "💻 Custom: Terminal Candy, HTML, no AI"),
    ("tally", "Tally", "An expense approval flow for a design studio. Three sample claims take different paths from receipt to payout.", "🪟 Glass dark, HTML, process flow"),
    ("parcel-pigeon", "Parcel Pigeon", "Delivery tracking for a neighbourhood bakery. A rider pedals the map while the ETA counts down.", "🖨️ Riso Club, HTML, no AI"),
    ("pixel-fest", "Pixel Fest", "A two-day indie game-dev meetup with a schedule, speaker cards, a venue map and a playable mini-game.", "🕹️ Custom: Arcade Night, HTML, playable, no AI"),
    ("ramen-route", "Ramen Route", "A staff training flow that follows one ramen order through six stations, with busy-hour timings.", "🍜 Custom: Noren, HTML, no AI"),
]

root = pathlib.Path(__file__).resolve().parent.parent


def brief(slug):
    """The quoted lines under '## The brief' in the example's README, without the '> ' marks."""
    text = (root / "examples" / slug / "README.md").read_text(encoding="utf-8")
    section = text.split("## The brief", 1)[1].split("\n## ", 1)[0]
    quoted = [line[1:].strip() for line in section.splitlines() if line.startswith(">")]
    assert quoted and "```" not in " ".join(quoted), f"{slug}: no usable quoted brief"
    return " ".join(quoted)


rows = []
COLS = 3  # three examples a row keeps the gallery compact
for i in range(0, len(ITEMS), COLS):
    cells = []
    for slug, name, blurb, tags in ITEMS[i:i + COLS]:
        alt = name.replace("&", "and")
        pic = f"docs/gallery/{slug}.gif" if (root / f"docs/gallery/{slug}.gif").exists() else f"docs/gallery/{slug}.png"
        cells.append(f'<td width="33%" valign="top"><a href="{LIVE}{slug}/"><img src="{pic}" alt="{alt}"></a><br>'
                     f'<b><a href="{LIVE}{slug}/">{name.replace("&", "&amp;")}</a></b> <sub>(<a href="examples/{slug}">source</a>)</sub><br><sub>{tags}</sub></td>')
    rows.append("<tr>\n" + "\n".join(cells) + "\n</tr>")
table = "<table>\n" + "\n".join(rows) + "\n</table>"
# the prompts sit under the table at full width, so opening them can't stretch the gallery columns
prompts = "\n\n".join(f"**{name}**\n\n```text\n{brief(slug)}\n```" for slug, name, *_ in ITEMS)
table += f"\n\n<details><summary><b>Copy an example's prompt</b></summary>\n\n{prompts}\n\n</details>"

p = root / "README.md"
s = p.read_text(encoding="utf-8")
a, b = "<!-- GALLERY:START -->", "<!-- GALLERY:END -->"
s = s[:s.index(a) + len(a)] + "\n" + table + "\n" + s[s.index(b):]
p.write_bytes(s.encode("utf-8"))  # LF line endings on every OS
print(f"README gallery: {len(ITEMS)} examples")

# Gallery page: the same prompt in each card, and docs/gallery/<name>.mp4 as a moving preview once it exists
p = root / "site" / "index.html"
s = p.read_text(encoding="utf-8")
for slug, *_ in ITEMS:
    s, n = re.subn(rf'(<p class="brief-text" id="b-{slug}"[^>]*>)[\s\S]*?(</p>)',
                   lambda m: m.group(1) + html.escape(brief(slug), quote=False) + m.group(2), s)
    assert n == 1, f"index.html has no prompt box for {slug}"
    old = re.compile(rf'<img src="/docs/gallery/{slug}\.png" alt="([^"]*)" loading="lazy">|<video src="/docs/gallery/{slug}\.mp4"[^>]*aria-label="([^"]*)"></video>')
    m = old.search(s)
    assert m, f"index.html has no preview for {slug}"
    alt = m.group(1) or m.group(2)
    if (root / f"docs/gallery/{slug}.mp4").exists():
        new = f'<video src="/docs/gallery/{slug}.mp4" poster="/docs/gallery/{slug}.png" autoplay muted loop playsinline preload="metadata" aria-label="{alt}"></video>'
    else:
        new = f'<img src="/docs/gallery/{slug}.png" alt="{alt}" loading="lazy">'
    s = s[:m.start()] + new + s[m.end():]
p.write_bytes(s.encode("utf-8"))
print(f"index.html: {len(ITEMS)} prompts and previews")
