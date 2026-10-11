import { useRef, useState, type CSSProperties } from "react";
import { headingId } from "../utils/headingId";
import { easeOut, useClock } from "../utils/useClock";
import { REDUCED_MOTION } from "../utils/glide";
import { useMedia } from "../utils/useMedia";
import { DECK_MEDIA, useRide, within, type Span } from "../utils/deck";
import { DECK_ANCHORS, MITE, miteTitle } from "../data/homeDeck";
import { Marked, Runs } from "./Marked";
import "./VarroaSlide.css";

/* Slide three of the home page: the mite.
 *
 * One screen that plays out as the reader scrolls, all of it straight on the
 * mite's footage, which loops behind with no coat over it. First the claim,
 * large, its second line laid over the mite itself. A little scroll and the
 * claim shrinks up to the top while the toll comes in on the right, its two
 * numbers counting up with the scroll. Scroll on and the chart comes in on
 * the left, drawing 1950 to 2026 as the reader goes, with the closing line
 * under it.
 *
 * The scroll is the clock: the stage pins for two windows of travel and
 * every step reads off how far through them the reader is. Three rests go to
 * the deck (src/utils/deck.ts): the claim alone, the toll counted, the whole
 * screen. A reader who stops part way is eased on to the one they were
 * heading for.
 *
 * TEMPORARY HOSTING, as for the hero. The footage is served from
 * public/local/, which is gitignored, because video never ships from this
 * repo. It is mite_back_new.mp4 with its first 0.25 s cut: the source opens
 * on seven black frames, which a loop would flash every 4.6 s. Upload the
 * trimmed clip to the iGEM Video Universe before the freeze and point VIDEO
 * at it. Anywhere the file is absent the stage stays wax and says so.
 *
 * The numbers, and where they stand:
 *
 *   1.6 million     Colonies lost by US beekeepers between June 2024 and
 *                   March 2025: Project Apis m.'s colony loss survey, as
 *                   updated on 3 April 2025. USDA Agricultural Research
 *                   Service (June 2025) found the viruses varroa carries at
 *                   high levels in every colony it sampled. [LIT] The slide
 *                   says "every year"; the survey covers one ten-month
 *                   season. home.md's TODO carries that.
 *   $2.0 billion    The figure the team's jamboree deck opens with. Not yet
 *                   traced to a published source. [FLAG]
 *
 * The chart's two series are ESTIMATES set down so the layout can be built,
 * not data, and the figure says so on its face. Temperature follows the
 * shape of NASA GISTEMP v4's global annual anomaly against 1951 to 1980,
 * rounded by eye; the mite series is an invented index (2026 = 100) with no
 * source at all. Both are to be replaced before the freeze: home.md's TODO.
 *
 * Mobile first. Stacked, nothing pins: the footage holds still behind the
 * slide while the claim, the toll and the chart follow one another down,
 * the numbers and the chart running on a clock once each is on screen.
 * Under prefers-reduced-motion everything stands at its end and the
 * footage holds its first frame.
 */

/* The words and the numbers are MITE in src/data/homeDeck.ts, where the
 * search index reads them too. */
const VIDEO = `${import.meta.env.BASE_URL}local/mite_back_new.mp4`;

type Point = [year: number, value: number];

/** ESTIMATE. Global temperature, °C above the 1951 to 1980 mean. */
const WARMING: Point[] = [
  [1950, -0.17], [1955, -0.14], [1960, -0.03], [1965, -0.1], [1970, 0.03],
  [1975, -0.01], [1980, 0.26], [1985, 0.12], [1990, 0.45], [1995, 0.45],
  [2000, 0.39], [2005, 0.67], [2010, 0.72], [2015, 0.9], [2020, 1.01],
  [2023, 1.17], [2024, 1.28], [2026, 1.25],
];

/** ESTIMATE, no source. Varroa mites, as an index with 2026 = 100. */
const MITES: Point[] = [
  [1950, 0], [1960, 1], [1965, 3], [1970, 5], [1975, 9], [1980, 14],
  [1985, 20], [1990, 30], [1995, 38], [2000, 46], [2005, 55], [2010, 63],
  [2015, 72], [2020, 84], [2023, 92], [2026, 100],
];

/* Where each step of the ride sits, as fractions of the travel. */
const SHRINK: Span = [0, 0.18];
const TOLL: Span = [0.14, 0.3];
const COUNT: Span = [0.16, 0.34];
const TREND: Span = [0.4, 0.55];
const DRAW: Span = [0.45, 0.88];
const VERDICT: Span = [0.85, 1];
/** The deck's rests inside the ride: the toll counted, and the end. */
const RESTS = [COUNT[1], 1];

/* ---------- the chart ---------- */

/* One plot on one year axis, temperature read off the left scale and the
 * mites off the right. The two scales are set so their gridlines coincide,
 * 0, 0.5 and 1 °C on 0, 50 and 100, and each axis is drawn in its series'
 * colour to say which scale is whose. */

const W = 640;
const H = 408;
const LEFT = 58;
const RIGHT = W - 92;
const PLOT = { top: 82, bottom: 360 };
const YEARS: Span = [1950, 2026];
const YEAR_TICKS = [1950, 1970, 1990, 2010, 2026];
/** The least room between the two moving values, baseline to baseline. */
const LABEL_GAP = 22;

const fx = (year: number) =>
  LEFT + ((year - YEARS[0]) / (YEARS[1] - YEARS[0])) * (RIGHT - LEFT);

function scaleY([lo, hi]: Span) {
  return (v: number) => PLOT.bottom - ((v - lo) / (hi - lo)) * (PLOT.bottom - PLOT.top);
}

function pathOf(points: Point[], fy: (v: number) => number) {
  return points
    .map(([year, v], i) => `${i ? "L" : "M"}${fx(year).toFixed(1)},${fy(v).toFixed(1)}`)
    .join("");
}

/** The series' value at `year`, read straight along the line. */
function valueAt(points: Point[], year: number) {
  const i = points.findIndex(([y]) => y >= year);
  if (i <= 0) return points[Math.max(i, 0)][1];
  const [y0, v0] = points[i - 1];
  const [y1, v1] = points[i];
  return v0 + ((v1 - v0) * (year - y0)) / (y1 - y0);
}

/* Each series on its own side: the left scale, title flush left, is the
 * temperature's; the right, title flush right, the mites'. */
const SERIES = [
  {
    key: "warming",
    title: "Global temperature, °C above the 1951 to 1980 mean",
    points: WARMING,
    domain: [-0.3, 1.35] as Span,
    ticks: [0, 0.5, 1],
    tick: (v: number) => (v ? `+${v.toFixed(1)}` : "0"),
    head: (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(2)} °C`,
    side: "left",
  },
  {
    key: "mites",
    title: "Varroa mites, index (2026 = 100)",
    points: MITES,
    domain: [-30, 135] as Span,
    ticks: [0, 50, 100],
    tick: (v: number) => String(v),
    head: (v: number) => String(Math.round(v)),
    side: "right",
  },
] as const;

/** Baselines for the two moving values, pushed apart where the lines run close. */
function headBaselines([a, b]: number[]): number[] {
  if (Math.abs(a - b) >= LABEL_GAP) return [a + 4, b + 4];
  const mid = (a + b) / 2 + 4;
  const half = LABEL_GAP / 2;
  return a <= b ? [mid - half, mid + half] : [mid + half, mid - half];
}

function TrendChart({ drawn }: { drawn: number }) {
  const year = YEARS[0] + (YEARS[1] - YEARS[0]) * drawn;
  const x = fx(year);
  const shown = drawn > 0.001;

  const scales = SERIES.map((series) => scaleY(series.domain));
  const heads = SERIES.map((series, i) => scales[i](valueAt(series.points, year)));
  const baselines = headBaselines(heads);

  return (
    <svg
      className="ms-chart"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMinYMin meet"
      role="img"
      aria-label="One chart, 1950 to 2026, both lines rising: global temperature, on the left scale, from about 0.2 °C below the 1951 to 1980 mean to about 1.3 °C above it, and varroa mites, on the right scale, from none to an index of 100. Estimated values, not data."
    >
      <defs>
        <clipPath id="ms-drawn">
          <rect x={0} y={0} width={x + 1} height={H} />
        </clipPath>
      </defs>

      {SERIES[0].ticks.map((t) => (
        <line key={t} className="ms-grid" x1={LEFT} x2={RIGHT} y1={scales[0](t)} y2={scales[0](t)} />
      ))}
      <line className="ms-axis" x1={LEFT} x2={RIGHT} y1={PLOT.bottom} y2={PLOT.bottom} />

      {SERIES.map((series, i) => {
        const fy = scales[i];
        const left = series.side === "left";
        const edge = left ? LEFT : RIGHT;
        const out = left ? -1 : 1;
        // The mites' value reaches the right scale at the end; a scale label
        // it would sit on gives way to it.
        const covered = (t: number) =>
          !left && shown && x > RIGHT - 40 && Math.abs(baselines[i] - (fy(t) + 4)) < LABEL_GAP;
        return (
          <g key={series.key} className={`ms-series ms-series--${series.key}`}>
            <line
              className="ms-key"
              x1={left ? LEFT : RIGHT - 22}
              x2={left ? LEFT + 22 : RIGHT}
              y1={17 + 28 * i}
              y2={17 + 28 * i}
            />
            <text
              className="ms-legend"
              x={left ? LEFT + 30 : RIGHT - 30}
              y={22 + 28 * i}
              textAnchor={left ? "start" : "end"}
            >
              {series.title}
            </text>

            <line className="ms-scale" x1={edge} x2={edge} y1={PLOT.top} y2={PLOT.bottom} />
            {series.ticks.map(
              (t) =>
                !covered(t) && (
                  <text
                    key={t}
                    className="ms-tick"
                    x={edge + 8 * out}
                    y={fy(t) + 4}
                    textAnchor={left ? "end" : "start"}
                  >
                    {series.tick(t)}
                  </text>
                ),
            )}

            <g clipPath="url(#ms-drawn)">
              <path className="ms-casing" d={pathOf(series.points, fy)} />
              <path className="ms-line" d={pathOf(series.points, fy)} />
            </g>

            {shown && (
              <g className="ms-head">
                <circle cx={x} cy={heads[i]} r={5} />
                <text x={x + 10} y={baselines[i]}>
                  {series.head(valueAt(series.points, year))}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {YEAR_TICKS.map((y) => (
        <text key={y} className="ms-tick" x={fx(y)} y={PLOT.bottom + 20} textAnchor="middle">
          {y}
        </text>
      ))}

      {shown && drawn < 0.999 && (
        <g className="ms-now">
          <line x1={x} x2={x} y1={PLOT.top} y2={PLOT.bottom} />
          <text x={x} y={PLOT.bottom + 40} textAnchor="middle">
            {Math.round(year)}
          </text>
        </g>
      )}
    </svg>
  );
}

/* ---------- the type trial ---------- */

/* EXPERIMENT, development only. How the slide's type sits on the footage is
 * still open, so `yarn dev` shows a switcher in the stage's corner that sets
 * the treatment and the face for every line at once. The production build
 * ships DEFAULT_INK and DEFAULT_FACE. Once the team has chosen, keep that
 * pair here and delete the switcher and the data-ink rules it drives in
 * VarroaSlide.css. */

const INKS = [
  { key: "black", label: "Black" },
  { key: "white", label: "White" },
  { key: "honey", label: "Yellow" },
  { key: "on-white", label: "Black on white" },
  { key: "on-black", label: "White on black" },
  { key: "on-honey", label: "Black on yellow" },
  { key: "honey-on-black", label: "Yellow on black" },
] as const;
const FACES = [
  { key: "basenji", label: "Basenji" },
  { key: "cubao", label: "Cubao" },
] as const;
type Ink = (typeof INKS)[number]["key"];
type Face = (typeof FACES)[number]["key"];
type Trial = { ink: Ink; face: Face };

const DEFAULT_TRIAL: Trial = { ink: "black", face: "basenji" };
const TRIAL_KEY = "nectar:mite-type";

function readTrial(): Trial {
  try {
    const saved = JSON.parse(localStorage.getItem(TRIAL_KEY) ?? "{}");
    return {
      ink: INKS.some((i) => i.key === saved.ink) ? saved.ink : DEFAULT_TRIAL.ink,
      face: FACES.some((f) => f.key === saved.face) ? saved.face : DEFAULT_TRIAL.face,
    };
  } catch {
    return DEFAULT_TRIAL;
  }
}

function useTrial() {
  const [trial, setTrial] = useState<Trial>(() =>
    import.meta.env.DEV ? readTrial() : DEFAULT_TRIAL,
  );
  const update = (next: Partial<Trial>) =>
    setTrial((current) => {
      const merged = { ...current, ...next };
      try {
        localStorage.setItem(TRIAL_KEY, JSON.stringify(merged));
      } catch {
        // Storage refused: the choice still holds for this visit.
      }
      return merged;
    });
  return [trial, update] as const;
}

function TypeTrial({
  trial,
  onChange,
}: {
  trial: Trial;
  onChange: (next: Partial<Trial>) => void;
}) {
  return (
    <fieldset className="ms-trial">
      <legend>Type trial (dev only)</legend>
      <label>
        Treatment{" "}
        <select
          value={trial.ink}
          onChange={(e) => onChange({ ink: e.target.value as Ink })}
        >
          {INKS.map((i) => (
            <option key={i.key} value={i.key}>
              {i.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Face{" "}
        <select
          value={trial.face}
          onChange={(e) => onChange({ face: e.target.value as Face })}
        >
          {FACES.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  );
}

/* ---------- the slide ---------- */

export function VarroaSlide() {
  const track = useRef<HTMLDivElement>(null);
  const toll = useRef<HTMLDivElement>(null);
  const trend = useRef<HTMLDivElement>(null);
  const pinned = useMedia(DECK_MEDIA);
  const p = useRide(track, pinned, RESTS);
  // Stacked, the numbers and the chart each run once on a clock instead.
  const counted = useClock(toll, 1800, 150);
  const plotted = useClock(trend, 2400, 250);
  const [missing, setMissing] = useState(false);
  const [trial, setTrial] = useTrial();

  const count = pinned ? easeOut(within(p, COUNT)) : easeOut(counted);
  const drawn = pinned ? within(p, DRAW) : plotted;
  const steps = {
    shrink: pinned ? within(p, SHRINK) : 0,
    toll: pinned ? within(p, TOLL) : 1,
    trend: pinned ? within(p, TREND) : 1,
    verdict: pinned ? within(p, VERDICT) : 1,
  };
  const style = {
    "--shrink": steps.shrink,
    "--toll": steps.toll,
    "--trend": steps.trend,
    "--verdict": steps.verdict,
  } as CSSProperties;

  const id = headingId(miteTitle());

  // Each line's words sit in an .ms-ink span: that span is what carries the
  // rectangle in the boxed treatments. <Marked> puts a honey background on
  // the words a reader searched for; the section's id is where their result
  // lands.
  return (
    <section
      className="varroa-slide"
      id={DECK_ANCHORS.mite}
      aria-labelledby={id}
    >
      <div
        className="ms-track"
        ref={track}
        // Pinned, the ride fills the screen: the menu steps aside (Navbar.tsx).
        data-fullscreen={pinned || undefined}
      >
        <div
          className="ms-stage"
          style={style}
          data-ink={trial.ink}
          data-face={trial.face}
        >
          <div className="ms-backdrop">
            {!missing && (
              <video
                src={VIDEO}
                autoPlay={!REDUCED_MOTION}
                loop
                muted
                playsInline
                aria-hidden="true"
                onError={() => setMissing(true)}
              />
            )}
          </div>

          <h2 className="ms-title" id={id}>
            <span className="ms-lead">
              <span className="ms-ink">
                <Marked text={MITE.lead} />
              </span>
            </span>{" "}
            <span className="ms-mite">
              <span className="ms-ink">
                <Marked text={MITE.subject.before} />
                <span className="ms-red">
                  <Marked text={MITE.subject.red} />
                </span>
              </span>
            </span>
          </h2>

          <div className="ms-toll" ref={toll} data-shown={steps.toll > 0}>
            <p className="ms-when">
              <span className="ms-ink">
                <Marked text={MITE.when} />
              </span>
            </p>
            <p className="ms-count">
              <span className="ms-ink" aria-hidden="true">
                {(MITE.colonies * count).toFixed(1)} million colonies
              </span>
              <span className="visually-hidden">
                {MITE.colonies} million colonies
              </span>
            </p>
            <p className="ms-count">
              <span className="ms-ink" aria-hidden="true">
                ${(MITE.dollars * count).toFixed(1)} billion
              </span>
              <span className="visually-hidden">
                ${MITE.dollars.toFixed(1)} billion
              </span>
            </p>
            <p className="ms-lost">
              <span className="ms-ink">
                <Marked text={MITE.lost.before} />
                <span className="ms-red">
                  <Marked text={MITE.lost.red} />
                </span>
                <Marked text={MITE.lost.after} />
              </span>
            </p>
            <p className="ms-refs">
              <span>
                <Runs runs={MITE.refs} />
              </span>
            </p>
          </div>

          <div className="ms-trend" ref={trend} data-shown={steps.trend > 0}>
            <figure className="ms-figure-wrap">
              <TrendChart drawn={drawn} />
              <figcaption className="ms-refs">
                <span>
                  <Runs runs={MITE.chart} />
                </span>
              </figcaption>
            </figure>
            <p className="ms-verdict">
              <span className="ms-ink">
                <Marked text={MITE.verdict} />
              </span>
            </p>
          </div>

          {import.meta.env.DEV && <TypeTrial trial={trial} onChange={setTrial} />}

          {missing && (
            <p className="ms-missing">
              <strong>VIDEO:</strong> the mite, mite_back_new.mp4. Hosted
              locally during development; to appear here it must be uploaded
              to the iGEM Video Universe and this component pointed at the
              embed.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
