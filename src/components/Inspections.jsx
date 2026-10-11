import { useRef } from "react";
import brand from "../brand.config.js";
import images from "../images.js";
import useReveal from "../hooks/useReveal.js";
import useClipReveal from "../hooks/useClipReveal.js";
import { ScheduleLink } from "../context/ScheduleContext.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { ArrowIcon, CheckIcon } from "./Icons.jsx";
import Photo from "./Photo.jsx";

export default function Inspections() {
  const bodyRef = useRef(null);
  const cardRef = useRef(null);
  useReveal(bodyRef, { selector: "[data-fade]", type: "fade", stagger: 0.06 });
  useReveal(cardRef, { selector: "[data-card]", type: "fade" });
  useClipReveal(cardRef, { selector: "[data-clip]" });
  const { inspection } = brand;

  return (
    <section id="inspections" aria-labelledby="inspections-title" className="section-y bg-stone">
      <div className="container-x page-x grid gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-24">
        <div>
          <SectionHeading
            id="inspections-title"
            eyebrow="For home buyers & realtors"
            title={["A septic inspection", "before closing day."]}
          />
          <div ref={bodyRef} className="mt-10 max-w-[40rem]">
            <p data-fade className="text-[1.1875rem] text-ink/85">
              A septic system can be the most expensive thing on a property that nobody can see. A home inspector checks
              the house; we check what's underground, so buyers know what they're getting and sellers aren't blindsided at the
              closing table.
            </p>
            <h3 data-fade className="label mt-12 text-ink/80">
              What's included
            </h3>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {inspection.includes.map((item) => (
                <li data-fade key={item} className="flex gap-3">
                  <span className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-forest text-meadow">
                    <CheckIcon size={14} />
                  </span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <p data-fade className="mt-12 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="label text-ink/80">Turnaround</span>
              <span className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-[-0.02em]">
                {brand.inspectionTurnaround}
              </span>
            </p>
          </div>
        </div>

        <div ref={cardRef} className="lg:pt-24">
          <div data-card className="overflow-hidden rounded-[1.5rem] bg-meadow shadow-[0_30px_60px_-40px_rgba(27,30,26,0.45)]">
            <div data-clip className="aspect-[16/10] overflow-hidden">
              <Photo img={images.lawnHome} sizes="(min-width: 1024px) 38vw, 92vw" />
            </div>
            <div className="p-8 sm:p-10">
              <p className="font-display text-[clamp(1.75rem,2.6vw,2.25rem)] font-extrabold leading-tight tracking-[-0.02em]">
                Closing soon?
              </p>
              <p className="mt-5 flex items-baseline gap-3">
                <span className="mono text-[clamp(2.5rem,4vw,3.25rem)] leading-none text-amber">{inspection.price}</span>
              </p>
              <p className="label mt-3 text-muted">{inspection.priceLabel}</p>
              <ScheduleLink service="Real estate inspection" className="btn btn-amber mt-8 w-full">
                Book an inspection <ArrowIcon />
              </ScheduleLink>
              <p className="mt-6 text-[0.9375rem] text-muted">
                Realtors: ask about priority scheduling for your clients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
