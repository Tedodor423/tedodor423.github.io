import { useId, useState } from "react";
import {
  CYCLE2,
  EFFICIENCIES,
  type Cycle2Year,
  type Regimen,
} from "../data/beehave";
import {
  PROFILE_NAME,
  REGIMENS,
  REGIMEN_META,
  fmtFate,
  fmtInt,
  fmtKg,
  fmtLevel,
  fmtPct,
} from "../utils/beehave";
import { BeehaveLineChart, type LineSeries } from "./BeehaveLineChart";
import "./BeehaveFigures.css";

/* Cycle 2 of the ecological model: one treatment-efficiency parameter, swept.
 *
 * The slider is the efficiency. The left chart is the whole sweep at once,
 * with the chosen level marked; the two on the right are the runs at that
 * level, year by year, so the reader can watch a colony that collapses at
 * 0.01 survive at 0.05. North Dakota is the profile the write-up plots;
 * California is the only other profile the data can be trusted to label (see
 * the head of src/data/beehave.ts), and it harvests no honey, so its left
 * chart shows how long the colony lasted instead.
 */

type Profile = "nd" | "ca";
const PROFILES: Profile[] = ["nd", "ca"];
const YEAR_LABELS = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];
const MITE_TICKS = [0, 10, 100, 1000, 10000];

const sum = (rows: Cycle2Year[]) => rows.reduce((t, r) => t + r.honey, 0);
const collapseYear = (rows: Cycle2Year[]) => {
  const last = rows[rows.length - 1];
  return last.collapsed ? rows.length : null;
};
const perYear = (rows: Cycle2Year[], pick: (r: Cycle2Year) => number) =>
  YEAR_LABELS.map((_, i) => (rows[i] ? pick(rows[i]) : null));
const hollowByYear = (rows: Cycle2Year[]) =>
  YEAR_LABELS.map((_, i) => !!rows[i]?.collapsed);
const shortCount = (v: number) => (v >= 1000 ? `${v / 1000}k` : String(v));

export function BeehaveEfficiency() {
  const sliderId = useId();
  const [profile, setProfile] = useState<Profile>("nd");
  const [level, setLevel] = useState(2);

  const data = CYCLE2[profile];
  const uninfested = data.uninfested;
  const reference = uninfested ? sum(uninfested) : null;
  const eff = EFFICIENCIES[level];

  // Left: the whole sweep, one line per regimen.
  const sweep: LineSeries[] = REGIMENS.map((reg) => {
    const runs = data.runs[reg];
    return {
      key: reg,
      name: REGIMEN_META[reg].name,
      color: REGIMEN_META[reg].color,
      values: runs.map((rows) =>
        reference !== null ? sum(rows) / reference : (collapseYear(rows) ?? 5),
      ),
      hollow: runs.map((rows) => collapseYear(rows) !== null),
    };
  });

  // Right: the runs at the chosen level.
  const atLevel = (
    pick: (r: Cycle2Year) => number,
    withReference: boolean,
  ): LineSeries[] => [
    ...(withReference && uninfested
      ? [
          {
            key: "ref",
            name: "No mites",
            color: "",
            values: perYear(uninfested, pick),
            reference: true,
          },
        ]
      : []),
    ...REGIMENS.map((reg) => {
      const rows = data.runs[reg][level];
      return {
        key: reg,
        name: REGIMEN_META[reg].name,
        color: REGIMEN_META[reg].color,
        values: perYear(rows, pick),
        hollow: hollowByYear(rows),
      };
    }),
  ];

  const levelLabels = EFFICIENCIES.map(fmtLevel);

  return (
    <figure className="beehave-fig">
      <p className="bh-title">
        Treatment efficiency against colony outcome, cycle 2
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
            Treatment efficiency{" "}
            <output className="bh-slider-value">{fmtLevel(eff)}</output>
          </label>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={EFFICIENCIES.length - 1}
            step={1}
            value={level}
            aria-valuetext={fmtLevel(eff)}
            onChange={(e) => setLevel(Number(e.target.value))}
          />
          <div className="bh-slider-ticks" aria-hidden="true">
            {levelLabels.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      <Legend withReference={!!uninfested} />

      <div className="bh-panels bh-panels--three">
        <BeehaveLineChart
          title={
            reference !== null
              ? "Five-year honey, share of the same hive with no mites"
              : "Years the colony lasted (5 means it survived the run)"
          }
          ariaLabel={
            reference !== null
              ? `${PROFILE_NAME[profile]}: five-year honey as a share of an uninfested hive, for each treatment efficiency and regimen. Values are in the table below the figure.`
              : `${PROFILE_NAME[profile]}: years each colony lasted, for each treatment efficiency and regimen. Values are in the table below the figure.`
          }
          xLabels={levelLabels}
          xNames={levelLabels.map((l) => `Efficiency ${l}`)}
          xTitle="Treatment efficiency"
          yTicks={
            reference !== null ? [0, 0.25, 0.5, 0.75, 1] : [0, 1, 2, 3, 4, 5]
          }
          yTop={reference !== null ? 1.05 : 5.25}
          yFormat={reference !== null ? (v) => fmtPct(v) : (v) => String(v)}
          series={sweep}
          rule={reference !== null ? { y: 0.9, label: "90%" } : undefined}
          selected={level}
          onPick={setLevel}
          directLabels
        />
        <BeehaveLineChart
          title={`Adult bees at the yearly peak, efficiency ${fmtLevel(eff)}`}
          ariaLabel={`${PROFILE_NAME[profile]}: peak adult bees in each simulated year at treatment efficiency ${fmtLevel(eff)}. Values are in the table below the figure.`}
          xLabels={YEAR_LABELS.map((y) => y.replace("Year ", ""))}
          xNames={YEAR_LABELS}
          xTitle="Simulated year"
          yTicks={[0, 20000, 40000, 60000]}
          yTop={70000}
          yFormat={shortCount}
          valueFormat={fmtInt}
          series={atLevel((r) => r.bees, true)}
        />
        <BeehaveLineChart
          title={`Mites at year end, efficiency ${fmtLevel(eff)}`}
          ariaLabel={`${PROFILE_NAME[profile]}: mites at the end of each simulated year at treatment efficiency ${fmtLevel(eff)}, on a logarithmic scale. Values are in the table below the figure.`}
          xLabels={YEAR_LABELS.map((y) => y.replace("Year ", ""))}
          xNames={YEAR_LABELS}
          xTitle="Simulated year"
          yTicks={MITE_TICKS}
          yTop={30000}
          yMap={(v) => Math.log10(1 + v)}
          yFormat={shortCount}
          valueFormat={fmtInt}
          series={atLevel((r) => r.mites, false)}
        />
      </div>

      <ul className="bh-readout" aria-live="polite">
        {REGIMENS.map((reg) => {
          const rows = data.runs[reg][level];
          const honey = sum(rows);
          return (
            <li key={reg}>
              <span
                className="bh-key"
                style={{ background: REGIMEN_META[reg].color }}
              />
              <strong>{REGIMEN_META[reg].name}</strong> at {fmtLevel(eff)}:{" "}
              {fmtFate(collapseYear(rows))}
              {reference !== null &&
                `; ${fmtKg(honey)} of honey over the run, ${fmtPct(honey / reference)} of the uninfested hive`}
              .
            </li>
          );
        })}
      </ul>

      <figcaption className="bh-caption">
        <p>
          BEEHAVE runs for the {PROFILE_NAME[profile]} profile at a starting VIL
          of 10%, five simulated years, treatment efficiency swept through{" "}
          {levelLabels.join(", ")} on the three regimens.
          {reference !== null &&
            ` Honey is the total harvested over the run, against ${fmtKg(reference)} for the same hive with no mites.`}{" "}
          Hollow points are runs that ended in collapse. Modelled.
        </p>
        <Cycle2Table profile={profile} />
      </figcaption>
    </figure>
  );
}

function Legend({ withReference }: { withReference: boolean }) {
  return (
    <ul className="bh-legend">
      {REGIMENS.map((reg) => (
        <li key={reg}>
          <span
            className="bh-key"
            style={{ background: REGIMEN_META[reg].color }}
          />
          {REGIMEN_META[reg].name}{" "}
          <span className="bh-muted">({REGIMEN_META[reg].window})</span>
        </li>
      ))}
      {withReference && (
        <li>
          <span className="bh-key bh-key--ref" />
          No mites
        </li>
      )}
      <li>
        <span className="bh-key bh-key--hollow" />
        Run ended in collapse
      </li>
    </ul>
  );
}

function Cycle2Table({ profile }: { profile: Profile }) {
  const data = CYCLE2[profile];
  const honeyKept = data.uninfested !== null;
  return (
    <details className="bh-table-wrap">
      <summary>Every run, year by year</summary>
      <table className="bh-table">
        <caption>{PROFILE_NAME[profile]}, cycle 2.</caption>
        <thead>
          <tr>
            <th scope="col">Regimen</th>
            <th scope="col">Efficiency</th>
            <th scope="col">Year</th>
            <th scope="col" className="bh-num">
              Adult bees, peak
            </th>
            <th scope="col" className="bh-num">
              Mites, year end
            </th>
            {honeyKept && (
              <th scope="col" className="bh-num">
                Honey (kg)
              </th>
            )}
            <th scope="col">Collapsed</th>
          </tr>
        </thead>
        <tbody>
          {data.uninfested?.map((r, i) => (
            <tr key={`ref-${i}`}>
              <th scope="row">No mites</th>
              <td>none</td>
              <td>{i + 1}</td>
              <td className="bh-num">{fmtInt(r.bees)}</td>
              <td className="bh-num">{fmtInt(r.mites)}</td>
              <td className="bh-num">{r.honey.toFixed(1)}</td>
              <td>{r.collapsed ? "yes" : "no"}</td>
            </tr>
          ))}
          {REGIMENS.flatMap((reg: Regimen) =>
            data.runs[reg].flatMap((rows, e) =>
              rows.map((r, i) => (
                <tr key={`${reg}-${e}-${i}`}>
                  <th scope="row">{REGIMEN_META[reg].name}</th>
                  <td>{fmtLevel(EFFICIENCIES[e])}</td>
                  <td>{i + 1}</td>
                  <td className="bh-num">{fmtInt(r.bees)}</td>
                  <td className="bh-num">{fmtInt(r.mites)}</td>
                  {honeyKept && (
                    <td className="bh-num">{r.honey.toFixed(1)}</td>
                  )}
                  <td>{r.collapsed ? "yes" : "no"}</td>
                </tr>
              )),
            ),
          )}
        </tbody>
      </table>
    </details>
  );
}
