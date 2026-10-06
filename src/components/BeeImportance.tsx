import { useCallback, useEffect, useRef, useState } from "react";
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
 * trees it passes yellow. Nothing here interpolates a claim: the count is a
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
 * final values, every plate is on the table and the third is already yellow.
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

/* The tree is the team's own Excalidraw drawing, in two colourings: green,
 * and yellow for the pollinated share. Like the bee scene's artwork
 * (BeeScene.tsx) the sources are tree.svg and tree_yellow.svg in the
 * gitignored wiki-assets-source/images_dev/, kept upload-ready, and the
 * published site serves them from static.igem.wiki under assets/. The dev
 * server answers them straight from that folder (the images-dev plugin in
 * vite.config.ts), so a redrawn tree shows on the next reload.
 * tree_yellow.svg is tree.svg with its green (#2f9e44) swapped for #f08c00;
 * redo the swap whenever the tree is redrawn.
 *
 * TEMPORARY FALLBACK. Until the upload is done, a published build that
 * cannot load the static.igem.wiki URLs tries copies in the gitignored
 * public/local/, which CI builds without. One probe decides for every tree,
 * rather than an onError on each of them. Once the static.igem.wiki URLs
 * answer, drop LOCAL_ART and the probe. */
const ART = import.meta.env.DEV
  ? `${import.meta.env.BASE_URL}images-dev/`
  : "https://static.igem.wiki/teams/6391/wiki/assets/";
const LOCAL_ART = `${import.meta.env.BASE_URL}local/`;
const GREEN = "tree.svg";
const YELLOW = "tree_yellow.svg";

/** Where the two drawings come from, or null while that is being found out. */
function useTreeArt(): string | null {
  const [base, setBase] = useState<string | null>(null);
  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setBase(ART);
    probe.onerror = () => setBase(LOCAL_ART);
    probe.src = ART + GREEN;
  }, []);
  useEffect(() => {
    // Fetched ahead, so the first tree the hand reaches does not blink.
    if (base) new Image().src = base + YELLOW;
  }, [base]);
  return base;
}

/* The drawing's own frame, and two points in it: the middle of the canopy,
 * which is where a tree is placed from and where its angle is read, and the
 * foot of the trunk, which decides what stands in front of what. */
const ART_W = 199.394;
const ART_H = 213.939;
const CANOPY = { x: 99, y: 83 };
const FOOT_Y = 209;

/* The canopy is scribbled in rather than filled, and the trunk is five
 * strokes, so the paper shows through both: packed close, every tree behind
 * would show through the one in front of it. This is the tree's silhouette,
 * traced from the drawing (the outline filled in, the gaps between the trunk
 * strokes closed, then pulled in 3 units so its edge stays under the
 * outline). Painted in the paper colour behind each tree, it hides whatever
 * stands behind. */
const SILHOUETTE =
  "M112.1 7.9L120.1 8.4L130.4 12.4L135.1 18.6L138.4 26.9L144.4 29.9L154.1 28.9L175.6 29.6L180.4 31.4L184.4 35.1L187.9 40.9L190.4 50.4L190.1 59.6L186.6 63.9L184.4 69.6L190.4 83.9L190.9 93.1L189.6 98.4L186.4 102.4L174.6 108.4L172.4 113.6L173.1 120.4L171.4 125.6L164.4 134.6L154.6 140.1L151.9 148.9L149.4 152.1L143.4 155.4L135.4 157.6L119.4 157.9L113.4 160.9L111.1 166.6L115.1 185.1L115.1 194.9L112.4 205.1L109.4 206.1L106.9 203.1L101.6 200.9L94.6 202.9L86.9 200.4L83.9 201.6L79.1 201.6L72.4 205.4L69.1 204.4L69.9 198.1L81.1 158.4L78.9 153.1L72.9 150.1L51.6 152.1L45.1 150.6L40.9 147.9L37.1 142.1L35.6 136.4L35.4 128.9L37.6 122.6L35.4 117.4L24.4 111.6L11.4 101.1L8.1 95.4L7.6 87.6L10.4 80.9L19.4 72.4L35.4 64.9L37.6 59.6L35.6 52.1L34.9 35.9L35.9 31.6L40.1 26.6L47.9 23.4L56.4 21.9L70.9 21.9L81.9 24.1L87.1 21.9L92.6 15.4L99.1 10.6L104.4 8.6Z";

/** The canopy's edge, from the silhouette: the part that must stay inside the circle. */
const CANOPY_EDGE = SILHOUETTE.slice(1, -1)
  .split("L")
  .map((pair) => pair.split(" ").map(Number))
  .filter(([, y]) => y < 150);

/** Tree size in disc units per drawing unit: a tree is about 33 units tall. */
const SCALE = 0.16;
/** Spacing between neighbours along a ring, and between rings. */
const SPACING = 16;
const RING_GAP = 12;

interface Tree {
  /** The middle of the canopy, in disc units. */
  x: number;
  y: number;
  scale: number;
  /** Fraction of a turn clockwise from twelve o'clock, 0 to 1. */
  turn: number;
  /** Where the trunk meets the ground. */
  foot: number;
}

/** A small deterministic hash, so the forest is the same on every render. */
function noise(a: number, b: number): number {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

/** How far from the centre a tree's canopy reaches. */
function reach(x: number, y: number, scale: number): number {
  let far = 0;
  for (const [ex, ey] of CANOPY_EDGE) {
    far = Math.max(
      far,
      Math.hypot(x + (ex - CANOPY.x) * scale, y + (ey - CANOPY.y) * scale),
    );
  }
  return far;
}

/** A tree at (x, y), drawn straight in towards the centre until its canopy is inside the circle. */
function plant(x: number, y: number, scale: number): Tree {
  const r = Math.hypot(x, y);
  if (r > 0 && reach(x, y, scale) > DISC) {
    let lo = 0;
    let hi = r;
    for (let step = 0; step < 24; step++) {
      const mid = (lo + hi) / 2;
      if (reach((x * mid) / r, (y * mid) / r, scale) <= DISC) lo = mid;
      else hi = mid;
    }
    x = (x * lo) / r;
    y = (y * lo) / r;
  }
  return {
    x,
    y,
    scale,
    turn: (Math.atan2(x, -y) / (2 * Math.PI) + 1) % 1,
    foot: y + (FOOT_Y - CANOPY.y) * scale,
  };
}

/* Trees on concentric rings, each nudged a little so the rings do not read as
 * rings. The outermost ring is planted closer and every tree on it is drawn
 * in until its canopy touches the circle, so the canopies, not a drawn line,
 * make the edge; the trunks of the bottom row stand just below it. Even
 * spacing round each ring also keeps the count honest: 35.2% of the trees
 * end up yellow, against the 35% the hand sweeps. Sorted by the foot of the
 * trunk, so a tree nearer the viewer paints over the ones behind it. */
const TREES: Tree[] = (() => {
  const trees: Tree[] = [plant(0, 0, SCALE)];
  let ring = 0;
  for (let r = DISC - 80 * SCALE; r > SPACING * 0.4; r -= RING_GAP, ring++) {
    const n = Math.round((2 * Math.PI * r) / (ring ? SPACING : SPACING * 0.6));
    const offset = (noise(ring, 77) % 1000) / 1000;
    for (let i = 0; i < n; i++) {
      const h = noise(ring, i);
      const angle = ((i + offset + ((h % 7) - 3) * 0.04) / n) * 2 * Math.PI;
      const radius = r + (((h >> 3) % 7) - 3) * 0.4;
      const scale = SCALE * (0.9 + ((h >> 8) % 5) * 0.05);
      trees.push(
        plant(radius * Math.sin(angle), -radius * Math.cos(angle), scale),
      );
    }
  }
  return trees.sort((a, b) => a.foot - b.foot);
})();

/** The lowest trunk foot: the bottom row stands a little below the circle. */
const GROUND = Math.max(...TREES.map((tree) => tree.foot));

function Forest({ sweep }: { sweep: number }) {
  const art = useTreeArt();
  const angle = sweep * 2 * Math.PI;
  const hand = { x: DISC * Math.sin(angle), y: -DISC * Math.cos(angle) };

  return (
    <svg
      className="bi-forest"
      viewBox={`${-DISC - 4} ${-DISC - 4} ${2 * DISC + 8} ${DISC + GROUND + 8}`}
      role="img"
      aria-label="A round stand of green trees, 35% of them turned yellow, swept out from twelve o'clock like a pie chart"
    >
      <defs>
        <path id="bi-tree-back" d={SILHOUETTE} />
      </defs>
      {TREES.map((tree, i) => (
        <g
          key={i}
          transform={`translate(${(tree.x - CANOPY.x * tree.scale).toFixed(2)} ${(tree.y - CANOPY.y * tree.scale).toFixed(2)}) scale(${tree.scale.toFixed(3)})`}
        >
          <use className="bi-tree-back" href="#bi-tree-back" />
          {art && (
            <image
              href={art + (tree.turn < sweep ? YELLOW : GREEN)}
              width={ART_W}
              height={ART_H}
            />
          )}
        </g>
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
  // for the deck: a reader who stops part way onto it or off it is eased on.
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
