import { useId, useState } from "react";
import {
  CONCENTRATIONS,
  CYCLE3,
  YEAST_PER_DAY,
  type Cycle3Cell,
  type Regimen,
} from "../data/beehave";
import {
  KEPT_BANDS,
  PROFILE_NAME,
  REGIMENS,
  REGIMEN_META,
  fmtFate,
  fmtInt,
  fmtKg,
  fmtLevel,
  fmtPct,
  keptBand,
  type ProfileKey,
} from "../utils/beehave";
import "./BeehaveFigures.css";

/* Cycle 3 of the ecological model: dsRNA concentration crossed with yeast
 * supplied, 30 runs per regimen per profile.
 *
 * Each heat map is a real <table>: rows are yeast per day, columns are mg of
 * dsRNA per g of yeast, and every cell prints its value, so the figure is its
 * own table view and colour is never the only way to read it. A cell is
 * coloured by the share of an uninfested hive's five-year honey the run kept,
 * and hatched if the colony collapsed inside the five years. California takes
 * no honey, so its cells print the year of collapse instead.
 *
 * The slider is the titre the wet lab can reach, the number this cycle exists
 * to ask for. It marks that column on all three maps and reads off, for each
 * regimen, the least yeast at which the colony survives and keeps 90% of its
 * honey. "Least" means the smallest of the five amounts tested; the runs are
 * single seeds, so a column is not guaranteed to be monotone, and the readout
 * reports the first amount that works rather than assuming every larger one
 * does.
 *
 * Australian commercial opens first because it is the profile the write-up
 * draws. The Australian amateur runs are left out; see the head of
 * src/data/beehave.ts.
 */

const PROFILES: ProfileKey[] = ["auc", "nd", "ca"];

export function BeehaveHeatmaps() {
  const sliderId = useId();
  const [profile, setProfile] = useState<ProfileKey>("auc");
  const [conc, setConc] = useState(2);
  const [inspect, setInspect] = useState<{
    reg: Regimen;
    y: number;
    c: number;
  } | null>(null);

  const data = CYCLE3[profile];
  const ref = data.honeyRef;
  const concLabels = CONCENTRATIONS.map(fmtLevel);

  return (
    <figure className="beehave-fig">
      <p className="bh-title">
        dsRNA concentration against yeast supplied, cycle 3
      </p>

      <div className="bh-controls">
        <div className="bh-picks" role="group" aria-label="Hive profile">
          {PROFILES.map((p) => (
            <button
              key={p}
              type="button"
              className={p === profile ? "bh-pick is-on" : "bh-pick"}
              aria-pressed={p === profile}
              onClick={() => setProfile(p)}
            >
              {PROFILE_NAME[p]}
            </button>
          ))}
        </div>

        <div className="bh-slider">
          <label htmlFor={sliderId}>
            dsRNA in the yeast{" "}
            <output className="bh-slider-value">
              {fmtLevel(CONCENTRATIONS[conc])}
            </output>{" "}
            mg/g
          </label>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={CONCENTRATIONS.length - 1}
            step={1}
            value={conc}
            aria-valuetext={`${fmtLevel(CONCENTRATIONS[conc])} mg dsRNA per g yeast`}
            onChange={(e) => setConc(Number(e.target.value))}
          />
          <div className="bh-slider-ticks" aria-hidden="true">
            {concLabels.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      <ul className="bh-legend">
        {ref !== null ? (
          <>
            <li className="bh-muted">Honey kept over five years:</li>
            {KEPT_BANDS.map(({ band, label }) => (
              <li key={band}>
                <span className={`bh-swatch bh-kept-${band}`} />
                {label}
              </li>
            ))}
          </>
        ) : (
          <>
            <li>
              <span className="bh-swatch bh-kept-5" />
              Survived all five years
            </li>
            <li>
              <span className="bh-swatch bh-kept-1" />
              Collapsed (cell gives the year)
            </li>
          </>
        )}
        <li>
          <span className="bh-swatch bh-kept-4 bh-hatched" />
          Colony collapsed within five years
        </li>
      </ul>

      <div className="bh-maps" onPointerLeave={() => setInspect(null)}>
        {REGIMENS.map((reg) => (
          <HeatTable
            key={reg}
            reg={reg}
            cells={data.grid[reg].cells}
            untreated={data.grid[reg].untreated}
            honeyRef={ref}
            conc={conc}
            onInspect={(y, c) => setInspect({ reg, y, c })}
          />
        ))}
      </div>

      <p className="bh-inspect" aria-hidden="true">
        {inspect
          ? describe(profile, inspect.reg, inspect.y, inspect.c)
          : "Point at a cell for its run."}
      </p>

      <ul className="bh-readout" aria-live="polite">
        {REGIMENS.map((reg) => (
          <li key={reg}>
            <span
              className="bh-key"
              style={{ background: REGIMEN_META[reg].color }}
            />
            <strong>{REGIMEN_META[reg].name}</strong> at{" "}
            {fmtLevel(CONCENTRATIONS[conc])} mg/g:{" "}
            {readout(data.grid[reg].cells, conc, ref)}
          </li>
        ))}
      </ul>

      <figcaption className="bh-caption">
        <p>
          BEEHAVE runs for the {PROFILE_NAME[profile]} profile at a starting VIL
          of 10%, five simulated years: six dsRNA concentrations crossed with
          five amounts of treatment yeast per day, on each regimen.
          {ref !== null
            ? ` Cells give the honey harvested over the run as a share of the same hive with no mites (${fmtKg(ref)}).`
            : " This profile harvests no honey, so cells give the year the colony collapsed."}{" "}
          Modelled.
        </p>
        <Cycle3Table profile={profile} />
      </figcaption>
    </figure>
  );
}

function HeatTable({
  reg,
  cells,
  untreated,
  honeyRef,
  conc,
  onInspect,
}: {
  reg: Regimen;
  cells: Cycle3Cell[][];
  untreated: Cycle3Cell;
  honeyRef: number | null;
  conc: number;
  onInspect: (y: number, c: number) => void;
}) {
  const meta = REGIMEN_META[reg];
  return (
    <div className="bh-map">
      <table className="bh-heat">
        <caption>
          <span className="bh-key" style={{ background: meta.color }} />
          <strong>{meta.name}</strong>{" "}
          <span className="bh-muted">({meta.window})</span>
          <span className="bh-untreated">
            Untreated:{" "}
            {honeyRef !== null
              ? `${fmtPct(untreated.honey / honeyRef)} of honey, `
              : ""}
            {fmtFate(untreated.collapseYear)}
          </span>
        </caption>
        <thead>
          <tr>
            <th scope="col" className="bh-corner">
              <span>yeast/day</span>
              <span>mg/g</span>
            </th>
            {CONCENTRATIONS.map((c, ci) => (
              <th
                key={c}
                scope="col"
                className={ci === conc ? "is-col is-col-top" : undefined}
              >
                {fmtLevel(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cells.map((row, yi) => (
            <tr key={YEAST_PER_DAY[yi]}>
              <th scope="row">{fmtInt(YEAST_PER_DAY[yi])}</th>
              {row.map((cell, ci) => {
                const collapsed = cell.collapseYear !== null;
                const band =
                  honeyRef !== null
                    ? keptBand(cell.honey / honeyRef)
                    : collapsed
                      ? 1
                      : 5;
                const classes = [
                  "bh-cell",
                  `bh-kept-${band}`,
                  collapsed ? "bh-hatched" : "",
                  ci === conc ? "is-col" : "",
                  ci === conc && yi === cells.length - 1 ? "is-col-bottom" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <td
                    key={ci}
                    className={classes}
                    onPointerEnter={() => onInspect(yi, ci)}
                  >
                    {honeyRef !== null
                      ? Math.round((cell.honey / honeyRef) * 100)
                      : collapsed
                        ? `yr ${cell.collapseYear}`
                        : "none"}
                    {collapsed && (
                      <span className="visually-hidden">
                        , collapsed in year {cell.collapseYear}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function readout(
  cells: Cycle3Cell[][],
  conc: number,
  ref: number | null,
): string {
  const column = cells.map((row) => row[conc]);
  const survives = column.findIndex((cell) => cell.collapseYear === null);
  const keeps =
    ref === null
      ? -1
      : column.findIndex(
          (cell) => cell.collapseYear === null && cell.honey / ref >= 0.9,
        );
  const at = (i: number) => `${fmtInt(YEAST_PER_DAY[i])} yeast/day`;
  if (survives < 0)
    return "the colony collapses at every amount of yeast tested.";
  const first = `the colony survives from ${at(survives)}`;
  if (ref === null) return `${first}.`;
  if (keeps < 0) return `${first}, and never keeps 90% of its honey.`;
  return keeps === survives
    ? `${first}, keeping 90% of its honey or more.`
    : `${first}, and keeps 90% of its honey from ${at(keeps)}.`;
}

function describe(
  profile: ProfileKey,
  reg: Regimen,
  y: number,
  c: number,
): string {
  const data = CYCLE3[profile];
  const cell = data.grid[reg].cells[y][c];
  const ref = data.honeyRef;
  const honey =
    ref !== null
      ? `${fmtKg(cell.honey)} of honey (${fmtPct(cell.honey / ref)} of uninfested), `
      : "";
  return `${REGIMEN_META[reg].name}, ${fmtInt(YEAST_PER_DAY[y])} yeast/day at ${fmtLevel(CONCENTRATIONS[c])} mg/g: ${honey}${fmtFate(cell.collapseYear)}, ${fmtInt(cell.mites)} mites at the end.`;
}

function Cycle3Table({ profile }: { profile: ProfileKey }) {
  const data = CYCLE3[profile];
  const ref = data.honeyRef;
  return (
    <details className="bh-table-wrap">
      <summary>Every run, with honey in kg and mites</summary>
      <table className="bh-table">
        <caption>
          {PROFILE_NAME[profile]}, cycle 3. Yeast per day as recorded in the
          model.
        </caption>
        <thead>
          <tr>
            <th scope="col">Regimen</th>
            <th scope="col" className="bh-num">
              Yeast/day
            </th>
            <th scope="col" className="bh-num">
              dsRNA (mg/g)
            </th>
            {ref !== null && (
              <th scope="col" className="bh-num">
                Honey (kg)
              </th>
            )}
            {ref !== null && (
              <th scope="col" className="bh-num">
                Share of uninfested
              </th>
            )}
            <th scope="col">Outcome</th>
            <th scope="col" className="bh-num">
              Mites at the end
            </th>
          </tr>
        </thead>
        <tbody>
          {REGIMENS.flatMap((reg) => {
            const g = data.grid[reg];
            const rows: { y: string; c: string; cell: Cycle3Cell }[] = [
              { y: "0", c: "0", cell: g.untreated },
              ...g.cells.flatMap((row, yi) =>
                row.map((cell, ci) => ({
                  y: fmtInt(YEAST_PER_DAY[yi]),
                  c: fmtLevel(CONCENTRATIONS[ci]),
                  cell,
                })),
              ),
            ];
            return rows.map(({ y, c, cell }) => (
              <tr key={`${reg}-${y}-${c}`}>
                <th scope="row">{REGIMEN_META[reg].name}</th>
                <td className="bh-num">{y}</td>
                <td className="bh-num">{c}</td>
                {ref !== null && (
                  <td className="bh-num">{cell.honey.toFixed(1)}</td>
                )}
                {ref !== null && (
                  <td className="bh-num">{fmtPct(cell.honey / ref)}</td>
                )}
                <td>{fmtFate(cell.collapseYear)}</td>
                <td className="bh-num">{fmtInt(cell.mites)}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </details>
  );
}
