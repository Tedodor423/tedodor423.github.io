import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Puts the reader where the link said they would be.
 *
 * A router navigation is not a page load: the browser does not scroll to a
 * `#heading` fragment, and it does not return to the top on a new page either.
 * Without this, every search result that points into the middle of a page
 * lands at the top of it, and following a link from halfway down one page
 * opens the next one halfway down.
 *
 * Content is imported at build time rather than fetched, so a heading is in
 * the DOM by the time this effect runs. Some targets are not: a component
 * that opens what the fragment names only after reading the fragment itself
 * (the question pane on the stakeholder map, a charge's evidence on the home
 * deck) renders the element a frame or two later. So a missing target is
 * tried again over a few frames before the page gives up and opens at the
 * top, which is what a browser does with a stale fragment or a renamed
 * heading.
 *
 * The offset under the sticky menu is `scroll-margin-top` in brand.css, not
 * arithmetic here.
 */

/** Frames to wait for a target that a component is still rendering. */
const PATIENCE = 6;

export function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      window.scrollTo(0, 0);
      return;
    }

    let cancelled = false;
    let frame = 0;

    const land = (target: HTMLElement) => {
      // A search result can point straight at something folded inside a
      // <details>. Open whatever it is folded inside, or the reader arrives
      // at a closed summary and a page that did not move.
      for (
        let box = target.closest("details");
        box;
        box = box.parentElement?.closest("details") ?? null
      ) {
        box.open = true;
      }

      // On a fresh load the brand faces arrive after the first paint (they
      // are font-display: swap), and swapping them in re-wraps every display
      // heading above the target. Scrolling before that lands the reader
      // short or past it by however much the page above changed height:
      // 135px on the experiments page. So the first scroll waits for the
      // fonts. After that they are cached and `ready` is already settled, so
      // in-app navigation does not wait at all.
      document.fonts.ready.then(() => {
        if (!cancelled) target.scrollIntoView();
      });
    };

    const look = (tries: number) => {
      const target = document.getElementById(id);
      if (target) {
        land(target);
        return;
      }
      if (tries <= 0) {
        window.scrollTo(0, 0);
        return;
      }
      frame = requestAnimationFrame(() => look(tries - 1));
    };

    look(PATIENCE);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [pathname, hash]);

  return null;
}
