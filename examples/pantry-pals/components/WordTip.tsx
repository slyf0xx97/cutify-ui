"use client";
// cutify-ui: tooltip / peek panel on the Popover API, so no ancestor overflow or z-index can clip it. MIT.
// Opens on mouse hover, keyboard focus and tap (tap pins it, a second tap closes it). Closes on Escape or a tap outside.
// Flips above the trigger when there is more room there. Pair with the .word-tip styles below.
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Props = {
  word: ReactNode;          // the trigger text
  label?: string;           // accessible name when the trigger is an icon, e.g. "About the menu board"
  title: string;            // short title shown in the tip header
  children: ReactNode;      // 3 to 8 short lines; say why, not just what
  tone?: string;            // header colour, e.g. "var(--teal-dark)"
  panel?: boolean;          // true for a richer panel (role=dialog) instead of a small tooltip
};

export function WordTip({ word, label, title, children, tone = "var(--teal-dark)", panel = false }: Props) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const id = useId();

  useLayoutEffect(() => {
    const el = tip.current, t = btn.current;
    if (!open || !el || !t) return;
    try { (el as HTMLElement & { showPopover?: () => void }).showPopover?.(); } catch { /* no popover support: fixed positioning still works */ }
    const place = () => {
      const margin = 8, r = t.getBoundingClientRect(), b = el.getBoundingClientRect();
      const below = r.bottom + 10, roomBelow = innerHeight - margin - below, roomAbove = r.top - 10 - margin;
      const flip = b.height > roomBelow && roomAbove > roomBelow;
      el.style.left = Math.max(margin, Math.min(r.left, innerWidth - b.width - margin)) + "px";
      el.style.top = (flip ? r.top - 10 - Math.min(b.height, roomAbove) : below) + "px";
      el.style.setProperty("--tip-arrow-x", Math.max(14, r.left + r.width / 2 - parseFloat(el.style.left)) + "px");
      el.dataset.side = flip ? "above" : "below";
    };
    place();
    addEventListener("scroll", place, true); addEventListener("resize", place);
    return () => {
      removeEventListener("scroll", place, true); removeEventListener("resize", place);
      try { (el as HTMLElement & { hidePopover?: () => void }).hidePopover?.(); } catch { /* ignore */ }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setPinned(false); btn.current?.focus(); } };
    const onDown = (e: PointerEvent) => {
      if (!tip.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) { setOpen(false); setPinned(false); }
    };
    addEventListener("keydown", onKey); addEventListener("pointerdown", onDown);
    return () => { removeEventListener("keydown", onKey); removeEventListener("pointerdown", onDown); };
  }, [open]);

  return (
    <span className="word-tip-wrap"
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setOpen(true); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse" && !pinned) setOpen(false); }}>
      <button ref={btn} type="button" className="word-tip-word" aria-label={label}
        aria-describedby={panel ? undefined : id} aria-haspopup={panel ? "dialog" : undefined} aria-expanded={panel ? open : undefined}
        onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) setOpen(true); }}
        onBlur={() => { if (!pinned) setOpen(false); }}
        onClick={() => { if (open && pinned) { setOpen(false); setPinned(false); } else { setPinned(true); setOpen(true); } }}>
        {word}
      </button>
      <div ref={tip} id={id} className="word-tip" popover="manual" role={panel ? "dialog" : "tooltip"} aria-label={panel ? title : undefined}
        hidden={!open} style={{ "--tip-bg": tone } as CSSProperties}>
        <div className="word-tip-head">{title}</div>
        <div className="word-tip-body">{children}</div>
      </div>
    </span>
  );
}

/* Suggested CSS (Glass):
.word-tip-word { all: unset; cursor: help; font-weight: 700; border-bottom: 2px dotted var(--teal-dark); }
.word-tip-word:focus-visible { outline: 3px solid var(--ink); outline-offset: 2px; border-radius: 4px; }
.word-tip { position: fixed; inset: auto; margin: 0; width: min(22rem, calc(100vw - 16px)); padding: 0; overflow: visible;
  background: #fff; color: var(--ink); border: 2px solid var(--ink); border-radius: 14px;
  box-shadow: 3px 3px 0 rgb(31 36 48 / 20%), 0 12px 28px rgb(16 70 100 / 26%); animation: tip-in .15s ease-out; }
.word-tip-head { padding: .5rem .8rem; background: var(--tip-bg); color: #fff; border-radius: 12px 12px 0 0; font: 600 1.15rem var(--display); }
.word-tip-body { padding: .6rem .8rem .75rem; font: 400 1rem/1.45 var(--body); }
.word-tip-body li { list-style: none; position: relative; padding-left: .9rem; }
.word-tip-body li::before { content: ""; position: absolute; left: 0; top: .6em; width: .4rem; height: .4rem; background: var(--tip-bg); }
@keyframes tip-in { from { opacity: 0; transform: translateY(4px); } }
*/
