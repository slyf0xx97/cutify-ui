# Plain HTML pages and Streamlit

The Apron theme was built as plain HTML/CSS/SVG pages hosted inside a Streamlit app. The pages work on their own too: open one as a static file or serve it from any backend. This file covers both.

## Contents
- Plain HTML structure
- Hosting pages inside Streamlit
- Iframe → Python: the hidden input bridge
- Iframe → Python: hidden buttons
- Frame ↔ frame calls
- Restyling Streamlit around the pages
- Small laptops: scale instead of reflow
- Instant feedback before Python reruns
- Deploying

---

## Plain HTML structure

One self-contained file per page section, with placeholders a build step (or Python) fills:
```html
<!doctype html><html><head><meta charset="utf-8"><style>/*BASE*//*APP*/</style></head><body>
<!--SPRITES-->
<section class="stagehero">...</section>
<script>
const DATA = /*DATA*/;                       // JSON injected at build time
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// every user or data string goes through esc() before innerHTML
</script></body></html>
```
Build components as template strings in small render functions. No framework is needed for pages of this size, and it keeps the motion engines (`references/motion.md`) simple.

## Hosting pages inside Streamlit

`assets/streamlit/cutify_streamlit.py` has these helpers.

```python
def page(name: str, data) -> str:
    html = (WEB / name).read_text(encoding="utf-8")
    for tag, f in (("/*BASE*/", "base.css"), ("/*APP*/", "app.css")):
        html = html.replace(tag, (WEB / f).read_text(encoding="utf-8"))
    html = html.replace("<!--SPRITES-->", (WEB / "sprites.html").read_text(encoding="utf-8"))
    return html.replace("/*DATA*/", json.dumps(data))

components.html(page("story.html", {...}), height=3200, scrolling=False)
```
`components.html` iframes are same-origin (`srcdoc`), so the page can size its own frame and reach the parent:
```js
function fit() { if (window.frameElement) window.frameElement.style.height = (document.documentElement.scrollHeight + 4) + 'px'; }
new ResizeObserver(fit).observe(document.body); fit();
```
If something deliberately overflows the page (flying sprites), measure the main panel's bottom instead of `scrollHeight`, and pass a matching `height=` to `components.html` so Streamlit doesn't reserve empty space.

## Iframe → Python: the hidden input bridge

Send JSON from the page to Python through a hidden `st.text_input`. The native value setter is needed so React (Streamlit's frontend) sees the change; Enter commits it.
```python
with st.container(key="bridge"):
    raw = st.text_input("bridge", key="bridge_in", label_visibility="collapsed")
if raw:
    msg = json.loads(raw)            # validate before use: this is user-controlled input
    ...
    del st.session_state["bridge_in"]
    st.rerun()
```
```js
function toPython(payload) {
  const input = parent.document.querySelector('.st-key-bridge input');
  if (!input) return false;
  const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  set.call(input, JSON.stringify({ ...payload, n: Date.now() }));     // n makes each message unique
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
  return true;
}
```
```css
.st-key-bridge { position: absolute !important; height: 0 !important; overflow: hidden; }
```
Treat everything that arrives through the bridge as untrusted: check types, lengths and allowed values.

## Iframe → Python: hidden buttons

For fixed actions (Approve, Reject), render real `st.button`s with encoded labels in a hidden container and click them from the page:
```python
with st.container(key="actions"):
    if st.button(f"APPROVE::{item_id}"): approve(item_id)
```
```js
const b = [...parent.document.querySelectorAll('button')].find(x => x.innerText.trim() === `APPROVE::${id}`);
if (b) b.click(); else $('msg').textContent = 'Could not reach the server.';
```

## Frame ↔ frame calls

Expose a tiny API on one frame and find it from the others by scanning the parent's iframes:
```js
// story page
window.APP = { play(k) { ... }, how() { $('how').scrollIntoView({ behavior: 'smooth' }); } };
// nav or hero page
const story = () => [...parent.document.querySelectorAll('iframe')].map(f => f.contentWindow).find(w => w && w.APP);
document.getElementById('play').onclick = () => story()?.APP.play();
```

## Restyling Streamlit around the pages

Inject one `<style>` block with `st.markdown(..., unsafe_allow_html=True)` and target containers by key (`st.container(key="nav")` gets the class `.st-key-nav`):
- Hide chrome: `[data-testid="stSidebar"], [data-testid="stToolbar"], [data-testid="stHeader"] { display: none; }`, app background `#121315`, `iframe { border: 0; display: block; }`.
- Pin a nav iframe: `.st-key-navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 999980; height: 64px; }`.
- Float native widgets (an API key input, a Run button) over the nav: `.st-key-nav { position: fixed; top: 12px; right: 28px; z-index: 999990; }` with fixed 40px control heights.
- Hide the "Press Enter to apply" hint: `[data-testid="InputInstructions"] { display: none; }`.
- Let `st.pills` wrap: `[data-testid="stButtonGroup"] > div { flex-wrap: wrap !important; }`.
- Give native containers the panel look: `.st-key-setup { background: #1b1c1f; border: 1px solid #ffffff14; border-top: 4px solid #ffd400; border-radius: 6px; padding: 18px 20px; }`.
- Optional light-up effect: `.stApp::before/::after` edge lights that switch on with `:has(.keytoggle.on)`.

Install parent-page listeners once, behind a flag, because Streamlit rebuilds iframes on every rerun. Capture `const P = parent;` and call `P.setTimeout`, since a rebuilt frame's own timers die with it.

## Small laptops: scale instead of reflow

Design at 1280px. On narrower windows (14-inch laptops at 150 to 175% display scaling are about 975px wide), scale the content block down instead of reflowing a complex layout:
```js
const P = parent;
const fitZoom = () => P.document.documentElement.style.setProperty('--z', Math.min(1, P.innerWidth / 1280).toFixed(3));
P.__fit = fitZoom; fitZoom();
if (!P.__fitHook) { P.__fitHook = true; P.addEventListener('resize', () => P.__fit && P.__fit()); }
```
```css
.block-container { zoom: var(--z, 1); }
```
Zoom the content block, not `<html>`: zooming the root shrinks Streamlit's full-height scroll area and cuts off the page. Widths written with `100vw` need dividing by `var(--z)`. Show a "needs a bigger screen" notice only below about 760px.

## Instant feedback before Python reruns

Python only renders after a rerun starts, so anything slow (switching a dataset) should show a loader from the browser at once. From a frame, add a capture-phase click listener on the parent, inject the loading screen (`references/components.md`), and let the page that renders the new data remove it (`P.document.getElementById('load-js')?.remove()`), with a safety timeout. Do the same for inputs: when a pasted value looks complete (for example an API key matching `/^sk-[\w-]{30,}$/`), dispatch Enter so it applies without the user pressing it.

## Deploying

Streamlit needs a long-running server with websockets. Options that work: Streamlit Community Cloud, Render, Railway, Hugging Face Spaces, or Vercel with a container (`Dockerfile.vercel` running `streamlit run app.py --server.port=${PORT:-80} --server.address=0.0.0.0`). Keep large datasets out of the image: ship a small extract with the original row ids and fall back to it when the full file is missing. Keep secrets out of uploads with `.vercelignore` / `.dockerignore`.
