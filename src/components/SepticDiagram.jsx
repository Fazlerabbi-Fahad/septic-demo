/**
 * Original cutaway of a conventional septic system, drawn in the brand palette.
 * Parts are grouped by step (0–3); the active step gets an amber outline and
 * the others dim. Flow lines (amber) are animated by HowItWorks via
 * stroke-dashoffset; each has data-flow={step}.
 */
const T = "stroke 0.45s ease, opacity 0.45s ease";

function Part({ step, active, children }) {
  const on = active === step;
  return (
    <g data-part={step} style={{ opacity: on ? 1 : 0.38, transition: T }}>
      {typeof children === "function" ? children(on) : children}
    </g>
  );
}

const Pipe = ({ d }) => (
  <>
    <path d={d} fill="none" stroke="var(--ink)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke="var(--stone)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

const labelProps = {
  className: "diagram-label",
  fontFamily: "JetBrains Mono, monospace",
  fontWeight: 500,
  letterSpacing: "0.1em",
  fill: "var(--ink)",
};

export const FLOW_PATHS = [
  "M150 132 V188 H304",
  "M304 188 H322 V236 H496 V196 H522",
  "M522 196 L590 212 M626 212 H788",
  "M664 262 V338 M704 262 V372 M744 262 V352 M784 262 V326",
];

export default function SepticDiagram({ active }) {
  const hl = (on) => (on ? "var(--amber)" : "var(--ink)");

  return (
    <svg viewBox="0 0 820 440" className="block h-auto w-full" role="img" aria-labelledby="diagram-title diagram-desc">
      <title id="diagram-title">Cutaway diagram of a septic system</title>
      <desc id="diagram-desc">
        A house drains through a pipe into a two-chamber septic tank with scum, liquid and sludge layers. Liquid leaves
        the tank through a distribution box into gravel drain field trenches, and the soil below filters it.
      </desc>

      <defs>
        <pattern id="gravel" width="14" height="12" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2.2" fill="var(--muted)" opacity="0.45" />
          <circle cx="10" cy="8" r="2.6" fill="var(--muted)" opacity="0.35" />
        </pattern>
        <pattern id="soil" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="6" r="1.3" fill="var(--muted)" opacity="0.35" />
          <circle cx="15" cy="16" r="1.1" fill="var(--muted)" opacity="0.3" />
        </pattern>
        <clipPath id="tank-clip">
          <rect x="300" y="168" width="222" height="152" rx="18" />
        </clipPath>
      </defs>

      {/* Ground and soil (always visible) */}
      <rect x="0" y="150" width="820" height="290" fill="var(--muted)" opacity="0.14" />
      <rect x="0" y="150" width="820" height="290" fill="url(#soil)" />
      <rect x="0" y="144" width="820" height="9" fill="var(--forest)" />

      {/* 0 — House and main line */}
      <Part step={0} active={active}>
        {(on) => (
          <>
            <text {...labelProps} x="115" y="14" textAnchor="middle">HOUSE</text>
            <path d="M36 74 L115 24 L194 74 Z" fill="var(--meadow)" stroke={hl(on)} strokeWidth="3" strokeLinejoin="round" style={{ transition: T }} />
            <rect x="50" y="72" width="130" height="72" fill="var(--meadow)" stroke={hl(on)} strokeWidth="3" style={{ transition: T }} />
            <rect x="72" y="100" width="24" height="44" fill="var(--stone)" stroke="var(--ink)" strokeWidth="2" />
            <rect x="122" y="92" width="34" height="24" fill="var(--stone)" stroke="var(--ink)" strokeWidth="2" />
            <Pipe d={FLOW_PATHS[0]} />
          </>
        )}
      </Part>

      {/* 1 — Tank with layers */}
      <Part step={1} active={active}>
        {(on) => (
          <>
            <rect x="326" y="136" width="34" height="34" fill="var(--stone)" stroke="var(--ink)" strokeWidth="2" />
            <rect x="460" y="136" width="34" height="34" fill="var(--stone)" stroke="var(--ink)" strokeWidth="2" />
            <g clipPath="url(#tank-clip)">
              <rect x="300" y="168" width="222" height="152" fill="var(--meadow)" />
              <rect x="300" y="182" width="222" height="20" fill="var(--muted)" opacity="0.5" />
              <rect x="300" y="282" width="222" height="38" fill="var(--ink)" opacity="0.4" />
            </g>
            <path d="M440 200 V224 M440 250 V320" stroke="var(--ink)" strokeWidth="3" />
            <line x1="322" y1="176" x2="322" y2="244" stroke="var(--ink)" strokeWidth="2.5" />
            <line x1="500" y1="176" x2="500" y2="244" stroke="var(--ink)" strokeWidth="2.5" />
            <rect x="300" y="168" width="222" height="152" rx="18" fill="none" stroke={hl(on)} strokeWidth="3.5" style={{ transition: T }} />
            <text {...labelProps} x="334" y="196" className="diagram-label diagram-label--sm">SCUM</text>
            <text {...labelProps} x="334" y="268" className="diagram-label diagram-label--sm">LIQUID</text>
            <text {...labelProps} x="334" y="306" className="diagram-label diagram-label--sm">SLUDGE</text>
            <text {...labelProps} x="411" y="342" textAnchor="middle">SEPTIC TANK</text>
          </>
        )}
      </Part>

      {/* 2 — Outlet, distribution box, drain field */}
      <Part step={2} active={active}>
        {(on) => (
          <>
            <rect x="640" y="190" width="156" height="66" rx="6" fill="var(--stone)" />
            <rect x="640" y="190" width="156" height="66" rx="6" fill="url(#gravel)" stroke={hl(on)} strokeWidth="3" style={{ transition: T }} />
            <Pipe d="M522 196 L590 212" />
            <Pipe d="M626 212 H788" />
            <g fill="var(--ink)">
              {[660, 690, 720, 750, 780].map((x) => (
                <circle key={x} cx={x} cy="222" r="1.8" />
              ))}
            </g>
            <rect x="588" y="196" width="40" height="34" rx="4" fill="var(--meadow)" stroke={hl(on)} strokeWidth="3" style={{ transition: T }} />
            <text {...labelProps} x="608" y="186" textAnchor="middle" className="diagram-label diagram-label--sm">D-BOX</text>
            <text {...labelProps} x="718" y="180" textAnchor="middle">DRAIN FIELD</text>
          </>
        )}
      </Part>

      {/* 3 — Soil filtering */}
      <Part step={3} active={active}>
        {(on) => (
          <>
            <rect x="640" y="262" width="156" height="138" fill="none" stroke={hl(on)} strokeWidth="2.5" strokeDasharray="6 7" style={{ transition: T }} />
            <text {...labelProps} x="718" y="424" textAnchor="middle">SOIL FILTERS</text>
          </>
        )}
      </Part>

      {/* Flow lines (animated) */}
      <g fill="none" stroke="var(--amber)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        {FLOW_PATHS.map((d, i) => (
          <path key={i} d={d} data-flow={i} />
        ))}
      </g>
    </svg>
  );
}
