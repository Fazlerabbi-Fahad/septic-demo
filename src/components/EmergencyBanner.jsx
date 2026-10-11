import brand from "../brand.config.js";
import { PhoneIcon } from "./Icons.jsx";

export default function EmergencyBanner() {
  if (!brand.emergencyBanner) return null;
  return (
    <aside aria-label="Emergency service" className="bg-ink text-meadow">
      <div className="container-x page-x flex min-h-10 flex-wrap items-center justify-center gap-x-5 gap-y-1 py-2 text-center text-[0.9375rem] leading-snug">
        <p className="font-semibold">Backup or overflow? Same-day emergency service.</p>
        <p className="flex items-center gap-4">
          <a
            href={`tel:${brand.phoneHref}`}
            className="mono inline-flex items-center gap-1.5 underline decoration-meadow/40 underline-offset-4 hover:decoration-meadow"
          >
            <PhoneIcon size={15} />
            {brand.phone}
          </a>
          <a href="#schedule" className="underline decoration-meadow/40 underline-offset-4 hover:decoration-meadow">
            Request service
          </a>
        </p>
      </div>
    </aside>
  );
}
