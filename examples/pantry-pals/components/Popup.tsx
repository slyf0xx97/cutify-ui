"use client";
// cutify-ui: modal on native <dialog>. The browser handles Escape, the focus trap and the backdrop. MIT.
// Styles: dialog.pop, .pop-head, .pop-title, .pop-close, .pop-body in assets/glass.css (tone via --pop-hue / --pop-bar).
import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  wide?: boolean;
  tone?: { hue: string; bar: string };   // e.g. { hue: "var(--teal-soft)", bar: "var(--water-deep)" } for one character
};

export function Popup({ open, onClose, title, icon, children, wide, tone }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) { opener.current = document.activeElement; dialog.showModal(); }
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={"pop" + (wide ? " pop-wide" : "")}
      aria-labelledby={titleId}
      style={tone ? ({ "--pop-hue": tone.hue, "--pop-bar": tone.bar } as CSSProperties) : undefined}
      onClose={() => { onClose(); (opener.current as HTMLElement | null)?.focus?.(); }}
      onClick={(event) => { if (event.target === ref.current) onClose(); }}   // backdrop click
    >
      <header className="pop-head">
        {icon ? <span className="pop-icon" aria-hidden="true">{icon}</span> : null}
        <h2 id={titleId} className="pop-title">{title}</h2>
        <button type="button" className="pop-close" onClick={onClose} aria-label="Close">Close <span aria-hidden="true">✕</span></button>
      </header>
      <div className="pop-body">{children}</div>
    </dialog>
  );
}
