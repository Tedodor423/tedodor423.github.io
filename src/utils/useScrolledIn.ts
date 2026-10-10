import { useCallback, useEffect, useState, type RefObject } from "react";
import { DECK_MEDIA } from "./deck";
import { clamp01, STILL } from "./useClock";
import { useMedia } from "./useMedia";

/**
 * How far a slide has scrolled in from below, 0 to 1, for a figure that
 * draws while the reader scrolls on to it.
 *
 * Where the slide is a screen of its own (DECK_MEDIA), it runs from the
 * moment the figure's top comes up over the bottom of the window to the
 * moment the slide has landed, top to top. So the figure draws while it is
 * in sight on the way down from the slide above, the hero's glide included,
 * and is whole when the slide is. Elsewhere the page simply flows, and it is
 * measured by the figure alone: 0 while the figure's middle is in the bottom
 * sixth of the window, 1 once it is above the window's middle. Under
 * prefers-reduced-motion it is 1.
 */
export function useScrolledIn(
  slide: RefObject<Element | null>,
  figure: RefObject<Element | null>,
): number {
  const deck = useMedia(DECK_MEDIA);
  const still = useMedia(STILL);
  const [progress, setProgress] = useState(0);

  const measure = useCallback(() => {
    const h = window.innerHeight;
    const element = figure.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    if (deck) {
      const top = slide.current?.getBoundingClientRect().top;
      if (top === undefined) return;
      // Where the figure's top sits once the slide has landed.
      const landed = rect.top - top;
      setProgress(
        landed < h ? clamp01((h - rect.top) / (h - landed)) : Number(top <= 0),
      );
      return;
    }
    const middle = rect.top + rect.height / 2;
    setProgress(clamp01((h * (5 / 6) - middle) / (h / 3)));
  }, [deck, slide, figure]);

  useEffect(() => {
    if (still) return;
    let frame = 0;
    const run = () => {
      frame = 0;
      measure();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [still, measure]);

  return still ? 1 : progress;
}
