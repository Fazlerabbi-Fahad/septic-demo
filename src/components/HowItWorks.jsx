import { useRef, useState } from "react";
import brand from "../brand.config.js";
import { gsap, queueRefresh } from "../lib/motion.js";
import useMotionMode from "../hooks/useMotionMode.js";
import SepticDiagram from "./SepticDiagram.jsx";
import useIsoLayoutEffect from "../hooks/useIsoLayoutEffect.js";

const { steps, summary } = brand.howItWorks;

export default function HowItWorks() {
  const mode = useMotionMode();
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const animated = mode !== "none";

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    const flows = gsap.utils.toArray(section.querySelectorAll("[data-flow]"));

    if (!animated) {
      // Strict reduced motion: no pin, no scrub. Flows show up to the selected step.
      flows.forEach((f) => (f.style.strokeDasharray = "none"));
      return;
    }

    const ctx = gsap.context(() => {
      flows.forEach((f) => {
        const len = f.getTotalLength();
        gsap.set(f, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          pin: pinRef.current,
          start: "top top",
          // soft mode: pinned section runs at 0.6x length
          end: () => `+=${window.innerHeight * (mode === "soft" ? 1.8 : 3)}`,
          scrub: mode === "soft" ? true : 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const next = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
            if (next !== activeRef.current) {
              activeRef.current = next;
              setActive(next);
            }
          },
        },
      });
      flows.forEach((f, i) => {
        tl.to(f, { strokeDashoffset: 0, duration: 0.8 }, i);
      });
      tl.to({}, { duration: 0.2 }, steps.length - 0.2);
    }, section);
    queueRefresh();

    return () => ctx.revert();
  }, [animated, mode]);

  // Strict mode: flows reflect the clicked step.
  const flowStyle = (i) => (animated ? undefined : { opacity: i <= active ? 1 : 0 });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      aria-labelledby="how-title"
      className="relative bg-forest text-meadow"
    >
      <div
        ref={pinRef}
        className={`flex flex-col justify-center overflow-hidden ${animated ? "h-[100svh]" : "section-y"}`}
      >
        <div className="container-x page-x grid w-full items-center gap-x-16 gap-y-5 py-6 min-[860px]:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <div className="min-[860px]:order-1">
            <p className="label text-meadow/75">How your system works</p>
            <h2 id="how-title" className="mt-3 font-display text-[clamp(1.75rem,3.6vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.025em]">
              Four steps, all underground.
            </h2>
          </div>

          <div className="row-span-2 rounded-[1.25rem] bg-stone p-3 sm:p-5 min-[860px]:order-2">
            <DiagramWithFlows active={active} flowStyle={flowStyle} />
          </div>

          <div className="min-[860px]:order-3 min-[860px]:self-start">
            {animated ? (
              <div className="relative grid">
                {steps.map((s, i) => (
                  <div
                    key={s.title}
                    aria-hidden={active !== i}
                    className="[grid-area:1/1] transition-[opacity,transform] duration-500 ease-[var(--ease-reveal)]"
                    style={{
                      opacity: active === i ? 1 : 0,
                      transform: `translateY(${active === i ? 0 : active > i ? -12 : 12}px)`,
                    }}
                  >
                    <Caption index={i} step={s} />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div role="group" aria-label="Choose a step" className="mb-6 flex flex-wrap gap-2">
                  {steps.map((s, i) => (
                    <button
                      key={s.title}
                      type="button"
                      aria-pressed={active === i}
                      onClick={() => setActive(i)}
                      className={`mono rounded-full border px-4 py-2 text-sm ${
                        active === i ? "border-meadow bg-meadow text-ink" : "border-meadow/40"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
                <Caption index={active} step={steps[active]} />
              </div>
            )}

            <div className="mt-6 flex gap-2" aria-hidden="true">
              {steps.map((s, i) => (
                <span
                  key={s.title}
                  className="h-1 flex-1 rounded-full transition-colors duration-500"
                  style={{ background: i <= active ? "var(--meadow)" : "color-mix(in srgb, var(--meadow) 22%, transparent)" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

}

function Caption({ index, step }) {
  const last = index === steps.length - 1;
  return (
    <div>
      <p className="mono text-[clamp(1rem,1.4vw,1.25rem)] text-meadow/75">
        {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
      </p>
      <h3 className="mt-2 font-display text-[clamp(1.375rem,2.4vw,2.125rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">
        {step.title}
      </h3>
      <p className="mt-3 max-w-[34rem] text-meadow/85">{step.body}</p>
      {last && (
        <p className="mt-4 max-w-[34rem] border-l-2 border-meadow/50 pl-4 font-semibold text-meadow">{summary}</p>
      )}
    </div>
  );
}

function DiagramWithFlows({ active, flowStyle }) {
  const ref = useRef(null);
  // Apply strict-mode flow visibility without re-creating the SVG.
  useIsoLayoutEffect(() => {
    ref.current?.querySelectorAll("[data-flow]").forEach((f, i) => {
      const st = flowStyle(i);
      f.style.opacity = st ? st.opacity : "";
    });
  });
  return (
    <div ref={ref}>
      <SepticDiagram active={active} />
    </div>
  );
}
