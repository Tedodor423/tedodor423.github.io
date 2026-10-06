import { useCallback, useEffect, useRef, useState } from "react";
import { REDUCED_MOTION, glideTo } from "../utils/glide";
import { useDeckRests } from "../utils/deck";
import "./HomeHero.css";

/* The home page opens on this and nothing else: the menu bar, the hive
 * entrance filling the rest of the screen, and the project name over it.
 * It stands in for the standard <Header> on the home route, so its <h1> is
 * the page's one <h1> and the heading order below it stays semantic.
 *
 * TEMPORARY HOSTING. The clip is served from public/local/, which is
 * gitignored (see .gitignore) because video never ships from this repo:
 * the 5 MB build ceiling and the iGEM asset rules both forbid it. Before
 * the freeze this must switch to the iGEM Video Universe embed for the
 * same clip, uploaded at least 2 days early for moderation. Until then it
 * only plays on a machine that has the file; anywhere else the hero keeps
 * its solid surface and says so under the title.
 *
 * The scroll has two rests here: the hero filling the screen, or the page
 * body with the hero entirely above the fold. They are registered with the
 * deck in src/utils/deck.ts, as the slides below register theirs: scrolling
 * stays free, and a reader who stops between two rests is eased on to one
 * of them. Muted autoplay is the only autoplay browsers permit, and a silent
 * ambient loop is what this clip is; under prefers-reduced-motion it
 * holds its first frame, scrolling jumps instead of gliding, and the
 * arrow appears without the fade.
 */

/** Where the page body starts, in document coordinates. */
function bottomOf(hero: HTMLElement): number {
  return hero.getBoundingClientRect().bottom + window.scrollY;
}

/* The glide between the two rests lives in src/utils/glide.ts, shared with
 * the slides further down the page so that only one ride ever runs. */

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const [missing, setMissing] = useState(false);

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
      {!missing && (
        <video
          className="home-hero-video"
          src={`${import.meta.env.BASE_URL}local/bees_entering_hive_short.mp4`}
          autoPlay={!REDUCED_MOTION}
          loop
          muted
          playsInline
          aria-label="Honeybees walking through the entrance of a hive"
          onError={() => setMissing(true)}
        />
      )}

      <div className="home-hero-title">
        <h1>Introducing: Project NECTAR</h1>
        <p>RNA-based pesticides</p>
        {missing && (
          <p className="home-hero-missing">
            <strong>VIDEO —</strong> bees entering the hive. Hosted locally
            during development; to appear here it must be uploaded to the iGEM
            Video Universe and this component pointed at the embed.
          </p>
        )}
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
