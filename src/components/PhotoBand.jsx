import { useRef } from "react";
import images from "../images.js";
import useClipReveal from "../hooks/useClipReveal.js";
import useParallax from "../hooks/useParallax.js";
import useReveal from "../hooks/useReveal.js";
import Photo from "./Photo.jsx";

function Shot({ img, frameCls, innerRef, figCls = "" }) {
  return (
    <figure className={`flex flex-col ${figCls}`}>
      <div data-clip className={`overflow-hidden rounded-[1.25rem] bg-stone ${frameCls}`}>
        <div ref={innerRef} className={innerRef ? "relative -top-[6%] h-[112%]" : "h-full"}>
          <Photo img={img} sizes="(min-width: 768px) 55vw, 92vw" />
        </div>
      </div>
      <figcaption className="label mt-3 text-ink/75">{img.caption}</figcaption>
    </figure>
  );
}

/** Asymmetric three-photo band: the trucks, the places we work, the equipment. */
export default function PhotoBand() {
  const ref = useRef(null);
  const wideRef = useRef(null);
  useClipReveal(ref, { selector: "[data-clip]" });
  useParallax(wideRef, { amount: 5, triggerRef: ref });
  useReveal(ref, { selector: "[data-fade]", type: "fade" });

  return (
    <section aria-label="Our crews at work" className="pb-[clamp(6rem,14vh,10rem)]">
      <div ref={ref} className="container-x page-x grid gap-x-6 gap-y-10 md:grid-cols-12">
        <Shot img={images.tankerTrees} figCls="md:col-span-5" frameCls="aspect-[4/3] md:aspect-[4/5]" />
        <Shot img={images.ruralHome} figCls="md:col-span-7" frameCls="aspect-[4/3] md:aspect-auto md:flex-1" innerRef={wideRef} />
        <p
          data-fade
          className="display-light self-center text-[clamp(1.625rem,2.6vw,2.5rem)] md:col-span-5 md:pr-8"
        >
          Every job ends with a rinse, a rake, and a walk-around with you.
        </p>
        <Shot img={images.excavatorSite} figCls="md:col-span-7" frameCls="aspect-[16/9]" />
      </div>
    </section>
  );
}
