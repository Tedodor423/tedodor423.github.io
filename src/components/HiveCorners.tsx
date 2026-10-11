import { useCallback, useEffect, useRef, useState, type Ref } from "react";
import { Link, useLocation } from "react-router-dom";
import { hexPoints } from "../utils/worldHexes";
import { HIVE_CORNERS } from "../data/hiveCorners";
import { Marked, MarkedInline } from "./Marked";
import "./HiveCorners.css";

/* The HIVE framework, drawn as the hive it is named for.
 *
 * The bee scene's hive box, a letter cell on each of its four corners, read
 * clockwise from the top left: Hear, Investigate, Verdict, Evaluate, and
 * Evaluate sits next to Hear again, where the loop closes. The team badge
 * hangs inside the box above the entrance. Pointing at a letter, or reaching
 * it with the keyboard, grows its cell so the letter becomes the full word.
 * A click anywhere on the hive, or on the "Click to read more" under it,
 * opens the framework written out in full in a window over the page; that
 * button is the control a keyboard or a screen reader uses. The window is a
 * native modal <dialog>, so Escape closes it and focus stays inside it while
 * it is open; the cross in its corner and a click outside it close it too.
 *
 * Opening it, the hive itself shrinks and flies up into the top of the
 * window, where a small copy of it heads the framework, and the words fade
 * in once it has landed; closing it, the words go first and the hive flies
 * back to its place on the page. Reduced motion, or a hive scrolled out of
 * sight, and the window simply opens and shuts.
 *
 * This is the opening section of the integrated human practices page: the
 * team's account of how the work was done on the left, the framework it
 * follows in the middle, and on the right the way on to the other human
 * practices pages. The evidence the framework produced is the record below
 * it on that page.
 */

/* The words, and the onward links, are HIVE_CORNERS in
 * src/data/hiveCorners.ts, where the search index reads them too. */

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

const FRAMEWORK = HIVE_CORNERS.framework;

/* ---------- the flight between the page and the window ---------- */

const OPEN_MS = 650;
const CLOSE_MS = 420;
/** The window's words, after the hive has landed or before it leaves. */
const WORDS_MS = 260;
const EASE_OUT = "cubic-bezier(0.2, 0.7, 0.2, 1)";
const EASE_IN_OUT = "cubic-bezier(0.45, 0, 0.55, 1)";

/** What is in the air: every animation, so any of them can be stopped. */
interface Flight {
  anims: Animation[];
  closing: boolean;
}

const still = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A hive scrolled out of the window has nowhere on screen to fly from. */
const onScreen = (r: DOMRect) =>
  r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;

/** The transform that lays the window's hive over the page's. The two share
 * one viewBox, so one scale fits both axes; needs transform-origin 0 0. */
const over = (page: DOMRect, mini: DOMRect) =>
  `translate(${page.left - mini.left}px, ${page.top - mini.top}px) scale(${
    page.width / mini.width
  })`;

/** The window's surface, shown and see-through, for fading the box in
 * around the hive while it flies. */
function surfaces(d: HTMLDialogElement) {
  const cs = getComputedStyle(d);
  return {
    shown: { backgroundColor: cs.backgroundColor, borderColor: cs.borderTopColor },
    clear: { backgroundColor: "rgb(0 0 0 / 0)", borderColor: "rgb(0 0 0 / 0)" },
  };
}

/** Everything in the window but the hive: it fades while the hive flies. */
const words = (d: HTMLDialogElement) =>
  Array.from(d.querySelectorAll<HTMLElement>("[data-fade]"));

/** Lands whatever is in the air where it is, and lets the window scroll. */
function stopFlight(d: HTMLDialogElement, f: Flight) {
  f.anims.forEach((a) => a.cancel());
  f.anims = [];
  delete d.dataset.flying;
}

/** The window is open; fly the page's hive (at `page`) up into it. While it
 * flies the window lets it overhang (data-flying), and the words wait. */
function flyIn(
  d: HTMLDialogElement,
  mini: SVGSVGElement,
  page: DOMRect,
  f: Flight,
) {
  d.dataset.flying = "";
  const to = mini.getBoundingClientRect();
  const { shown, clear } = surfaces(d);
  const hive = mini.animate(
    [{ transform: over(page, to) }, { transform: "none" }],
    { duration: OPEN_MS, easing: EASE_OUT },
  );
  f.anims = [
    hive,
    d.animate([clear, shown], {
      duration: OPEN_MS * 0.6,
      delay: OPEN_MS * 0.3,
      fill: "backwards",
    }),
    d.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: OPEN_MS * 0.6,
      pseudoElement: "::backdrop",
    }),
    ...words(d).map((w) =>
      w.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: WORDS_MS,
        delay: OPEN_MS,
        fill: "backwards",
      }),
    ),
  ];
  hive.finished.then(
    () => delete d.dataset.flying,
    () => {},
  );
}

/** The other way: the words go, then the hive flies back down onto the page
 * and the window fades around it. Resolves once the hive is home; rejects if
 * the flight is stopped on the way. */
async function flyOut(
  d: HTMLDialogElement,
  mini: SVGSVGElement,
  page: DOMRect,
  f: Flight,
) {
  const fades = words(d).map((w) =>
    w.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: WORDS_MS * 0.55,
      fill: "forwards",
    }),
  );
  f.anims = [...fades];
  await Promise.all(fades.map((a) => a.finished));

  // Measured once the window stops scrolling, which puts the hive back at
  // the top of it.
  d.dataset.flying = "";
  const to = mini.getBoundingClientRect();
  const { shown, clear } = surfaces(d);
  const hive = mini.animate(
    [{ transform: "none" }, { transform: over(page, to) }],
    { duration: CLOSE_MS, easing: EASE_IN_OUT, fill: "forwards" },
  );
  f.anims.push(
    hive,
    d.animate([shown, clear], { duration: CLOSE_MS * 0.7, fill: "forwards" }),
    d.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: CLOSE_MS,
      pseudoElement: "::backdrop",
      fill: "forwards",
    }),
  );
  await hive.finished;
}

/* ---------- the drawing ---------- */

interface HiveDrawingProps {
  className: string;
  svgRef: Ref<SVGSVGElement>;
  logo: string | undefined;
  onLogoError: () => void;
  lit: number | null;
  /** Given, the drawing is the page's figure: titled for screen readers, its
   * cells reachable by keyboard and lit by pointing at them. Omitted, it is
   * the window's copy, decoration over words that say the same. */
  onLight?: (i: number | null) => void;
}

function HiveDrawing({
  className,
  svgRef,
  logo,
  onLogoError,
  lit,
  onLight,
}: HiveDrawingProps) {
  return (
    <svg
      ref={svgRef}
      viewBox="-20 -45 470 380"
      className={className}
      {...(onLight
        ? { role: "img", "aria-labelledby": "hc-title" }
        : { "aria-hidden": true })}
    >
      {onLight && (
        <title id="hc-title">
          The HIVE framework: Hear, Investigate, Verdict and Evaluate on the
          four corners of a hive, read clockwise from the top left, with the
          Oxford iGEM team badge inside it.
        </title>
      )}

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
          onError={onLogoError}
        />
      </g>

      {CELLS.map((c, i) => (
        <g
          key={c.letter}
          className={`hc-cell${lit === i ? " is-lit" : ""}`}
          {...(onLight
            ? {
                tabIndex: 0,
                role: "img",
                "aria-label": `${i + 1} of 4: ${c.name}`,
                onPointerEnter: () => onLight(i),
                onPointerLeave: () => onLight(null),
                onFocus: () => onLight(i),
                onBlur: () => onLight(null),
              }
            : {})}
        >
          <polygon points={hexPoints(c.x, c.y, R)} className="hc-hex" />
          <text x={c.x} y={c.y + 14} textAnchor="middle" className="hc-letter">
            {c.letter}
          </text>
          {/* The same cell, expanded: the word the letter is short for. */}
          <text x={c.x} y={c.y + 6} textAnchor="middle" className="hc-word">
            {c.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- the figure ---------- */

export function HiveCorners() {
  const [lit, setLit] = useState<number | null>(null);
  const [logo, setLogo] = useState<string | undefined>(LOGO_SRC);
  const dialog = useRef<HTMLDialogElement>(null);
  const pageHive = useRef<SVGSVGElement>(null);
  const miniHive = useRef<SVGSVGElement>(null);
  const flight = useRef<Flight>({ anims: [], closing: false });
  /* Whether the press that ends in a click began on the backdrop. A drag
   * that starts on the text and lets go outside it (selecting a sentence)
   * clicks the dialog element too, and must not close it. */
  const pressedOutside = useRef(false);
  const { hash } = useLocation();

  const onLogoError = () =>
    setLogo((s) => (s === LOGO_FALLBACK ? undefined : LOGO_FALLBACK));

  /* showModal() alone focuses the cross, and Chrome rings it even after a
   * mouse click. Focus goes to the window itself instead; the cross is one
   * Tab away, and Escape closes it from anywhere. The page's hive hides
   * while the window is open (HiveCorners.css), so the one in the window
   * reads as the same hive. */
  const openFramework = useCallback(() => {
    const d = dialog.current;
    const mini = miniHive.current;
    if (!d || d.open) return;
    const page = pageHive.current?.getBoundingClientRect();
    stopFlight(d, flight.current);
    d.showModal();
    d.focus();
    if (mini && page && onScreen(page) && !still()) {
      flyIn(d, mini, page, flight.current);
    }
  }, []);

  /* The cross, the backdrop and Escape all close it through here. The
   * dialog's close event tidies up after any way out. */
  const closeFramework = useCallback(() => {
    const d = dialog.current;
    const mini = miniHive.current;
    const f = flight.current;
    if (!d?.open || f.closing) return;
    stopFlight(d, f);
    const page = pageHive.current?.getBoundingClientRect();
    if (!mini || !page || !onScreen(page) || still()) {
      d.close();
      return;
    }
    f.closing = true;
    flyOut(d, mini, page, f).then(
      () => d.close(),
      () => {},
    );
  }, []);

  /* A link or a search result naming the framework opens it. */
  useEffect(() => {
    if (hash === `#${FRAMEWORK.anchor}`) openFramework();
  }, [hash, openFramework]);

  return (
    <figure className="hive-corners">
      {/* The heading is gone by design - the hive drawing carries the idea -
       * but the timeline still deep-links here, so its id stays on the
       * copy block. */}
      <div className="hc-copy" id={HIVE_CORNERS.anchor}>
        {HIVE_CORNERS.copy.map((paragraph) => (
          <p key={paragraph}>
            <MarkedInline text={paragraph} />
          </p>
        ))}
      </div>

      {/* The click is a pointer shortcut to the button below, which is the
       * real control, so the frame itself takes no focus or role. */}
      <div className="hc-frame" onClick={openFramework}>
        <HiveDrawing
          className="hc-svg"
          svgRef={pageHive}
          logo={logo}
          onLogoError={onLogoError}
          lit={lit}
          onLight={setLit}
        />

        <button
          type="button"
          className="hc-more"
          aria-haspopup="dialog"
          aria-controls={FRAMEWORK.anchor}
        >
          {/* Drawn by hand to go with the hive: a loop-the-loop that ends
              pointing straight up at it. Static. */}
          <svg className="hc-more-arrow" viewBox="0 0 96 76" aria-hidden>
            <path d="M 93 66 C 74 72, 54 70, 49 56 C 44 41, 67 38, 65 54 C 63 70, 24 67, 20 9" />
            <path d="M 9.5 20 L 20 9 L 30.5 19.5" />
          </svg>
          <span className="hc-more-label">Click to read more</span>
        </button>
      </div>

      {/* Out of the grid while shut (display: none), in the top layer while
       * open, so where it sits in the figure does not matter. The panel
       * inside fills the dialog, so a click that lands on the dialog element
       * itself is a click on the backdrop around it. */}
      <dialog
        ref={dialog}
        className="hc-dialog"
        id={FRAMEWORK.anchor}
        tabIndex={-1}
        aria-labelledby="hc-framework-heading"
        onPointerDown={(e) => {
          pressedOutside.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          if (pressedOutside.current && e.target === e.currentTarget) {
            closeFramework();
          }
        }}
        onCancel={(e) => {
          e.preventDefault();
          closeFramework();
        }}
        onClose={(e) => {
          stopFlight(e.currentTarget, flight.current);
          flight.current.closing = false;
        }}
      >
        <div className="hc-framework">
          <button
            type="button"
            className="hc-close"
            data-fade
            onClick={closeFramework}
            aria-label="Close the HIVE framework"
            title="Close"
          >
            {/* The DBTL panel's cross: two strokes, square ends. */}
            <svg className="hc-close-cross" viewBox="0 0 16 16" aria-hidden>
              <path d="M3,3 L13,13 M13,3 L3,13" />
            </svg>
          </button>

          <header className="hc-framework-head">
            <HiveDrawing
              className="hc-mini"
              svgRef={miniHive}
              logo={logo}
              onLogoError={onLogoError}
              lit={null}
            />
            <div data-fade>
              <h2 id="hc-framework-heading" className="hc-framework-heading">
                {FRAMEWORK.heading}
              </h2>
              <p className="hc-framework-lead">
                <MarkedInline text={FRAMEWORK.lead} />
              </p>
            </div>
          </header>

          {/* Each corner's letter in a cell of its own, heading-sized, so
              the four read before the paragraphs do. */}
          <ol className="hc-stages" data-fade>
            {FRAMEWORK.stages.map((stage) => (
              <li key={stage.letter} className="hc-stage">
                <svg
                  className="hc-stage-cell"
                  viewBox="-50 -50 100 100"
                  aria-hidden
                >
                  <polygon points={hexPoints(0, 0, 46)} />
                  <text y={18} textAnchor="middle">
                    {stage.letter}
                  </text>
                </svg>
                <p>
                  <MarkedInline text={stage.text} />
                </p>
              </li>
            ))}
          </ol>
        </div>
      </dialog>

      <div className="hc-onward">
        <p id="hc-onward-lead" className="hc-onward-lead">
          <Marked text={HIVE_CORNERS.onwardLead} />
        </p>
        <nav className="hc-links" aria-labelledby="hc-onward-lead">
          {HIVE_CORNERS.onward.map((l) => (
            <Link key={l.to} to={l.to}>
              <span>
                <Marked text={l.label} />
              </span>
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
