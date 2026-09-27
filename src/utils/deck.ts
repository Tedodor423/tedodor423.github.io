import { useEffect } from "react";
import { cancelGlide, glideTo } from "./glide";

/* The home page as a deck of slides.
 *
 * Each slide registers its rests: the scroll positions at which it wants the
 * window to stop, in document coordinates. The hero has two (the top of the
 * page and the top of the body), slide two its top and bottom, slide three
 * its top and the end of its ride. One wheel tick anywhere between the first
 * rest and the last rides to the next rest in the wheel's direction, and any
 * other input (touch, keyboard, the scrollbar) that stops between two rests
 * settles to the nearer one after a moment. Below the last rest the page
 * scrolls as any page does.
 *
 * A panel that scrolls inside itself, such as the map at the end of slide
 * three, gets its own scroll first: a tick over it is left alone while it
 * can still move that way.
 *
 * One set of listeners for the whole page, installed when the first slide
 * registers and removed when the last one leaves. Which slides register at
 * all depends on the screen: see DECK_MEDIA.
 */

/**
 * When a slide pins and snaps: a screen wide and tall enough to hold one
 * as a slide, for a reader who has not asked for reduced motion. The same
 * query appears literally in each slide's stylesheet, which cannot import.
 */
export const DECK_MEDIA =
  "(min-width: 48rem) and (min-height: 36rem) and (prefers-reduced-motion: no-preference)";

type Rests = () => number[];

const sources = new Set<Rests>();
let listening = false;
let settle: number | undefined;

/** Every registered rest, in order, with shared edges kept once. */
function rests(): number[] {
  const all: number[] = [];
  for (const source of sources) all.push(...source());
  all.sort((a, b) => a - b);
  return all.filter((rest, i) => i === 0 || rest - all[i - 1] > 1);
}

/** Whether something under the pointer can still scroll itself that way. */
function scrollsInside(target: EventTarget | null, deltaY: number): boolean {
  let node = target instanceof Element ? target : null;
  while (node && node !== document.body) {
    const { overflowY } = getComputedStyle(node);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight + 1
    ) {
      if (deltaY < 0 && node.scrollTop > 0) return true;
      if (deltaY > 0 && node.scrollTop + node.clientHeight < node.scrollHeight - 1) {
        return true;
      }
    }
    node = node.parentElement;
  }
  return false;
}

function onWheel(event: WheelEvent) {
  if (event.ctrlKey || event.deltaY === 0) return; // pinch-zoom on a trackpad
  const stops = rests();
  if (stops.length < 2) return;
  const y = window.scrollY;
  if (y < stops[0] - 1 || y > stops[stops.length - 1] + 1) return;
  if (scrollsInside(event.target, event.deltaY)) return;

  const to =
    event.deltaY > 0
      ? stops.find((rest) => rest > y + 1)
      : [...stops].reverse().find((rest) => rest < y - 1);
  if (to === undefined) return;
  event.preventDefault();
  glideTo(to);
}

function onScroll() {
  window.clearTimeout(settle);
  settle = window.setTimeout(() => {
    const stops = rests();
    if (stops.length < 2) return;
    const y = window.scrollY;
    if (y <= stops[0] + 1 || y >= stops[stops.length - 1] - 1) return;
    let nearest = stops[0];
    for (const rest of stops) {
      if (Math.abs(rest - y) < Math.abs(nearest - y)) nearest = rest;
    }
    if (Math.abs(nearest - y) > 1) glideTo(nearest);
  }, 150);
}

function listen(on: boolean) {
  if (on === listening) return;
  listening = on;
  if (on) {
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
  } else {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("scroll", onScroll);
    window.clearTimeout(settle);
    cancelGlide();
  }
}

/**
 * Register a slide's rests for as long as it is mounted. Pass a stable
 * function (useCallback) that reads the current positions when asked, so a
 * resize or a font swap never leaves the deck with stale numbers. Return an
 * empty list to sit the slide out.
 */
export function useDeckRests(source: Rests): void {
  useEffect(() => {
    sources.add(source);
    listen(true);
    return () => {
      sources.delete(source);
      if (sources.size === 0) listen(false);
    };
  }, [source]);
}
