import { MAP_ANCHOR, recordAnchor } from "../data/stakeholders";
import { REDUCED_MOTION } from "./glide";
import { MAP_H, MAP_W } from "./worldHexes";

/* The stakeholder map turning into the small map beside the interviews, and
 * back.
 *
 * The interviews (StakeholderRecord) follow the map (StakeholderMap). The
 * map is "big" while its stage holds the window; the moment the stage starts
 * to leave, it is "small". Crossing that line either way plays one quick
 * morph, MORPH_MS long whatever the scroll is doing: the small map's frame is
 * flown, by transform, from where the world is drawn on the stage to the
 * small map's place half way down the right of the window, shrinking as it
 * goes, while the big map's drawing and the panels on it fade from under it;
 * or the reverse. Once small, the frame holds that place while the
 * interviews scroll up to meet it, which is exactly where its own sticky
 * column then holds it, so it hands over to the page without a seam.
 *
 * The world is drawn the same on both: one lattice, one set of colours.
 * StakeholderRecord.css brings the small map's people cells to the big
 * map's size and rim at the big end (--sr-morph).
 *
 * The buttons that cross between the two, "Read full interview" on the
 * map's card and "Go back to main map" above the small map, jump the window
 * and play the same morph from what was on the screen before the jump.
 *
 * Only where the small map is drawn (64rem up), and not under
 * prefers-reduced-motion, where a zoom across the screen is exactly the
 * movement to leave out: there the map scrolls away as any section does and
 * the buttons go as plain links. If the interviews ever stop following the
 * map, so the small map would float over something else, it stands down the
 * same way.
 */

/** How long the morph takes, either way, in ms. */
const MORPH_MS = 240;

/** Through the morph towards small (0 to 1): by SEAM the frame has faded in
 * over the big map and the big map out from under it; from LANDED the
 * button and caption fade in beside it. */
const SEAM = 0.2;
const LANDED = 0.6;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

type Mode = "big" | "small";

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpBox = (a: Box, b: Box, t: number): Box => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (2 - 2 * t) ** 3 / 2;

/** Where the map stands, and the morph in flight, if one is. Until
 * `settled`, the first frame takes whichever the window calls for without a
 * morph: a page opened half way down the interviews has nothing to morph
 * from. */
let mode: Mode = "big";
let settled = false;
let tween: { from: Box; fromK: number; to: Mode; started: number } | null =
  null;
/** What was last drawn: the frame's box on the screen, and how far towards
 * small it was (1 small, 0 big). */
let shown: Box | null = null;
let shownK = 0;
/** Set by a button just before it jumps the window: what was on the screen,
 * for the morph to start from. */
let jumpFrom: Box | null = null;

function partsOf() {
  const section = document.getElementById(MAP_ANCHOR);
  const pin = section?.querySelector<HTMLElement>(".sm-pin");
  const canvas = section?.querySelector<HTMLElement>(".sm-canvas");
  const record = document.querySelector<HTMLElement>(".stakeholder-record");
  const where = record?.querySelector<HTMLElement>(".sr-where");
  const fly = where?.querySelector<HTMLElement>(".sr-where-fly");
  if (!section || !pin || !canvas || !record || !where || !fly) return null;
  if (REDUCED_MOTION || getComputedStyle(where).display === "none") {
    return null;
  }
  return { section, pin, canvas, record, where, fly };
}

type Parts = NonNullable<ReturnType<typeof partsOf>>;

/** The scroll at which the stage starts to leave the window. */
function leaveOf(p: Parts): number {
  return (
    p.pin.getBoundingClientRect().bottom + window.scrollY - window.innerHeight
  );
}

/** The scroll at which the small map's column starts to hold it: the top of
 * the interviews' first row at the top of the window. */
function holdOf(p: Parts): number {
  const cs = getComputedStyle(p.record);
  return (
    p.record.getBoundingClientRect().top +
    window.scrollY +
    parseFloat(cs.paddingTop) +
    parseFloat(cs.borderTopWidth)
  );
}

/** Where the big map draws the world now: its canvas, letterboxed as the
 * svg's `meet` does. */
function worldOf(p: Parts): Box {
  const c = p.canvas.getBoundingClientRect();
  const s = Math.min(c.width / MAP_W, c.height / MAP_H);
  const w = MAP_W * s;
  const h = MAP_H * s;
  return { x: c.left + (c.width - w) / 2, y: c.top + (c.height - h) / 2, w, h };
}

/** Everything back where the stylesheets put it. */
function rest() {
  shown = null;
  const section = document.getElementById(MAP_ANCHOR);
  section?.removeAttribute("data-morphing");
  section?.style.removeProperty("--sm-fade");
  const where = document.querySelector<HTMLElement>(".sr-where");
  if (!where) return;
  where.removeAttribute("data-flying");
  for (const el of where.querySelectorAll<HTMLElement>(
    ".sr-where-fly, .sr-back, .sr-where-caption",
  )) {
    el.style.removeProperty("transform");
    el.style.removeProperty("opacity");
    el.style.removeProperty("--sr-morph");
  }
}

/** One frame: where the map should be for the window as it is now. Returns
 * whether a morph is still running and wants the next frame. */
function place(now: number): boolean {
  const p = partsOf();
  if (!p || holdOf(p) - leaveOf(p) > 2 * window.innerHeight) {
    settled = false;
    tween = null;
    jumpFrom = null;
    rest();
    return false;
  }
  const want: Mode = window.scrollY - leaveOf(p) >= 1 ? "small" : "big";
  if (!settled) {
    mode = want;
    settled = true;
  }

  // Measured before anything is written, so a frame costs one layout. The
  // small map's own box, untransformed: its column is never moved, and the
  // frame's offsets inside it ignore the transform.
  const col = p.where.getBoundingClientRect();
  const own: Box = {
    x: col.left + p.fly.offsetLeft,
    y: col.top + p.fly.offsetTop,
    w: p.fly.offsetWidth,
    h: p.fly.offsetHeight,
  };
  // Small, it sits where its column holds it, or, once the column has
  // reached that place and moved on, wherever the column has it.
  const held: Box = { ...own, y: Math.min(own.y, p.fly.offsetTop) };
  const big = worldOf(p);

  const heading = tween ? tween.to : mode;
  if (want !== heading) {
    tween = {
      from: jumpFrom ?? shown ?? (mode === "big" ? big : held),
      fromK: shownK,
      to: want,
      started: now,
    };
  }
  jumpFrom = null;

  let at: Box;
  let k: number;
  if (tween) {
    const u = clamp01((now - tween.started) / MORPH_MS);
    const e = easeInOut(u);
    const toK = tween.to === "small" ? 1 : 0;
    at = lerpBox(tween.from, tween.to === "small" ? held : big, e);
    k = lerp(tween.fromK, toK, e);
    if (u >= 1) {
      mode = tween.to;
      tween = null;
    }
  } else {
    at = mode === "small" ? held : big;
    k = mode === "small" ? 1 : 0;
  }
  shownK = k;

  // At rest big, or at rest small with the column holding the frame itself:
  // nothing to draw over the page.
  if (!tween && (mode === "big" || own.y - held.y < 0.5)) {
    rest();
    return false;
  }

  shown = at;
  const seam = clamp01(k / SEAM);
  const landed = String(clamp01((k - LANDED) / (1 - LANDED)));
  const dx = at.x - own.x;
  p.section.setAttribute("data-morphing", "");
  p.section.style.setProperty("--sm-fade", String(1 - seam));
  p.where.toggleAttribute("data-flying", k < 1);
  p.fly.style.transform = `translate(${dx}px, ${at.y - own.y}px) scale(${at.w / own.w})`;
  p.fly.style.opacity = String(seam);
  p.fly.style.setProperty("--sr-morph", String(1 - k));
  // The button and the caption keep to the frame's top and bottom edges.
  const back = p.where.querySelector<HTMLElement>(".sr-back");
  const caption = p.where.querySelector<HTMLElement>(".sr-where-caption");
  if (back) {
    back.style.transform = `translate(${dx}px, ${at.y - own.y}px)`;
    back.style.opacity = landed;
  }
  if (caption) {
    caption.style.transform = `translate(${dx}px, ${at.y + at.h - (own.y + own.h)}px)`;
    caption.style.opacity = landed;
  }
  return tween !== null;
}

let raf = 0;
function schedule() {
  if (raf) return;
  raf = requestAnimationFrame((now) => {
    raf = 0;
    if (place(now)) schedule();
  });
}

/** Watch the window's scroll for the line between big and small, while
 * mounted. */
export function installMapMorph(): () => void {
  settled = false;
  tween = null;
  shown = null;
  shownK = 0;
  schedule();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  return () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    rest();
  };
}

/** Jump the window to `top`, the morph starting from what was on the
 * screen. */
function jump(top: number, from: Box) {
  jumpFrom = from;
  window.scrollTo({ top, behavior: "instant" });
  schedule();
}

/**
 * "Go back to main map": straight up to the map filling the window, the
 * small map growing back into it. False where there is no morph, and the
 * caller does what it did before.
 */
export function rideToMap(): boolean {
  const p = partsOf();
  if (!p) return false;
  const r = p.fly.getBoundingClientRect();
  const top = p.pin.getBoundingClientRect().top + window.scrollY;
  jump(top, { x: r.left, y: r.top, w: r.width, h: r.height });
  return true;
}

/**
 * "Read full interview": straight down to the interview, the map shrinking
 * into the small one beside it. False where there is no morph.
 */
export function rideToRecord(id: string): boolean {
  const p = partsOf();
  const entry = document.getElementById(recordAnchor(id));
  if (!p || !entry) return false;
  const margin = parseFloat(getComputedStyle(entry).scrollMarginTop) || 0;
  const top = entry.getBoundingClientRect().top + window.scrollY - margin;
  jump(top, shown ?? worldOf(p));
  return true;
}
