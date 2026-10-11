import { useEffect, useMemo, useRef, useState } from "react";
import { hexPoints } from "../utils/worldHexes";
import { useMedia } from "../utils/useMedia";
import { STILL } from "../utils/useClock";
import { STAKEHOLDERS } from "../data/stakeholders";
import { INTERVIEW_IMAGES } from "../data/hpIntro";

/* Four honeycomb cells beside the interview count, each showing someone we
 * spoke to, one cell changing to another person every few seconds: the
 * people behind the number.
 *
 * The pictures are INTERVIEW_IMAGES (src/data/hpIntro.ts), the team's own
 * screenshots and photographs from the interviews, once there are any.
 * Until then they are the stakeholders' profile photographs, the same ones
 * the stakeholder map shows, under the same rule: never a withheld
 * interview's. A picture that will not load (each stakeholder photo has its
 * fallbacks, as on the map) drops out of the round and the cell waits, honey,
 * for the next one.
 *
 * It only changes while it is on screen, and not at all under reduced
 * motion, where the first four stay put. To a screen reader it is one
 * labelled picture: names going past one by one would be noise, and every
 * person is named in the record further down the page.
 */

interface Picture {
  key: string;
  /** The URL to try, then the ones to fall back on. */
  urls: string[];
}

/** Cell centres, a 2 + 2 patch of honeycomb, pointy side up, in units of
 * the cell radius R: the bottom pair sits half a cell to the right. */
const R = 50;
const W = Math.sqrt(3) * R;
const CENTRES = [
  { x: 0, y: 0 },
  { x: W, y: 0 },
  { x: W / 2, y: 1.5 * R },
  { x: 1.5 * W, y: 1.5 * R },
];
/** Drawn a little inside the lattice, so the cells read as separate. */
const DRAWN_R = R - 3;

/** Which cell changes on each tick, so the change wanders round the patch
 * rather than marching along it. */
const TURN = [0, 3, 1, 2];
const TICK_MS = 1500;

const VIEW = `${-W / 2 - 4} ${-R - 4} ${2.5 * W + 8} ${3.5 * R + 8}`;

function pictures(): Picture[] {
  if (INTERVIEW_IMAGES.length) {
    return INTERVIEW_IMAGES.map((p) => ({ key: p.src, urls: [p.src] }));
  }
  return STAKEHOLDERS.filter((s) => s.photo && !s.consent).map((s) => ({
    key: s.id,
    urls: [s.photo!, ...(s.photoFallbacks ?? [])],
  }));
}

export function InterviewFaces({ label }: { label: string }) {
  const still = useMedia(STILL);
  const all = useMemo(pictures, []);
  const svg = useRef<SVGSVGElement>(null);
  /* How many of each picture's URLs have failed; one past the last and it
   * is out of the round. */
  const [misses, setMisses] = useState<Record<string, number>>({});
  /* Each cell's picture, and the one it is replacing (drawn underneath
   * while the new one fades in), as indices into `all`; how many changes
   * there have been, which picks the cell in TURN; and where in `all` to
   * look for the next picture. All one state, so a change is worked out
   * from the last one alone: React runs an update twice in development, and
   * anything it changed outside the state would move on twice. */
  const [round, setRound] = useState(() => ({
    cells: CENTRES.map((_, i) => ({
      now: i % Math.max(all.length, 1),
      was: -1,
    })),
    turn: 0,
    next: CENTRES.length,
  }));
  const { cells } = round;
  const [onScreen, setOnScreen] = useState(false);

  const urlOf = (i: number) => {
    const p = all[i];
    return p ? p.urls[misses[p.key] ?? 0] : undefined;
  };

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Each tick, the next cell in TURN takes the next picture in the round
   * that is neither showing nor out, so all four cells change in turn. */
  useEffect(() => {
    if (still || !onScreen || all.length <= CENTRES.length) return;
    const id = window.setInterval(() => {
      setRound((r) => {
        const showing = new Set(r.cells.map((c) => c.now));
        let pick = -1;
        for (let n = 0; n < all.length; n++) {
          const i = (r.next + n) % all.length;
          const p = all[i];
          if (showing.has(i) || (misses[p.key] ?? 0) >= p.urls.length) continue;
          pick = i;
          break;
        }
        if (pick < 0) return r;
        const cell = TURN[r.turn % TURN.length];
        return {
          cells: r.cells.map((c, i) =>
            i === cell ? { now: pick, was: c.now } : c,
          ),
          turn: r.turn + 1,
          next: pick + 1,
        };
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [still, onScreen, all, misses]);

  return (
    <svg
      ref={svg}
      className="hpi-faces"
      viewBox={VIEW}
      role="img"
      aria-label={label}
    >
      <defs>
        {CENTRES.map((c, i) => (
          <clipPath key={i} id={`hpi-face-${i}`}>
            <polygon points={hexPoints(c.x, c.y, DRAWN_R)} />
          </clipPath>
        ))}
      </defs>
      {CENTRES.map((c, i) => {
        const { now, was } = cells[i];
        const size = DRAWN_R * 2;
        const image = (index: number, fresh: boolean) => {
          const href = urlOf(index);
          if (!href) return null;
          const key = all[index].key;
          return (
            <image
              key={`${key}-${href}`}
              href={href}
              x={c.x - DRAWN_R}
              y={c.y - DRAWN_R}
              width={size}
              height={size}
              preserveAspectRatio="xMidYMid slice"
              className={fresh ? "is-fresh" : undefined}
              onError={() =>
                setMisses((m) => ({ ...m, [key]: (m[key] ?? 0) + 1 }))
              }
            />
          );
        };
        return (
          <g key={i} className="hpi-face" aria-hidden>
            <polygon
              points={hexPoints(c.x, c.y, DRAWN_R)}
              className="hpi-face-cell"
            />
            <g clipPath={`url(#hpi-face-${i})`}>
              {was >= 0 && image(was, false)}
              {image(now, was >= 0)}
            </g>
            <polygon
              points={hexPoints(c.x, c.y, DRAWN_R)}
              className="hpi-face-rim"
            />
          </g>
        );
      })}
    </svg>
  );
}
