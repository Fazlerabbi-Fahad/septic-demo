import { useRef } from "react";
import brand from "../brand.config.js";
import useCountUp from "../hooks/useCountUp.js";
import useReveal from "../hooks/useReveal.js";

const format = (n, d) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

export default function ProofBar() {
  const ref = useRef(null);
  useCountUp(ref, { duration: 2.2 });
  useReveal(ref, { selector: "[data-fade]", type: "fade", stagger: 0.08 });

  return (
    <section aria-label="Fieldstone by the numbers" className="bg-stone">
      <div ref={ref} className="container-x page-x py-[clamp(4rem,10vh,6.5rem)]">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {brand.stats.map((s) => (
            <div key={s.label} data-fade className="flex flex-col-reverse gap-2 border-l-2 border-ink/15 pl-5">
              <dt className="label text-ink/80">{s.label}</dt>
              <dd className="font-display text-[clamp(2.75rem,6vw,5.25rem)] font-extrabold leading-none tracking-[-0.04em] text-amber">
                <span data-count={s.value} data-decimals={s.decimals}>
                  {format(s.value, s.decimals)}
                </span>
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
