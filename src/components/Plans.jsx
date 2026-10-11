import { useRef } from "react";
import brand from "../brand.config.js";
import useReveal from "../hooks/useReveal.js";
import { ScheduleLink } from "../context/ScheduleContext.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { CheckIcon } from "./Icons.jsx";

export default function Plans() {
  const gridRef = useRef(null);
  useReveal(gridRef, { selector: "[data-plan]", type: "fade", stagger: 0.1 });
  const { rows, tiers } = brand.plans;

  return (
    <section id="plans" aria-labelledby="plans-title" className="section-y bg-stone">
      <div className="container-x page-x">
        <SectionHeading
          id="plans-title"
          eyebrow="Maintenance plans"
          title={["Set it, and stop", "thinking about it."]}
          intro="We keep track of when you're due, call to book it, and you pay a small monthly amount instead of a big bill every few years."
        />
        <ul ref={gridRef} className="mt-20 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <li
              key={t.name}
              data-plan
              className={`relative flex flex-col rounded-[1.5rem] p-8 sm:p-10 ${
                t.popular ? "bg-meadow ring-2 ring-amber" : "bg-meadow/60"
              }`}
            >
              {t.popular && (
                <p className="label absolute -top-3.5 left-8 rounded-full bg-amber px-3.5 py-1.5 text-white sm:left-10">
                  Most popular
                </p>
              )}
              <h3 className="h3">{t.name}</h3>
              <p className="mt-2 text-ink/80 lg:min-h-[3.4em]">{t.blurb}</p>
              <p className="mt-7 flex items-baseline gap-1">
                <span className="mono text-[3rem] leading-none text-amber">{t.price}</span>
                <span className="mono text-muted">{t.period}</span>
              </p>
              <dl className="mt-8 flex-1 divide-y divide-ink/10 border-t border-ink/10">
                {rows.map((row, i) => {
                  const v = t.values[i];
                  const none = v === "—";
                  return (
                    <div key={row} className="flex items-start justify-between gap-4 py-3.5">
                      <dt className={none ? "text-muted" : ""}>{row}</dt>
                      <dd className="text-right font-semibold">
                        {none ? (
                          <span className="text-muted" aria-label="Not included">
                            —
                          </span>
                        ) : v === "Yes" ? (
                          <span className="inline-flex items-center gap-1.5">
                            <CheckIcon size={16} /> Included
                          </span>
                        ) : (
                          v
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
              <ScheduleLink
                service="Pumping"
                className={`btn mt-8 w-full ${t.popular ? "btn-amber" : "btn-outline-dark"}`}
              >
                Choose {t.name}
              </ScheduleLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
