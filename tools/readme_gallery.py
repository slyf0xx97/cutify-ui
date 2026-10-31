"""Rebuild the README gallery table between <!-- GALLERY:START --> and <!-- GALLERY:END -->.

Run from the repo root: python tools/readme_gallery.py
Each example's title, one-line description and tags come from the ITEMS list below.
"""
import pathlib

LIVE = "https://slyf0xx97.github.io/cutify-ui/examples/"
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
]

root = pathlib.Path(__file__).resolve().parent.parent
rows = []
for i in range(0, len(ITEMS), 2):
    cells = []
    for slug, name, blurb, tags in ITEMS[i:i + 2]:
        alt = name.replace("&", "and")
        cells.append(f'<td width="50%" valign="top"><a href="{LIVE}{slug}/"><img src="docs/gallery/{slug}.png" alt="{alt}"></a><br>'
                     f'<b><a href="{LIVE}{slug}/">{name.replace("&", "&amp;")}</a></b> (<a href="examples/{slug}">source</a>)<br>{blurb}<br><sub>{tags}</sub></td>')
    rows.append("<tr>" + "".join(cells) + "</tr>")
table = "<table>\n" + "\n".join(rows) + "\n</table>"

p = root / "README.md"
s = p.read_text(encoding="utf-8")
a, b = "<!-- GALLERY:START -->", "<!-- GALLERY:END -->"
s = s[:s.index(a) + len(a)] + "\n" + table + "\n" + s[s.index(b):]
p.write_text(s, encoding="utf-8")
print(f"README gallery: {len(ITEMS)} examples")
