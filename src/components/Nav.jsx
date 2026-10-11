import { useEffect, useRef, useState } from "react";
import brand from "../brand.config.js";
import { gsap, EASE_REVEAL, lockScroll, scrollToTarget } from "../lib/motion.js";
import useMotionMode, { dur, travel } from "../hooks/useMotionMode.js";
import { ScheduleLink } from "../context/ScheduleContext.jsx";
import Wordmark from "./Wordmark.jsx";
import { CloseIcon, MenuIcon, PhoneIcon } from "./Icons.jsx";
import useIsoLayoutEffect from "../hooks/useIsoLayoutEffect.js";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#inspections", label: "Inspections" },
  { href: "#reviews", label: "Reviews" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(72);
  const headerRef = useRef(null);
  const mode = useMotionMode();
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock scroll, Escape to close, staggered link rise.
  useIsoLayoutEffect(() => {
    if (!open) return;
    setMenuTop(headerRef.current.getBoundingClientRect().bottom);
    lockScroll(true);
    const menu = menuRef.current;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    menu.querySelector("a")?.focus({ preventScroll: true });

    const ctx = gsap.context(() => {
      if (mode === "none") return;
      gsap.from(menu, { opacity: 0, duration: dur(0.35, mode), ease: "power2.out" });
      gsap.from("[data-menu-item]", {
        ...(mode === "soft" ? { y: travel(24, mode), opacity: 0 } : { yPercent: 110 }),
        duration: dur(0.9, mode),
        ease: EASE_REVEAL,
        stagger: 0.06,
        delay: 0.08,
      });
    }, menu);

    return () => {
      ctx.revert();
      lockScroll(false);
      document.removeEventListener("keydown", onKey);
      toggleRef.current?.focus({ preventScroll: true });
    };
  }, [open, mode]);

  const solid = scrolled && !open;
  const go = (href) => (e) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => scrollToTarget(href));
  };

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 h-[4.5rem] transition-[background-color,box-shadow,color] duration-300 ${
        open
          ? "bg-forest text-meadow"
          : solid
            ? "bg-meadow text-ink shadow-[0_6px_24px_-12px_rgba(27,30,26,0.35)]"
            : "bg-transparent text-meadow"
      }`}
    >
      <nav aria-label="Main" className="container-x page-x flex h-full items-center justify-between gap-6">
        <a href="#top" onClick={go("#top")} className="shrink-0">
          <Wordmark />
        </a>

        <ul className="hidden items-center gap-7 min-[1200px]:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={go(l.href)} className="font-semibold underline-offset-[6px] hover:underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 sm:gap-5">
          <a
            href={`tel:${brand.phoneHref}`}
            className="mono hidden items-center gap-2 text-[0.9375rem] hover:underline md:inline-flex"
          >
            <PhoneIcon size={16} />
            {brand.phone}
          </a>
          <ScheduleLink className="btn btn-amber hidden !min-h-11 !px-5 !text-base min-[860px]:inline-flex">
            Schedule service
          </ScheduleLink>
          <a
            href={`tel:${brand.phoneHref}`}
            aria-label={`Call ${brand.phone}`}
            className="inline-flex size-11 items-center justify-center rounded-full border border-current/30 md:hidden"
          >
            <PhoneIcon size={19} />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-current/30 min-[1200px]:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          style={{ paddingTop: menuTop + 16 }}
          className="fixed inset-0 -z-10 flex h-dvh flex-col overflow-y-auto bg-forest text-meadow page-x pb-8"
        >
          <ul className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <li key={l.href} className="overflow-hidden">
                <a
                  data-menu-item
                  href={l.href}
                  onClick={go(l.href)}
                  className="block py-2 font-display text-[clamp(2.25rem,9vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 pt-10">
            <div className="overflow-hidden">
              <a data-menu-item href={`tel:${brand.phoneHref}`} className="mono flex items-center gap-2 text-xl">
                <PhoneIcon size={20} />
                {brand.phone}
              </a>
            </div>
            <div className="overflow-hidden">
              <ScheduleLink data-menu-item className="btn btn-amber w-full" onClick={() => setOpen(false)}>
                Schedule service
              </ScheduleLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
