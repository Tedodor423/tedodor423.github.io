import { useCallback, useRef } from "react";
import { headingId } from "../utils/headingId";
import { easeOut, useClock } from "../utils/useClock";
import { useMedia } from "../utils/useMedia";
import { DECK_MEDIA, useDeckRests } from "../utils/deck";
import { Marked } from "./Marked";
import "./BeeImportance.css";

/* Slide two of the home page: why bees matter, in two numbers.
 *
 * The home page is a presentation. The hero is slide one; this is slide two,
 * a screen of its own that the hero's scroll glide lands on. Each half plays
 * once, on its own clock, from the moment it is on screen: the number
 * counts up from zero, and the figure under it fills in step. On the left
 * the count climbs to 50 and a plate lands for every ten; on the right it
 * climbs to 35 while a hand sweeps clockwise from twelve and turns the
 * trees it passes honey. Nothing here interpolates a claim: the count is a
 * reveal of the endpoint, not a trajectory, and the sweep stops at 35%
 * because that is the figure the paper gives.
 *
 * Both numbers come from sources we retrieved and read, so they carry [LIT]:
 *
 *   50% more food   FAO (2017), The future of food and agriculture: Trends
 *                   and challenges, chapter 5: "To meet demand, agriculture
 *                   in 2050 will need to produce almost 50 percent more food,
 *                   feed and biofuel than it did in 2012." The executive
 *                   summary gives the same 50 percent against 2013.
 *                   https://www.fao.org/agrifood-economics/publications/detail/en/c/1475516/
 *   35%             Klein et al. (2007), Proc. R. Soc. B 274, 303-313,
 *                   doi:10.1098/rspb.2006.3721: 35% of global production
 *                   volume comes from crops that depend on animal
 *                   pollinators, and "honeybees, mainly Apis mellifera,
 *                   remain the most economically valuable pollinators of
 *                   crop monocultures worldwide". The paper says animal
 *                   pollinators, so the slide does too; the team's own deck
 *                   said "bee pollination", which the source does not quite
 *                   support, and the honeybee sentence is what it does say.
 *                   https://doi.org/10.1098/rspb.2006.3721
 *
 * The references are set as plain text by the team's choice. The URLs above
 * are kept so they can be made links again in one edit; iGEM's rules allow
 * outbound links, it is loaded assets they forbid.
 *
 * Under prefers-reduced-motion nothing moves: the numbers stand at their
 * final values, every plate is on the table and the third is already honey.
 */

/* ---------- the plates ---------- */

const TODAY = 10;
const BY_2050 = 15;
const COLS = 5;
const CELL = 56;

function Plates({ shown }: { shown: number }) {
  const rows = Math.ceil(BY_2050 / COLS);
  return (
    <svg
      className="bi-plates"
      viewBox={`0 0 ${COLS * CELL} ${rows * CELL}`}
      role="img"
      aria-label="Fifteen plates: ten for 2012, and five more in honey for 2050"
    >
      {Array.from({ length: BY_2050 }, (_, i) => {
        const extra = i >= TODAY;
        const on = !extra || i - TODAY < shown;
        const cx = CELL / 2 + (i % COLS) * CELL;
        const cy = CELL / 2 + Math.floor(i / COLS) * CELL;
        return (
          <g
            key={i}
            className={`bi-plate${extra ? " bi-plate--more" : ""}${on ? " is-on" : ""}`}
          >
            <circle className="bi-plate-rim" cx={cx} cy={cy} r={24} />
            <circle className="bi-plate-well" cx={cx} cy={cy} r={15} />
          </g>
        );
      })}
    </svg>
  );
}

function FoodHalf() {
  const half = useRef<HTMLDivElement>(null);
  const t = useClock(half);
  // The count climbs to 50, and a plate lands for every ten of it.
  const count = Math.round(50 * easeOut(t));
  const shown = Math.floor(count / 10);

  return (
    <div className="bi-half" ref={half}>
      <h3 className="bi-claim">
        <span className="bi-when">
          <span>by 2050, humanity will require</span>
        </span>
        <span className="bi-figure">{count}%</span>
        <span className="bi-words">
          <Marked text="more food" />
        </span>
      </h3>
      <div className="bi-visual">
        <Plates shown={shown} />
      </div>
      <p className="bi-note">
        <Marked text="Almost half as much again as in 2012, to feed nearly 10 billion people." />
      </p>
      <p className="bi-ref">
        FAO 2017, The future of food and agriculture: Trends and challenges.
        Rome: FAO. <code>[LIT]</code>
      </p>
    </div>
  );
}

/* ---------- the forest ---------- */

/** The share of global crop production volume from pollinator-dependent crops. */
const SHARE = 0.35;
const DISC = 100;
const PITCH = 15;

interface Tree {
  x: number;
  y: number;
  /** Fraction of a turn clockwise from twelve o'clock, 0 to 1. */
  turn: number;
  kind: number;
  scale: number;
}

/** A small deterministic hash, so the forest is the same on every render. */
function noise(a: number, b: number): number {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

/* Trees on a hexagonal lattice inside a circle, each nudged a little so the
 * rows do not read as rows, then sorted top to bottom so a lower tree paints
 * over the one behind it. The circle is only the shape of the stand; nothing
 * is drawn behind it. */
const TREES: Tree[] = (() => {
  const trees: Tree[] = [];
  const rowHeight = PITCH * 0.866;
  const reach = Math.ceil(DISC / rowHeight) + 1;
  for (let row = -reach; row <= reach; row++) {
    for (let col = -reach; col <= reach; col++) {
      const n = noise(row, col);
      const x = col * PITCH + (row % 2 ? PITCH / 2 : 0) + ((n % 7) - 3) * 0.7;
      const y = row * rowHeight + (((n >> 3) % 7) - 3) * 0.7;
      if (Math.hypot(x, y) > DISC - 9) continue;
      const turn = (Math.atan2(x, -y) / (2 * Math.PI) + 1) % 1;
      trees.push({
        x,
        y,
        turn,
        kind: (n >> 6) % 3,
        scale: 0.85 + ((n >> 8) % 7) * 0.05,
      });
    }
  }
  return trees.sort((a, b) => a.y - b.y);
})();

/* Three silhouettes, base at the origin, pointing up: a conifer, a taller
 * two-tier conifer, and a broadleaf. Drawn here rather than taken from an
 * icon set. */
const TREE_PATHS = [
  "M-6 0L0-16L6 0ZM-1.5 0h3v4h-3Z",
  "M-5 0L0-11L5 0ZM-4-5L0-18L4-5ZM-1.5 0h3v4h-3Z",
  "M-6.5-8a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0-13 0ZM-1.5-3h3v7h-3Z",
];

function Forest({ sweep }: { sweep: number }) {
  const angle = sweep * 2 * Math.PI;
  const hand = { x: DISC * Math.sin(angle), y: -DISC * Math.cos(angle) };

  return (
    <svg
      className="bi-forest"
      viewBox={`${-DISC - 10} ${-DISC - 10} ${2 * DISC + 20} ${2 * DISC + 20}`}
      role="img"
      aria-label="A round stand of green trees, 35% of them turned honey, swept out from twelve o'clock like a pie chart"
    >
      {TREES.map((tree, i) => (
        <path
          key={i}
          className={`bi-tree${tree.turn < sweep ? " is-honey" : ""}`}
          d={TREE_PATHS[tree.kind]}
          transform={`translate(${tree.x.toFixed(1)} ${tree.y.toFixed(1)}) scale(${tree.scale})`}
        />
      ))}
      <line className="bi-noon" x1={0} y1={0} x2={0} y2={-DISC} />
      <line
        className="bi-hand"
        x1={0}
        y1={0}
        x2={hand.x.toFixed(1)}
        y2={hand.y.toFixed(1)}
      />
    </svg>
  );
}

function BeesHalf() {
  const half = useRef<HTMLDivElement>(null);
  const t = useClock(half);
  const sweep = SHARE * easeOut(t);
  const percent = Math.round(100 * sweep);

  return (
    <div className="bi-half" ref={half}>
      <h3 className="bi-claim">
        <span className="bi-when">
          <span>already</span>
        </span>
        <span className="bi-figure">{percent}%</span>
        <span className="bi-words">
          <Marked text="of the world's crop production relies on pollinators" />
        </span>
      </h3>
      <div className="bi-visual">
        <Forest sweep={sweep} />
      </div>
      <p className="bi-note">
        <Marked text="Of global production by volume, counting every crop that depends on animal pollination. Honeybees are the most valuable of those pollinators." />
      </p>
      <p className="bi-ref">
        Klein et al. 2007, Proc. R. Soc. B 274: 303-313.
        doi:10.1098/rspb.2006.3721 <code>[LIT]</code>
      </p>
    </div>
  );
}

/* ---------- the slide ---------- */

const TITLE = "Why bees matter";

export function BeeImportance() {
  // The same id a Markdown `## Why bees matter` would get, so the anchor
  // reads like every other section's.
  const id = headingId(TITLE);

  // Where the slide is a screen of its own, its top and bottom are rests
  // for the deck: one wheel tick rides onto it, and one rides off it.
  const section = useRef<HTMLElement>(null);
  const slide = useMedia(DECK_MEDIA);
  const rests = useCallback(() => {
    const element = section.current;
    if (!slide || !element) return [];
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    return [top, top + rect.height];
  }, [slide]);
  useDeckRests(rests);

  return (
    <section className="bee-importance" aria-labelledby={id} ref={section}>
      <div className="bi-stage">
        <h2 className="bi-title" id={id}>
          {TITLE}
        </h2>
        <div className="bi-halves">
          <FoodHalf />
          <BeesHalf />
        </div>
      </div>
    </section>
  );
}
