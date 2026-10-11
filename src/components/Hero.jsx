import { useRef } from "react";
import brand from "../brand.config.js";
import images from "../images.js";
import useReveal from "../hooks/useReveal.js";
import useParallax from "../hooks/useParallax.js";
import { ScheduleLink } from "../context/ScheduleContext.jsx";
import { ArrowIcon } from "./Icons.jsx";

export default function Hero() {
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);

  useReveal(sectionRef, { selector: "[data-hero-line]", type: "mask", stagger: 0.12, immediate: true, delay: 0.1 });
  useReveal(sectionRef, { selector: "[data-hero-fade]", type: "fade", stagger: 0.1, immediate: true, delay: 0.55 });
  // Starts at 0 so nothing moves when the effect attaches after first paint.
  useParallax(mediaRef, { amount: 8, from: 0, triggerRef: sectionRef, start: "top top", end: "bottom top" });

  const trust = [
    "Licensed & insured",
    brand.familyOwned ? `Family owned since ${brand.yearFounded}` : `Serving since ${brand.yearFounded}`,
    `${brand.rating} average rating`,
    brand.has24_7 ? "Same-day emergency service" : "Fast scheduling",
  ];

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative -mt-[4.5rem] flex min-h-[100svh] items-end overflow-hidden bg-forest text-meadow"
    >
      <div ref={mediaRef} className="absolute inset-x-0 -top-[10%] h-[120%]">
        <img
          src={images.hero.src}
          srcSet={images.hero.srcSet}
          sizes="100vw"
          width={images.hero.width}
          height={images.hero.height}
          alt={images.hero.alt}
          fetchpriority="high"
          className="size-full object-cover object-[60%_center]"
        />
      </div>
      {/* Overlay: darker on the text side (left on desktop, bottom on mobile) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgb(27_30_26/0.92)_0%,rgb(27_30_26/0.55)_55%,rgb(27_30_26/0.2)_100%)] md:bg-[linear-gradient(100deg,rgb(27_30_26/0.88)_0%,rgb(27_30_26/0.62)_42%,rgb(27_30_26/0.08)_75%)]"
      />

      <div className="container-x page-x relative w-full pb-[clamp(2rem,6vh,5rem)] pt-28">
        <p data-hero-fade className="label mb-5 text-meadow/85">
          {brand.address.city}, {brand.address.state} · {brand.serviceArea.counties.length} counties served
        </p>
        <h1 id="hero-title" className="h1">
          {brand.hero.headlineLines.map((line) => (
            <span key={line} className="line-mask">
              <span data-hero-line>{line}</span>
            </span>
          ))}
        </h1>
        <p data-hero-fade className="mt-6 max-w-[34rem] text-[1.1875rem] leading-relaxed text-meadow/90 md:text-[1.3125rem]">
          {brand.hero.subhead}
        </p>
        <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
          <ScheduleLink className="btn btn-amber">
            Schedule service <ArrowIcon />
          </ScheduleLink>
          <ScheduleLink service="Real estate inspection" className="btn btn-outline-light">
            Book an inspection
          </ScheduleLink>
        </div>
        <ul
          data-hero-fade
          aria-label="Why homeowners choose us"
          className="label mt-10 flex flex-wrap gap-x-5 gap-y-2.5 border-t border-meadow/25 pt-5 text-meadow/90 sm:gap-x-6 md:mt-12 md:pt-6"
        >
          {trust.map((t) => (
            <li key={t} className="flex items-center gap-2 whitespace-nowrap">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-meadow/60" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
