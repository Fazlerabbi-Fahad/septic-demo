import { useEffect } from "react";
import useIsoLayoutEffect from "./useIsoLayoutEffect.js";
import { gsap, EASE_REVEAL, guardReveal, markRevealed, showNow, queueRefresh } from "../lib/motion.js";
import useMotionMode, { dur, travel } from "./useMotionMode.js";

/**
 * Reveal children of `scopeRef` as they scroll into view.
 *  type "mask": targets rise from an overflow-hidden mask (y 100% → 0). Wrap
 *               each line as <span class="line-mask"><span data-reveal>…</span></span>.
 *  type "fade": targets fade up 40px (24px max in soft mode).
 *  each:  give every target its own ScrollTrigger (grids, lists).
 *  immediate: play on mount (hero) instead of on scroll.
 */
export default function useReveal(
  scopeRef,
  {
    selector = "[data-reveal]",
    type = "fade",
    stagger = 0.1,
    delay = 0,
    duration,
    start = "top 82%",
    each = false,
    immediate = false,
  } = {}
) {
  const mode = useMotionMode();
  // Above-the-fold (immediate) reveals must set their start state before paint;
  // scroll-triggered ones can be set up after paint, which keeps hydration short.
  const useSetup = immediate ? useIsoLayoutEffect : useEffect;

  useSetup(() => {
    const scope = scopeRef.current;
    if (!scope || mode === "none") return;
    const targets = gsap.utils.toArray(scope.querySelectorAll(selector));
    if (!targets.length) return;

    const fromVars =
      type === "mask"
        ? mode === "soft"
          ? { y: travel(24, mode), opacity: 0 }
          : { yPercent: 100 }
        : { y: travel(40, mode), opacity: 0 };
    const base = {
      ...fromVars,
      duration: dur(duration ?? (type === "mask" ? 1.2 : 1), mode),
      ease: EASE_REVEAL,
    };

    let started = 0;
    const onStart = () => ++started >= (each ? targets.length : 1) && markRevealed(scope);

    const ctx = gsap.context(() => {
      if (each) {
        targets.forEach((t, i) =>
          gsap.from(t, {
            ...base,
            delay: delay + (i % 3) * stagger,
            scrollTrigger: { trigger: t, start, toggleActions: "play none none none" },
            onStart,
          })
        );
      } else {
        gsap.from(targets, {
          ...base,
          stagger,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: scope, start, toggleActions: "play none none none" },
          onStart,
        });
      }
    }, scope);
    queueRefresh();

    const unguard = guardReveal(scope, () => showNow(targets));
    return () => {
      unguard();
      ctx.revert();
    };
  }, [mode, scopeRef, selector, type, stagger, delay, duration, start, each, immediate]);
}
