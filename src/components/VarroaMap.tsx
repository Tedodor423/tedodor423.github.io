import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { HEXES, HEX_R, hexPoints, type Hex } from "../utils/worldHexes";
import { HEX_COUNTRY, cellKey } from "../utils/hexCountries";
import {
  CAVEATS,
  COLONY_LOSSES,
  FEATURED,
  FEATURED_CONTEXT,
  LOSS_COUNTRIES,
  NOTES,
  SOURCES,
  YEARS,
  categoryOf,
  countryAnchor,
  lossAt,
  metricOf,
  provenanceOf,
  statusAt,
  type Status,
} from "../data/varroa";
import { Marked } from "./Marked";
import "./VarroaMap.css";

/* Colony losses on the hexagon world map, year by year.
 *
 * It reuses the lattice the stakeholder map is drawn from, so the two maps on
 * this wiki are the same map. What is new is identity: worldHexes.ts knows
 * where its cells are but not what they are, and hexCountries.ts adds the
 * country behind each one. Read the note at the top of that file before
 * trusting a cell: the drawing is stylised, each cell takes the country that
 * holds most of its land, and 47 countries in the dataset are smaller than a
 * cell and never appear.
 *
 * WHAT IT SHOWS. Reported colony loss, not the arrival of the mite. The
 * distinction matters enough that it is stated on the page, in the data file,
 * and again here: a country lights up in the year its survey starts, which for
 * most of Europe is 2008 and has nothing to do with when varroa reached it.
 * Australia is the exception, and the only place where the animation happens
 * to show an arrival.
 *
 * TWO FORMS. The case-studies page gets the full figure: every country answers
 * to the pointer, and the caption underneath carries the five featured
 * countries written out, the caveats, the table of every country in the
 * dataset and the sources. The home page gets the "slide" form, which is the
 * map and nothing else: it fills the window, only the five countries this wiki
 * argues from can be pressed, and the panel is a column beside the map
 * carrying each one's notes, caveats and sources, with a line pointing at the
 * full record. Both forms are this one component, so the map can never
 * disagree with itself.
 *
 * WHY A PANEL AND NOT A TOOLTIP. The detail for a country runs to a sparkline,
 * a provenance line and up to three notes. That does not fit in a tooltip that
 * follows a cursor, and the wiki rules forbid putting a number or a citation
 * somewhere only a mouse can reach. So the panel stays filled, five buttons
 * reach the featured countries without a mouse, and on the case-studies page
 * the table at the bottom carries every country the dataset has, including
 * the fifty that are too small to draw.
 */

/** The two forms the figure takes. See the note above. */
export type VarroaMapVariant = "full" | "slide";

/** Viewport of the lattice: the drawn cells plus a hair of margin. */
const VIEW = { x: 12, y: 1, w: 1812, h: 729 };

/** Milliseconds per year while the animation is running. */
const STEP_MS = 850;

/** How long the animation waits after the reader stops interacting. */
const RESUME_MS = 2600;

/* The countries this wiki argues from, reachable without a pointer, are
 * FEATURED in src/data/varroa.ts, where the search index reads them too. */
const FEATURED_SET = new Set<string>(FEATURED);

const SHORT: Record<string, string> = {
  "United States of America": "USA",
  "United Kingdom": "UK",
};

const STATUS_LABEL: Record<Status, string> = {
  low: "Low, under 8%",
  moderate: "Moderate, 8 to 15%",
  high: "High, 15 to 25%",
  severe: "Severe, 25 to 40%",
  catastrophic: "Catastrophic, 40% and over",
  no_economic_damage: "Present, no economic damage",
  varroa_free: "No varroa recorded",
  no_survey: "No survey yet",
  no_data: "Not in the dataset",
};

/** The legend, in the order it reads: the scale, then the states off it. */
const LEGEND: Status[] = [
  "low",
  "moderate",
  "high",
  "severe",
  "catastrophic",
  "no_economic_damage",
  "varroa_free",
  "no_survey",
];

/** Cells grouped by country, so the active country can be outlined as one. */
const CELLS_BY_COUNTRY = (() => {
  const map = new Map<string, Hex[]>();
  for (const hex of HEXES) {
    const name = HEX_COUNTRY.get(cellKey(hex.col, hex.row));
    if (!name) continue;
    const list = map.get(name) ?? [];
    list.push(hex);
    map.set(name, list);
  }
  return map;
})();

/** The featured countries' cells, and every other cell, split once for the slide form. */
const FEATURED_CELLS = FEATURED.map((name) => ({
  name,
  cells: CELLS_BY_COUNTRY.get(name) ?? [],
}));
const OTHER_HEXES = HEXES.filter(
  (hex) => !FEATURED_SET.has(HEX_COUNTRY.get(cellKey(hex.col, hex.row)) ?? ""),
);

const SOURCE_BY_ID = new Map(SOURCES.map((source) => [source.id, source]));

/** One line of the country's series, with the current year marked. */
function Sparkline({ name, year }: { name: string; year: number }) {
  const points = YEARS.map((y) => ({ y, value: lossAt(name, y) })).filter(
    (p): p is { y: number; value: number } => p.value !== null,
  );
  if (points.length < 2) return null;

  const W = 260;
  const H = 54;
  const top = Math.max(10, Math.ceil(Math.max(...points.map((p) => p.value)) / 10) * 10);
  const x = (y: number) =>
    ((y - YEARS[0]) / (YEARS[YEARS.length - 1] - YEARS[0])) * (W - 4) + 2;
  const yOf = (v: number) => H - 6 - (v / top) * (H - 12);
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(p.y).toFixed(1)},${yOf(p.value).toFixed(1)}`).join("");
  const here = points.find((p) => p.y === year);

  return (
    <svg
      className="vm-spark"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${name}, reported loss from ${points[0].y} to ${points[points.length - 1].y}, peaking at ${Math.max(...points.map((p) => p.value))}%`}
    >
      <line className="vm-spark-base" x1="2" y1={H - 6} x2={W - 2} y2={H - 6} />
      <path className="vm-spark-line" d={path} />
      {here && <circle className="vm-spark-dot" cx={x(here.y)} cy={yOf(here.value)} r="4.5" />}
      <text className="vm-spark-top" x="2" y="10">
        {top}%
      </text>
    </svg>
  );
}

/** Everything the dataset holds about one country, in the side panel. */
function Detail({
  name,
  year,
  variant,
}: {
  name: string | null;
  year: number;
  variant: VarroaMapVariant;
}) {
  if (!name) {
    return (
      <div className="vm-detail vm-detail--empty">
        {variant === "slide" ? (
          <p>
            Five countries are outlined: the ones this wiki argues from. Press
            one, or pick it above. The panel keeps what you chose while the
            years run past it.
          </p>
        ) : (
          <p>
            Point at a country, or pick one below the map. The panel keeps what you
            last looked at, so you can then run the years past it.
          </p>
        )}
      </div>
    );
  }

  const status = statusAt(name, year);
  const value = lossAt(name, year);
  const listed = LOSS_COUNTRIES.includes(name);
  const provenance = listed ? provenanceOf(name) : null;
  const notes = NOTES[name];
  // The caveats and sources the caption under the full map carries, for the
  // featured countries; the slide form has no caption, so they are here.
  const context = FEATURED_CONTEXT[name];

  return (
    <div className="vm-detail">
      <h4 className="vm-detail-name">
        <Marked text={name} />
      </h4>

      <p className={`vm-reading vm-reading--${status}`}>
        {value !== null ? (
          <>
            <span className="vm-reading-value">{value.toFixed(1)}%</span>
            <span className="vm-reading-what">
              of colonies lost, {year}
            </span>
          </>
        ) : (
          <span className="vm-reading-what">{STATUS_LABEL[status]}</span>
        )}
      </p>

      {value !== null && <p className="vm-metric">{metricOf(name)}</p>}
      {value !== null && <Sparkline name={name} year={year} />}

      {notes && (
        <ul className="vm-notes">
          {notes.map((note) => (
            <li key={note}>
              <Marked text={note} />
            </li>
          ))}
        </ul>
      )}

      {provenance && (
        <p className="vm-provenance">
          <span className={`vm-tag vm-tag--${provenance.tag}`}>{provenance.tag}</span>{" "}
          <Marked text={provenance.text} />
        </p>
      )}

      {context && context.caveats.length > 0 && (
        <ul className="vm-caveats">
          {context.caveats.map((caveat) => (
            <li key={caveat}>
              <Marked text={caveat} />
            </li>
          ))}
        </ul>
      )}

      {context && (
        <p className="vm-cite">
          {context.sources.length > 1 ? "Sources: " : "Source: "}
          {context.sources.map((id, i) => {
            const source = SOURCE_BY_ID.get(id);
            if (!source) return null;
            return (
              <span key={id}>
                {i > 0 && "; "}
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.ref}
                </a>
              </span>
            );
          })}
        </p>
      )}

      {!listed && status === "no_economic_damage" && (
        <p className="vm-provenance">
          <span className="vm-tag vm-tag--LIT">LIT</span> Within the native range
          of <i>Apis cerana</i>, or worked with African <i>Apis mellifera</i>
          subspecies. Varroa is present and tolerated, and no treatment economy
          has formed around it.
        </p>
      )}
      {!listed && status === "varroa_free" && (
        <p className="vm-provenance">
          <span className="vm-tag vm-tag--LIT">LIT</span> No confirmed{" "}
          <i>Varroa destructor</i> records.
        </p>
      )}
      {!listed && status === "no_data" && (
        <p className="vm-provenance">
          <span className="vm-tag vm-tag--FLAG">FLAG</span> Not in the dataset.
          Absence here means nobody compiled a figure, not that losses are low.
        </p>
      )}
    </div>
  );
}

export function VarroaMap({ variant = "full" }: { variant?: VarroaMapVariant }) {
  const slide = variant === "slide";
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [running, setRunning] = useState(true);
  const idle = useRef<number | undefined>(undefined);
  const year = YEARS[index];

  // A reader who has asked for less motion gets the map at its last year,
  // fully drawn, and the slider to move it themselves.
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true,
  );
  useEffect(() => {
    if (reduced) {
      setRunning(false);
      setIndex(YEARS.length - 1);
    }
  }, [reduced]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % YEARS.length),
      STEP_MS,
    );
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => () => window.clearTimeout(idle.current), []);

  /* Touching the map or the slider stops the clock; letting go starts it
   * again after a pause, so the animation is never fighting the reader for
   * the year they are looking at. It stays stopped if they used the button,
   * which is the one interaction that means "stopped" rather than "busy". */
  const hold = useCallback(
    (resume: boolean) => {
      window.clearTimeout(idle.current);
      setRunning(false);
      if (resume && !reduced) {
        idle.current = window.setTimeout(() => setRunning(true), RESUME_MS);
      }
    },
    [reduced],
  );

  /** Put a country in the panel. The picks, and the slide's pressable countries. */
  const select = useCallback(
    (name: string) => {
      setActive(name);
      hold(true);
    },
    [hold],
  );

  /* A search result for a featured country (src/utils/search.ts) opens the
   * page on that country's entry in the caption. The panel shows the same
   * country, its caveats and sources included, so everything the result
   * matched is on screen rather than behind a pick. */
  const { hash } = useLocation();
  useEffect(() => {
    const named = FEATURED.find((name) => hash === `#${countryAnchor(name)}`);
    if (named) select(named);
  }, [hash, select]);

  /* The full form: whatever is under the pointer fills the panel. */
  const onPointer = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const name = (event.target as SVGElement).dataset?.country;
      if (name && name !== active) select(name);
    },
    [active, select],
  );

  /* Status per country for this year, computed once rather than once per cell:
   * 872 cells share about 120 countries. */
  const paint = useMemo(() => {
    const map = new Map<string, Status>();
    for (const name of CELLS_BY_COUNTRY.keys()) map.set(name, statusAt(name, year));
    return map;
  }, [year]);

  const activeCells = active ? CELLS_BY_COUNTRY.get(active) : undefined;

  const rows = useMemo(
    () =>
      slide
        ? []
        : LOSS_COUNTRIES.map((name) => {
            const value = lossAt(name, year);
            return {
              name,
              value,
              status: statusAt(name, year),
              provenance: provenanceOf(name),
              metric: metricOf(name),
              onMap: CELLS_BY_COUNTRY.has(name),
            };
          }).sort((a, b) => (b.value ?? -1) - (a.value ?? -1) || a.name.localeCompare(b.name)),
    [slide, year],
  );

  const cell = (hex: Hex): ReactNode => {
    const name = HEX_COUNTRY.get(cellKey(hex.col, hex.row));
    const status = name ? (paint.get(name) ?? "no_data") : "no_data";
    return (
      <polygon
        key={`${hex.col}.${hex.row}`}
        className={`vm-cell vm-cell--${status}`}
        points={hexPoints(hex.x, hex.y)}
        data-country={name}
      />
    );
  };

  /* The halo under a country, drawn before its cells. Enlarging each cell
   * past the lattice pitch makes them overlap, so the cells painted on top
   * leave only the outside edge showing: one outline round the country.
   * Outlining each cell instead reads as 39 outlined hexagons rather than as
   * one country, which is what Australia looked like before this. */
  const halo = (hex: Hex): ReactNode => (
    <polygon
      key={`halo-${hex.col}.${hex.row}`}
      className="vm-halo"
      points={hexPoints(hex.x, hex.y, HEX_R + 5)}
    />
  );

  /** What a screen reader hears for a pressable country, this year. */
  const labelOf = (name: string): string => {
    const value = lossAt(name, year);
    return value !== null
      ? `${name}: ${value.toFixed(1)}% of colonies lost in ${year}`
      : `${name}: ${STATUS_LABEL[statusAt(name, year)]}`;
  };

  const svg = (
    <svg
      className="vm-svg"
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
      role={slide ? "group" : "img"}
      aria-label={
        slide
          ? `World map of reported honey-bee colony losses in ${year}. Five countries can be pressed for their detail.`
          : `World map of reported honey-bee colony losses in ${year}. The same figures are in the table below.`
      }
      onPointerMove={slide ? undefined : onPointer}
      onPointerLeave={slide ? undefined : () => hold(true)}
    >
      <defs>
        {/* The two states that are not a loss percentage are hatched as
            well as tinted, so they can never be misread as a point on
            the scale by a reader who sees the hues differently. */}
        <pattern id="vm-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="var(--vm-hatch-bg)" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--vm-hatch-ink)" strokeWidth="2" />
        </pattern>
      </defs>

      {slide ? (
        <>
          {/* The rest of the world is a reading, not a control. */}
          <g aria-hidden="true">{OTHER_HEXES.map(cell)}</g>

          {/* The five that answer. Each is one button: its halo, in the deep
              wax tone at rest and ink when it is pressed, hovered or focused,
              then its cells. The halo takes pointer events here so the ring
              round a three-cell country is part of the target. Featured
              countries touch only where California sits on the US coast, and
              a halo reaches exactly to its neighbour's edge, never over it. */}
          {FEATURED_CELLS.map(({ name, cells }) => (
            <g
              key={name}
              className={`vm-country${active === name ? " is-on" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={active === name}
              aria-label={labelOf(name)}
              onClick={() => select(name)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  select(name);
                }
              }}
            >
              {cells.map(halo)}
              {cells.map(cell)}
            </g>
          ))}
        </>
      ) : (
        <>
          {activeCells?.map(halo)}
          {HEXES.map(cell)}
        </>
      )}
    </svg>
  );

  const controls = (
    <div className="vm-controls">
      <button
        type="button"
        className="vm-play"
        aria-pressed={running}
        onClick={() => {
          window.clearTimeout(idle.current);
          setRunning((r) => !r);
        }}
      >
        {running ? "Pause" : "Play"}
      </button>

      <label className="vm-slider">
        <span className="visually-hidden">Year</span>
        <input
          type="range"
          min={0}
          max={YEARS.length - 1}
          step={1}
          value={index}
          aria-valuetext={String(year)}
          onChange={(event) => {
            setIndex(Number(event.target.value));
            hold(true);
          }}
          onPointerDown={() => hold(false)}
          onPointerUp={() => hold(true)}
          onKeyDown={() => hold(true)}
        />
      </label>

      <output className="vm-year" aria-live="off">
        {year}
      </output>
    </div>
  );

  const legend = (
    <ul className="vm-legend">
      {LEGEND.map((status) => (
        <li key={status}>
          <span className={`vm-swatch vm-cell--${status}`} aria-hidden="true" />
          {STATUS_LABEL[status]}
        </li>
      ))}
    </ul>
  );

  const picks = (
    <div className="vm-picks">
      {FEATURED.map((name) => (
        <button
          key={name}
          type="button"
          className={`vm-pick${active === name ? " is-on" : ""}`}
          aria-pressed={active === name}
          onClick={() => select(name)}
        >
          {SHORT[name] ?? name}
        </button>
      ))}
    </div>
  );

  if (slide) {
    return (
      <figure
        className="varroa-map varroa-map--slide"
        style={{ "--vm-ratio": VIEW.w / VIEW.h } as CSSProperties}
      >
        {/* The frame is the room the slide leaves for the map; the plate is
            the map and its panel, sized to fit that room. VarroaMap.css lays
            them out; VarroaSlide.css tells the frame how tall the room is. */}
        <div className="vm-frame">
          <div className="vm-plate">
            {svg}
            <aside className="vm-side">
              {picks}
              <Detail name={active} year={year} variant="slide" />
              <p className="vm-full">
                Every country in the dataset, what the map cannot show and the
                sources are on <Link to="/case-studies">case studies</Link>.
              </p>
            </aside>
          </div>
        </div>

        <div className="vm-strip">
          <h3 className="vm-heading">Reported honey-bee colony losses, 2008 to 2025</h3>
          {controls}
          {legend}
          <p className="vm-standfirst">
            Each hexagon is shaded by the share of managed colonies its country
            reported losing that year. This is loss, not the spread of the
            mite: a country appears when its survey starts, and for most of
            Europe that is 2008. The two hatched states are off the scale.
          </p>
        </div>
      </figure>
    );
  }

  return (
    <figure className="varroa-map">
      {/* The figure's words are COLONY_LOSSES in src/data/varroa.ts, so the
          search index reads what the page shows; the ids are where a result
          lands. */}
      <h3 className="vm-heading" id={COLONY_LOSSES.anchor}>
        <Marked text={COLONY_LOSSES.heading} />
      </h3>
      <p className="vm-standfirst">
        <Marked text={COLONY_LOSSES.standfirst} />
      </p>

      <div className="vm-layout">
        <div className="vm-canvas">
          {svg}
          {controls}
          {legend}

          {/* Under the legend rather than below the figure, because the panel
              beside the map is the taller column and this is what fills the
              space it leaves. */}
          <p className="vm-howto">
            <strong>
              <Marked text={COLONY_LOSSES.howto.lead} />
            </strong>{" "}
            <Marked text={COLONY_LOSSES.howto.text} />
          </p>
        </div>

        <aside className="vm-side">
          {picks}
          <Detail name={active} year={year} variant="full" />
        </aside>
      </div>

      <figcaption className="vm-caption">
        {/* The same notes the panel shows, in the page itself. A hover is not
            a place a judge can be asked to look, and two of these are the only
            written record on this wiki of what an interviewee told us. */}
        <h4 className="vm-sub vm-sub--first">The five places this wiki argues from</h4>
        <dl className="vm-featured">
          {FEATURED.map((name) => {
            const provenance = provenanceOf(name);
            return (
              <div key={name} id={countryAnchor(name)}>
                <dt>
                  <Marked text={name} />{" "}
                  <span className="vm-featured-value">
                    {lossAt(name, year)?.toFixed(1) ?? "no survey"}
                    {lossAt(name, year) === null ? "" : `% in ${year}`}
                  </span>
                </dt>
                <dd>
                  {(NOTES[name] ?? []).map((note) => (
                    <p key={note}>
                      <Marked text={note} />
                    </p>
                  ))}
                  <p className="vm-provenance">
                    <span className={`vm-tag vm-tag--${provenance.tag}`}>
                      {provenance.tag}
                    </span>{" "}
                    <Marked text={provenance.text} />
                  </p>
                </dd>
              </div>
            );
          })}
        </dl>

        <details className="vm-limits" id={COLONY_LOSSES.limitsAnchor}>
          <summary>
            <Marked text={COLONY_LOSSES.limits} />
          </summary>
          <ul>
            {CAVEATS.map((caveat) => (
              <li key={caveat}>
                <Marked text={caveat} />
              </li>
            ))}
            <li>
              <Marked text={COLONY_LOSSES.drawn} />
            </li>
          </ul>
        </details>

        <details className="vm-table-wrap">
          <summary>Every country in the dataset, for {year}</summary>
          <table className="vm-table">
            <caption>
              Reported colony loss in {year}. Move the slider and this table
              moves with it. A dash means the survey does not reach that year.
            </caption>
            <thead>
              <tr>
                <th scope="col">Country</th>
                <th scope="col">Loss</th>
                <th scope="col">Band</th>
                <th scope="col">What it measures</th>
                <th scope="col">Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <th scope="row">
                    <Marked text={row.name} />
                    {!row.onMap && (
                      <span className="vm-offmap" title="Smaller than one hexagon, so not drawn on the map">
                        {" "}
                        not on the map
                      </span>
                    )}
                  </th>
                  <td className="vm-num">
                    {row.value === null ? "–" : `${row.value.toFixed(1)}%`}
                  </td>
                  <td>{row.value === null ? "no survey yet" : STATUS_LABEL[categoryOf(row.value)]}</td>
                  <td>{row.metric}</td>
                  <td>
                    <span className={`vm-tag vm-tag--${row.provenance.tag}`}>
                      {row.provenance.tag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="vm-sub">Countries where varroa does no economic damage</h4>
          <p className="vm-plain">
            Within the native range of <i>Apis cerana</i>, or worked with African{" "}
            <i>Apis mellifera</i> subspecies. The mite is present and tolerated,
            and no treatment economy has formed around it. These countries carry
            no loss figure in this dataset.
          </p>
        </details>

        <p className="vm-sources">
          <strong>Sources.</strong>{" "}
          {SOURCES.map((source, i) => (
            <span key={source.id}>
              {i > 0 && " · "}
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.ref}
              </a>
            </span>
          ))}
        </p>
      </figcaption>
    </figure>
  );
}
