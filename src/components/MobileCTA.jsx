import { useEffect, useState } from "react";
import brand from "../brand.config.js";
import useMotionMode from "../hooks/useMotionMode.js";
import { ScheduleLink } from "../context/ScheduleContext.jsx";
import { PhoneIcon } from "./Icons.jsx";

/** Amber bar pinned to the bottom on small screens. Shows after the hero, hides while #schedule is on screen. */
export default function MobileCTA() {
  const [pastHero, setPastHero] = useState(false);
  const [atSchedule, setAtSchedule] = useState(false);
  const mode = useMotionMode();

  useEffect(() => {
    const hero = document.getElementById("top");
    const schedule = document.getElementById("schedule");
    if (!hero || !schedule || typeof IntersectionObserver === "undefined") return;
    const heroIO = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0));
    const schedIO = new IntersectionObserver(([e]) => setAtSchedule(e.isIntersecting), { rootMargin: "0px 0px -35% 0px" });
    heroIO.observe(hero);
    schedIO.observe(schedule);
    return () => {
      heroIO.disconnect();
      schedIO.disconnect();
    };
  }, []);

  const visible = pastHero && !atSchedule;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 bg-amber text-white shadow-[0_-10px_30px_-12px_rgba(27,30,26,0.45)] min-[860px]:hidden ${
        visible ? "visible" : "invisible"
      } ${mode === "none" ? "" : "transition-[transform,visibility] duration-500 ease-[var(--ease-reveal)]"}`}
      style={{ transform: visible ? "translateY(0)" : "translateY(110%)", paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!visible}
      inert={visible ? undefined : ""}
    >
      <div className="flex items-stretch">
        <ScheduleLink className="flex min-h-15 flex-1 items-center justify-center text-[1.0625rem] font-semibold">
          Schedule service
        </ScheduleLink>
        <a
          href={`tel:${brand.phoneHref}`}
          aria-label={`Call ${brand.phone}`}
          className="flex w-18 items-center justify-center border-l border-white/30"
        >
          <PhoneIcon size={22} />
        </a>
      </div>
    </div>
  );
}
