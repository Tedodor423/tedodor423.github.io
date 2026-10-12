import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HEXES,
  HEX_R,
  MAP_H,
  MAP_W,
  hexPoints,
  type Hex,
} from "../utils/worldHexes";
import { COUNTRY_HEXES } from "../utils/hexCountries";
import { assignCells } from "../utils/stakeholderCells";
import { useMedia } from "../utils/useMedia";
import { STILL, clamp01 } from "../utils/useClock";
import { DECK_MEDIA, useDeckRests } from "../utils/deck";
import { glideTo } from "../utils/glide";
import { PLACED } from "../utils/placed";
import { MAP_ANCHOR } from "../data/stakeholders";
import {
  CASE_STUDIES,
  HP_INTRO,
  SPREAD_YEARS,
  SURVEY_COUNTS,
  SURVEY_PLACEHOLDER_N,
  VARROA_FIRST_RECORDS,
  type IntroState,
} from "../data/hpIntro";
import {
  ANOMALIES,
  TEMPERATURE_FROM,
  TEMPERATURE_SOURCE,
  TEMPERATURE_TO,
  anomalyIn,
} from "../data/globalTemperature";
import { HiveFramework } from "./HiveFramework";
import { InterviewFaces } from "./InterviewFaces";
import { Marked, MarkedInline } from "./Marked";
import "./HpIntro.css";

/* The opening of the human practices page, laid out from the team's mockup
 * of 11 Oct 2026 and their notes on it the same day: words down the left,
 * one small world map down the right that travels with them.
 *
 *   - The reach, set big: the interview count with the faces of people we
 *     spoke to changing beside it (InterviewFaces), and level with it the
 *     survey count over the map, a dot on it for each response.
 *   - Straight under it, what that work fed, as one slide: the lead and its
 *     four lines, all on screen at once and pinned while the reader scrolls
 *     through them. A honey block moves down the lines with the scroll
 *     itself, part way between two when the reader is, so it shows that
 *     the page is scrolling and how far; the line it covers most is the
 *     highlighted one, and the map shows that line's picture: California and Australia lit for the case
 *     studies; Varroa reaching country after country, each turning redder
 *     for every year it has had the mite, with a year counter and global
 *     surface temperature under it, for the models; the HIVE hive in its
 *     place, which opens the framework's window, for the framework; and the
 *     people we interviewed, a honey cell each, for the engineering.
 *     Pressing a line rides the window to it and puts the line's fragment
 *     in the address (`#modelling`), so the address is a permalink to it;
 *     a link with that fragment lands the window on the line (the landing
 *     markers below).
 *
 * The map scrolls up with the reach, holds at the top beside the slide, and
 * then, on a wide screen, grows into the stakeholder map as that scrolls up
 * into the window: the same lattice in the same colours, flown from its
 * place in the column to where the big map draws the world, so the one
 * becomes the other. See the hand-off below.
 *
 * Which line is highlighted follows the scroll alone, so scrolling back
 * plays everything backwards, and on a wide screen the window settles on a
 * line when the reader stops between two (src/utils/deck.ts), as it does on
 * the map's questions. On a narrow screen the slide does not pin, since it
 * and the map cannot both fit, and a line lights as it passes a reading
 * line under the map instead. The spread runs on a clock rather than on the
 * scroll, once each time the reader reaches it from above; reached from
 * below, or under reduced motion, it shows its last year at once.
 *
 * PLACEHOLDERS. The survey dots and the order countries turn red in are
 * stand-ins until their data is in (src/data/hpIntro.ts says what each needs).
 * While either is, the map carries a TODO saying so under it, so a reader
 * never takes a stand-in for a finding. The temperature series is real (see
 * src/data/globalTemperature.ts).
 */

/** How far apart the slide's lines are on its ride, as a fraction of the
 * window's height. Mirrored by --hpi-step in HpIntro.css. */
const STEP = 0.45;

/** Where a line lights on a narrow screen, as a fraction of the window's
 * height: under the figure, which holds the top. */
const READ_AT_NARROW = 0.78;

/** How long the spread takes from its first year to its last, in ms. */
const SPREAD_MS = 6500;

/** Years over which a country goes from first record to full red. */
const RAMP_YEARS = 12;

/** Through the hand-off (0 to 1), where the small map has reached the big
 * one: from here it rides exactly over it while it gives way to it. */
const HANDOFF_SEAM = 0.8;

/** How much of a window's height of scroll the hand-off takes. It is done
 * a little before the stakeholder map has reached the top; the last of the
 * way is that map simply scrolling into place. */
const HANDOFF_SPAN = 0.75;

/** Through the hand-off, when the slide starts to fade out of the way of
 * the map growing across the window, and when it has gone. The stakeholder
 * map starts rising under the slide as its last line lights (HpIntro.css),
 * so that line is read for a moment before it goes. */
const HANDOFF_LEAVE = [0.1, 0.32];

/** The order of the pictures down the page, so the spread can tell whether
 * it was reached from above. */
const ORDER: IntroState[] = ["survey", "regions", "spread", "hive", "people"];

const USES = HP_INTRO.uses;

/** Where on the slide's ride each line is the highlighted one, in steps:
 * half way through its own step, except the last, just after it lights,
 * since the rest of its step is the hand-off into the stakeholder map. */
const CENTRES = USES.map((_, i) => (i === USES.length - 1 ? i + 0.1 : i + 0.5));

/** Where the highlight is for a place on the ride (in steps), as a line
 * index with a fraction: on a line at its centre, part way to the next
 * between two. */
function lineAt(t: number): number {
  if (t <= CENTRES[0]) return 0;
  for (let i = 0; i < CENTRES.length - 1; i++) {
    if (t <= CENTRES[i + 1]) {
      return i + (t - CENTRES[i]) / (CENTRES[i + 1] - CENTRES[i]);
    }
  }
  return CENTRES.length - 1;
}

/** How far a line the highlight is not on steps back. */
const DIM = 0.42;

/** Where a line's fragment lands, as a CSS length: the window's top at the
 * scroll restOf gives for it. On a wide screen from the top of the pin,
 * where the window's top at the line's place on the ride is that far down
 * the ride less where the slide holds; on a narrow one from the line's own
 * top, the window's top being far enough above it for the line to sit just
 * past the reading line. ScrollToHash puts the marker flush with the
 * window's top. */
const landingTop = (i: number, narrow: boolean) =>
  narrow
    ? `${-(READ_AT_NARROW - 0.05) * 100}vh`
    : `calc(${CENTRES[i] * STEP * 100}vh - var(--hpi-top))`;

/** Whether a click is a plain one, which the page answers itself, rather
 * than one that opens the link elsewhere. */
const plainClick = (e: ReactMouseEvent) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

/* ---------- the map's data ---------- */

/** A small seeded generator (mulberry32), so a stand-in is the same on
 * every visit and in every reader's window. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HEX_AT = new Map(HEXES.map((h) => [`${h.col}.${h.row}`, h]));

/** Every country on the lattice, with its cells. */
const COUNTRIES = [...COUNTRY_HEXES].map(([name, keys]) => ({
  name,
  cells: keys.map((k) => HEX_AT.get(k)).filter((h): h is Hex => !!h),
}));

interface Dot {
  x: number;
  y: number;
}

/** The survey dots: one per response, inside its country's cells, or the
 * stand-ins while there are no responses to draw. */
function surveyDots(): { dots: Dot[]; placeholder: boolean } {
  const rand = seeded(2026);
  const within = (h: Hex): Dot => {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * HEX_R * 0.55;
    return { x: h.x + r * Math.cos(a), y: h.y + r * Math.sin(a) };
  };
  const counts = Object.entries(SURVEY_COUNTS).filter(([, n]) => n > 0);
  if (!counts.length) {
    return {
      placeholder: true,
      dots: Array.from({ length: SURVEY_PLACEHOLDER_N }, () =>
        within(HEXES[Math.floor(rand() * HEXES.length)]),
      ),
    };
  }
  const dots: Dot[] = [];
  for (const [name, n] of counts) {
    const cells = COUNTRIES.find((c) => c.name === name)?.cells ?? [];
    for (let i = 0; i < n && cells.length; i++) {
      dots.push(within(cells[i % cells.length]));
    }
  }
  return { dots, placeholder: false };
}

/** The year each country first recorded Varroa, or the stand-in order while
 * the table is empty: outwards from the middle of the drawing, by distance,
 * with some noise. The middle of the drawing is deliberately arbitrary, so
 * the stand-in cannot be mistaken for the history. */
function firstRecords(): { years: Map<string, number>; placeholder: boolean } {
  if (VARROA_FIRST_RECORDS.length) {
    return {
      years: new Map(VARROA_FIRST_RECORDS.map((r) => [r.country, r.year])),
      placeholder: false,
    };
  }
  const rand = seeded(1950);
  const { from, to } = SPREAD_YEARS;
  const centre = (cells: Hex[]) => ({
    x: cells.reduce((s, h) => s + h.x, 0) / cells.length,
    y: cells.reduce((s, h) => s + h.y, 0) / cells.length,
  });
  const far = Math.hypot(MAP_W / 2, MAP_H / 2);
  const years = new Map<string, number>();
  for (const c of COUNTRIES) {
    if (!c.cells.length) continue;
    const p = centre(c.cells);
    const d = Math.hypot(p.x - MAP_W / 2, p.y - MAP_H / 2) / far;
    const year = from + 4 + d * (to - from - 14) + (rand() - 0.5) * 12;
    years.set(c.name, Math.round(Math.min(to - 2, Math.max(from, year))));
  }
  return { years, placeholder: true };
}

/** How red a country is in a year: null before its first record, then 35%
 * to 100% of the mite colour over RAMP_YEARS. */
function redness(first: number | undefined, year: number): number | null {
  if (first === undefined || year < first) return null;
  return 35 + 65 * clamp01((year - first) / RAMP_YEARS);
}

/* The labels on the two case-study regions, in the drawing's units: beside
 * California to the west, out in the Pacific, and under Australia. */
const REGION_LABELS: Record<
  string,
  { dx: number; dy: number; anchor: "end" | "middle" }
> = {
  California: { dx: -30, dy: 14, anchor: "end" },
  Australia: { dx: 0, dy: 112, anchor: "middle" },
};

/* ---------- inline copy ---------- */

const INTERNAL = /(\[[^\]]+\]\(\/[^)\s]*\))/;

/** A line of the copy: `**bold**` through MarkedInline, and links to other
 * pages of the wiki as router links, so they keep the base path and get the
 * wiki's link preview like any link in a page. */
function Copy({ text }: { text: string }) {
  return (
    <>
      {text.split(INTERNAL).map((run, i) => {
        const link = /^\[([^\]]+)\]\((\/[^)\s]*)\)$/.exec(run);
        if (link) {
          return (
            <Link key={i} to={link[2]}>
              <Marked text={link[1]} />
            </Link>
          );
        }
        return run && <MarkedInline key={i} text={run} />;
      })}
    </>
  );
}

/** A TODO in the page's own form, the blockquote every content file uses. */
function Todo({ text }: { text: string }) {
  return (
    <blockquote className="hpi-todo">
      <p>
        <strong>TODO —</strong> <Marked text={text} />
      </p>
    </blockquote>
  );
}

/* ---------- the map ---------- */

interface IntroMapProps {
  state: IntroState;
  year: number;
  dots: Dot[];
  firsts: Map<string, number>;
}

/** The land, one group per country so a country can be coloured as one.
 * Built once: only the groups' fill changes from year to year. */
const LAND = COUNTRIES.map((c) => ({
  name: c.name,
  cells: c.cells.map((h) => (
    <polygon key={`${h.col}-${h.row}`} points={hexPoints(h.x, h.y)} />
  )),
}));

const PEOPLE = assignCells();

const IntroMap = memo(function IntroMap({
  state,
  year,
  dots,
  firsts,
}: IntroMapProps) {
  const regions = useMemo(
    () =>
      HP_INTRO.regions.map((name) => {
        const cells = COUNTRIES.find((c) => c.name === name)?.cells ?? [];
        const xs = cells.map((h) => h.x);
        const ys = cells.map((h) => h.y);
        const at = REGION_LABELS[name];
        const x =
          at.anchor === "end"
            ? Math.min(...xs) + at.dx
            : (Math.min(...xs) + Math.max(...xs)) / 2 + at.dx;
        return {
          name,
          x,
          y: (Math.min(...ys) + Math.max(...ys)) / 2 + at.dy,
          anchor: at.anchor,
        };
      }),
    [],
  );

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      className="hpi-svg"
      data-state={state}
      role="img"
      aria-label="World map of where our survey responses, case studies and interviews come from"
    >
      <g className="hpi-land">
        {LAND.map((c) => {
          const red =
            state === "spread" ? redness(firsts.get(c.name), year) : null;
          const region = HP_INTRO.regions.includes(c.name);
          return (
            <g
              key={c.name}
              className={region ? "is-region" : undefined}
              style={
                red === null
                  ? undefined
                  : {
                      fill: `color-mix(in oklab, var(--mite) ${red}%, var(--map-land))`,
                    }
              }
            >
              {c.cells}
            </g>
          );
        })}
      </g>

      <g className="hpi-dots">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={6.5} />
        ))}
      </g>

      <g className="hpi-labels" aria-hidden>
        {regions.map((r) => (
          <text key={r.name} x={r.x} y={r.y} textAnchor={r.anchor}>
            {r.name}
          </text>
        ))}
      </g>

      {/* Drawn as the stakeholder map below draws them at rest, so the
       * hand-off has nothing to change but the size. */}
      <g className="hpi-people">
        {PEOPLE.map((n) => (
          <polygon key={n.s.id} points={hexPoints(n.x, n.y)} />
        ))}
      </g>
    </svg>
  );
});

/* ---------- the warming chart ---------- */

const T_MIN = -0.6;
const T_MAX = 1.4;
const T_TICKS = [-0.5, 0, 0.5, 1];

const sign = (v: number) =>
  v > 0 ? `+${v.toFixed(2)}` : v < 0 ? `−${(-v).toFixed(2)}` : "0.00";

const T_SUMMARY = (() => {
  const max = Math.max(...ANOMALIES);
  const peak = TEMPERATURE_FROM + ANOMALIES.indexOf(max);
  return `Line chart of global mean surface temperature, ${TEMPERATURE_FROM} to ${TEMPERATURE_TO}, in degrees Celsius above the ${TEMPERATURE_SOURCE.baseline} average: ${sign(ANOMALIES[0])} in ${TEMPERATURE_FROM}, ${sign(ANOMALIES[ANOMALIES.length - 1])} in ${TEMPERATURE_TO}, highest ${sign(max)} in ${peak}.`;
})();

/** Global temperature, the whole series faint and the years up to `year`
 * drawn over it, with the value at `year` marked. Pointing at the chart
 * reads off any year instead. Measured in pixels, so its type stays the
 * page's size at any width. */
function WarmingChart({ year }: { year: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const h = 112;
  const pad = { l: 34, r: 12, t: 10, b: 18 };
  const x = (y: number) =>
    pad.l +
    ((y - TEMPERATURE_FROM) / (TEMPERATURE_TO - TEMPERATURE_FROM)) *
      (w - pad.l - pad.r);
  const y = (v: number) =>
    pad.t + ((T_MAX - v) / (T_MAX - T_MIN)) * (h - pad.t - pad.b);
  const path = (to: number) =>
    ANOMALIES.slice(0, to - TEMPERATURE_FROM + 1)
      .map(
        (v, i) =>
          `${i ? "L" : "M"}${x(TEMPERATURE_FROM + i).toFixed(1)},${y(v).toFixed(1)}`,
      )
      .join("");

  const shown = Math.min(
    Math.max(hover ?? year, TEMPERATURE_FROM),
    TEMPERATURE_TO,
  );
  const value = anomalyIn(shown) ?? 0;
  const mx = x(shown);
  const my = y(value);
  const label = `${shown}: ${sign(value)} °C`;
  const flip = mx > w - 110;

  return (
    <div className="hpi-chart" ref={wrap}>
      {w > 0 && (
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={T_SUMMARY}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const t = (e.clientX - r.left - pad.l) / (w - pad.l - pad.r);
            setHover(
              Math.round(
                TEMPERATURE_FROM +
                  clamp01(t) * (TEMPERATURE_TO - TEMPERATURE_FROM),
              ),
            );
          }}
          onPointerLeave={() => setHover(null)}
        >
          <g className="hpi-chart-grid">
            {T_TICKS.map((t) => (
              <g key={t}>
                <line
                  x1={pad.l}
                  x2={w - pad.r}
                  y1={y(t)}
                  y2={y(t)}
                  className={t === 0 ? "is-zero" : undefined}
                />
                <text x={pad.l - 6} y={y(t) + 4} textAnchor="end">
                  {t === 0 ? "0" : sign(t).replace(/0$/, "")}
                </text>
              </g>
            ))}
            {[TEMPERATURE_FROM, SPREAD_YEARS.from, 2000, TEMPERATURE_TO].map(
              (yr) => (
                <text
                  key={yr}
                  x={x(yr)}
                  y={h - 3}
                  textAnchor={
                    yr === TEMPERATURE_TO
                      ? "end"
                      : yr === TEMPERATURE_FROM
                        ? "start"
                        : "middle"
                  }
                >
                  {yr}
                </text>
              ),
            )}
          </g>
          <path d={path(TEMPERATURE_TO)} className="hpi-chart-all" />
          <path d={path(shown)} className="hpi-chart-now" />
          {hover !== null && (
            <line
              x1={mx}
              x2={mx}
              y1={pad.t}
              y2={h - pad.b}
              className="hpi-chart-cross"
            />
          )}
          <circle cx={mx} cy={my} r={4} className="hpi-chart-dot" />
          <text
            x={mx + (flip ? -8 : 8)}
            y={Math.max(my - 8, pad.t + 10)}
            textAnchor={flip ? "end" : "start"}
            className="hpi-chart-value"
          >
            {label}
          </text>
        </svg>
      )}
    </div>
  );
}

/* ---------- the opening ---------- */

/** A line of the list as plain words. */
const plain = (text: string) =>
  text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*+/g, "");

export function HpIntro() {
  const still = useMedia(STILL);
  const narrow = useMedia("(max-width: 56rem)");
  const deck = useMedia(DECK_MEDIA);
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const slide = useRef<HTMLDivElement>(null);
  const lines = useRef<(HTMLLIElement | null)[]>([]);
  const mapBox = useRef<HTMLDivElement>(null);
  const fly = useRef<HTMLDivElement>(null);
  /** The highlighted line of the slide, or -1 before it. */
  const [active, setActive] = useState(-1);
  /** What the map shows: the survey until a line is highlighted, then that
   * line's picture. */
  const state: IntroState = active < 0 ? "survey" : USES[active].state;

  const survey = useMemo(surveyDots, []);
  const spread = useMemo(firstRecords, []);

  /** The scroll, in document coordinates, at which the highlight is right
   * on line `i` (CENTRES); on a narrow screen, just past where it lights. */
  const restOf = useCallback(
    (i: number) => {
      const vh = window.innerHeight;
      if (narrow) {
        const line = lines.current[i];
        if (!line) return window.scrollY;
        const top = line.getBoundingClientRect().top + window.scrollY;
        return top - vh * (READ_AT_NARROW - 0.05);
      }
      const p = pin.current;
      const s = slide.current;
      if (!p || !s) return window.scrollY;
      const held = parseFloat(getComputedStyle(s).top) || 0;
      const top = p.getBoundingClientRect().top + window.scrollY;
      return top - held + CENTRES[i] * STEP * vh;
    },
    [narrow],
  );

  /* The highlight, painted straight from the scroll, frame by frame, with
   * no easing of its own so it moves exactly as the page does: the block
   * set between two lines' boxes by how far the reader is between them, and
   * each line as bright as the block covers it. Measured from the lines
   * themselves, so it follows the type as the slide is fitted. Before the
   * slide (null) it waits, unseen, on the first line. */
  const mark = useRef<HTMLDivElement>(null);
  /** Where the highlight is (lineAt), or null before the slide. */
  const at = useRef<number | null>(null);
  const paintMark = useCallback(() => {
    const m = mark.current;
    const ls = lines.current;
    if (!m) return;
    const pos = at.current ?? 0;
    const i = Math.min(Math.floor(pos), ls.length - 1);
    const a = ls[i];
    const b = ls[Math.min(i + 1, ls.length - 1)];
    if (!a || !b) return;
    const f = pos - i;
    const mix = (x: number, y: number) => x + (y - x) * f;
    m.style.transform = `translate(${mix(a.offsetLeft, b.offsetLeft)}px, ${mix(a.offsetTop, b.offsetTop)}px)`;
    m.style.width = `${mix(a.offsetWidth, b.offsetWidth)}px`;
    m.style.height = `${mix(a.offsetHeight, b.offsetHeight)}px`;
    ls.forEach((el, k) => {
      if (!el) return;
      if (at.current === null) {
        el.style.removeProperty("opacity");
        return;
      }
      const cover = clamp01(1 - Math.abs(pos - k));
      el.style.opacity = String(DIM + (1 - DIM) * cover);
    });
  }, []);

  /* Where the highlight is. On a wide screen, how far the slide is through
   * its ride (lineAt); it appears as the slide comes to rest. On a narrow
   * one, where the reading line falls between the lines' tops. The
   * highlighted line, whose picture the map shows, is the one the block
   * covers most. */
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const vh = window.innerHeight;
      let pos: number | null = null;
      if (narrow) {
        const line = vh * READ_AT_NARROW;
        const tops = lines.current.map(
          (el) => el?.getBoundingClientRect().top ?? Infinity,
        );
        if (tops[0] < line) {
          pos = tops.length - 1;
          for (let i = 0; i < tops.length - 1; i++) {
            if (tops[i + 1] >= line) {
              pos = i + (line - tops[i]) / (tops[i + 1] - tops[i]);
              break;
            }
          }
        }
      } else {
        const p = pin.current;
        const s = slide.current;
        if (!p || !s) return;
        const held = parseFloat(getComputedStyle(s).top) || 0;
        const t = held - p.getBoundingClientRect().top;
        if (t >= -0.15 * vh) pos = lineAt(t / (STEP * vh));
      }
      at.current = pos;
      paintMark();
      setActive(pos === null ? -1 : Math.round(pos));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [narrow, paintMark]);

  /* The lines move when the slide is fitted; the highlight follows. */
  useLayoutEffect(() => {
    const s = slide.current;
    if (!s) return;
    const ro = new ResizeObserver(paintMark);
    ro.observe(s);
    return () => ro.disconnect();
  }, [paintMark]);

  /* The slide's lines are rests, where the slide pins, so a reader who
   * stops between two is eased on to one, the way the map below settles on
   * its questions. */
  const rests = useCallback(
    () => (deck && !narrow ? USES.map((_, i) => restOf(i)) : []),
    [deck, narrow, restOf],
  );
  useDeckRests(rests);

  /* The slide's type, as large as lets the whole slide fit the window under
   * its top: searched for, since its lines wrap differently at each size.
   * Again whenever the column's width or the window's height changes, and
   * once the web fonts have arrived. A narrow screen keeps the stylesheet's
   * size, since the slide does not pin there. */
  useLayoutEffect(() => {
    const s = slide.current;
    const column = s?.closest<HTMLElement>(".hpi-copy");
    if (!s || !column) return;
    if (narrow) {
      s.style.removeProperty("--hpi-slide-fs");
      return;
    }
    let width = -1;
    let height = -1;
    const fit = () => {
      const w = column.clientWidth;
      const h = window.innerHeight;
      if (w === width && h === height) return;
      width = w;
      height = h;
      const held = parseFloat(getComputedStyle(s).top) || 0;
      const room = h - held - 24;
      let lo = 14;
      let hi = 64;
      for (let i = 0; i < 10; i++) {
        const mid = (lo + hi) / 2;
        s.style.setProperty("--hpi-slide-fs", `${mid}px`);
        if (s.offsetHeight <= room) lo = mid;
        else hi = mid;
      }
      s.style.setProperty("--hpi-slide-fs", `${Math.floor(lo)}px`);
    };
    fit();
    // The column's height follows the fit; only its width is news, and
    // fit() ignores the rest.
    const ro = new ResizeObserver(fit);
    ro.observe(column);
    window.addEventListener("resize", fit);
    let live = true;
    document.fonts?.ready.then(() => {
      if (!live) return;
      width = -1;
      fit();
    });
    return () => {
      live = false;
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [narrow]);

  /* The map holds with its middle at the window's middle where the figure
   * fits that way (HpIntro.css), which needs the map's height and the whole
   * figure's. */
  const figure = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = root.current;
    const box = mapBox.current;
    const fig = figure.current;
    if (!el || !box || !fig) return;
    const ro = new ResizeObserver(() => {
      el.style.setProperty("--hpi-map-h", `${box.offsetHeight}px`);
      el.style.setProperty("--hpi-fig-h", `${fig.offsetHeight}px`);
    });
    ro.observe(box);
    ro.observe(fig);
    return () => ro.disconnect();
  }, []);

  /** Pressing a line rides the window to it, and puts its fragment in the
   * address as a permalink, with PLACED so ScrollToHash leaves the window
   * to the ride. */
  const navigate = useNavigate();
  const { hash } = useLocation();
  const pick = (i: number) => {
    glideTo(restOf(i));
    const { anchor } = USES[i];
    if (hash !== `#${anchor}`) navigate({ hash: anchor }, { state: PLACED });
  };
  /* The line's arrow is a real link to its fragment, so a modified click
   * opens it as one and it can be copied. */
  const onArrow = (i: number) => (e: ReactMouseEvent) => {
    if (!plainClick(e)) return;
    e.preventDefault();
    pick(i);
  };
  /* Anywhere on the line is a pointer shortcut to its arrow, except its
   * links, which do their own thing. */
  const onLine = (i: number) => (e: ReactMouseEvent) => {
    if ((e.target as Element).closest("a, button")) return;
    pick(i);
  };

  /* The spread's clock: from the first year, each time the spread is
   * reached from above; straight to the last year otherwise. */
  const [year, setYear] = useState(SPREAD_YEARS.to);
  const previous = useRef<IntroState>(state);
  useEffect(() => {
    const was = previous.current;
    previous.current = state;
    if (state !== "spread" || was === "spread") return;
    const { from, to } = SPREAD_YEARS;
    if (still || ORDER.indexOf(was) > ORDER.indexOf("spread")) {
      setYear(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = clamp01((now - start) / SPREAD_MS);
      setYear(Math.round(from + t * (to - from)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    setYear(from);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, still]);

  /* The hand-off. While the stakeholder map below rises into the window
   * (its pin's top from the bottom of the window to the top), the small map
   * leaves its column and is drawn fixed over the page, its box eased from
   * where it sits in the column to where the big map draws the world (its
   * svg letterboxes the same viewBox, so that box is the svg's, fitted).
   * It lands on that box by HANDOFF_SEAM and rides on it from there, while
   * the big map's drawing and its panels, held back until then
   * (data-handoff, StakeholderMap.css), come in as the small one fades.
   * The slide, still on screen above the big map as this starts, fades out
   * first (--hpi-leave), so the map never grows across its words, and once
   * the big map has taken over the slide and the figure stay hidden
   * (data-left), since the big map now overlaps the end of this section.
   * Only where the big map fills the window, and not under reduced motion;
   * anywhere else the map simply scrolls away. */
  useEffect(() => {
    const box = mapBox.current;
    const flying = fly.current;
    const intro = root.current;
    if (still || !box || !flying || !intro) return;
    let raf = 0;
    let section: HTMLElement | null = null;

    /** Puts everything back, the map in its column; `past` when the big
     * map has taken over, so this section keeps out of its way. */
    const land = (past = false) => {
      flying.removeAttribute("style");
      delete flying.dataset.flying;
      section?.removeAttribute("data-handoff");
      section?.style.removeProperty("--sm-handoff");
      intro.style.removeProperty("--hpi-leave");
      intro.toggleAttribute("data-left", past);
    };

    const paint = () => {
      raf = 0;
      section = document.getElementById(MAP_ANCHOR);
      const mapPin = section?.querySelector<HTMLElement>(".sm-pin");
      const svg = section?.querySelector<SVGSVGElement>(".sm-svg");
      if (
        !section ||
        !mapPin ||
        !svg ||
        !mapPin.hasAttribute("data-fullscreen")
      ) {
        land();
        return;
      }
      const vh = window.innerHeight;
      const p = clamp01(
        (1 - mapPin.getBoundingClientRect().top / vh) / HANDOFF_SPAN,
      );
      if (p <= 0 || p >= 1) {
        land(p >= 1);
        return;
      }
      const from = box.getBoundingClientRect();
      const r = svg.getBoundingClientRect();
      const k = Math.min(r.width / MAP_W, r.height / MAP_H);
      const to = {
        left: r.left + (r.width - MAP_W * k) / 2,
        top: r.top + (r.height - MAP_H * k) / 2,
        width: MAP_W * k,
      };
      const q = clamp01(p / HANDOFF_SEAM);
      const e = q * q * (3 - 2 * q);
      const fade = clamp01((p - HANDOFF_SEAM) / (1 - HANDOFF_SEAM));
      flying.dataset.flying = "";
      flying.style.left = `${from.left + (to.left - from.left) * e}px`;
      flying.style.top = `${from.top + (to.top - from.top) * e}px`;
      flying.style.width = `${from.width + (to.width - from.width) * e}px`;
      flying.style.opacity = String(1 - fade);
      section.setAttribute("data-handoff", "");
      section.style.setProperty("--sm-handoff", String(fade));
      intro.removeAttribute("data-left");
      intro.style.setProperty(
        "--hpi-leave",
        String(
          clamp01(
            (p - HANDOFF_LEAVE[0]) / (HANDOFF_LEAVE[1] - HANDOFF_LEAVE[0]),
          ),
        ),
      );
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      land();
    };
  }, [still]);

  /* "Continue scrolling": a ride down to the stakeholder map filling the
   * window, the hand-off playing on the way. Still a real link, so a
   * modified click opens it as one; the address takes the map's fragment,
   * with PLACED so ScrollToHash leaves the window to the ride. */
  const toQuestions = (e: ReactMouseEvent) => {
    if (!plainClick(e)) return;
    const mapPin = document.querySelector<HTMLElement>(
      `#${MAP_ANCHOR} .sm-pin`,
    );
    if (!mapPin) return;
    e.preventDefault();
    glideTo(mapPin.getBoundingClientRect().top + window.scrollY, 900);
    navigate({ hash: MAP_ANCHOR }, { state: PLACED });
  };

  const on = (s: IntroState) => (state === s ? " is-on" : "");

  return (
    <HiveFramework label={HP_INTRO.frameworkButton}>
      {({ hive, window: frameworkWindow }) => (
        <section
          className="hp-intro"
          ref={root}
          id={HP_INTRO.anchor}
          aria-label="How we worked"
          data-state={state}
          style={{ "--hpi-step": `${STEP * 100}vh` } as CSSProperties}
        >
          <div className="hpi-grid">
            <div className="hpi-copy">
              {/* The reach. */}
              <div className="hpi-hero">
                <div className="hpi-hero-head">
                  <p className="hpi-stat">
                    <span className="hpi-stat-value">
                      {HP_INTRO.interviews.value}
                    </span>{" "}
                    <span className="hpi-stat-label">
                      <Marked text={HP_INTRO.interviews.label} />
                    </span>
                  </p>
                  <InterviewFaces label={HP_INTRO.facesLabel} />
                </div>
              </div>

              {/* The slide, straight under the reach: pinned while the
               * window rides through its lines (the empty .hpi-ride under it
               * is the length of the ride). */}
              <div className="hpi-pin" ref={pin}>
                {/* Where a line's fragment lands on a wide screen, each at
                 * its line's place on the ride (landingTop): the lines are
                 * pinned, so their own boxes are no place to land. On a
                 * narrow screen each line carries its own marker. */}
                {!narrow && (
                  <div className="hpi-landing" aria-hidden>
                    {USES.map((use, i) => (
                      <span
                        key={use.anchor}
                        id={use.anchor}
                        style={{ top: landingTop(i, false) }}
                      />
                    ))}
                  </div>
                )}
                <div className="hpi-slide" ref={slide}>
                  <p className="hpi-lede hpi-uses-lead">
                    <Copy text={HP_INTRO.usesLead} />
                  </p>
                  <div className="hpi-uses-wrap">
                    <div
                      className={`hpi-mark${active >= 0 ? " is-on" : ""}`}
                      ref={mark}
                      aria-hidden
                    />
                    <ul className="hpi-uses">
                      {USES.map((use, i) => (
                        <li
                          key={use.text}
                          className={`hpi-use${active === i ? " is-on" : ""}`}
                          ref={(el) => void (lines.current[i] = el)}
                          onClick={onLine(i)}
                        >
                          {narrow && (
                            <span
                              className="hpi-landing"
                              id={use.anchor}
                              style={{ top: landingTop(i, true) }}
                              aria-hidden
                            />
                          )}
                          {/* The line's own control, for a keyboard: shows
                              its picture, and is the line's permalink. The
                              arrow is drawn, the shaft and head of the
                              wiki's link arrows, so it never falls back to
                              another face's glyph. */}
                          <Link
                            to={{ hash: use.anchor }}
                            className="hpi-pick"
                            aria-current={active === i ? "location" : undefined}
                            aria-label={`Show the figure for: ${plain(use.text)}`}
                            onClick={onArrow(i)}
                          >
                            <svg
                              className="hpi-arrow"
                              viewBox="0 0 16 16"
                              aria-hidden
                            >
                              <path d="M 2 8 H 13 M 8.5 3.5 L 13 8 L 8.5 12.5" />
                            </svg>
                          </Link>
                          <span>
                            <Copy text={use.text} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="hpi-ride" aria-hidden />
              </div>
            </div>

            <div className="hpi-side">
              {/* The survey's count, level with the interviews', and
               * scrolling away with them while the map under it holds. */}
              <p className="hpi-stat">
                <span className="hpi-stat-value">{HP_INTRO.survey.value}</span>{" "}
                <span className="hpi-stat-label">
                  <Marked text={HP_INTRO.survey.label} />
                </span>
              </p>

              <div className="hpi-figure" ref={figure}>
                <div className="hpi-mapbox" ref={mapBox}>
                  <div className="hpi-fly" ref={fly}>
                    <IntroMap
                      state={state}
                      year={year}
                      dots={survey.dots}
                      firsts={spread.years}
                    />
                  </div>
                  <p className={`hpi-year${on("spread")}`} aria-hidden>
                    {year}
                  </p>
                </div>

                {/* Under the map: where the survey reached, then the
                 * warming chart, each with its TODO while its data is a
                 * stand-in. The survey's words stay readable to a screen
                 * reader in every state; the chart's part, which holds a
                 * link, is taken out of reach while unseen. */}
                <div className="hpi-slot hpi-foot">
                  <div className={`hpi-foot-survey${on("survey")}`}>
                    <p className="hpi-where">
                      <Marked text={HP_INTRO.surveyWhere} />
                    </p>
                    {survey.placeholder && (
                      <Todo text={HP_INTRO.todos.survey} />
                    )}
                  </div>
                  <div className={`hpi-foot-regions${on("regions")}`}>
                    <div className="hpi-cases">
                      {CASE_STUDIES.map((c) => (
                        <Link key={c.to} to={c.to} className="hpi-case">
                          <span className="hpi-case-name">
                            {c.name}
                            <svg
                              className="hpi-case-arrow"
                              viewBox="0 0 16 16"
                              aria-hidden
                            >
                              <path d="M 2 8 H 13 M 8.5 3.5 L 13 8 L 8.5 12.5" />
                            </svg>
                          </span>
                          <span className="hpi-case-text">
                            <MarkedInline text={c.summary} />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className={`hpi-foot-spread${on("spread")}`}>
                    <p className="hpi-chart-title">
                      <Marked text={HP_INTRO.temperatureTitle} />
                    </p>
                    <WarmingChart year={year} />
                    <p className="hpi-chart-source">
                      Data:{" "}
                      <a
                        href={TEMPERATURE_SOURCE.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {TEMPERATURE_SOURCE.label}
                      </a>
                    </p>
                    {spread.placeholder && (
                      <Todo text={HP_INTRO.todos.spread} />
                    )}
                  </div>
                </div>

                {/* The framework's line shows the hive in place of the map. */}
                <div className={`hpi-hive${on("hive")}`}>{hive}</div>

                {/* On to the questions: at the window's bottom right while
                 * the slide is up, and under the map, larger, once the last
                 * line is, just before the map grows into the stakeholder
                 * map. */}
                <Link
                  to={{ hash: MAP_ANCHOR }}
                  className="hpi-continue"
                  onClick={toQuestions}
                >
                  <span className="hpi-continue-label">
                    <Marked text={HP_INTRO.continueLabel} />
                  </span>
                  <svg
                    className="hpi-continue-arrow"
                    viewBox="0 0 16 16"
                    aria-hidden
                  >
                    <path d="M 8 2 V 13 M 3.5 8.5 L 8 13 L 12.5 8.5" />
                  </svg>
                </Link>
                {frameworkWindow}
              </div>
            </div>
          </div>
        </section>
      )}
    </HiveFramework>
  );
}
