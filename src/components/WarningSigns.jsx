import { useRef, useState } from "react";
import brand from "../brand.config.js";
import { gsap, EASE_STATE } from "../lib/motion.js";
import useMotionMode, { dur, travel } from "../hooks/useMotionMode.js";
import useReveal from "../hooks/useReveal.js";
import { useSchedule } from "../context/ScheduleContext.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { AlertIcon, ArrowIcon, CheckIcon, PhoneIcon } from "./Icons.jsx";
import useIsoLayoutEffect from "../hooks/useIsoLayoutEffect.js";

export default function WarningSigns() {
  const [checked, setChecked] = useState([]);
  const { openSchedule } = useSchedule();
  const mode = useMotionMode();
  const listRef = useRef(null);
  const panelRef = useRef(null);
  useReveal(listRef, { selector: "li", type: "fade", stagger: 0.06 });

  const toggle = (id) => setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const urgent = brand.warningSigns.some((s) => s.urgent && checked.includes(s.id));
  const count = checked.length;
  const state = urgent ? "urgent" : count >= 2 ? "inspect" : count === 1 ? "watch" : "good";

  useIsoLayoutEffect(() => {
    if (mode === "none" || !panelRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current.children,
        { y: travel(14, mode), opacity: 0 },
        { y: 0, opacity: 1, duration: dur(0.55, mode), ease: EASE_STATE, stagger: 0.05 }
      );
    });
    return () => ctx.revert();
  }, [state, mode]);

  return (
    <section id="warning-signs" aria-labelledby="signs-title" className="section-y border-t border-ink/10">
      <div className="container-x page-x grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-24">
        <div>
          <SectionHeading
            id="signs-title"
            eyebrow="Warning signs"
            title={["Is your system", "trying to tell you something?"]}
            intro="Check anything you've noticed in the last few weeks. We'll tell you honestly whether it can wait."
          />
          <ul ref={listRef} className="mt-14 flex flex-col gap-2.5">
            {brand.warningSigns.map((s) => {
              const on = checked.includes(s.id);
              return (
                <li key={s.id}>
                  <label
                    className={`flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl border-[1.5px] px-5 py-3 transition-colors duration-300 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-amber ${
                      on ? "border-amber bg-stone" : "border-ink/15 hover:border-ink/40"
                    }`}
                  >
                    <input type="checkbox" checked={on} onChange={() => toggle(s.id)} className="sr-only" />
                    <span
                      aria-hidden="true"
                      className={`inline-flex size-7 shrink-0 items-center justify-center rounded-lg border-[1.5px] transition-colors duration-300 ${
                        on ? "border-amber bg-amber text-white" : "border-ink/35"
                      }`}
                    >
                      {on && <CheckIcon size={16} />}
                    </span>
                    <span className="text-[1.0625rem] font-semibold leading-snug">{s.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <aside aria-label="What your answers mean" className="lg:sticky lg:top-28 lg:self-start">
          <div
            className={`rounded-[1.5rem] p-8 transition-colors duration-500 sm:p-10 ${
              state === "urgent" ? "bg-ink text-meadow" : "bg-stone text-ink"
            }`}
          >
            <p className={`label ${state === "urgent" ? "text-meadow/80" : "text-ink/80"}`}>
              {count} of {brand.warningSigns.length} signs checked
            </p>
            <div ref={panelRef} aria-live="polite" className="mt-5">
              {state === "good" && (
                <>
                  <p className="font-display text-[clamp(2rem,3.4vw,2.75rem)] font-extrabold leading-[1.02] tracking-[-0.025em]">
                    Looks good. Stay on schedule.
                  </p>
                  <p className="mt-4 text-ink/85">
                    No signs is the best sign. Regular pumping is what keeps it that way.
                  </p>
                  <a href="#calculator" className="link-arrow mt-6">
                    Check your pumping interval <ArrowIcon size={16} />
                  </a>
                </>
              )}
              {state === "watch" && (
                <>
                  <p className="font-display text-[clamp(2rem,3.4vw,2.75rem)] font-extrabold leading-[1.02] tracking-[-0.025em]">
                    Worth keeping an eye on.
                  </p>
                  <p className="mt-4 text-ink/85">
                    One sign on its own is often minor, like a single clogged fixture. If it sticks around or a second sign shows up, give us a call.
                  </p>
                  <a href={`tel:${brand.phoneHref}`} className="link-arrow mono mt-6">
                    <PhoneIcon size={16} /> {brand.phone}
                  </a>
                </>
              )}
              {state === "inspect" && (
                <>
                  <p className="font-display text-[clamp(2rem,3.4vw,2.75rem)] font-extrabold leading-[1.02] tracking-[-0.025em]">
                    Time for an inspection.
                  </p>
                  <p className="mt-4 text-ink/85">
                    Two or more signs together usually point to a full tank or a drain field under strain. Catching it now is far cheaper than waiting.
                  </p>
                  <button type="button" onClick={() => openSchedule("Not sure")} className="btn btn-amber mt-7">
                    Book an inspection <ArrowIcon />
                  </button>
                </>
              )}
              {state === "urgent" && (
                <>
                  <p className="flex items-center gap-3 font-display text-[clamp(2.25rem,4vw,3.25rem)] font-extrabold leading-none tracking-[-0.03em]">
                    <AlertIcon size={34} /> Call now.
                  </p>
                  <p className="mt-4 text-meadow/85">
                    Water backing up means the system can't take any more. Stop running water and laundry, and call us. We handle emergencies the same day.
                  </p>
                  <a href={`tel:${brand.phoneHref}`} className="btn btn-amber mono mt-7 w-full !text-xl sm:w-auto">
                    <PhoneIcon size={20} /> {brand.phone}
                  </a>
                  <button
                    type="button"
                    onClick={() => openSchedule("Emergency (backup, overflow)")}
                    className="link-arrow mt-5 block text-meadow"
                  >
                    Or request emergency service online
                  </button>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
