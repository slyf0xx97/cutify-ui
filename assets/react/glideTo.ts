// cutify-ui: smooth anchor scroll that clears a sticky header and respects reduced motion. MIT.
// <a href="#check" onClick={(e) => glideTo(e, "check")}>Start the check</a>
import type { MouseEvent } from "react";

export function glideTo(event: MouseEvent<HTMLAnchorElement>, id: string, headerSelector = ".site-header") {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  const header = document.querySelector<HTMLElement>(headerSelector);
  const stuck = header && ["sticky", "fixed"].includes(getComputedStyle(header).position) ? header.offsetHeight : 0;
  const top = target.getBoundingClientRect().top + window.scrollY - stuck - 8;
  const quick = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: Math.max(0, top), behavior: quick ? "instant" : "smooth" });
  history.replaceState(null, "", "#" + id);
}
