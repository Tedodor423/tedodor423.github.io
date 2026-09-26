import { useEffect, useRef, useState } from "react";
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
 * The scroll has two rests: the hero filling the screen, or the page body
 * with the hero entirely above the fold. One wheel tick rides the whole
 * way in either direction, and any other input (touch, keyboard,
 * scrollbar) that stops between the rests settles to the nearer one.
 * Muted autoplay is the only autoplay browsers permit, and a silent
 * ambient loop is what this clip is; under prefers-reduced-motion it
 * holds its first frame, scrolling jumps instead of gliding, and the
 * arrow appears without the fade.
 */

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Where the page body starts, in document coordinates. */
function bottomOf(hero: HTMLElement): number {
  return hero.getBoundingClientRect().bottom + window.scrollY;
}

/* The glide between the two rests. Driven by hand rather than by
 * scrollTo({ behavior: "smooth" }) because the browser's own curve is quick
 * and uneven across engines, and this one ride is the page's single piece
 * of motion — it should feel the same everywhere. Ease in and out, 700 ms.
 * A new call cancels the ride in flight, so reversing the wheel mid-glide
 * turns it around from wherever it is.
 */
let glide = 0;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (2 - 2 * t) ** 2 / 2;
}

function go(top: number) {
  cancelAnimationFrame(glide);
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
    if (t < 1) glide = requestAnimationFrame(step);
  };
  glide = requestAnimationFrame(step);
}

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

  // The two-rest scroll lock. A wheel tick anywhere in the hero zone is
  // taken over and ridden to a rest; everything else is let through and
  // settled after it stops, so touch and keyboard still work unaided.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return; // pinch-zoom on a trackpad
      const bottom = bottomOf(hero);
      const y = window.scrollY;
      if (event.deltaY > 0 && y < bottom - 1) {
        event.preventDefault();
        go(bottom);
      } else if (event.deltaY < 0 && y > 0 && y <= bottom + 1) {
        event.preventDefault();
        go(0);
      }
    };

    let settle: number | undefined;
    const onScroll = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        const bottom = bottomOf(hero);
        const y = window.scrollY;
        if (y > 1 && y < bottom - 1) go(y < bottom / 2 ? 0 : bottom);
      }, 150);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(settle);
      cancelAnimationFrame(glide);
    };
  }, []);

  return (
    <header className="home-hero" ref={heroRef}>
      {!missing && (
        <video
          className="home-hero-video"
          src={`${import.meta.env.BASE_URL}local/bees_entering_hive.mp4`}
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
        onClick={() => go(bottomOf(heroRef.current!))}
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
