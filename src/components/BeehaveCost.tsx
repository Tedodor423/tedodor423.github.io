import { useId, useState } from "react";
import {
  CONCENTRATIONS,
  CYCLE3,
  WINTER_COST_AU_COMMERCIAL,
} from "../data/beehave";
import { fmtInt, fmtLevel, fmtPct } from "../utils/beehave";
import "./BeehaveFigures.css";

/* What a titre is worth: the winter cost table for the Australian commercial
 * profile, read against the modelled private benefit per hive.
 *
 * The season totals and costs are the dry lab's own [CALC] column from
 * AUS_C_4-table, exported unchanged. What this component adds is only the
 * reading: at the titre on the slider, which yeast amounts keep 90% of the
 * honey (from the same profile's winter heat map), and the cheapest of them
 * against each benefit. At 0.005 and 0.05 mg/g that reproduces the sentence on
 * the page; the export script checks the sheet's "required concentration"
 * column against the grid before writing.
 *
 * A table, not a chart: five rows, two currencies, and the answer is a yes or
 * no per row.
 */

const BENEFIT_AUD = 18.9;
const BENEFIT_USD = 47.9;

const money = (symbol: string, v: number) => `${symbol}${v.toFixed(2)}`;

export function BeehaveCost() {
  const sliderId = useId();
  const [conc, setConc] = useState(2);
  const winter = CYCLE3.auc.grid.winter.cells;
  const ref = CYCLE3.auc.honeyRef as number;

  const rows = WINTER_COST_AU_COMMERCIAL.map((row, i) => {
    const cell = winter[i][conc];
    const kept = cell.honey / ref;
    return { ...row, kept, works: cell.collapseYear === null && kept >= 0.9 };
  });
  const cheapest = rows.findIndex((r) => r.works);
  const best = cheapest >= 0 ? rows[cheapest] : null;
  const level = fmtLevel(CONCENTRATIONS[conc]);

  return (
    <figure className="beehave-fig beehave-fig--narrow">
      <p className="bh-title">
        What the titre is worth: winter treatment, Australia commercial
      </p>

      <div className="bh-controls">
        <div className="bh-slider">
          <label htmlFor={sliderId}>
            dsRNA in the yeast{" "}
            <output className="bh-slider-value">{level}</output> mg/g
          </label>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={CONCENTRATIONS.length - 1}
            step={1}
            value={conc}
            aria-valuetext={`${level} mg dsRNA per g yeast`}
            onChange={(e) => setConc(Number(e.target.value))}
          />
          <div className="bh-slider-ticks" aria-hidden="true">
            {CONCENTRATIONS.map((c) => (
              <span key={c}>{fmtLevel(c)}</span>
            ))}
          </div>
        </div>
      </div>

      <p className="bh-answer" aria-live="polite">
        {best ? (
          <>
            At {level} mg/g, the cheapest winter supply that keeps 90% of the
            honey is <strong>{fmtInt(best.yeastPerDay)} yeast/day</strong>:{" "}
            {money("A$", best.aud)} a season against the A${BENEFIT_AUD}{" "}
            benefit, and {money("US$", best.usd)} against the US$
            {BENEFIT_USD} benefit.{" "}
            <strong>{verdict(best.aud, best.usd)}</strong>
          </>
        ) : (
          <>
            At {level} mg/g, no amount of yeast tested keeps 90% of the honey.
          </>
        )}
      </p>

      <div className="bh-table-scroll">
        <table className="bh-table bh-table--cost">
          <caption>
            Winter regimen (day 1, 89 days). Honey kept is at {level} mg/g;
            costs do not depend on the titre.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="bh-num">
                Yeast/day
              </th>
              <th scope="col" className="bh-num">
                Yeast per season
              </th>
              <th scope="col" className="bh-num">
                Cost (A$)
              </th>
              <th scope="col" className="bh-num">
                Cost (US$)
              </th>
              <th scope="col" className="bh-num">
                Honey kept
              </th>
              <th scope="col">Under A${BENEFIT_AUD}</th>
              <th scope="col">Under US${BENEFIT_USD}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.yeastPerDay}
                className={[
                  r.works ? "is-works" : "",
                  i === cheapest ? "is-cheapest" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <th scope="row" className="bh-num">
                  {fmtInt(r.yeastPerDay)}
                </th>
                <td className="bh-num">{fmtInt(r.season)}</td>
                <td className="bh-num">{r.aud.toFixed(2)}</td>
                <td className="bh-num">{r.usd.toFixed(2)}</td>
                <td className="bh-num">
                  {fmtPct(r.kept)}
                  {r.works ? "" : " (below 90%)"}
                </td>
                <td>{r.aud <= BENEFIT_AUD ? "yes" : "no"}</td>
                <td>{r.usd <= BENEFIT_USD ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <figcaption className="bh-caption">
        <p>
          Season totals and costs are the dry lab&apos;s <code>[CALC]</code>, at
          a fermentation cost of 2.33 USD (3.35 AUD) per gram, set against the
          modelled private benefit of US$47.9 per colony and A$18.9 per hive.
          Honey kept is from the winter heat map for this profile above. The
          highlighted row is the cheapest that keeps 90%. Modelled.
        </p>
      </figcaption>
    </figure>
  );
}

function verdict(aud: number, usd: number): string {
  const au = aud <= BENEFIT_AUD;
  const us = usd <= BENEFIT_USD;
  if (au && us) return "Economically viable in both the US and Australia.";
  if (us) return "Economically viable in the US, not in Australia.";
  if (au) return "Economically viable in Australia, not in the US.";
  return "Not economically viable in either.";
}
