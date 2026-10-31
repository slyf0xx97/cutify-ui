"use client";
// cutify-ui: pause CSS animations in sections that are off screen (saves battery and keeps scrolling smooth). MIT.
// Needs: .is-off, .is-off *, .is-off *::before, .is-off *::after { animation-play-state: paused !important; }
import { useEffect } from "react";

export function useOffscreenPause(selector = ".hero, .stage, #how-it-works") {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-off", !e.isIntersecting)),
      { rootMargin: "100% 0px" },
    );
    const watch = () => document.querySelectorAll(selector).forEach((el) => io.observe(el));
    watch();
    const mo = new MutationObserver(watch);            // sections that mount later
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [selector]);
}
