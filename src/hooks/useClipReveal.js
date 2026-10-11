import { useEffect } from "react";
import { gsap, EASE_REVEAL, guardReveal, markRevealed, showNow, queueRefresh } from "../lib/motion.js";
import useMotionMode, { dur } from "./useMotionMode.js";

/**
 * Image wipe: each `selector` element inside `scopeRef` is revealed with a
 * clip-path that opens from the bottom edge up, while its <img> settles from
 * a slight zoom (full mode only). No travel, so it stays on in soft mode.
 */
export default function useClipReveal(scopeRef, { selector = "[data-clip]", start = "top 85%", duration = 1.4 } = {}) {
  const mode = useMotionMode();

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || mode === "none") return;
    const targets = gsap.utils.toArray(
      scope.matches?.(selector) ? [scope] : scope.querySelectorAll(selector)
    );
    if (!targets.length) return;

    let started = 0;
    const ctx = gsap.context(() => {
      targets.forEach((el) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start, toggleActions: "play none none none" },
          onStart: () => ++started >= targets.length && markRevealed(scope),
        });
        tl.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: dur(duration, mode), ease: EASE_REVEAL }
        );
        const img = el.querySelector("img");
        if (img && mode === "full") {
          tl.from(img, { scale: 1.18, duration: dur(duration + 0.4, mode), ease: EASE_REVEAL }, 0);
        }
      });
    }, scope);
    queueRefresh();

    const unguard = guardReveal(scope, () => {
      showNow(targets);
      showNow(targets.map((t) => t.querySelector("img")));
    });
    return () => {
      unguard();
      ctx.revert();
    };
  }, [mode, scopeRef, selector, start, duration]);
}
