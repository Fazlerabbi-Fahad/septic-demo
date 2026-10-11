import { useRef } from "react";
import brand from "../brand.config.js";
import images from "../images.js";
import useClipReveal from "../hooks/useClipReveal.js";
import useReveal from "../hooks/useReveal.js";
import { ScheduleLink } from "../context/ScheduleContext.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { ArrowIcon } from "./Icons.jsx";
import Photo from "./Photo.jsx";

export default function Services() {
  const gridRef = useRef(null);
  useClipReveal(gridRef, { selector: "[data-clip]" });
  useReveal(gridRef, { selector: "[data-card-text]", type: "fade", each: true, stagger: 0.08, start: "top 92%" });

  return (
    <section id="services" aria-labelledby="services-title" className="section-y">
      <div className="container-x page-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="services-title"
            eyebrow="Services"
            title={["Every septic job,", "one local crew."]}
          />
          <p className="max-w-[24rem] text-ink/80 lg:pb-2">
            Same trucks, same people, same written-price promise, whether it's a routine pump-out or a brand-new system.
          </p>
        </div>

        <ul ref={gridRef} className="mt-20 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {brand.services.map((s) => {
            const img = images[s.image];
            return (
              <li key={s.id} className="group flex flex-col">
                <div data-clip className="overflow-hidden rounded-[1.25rem] bg-stone">
                  <div className="aspect-[4/3] transition-transform duration-700 ease-[var(--ease-reveal)] group-hover:scale-[1.04]">
                    <Photo img={img} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" />
                  </div>
                </div>
                <div data-card-text className="flex flex-1 flex-col pt-6">
                  <h3 className="h3">{s.title}</h3>
                  {s.subtitle && <p className="label mt-2 text-muted">{s.subtitle}</p>}
                  <p className="mb-6 mt-3 text-ink/80">{s.promise}</p>
                  <div className="mt-auto flex items-center justify-between gap-4 border-t border-ink/15 pt-4">
                    <p className="mono text-[0.9375rem] text-amber">{s.price}</p>
                    <ScheduleLink service={s.scheduleAs} className="link-arrow">
                      Schedule this<span className="sr-only">: {s.title}</span> <ArrowIcon size={16} />
                    </ScheduleLink>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
