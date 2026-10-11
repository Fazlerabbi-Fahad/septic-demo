import { renderToString } from "react-dom/server";
import App from "./App.jsx";

/** Used by scripts/prerender.js at build time to write static HTML into dist/index.html. */
export function render() {
  return renderToString(<App />);
}
