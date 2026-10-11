import { useId, useRef, useState } from "react";
import brand from "../brand.config.js";
import useReveal from "../hooks/useReveal.js";
import useMotionMode from "../hooks/useMotionMode.js";
import SectionHeading from "./SectionHeading.jsx";
import { PlusIcon } from "./Icons.jsx";

function FaqItem({ q, a, open, onToggle, animate }) {
  const id = useId();
  return (
    <div data-fade className="border-b border-ink/15">
      <h3>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-[clamp(1.125rem,1.5vw,1.375rem)] font-extrabold leading-snug tracking-[-0.01em]"
        >
          {q}
          <span
            aria-hidden="true"
            className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
              open ? "border-amber bg-amber text-white" : "border-ink/25"
            } ${animate ? "transition-[transform,background-color,border-color] duration-300" : ""}`}
            style={{ transform: open ? "rotate(45deg)" : "none" }}
          >
            <PlusIcon size={18} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={`grid ${animate ? "transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]" : ""}`}
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        inert={open ? undefined : ""}
      >
        <div className="overflow-hidden">
          <p className="max-w-[44rem] pb-7 text-ink/85">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function AreaFaq() {
  const [open, setOpen] = useState(0);
  const mode = useMotionMode();
  const areaRef = useRef(null);
  const faqRef = useRef(null);
  useReveal(areaRef, { selector: "[data-fade]", type: "fade", stagger: 0.03 });
  useReveal(faqRef, { selector: "[data-fade]", type: "fade", stagger: 0.06 });
  const { serviceArea, address } = brand;

  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y">
      <div className="container-x page-x grid gap-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
        <div id="service-area">
          <SectionHeading eyebrow="Service area" title={["Where our", "trucks run."]} id="area-title" />
          <div ref={areaRef} className="mt-10">
            <p data-fade className="text-[1.125rem] text-ink/85">
              Based in {address.city}, {address.state}, serving {serviceArea.summary}. Not sure if you're in range? Call and
              ask.
            </p>
            <h3 data-fade className="label mt-10 text-ink/75">
              Counties
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
              {serviceArea.counties.map((c) => (
                <li data-fade key={c} className="font-semibold">
                  {c} County
                </li>
              ))}
            </ul>
            <h3 data-fade className="label mt-10 text-ink/75">
              Towns
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-ink/85">
              {serviceArea.towns.map((t) => (
                <li data-fade key={t}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Straight answers." />
          <div ref={faqRef} className="mt-10 border-t border-ink/15">
            {brand.faq.map((f, i) => (
              <FaqItem
                key={f.q}
                {...f}
                open={open === i}
                animate={mode !== "none"}
                onToggle={() => setOpen((o) => (o === i ? -1 : i))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
