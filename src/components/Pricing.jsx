import { useRef } from "react";
import brand from "../brand.config.js";
import useReveal from "../hooks/useReveal.js";
import SectionHeading from "./SectionHeading.jsx";

export default function Pricing() {
  const tableRef = useRef(null);
  useReveal(tableRef, { selector: "tbody tr, [data-fade]", type: "fade", stagger: 0.06 });

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section-y">
      <div className="container-x page-x">
        <SectionHeading
          id="pricing-title"
          eyebrow="What things typically cost"
          title={["Real numbers,", "before anyone digs."]}
          intro="Ranges for our service area so you can plan. Your exact price depends on tank size, depth, and access."
        />
        <div ref={tableRef} className="mt-20">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Typical septic service prices</caption>
            <thead>
              <tr className="label text-muted">
                <th scope="col" className="pb-4 pl-4 font-medium sm:pl-6">
                  Service
                </th>
                <th scope="col" className="pb-4 pr-4 text-right font-medium sm:pr-6 md:text-left">
                  Typical range
                </th>
                <th scope="col" className="hidden pb-4 pr-6 font-medium md:table-cell">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {brand.priceTable.map((row, i) => (
                <tr key={row.service} className={i % 2 === 0 ? "bg-stone" : ""}>
                  <th
                    scope="row"
                    className="rounded-l-xl py-5 pl-4 pr-4 font-display text-[clamp(1.125rem,1.6vw,1.5rem)] font-extrabold tracking-[-0.01em] sm:pl-6"
                  >
                    {row.service}
                    <span className="mt-1 block font-body text-[0.9375rem] font-normal tracking-normal text-ink/75 md:hidden">
                      {row.note}
                    </span>
                  </th>
                  <td className="whitespace-nowrap py-5 pr-4 text-right align-top sm:pr-6 md:rounded-none md:text-left md:align-middle max-md:rounded-r-xl">
                    <span className="mono text-[clamp(1rem,1.4vw,1.25rem)] text-amber">{row.range}</span>
                  </td>
                  <td className="hidden rounded-r-xl py-5 pr-6 text-ink/80 md:table-cell">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p data-fade className="mt-10 font-display text-[clamp(1.375rem,2vw,1.75rem)] font-extrabold tracking-[-0.015em]">
            {brand.priceNote}
          </p>
          <p data-fade className="mt-2 text-[0.875rem] text-muted">
            Prices shown are typical ranges, not quotes.
          </p>
        </div>
      </div>
    </section>
  );
}
