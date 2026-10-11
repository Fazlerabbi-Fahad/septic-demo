/**
 * Single source of every image path on the site.
 * To swap a photo: drop new files in /public/images, then update `src`,
 * `srcSet` (optional smaller variants), `width`, `height` and `alt` here.
 * Keep the same key. `width`/`height` are the dimensions of `src`.
 * Photos: Pexels (free to use, no attribution required).
 */

const images = {
  hero: {
    src: "/images/hero-home-green-lawn-1920.webp",
    srcSet:
      "/images/hero-home-green-lawn-720.webp 720w, /images/hero-home-green-lawn-960.webp 960w, /images/hero-home-green-lawn-1920.webp 1920w",
    width: 1920,
    height: 1281,
    alt: "Two-story country home with a wide, freshly mowed green lawn and a white fence under a clear sky",
  },
  pumping: {
    src: "/images/service-pumping-tanker-truck.webp",
    srcSet: "/images/service-pumping-tanker-truck-600.webp 600w, /images/service-pumping-tanker-truck.webp 1000w",
    width: 1000,
    height: 667,
    alt: "Clean white tanker truck parked on a gravel lot under a wide blue sky",
  },
  inspection: {
    src: "/images/service-inspection-technician-clipboard.webp",
    srcSet:
      "/images/service-inspection-technician-clipboard-600.webp 600w, /images/service-inspection-technician-clipboard.webp 1000w",
    width: 1000,
    height: 667,
    alt: "Inspector in a hard hat and safety vest checking a home's entry with a clipboard",
  },
  repair: {
    src: "/images/service-repair-pipe-fitting.webp",
    srcSet: "/images/service-repair-pipe-fitting-600.webp 600w, /images/service-repair-pipe-fitting.webp 800w",
    width: 800,
    height: 1422,
    alt: "Technician in work gloves tightening a fitting on a new water line outdoors",
  },
  drainfield: {
    src: "/images/service-drain-field-gravel-trench.webp",
    srcSet: "/images/service-drain-field-gravel-trench-600.webp 600w, /images/service-drain-field-gravel-trench.webp 1000w",
    width: 1000,
    height: 561,
    alt: "Freshly dug drain field trench lined with clean gravel and perforated pipe",
  },
  install: {
    src: "/images/service-installation-mini-excavator.webp",
    srcSet:
      "/images/service-installation-mini-excavator-600.webp 600w, /images/service-installation-mini-excavator.webp 1000w",
    width: 1000,
    height: 666,
    alt: "Compact excavator parked on a grassy residential slope, ready to dig",
  },
  risers: {
    src: "/images/service-risers-pvc-stock.webp",
    srcSet: "/images/service-risers-pvc-stock-600.webp 600w, /images/service-risers-pvc-stock.webp 1000w",
    width: 1000,
    height: 667,
    alt: "Neat stacks of new gray PVC pipe staged for a riser and line installation",
  },
  owner: {
    src: "/images/owner-portrait-technician-van.webp",
    srcSet: "/images/owner-portrait-technician-van-600.webp 600w, /images/owner-portrait-technician-van.webp 1100w",
    width: 1100,
    height: 758,
    alt: "Smiling technician in a high-visibility vest standing beside a clean white service van",
  },
  ruralHome: {
    src: "/images/general-rural-home-summer.webp",
    srcSet: "/images/general-rural-home-summer-800.webp 800w, /images/general-rural-home-summer.webp 1600w",
    width: 1600,
    height: 1200,
    alt: "Country home with a red roof surrounded by green fields and tall trees on a summer day",
    caption: "Acreage, farms, and long gravel drives",
  },
  lawnHome: {
    src: "/images/general-home-green-lawn.webp",
    srcSet: "/images/general-home-green-lawn-700.webp 700w, /images/general-home-green-lawn.webp 1400w",
    width: 1400,
    height: 934,
    alt: "Modern family home with a glass sunroom and a lush green lawn",
  },
  tankerTrees: {
    src: "/images/general-tanker-truck-trees.webp",
    srcSet: "/images/general-tanker-truck-trees-700.webp 700w, /images/general-tanker-truck-trees.webp 1400w",
    width: 1400,
    height: 933,
    alt: "White tanker truck parked in the shade of leafy trees",
    caption: "Trucks washed before every job",
  },
  // Link preview (Open Graph) image: 1200x630 JPG, the size and format every share target accepts.
  og: {
    src: "/images/og-image.jpg",
    width: 1200,
    height: 630,
    alt: "Two-story country home with a wide, freshly mowed green lawn and a white fence under a clear sky",
  },
  excavatorSite: {
    src: "/images/general-excavator-residential.webp",
    srcSet: "/images/general-excavator-residential-800.webp 800w, /images/general-excavator-residential.webp 1400w",
    width: 1400,
    height: 933,
    alt: "Operator in a compact excavator working beside a single-story house",
    caption: "Compact equipment for tight yards",
  },
};

export default images;
