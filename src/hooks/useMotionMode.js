import { useSyncExternalStore } from "react";
import brand from "../brand.config.js";

/**
 * The ONLY place in the app that reads the OS "prefers-reduced-motion" setting.
 * Every animated component calls this hook instead of matchMedia.
 *
 * Returns:
 *   "full" — normal motion (always, when brand.motion.respectReducedMotion is "off")
 *   "soft" — reduced: 0.6x durations, no parallax, no Lenis, no travel over 24px
 *   "none" — only possible in "strict" mode when the visitor prefers reduced motion;
 *            components render their final state with no animation.
 */
const QUERY = "(prefers-reduced-motion: reduce)";
const setting = brand.motion?.respectReducedMotion ?? "off";

function subscribe(cb) {
  if (setting === "off" || typeof window === "undefined" || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

export function getMotionMode() {
  if (setting === "off" || typeof window === "undefined" || !window.matchMedia) return "full";
  const prefersReduced = window.matchMedia(QUERY).matches;
  if (!prefersReduced) return "full";
  return setting === "strict" ? "none" : "soft";
}

export default function useMotionMode() {
  return useSyncExternalStore(subscribe, getMotionMode, () => "full");
}

/* Helpers shared by the motion hooks */
export const SOFT_SCALE = 0.6;
export const MAX_SOFT_TRAVEL = 24;
export const dur = (seconds, mode) => (mode === "soft" ? seconds * SOFT_SCALE : seconds);
export const travel = (px, mode) =>
  mode === "soft" ? Math.sign(px) * Math.min(Math.abs(px), MAX_SOFT_TRAVEL) : px;
