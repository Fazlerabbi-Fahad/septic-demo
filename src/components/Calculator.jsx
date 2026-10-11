import { useMemo, useRef, useState } from "react";
import brand from "../brand.config.js";
import { gsap, EASE_STATE } from "../lib/motion.js";
import useMotionMode, { dur, travel } from "../hooks/useMotionMode.js";
import { useSchedule } from "../context/ScheduleContext.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { ArrowIcon, MinusIcon, PlusIcon } from "./Icons.jsx";
import useIsoLayoutEffect from "../hooks/useIsoLayoutEffect.js";

const cfg = brand.calculator;
const THIS_YEAR = new Date().getFullYear();

function describe(years) {
  if (years < 1) {
    const months = Math.max(6, Math.round((years * 12) / 3) * 3);
    return { big: `${months} months`, phrase: `about every ${months} months` };
  }
  const half = Math.round(years * 2) / 2;
  const txt = Number.isInteger(half) ? String(half) : `${Math.floor(half)}½`;
  return { big: `${txt} ${half === 1 ? "year" : "years"}`, phrase: `about every ${txt} ${half === 1 ? "year" : "years"}` };
}

export default function Calculator() {
  const [tank, setTank] = useState(cfg.defaultTank);
  const [people, setPeople] = useState(cfg.defaultPeople);
  const [disposal, setDisposal] = useState(false);
  const [lastYear, setLastYear] = useState("");
  const { openSchedule } = useSchedule();
  const mode = useMotionMode();
  const resultRef = useRef(null);

  const years = useMemo(() => {
    const base = cfg.intervals[tank][Math.min(people, cfg.maxPeople) - 1];
    return Math.min(cfg.maxYears, base * (disposal ? cfg.disposalFactor : 1));
  }, [tank, people, disposal]);
  const { big } = describe(years);

  const last = parseInt(lastYear, 10);
  const validLast = last >= 1950 && last <= THIS_YEAR;
  const nextYear = validLast ? Math.round(last + years) : null;
  const overdue = validLast && nextYear <= THIS_YEAR;

  // Gentle state-change pulse on the result
  useIsoLayoutEffect(() => {
    if (mode === "none" || !resultRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        resultRef.current,
        { y: travel(10, mode), opacity: 0.25 },
        { y: 0, opacity: 1, duration: dur(0.5, mode), ease: EASE_STATE }
      );
    });
    return () => ctx.revert();
  }, [big, nextYear, mode]);

  return (
    <section id="calculator" aria-labelledby="calc-title" className="section-y">
      <div className="container-x page-x grid gap-16 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-24">
        <div>
          <SectionHeading
            id="calc-title"
            eyebrow="Pumping schedule"
            title={["How often should", "you pump?"]}
            intro="Tank size and the number of people in the house do most of the work. Two answers and you'll have a good starting number."
          />

          <form className="mt-14 flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
            <fieldset>
              <legend className="label mb-4 text-muted">Tank size (gallons)</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {cfg.tankSizes.map((size) => (
                  <label key={size} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="tank"
                      value={size}
                      checked={tank === size}
                      onChange={() => setTank(size)}
                      className="peer absolute inset-0 opacity-0"
                    />
                    <span className="mono flex min-h-13 items-center justify-center rounded-xl border-[1.5px] border-ink/20 text-lg transition-colors peer-checked:border-amber peer-checked:bg-amber peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-amber hover:border-ink/60">
                      {size.toLocaleString("en-US")}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-10 sm:grid-cols-2">
              <div role="group" aria-labelledby="people-label">
                <p id="people-label" className="label mb-4 text-muted">
                  People in the household
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Fewer people"
                    disabled={people <= 1}
                    onClick={() => setPeople((p) => Math.max(1, p - 1))}
                    className="inline-flex size-13 items-center justify-center rounded-full border-[1.5px] border-ink/25 hover:border-ink disabled:opacity-40"
                  >
                    <MinusIcon />
                  </button>
                  <output aria-live="polite" className="mono w-16 text-center text-3xl">
                    {people >= cfg.maxPeople ? `${cfg.maxPeople}+` : people}
                  </output>
                  <button
                    type="button"
                    aria-label="More people"
                    disabled={people >= cfg.maxPeople}
                    onClick={() => setPeople((p) => Math.min(cfg.maxPeople, p + 1))}
                    className="inline-flex size-13 items-center justify-center rounded-full border-[1.5px] border-ink/25 hover:border-ink disabled:opacity-40"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>

              <div>
                <p className="label mb-4 text-muted" aria-hidden="true">
                  Kitchen
                </p>
                <button
                  type="button"
                  role="switch"
                  aria-checked={disposal}
                  onClick={() => setDisposal((d) => !d)}
                  className="flex min-h-13 items-center gap-3"
                >
                  <span
                    aria-hidden="true"
                    className={`relative h-8 w-14 rounded-full transition-colors duration-300 ${disposal ? "bg-amber" : "bg-ink/25"}`}
                  >
                    <span
                      className={`absolute top-1 size-6 rounded-full bg-white shadow transition-[left] duration-300 ${disposal ? "left-7" : "left-1"}`}
                    />
                  </span>
                  <span className="font-semibold">Garbage disposal</span>
                  <span className="mono text-sm text-muted" aria-hidden="true">
                    {disposal ? "Yes" : "No"}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="last-pumped" className="label mb-4 block text-muted">
                Last pumped (year, optional)
              </label>
              <input
                id="last-pumped"
                type="number"
                inputMode="numeric"
                min="1950"
                max={THIS_YEAR}
                placeholder={`e.g. ${THIS_YEAR - 3}`}
                value={lastYear}
                onChange={(e) => setLastYear(e.target.value.slice(0, 4))}
                className="mono h-13 w-44 rounded-xl border-[1.5px] border-ink/25 bg-transparent px-4 text-lg placeholder:text-muted"
              />
            </div>
          </form>
        </div>

        <aside aria-label="Your estimate" className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[1.5rem] bg-stone p-8 sm:p-10">
            <div ref={resultRef} aria-live="polite">
              <p className="label text-ink/80">Recommended interval</p>
              <p className="mt-4 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold leading-tight">
                Pump about every
              </p>
              <p className="font-display text-[clamp(3.5rem,7vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-amber">
                {big}
              </p>
              <p className="mt-6 min-h-[3.4em] text-ink/85">
                {validLast ? (
                  overdue ? (
                    <>
                      Last pumped in <span className="mono">{last}</span>: <strong>you're likely due now.</strong>
                    </>
                  ) : (
                    <>
                      Next recommended pumping: <strong className="mono">around {nextYear}</strong>
                    </>
                  )
                ) : (
                  "Add the year you last pumped to see your next recommended date."
                )}
              </p>
            </div>
            <button type="button" onClick={() => openSchedule("Pumping")} className="btn btn-amber mt-8 w-full sm:w-auto">
              Schedule pumping <ArrowIcon />
            </button>
            <p className="mt-6 border-t border-ink/15 pt-5 text-[0.9375rem] text-ink/80">
              General guidance only. Actual needs depend on usage. An inspection gives you specifics.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
