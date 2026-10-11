import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/* One shared easing vocabulary */
export const EASE_REVEAL = "power4.out";
export const EASE_STATE = "power2.inOut";

export { gsap, ScrollTrigger };

/* ── Lenis, wired to the GSAP ticker ─────────────────────────── */
let lenis = null;
let tick = null;

export function startLenis() {
  if (lenis) return lenis;
  lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: true });
  lenis.on("scroll", ScrollTrigger.update);
  tick = (time) => lenis && lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function stopLenis() {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
  tick = null;
}

export const getLenis = () => lenis;

/** Debounced sort + refresh: call after creating triggers. Sections hydrate in separate
 *  chunks, so triggers may be created out of page order (e.g. after the pin). */
let refreshTimer = 0;
export function queueRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, 120);
}

/** Scroll to an element or selector, using Lenis when it is running.
 *  Both paths respect the CSS scroll-padding-top that clears the sticky nav. */
export function scrollToTarget(target, { offset = 0 } = {}) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.2 });
  } else {
    const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const top = el.getBoundingClientRect().top + window.scrollY - pad + offset;
    window.scrollTo({ top, behavior: "auto" });
  }
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/* ── Reveal guard ────────────────────────────────────────────────
   If a guarded container has been on screen for 3 seconds and its reveal
   still has not started (ScrollTrigger failed, a tween was killed, etc.),
   force its targets to their final, visible state. Content is never left hidden.
   We observe the container, not the targets: masked targets are clipped by
   their parent and would never report as intersecting. */
const FALLBACK_MS = 3000;
const timers = new WeakMap();
const finalizers = new WeakMap();
let observer = null;

export function showNow(targets) {
  const list = (Array.isArray(targets) ? targets : [targets]).filter(Boolean);
  gsap.killTweensOf(list);
  gsap.set(list, { clearProps: "opacity,visibility,transform,clipPath" });
}

function getObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      clearTimeout(timers.get(target));
      if (!isIntersecting) return;
      timers.set(
        target,
        setTimeout(() => {
          if (target.dataset.revealed !== "1") finalizers.get(target)?.();
          target.dataset.revealed = "1";
          observer.unobserve(target);
        }, FALLBACK_MS)
      );
    });
  });
  return observer;
}

/** Watch `container`; if its reveal has not started 3s after it is visible, run `finalize`. */
export function guardReveal(container, finalize) {
  if (!container) return () => {};
  const io = getObserver();
  delete container.dataset.revealed;
  finalizers.set(container, finalize);
  io?.observe(container);
  return () => {
    clearTimeout(timers.get(container));
    io?.unobserve(container);
  };
}

export const markRevealed = (container) => container && (container.dataset.revealed = "1");
