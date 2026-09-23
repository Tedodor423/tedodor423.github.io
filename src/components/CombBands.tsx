import { useLayoutEffect, useState } from "react";
import "./CombBands.css";

/* The comb treatment, and the switch that turns it off.
 *
 * A page body is a run of bands, one per `##` section, alternating wax and
 * comb (MarkdownPage builds them). This component owns two things and no
 * markup of the page itself: the photograph's URL, handed to CSS as a custom
 * property, and the html[data-comb] attribute that every rule in
 * CombBands.css hangs off. With the switch off, none of those rules match and
 * the bands are plain wrappers, so the wiki is exactly as it was.
 *
 * TEMPORARY. To drop it: delete this file and CombBands.css, remove the line
 * in App.tsx, and collapse MarkdownPage's sections back into one <Markdown>.
 *
 * DEV ASSET, same arrangement as BeeScene: comb-bg.jpg is served out of the
 * gitignored wiki-assets-source/images_dev/ folder by the Vite dev server, so
 * on the deployed site this URL 404s, the comb bands fall back to their own
 * dark wax colour, and the build still succeeds. comb-bg.jpg is a 2000px,
 * 291 KB copy of the 6240px, 12 MB comb.JPG: upload that copy, not the
 * original. Replace the base below with the static.igem.wiki folder the
 * uploads tool returns; it rewrites raster images to .avif, so read the URL it
 * gives back rather than assuming the extension.
 */
const DEV_ASSETS = `${import.meta.env.BASE_URL}wiki-assets-source/images_dev/`;
const COMB_SRC = `${DEV_ASSETS}comb-bg.jpg`;

/** Remembered per browser so the choice survives a reload. */
const STORAGE_KEY = "nectar:comb";

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    // Private windows and blocked site data throw on access, not on read.
    return true;
  }
}

export function CombBands() {
  const [on, setOn] = useState(readStored);

  // Layout effect, not effect: this drives the page's own surfaces, so it has
  // to be on <html> before the browser paints or the wiki flashes plain on
  // every load.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.comb = on ? "on" : "off";
    // A url() in the stylesheet would make Vite bundle the photograph into
    // dist/, and images must never enter the build.
    root.style.setProperty("--comb-src", `url("${COMB_SRC}")`);
    try {
      localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {
      // Not being able to remember the choice is not a reason to break it.
    }
  }, [on]);

  return (
    // A real switch, so it announces its state and answers to Space and Enter
    // without any key handling here.
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className="comb-switch"
      onClick={() => setOn((v) => !v)}
    >
      <span className="comb-switch-label">Comb</span>
      <span className="comb-switch-track">
        <span className="comb-switch-knob" />
      </span>
    </button>
  );
}
