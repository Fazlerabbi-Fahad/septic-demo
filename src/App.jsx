import { Suspense, useEffect } from "react";
import { ScrollTrigger, startLenis, stopLenis } from "./lib/motion.js";
import useMotionMode from "./hooks/useMotionMode.js";
import useIsoLayoutEffect from "./hooks/useIsoLayoutEffect.js";
import { ScheduleProvider } from "./context/ScheduleContext.jsx";
import EmergencyBanner from "./components/EmergencyBanner.jsx";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import ProofBar from "./components/ProofBar.jsx";
import Services from "./components/Services.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Calculator from "./components/Calculator.jsx";
import WarningSigns from "./components/WarningSigns.jsx";
import Inspections from "./components/Inspections.jsx";
import Pricing from "./components/Pricing.jsx";
import Plans from "./components/Plans.jsx";
import Owner from "./components/Owner.jsx";
import PhotoBand from "./components/PhotoBand.jsx";
import Reviews from "./components/Reviews.jsx";
import AreaFaq from "./components/AreaFaq.jsx";
import Schedule from "./components/Schedule.jsx";
import Footer from "./components/Footer.jsx";
import MobileCTA from "./components/MobileCTA.jsx";

/** Each below-the-fold section is its own Suspense boundary, so React 18 hydrates
 *  them in separate chunks and yields to the browser in between (shorter long tasks). */
const Section = ({ children }) => <Suspense fallback={null}>{children}</Suspense>;

export default function App() {
  const mode = useMotionMode();

  // Lenis smooth scrolling runs in full mode only (off in soft/none).
  useEffect(() => {
    if (mode !== "full") return;
    startLenis();
    return () => stopLenis();
  }, [mode]);

  // Hero start states are now set by GSAP (or skipped in "none" mode): drop the pre-JS gate.
  useIsoLayoutEffect(() => {
    document.documentElement.classList.remove("motion-pending");
  }, []);

  // Recalculate trigger positions once images and fonts have settled.
  useEffect(() => {
    let raf = 0;
    const refresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const onLoad = (e) => e.target.tagName === "IMG" && refresh();
    document.addEventListener("load", onLoad, true);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      document.removeEventListener("load", onLoad, true);
      window.removeEventListener("load", refresh);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <ScheduleProvider>
      <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] btn btn-amber">
        Skip to content
      </a>
      <EmergencyBanner />
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Section>
          <ProofBar />
        </Section>
        <Section>
          <Services />
        </Section>
        <Section>
          <HowItWorks />
        </Section>
        <Section>
          <Calculator />
        </Section>
        <Section>
          <WarningSigns />
        </Section>
        <Section>
          <Inspections />
        </Section>
        <Section>
          <Pricing />
        </Section>
        <Section>
          <Plans />
        </Section>
        <Section>
          <Owner />
        </Section>
        <Section>
          <PhotoBand />
        </Section>
        <Section>
          <Reviews />
        </Section>
        <Section>
          <AreaFaq />
        </Section>
        <Section>
          <Schedule />
        </Section>
      </main>
      <Section>
        <Footer />
      </Section>
      <MobileCTA />
    </ScheduleProvider>
  );
}
