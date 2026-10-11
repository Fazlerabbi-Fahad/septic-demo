/**
 * FIELDSTONE SEPTIC CO. — brand configuration
 * ------------------------------------------------------------------
 * Everything client-specific lives in this file. To re-skin the site for
 * a new septic client, edit the values below and swap the photos in
 * /public/images (paths are listed in src/images.js).
 *
 * This file is also read by vite.config.js at build time to write the
 * <title>, meta/Open Graph tags, color tokens, LocalBusiness JSON-LD and
 * FAQPage JSON-LD into index.html. Keep it plain JavaScript (no imports).
 */

const brand = {
  /* ── Identity ─────────────────────────────────────────────── */
  name: "Fieldstone Septic Co.",
  shortName: "Fieldstone", // used in the oversized footer wordmark
  wordmark: { first: "Fieldstone", second: "Septic Co." },
  tagline: "Septic service your neighbors actually recommend.",
  description:
    "Family-owned septic pumping, inspections, repairs, drain field work and new system installation in Knoxville and East Tennessee. Upfront pricing, on-time arrival windows, and a clean yard when we leave.",
  hero: {
    // Each entry is one masked line in the headline animation.
    headlineLines: ["Septic service", "your neighbors", "actually recommend."],
    subhead: "Upfront pricing, on-time arrival windows, and a clean yard when we leave.",
  },
  siteUrl: "https://www.fieldstoneseptic.com", // placeholder domain, replace before going live

  /* ── Contact ──────────────────────────────────────────────── */
  phone: "(865) 555-0142", // displayed
  phoneHref: "+18655550142", // used in tel: links
  email: "hello@fieldstoneseptic.com",
  address: {
    street: "4120 Maynardville Pike", // placeholder, replace before going live
    city: "Knoxville",
    state: "TN",
    zip: "37918",
  },
  hours: "Mon–Fri 7am–6pm · Sat 8am–noon · Emergencies 24/7",

  /* ── Service area ─────────────────────────────────────────── */
  serviceArea: {
    summary: "Knoxville and surrounding East Tennessee counties",
    counties: ["Knox", "Blount", "Anderson", "Loudon", "Sevier", "Jefferson", "Union", "Grainger"],
    towns: [
      "Knoxville", "Powell", "Halls", "Corryton", "Farragut", "Maryville", "Alcoa",
      "Louisville", "Oak Ridge", "Clinton", "Lenoir City", "Seymour", "Sevierville",
      "Strawberry Plains", "Maynardville", "Rutledge",
    ],
  },

  /* ── Credentials & trust ──────────────────────────────────── */
  licenseLine: "TDEC-licensed installer & pumper · NAWT-certified inspectors · Fully insured",
  yearFounded: 2003,
  familyOwned: true,
  emergencyBanner: true, // slim top strip about same-day emergency service
  has24_7: true, // true: "Same-day emergency service" in hero trust strip; false: "Fast scheduling"
  rating: "4.9", // SAMPLE, replace with the client's real data before going live
  inspectionTurnaround: "Report within 48 hours",

  /* ── Proof bar stats ──────────────────────────────────────── */
  // SAMPLE, replace with the client's real data before going live
  stats: [
    { value: 6500, decimals: 0, suffix: "+", label: "Tanks pumped" },
    { value: 4.9, decimals: 1, suffix: "", label: "Average rating" },
    { value: 30, decimals: 0, suffix: "+", label: "Years combined experience" },
    { value: 0, decimals: 0, suffix: "", label: "Surprise invoices" },
  ],

  /* ── Services (6 cards) ───────────────────────────────────── */
  // `image` is a key from src/images.js. `scheduleAs` pre-selects the form.
  // Prices: SAMPLE, replace with the client's real data before going live
  services: [
    {
      id: "pumping",
      title: "Septic pumping",
      promise: "Tank pumped, lids closed, hoses rinsed, and your lawn protected with ground mats.",
      price: "from $325",
      image: "pumping",
      scheduleAs: "Pumping",
    },
    {
      id: "inspections",
      title: "Inspections",
      subtitle: "Real estate & routine",
      promise: "A plain-English written report with photos, sludge levels, and what actually needs attention.",
      price: "from $300",
      image: "inspection",
      scheduleAs: "Real estate inspection",
    },
    {
      id: "repairs",
      title: "Repairs",
      subtitle: "Baffles, pumps, alarms, lines",
      promise: "We find the cause, show you, and give you a written price before we fix it.",
      price: "from $300",
      image: "repair",
      scheduleAs: "Repair",
    },
    {
      id: "drainfield",
      title: "Drain field repair & replacement",
      promise: "Soil-tested, permitted, and graded back so your yard looks like a yard again.",
      price: "from $3,000",
      image: "drainfield",
      scheduleAs: "Drain field concern",
    },
    {
      id: "install",
      title: "New system installation",
      promise: "Site evaluation, county permits, and a system sized for how your family really lives.",
      price: "Free estimate",
      image: "install",
      scheduleAs: "New system quote",
    },
    {
      id: "risers",
      title: "Risers & lids",
      promise: "Bring your tank lids to ground level for easier access and faster, cheaper future service.",
      price: "from $500",
      image: "risers",
      scheduleAs: "Not sure",
    },
  ],

  /* ── How your system works (pinned diagram captions) ──────── */
  howItWorks: {
    steps: [
      {
        title: "Wastewater flows to the tank",
        body: "Everything from your sinks, showers, toilets, and washer runs down one main line to a buried, watertight tank.",
      },
      {
        title: "Solids settle and the tank separates layers",
        body: "Heavy solids sink to the bottom as sludge, grease and light material float up as scum, and bacteria start breaking it all down.",
      },
      {
        title: "Liquid flows out to the drain field",
        body: "Only the clearer middle layer leaves the tank, through a distribution box that spreads it evenly into gravel trenches.",
      },
      {
        title: "Soil filters it naturally",
        body: "Feet of soil filter and clean the water before it rejoins the groundwater.",
      },
    ],
    summary:
      "Pumping removes the sludge before it reaches your drain field. That's what keeps a $500 service from becoming a $15,000 replacement.",
  },

  /* ── Typical cost table ───────────────────────────────────── */
  // SAMPLE, replace with the client's real data before going live
  priceTable: [
    { service: "Septic pumping", range: "$300 – $600", note: "Most 1,000-gal tanks land near the low end" },
    { service: "Real estate inspection", range: "$300 – $650", note: "Includes pumping-level tank evaluation" },
    { service: "Riser installation", range: "$500 – $1,500", note: "Per tank, depending on depth" },
    { service: "Baffle or pump repair", range: "$300 – $1,200", note: "Parts and labor" },
    { service: "Drain field repair", range: "$3,000 – $10,000", note: "Partial repair through full replacement" },
    { service: "New septic system", range: "$7,000 – $20,000+", note: "Conventional through engineered systems" },
  ],
  priceNote: "Every job gets a written price before work starts.",

  /* ── Real estate inspection card ──────────────────────────── */
  inspection: {
    price: "$395", // SAMPLE, replace with the client's real data before going live
    priceLabel: "Real estate inspection, standard 1,000-gal tank",
    includes: [
      "Locate and open the tank",
      "Sludge and scum layer measurement",
      "Inlet and outlet baffle check",
      "Drain field evaluation",
      "Written report with photos",
    ],
  },

  /* ── Maintenance plans (max 6 feature rows) ───────────────── */
  // SAMPLE, replace with the client's real data before going live
  plans: {
    rows: [
      "Pumping included",
      "Annual inspection",
      "Priority scheduling",
      "Repair discount",
      "Effluent filter cleaning",
    ],
    tiers: [
      {
        name: "Basic",
        price: "$19",
        period: "/mo",
        blurb: "For small households that just want it handled.",
        values: ["Every 4 years", "—", "—", "5%", "—"],
      },
      {
        name: "Plus",
        price: "$29",
        period: "/mo",
        blurb: "The plan most families choose.",
        popular: true,
        values: ["Every 3 years", "Yes", "Yes", "10%", "Yearly"],
      },
      {
        name: "Complete",
        price: "$45",
        period: "/mo",
        blurb: "For big households and older systems.",
        values: ["Every 2 years", "Yes, with report", "Same-day", "15%", "Yearly"],
      },
    ],
  },

  /* ── Pumping interval calculator ──────────────────────────── */
  // Years between pumpings by tank size (gallons) and household size (1–8).
  // Based on the widely used Penn State Extension estimates.
  calculator: {
    tankSizes: [750, 1000, 1250, 1500],
    defaultTank: 1000,
    defaultPeople: 4,
    maxPeople: 8,
    intervals: {
      750: [9.1, 4.2, 2.6, 1.8, 1.3, 1.0, 0.8, 0.7],
      1000: [12.4, 5.9, 3.7, 2.6, 2.0, 1.5, 1.2, 1.0],
      1250: [15.6, 7.5, 4.8, 3.4, 2.6, 2.0, 1.7, 1.4],
      1500: [18.9, 9.1, 5.9, 4.2, 3.3, 2.6, 2.1, 1.8],
    },
    disposalFactor: 0.7, // garbage disposal adds solids, so shorten the interval
    maxYears: 5, // we never recommend going longer than this between checks
  },

  /* ── Warning signs checklist ──────────────────────────────── */
  // `urgent: true` turns the result into "Call now".
  warningSigns: [
    { id: "slow", label: "Slow drains in more than one fixture" },
    { id: "gurgle", label: "Gurgling sounds from pipes or toilets" },
    { id: "smell", label: "Sewage smell outside near the tank or field" },
    { id: "soggy", label: "Soggy or extra-green patch over the drain field" },
    { id: "backup", label: "Water backing up into tubs, showers, or floor drains", urgent: true },
    { id: "alarm", label: "System alarm is going off" },
    { id: "overdue", label: "It's been 3+ years since the last pumping" },
  ],

  /* ── Testimonials ─────────────────────────────────────────── */
  // SAMPLE, replace with the client's real data before going live
  testimonials: [
    {
      quote:
        "Our line backed up the Wednesday before Thanksgiving with twenty people coming. Fieldstone had a truck in the driveway by two, found a collapsed outlet baffle, and had it fixed before dark. They told us the price before they touched a thing.",
      name: "Karen M.",
      town: "Powell",
      service: "Emergency repair",
    },
    {
      quote:
        "The buyer's inspection flagged our drain field two weeks before closing. Fieldstone gave us a straight answer with photos instead of a scare. The fix was smaller than we feared and the sale closed on time.",
      name: "James & Toni R.",
      town: "Maryville",
      service: "Real estate inspection",
    },
    {
      quote:
        "I've had companies leave ruts across my yard you could lose a boot in. This crew laid plywood from the driveway to the tank, pumped it, rinsed everything, and you'd never know they'd been here.",
      name: "Bill H.",
      town: "Seymour",
      service: "Septic pumping",
    },
  ],

  /* ── Owner story ──────────────────────────────────────────── */
  owner: {
    name: "Dale Whitaker",
    role: "Owner",
    heading: "We leave every yard cleaner than we found it.",
    story: [
      "My dad started pumping tanks around Knox County with one truck and a borrowed shovel. The thing he drilled into me wasn't about septic at all: you're a guest on somebody's property, so act like it.",
      "That's why our crews put down ground mats before the truck backs up, rinse every hose before it's rolled, and rake the yard before they leave. It's why you get a written price before we start, and why we'll tell you when something can wait.",
      "Most folks only think about their septic system when something goes wrong. We'd like to be the people you call before it does.",
    ],
    signoff: "Dale Whitaker, owner, and the Whitaker family",
  },

  /* ── FAQ (also written to FAQPage JSON-LD) ────────────────── */
  faq: [
    {
      q: "How often should I pump my septic tank?",
      a: "Most households should pump every 3 to 5 years. A family of four on a 1,000-gallon tank is usually closer to every 2 to 3 years, and a garbage disposal shortens that. Try the calculator above for a rough number, or book an inspection and we'll measure your sludge level and tell you exactly.",
    },
    {
      q: "What are the signs my septic system is failing?",
      a: "Slow drains throughout the house, gurgling pipes, sewage odor outdoors, soggy ground or unusually green grass over the drain field, and water backing up into tubs or floor drains. One sign is worth watching; two or more means it's time for an inspection. A backup means call us right away.",
    },
    {
      q: "Do you offer emergency service?",
      a: "Yes. If water is backing up into your home or your alarm is going off, call us. We keep a truck available for same-day emergencies across our service area, nights and weekends included, and you'll still get a price before we start.",
    },
    {
      q: "How long does a real estate inspection take?",
      a: "Most inspections take 2 to 3 hours on site, depending on how easy the tank is to reach. You'll get a written report with photos within 48 hours, and we can rush it when a closing date is tight.",
    },
    {
      q: "Can you find my tank if I don't know where it is?",
      a: "Yes. We start with county permit records when they exist, then use a pipe locator and probe to find the tank without digging up half the yard. Once it's found, we'll mark it and can add risers so you never have to search again.",
    },
    {
      q: "What shouldn't go down my drains?",
      a: "Grease and cooking oil, wipes of any kind (even 'flushable'), paper towels, feminine products, coffee grounds, cat litter, paint, and harsh chemicals like drain cleaners. Normal amounts of household cleaners and toilet paper are fine.",
    },
  ],

  /* ── Schedule form ────────────────────────────────────────── */
  form: {
    // Formspree-compatible endpoint, e.g. "https://formspree.io/f/abcdwxyz".
    // Leave empty during development: submissions are logged to the console.
    endpoint: "",
    calendlyUrl: "", // optional, e.g. "https://calendly.com/fieldstone/inspection"
    serviceTypes: [
      "Pumping",
      "Emergency (backup, overflow)",
      "Real estate inspection",
      "Repair",
      "Drain field concern",
      "New system quote",
      "Not sure",
    ],
    propertyTypes: ["Single-family home", "Mobile / manufactured home", "Farm or acreage", "Rental property", "Commercial"],
    nextSteps: [
      { title: "Confirmation within one business hour", text: "A real person from our office calls or texts to confirm the details." },
      { title: "Arrival window by text", text: "You get a two-hour window the day before, and a heads-up when we're on the way." },
      { title: "Written price before work starts", text: "No surprise invoices. If anything changes on site, we stop and ask first." },
    ],
  },

  /* ── Motion ───────────────────────────────────────────────── */
  motion: {
    /**
     * How the site reacts to the visitor's OS "reduce motion" setting.
     *  "off"    → Always full motion; the OS setting is ignored. (Default for this demo.)
     *  "soften" → If the visitor prefers reduced motion: keep reveals, fades,
     *             count-ups and the pinned diagram at 0.6x duration, but turn off
     *             parallax, Lenis smooth scroll, and any movement over 24px.
     *  "strict" → If the visitor prefers reduced motion: no animation at all.
     *             Content renders in its final state and the diagram steps
     *             become click-to-select.
     */
    respectReducedMotion: "off",
  },

  /* ── Colors (60/30/10) ────────────────────────────────────── */
  // Written to :root as CSS variables at build time. Keep AA contrast in mind:
  // amber is for CTAs (white text) and key numbers on light backgrounds only.
  colors: {
    meadow: "#F5F3EC", // 60%, page ground
    stone: "#E7E4D9", // 30%, cards, alternating sections
    ink: "#1B1E1A", // text
    forest: "#22322A", // deep sections: how-it-works, schedule, footer
    amber: "#A85C14", // 10%, CTAs, active states, key numbers
    muted: "#646A60", // secondary text on meadow
  },
};

export default brand;
