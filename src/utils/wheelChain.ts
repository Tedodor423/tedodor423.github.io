import { REDUCED_MOTION } from "./glide";

/* A wheel over a box that scrolls on its own carries on to the page once the
 * box has gone as far as it can that way.
 *
 * For the list of people beside the interviews and the question's write-up
 * beside the map: both scroll inside themselves, and a reader with the
 * pointer over either still has to be able to scroll the page. The browser
 * hands the rest of a wheel on to the page itself only some of the time:
 * Chrome keeps a whole spin of the wheel on the box it started over, so a
 * reader at the end of the list turns the wheel and nothing moves. Here,
 * while the box can still move the way the wheel is going, the browser
 * scrolls it as usual; once it cannot, the wheel scrolls the page instead.
 * A box with nothing to scroll is left to the browser, which already passes
 * the wheel straight through it.
 *
 * A trackpad's stream of small steps moves the page step for step, as the
 * browser would. A mouse wheel's notches glide, each one adding to the glide
 * in flight rather than restarting it, so a quick spin travels its full
 * distance; under prefers-reduced-motion they jump.
 */

/** Pixels in a "line" of wheel travel, for the browsers that report lines. */
const LINE = 40;
/** A step at least this long is a mouse wheel's notch, not a trackpad's. */
const NOTCH = 50;

/** Where the page's notch glide is heading, while one is in flight. */
let heading: number | null = null;
let headingTimer = 0;

function canScroll(box: HTMLElement, dy: number): boolean {
  if (dy > 0) return box.scrollTop + box.clientHeight < box.scrollHeight - 1;
  if (dy < 0) return box.scrollTop > 0;
  return false;
}

function pixelsOf(e: WheelEvent): number {
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) return e.deltaY * LINE;
  if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return e.deltaY * window.innerHeight;
  }
  return e.deltaY;
}

function scrollPage(dy: number) {
  if (REDUCED_MOTION || Math.abs(dy) < NOTCH) {
    heading = null;
    window.scrollBy({ top: dy, behavior: "instant" });
    return;
  }
  const max = document.documentElement.scrollHeight - window.innerHeight;
  heading = Math.min(Math.max((heading ?? window.scrollY) + dy, 0), max);
  window.scrollTo({ top: heading, behavior: "smooth" });
  // A spin's notches come tens of ms apart; once they stop, the next notch
  // starts from wherever the page is.
  window.clearTimeout(headingTimer);
  headingTimer = window.setTimeout(() => (heading = null), 300);
}

/** Hand the wheel on from `box` to the page, as above. Returns the undo. */
export function chainWheel(box: HTMLElement): () => void {
  const onWheel = (e: WheelEvent) => {
    // Pinch-zoom on a trackpad, and sideways scrolling, are left alone.
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (box.scrollHeight <= box.clientHeight + 1) return;
    if (canScroll(box, e.deltaY)) return;
    e.preventDefault();
    scrollPage(pixelsOf(e));
  };
  box.addEventListener("wheel", onWheel, { passive: false });
  return () => box.removeEventListener("wheel", onWheel);
}
