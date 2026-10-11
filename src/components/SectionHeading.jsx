import { useRef } from "react";
import useReveal from "../hooks/useReveal.js";

/**
 * Mono eyebrow + H2 whose lines rise from masks, plus an optional intro.
 * `title` may be a string or an array of lines.
 */
export default function SectionHeading({ id, eyebrow, title, intro, align = "left", tone = "light", className = "" }) {
  const ref = useRef(null);
  useReveal(ref, { selector: "[data-line]", type: "mask", stagger: 0.1 });
  useReveal(ref, { selector: "[data-fade]", type: "fade", delay: 0.25 });
  const lines = Array.isArray(title) ? title : [title];
  const dark = tone === "dark";

  return (
    <div ref={ref} className={`${align === "center" ? "mx-auto text-center" : ""} max-w-[52rem] ${className}`}>
      {eyebrow && (
        <p data-fade className={`label mb-5 ${dark ? "text-meadow/75" : "text-ink/75"}`}>
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="h2">
        {lines.map((l) => (
          <span key={l} className="line-mask">
            <span data-line>{l}</span>
          </span>
        ))}
      </h2>
      {intro && (
        <p
          data-fade
          className={`mt-6 max-w-[40rem] text-[1.1875rem] ${align === "center" ? "mx-auto" : ""} ${dark ? "text-meadow/80" : "text-ink/80"}`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
