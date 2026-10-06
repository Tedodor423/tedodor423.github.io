import { useEffect } from "react";
import { REDUCED_MOTION, cancelGlide, glideTo } from "./glide";

/* Scrolling past full-screen pieces: the home page's slides and the
 * stakeholder map on the human practices page.
 *
 * Each piece registers its rests: the scroll positions at which it reads
 * whole, in document coordinates. The hero has two (the top of the page and
 * the top of the body), slide two its top and bottom, slide three its top,
 * the end of its ride and its bottom, the map the screen above it, the map
 * filling the screen, and the screen after it.
 *
 * Scrolling itself is never taken over: the wheel, touch, keyboard and
 * scrollbar all move the page natively and as far as the reader likes.
 * Only once the reader stops, between two rests of the same piece, does the
 * window ease on to one of them. Which one follows the way the reader was
 * going: past a small nudge, on to the next rest that way; within it, back
 * to the one they left. Outside every piece nothing moves, and nothing
 * moves while a finger or the scrollbar is still held, under
 * prefers-reduced-motion, or after a scroll the page made itself (a link to
 * a heading, the route change).
 *
 * One set of listeners for the whole page, installed when the first piece
 * registers and removed when the last one leaves. Which slides register at
 * all depends on the screen: see DECK_MEDIA.
 */

/**
 * When a slide pins and settles: a screen wide and tall enough to hold one
 * as a slide, for a reader who has not asked for reduced motion. The same
 * query appears literally in each slide's stylesheet, which cannot import.
 */
export const DECK_MEDIA =
  "(min-width: 48rem) and (min-height: 36rem) and (prefers-reduced-motion: no-preference)";

type Rests = () => number[];

/** How long the window has to sit still before it settles, in ms. */
const IDLE = 350;
/** How soon after the reader's own input a scroll still counts as theirs. */
const INPUT_WINDOW = 500;
const SCROLL_KEYS = new Set([
  " ",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  "ArrowUp",
  "ArrowDown",
]);

const sources = new Set<Rests>();
let listening = false;
let settle: number | undefined;
/** When the reader last used something that scrolls. */
let inputAt = -Infinity;
/** Whether the reader has scrolled since the window last settled. */
let theirs = false;
/** Fingers on the screen, and whether the scrollbar is being dragged. */
let touches = 0;
let dragging = false;
let lastY = 0;
/** The way the reader was last scrolling: 1 down, -1 up. */
let heading = 0;

/**
 * Each piece's rests in order, with shared edges kept once. Pieces that
 * meet, or nearly meet, as the home page's slides do, read as one.
 */
function pieces(): number[][] {
  const gap = window.innerHeight / 2;
  const spans = [...sources]
    .map((source) => [...source()].sort((a, b) => a - b))
    .filter((rests) => rests.length > 1)
    .sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [];
  for (const rests of spans) {
    const last = merged[merged.length - 1];
    if (last && rests[0] - last[last.length - 1] < gap) {
      last.push(...rests);
      last.sort((a, b) => a - b);
    } else {
      merged.push(rests);
    }
  }
  return merged.map((rests) =>
    rests.filter((rest, i) => i === 0 || rest - rests[i - 1] > 1),
  );
}

/** The rest to settle on from `y`, or null where nothing needs aligning. */
function restFor(y: number): number | null {
  for (const rests of pieces()) {
    if (y <= rests[0] + 1 || y >= rests[rests.length - 1] - 1) continue;
    if (rests.some((rest) => Math.abs(rest - y) <= 1)) return null;
    const i = rests.findIndex((rest) => rest > y);
    const below = rests[i - 1];
    const above = rests[i];
    const nudge = Math.min((above - below) / 8, 80);
    if (heading > 0) return y - below > nudge ? above : below;
    if (heading < 0) return above - y > nudge ? below : above;
    return y - below < above - y ? below : above;
  }
  return null;
}

function align() {
  if (!theirs || touches > 0 || dragging) return;
  theirs = false;
  if (REDUCED_MOTION) return;
  const to = restFor(window.scrollY);
  if (to === null) return;
  // Slow enough to read as the page settling rather than being thrown:
  // most of a second for a screen, less for a short way.
  const distance = Math.abs(to - window.scrollY);
  glideTo(to, Math.min(1200, Math.max(600, 450 + distance * 0.6)));
}

function wait() {
  window.clearTimeout(settle);
  settle = window.setTimeout(align, IDLE);
}

function onScroll() {
  const y = window.scrollY;
  if (performance.now() - inputAt < INPUT_WINDOW) theirs = true;
  if (theirs && y !== lastY) heading = Math.sign(y - lastY);
  lastY = y;
  wait();
}

/** The reader reached for the page: whatever ride is running gives way. */
function onInput() {
  inputAt = performance.now();
  cancelGlide();
}

function onWheel(event: WheelEvent) {
  if (!event.ctrlKey) onInput(); // ctrl is pinch-zoom on a trackpad
}

function onKey(event: KeyboardEvent) {
  if (SCROLL_KEYS.has(event.key)) onInput();
}

function onTouch(event: TouchEvent) {
  touches = event.touches.length;
  onInput();
  if (touches === 0 && theirs) wait();
}

// The page's own scrollbar is the one pointer target that is the root.
function onPointerDown(event: PointerEvent) {
  if (event.target !== document.documentElement) return;
  dragging = true;
  onInput();
}

function release() {
  if (!dragging) return;
  dragging = false;
  if (theirs) wait();
}

// Chrome does not always send pointerup after a scrollbar drag, so any move
// with no button down also counts as letting go.
function onPointerMove(event: PointerEvent) {
  if (dragging && event.buttons === 0) release();
}

const listeners: [string, EventListener][] = [
  ["scroll", onScroll as EventListener],
  ["wheel", onWheel as EventListener],
  ["keydown", onKey as EventListener],
  ["touchstart", onTouch as EventListener],
  ["touchend", onTouch as EventListener],
  ["touchcancel", onTouch as EventListener],
  ["pointerdown", onPointerDown as EventListener],
  ["pointerup", release],
  ["pointermove", onPointerMove as EventListener],
];

function listen(on: boolean) {
  if (on === listening) return;
  listening = on;
  for (const [type, listener] of listeners) {
    if (on) window.addEventListener(type, listener, { passive: true });
    else window.removeEventListener(type, listener);
  }
  window.clearTimeout(settle);
  theirs = false;
  touches = 0;
  dragging = false;
  lastY = window.scrollY;
  if (!on) cancelGlide();
}

/**
 * Register a piece's rests for as long as it is mounted. Pass a stable
 * function (useCallback) that reads the current positions when asked, so a
 * resize or a font swap never leaves the page with stale numbers. Return an
 * empty list to sit the piece out.
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
