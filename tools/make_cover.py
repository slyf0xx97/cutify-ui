"""Build docs/gallery/cover.png (a 4 x 3 collage of the gallery screenshots) and docs/social-preview.png (1280 x 640).

Run from the repo root after tools/shots.mjs: python tools/make_cover.py   (needs Pillow)
"""
import pathlib

from PIL import Image, ImageDraw

root = pathlib.Path(__file__).resolve().parent.parent
gallery = root / "docs" / "gallery"
order = ["studybuddy", "fleet-queue", "sunday-spread", "zine-night", "moonlit-market", "beep-and-build",
         "sprout", "gridline", "snooze-log", "penpal-post", "pantry-pals", "portfolio"]
names = [n for n in order if (gallery / f"{n}.png").exists()]

cols, gap, pad = 4, 30, 50
W = 2400
cw = (W - 2 * pad - (cols - 1) * gap) // cols
ch = int(cw * 800 / 1280)
rows = -(-len(names) // cols)
H = 2 * pad + rows * ch + (rows - 1) * gap

board = Image.new("RGB", (W, H), (251, 247, 238))           # the gallery page's paper colour
d = ImageDraw.Draw(board)
for x in range(0, W, 28):                                     # grid paper, as on the gallery page
    d.line([(x, 0), (x, H)], fill=(236, 228, 212))
for y in range(0, H, 28):
    d.line([(0, y), (W, y)], fill=(236, 228, 212))

for k, n in enumerate(names):
    x = pad + (k % cols) * (cw + gap)
    y = pad + (k // cols) * (ch + gap)
    shot = Image.open(gallery / f"{n}.png").convert("RGB").resize((cw, ch), Image.LANCZOS)
    mask = Image.new("L", (cw, ch), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, cw - 1, ch - 1), 14, fill=255)
    d.rounded_rectangle((x + 6, y + 8, x + cw + 6, y + ch + 8), 14, fill=(31, 36, 48))   # sticker shadow
    board.paste(shot, (x, y), mask)
    d.rounded_rectangle((x, y, x + cw - 1, y + ch - 1), 14, outline=(31, 36, 48), width=3)

board.save(gallery / "cover.png", optimize=True)

# social preview: 2:1, centred crop of the collage, 1280 x 640
th = W // 2
top = max(0, (H - th) // 2)
board.crop((0, top, W, top + th)).resize((1280, 640), Image.LANCZOS).save(root / "docs" / "social-preview.png", optimize=True)
print(f"cover.png {W}x{H} with {len(names)} shots; social-preview.png 1280x640")
