import { useRef } from "react";
import brand from "../brand.config.js";
import useReveal from "../hooks/useReveal.js";
import SectionHeading from "./SectionHeading.jsx";

export default function Reviews() {
  const listRef = useRef(null);
  useReveal(listRef, { selector: "[data-review]", type: "fade", stagger: 0.14 });

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section-y bg-stone">
      <div className="container-x page-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading id="reviews-title" eyebrow="Reviews" title={["What the neighbors", "actually say."]} />
          <p className="flex items-baseline gap-3 md:pb-2">
            <span className="font-display text-[clamp(3rem,5vw,4.5rem)] font-extrabold leading-none tracking-[-0.04em] text-amber">
              {brand.rating}
            </span>
            <span className="label text-ink/80">average rating</span>
          </p>
        </div>

        {/* Phones and tablets: horizontal scroll-snap. Desktop: staggered editorial columns. */}
        <ul
          ref={listRef}
          aria-label="Customer reviews"
          tabIndex={0}
          className="no-scrollbar -mx-[clamp(1.5rem,6vw,7rem)] mt-20 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1.5rem,6vw,7rem)] pb-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0"
        >
          {brand.testimonials.map((t, i) => (
            <li
              key={t.name}
              data-review
              className={`w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-auto ${i === 1 ? "lg:mt-24" : i === 2 ? "lg:mt-12" : ""}`}
            >
              <figure className="flex h-full flex-col rounded-[1.5rem] bg-meadow p-8 sm:p-10">
                <p className="mono tracking-[0.2em] text-amber">
                  <span aria-hidden="true">★★★★★</span>
                  <span className="sr-only">Five out of five stars</span>
                </p>
                <blockquote className="mt-6 flex-1">
                  <p className="display-light text-[clamp(1.375rem,1.9vw,1.75rem)] !leading-[1.3]">“{t.quote}”</p>
                </blockquote>
                <figcaption className="mt-8 border-t border-ink/15 pt-5">
                  <p className="font-semibold">
                    {t.name}, {t.town}
                  </p>
                  <p className="label mt-1 text-muted">{t.service}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
