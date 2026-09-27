import { useEffect, useState, type RefObject } from "react";

/* The clock the home page's slides count on.
 *
 * A figure that counts up from zero is a reveal, not a trajectory: the end
 * value is the claim, and the motion only delivers it. So the clock runs
 * once, from the moment its element is reasonably on screen, and never
 * restarts. Under prefers-reduced-motion it simply reads 1 and the claim
 * stands still.
 */

export const STILL = "(prefers-reduced-motion: reduce)";

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * A once-only clock for an element, 0 to 1.
 *
 * It starts the first time a third of the element is visible (which a scroll
 * glide onto it reaches well before it lands), waits `delay` ms, then runs
 * for `duration` ms.
 */
export function useClock(
  target: RefObject<HTMLElement | null>,
  duration = 2800,
  delay = 350,
): number {
  const [t, setT] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(STILL).matches ? 1 : 0,
  );

  useEffect(() => {
    if (window.matchMedia(STILL).matches) return;
    const element = target.current;
    if (!element) return;

    let frame = 0;
    let started = 0;
    const tick = (now: number) => {
      const progress = clamp01((now - started - delay) / duration);
      setT(progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        started = performance.now();
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration, delay]);

  return t;
}
