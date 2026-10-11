import brand from "../brand.config.js";
import { PhoneIcon } from "./Icons.jsx";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#inspections", label: "Inspections" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
  { href: "#schedule", label: "Schedule service" },
];

export default function Footer() {
  const { address } = brand;
  return (
    <footer className="bg-forest pb-28 text-meadow min-[860px]:pb-10">
      <div className="container-x page-x">
        <div className="grid gap-12 border-t border-meadow/15 pt-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="label text-meadow/70">Call or text</h2>
            <a href={`tel:${brand.phoneHref}`} className="mono mt-4 inline-flex items-center gap-2 text-xl hover:underline">
              <PhoneIcon size={18} /> {brand.phone}
            </a>
            <p className="mt-3">
              <a href={`mailto:${brand.email}`} className="underline decoration-meadow/35 underline-offset-4 hover:decoration-meadow">
                {brand.email}
              </a>
            </p>
            <p className="mt-3 text-meadow/75">{brand.hours}</p>
          </div>
          <div>
            <h2 className="label text-meadow/70">Service area</h2>
            <p className="mt-4 text-meadow/85">
              {brand.serviceArea.counties.join(", ")} counties, {address.state}
            </p>
            <address className="mt-3 not-italic text-meadow/75">
              {address.street}, {address.city}, {address.state} {address.zip}
            </address>
          </div>
          <div>
            <h2 className="label text-meadow/70">Licensed & certified</h2>
            <p className="mt-4 text-meadow/85">{brand.licenseLine}</p>
          </div>
          <nav aria-label="Footer">
            <h2 className="label text-meadow/70">On this page</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p
          aria-hidden="true"
          className="mt-20 select-none font-display text-[clamp(4.5rem,19vw,19rem)] font-extrabold leading-[0.8] tracking-[-0.05em] text-meadow"
        >
          {brand.shortName}
          <span className="text-amber">.</span>
        </p>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-meadow/15 pt-6 text-[0.9375rem] text-meadow/70 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {brand.name}
            {brand.familyOwned ? ` · Family owned since ${brand.yearFounded}` : ""}
          </p>
          <p>Proudly serving {brand.serviceArea.summary}.</p>
        </div>
      </div>
    </footer>
  );
}
