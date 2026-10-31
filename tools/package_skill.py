"""Build dist/cutify-ui.zip for Claude.ai and the Skills API: the skill folder only, without examples or tooling."""
import pathlib
import zipfile

root = pathlib.Path(__file__).resolve().parent.parent
dist = root / "dist"
dist.mkdir(exist_ok=True)
keep = ["SKILL.md", "LICENSE", "references", "assets"]
out = dist / "cutify-ui.zip"
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for item in keep:
        p = root / item
        for f in ([p] if p.is_file() else sorted(x for x in p.rglob("*") if x.is_file())):
            z.write(f, pathlib.Path("cutify-ui") / f.relative_to(root))
print(f"{out} ({out.stat().st_size // 1024} KB)")
