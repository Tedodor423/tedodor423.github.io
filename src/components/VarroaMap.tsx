import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HEXES, HEX_R, hexPoints } from "../utils/worldHexes";
import { HEX_COUNTRY, cellKey } from "../utils/hexCountries";
import {
  CAVEATS,
  LOSS_COUNTRIES,
  NOTES,
  SOURCES,
  YEARS,
  categoryOf,
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
 * trusting a cell: the source drawing is stylised, fifty countries in the
 * dataset are smaller than a cell and never appear, and Iceland is not drawn
 * at all.
 *
 * WHAT IT SHOWS. Reported colony loss, not the arrival of the mite. The
 * distinction matters enough that it is stated on the page, in the data file,
 * and again here: a country lights up in the year its survey starts, which for
 * most of Europe is 2008 and has nothing to do with when varroa reached it.
 * Australia is the exception, and the only place where the animation happens
 * to show an arrival.
 *
 * WHY A PANEL AND NOT A TOOLTIP. The detail for a country runs to a sparkline,
 * a provenance line and up to three notes. That does not fit in a tooltip that
 * follows a cursor, and the wiki rules forbid putting a number or a citation
 * somewhere only a mouse can reach. So hovering fills a panel that stays
 * filled, five buttons reach the countries this wiki argues from without a
 * mouse, and the table at the bottom carries every country the dataset has,
 * including the fifty that are too small to draw.
 */

/** Viewport of the lattice, as the stakeholder map crops it. */
const VIEW = { x: 12, y: 1, w: 1808, h: 729 };

/** Milliseconds per year while the animation is running. */
const STEP_MS = 850;

/** How long the animation waits after the reader stops interacting. */
const RESUME_MS = 2600;

/** The countries this wiki argues from, reachable without a pointer. */
const FEATURED = [
  "United States of America",
  "California",
  "United Kingdom",
  "Australia",
  "New Zealand",
] as const;

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
  const map = new Map<string, typeof HEXES>();
  for (const hex of HEXES) {
    const name = HEX_COUNTRY.get(cellKey(hex.col, hex.row));
    if (!name) continue;
    const list = map.get(name) ?? [];
    list.push(hex);
    map.set(name, list);
  }
  return map;
})();

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
function Detail({ name, year }: { name: string | null; year: number }) {
  if (!name) {
    return (
      <div className="vm-detail vm-detail--empty">
        <p>
          Point at a country, or pick one below the map. The panel keeps what you
          last looked at, so you can then run the years past it.
        </p>
      </div>
    );
  }

  const status = statusAt(name, year);
  const value = lossAt(name, year);
  const listed = LOSS_COUNTRIES.includes(name);
  const provenance = listed ? provenanceOf(name) : null;
  const notes = NOTES[name];

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

export function VarroaMap() {
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

  const onPointer = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const name = (event.target as SVGElement).dataset?.country;
      if (name && name !== active) {
        setActive(name);
        hold(true);
      }
    },
    [active, hold],
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
      LOSS_COUNTRIES.map((name) => {
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
    [year],
  );

  return (
    <figure className="varroa-map">
      <h3 className="vm-heading">Reported honey-bee colony losses, 2008 to 2025</h3>
      <p className="vm-standfirst">
        Each hexagon is about 4.7 degrees of the world, shaded by the share of
        managed colonies its country reported losing that year. This is loss,
        not the spread of the mite: a country appears when its survey starts,
        and for most of Europe that is 2008. Australia is the exception, where
        the first detection in June 2022 and the first survey are a year apart.
      </p>

      <div className="vm-layout">
        <div className="vm-canvas">
          <svg
            className="vm-svg"
            viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
            role="img"
            aria-label={`World map of reported honey-bee colony losses in ${year}. The same figures are in the table below.`}
            onPointerMove={onPointer}
            onPointerLeave={() => hold(true)}
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

            {/* The active country, drawn UNDER the map as one ink halo.
                Enlarging each of its cells past the lattice pitch makes them
                overlap, so the cells painted on top leave only the outside
                edge showing. Outlining each cell instead reads as 39 outlined
                hexagons rather than as one country, which is what Australia
                looked like before this. */}
            {activeCells?.map((hex) => (
              <polygon
                key={`halo-${hex.col}.${hex.row}`}
                className="vm-halo"
                points={hexPoints(hex.x, hex.y, HEX_R + 5)}
              />
            ))}

            {HEXES.map((hex) => {
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
            })}

          </svg>

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

          <ul className="vm-legend">
            {LEGEND.map((status) => (
              <li key={status}>
                <span className={`vm-swatch vm-cell--${status}`} aria-hidden="true" />
                {STATUS_LABEL[status]}
              </li>
            ))}
          </ul>

          {/* Under the legend rather than below the figure, because the panel
              beside the map is the taller column and this is what fills the
              space it leaves. */}
          <p className="vm-howto">
            <strong>How to read it.</strong> Darker is a heavier reported loss.
            The two hatched states are not points on that scale: one is a
            country where varroa is present and tolerated, the other is a
            country with no varroa on record. Plain wax is a country whose
            survey has not started in the year shown, or which the dataset does
            not carry at all.
          </p>
        </div>

        <aside className="vm-side">
          <div className="vm-picks">
            {FEATURED.map((name) => (
              <button
                key={name}
                type="button"
                className={`vm-pick${active === name ? " is-on" : ""}`}
                aria-pressed={active === name}
                onClick={() => {
                  setActive(name);
                  hold(true);
                }}
              >
                {SHORT[name] ?? name}
              </button>
            ))}
          </div>
          <Detail name={active} year={year} />
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
              <div key={name}>
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

        <details className="vm-limits">
          <summary>What this map cannot show</summary>
          <ul>
            {CAVEATS.map((caveat) => (
              <li key={caveat}>
                <Marked text={caveat} />
              </li>
            ))}
            <li>
              A hexagon spans about 4.7 degrees, so 50 countries in the dataset
              are smaller than one cell and are not drawn at all. Belgium,
              Switzerland, Denmark, Slovakia, Latvia and Israel are among them.
              Every one of them is in the table below. Iceland is missing for a
              different reason: the source drawing does not include it.
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
            <span key={source.url}>
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
