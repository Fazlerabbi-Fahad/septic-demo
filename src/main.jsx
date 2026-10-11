import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
// Variable Bricolage with weight + optical-size axes (large headlines use the tighter display cut)
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource/source-sans-3/latin-400.css";
import "@fontsource/source-sans-3/latin-400-italic.css";
import "@fontsource/source-sans-3/latin-600.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "./index.css";
import App from "./App.jsx";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production HTML is prerendered (see scripts/prerender.js), so hydrate it.
// Dev has no prerendered markup and renders fresh.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
