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
 * Content is imported at build time rather than fetched, so the heading is in
 * the DOM by the time this effect runs. If it is not there at all (a stale
 * fragment, a renamed heading) the page opens at the top, which is the same
 * thing a browser does.
 *
 * The offset under the sticky menu is `scroll-margin-top` in brand.css, not
 * arithmetic here.
 */
export function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) {
      window.scrollTo(0, 0);
      return;
    }

    // A stakeholder profile sits inside the collapsed roster, and a search
    // result points straight at one. Open whatever it is folded inside, or
    // the reader arrives at a closed summary and a page that did not move.
    for (
      let box = target.closest("details");
      box;
      box = box.parentElement?.closest("details") ?? null
    ) {
      box.open = true;
    }

    // On a fresh load the brand faces arrive after the first paint (they are
    // font-display: swap), and swapping them in re-wraps every display
    // heading above the target. Scrolling before that lands the reader short
    // or past it by however much the page above changed height: 135px on the
    // experiments page. So the first scroll waits for the fonts. After that
    // they are cached and `ready` is already settled, so in-app navigation
    // does not wait at all.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) target.scrollIntoView();
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, hash]);

  return null;
}
