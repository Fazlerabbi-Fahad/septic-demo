import { useEffect } from "react";
import { gsap, queueRefresh } from "../lib/motion.js";
import useMotionMode from "./useMotionMode.js";

/**
 * Gentle scroll-linked drift. Full mode only: parallax is disabled in soft
 * and none modes. `amount` is in percent of the target's own height.
 */
export default function useParallax(
  targetRef,
  { amount = 8, from = -amount, triggerRef, start = "top bottom", end = "bottom top" } = {}
) {
  const mode = useMotionMode();

  useEffect(() => {
    const target = targetRef.current;
    if (!target || mode !== "full") return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        target,
        { yPercent: from },
        {
          yPercent: amount,
          ease: "none",
          scrollTrigger: { trigger: triggerRef?.current || target, start, end, scrub: true },
        }
      );
    });
    queueRefresh();
    return () => ctx.revert();
  }, [mode, targetRef, triggerRef, amount, from, start, end]);
}
