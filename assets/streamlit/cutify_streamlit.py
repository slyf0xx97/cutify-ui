"""cutify-ui helpers for hosting plain HTML pages inside Streamlit. MIT.

    from cutify_streamlit import page, frame, bridge, hide_chrome
    hide_chrome()
    msg = bridge()                      # dict sent from a page with toPython({...}), or None
    frame(page(WEB / "story.html", {"items": items}, WEB), height=2400)

Pages are same-origin iframes, so they can size themselves (fit()) and reach the parent page.
See references/streamlit.md for the matching JavaScript.
"""
import json
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components


def page(path: Path, data, web: Path, parts: dict[str, str] | None = None) -> str:
    """Fill a template's placeholders: /*BASE*/ and /*APP*/ with CSS, <!--SPRITES--> with sprite markup,
    any extra {placeholder: file} in parts, and /*DATA*/ with JSON."""
    html = Path(path).read_text(encoding="utf-8")
    for tag, name in {"/*BASE*/": "base.css", "/*APP*/": "app.css", "<!--SPRITES-->": "sprites.html", **(parts or {})}.items():
        f = web / name
        if tag in html and f.exists():
            html = html.replace(tag, f.read_text(encoding="utf-8"))
    return html.replace("/*DATA*/", json.dumps(data))


def frame(html: str, height: int) -> None:
    """Show a page. Give height close to the real one; the page's fit() then corrects it."""
    components.html(html, height=height, scrolling=False)


def bridge(key: str = "bridge") -> dict | None:
    """Hidden text input that pages write JSON into. Returns the decoded message once and clears it;
    call st.rerun() after handling it. Treat the result as untrusted user input: check types, lengths
    and allowed values before use."""
    with st.container(key=key):
        raw = st.text_input(key, key=f"{key}_in", label_visibility="collapsed")
    if not raw:
        return None
    del st.session_state[f"{key}_in"]   # a widget's value can't be assigned after it renders, but it can be deleted
    try:
        msg = json.loads(raw)
    except ValueError:
        return None
    return msg if isinstance(msg, dict) else None


def hide_chrome(bg: str = "#121315") -> None:
    """Remove Streamlit's sidebar, toolbar and header, set the page background, hide the bridge."""
    st.markdown(f"""<style>
[data-testid="stSidebar"], [data-testid="stSidebarCollapsedControl"], [data-testid="stToolbar"], [data-testid="stHeader"] {{ display: none; }}
.stApp {{ background: {bg}; }}
iframe {{ border: 0; display: block; }}
.st-key-bridge {{ position: absolute !important; height: 0 !important; overflow: hidden; }}
[data-testid="InputInstructions"] {{ display: none; }}
[data-testid="stButtonGroup"] > div {{ flex-wrap: wrap !important; }}
.block-container {{ zoom: var(--z, 1); }}
</style>""", unsafe_allow_html=True)
