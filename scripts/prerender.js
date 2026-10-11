// Runs after `vite build` + `vite build --ssr`: renders the app to static HTML
// and writes it into dist/index.html so content paints before JavaScript loads.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const ssrDir = path.join(dist, ".ssr");
const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

const file = path.join(dist, "index.html");
let html = fs.readFileSync(file, "utf8");
if (!html.includes("<!--app-html-->")) throw new Error("index.html is missing the <!--app-html--> placeholder");
html = html.replace("<!--app-html-->", render());

// The page is fully rendered HTML now, so let it paint (and the hero image load) before
// the app script is fetched and run: inject the entry after the first frame.
const entry = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
if (entry) {
  html = html.replace(
    entry[0],
    `<script>requestAnimationFrame(function(){setTimeout(function(){var s=document.createElement("script");s.type="module";s.crossOrigin="";s.src="${entry[1]}";document.head.appendChild(s)},0)})</script>`
  );
}
fs.writeFileSync(file, html);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log("Prerendered dist/index.html");
