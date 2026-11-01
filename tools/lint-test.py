"""Self-test for plugin/skills/cutify-ui/scripts/lint_page.py: each fixture page must raise its check, and a clean page must pass.

Run from the repo root: python tools/lint-test.py
"""
import importlib.util
import pathlib
import shutil
import tempfile

root = pathlib.Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("lint_page", root / "plugin/skills/cutify-ui/scripts/lint_page.py")
lint_page = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lint_page)

HEAD = "<!doctype html><html><head><style>@media (prefers-reduced-motion: reduce) {{ * {{ animation: none; }} }} {css}</style></head><body><p>Sample data.</p>{body}</body></html>"
GRID = ",".join(f'"{"." * 16}"' for _ in range(7))

cases = {
    "clean": (HEAD.format(css=".wrap { display: grid; grid-template-columns: minmax(0, 1fr); }", body=f"<script>const g = [{GRID}, \"{'.' * 16}\"]; console.log(g.length);</script>"), None),
    "bad sprite row": (HEAD.format(css="", body=f"<script>const g = [{GRID}, \"{'.' * 15}\"];</script>"), "sprite row 8 is 15 characters"),
    "bare fr": (HEAD.format(css=".wrap { grid-template-columns: 1fr 2fr; }", body=""), "bare fr"),
    "wide fixed width": (HEAD.format(css=".board { width: 420px; }", body=""), "width: 420px"),
    "grid minimums too wide": (HEAD.format(css=".week { grid-template-columns: repeat(5, minmax(5rem, 1fr)); }", body=""), "needs at least 400px"),
    "wide inside a scroll box is fine": (HEAD.format(css=".scroll { overflow-x: auto; } .scroll svg { min-width: 600px; }", body=""), None),
    "wide on desktop only is fine": (HEAD.format(css="@media (min-width: 900px) { .board { width: 820px; } }", body=""), None),
}
if shutil.which("node"):
    cases["JavaScript syntax error"] = (HEAD.format(css="", body="<script>\nconst a = {;\n</script>"), "JavaScript syntax error")

failed = 0
with tempfile.TemporaryDirectory() as tmp:
    for name, (page, expect) in cases.items():
        f = pathlib.Path(tmp) / "page.html"
        f.write_text(page, encoding="utf-8")
        msgs = [m for _, _, m in lint_page.lint(str(f))]
        ok = (not msgs) if expect is None else any(expect in m for m in msgs)
        failed += not ok
        print(("ok  " if ok else "BAD ") + name + ("" if ok else f": got {msgs}"))
raise SystemExit(1 if failed else 0)
