import { useEffect, useState } from "react";
import { hexPoints } from "../utils/worldHexes";
import { Marked } from "./Marked";
import "./HeadlineStats.css";

/* The four opening numbers, each drawn in comb cells.
 *
 * The numbers are the ones the team's jamboree deck opens with, and they are
 * displayed, not asserted: every claim carries a [FLAG] tag until someone
 * replaces it with a resolvable citation, because our own slide is not a
 * source (the TODO next to this component in home.md names the owner). When
 * a citation lands, swap the tag for [LIT] here and delete the number from
 * the TODO. A number we cannot source by the freeze comes off the page.
 *
 * The figures count rather than plot: four unrelated magnitudes share no
 * axis, so a shared bar chart would invite a comparison that means nothing.
 * Instead each stat gets its own comb — the same hexagon the two world maps
 * are drawn from — and the cells carry the fraction the claim states, never
 * more. Nothing is interpolated: no growth curves, no animated fills from
 * zero, because the claims are endpoints and we do not know the path.
 *
 * All interaction is optional and additive. The buttons re-emphasise cells
 * and rewrite the caption under the comb; everything a caption can say is
 * already on the page as plain text, per the house rule that nothing may
 * exist only behind a pointer. The one moving figure, the loss ticker, is
 * plain arithmetic from the stated rate and is marked [CALC]; it starts
 * paused for a reader who asked for reduced motion.
 */

/** The world map's cell, reused at its own size, and its lattice pitch. */
const R = 11.35;
const PITCH_X = 24;
const PITCH_Y = 20.8;

interface CombCell {
  index: number;
  row: number;
  x: number;
  y: number;
}

/** A little comb: `rows` rows of `cols` cells, odd rows shifted half a cell. */
function comb(rows: number, cols: number) {
  const cells: CombCell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({
        index: cells.length,
        row,
        x: R + 1 + col * PITCH_X + (row % 2 ? PITCH_X / 2 : 0),
        y: R + 1 + row * PITCH_Y,
      });
    }
  }
  return {
    cells,
    w: 2 * (R + 1) + (cols - 1) * PITCH_X + (rows > 1 ? PITCH_X / 2 : 0),
    h: 2 * (R + 1) + (rows - 1) * PITCH_Y,
  };
}

function Cells({ cells, classOf }: { cells: CombCell[]; classOf: (cell: CombCell) => string }) {
  return (
    <>
      {cells.map((cell) => (
        <polygon key={cell.index} className={classOf(cell)} points={hexPoints(cell.x, cell.y, R)} />
      ))}
    </>
  );
}

/* 50% more food: today as two rows of five, 2050 as three. The extra row is
 * the whole claim — half as much again — so it is the only honey on the tile. */
function FoodTile() {
  const [pick, setPick] = useState<"today" | "by2050" | null>(null);
  const today = comb(2, 5);
  const future = comb(3, 5);
  const toggle = (key: "today" | "by2050") =>
    setPick((current) => (current === key ? null : key));

  const caption =
    pick === "today"
      ? "Ten cells: what the world grows today, as the baseline."
      : pick === "by2050"
        ? "Fifteen cells by 2050. The honey row is the extra half."
        : "Ten cells today, fifteen by 2050. Press either comb.";

  return (
    <li className="hs-tile">
      <p className="hs-value">50%</p>
      <p className="hs-claim">
        <Marked text="more food needed by 2050 to feed humanity" /> <code>[FLAG]</code>
      </p>
      <div className="hs-combs">
        <button
          type="button"
          className={`hs-comb${pick === "today" ? " is-on" : ""}${pick === "by2050" ? " is-off" : ""}`}
          aria-pressed={pick === "today"}
          onClick={() => toggle("today")}
        >
          <span className="hs-comb-label">today</span>
          <svg
            viewBox={`0 0 ${today.w} ${today.h}`}
            width={today.w}
            height={today.h}
            role="img"
            aria-label="Ten cells standing for today's food production"
          >
            <Cells cells={today.cells} classOf={() => "hs-cell hs-cell--wax"} />
          </svg>
        </button>
        <button
          type="button"
          className={`hs-comb${pick === "by2050" ? " is-on" : ""}${pick === "today" ? " is-off" : ""}`}
          aria-pressed={pick === "by2050"}
          onClick={() => toggle("by2050")}
        >
          <span className="hs-comb-label">2050</span>
          <svg
            viewBox={`0 0 ${future.w} ${future.h}`}
            width={future.w}
            height={future.h}
            role="img"
            aria-label="Fifteen cells for 2050: the ten of today plus five more in honey"
          >
            <Cells
              cells={future.cells}
              classOf={(cell) =>
                `hs-cell ${cell.row === 2 ? "hs-cell--honey" : "hs-cell--wax"}`
              }
            />
          </svg>
        </button>
      </div>
      <p className="hs-caption">{caption}</p>
    </li>
  );
}

/* Over a third on bee pollination: three honey cells in a comb of nine. The
 * figure shows exactly a third; the "over" stays in words, where it belongs. */
function BeesTile() {
  const [pick, setPick] = useState<"bees" | "rest" | null>(null);
  const nine = comb(3, 3);
  const toggle = (key: "bees" | "rest") =>
    setPick((current) => (current === key ? null : key));

  const caption =
    pick === "bees"
      ? "The three honey cells: production that relies on bee pollination."
      : pick === "rest"
        ? "The six wax cells: production that does not rely on bees."
        : "Three cells in nine, and the claim says over a third.";

  return (
    <li className="hs-tile">
      <p className="hs-value">
        <span>over </span>1/3
      </p>
      <p className="hs-claim">
        <Marked text="of global food production relies on bee pollination" /> <code>[FLAG]</code>
      </p>
      <div className="hs-figure">
        <svg
          viewBox={`0 0 ${nine.w} ${nine.h}`}
          width={nine.w}
          height={nine.h}
          role="img"
          aria-label="Nine cells, three of them honey: the third of food production that relies on bees"
        >
          <Cells
            cells={nine.cells}
            classOf={(cell) =>
              `hs-cell ${cell.row === 0 ? "hs-cell--honey" : "hs-cell--wax"}` +
              (pick === "rest" && cell.row === 0 ? " is-dim" : "") +
              (pick === "bees" && cell.row !== 0 ? " is-dim" : "")
            }
          />
        </svg>
      </div>
      <div className="hs-picks">
        <button
          type="button"
          className={`hs-pick${pick === "bees" ? " is-on" : ""}`}
          aria-pressed={pick === "bees"}
          onClick={() => toggle("bees")}
        >
          <span className="hs-swatch hs-swatch--honey" aria-hidden="true" /> relies on bees
        </button>
        <button
          type="button"
          className={`hs-pick${pick === "rest" ? " is-on" : ""}`}
          aria-pressed={pick === "rest"}
          onClick={() => toggle("rest")}
        >
          <span className="hs-swatch hs-swatch--wax" aria-hidden="true" /> everything else
        </button>
      </div>
      <p className="hs-caption">{caption}</p>
    </li>
  );
}

/* ~$2 bn a year, made feelable: the same rate expressed per second, counting
 * while the page is open. Arithmetic from the stated figure, nothing more —
 * 2,000,000,000 over a year's 31,557,600 seconds is $63.4 a second [CALC]. */
const RATE = 2_000_000_000 / 31_557_600;

function CostTile({ reduced }: { reduced: boolean }) {
  const [running, setRunning] = useState(!reduced);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <li className="hs-tile">
      <p className="hs-value">
        <span>~</span>$2 bn
      </p>
      <p className="hs-claim">
        <Marked text="lost every year to Varroa destructor" /> <code>[FLAG]</code>
      </p>
      <p className="hs-ticker" aria-live="off">
        <span className="hs-ticker-amount">
          ${Math.floor(seconds * RATE).toLocaleString("en-GB")}
        </span>
        <span className="hs-ticker-what">
          at that rate, since you opened this page
        </span>
      </p>
      <div className="hs-picks">
        <button
          type="button"
          className="hs-pick"
          aria-pressed={running}
          onClick={() => setRunning((r) => !r)}
        >
          {running ? "Pause" : "Run"}
        </button>
      </div>
      <p className="hs-caption">
        A year of ~$2 bn is about $63 every second <code>[CALC]</code>.
      </p>
    </li>
  );
}

/* 100% at risk by 2050: every cell hatched. Hatching is this wiki's mark for
 * a state, not a measurement — the same stroke the loss map uses — because
 * "at risk" is not damage. The claim has no baseline, so "today" shows empty
 * cells rather than a number we do not have. */
function RiskTile() {
  const [pick, setPick] = useState<"today" | "by2050">("by2050");
  const nine = comb(3, 3);

  return (
    <li className="hs-tile">
      <p className="hs-value">100%</p>
      <p className="hs-claim">
        <Marked text="of agricultural land at risk of pesticide pollution by 2050" />{" "}
        <code>[FLAG]</code>
      </p>
      <div className="hs-figure">
        <svg
          viewBox={`0 0 ${nine.w} ${nine.h}`}
          width={nine.w}
          height={nine.h}
          role="img"
          aria-label={
            pick === "by2050"
              ? "Nine cells, all hatched: every piece of agricultural land at risk by 2050"
              : "Nine empty cells: no baseline figure for today is claimed"
          }
        >
          <defs>
            <pattern
              id="hs-hatch"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="6" height="6" fill="var(--wax-deep)" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink)" strokeWidth="1.5" />
            </pattern>
          </defs>
          <Cells
            cells={nine.cells}
            classOf={() =>
              `hs-cell ${pick === "by2050" ? "hs-cell--risk" : "hs-cell--empty"}`
            }
          />
        </svg>
      </div>
      <div className="hs-picks">
        <button
          type="button"
          className={`hs-pick${pick === "today" ? " is-on" : ""}`}
          aria-pressed={pick === "today"}
          onClick={() => setPick("today")}
        >
          today
        </button>
        <button
          type="button"
          className={`hs-pick${pick === "by2050" ? " is-on" : ""}`}
          aria-pressed={pick === "by2050"}
          onClick={() => setPick("by2050")}
        >
          2050
        </button>
      </div>
      <p className="hs-caption">
        {pick === "by2050"
          ? "Every cell hatched: at risk, which is a state, not damage."
          : "Empty cells: the claim carries no baseline figure for today."}
      </p>
    </li>
  );
}

export function HeadlineStats() {
  // Same convention as the varroa map: a reader who asked for less motion
  // gets every figure still, and the controls to move them.
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true,
  );

  return (
    <ul className="headline-stats">
      <FoodTile />
      <BeesTile />
      <CostTile reduced={reduced} />
      <RiskTile />
    </ul>
  );
}
