import { useState } from "react";
import { hexPoints } from "../utils/worldHexes";
import "./HoneyLoop.css";

/* The HONEY loop, drawn as the cycle it is.
 *
 * Five cells in a ring, closed by the arrow from Yield back to Hear, with the
 * one decision that changed the project travelling round it. The team's plan
 * asked for exactly this ("one of the biggest diagrams on your HP page"), and
 * asked for it to read as a cycle rather than a funnel.
 *
 * The worked example is the chassis decision, because it is the best-evidenced
 * loop we have: every step below is attributed on the page and in the
 * stakeholder record. Hovering or focusing a cell lifts its step in the
 * legend, and nothing lives only in the picture - the legend is the same text
 * in reading order.
 */

interface Beat {
  letter: string;
  name: string;
  asks: string;
  /** The chassis decision at this beat. */
  example: string;
}

const BEATS: Beat[] = [
  {
    letter: "H",
    name: "Hear",
    asks: "Who has a stake, and what do they say?",
    example:
      "The OGTR, Lord Krebs, ACRE's chair, US federal regulators, an organic certifier, and beekeepers on three continents.",
  },
  {
    letter: "O",
    name: "Observe",
    asks: "What is already true?",
    example:
      "Two regulatory pathways, not one. A non-living yeast product sits outside the OGTR's remit; a living engineered S. alvi needs environmental-release assessment, and organic certification rules it out entirely.",
  },
  {
    letter: "N",
    name: "Navigate",
    asks: "What constraints does that place on the design?",
    example:
      "An inducible switch changes the risk assessment but not the route. Persistence, the property that made S. alvi attractive, is the property that complicates its release.",
  },
  {
    letter: "E",
    name: "Evaluate",
    asks: "What does that mean for the design in front of us?",
    example:
      "A genuine trade-off: the living chassis may offer more persistence and fewer applications; the non-living formulation gives that up for containment, regulatory feasibility and social licence.",
  },
  {
    letter: "Y",
    name: "Yield",
    asks: "What changed, and what did it open?",
    example:
      "Heat-inactivated engineered yeast, fed in a pollen patty. Which opened the next question for the beekeepers: if it is no longer persistent, what does reapplying it cost you?",
  },
];

/* Geometry, in viewBox units. A pentagon of cells on a ring, first at the top. */
const CX = 300;
const CY = 275;
const RING = 185;
const R = 56;

function pointAt(i: number): { x: number; y: number } {
  const a = (Math.PI / 180) * (-90 + i * 72);
  return { x: CX + RING * Math.cos(a), y: CY + RING * Math.sin(a) };
}

/** Arrow from cell i to cell i+1, trimmed so it starts and ends at the rims. */
function arrow(i: number): string {
  const a = pointAt(i);
  const b = pointAt((i + 1) % 5);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const gap = R + 10;
  const x1 = a.x + ux * gap;
  const y1 = a.y + uy * gap;
  const x2 = b.x - ux * (gap + 6);
  const y2 = b.y - uy * (gap + 6);
  return `M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`;
}

export function HoneyLoop() {
  const [lit, setLit] = useState<number | null>(null);

  return (
    <figure className="honey-loop">
      <div className="hl-frame">
        <svg
          viewBox="0 0 600 560"
          className="hl-svg"
          role="img"
          aria-labelledby="hl-title"
        >
          <title id="hl-title">
            The HONEY loop: Hear, Observe, Navigate, Evaluate, Yield, and back
            to Hear.
          </title>
          <defs>
            <marker
              id="hl-head"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" className="hl-head" />
            </marker>
            {/* A marker takes its own fill, not the path's, so the closing
                arrow needs a violet head of its own. */}
            <marker
              id="hl-head-close"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" className="hl-head hl-head--close" />
            </marker>
          </defs>

          <g className="hl-arrows">
            {BEATS.map((_, i) => (
              <path
                key={i}
                d={arrow(i)}
                markerEnd={i === 4 ? "url(#hl-head-close)" : "url(#hl-head)"}
                className={i === 4 ? "hl-arrow hl-arrow--close" : "hl-arrow"}
              />
            ))}
          </g>

          <text x={CX} y={CY - 8} className="hl-centre" textAnchor="middle">
            the loop closes
          </text>
          <text x={CX} y={CY + 14} className="hl-centre" textAnchor="middle">
            every Yield is a new Hear
          </text>

          {BEATS.map((b, i) => {
            const p = pointAt(i);
            const on = lit === i;
            return (
              <g
                key={b.letter}
                className={`hl-cell${on ? " is-lit" : ""}`}
                tabIndex={0}
                role="button"
                aria-label={`${b.name}: ${b.asks}`}
                aria-pressed={on}
                onPointerEnter={() => setLit(i)}
                onPointerLeave={() => setLit(null)}
                onFocus={() => setLit(i)}
                onBlur={() => setLit(null)}
                onClick={() => setLit(on ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLit(on ? null : i);
                  }
                }}
              >
                <polygon points={hexPoints(p.x, p.y, R)} className="hl-hex" />
                <text
                  x={p.x}
                  y={p.y - 6}
                  textAnchor="middle"
                  className="hl-letter"
                >
                  {b.letter}
                </text>
                <text
                  x={p.x}
                  y={p.y + 22}
                  textAnchor="middle"
                  className="hl-name"
                >
                  {b.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption className="hl-legend">
        <p className="hl-legend-lead">
          One turn of the loop: the decision to stop building a living GMO.
        </p>
        <ol>
          {BEATS.map((b, i) => (
            <li
              key={b.letter}
              className={lit === i ? "is-lit" : undefined}
              onPointerEnter={() => setLit(i)}
              onPointerLeave={() => setLit(null)}
            >
              <span className="hl-beat">
                <span className="hl-beat-letter">{b.letter}</span> {b.name}
                <span className="hl-beat-asks">{b.asks}</span>
              </span>
              <span className="hl-example">{b.example}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
