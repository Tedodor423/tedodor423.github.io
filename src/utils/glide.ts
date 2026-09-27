/* The one way this wiki moves the window: a ride between two rests.
 *
 * Driven by hand rather than by scrollTo({ behavior: "smooth" }) because the
 * browser's own curve is quick and uneven across engines, and the home page's
 * slides should feel the same everywhere. Ease in and out, 700 ms. One ride
 * at a time: a new call cancels the ride in flight, so reversing the wheel
 * mid-glide turns it around from wherever it is, and two slides that both
 * glide can never fight over the window.
 *
 * Under prefers-reduced-motion the window jumps instead.
 */

export const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let frame = 0;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (2 - 2 * t) ** 2 / 2;
}

/** Stop the ride in flight, if there is one. */
export function cancelGlide(): void {
  cancelAnimationFrame(frame);
  frame = 0;
}

/** Ride the window to `top`, in document coordinates. */
export function glideTo(top: number): void {
  cancelGlide();
  if (REDUCED_MOTION) {
    window.scrollTo(0, top);
    return;
  }
  const from = window.scrollY;
  const distance = top - from;
  if (Math.abs(distance) < 1) return;
  const started = performance.now();
  const step = (now: number) => {
    const t = Math.min((now - started) / 700, 1);
    window.scrollTo(0, from + distance * easeInOut(t));
    if (t < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
}
