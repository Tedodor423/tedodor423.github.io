import { useState } from "react";
import { Link } from "react-router-dom";
import { hexPoints } from "../utils/worldHexes";
import "./HiveCorners.css";

/* The HIVE framework, drawn as the hive it is named for.
 *
 * The bee scene's hive box, a letter cell on each of its four corners, read
 * clockwise from the top left: Hear, Investigate, Verdict, Evaluate, and
 * Evaluate sits next to Hear again, where the loop closes. The team badge
 * hangs inside the box above the entrance. Pointing at a letter, or reaching
 * it with the keyboard, grows its cell so the letter becomes the full word; a
 * click does nothing a hover does not.
 *
 * This is the opening section of the integrated human practices page: the
 * team's account of how the work was done on the left, the framework it
 * follows in the middle, and on the right the way on to the other human
 * practices pages. The evidence the framework produced is the record below
 * it on that page.
 */

/** The work done for human practices, each with its own page. Hive
 * modelling is the ecological model, whose page sits under the hidden dry
 * lab group in src/pages.ts rather than under Human practices. */
const ONWARD = [
  { label: "Case Studies", to: "/case-studies" },
  { label: "Economical Modelling", to: "/economic-modelling" },
  { label: "Hive Modelling", to: "/ecological-modelling" },
];

interface Cell {
  letter: string;
  name: string;
  /** The box corner it sits on, in the hive drawing's own units. */
  x: number;
  y: number;
}

/* hive.svg is 428.72 x 282.89. The box corners, measured off the drawing:
 * the roof slopes down to the left and the floor up to the right, so no two
 * corners share a height. Re-measure if the artwork is redrawn. */
const HIVE_W = 428.72;
const HIVE_H = 282.89;

const CELLS: Cell[] = [
  { letter: "H", name: "Hear", x: 66, y: 44 },
  { letter: "I", name: "Investigate", x: 352, y: 24 },
  { letter: "V", name: "Verdict", x: 365, y: 226 },
  { letter: "E", name: "Evaluate", x: 70, y: 265 },
];

const R = 44;

/* Served from static.igem.wiki, the same upload the bee scene flies home to. */
const HIVE_SRC = "https://static.igem.wiki/teams/6391/wiki/assets/hive.svg";

/* The team badge, above the entrance. Served from static.igem.wiki once
 * uploaded (the uploads tool keeps the basename and converts to .avif, so the
 * URL is knowable now); dev serves the local source from
 * wiki-assets-source/images_dev/ via the images-dev plugin in vite.config.ts,
 * the same arrangement as the stakeholder photos. Its navy fill is slightly
 * transparent, so it sits on a honey disc.
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
const LOGO = { x: 212, y: 108, r: 40 };

export function HiveCorners() {
  const [lit, setLit] = useState<number | null>(null);
  const [logo, setLogo] = useState<string | undefined>(LOGO_SRC);

  return (
    <figure className="hive-corners">
      {/* The heading is gone by design - the hive drawing carries the idea -
       * but the timeline still deep-links here, so its id stays on the
       * copy block. */}
      <div className="hc-copy" id="how-we-worked">
        <p>
          Our human practices run on a loop rather than a checklist: four
          moves, one per corner of the hive, and the last hands a new question
          back to the first. Every Evaluate ends in a new Hear.
        </p>
        <p>
          The test for everything on this page:{" "}
          <strong>would the project look different</strong> if we had never had
          these conversations? A headcount does not answer that, so the count
          appears once, in the record below, and the rest of the page is spent
          on what the conversations changed.
        </p>
      </div>

      <div className="hc-frame">
        <svg
          viewBox="-20 -45 470 380"
          className="hc-svg"
          role="img"
          aria-labelledby="hc-title"
        >
          <title id="hc-title">
            The HIVE framework: Hear, Investigate, Verdict and Evaluate on the
            four corners of a hive, read clockwise from the top left, with the
            Oxford iGEM team badge inside it.
          </title>

          <image
            href={HIVE_SRC}
            x={0}
            y={0}
            width={HIVE_W}
            height={HIVE_H}
            className="hc-hive"
          />

          {/* Inert: the four letter cells are the interactive ones. */}
          <g className="hc-logo">
            <circle cx={LOGO.x} cy={LOGO.y} r={LOGO.r} className="hc-logo-disc" />
            <image
              href={logo}
              x={LOGO.x - LOGO.r + 6}
              y={LOGO.y - LOGO.r + 6}
              width={(LOGO.r - 6) * 2}
              height={(LOGO.r - 6) * 2}
              onError={() =>
                setLogo((s) => (s === LOGO_FALLBACK ? undefined : LOGO_FALLBACK))
              }
            />
          </g>

          {CELLS.map((c, i) => {
            const on = lit === i;
            return (
              <g
                key={c.letter}
                className={`hc-cell${on ? " is-lit" : ""}`}
                tabIndex={0}
                role="img"
                aria-label={`${i + 1} of 4: ${c.name}`}
                onPointerEnter={() => setLit(i)}
                onPointerLeave={() => setLit(null)}
                onFocus={() => setLit(i)}
                onBlur={() => setLit(null)}
              >
                <polygon points={hexPoints(c.x, c.y, R)} className="hc-hex" />
                <text
                  x={c.x}
                  y={c.y + 14}
                  textAnchor="middle"
                  className="hc-letter"
                >
                  {c.letter}
                </text>
                {/* The same cell, expanded: the word the letter is short for. */}
                <text
                  x={c.x}
                  y={c.y + 6}
                  textAnchor="middle"
                  className="hc-word"
                >
                  {c.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="hc-onward">
        <p id="hc-onward-lead" className="hc-onward-lead">
          What we researched and developed for our human practices:
        </p>
        <nav className="hc-links" aria-labelledby="hc-onward-lead">
          {ONWARD.map((l) => (
            <Link key={l.to} to={l.to}>
              <span>{l.label}</span>
              {/* Drawn here rather than taken from an icon set: a plain
                  shaft and head in the text colour, static. */}
              <svg className="hc-arrow" viewBox="0 0 16 16" aria-hidden>
                <path d="M 2 8 H 13 M 8.5 3.5 L 13 8 L 8.5 12.5" />
              </svg>
            </Link>
          ))}
        </nav>
      </div>
    </figure>
  );
}
