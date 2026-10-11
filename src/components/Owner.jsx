import { useRef } from "react";
import brand from "../brand.config.js";
import images from "../images.js";
import useClipReveal from "../hooks/useClipReveal.js";
import useParallax from "../hooks/useParallax.js";
import useReveal from "../hooks/useReveal.js";
import SectionHeading from "./SectionHeading.jsx";
import Photo from "./Photo.jsx";

export default function Owner() {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const imgWrapRef = useRef(null);
  const textRef = useRef(null);
  useClipReveal(frameRef, { selector: "[data-clip]", duration: 1.6 });
  useParallax(imgWrapRef, { amount: 6, triggerRef: sectionRef });
  useReveal(textRef, { selector: "[data-fade]", type: "fade", stagger: 0.1 });
  const { owner } = brand;

  return (
    <section ref={sectionRef} id="about" aria-labelledby="owner-title" className="section-y">
      <div className="container-x page-x grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div ref={frameRef}>
          <figure data-clip className="overflow-hidden rounded-[1.5rem] bg-stone">
            <div className="aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
              <div ref={imgWrapRef} className="relative -top-[7%] h-[114%]">
                <Photo img={images.owner} sizes="(min-width: 1024px) 44vw, 92vw" className="size-full object-cover object-[30%_center]" />
              </div>
            </div>
          </figure>
        </div>

        <div>
          <SectionHeading
            id="owner-title"
            eyebrow={brand.familyOwned ? `Family owned since ${brand.yearFounded}` : "About us"}
            title={owner.heading}
          />
          <div ref={textRef} className="mt-10 flex max-w-[36rem] flex-col gap-5 text-[1.125rem] text-ink/85">
            {owner.story.map((p) => (
              <p key={p.slice(0, 24)} data-fade>
                {p}
              </p>
            ))}
            <p data-fade className="mt-4 border-t border-ink/15 pt-6 text-[1.25rem] italic text-ink">
              — {owner.signoff}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
