import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import brand from "./src/brand.config.js";
import images from "./src/images.js";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Absolute site URL for canonical, Open Graph and sitemap links. Link previews need absolute
 * URLs on the real domain, so prefer an explicit SITE_URL, then the host's production URL
 * (Vercel, Netlify), and fall back to brand.siteUrl.
 */
const siteUrl = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.CONTEXT === "production" && process.env.URL) ||
  process.env.DEPLOY_PRIME_URL ||
  brand.siteUrl
).replace(/\/+$/, "");

/** Writes brand-driven <head> content into index.html so it is static (good for SEO and no color flash). */
function brandHead() {
  const { colors, address, serviceArea } = brand;
  const title = `${brand.name} | Septic Pumping, Inspections & Repair in ${address.city}, ${address.state}`;
  const ogImage = siteUrl + images.og.src;

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    name: brand.name,
    description: brand.description,
    url: siteUrl,
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

Sitemap: ${siteUrl}/sitemap.xml
`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc><changefreq>monthly</changefreq></url>
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
    <link rel="canonical" href="${esc(siteUrl)}/" />
    <meta name="theme-color" content="${colors.forest}" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(favicon)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(brand.name)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(brand.description)}" />
    <meta property="og:url" content="${esc(siteUrl)}/" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta property="og:image:secure_url" content="${esc(ogImage)}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="${images.og.width}" />
    <meta property="og:image:height" content="${images.og.height}" />
    <meta property="og:image:alt" content="${esc(images.og.alt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(brand.description)}" />
    <meta name="twitter:image" content="${esc(ogImage)}" />
    <meta name="twitter:image:alt" content="${esc(images.og.alt)}" />
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
