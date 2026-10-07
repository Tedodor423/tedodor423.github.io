import { useCallback, useEffect, useRef } from "react";
import { REDUCED_MOTION, glideTo } from "../utils/glide";
import { useDeckRests } from "../utils/deck";
import "./HomeHero.css";

/* The home page opens on this and nothing else: the menu bar, the hive
 * entrance filling the rest of the screen, and the project name over it.
 * It stands in for the standard <Header> on the home route, so its <h1> is
 * the page's one <h1> and the heading order below it stays semantic.
 *
 * The clip is the iGEM Video Universe copy, embedded as the competition
 * requires, and plays as a background: muted, looped, no controls, and inert
 * to the pointer so a wheel over it still scrolls the page rather than the
 * player. A frame cannot crop its picture the way object-fit does, so the
 * stylesheet sizes it to cover the hero instead (see HomeHero.css).
 *
 * The scroll has two rests here: the hero filling the screen, or the page
 * body with the hero entirely above the fold. They are registered with the
 * deck in src/utils/deck.ts, as the slides below register theirs: scrolling
 * stays free, and a reader who stops between two rests is eased on to one
 * of them. Muted autoplay is the only autoplay browsers permit, and a silent
 * ambient loop is what this clip is; under prefers-reduced-motion it does
 * not start, scrolling jumps instead of gliding, and the arrow appears
 * without the fade.
 */

/** The clip on the iGEM Video Universe, with the player's chrome turned off. */
const VIDEO = `https://video.igem.org/videos/embed/djaUJNKXf7f2ec1QvRv74T?${new URLSearchParams(
  {
    autoplay: REDUCED_MOTION ? "0" : "1",
    muted: "1",
    loop: "1",
    controls: "0",
    title: "0",
    warningTitle: "0",
    peertubeLink: "0",
    p2p: "0",
  },
)}`;

/** Where the page body starts, in document coordinates. */
function bottomOf(hero: HTMLElement): number {
  return hero.getBoundingClientRect().bottom + window.scrollY;
}

/* The glide between the two rests lives in src/utils/glide.ts, shared with
 * the slides further down the page so that only one ride ever runs. */

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);

  // The menu bar is sticky and its height depends on how the wordmark and
  // links wrap, so the hero measures it and fills exactly the rest of the
  // viewport (see --nav-height in HomeHero.css).
  useEffect(() => {
    const hero = heroRef.current;
    const nav = document.querySelector<HTMLElement>(".site-nav");
    if (!hero || !nav) return;

    const measure = () =>
      hero.style.setProperty("--nav-height", `${nav.offsetHeight}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  // The hero's two rests, handed to the deck: the top of the page, and the
  // top of the page body.
  const rests = useCallback(() => {
    const hero = heroRef.current;
    return hero ? [0, bottomOf(hero)] : [];
  }, []);
  useDeckRests(rests);

  return (
    <header className="home-hero" ref={heroRef}>
      <iframe
        className="home-hero-video"
        src={VIDEO}
        title="Honeybees walking through the entrance of a hive"
        allow="autoplay; fullscreen"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        tabIndex={-1}
      />

      <div className="home-hero-title">
        <h1>Introducing: Project NECTAR</h1>
        <p>RNA-based pesticides</p>
      </div>

      <button
        type="button"
        className="home-hero-arrow"
        aria-label="Scroll to the page content"
        onClick={() => glideTo(bottomOf(heroRef.current!))}
      >
        <svg viewBox="0 0 24 14" aria-hidden="true">
          <path
            d="M2 2l10 10L22 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      </button>
    </header>
  );
}
