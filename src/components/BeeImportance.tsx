import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
} from "react";
import { BEE_FRAMES } from "../utils/bees";
import { useMedia } from "../utils/useMedia";
import { DECK_MEDIA, useDeckRests } from "../utils/deck";
import { useScrolledIn } from "../utils/useScrolledIn";
import { BEES, DECK_ANCHORS } from "../data/homeDeck";
import { Marked, Runs } from "./Marked";
import "./BeeImportance.css";

/* Slide two of the home page: why bees matter, in two numbers.
 *
 * The home page is a presentation. The hero is slide one; this is slide two,
 * a screen of its own that the hero's scroll glide lands on. In each half the
 * number counts up from zero and the figure under it fills in step, both
 * driven by the reader's scroll on to the slide, so each figure is whole as
 * the slide lands. On the left the count climbs to 50 while a line of the
 * world's daily food draws from 1960 to 2050. On the right the count climbs
 * to 35 while a hand sweeps clockwise from twelve and turns the crops it
 * passes yellow. Nothing
 * here interpolates a claim: the count is a reveal of the endpoint, not a
 * trajectory, the line only reveals points already computed, and the sweep
 * stops at 35% because that is the figure the paper gives.
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
 * The food line is the team's own arithmetic, [CALC], from
 * references/food/Food_Data.csv and the projection in
 * NECTAR_graphs_with_food_land_addon.R (section 14): see FOOD below.
 *
 * Under prefers-reduced-motion nothing moves: the numbers stand at their
 * final values, the line is drawn to 2050 and the third is already yellow.
 */

/* ---------- the food line ---------- */

/* The world's food supply per day: population times food supply per head,
 * the measure the dry lab's food add-on calls food demand. Recorded rows are
 * references/food/Food_Data.csv (Year, Population, CaloriesPerCapita). The
 * projection is that script's own: population and kcal per head each run
 * in a straight line from 2020 to 9.7 billion people (UN World Population
 * Prospects 2024, as the script cites it) and 3,050 kcal a head in 2050,
 * and are multiplied year by year, which bends the line slightly. */
const FOOD: [year: number, population: number, kcal: number][] = [
  [1960, 3_034_950_000, 2275],
  [1970, 3_700_437_000, 2436],
  [1980, 4_458_003_000, 2560],
  [1990, 5_327_231_000, 2599],
  [2000, 6_143_494_000, 2679],
  [2010, 6_956_824_000, 2827],
  [2020, 7_794_799_000, 2894],
];
const POPULATION_2050 = 9.7e9;
const KCAL_2050 = 3050;

const FIRST = 1960;
const NOW = 2020;
const LAST = 2050;

interface Point {
  year: number;
  /** Trillion kcal a day. */
  v: number;
}

const RECORDED: Point[] = FOOD.map(([year, population, kcal]) => ({
  year,
  v: (population * kcal) / 1e12,
}));

const PROJECTED: Point[] = (() => {
  const [, population, kcal] = FOOD[FOOD.length - 1];
  return Array.from({ length: LAST - NOW + 1 }, (_, i) => {
    const f = i / (LAST - NOW);
    return {
      year: NOW + i,
      v:
        ((population + (POPULATION_2050 - population) * f) *
          (kcal + (KCAL_2050 - kcal) * f)) /
        1e12,
    };
  });
})();

const END = PROJECTED[PROJECTED.length - 1];

/** The line's value at any year, straight between neighbouring points. */
function foodAt(year: number): number {
  const points = [...RECORDED.slice(0, -1), ...PROJECTED];
  const i = points.findIndex((p) => p.year >= year);
  if (i <= 0) return points[0].v;
  const a = points[i - 1];
  const b = points[i];
  return a.v + ((b.v - a.v) * (year - a.year)) / (b.year - a.year);
}

const FW = 360;
const FH = 260;
const FM = { top: 34, right: 24, bottom: 30, left: 36 };
const PLOT_W = FW - FM.left - FM.right;
const PLOT_H = FH - FM.top - FM.bottom;
const Y_TICKS = [0, 10, 20, 30];
const X_TICKS = [1960, 1990, 2020, 2050];

const fx = (year: number) =>
  FM.left + ((year - FIRST) / (LAST - FIRST)) * PLOT_W;
const fy = (v: number) => FM.top + PLOT_H - (v / 30) * PLOT_H;
const pathOf = (points: Point[]) =>
  points
    .map(
      (p, i) =>
        `${i ? "L" : "M"}${fx(p.year).toFixed(1)},${fy(p.v).toFixed(1)}`,
    )
    .join("");

const tenths = (v: number) => v.toFixed(1);

/* The chart carries no values of its own, by the team's choice: the shape
 * is the point, and the axes give the scale. The values stay in the
 * description a screen reader reads out. */
function FoodLine({ drawn }: { drawn: number }) {
  const clip = useId();
  const head = FIRST + (LAST - FIRST) * drawn;
  const done = drawn >= 1;

  return (
    <svg
      className="bi-food"
      viewBox={`0 0 ${FW} ${FH}`}
      role="img"
      aria-label={`Line chart of the food the world supplies each day, in trillion kilocalories: ${tenths(RECORDED[0].v)} in 1960, ${tenths(RECORDED[3].v)} in 1990 and ${tenths(RECORDED[6].v)} in 2020, then a dashed projection to ${tenths(END.v)} in 2050.`}
    >
      <defs>
        <clipPath id={clip}>
          <rect x={0} y={0} width={fx(head)} height={FH} />
        </clipPath>
      </defs>

      <text className="bi-food-unit" x={0} y={16}>
        trillion kcal a day
      </text>
      {Y_TICKS.map((v) => (
        <g key={v}>
          <line
            className="bi-food-grid"
            x1={FM.left}
            x2={FM.left + PLOT_W}
            y1={fy(v)}
            y2={fy(v)}
          />
          <text
            className="bi-food-tick"
            x={FM.left - 8}
            y={fy(v)}
            dy="0.32em"
            textAnchor="end"
          >
            {v}
          </text>
        </g>
      ))}
      {X_TICKS.map((year) => (
        <text
          key={year}
          className="bi-food-tick"
          x={fx(year)}
          y={FH - 8}
          textAnchor="middle"
        >
          {year}
        </text>
      ))}

      <g clipPath={`url(#${clip})`}>
        <path
          className="bi-food-line bi-food-line--projected"
          d={pathOf(PROJECTED)}
        />
        <path className="bi-food-line" d={pathOf(RECORDED)} />
      </g>

      {/* The one word on the chart, under the line where it climbs away:
          the dashed stretch is named, and the solid one is everything else. */}
      <text
        className={`bi-food-label bi-food-label--projected${head >= 2035 ? " is-on" : ""}`}
        x={fx(2026)}
        y={fy(foodAt(2026)) + 28}
      >
        projected
      </text>

      {RECORDED.map((p) => (
        <g
          key={p.year}
          className={`bi-food-mark${head >= p.year ? " is-on" : ""}`}
        >
          <circle className="bi-food-dot" cx={fx(p.year)} cy={fy(p.v)} r={6} />
        </g>
      ))}

      {/* The projection's end is hollow: a year nobody has measured. */}
      <g className={`bi-food-mark${done ? " is-on" : ""}`}>
        <circle
          className="bi-food-dot bi-food-dot--projected"
          cx={fx(LAST)}
          cy={fy(END.v)}
          r={6}
        />
      </g>
    </svg>
  );
}

/* The line draws with the reader's scroll rather than on a clock, and the
 * count climbs in step with it: as the slide comes up from below on to the
 * screen, or where the page flows, as the chart comes up the window
 * (src/utils/useScrolledIn.ts). Scrolling back up undraws it. */
function FoodHalf({
  drawn,
  figure,
}: {
  drawn: number;
  figure: RefObject<HTMLElement | null>;
}) {
  const count = Math.round(BEES.food.figure * drawn);

  // The words are BEES in src/data/homeDeck.ts, where the search index reads
  // them too; <Marked> and <Runs> put a honey background on the ones a
  // reader searched for.
  return (
    <div className="bi-half">
      <h3 className="bi-claim">
        <span className="bi-when">
          <span>
            <Marked text={BEES.food.when[0]} />
            <br />
            <Marked text={BEES.food.when[1]} />
          </span>
        </span>
        <span className="bi-figure">{count}%</span>
        <span className="bi-words">
          <Marked text={BEES.food.words} />
        </span>
      </h3>
      <figure className="bi-visual bi-visual--food" ref={figure}>
        <FoodLine drawn={drawn} />
        <figcaption className="bi-food-caption">
          <Runs runs={BEES.food.caption} />
        </figcaption>
      </figure>
      <p className="bi-ref">
        <Runs runs={BEES.food.ref} />
      </p>
    </div>
  );
}

/* ---------- the harvest ---------- */

/** The share of global crop production volume from pollinator-dependent crops. */
const SHARE = BEES.harvest.figure / 100;
const DISC = 100;

/* The crops are the team's own Excalidraw drawings, an apple and a pear,
 * each in two colourings: its own, and yellow for
 * the pollinated share. Like the comb's icons (cycleIcons.ts) the sources are
 * in the gitignored wiki-assets-source/images_dev/eng-icons/, upload-ready
 * copies in eng-icons-upload/ next to it, and the published site serves them
 * from static.igem.wiki under assets/eng-icons/. The dev server answers them
 * straight from the source folder (the images-dev plugin in vite.config.ts),
 * so a redrawn crop shows on the next reload. Each <name>_yellow.svg is
 * <name>.svg with every colour but the ink (#1e1e1e) swapped for #fab005;
 * redo the swap whenever a crop is redrawn. The wheat drawing (wheat.svg)
 * was dropped from the heap by the team's choice; its files are still in
 * the folder.
 *
 * TEMPORARY FALLBACK. Until the upload is done, a published build that
 * cannot load the static.igem.wiki URLs tries copies in the gitignored
 * public/local/eng-icons/, which CI builds without. One probe decides for
 * every crop, rather than an onError on each of them. Once the
 * static.igem.wiki URLs answer, drop LOCAL_ART and the probe. */
const ART = import.meta.env.DEV
  ? `${import.meta.env.BASE_URL}images-dev/eng-icons/`
  : "https://static.igem.wiki/teams/6391/wiki/assets/eng-icons/";
const LOCAL_ART = `${import.meta.env.BASE_URL}local/eng-icons/`;

/** Where the drawings come from, or null while that is being found out. */
function useCropArt(): string | null {
  const [base, setBase] = useState<string | null>(null);
  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setBase(ART);
    probe.onerror = () => setBase(LOCAL_ART);
    probe.src = `${ART}apple.svg`;
  }, []);
  return base;
}

interface Kind {
  /** The file's basename; the yellow colouring adds _yellow. */
  file: string;
  /** The drawing's own frame. */
  w: number;
  h: number;
  /** The middle of the fruit: where the crop is placed
   * from and where its angle is read. */
  centre: { x: number; y: number };
  /** Size against the other, so the two read as one harvest. */
  size: number;
  /** The crop's silhouette, traced from the drawing: the outline filled in,
   * the gaps between strokes closed, then pulled in 3 units so its edge stays
   * under the outline. The strokes are drawn rather than filled, so the paper
   * shows through them; painted in the paper colour behind each crop, this
   * hides whatever lies behind. */
  outline: string;
}

const KINDS: Kind[] = [
  {
    file: "apple",
    w: 145.936,
    h: 110.704,
    centre: { x: 73, y: 63 },
    size: 1,
    outline:
      "M92.5 5.5L97 8L97 11.5L90 19.5L91.5 28.5L97 32.5L107.5 32L117 34L131 45L137 58L135.5 74.5L122 88L110.5 92.5L88.5 97.5L50 100.5L25 97.5L18.5 94.5L14 89.5L9 63L9 47.5L13.5 31.5L18.5 25.5L21 25L37.5 28L53 37L59 37L65 32.5L67.5 26L77 13.5Z",
  },
  {
    file: "pear",
    w: 97.96,
    h: 130.194,
    centre: { x: 47, y: 80 },
    size: 1.05,
    outline:
      "M86.5 6L90 6.5L91.5 11L77 19L65.5 33.5L68.5 49L64.5 60L66.5 66.5L79.5 76.5L85.5 83.5L87.5 90L86 97.5L78.5 107.5L64 117.5L51 123L40 123L26 119L15.5 112L9.5 105L6.5 91L8 69.5L40 38L58 33L72.5 14.5Z",
  },
];

/** Each silhouette's corners, to keep inside the circle and to stand the crop on. */
const EDGES = KINDS.map((kind) =>
  kind.outline
    .slice(1, -1)
    .split("L")
    .map((pair) => pair.split(" ").map(Number)),
);

/** Crop size in disc units per drawing unit: an apple is about 19 units wide. */
const SCALE = 0.13;
/** Spacing between neighbours along a ring, and between rings: closer than a
 * crop is wide, so the heap is packed and each crop overlaps the next. */
const SPACING = 11;
const RING_GAP = 8.5;

interface Crop {
  kind: number;
  /** The crop's centre, in disc units. */
  x: number;
  y: number;
  scale: number;
  /** Fraction of a turn clockwise from twelve o'clock, 0 to 1. */
  turn: number;
  /** The lowest point of the drawing, which decides what lies in front. */
  foot: number;
}

/** A small deterministic hash, so the harvest is the same on every render. */
function noise(a: number, b: number): number {
  let h = (a * 374761393 + b * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

/** How far from the centre a crop's silhouette reaches. */
function reach(kind: number, x: number, y: number, scale: number): number {
  const { centre } = KINDS[kind];
  let far = 0;
  for (const [ex, ey] of EDGES[kind]) {
    far = Math.max(
      far,
      Math.hypot(x + (ex - centre.x) * scale, y + (ey - centre.y) * scale),
    );
  }
  return far;
}

/** A crop at (x, y), drawn straight in towards the centre until it is inside the circle. */
function plant(kind: number, x: number, y: number, scale: number): Crop {
  const r = Math.hypot(x, y);
  if (r > 0 && reach(kind, x, y, scale) > DISC) {
    let lo = 0;
    let hi = r;
    for (let step = 0; step < 24; step++) {
      const mid = (lo + hi) / 2;
      if (reach(kind, (x * mid) / r, (y * mid) / r, scale) <= DISC) lo = mid;
      else hi = mid;
    }
    x = (x * lo) / r;
    y = (y * lo) / r;
  }
  const bottom = Math.max(...EDGES[kind].map(([, ey]) => ey));
  return {
    kind,
    x,
    y,
    scale,
    turn: (Math.atan2(x, -y) / (2 * Math.PI) + 1) % 1,
    foot: y + (bottom - KINDS[kind].centre.y) * scale,
  };
}

/* Crops on concentric rings, each nudged a little so the rings do not read as
 * rings, and each one of the two drawings at random (from a fixed hash, so
 * the same one every time). The outermost ring is planted closer and every
 * crop on it is drawn in until it touches the circle, so the crops, not a
 * drawn line, make the edge. Even spacing round each ring also keeps the
 * count honest: 123 of the 349 crops (35.2%) end up yellow, against the 35%
 * the hand sweeps. Sorted by the lowest point of each drawing, so a
 * crop nearer the viewer paints over the ones behind it. */
const CROPS: Crop[] = (() => {
  const crops: Crop[] = [plant(0, 0, 0, SCALE * KINDS[0].size)];
  let ring = 0;
  for (let r = DISC - 60 * SCALE; r > SPACING * 0.4; r -= RING_GAP, ring++) {
    const n = Math.round((2 * Math.PI * r) / (ring ? SPACING : SPACING * 0.6));
    const offset = (noise(ring, 77) % 1000) / 1000;
    for (let i = 0; i < n; i++) {
      const h = noise(ring, i);
      const kind = noise(i, ring + 101) % KINDS.length;
      const angle = ((i + offset + ((h % 7) - 3) * 0.04) / n) * 2 * Math.PI;
      const radius = r + (((h >> 3) % 7) - 3) * 0.4;
      const scale = SCALE * KINDS[kind].size * (0.9 + ((h >> 8) % 5) * 0.05);
      crops.push(
        plant(kind, radius * Math.sin(angle), -radius * Math.cos(angle), scale),
      );
    }
  }
  return crops.sort((a, b) => a.foot - b.foot);
})();

/** The lowest point of any crop, should a drawing ever reach below the circle. */
const GROUND = Math.max(DISC, ...CROPS.map((crop) => crop.foot));

function Harvest({ sweep }: { sweep: number }) {
  const art = useCropArt();
  const angle = sweep * 2 * Math.PI;
  const hand = { x: DISC * Math.sin(angle), y: -DISC * Math.cos(angle) };

  return (
    <svg
      className="bi-harvest"
      viewBox={`${-DISC - 4} ${-DISC - 4} ${2 * DISC + 8} ${DISC + GROUND + 8}`}
      role="img"
      aria-label="A round heap of apples and pears, 35% of them turned yellow, swept out from twelve o'clock like a pie chart"
    >
      <defs>
        {KINDS.map((kind) => (
          <path key={kind.file} id={`bi-back-${kind.file}`} d={kind.outline} />
        ))}
      </defs>
      {CROPS.map((crop, i) => {
        const kind = KINDS[crop.kind];
        return (
          <g
            key={i}
            transform={`translate(${(crop.x - kind.centre.x * crop.scale).toFixed(2)} ${(crop.y - kind.centre.y * crop.scale).toFixed(2)}) scale(${crop.scale.toFixed(3)})`}
          >
            {/* Placed by the outer group, so the stylesheet's transform on
                this one, the pop as it turns yellow, adds to the placement
                rather than replacing it. */}
            <g className={`bi-crop${crop.turn < sweep ? " is-yellow" : ""}`}>
              <use className="bi-crop-back" href={`#bi-back-${kind.file}`} />
              {art && (
                <>
                  <image
                    className="bi-crop-own"
                    href={`${art}${kind.file}.svg`}
                    width={kind.w}
                    height={kind.h}
                  />
                  <image
                    className="bi-crop-yellow"
                    href={`${art}${kind.file}_yellow.svg`}
                    width={kind.w}
                    height={kind.h}
                  />
                </>
              )}
            </g>
          </g>
        );
      })}
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

/* The team's bee, over the word it stands for. It hangs about a fixed point,
 * a few pixels either way, and beats its wings while the pointer is on it:
 * the two frames swap at the cursor bees' own wingbeat. All of it is CSS, so
 * it costs nothing per frame, and under prefers-reduced-motion it is still.
 * Decoration: hidden from screen readers, and the heading's text is
 * unchanged. A span, because a heading may only hold phrasing content. */
function HoverBee() {
  return (
    <span className="bi-bee" aria-hidden="true">
      <span className="bi-bee-drift">
        <span className="bi-bee-bob">
          {BEE_FRAMES.map((src, i) => (
            <img
              key={src}
              className={`bi-bee-frame bi-bee-frame-${i}`}
              src={src}
              alt=""
            />
          ))}
        </span>
      </span>
    </span>
  );
}

/* The sweep follows the scroll exactly as the food line does, so the two
 * figures fill together and the hand winds back on the way up. */
function BeesHalf({
  swept,
  figure,
}: {
  swept: number;
  figure: RefObject<HTMLDivElement | null>;
}) {
  const sweep = SHARE * swept;
  const percent = Math.round(100 * sweep);

  return (
    <div className="bi-half">
      <h3 className="bi-claim">
        <span className="bi-when">
          <HoverBee />
          <span>
            <Marked text={BEES.harvest.when} />
          </span>
        </span>
        <span className="bi-figure">{percent}%</span>
        <span className="bi-words">
          <Marked text={BEES.harvest.words} />
        </span>
      </h3>
      <div className="bi-visual" ref={figure}>
        <Harvest sweep={sweep} />
      </div>
      <p className="bi-note">
        <Marked text={BEES.harvest.note} />
      </p>
      <p className="bi-ref">
        <Runs runs={BEES.harvest.ref} />
      </p>
    </div>
  );
}

/* ---------- the slide ---------- */

/* The slide shows no title, by the team's choice: the two claims are the
 * slide. The name (BEES.title) stays on the section for screen readers, and
 * the section's id is where a search result for either claim lands. */

export function BeeImportance() {
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

  // Both figures draw on the way down to the slide.
  const figure = useRef<HTMLElement>(null);
  const drawn = useScrolledIn(section, figure);
  const harvest = useRef<HTMLDivElement>(null);
  const swept = useScrolledIn(section, harvest);

  return (
    <section
      className="bee-importance"
      id={DECK_ANCHORS.bees}
      aria-label={BEES.title}
      ref={section}
      // As a slide it fills the screen: the menu steps aside (Navbar.tsx).
      data-fullscreen={slide || undefined}
    >
      <div className="bi-stage">
        <div className="bi-halves">
          <FoodHalf drawn={drawn} figure={figure} />
          <BeesHalf swept={swept} figure={harvest} />
        </div>
      </div>
    </section>
  );
}
