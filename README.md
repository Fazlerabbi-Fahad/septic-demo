# Fieldstone Septic Co. — marketing site

Single-page site for a family-owned residential septic company. Built to do one job: get homeowners to
schedule service and get home buyers and realtors to book an inspection.

**Stack:** React 18 + Vite (JavaScript), Tailwind CSS v4, GSAP + ScrollTrigger, Lenis (wired to the GSAP
ticker), react-hook-form. Fonts are self-hosted via Fontsource (Bricolage Grotesque variable, Source Sans 3,
JetBrains Mono).

```bash
npm install
npm run dev       # http://localhost:3001
npm run build     # production build + prerender into dist/
npm run preview   # serve dist/ on http://localhost:3001
```

---

## Re-skin for a new septic client (about 5 minutes)

Everything client-specific lives in **`src/brand.config.js`**. Every component reads from it, and
`vite.config.js` also uses it at build time to write the `<title>`, meta and Open Graph tags, color tokens,
LocalBusiness JSON-LD (with `areaServed` built from the counties and towns), FAQPage JSON-LD, favicon,
`robots.txt` and `sitemap.xml`.

1. **Identity & contact:** `name`, `shortName`, `wordmark`, `tagline`, `hero`, `description`, `siteUrl`,
   `phone` / `phoneHref`, `email`, `address`, `hours`.
2. **Service area:** `serviceArea.summary`, `counties`, `towns`.
3. **Trust:** `licenseLine`, `yearFounded`, `familyOwned`, `emergencyBanner` (top strip on/off),
   `has24_7` (hero says "Same-day emergency service" vs "Fast scheduling"), `rating`,
   `inspectionTurnaround`.
4. **Content:** `stats`, `services`, `howItWorks`, `priceTable`, `priceNote`, `inspection`, `plans`,
   `calculator` (interval table), `warningSigns`, `testimonials`, `owner`, `faq`.
5. **Form:** `form.endpoint` (Formspree-compatible URL), `form.calendlyUrl` (optional inline embed; leave
   empty to hide), `form.serviceTypes`, `form.propertyTypes`, `form.nextSteps`.
6. **Colors:** `colors` (meadow / stone / ink / forest / amber / muted). Keep WCAG AA contrast: amber is for
   CTAs with white text and for key numbers on light backgrounds only (it is too dark for text on forest).
7. **Motion:** `motion.respectReducedMotion` (see below).

Everything marked `SAMPLE, replace with the client's real data before going live` (stats, prices,
plans, rating, testimonials) is placeholder content. Swap it before launch. The street address, domain and
email are placeholders too.

> Tip: `services[].scheduleAs` must match one of `form.serviceTypes`. That's how "Schedule this" links
> pre-select the right chip in the form.

## Swap images

All image paths live in **`src/images.js`**. Each entry has `src`, optional `srcSet` (smaller variants),
`width`/`height` (of `src`), `alt`, and for the photo band a `caption`.

1. Put new files in `public/images/` (WebP recommended; around 1000px wide for cards, 1920px for the hero,
   plus a 600–800px variant for phones).
2. Update the matching entry in `src/images.js`. Keep the key names.
3. Write a real, descriptive `alt`. Never use imagery of sewage, waste, or open tanks with visible contents.

Current photos are from Pexels (free to use, no attribution required):

| Key | File | Used in |
| --- | --- | --- |
| `hero` | `hero-home-green-lawn-{720,960,1920}.webp` | Hero (preloaded, not lazy) |
| `pumping`, `inspection`, `repair`, `drainfield`, `install`, `risers` | `service-*.webp` | Service cards |
| `lawnHome` | `general-home-green-lawn*.webp` | "Closing soon?" inspection card |
| `owner` | `owner-portrait-technician-van*.webp` | About the owner |
| `tankerTrees`, `ruralHome`, `excavatorSite` | `general-*.webp` | Photo band |

## How motion works

- **One mode hook:** `src/hooks/useMotionMode.js` is the only code that reads
  `prefers-reduced-motion`. It returns `"full"`, `"soft"`, or `"none"` based on
  `brand.motion.respectReducedMotion`:

  | Setting | Visitor has no preference | Visitor prefers reduced motion |
  | --- | --- | --- |
  | `"off"` (default) | full | **full** (OS setting ignored) |
  | `"soften"` | full | soft: reveals, fades, count-ups and the pinned diagram at 0.6× duration; no parallax, no Lenis, no travel over 24px |
  | `"strict"` | full | none: no animation, content renders in its final state, the diagram becomes click-to-select steps |

  (`"none"` is a third return value that only occurs under `"strict"`.)
- **Shared hooks:** `useReveal` (mask rise / fade-up), `useClipReveal` (image wipe), `useParallax` (full mode
  only), `useCountUp`. One easing vocabulary in `src/lib/motion.js`: `power4.out` for reveals,
  `power2.inOut` for state changes.
- **Never hidden:** there are no CSS-only hidden states. Start states are set by `gsap.from` inside
  `gsap.context` (with cleanup, StrictMode-safe). A reveal guard (`guardReveal`) forces anything still hidden
  3 seconds after it scrolls into view to its final state. The only pre-JS state is a `motion-pending` class
  that an inline `<head>` script adds to pre-position the hero lines. The app removes it as soon as GSAP takes
  over, and the inline script removes it after 3 seconds no matter what.
- **Mobile:** ScrollTrigger and the pinned how-it-works section run on phones (layout stacks below 860px).
  Hero and pinned sections use `svh`; `ScrollTrigger.config({ ignoreMobileResize: true })`.
- There is no global CSS that zeroes animation or transition durations.

## Performance notes

- `npm run build` runs `vite build`, then an SSR build of `src/entry-server.jsx`, then
  `scripts/prerender.js`. That writes the rendered HTML into `dist/index.html` so content paints before
  JavaScript runs. The app then hydrates.
- The entry script is injected after the first frame paints, and below-the-fold sections are separate
  `<Suspense>` boundaries so hydration happens in small chunks.
- Critical fonts are preloaded (the plugin finds the hashed file names in the bundle).

## Deploy

Both hosts just need the build command and output folder.

**Vercel**
1. Push the repo to GitHub and import it in Vercel.
2. Framework preset: **Vite**. Build command `npm run build`, output directory `dist`.
3. Deploy. Then set `siteUrl` in `brand.config.js` to the real domain and redeploy (canonical, OG image,
   sitemap and JSON-LD use it).

**Netlify**
1. New site from Git, or drag the `dist/` folder into Netlify Drop after `npm run build`.
2. Build command `npm run build`, publish directory `dist`.
3. Same `siteUrl` step as above.

**Form:** create a Formspree form (or any endpoint that accepts JSON `POST` with
`Accept: application/json`), put its URL in `form.endpoint`, and redeploy. With an empty endpoint, submissions
are only logged to the browser console.

## Project map

```
src/
  brand.config.js        all client data (edit this)
  images.js              all image paths (edit this)
  App.jsx                section order, Lenis, ScrollTrigger refresh
  entry-server.jsx       prerender entry
  lib/motion.js          GSAP/ScrollTrigger/Lenis setup, reveal guard, scroll helpers
  hooks/                 useMotionMode, useReveal, useClipReveal, useParallax, useCountUp
  context/ScheduleContext.jsx   lets any CTA pre-select a service and scroll to the form
  components/            one file per section
scripts/prerender.js     writes static HTML into dist/index.html
vite.config.js           brand-driven <head>, JSON-LD, robots.txt, sitemap.xml
```
