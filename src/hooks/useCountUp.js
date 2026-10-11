import { useEffect } from "react";
import { gsap, EASE_REVEAL, guardReveal, markRevealed, queueRefresh } from "../lib/motion.js";
import useMotionMode, { dur } from "./useMotionMode.js";

const format = (n, decimals) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Counts each `[data-count]` element inside `scopeRef` up from 0 once.
 * The final value is rendered by React, so it is correct without JS; the
 * hook only animates toward it. Element needs data-count, data-decimals.
 */
export default function useCountUp(scopeRef, { duration = 2, start = "top 85%" } = {}) {
  const mode = useMotionMode();

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || mode === "none") return;
    const els = Array.from(scope.querySelectorAll("[data-count]"));
    const finals = els.map((el) => el.textContent);
    const setFinal = () => els.forEach((el, i) => (el.textContent = finals[i]));

    const ctx = gsap.context(() => {
      els.forEach((el) => {
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const counter = { v: 0 };
        el.textContent = format(0, decimals);
        gsap.to(counter, {
          v: target,
          duration: dur(duration, mode),
          ease: EASE_REVEAL,
          scrollTrigger: { trigger: scope, start, toggleActions: "play none none none" },
          onStart: () => markRevealed(scope),
          onUpdate: () => (el.textContent = format(counter.v, decimals)),
          onComplete: () => (el.textContent = format(target, decimals)),
        });
      });
    }, scope);
    queueRefresh();

    const unguard = guardReveal(scope, setFinal);
    return () => {
      unguard();
      ctx.revert();
      setFinal();
    };
  }, [mode, scopeRef, duration, start]);
}
