import brand from "../brand.config.js";

/** Typographic wordmark: heavy first word, light second line, amber rule. */
export default function Wordmark({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 leading-none ${className}`}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true" focusable="false">
        <rect x="1" y="1" width="28" height="28" rx="7" fill="currentColor" opacity="0.12" />
        <path d="M8 19.5h14" stroke="var(--amber)" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M10 14.5h10M12.5 9.5h5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col">
        <span className="font-display text-[1.3rem] font-extrabold tracking-[-0.02em]">{brand.wordmark.first}</span>{" "}
        <span className="label mt-0.5 !text-[0.625rem] opacity-80">{brand.wordmark.second}</span>
      </span>
    </span>
  );
}
