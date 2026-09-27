import { useState } from "react";
import { hexPoints } from "../utils/worldHexes";
import "./HoneyHex.css";

/* The HONEY framework, drawn as the comb cell it is named for.
 *
 * One hexagon, a letter cell on five of its corners; the sixth carries the
 * team's own badge, where the loop closes. Pointing at
 * a letter, or reaching it with the keyboard, grows its cell so the letter
 * becomes the full word; a click does nothing a hover does not. The team
 * chose to keep the figure to the words alone, so each beat's fuller meaning
 * lives only in the cell labels assistive tech reads and in the prose of the
 * page itself.
 *
 * This is the opening section of the integrated human practices page: the
 * team's account of how the work was done on the left, the framework it
 * follows on the right. The evidence the framework produced is the record
 * below it on that page.
 */

interface Cell {
  letter: string;
  name: string;
  /** What the letter means — the question that beat of the loop asks. */
  means: string;
}

const CELLS: Cell[] = [
  {
    letter: "H",
    name: "Hear",
    means: "Who has a stake, and what do they actually say?",
  },
  {
    letter: "O",
    name: "Observe",
    means: "What is already true — practice, cost, regulation, prior work?",
  },
  {
    letter: "N",
    name: "Navigate",
    means: "What constraints does that place on what we can build?",
  },
  {
    letter: "E",
    name: "Evaluate",
    means: "What does that mean for the design in front of us?",
  },
  {
    letter: "Y",
    name: "Yield",
    means: "What changed — and what new question did the change open?",
  },
];

/* Geometry, in viewBox units: one pointy-top hexagon, a letter cell centred
 * on each vertex. Vertex 0 is the top; H..Y run clockwise from it, so the
 * free corner sits between Yield and Hear — where the loop closes. */
const CX = 230;
const CY = 230;
const RING = 165;
const R = 46;

/* The team badge takes the sixth corner. Served from static.igem.wiki once
 * uploaded (the uploads tool keeps the basename and converts to .avif, so the
 * URL is knowable now); dev serves the local source from
 * wiki-assets-source/images_dev/ via the images-dev plugin in vite.config.ts,
 * the same arrangement as the stakeholder photos. Its navy fill is slightly
 * transparent, so it sits on a honey disc rather than straight on the comb
 * edge.
 *
 * TEMPORARY FALLBACK, as for the comb icons (src/data/cycleIcons.ts). Until
 * the upload is done, a published build that cannot load the static.igem.wiki
 * URL tries the copy in the gitignored public/local/, which the GitHub Pages
 * preview fills from wiki-assets-source/images_dev/ and the wiki's own CI
 * never has. Once the static.igem.wiki URL answers, drop LOGO_FALLBACK and
 * the onError below. */
const LOGO_SRC = import.meta.env.DEV
  ? `${import.meta.env.BASE_URL}images-dev/oxford-igem-logo.png`
  : "https://static.igem.wiki/teams/6391/wiki/assets/oxford-igem-logo.avif";
const LOGO_FALLBACK = `${import.meta.env.BASE_URL}local/oxford-igem-logo.png`;

function cornerAt(i: number): { x: number; y: number } {
  const a = (Math.PI / 180) * (-90 + i * 60);
  return { x: CX + RING * Math.cos(a), y: CY + RING * Math.sin(a) };
}

export function HoneyHex() {
  const [lit, setLit] = useState<number | null>(null);
  const [logo, setLogo] = useState<string | undefined>(LOGO_SRC);

  return (
    <figure className="honey-hex">
      {/* The heading is gone by design - the loop drawing carries the idea -
       * but the timeline still deep-links here, so its id stays on the
       * copy block. */}
      <div className="hh-copy" id="how-we-worked">
        <p>
          Our human practices run on a loop rather than a checklist: five
          moves, one per letter, and the last hands a new question back to the
          first. Every Yield is a new Hear.
        </p>
        <p>
          The test for everything on this page:{" "}
          <strong>would the project look different</strong> if we had never had
          these conversations? A headcount does not answer that, so the count
          appears once, in the record below, and the rest of the page is spent
          on what the conversations changed.
        </p>
      </div>

      <div className="hh-frame">
        <svg
          viewBox="0 0 460 460"
          className="hh-svg"
          role="img"
          aria-labelledby="hh-title"
        >
          <title id="hh-title">
            The HONEY framework: Hear, Observe, Navigate, Evaluate and Yield on
            five corners of one honeycomb cell, with the Oxford iGEM team badge
            on the sixth.
          </title>

          <polygon points={hexPoints(CX, CY, RING)} className="hh-comb" />

          {/* The sixth corner: the badge where the comb's edges meet. Inert —
              the five letter cells are the interactive ones. */}
          {(() => {
            const p = cornerAt(5);
            return (
              <g className="hh-logo">
                <circle cx={p.x} cy={p.y} r={44} className="hh-logo-disc" />
                <image
                  href={logo}
                  x={p.x - 38}
                  y={p.y - 38}
                  width={76}
                  height={76}
                  onError={() =>
                    setLogo((s) => (s === LOGO_FALLBACK ? undefined : LOGO_FALLBACK))
                  }
                />
              </g>
            );
          })()}

          {CELLS.map((c, i) => {
            const p = cornerAt(i);
            const on = lit === i;
            return (
              <g
                key={c.letter}
                className={`hh-cell${on ? " is-lit" : ""}`}
                tabIndex={0}
                role="img"
                aria-label={`${c.name}: ${c.means}`}
                onPointerEnter={() => setLit(i)}
                onPointerLeave={() => setLit(null)}
                onFocus={() => setLit(i)}
                onBlur={() => setLit(null)}
              >
                <polygon points={hexPoints(p.x, p.y, R)} className="hh-hex" />
                <text
                  x={p.x}
                  y={p.y + 15}
                  textAnchor="middle"
                  className="hh-letter"
                >
                  {c.letter}
                </text>
                {/* The same cell, expanded: the word the letter is short for. */}
                <text
                  x={p.x}
                  y={p.y + 7}
                  textAnchor="middle"
                  className="hh-word"
                >
                  {c.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* The honey pot at the comb's centre — a stand-in the team asked
            for until a proper drawing replaces it, which is why the emoji
            rule gets an exception here. */}
        <div className="hh-centre" aria-hidden="true">
          <p className="hh-emoji">🍯</p>
        </div>
      </div>
    </figure>
  );
}
