/* The one way this wiki moves the window: a ride between two rests.
 *
 * Driven by hand rather than by scrollTo({ behavior: "smooth" }) because the
 * browser's own curve is quick and uneven across engines, and the slides
 * should feel the same everywhere. Ease in and out, 700 ms unless the caller
 * asks for longer. One ride at a time: a new call cancels the ride in
 * flight, so two things that both glide can never fight over the window.
 *
 * Under prefers-reduced-motion the window jumps instead.
 */

export const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let frame = 0;
/** When the last ride ended, for gliding(). */
let endedAt = -Infinity;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (2 - 2 * t) ** 2 / 2;
}

/** Stop the ride in flight, if there is one. */
export function cancelGlide(): void {
  if (frame) endedAt = performance.now();
  cancelAnimationFrame(frame);
  frame = 0;
}

/**
 * True while a ride is running, and for a moment after: the scroll event for
 * a ride's last step arrives after the ride has already finished.
 */
export function gliding(): boolean {
  return frame !== 0 || performance.now() - endedAt < 100;
}

/** Ride the window to `top`, in document coordinates, over `duration` ms. */
export function glideTo(top: number, duration = 700): void {
  cancelGlide();
  // "instant", explicitly: Bootstrap's reboot sets scroll-behavior: smooth
  // on :root, which would turn every frame of the ride into its own
  // competing native animation.
  if (REDUCED_MOTION) {
    window.scrollTo({ top, behavior: "instant" });
    return;
  }
  const from = window.scrollY;
  const distance = top - from;
  if (Math.abs(distance) < 1) return;
  const started = performance.now();
  const step = (now: number) => {
    const t = Math.min((now - started) / duration, 1);
    window.scrollTo({ top: from + distance * easeInOut(t), behavior: "instant" });
    frame = t < 1 ? requestAnimationFrame(step) : 0;
    if (!frame) endedAt = now;
  };
  frame = requestAnimationFrame(step);
}
