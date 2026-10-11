import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import brand from "./src/brand.config.js";
import images from "./src/images.js";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Writes brand-driven <head> content into index.html so it is static (good for SEO and no color flash). */
function brandHead() {
  const { colors, address, serviceArea } = brand;
  const title = `${brand.name} | Septic Pumping, Inspections & Repair in ${address.city}, ${address.state}`;
  const ogImage = brand.siteUrl + images.hero.src;

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    name: brand.name,
    description: brand.description,
    url: brand.siteUrl,
    telephone: brand.phoneHref,
    email: brand.email,
    image: ogImage,
    foundingDate: String(brand.yearFounded),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: "US",
    },
    areaServed: [
      ...serviceArea.counties.map((c) => ({ "@type": "AdministrativeArea", name: `${c} County, ${address.state}` })),
      ...serviceArea.towns.map((t) => ({ "@type": "City", name: `${t}, ${address.state}` })),
    ],
    makesOffer: brand.services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title } })),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: brand.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${colors.forest}"/><path d="M14 44h36" stroke="${colors.amber}" stroke-width="5" stroke-linecap="round"/><text x="32" y="38" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="30" fill="${colors.meadow}">${esc(brand.shortName[0])}</text></svg>`;

  const tokens = Object.entries(colors)
    .map(([k, v]) => `--${k}:${v};`)
    .join("");

  return {
    name: "brand-head",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *
Allow: /

Sitemap: ${brand.siteUrl}/sitemap.xml
`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${brand.siteUrl}/</loc><changefreq>monthly</changefreq></url>
</urlset>
`,
      });
    },
    transformIndexHtml(html, ctx) {
      // Preload the fonts used above the fold so the swap does not shift the hero.
      // (The display face is not preloaded: the hero headline stays masked until GSAP takes over.)
      const critical = ["source-sans-3-latin-400-normal", "source-sans-3-latin-600-normal", "jetbrains-mono-latin-500-normal"];
      const fontPreloads = ctx.bundle
        ? Object.keys(ctx.bundle)
            .filter((f) => f.endsWith(".woff2") && critical.some((c) => f.includes(c)))
            .map((f) => `<link rel="preload" as="font" type="font/woff2" href="/${f}" crossorigin />`)
            .join("\n    ")
        : "";
      const head = `
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(brand.description)}" />
    <link rel="canonical" href="${esc(brand.siteUrl)}/" />
    <meta name="theme-color" content="${colors.forest}" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(favicon)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(brand.name)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(brand.description)}" />
    <meta property="og:url" content="${esc(brand.siteUrl)}/" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta property="og:image:alt" content="${esc(images.hero.alt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preload" as="image" href="${images.hero.src}" imagesrcset="${images.hero.srcSet}" imagesizes="100vw" fetchpriority="high" />
    ${fontPreloads}
    <style>:root{${tokens}}</style>
    <script>
      /* Hero pre-positioning while JS loads. Removed by App once GSAP has set the
         start state, and unconditionally after 3s so content is never left hidden. */
      document.documentElement.classList.add("motion-pending");
      setTimeout(function () { document.documentElement.classList.remove("motion-pending"); }, 3000);
    </script>
    <script type="application/ld+json">${JSON.stringify(localBusiness)}</script>
    <script type="application/ld+json">${JSON.stringify(faqPage)}</script>`;
      return html.replace("<!--brand-head-->", head);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), brandHead()],
  server: { port: 3001, strictPort: true },
  preview: { port: 3001 },
});
