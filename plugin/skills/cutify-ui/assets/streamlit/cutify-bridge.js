// cutify-ui: browser side of the Streamlit helpers. Paste into a page's <script> or inline it with page(). MIT.

// Size this iframe to its content. Pass a selector to measure one element instead (when sprites overflow on purpose).
function fit(selector) {
  if (!window.frameElement) return;
  const h = selector ? Math.ceil(document.querySelector(selector).getBoundingClientRect().bottom + 6) : document.documentElement.scrollHeight + 4;
  window.frameElement.style.height = h + 'px';
}
new ResizeObserver(() => fit()).observe(document.body);

// Send a message to Python through the hidden bridge input (see bridge() in cutify_streamlit.py).
function toPython(payload, key = 'bridge') {
  const input = parent.document.querySelector(`.st-key-${key} input`);
  if (!input) return false;
  const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;   // native setter, so React sees it
  set.call(input, JSON.stringify({ ...payload, n: Date.now() }));                          // n keeps each message unique
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
  return true;
}

// Click a hidden st.button by its exact label, e.g. clickPython(`APPROVE::${id}`).
function clickPython(label) {
  const b = [...parent.document.querySelectorAll('button')].find((x) => x.innerText.trim() === label);
  if (b) b.click();
  return !!b;
}

// Find another frame's API, e.g. otherFrame('APP')?.APP.play().
const otherFrame = (name) => [...parent.document.querySelectorAll('iframe')].map((f) => f.contentWindow).find((w) => w && w[name]);

// Scale the Streamlit content down on windows narrower than the design width, instead of reflowing.
// Needs `.block-container { zoom: var(--z, 1); }` (hide_chrome() adds it). Install once: frames are rebuilt on every rerun.
(function scaleToFit(designWidth = 1280) {
  const P = parent;
  P.__cutifyFit = () => P.document.documentElement.style.setProperty('--z', Math.min(1, P.innerWidth / designWidth).toFixed(3));
  P.__cutifyFit();
  if (!P.__cutifyFitHook) { P.__cutifyFitHook = true; P.addEventListener('resize', () => P.__cutifyFit && P.__cutifyFit()); }
})();

// Show a loading screen the moment something slow is clicked, before Python reruns.
// The page that renders the new data calls hideLoader().
function showLoaderOnClick(selector, html) {
  const P = parent;
  if (P.__cutifyLoadHook) return;
  P.__cutifyLoadHook = true;
  P.document.addEventListener('click', (e) => {
    if (!e.target.closest(selector)) return;
    P.document.getElementById('cutify-load')?.remove();
    const o = P.document.createElement('div');
    o.id = 'cutify-load'; o.className = 'load'; o.innerHTML = html;
    P.document.body.appendChild(o);
    P.setTimeout(() => o.remove(), 25000);          // safety net if the new page never arrives
  }, true);
}
const hideLoader = () => parent.document.getElementById('cutify-load')?.remove();
