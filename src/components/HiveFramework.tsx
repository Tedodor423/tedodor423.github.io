import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { useLocation } from "react-router-dom";
import { hexPoints } from "../utils/worldHexes";
import { HIVE_FRAMEWORK } from "../data/hiveFramework";
import { MarkedInline } from "./Marked";
import "./HiveFramework.css";

/* The HIVE framework: the hive it is named for, drawn on the page, and the
 * framework written out in full in a window over the page.
 *
 * The bee scene's hive box, a letter cell on each of its four corners, read
 * clockwise from the top left: Hear, Investigate, Verdict, Evaluate, and
 * Evaluate sits next to Hear again, where the loop closes. Each cell
 * carries its letter and, under it, the word the letter is short for, so
 * the drawing reads on its own; pointing at one lights it. Under the hive,
 * "Click to see the explanation" is written like a note beside a drawing,
 * with a hand-drawn arrow looping up to the hive: that note is the control
 * a keyboard or a screen reader uses, and a click anywhere on the hive does
 * the same. The window is a native
 * modal <dialog>, so Escape closes it and focus stays inside it while it is
 * open; the cross in its corner and a click outside it close it too. A link
 * or a search result naming the window's anchor opens it.
 *
 * Opening it, the hive itself shrinks and flies up into the top of the
 * window, where a small copy of it heads the framework, and the words fade
 * in once it has landed; closing it, the words go first and the hive flies
 * back to its place on the page. Reduced motion, or a hive scrolled out of
 * sight, and the window simply opens and shuts.
 *
 * The page decides where the two parts go (HpIntro puts the hive and its
 * note in place of its map, and the window beside them), so this hands them
 * over through its children rather than laying them out itself.
 */

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

/** Big enough to hold the letter and, under it, the longest word
 * ("Investigate") inside the cell's flat sides. */
const R = 58;

/* Served from static.igem.wiki, the same upload the bee scene flies home to. */
const HIVE_SRC = "https://static.igem.wiki/teams/6391/wiki/assets/hive.svg";

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

/** Where the page's hive is, if it can be seen to fly from: on screen, and
 * not faded or hidden by the page around it (HpIntro shows it for one line
 * of its slide only). Its own hiding while the window is open is on the
 * drawing, so the check is on the box around it. */
function showing(svg: SVGSVGElement | null): DOMRect | undefined {
  const box = svg?.parentElement;
  if (!svg || !box) return undefined;
  if (
    box.checkVisibility &&
    !box.checkVisibility({ opacityProperty: true, visibilityProperty: true })
  ) {
    return undefined;
  }
  const r = svg.getBoundingClientRect();
  return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight
    ? r
    : undefined;
}

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
    shown: {
      backgroundColor: cs.backgroundColor,
      borderColor: cs.borderTopColor,
    },
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
  lit: number | null;
  /** Given, the drawing is the page's figure: titled for screen readers and
   * its cells lit by pointing at them. Omitted, it is the window's copy,
   * decoration over words that say the same. */
  onLight?: (i: number | null) => void;
}

function HiveDrawing({ className, svgRef, lit, onLight }: HiveDrawingProps) {
  return (
    <svg
      ref={svgRef}
      viewBox="-20 -45 470 380"
      className={className}
      {...(onLight
        ? { role: "img", "aria-labelledby": "hf-title" }
        : { "aria-hidden": true })}
    >
      {onLight && (
        <title id="hf-title">
          The HIVE framework: Hear, Investigate, Verdict and Evaluate on the
          four corners of a hive, read clockwise from the top left.
        </title>
      )}

      <image
        href={HIVE_SRC}
        x={0}
        y={0}
        width={HIVE_W}
        height={HIVE_H}
        className="hf-hive"
      />

      {CELLS.map((c, i) => (
        <g
          key={c.letter}
          className={`hf-cell${lit === i ? " is-lit" : ""}`}
          {...(onLight
            ? {
                onPointerEnter: () => onLight(i),
                onPointerLeave: () => onLight(null),
              }
            : {})}
        >
          <polygon points={hexPoints(c.x, c.y, R)} className="hf-hex" />
          <text x={c.x} y={c.y + 4} textAnchor="middle" className="hf-letter">
            {c.letter}
          </text>
          {/* Under the letter, the word it is short for. */}
          <text x={c.x} y={c.y + 27} textAnchor="middle" className="hf-word">
            {c.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- the parts ---------- */

export interface HiveFrameworkParts {
  /** The hive drawn on the page, with the note under it that opens the
   * window; a click on the hive opens it too. */
  hive: ReactNode;
  /** The window. It is in the top layer while open, so where it sits in the
   * page does not matter, as long as it is inside an element that may hold
   * a <dialog>. */
  window: ReactNode;
}

export function HiveFramework({
  label,
  children,
}: {
  /** What the note under the hive says. */
  label: string;
  children: (parts: HiveFrameworkParts) => ReactNode;
}) {
  const [lit, setLit] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const pageHive = useRef<SVGSVGElement>(null);
  const miniHive = useRef<SVGSVGElement>(null);
  const flight = useRef<Flight>({ anims: [], closing: false });
  /* Whether the press that ends in a click began on the backdrop. A drag
   * that starts on the text and lets go outside it (selecting a sentence)
   * clicks the dialog element too, and must not close it. */
  const pressedOutside = useRef(false);
  const { hash } = useLocation();

  /* showModal() alone focuses the cross, and Chrome rings it even after a
   * mouse click. Focus goes to the window itself instead; the cross is one
   * Tab away, and Escape closes it from anywhere. The page's hive hides
   * while the window is open (HiveFramework.css), so the one in the window
   * reads as the same hive. */
  const openFramework = useCallback(() => {
    const d = dialog.current;
    const mini = miniHive.current;
    if (!d || d.open) return;
    const page = showing(pageHive.current);
    stopFlight(d, flight.current);
    setLit(null);
    d.showModal();
    d.focus();
    if (mini && page && !still()) {
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
    const page = showing(pageHive.current);
    if (!mini || !page || still()) {
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
    if (hash === `#${HIVE_FRAMEWORK.anchor}`) openFramework();
  }, [hash, openFramework]);

  /* A click on the hive is a pointer shortcut to the note under it, which
   * is the real control, so the hive takes no focus or role of its own. */
  const hive = (
    <div className="hf-page">
      <div className="hf-page-hive" onClick={openFramework}>
        <HiveDrawing
          className="hf-page-svg"
          svgRef={pageHive}
          lit={lit}
          onLight={setLit}
        />
      </div>
      <button
        type="button"
        className="hf-more"
        aria-haspopup="dialog"
        aria-controls={HIVE_FRAMEWORK.anchor}
        onClick={openFramework}
      >
        {/* Drawn by hand to go with the hive: a loop-the-loop that ends
            pointing straight up at it. Static. */}
        <svg className="hf-more-arrow" viewBox="0 0 96 76" aria-hidden>
          <path d="M 93 66 C 74 72, 54 70, 49 56 C 44 41, 67 38, 65 54 C 63 70, 24 67, 20 9" />
          <path d="M 9.5 20 L 20 9 L 30.5 19.5" />
        </svg>
        <span className="hf-more-label">{label}</span>
      </button>
    </div>
  );

  /* The panel inside fills the dialog, so a click that lands on the dialog
   * element itself is a click on the backdrop around it. */
  const frameworkWindow = (
    <dialog
      ref={dialog}
      className="hf-dialog"
      id={HIVE_FRAMEWORK.anchor}
      tabIndex={-1}
      aria-labelledby="hf-heading"
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
      <div className="hf-framework">
        <button
          type="button"
          className="hf-close"
          data-fade
          onClick={closeFramework}
          aria-label="Close the HIVE framework"
          title="Close"
        >
          {/* The DBTL panel's cross: two strokes, square ends. */}
          <svg className="hf-close-cross" viewBox="0 0 16 16" aria-hidden>
            <path d="M3,3 L13,13 M13,3 L3,13" />
          </svg>
        </button>

        <header className="hf-head">
          <HiveDrawing className="hf-mini" svgRef={miniHive} lit={null} />
          <div data-fade>
            <h2 id="hf-heading" className="hf-heading">
              {HIVE_FRAMEWORK.heading}
            </h2>
            <p className="hf-lead">
              <MarkedInline text={HIVE_FRAMEWORK.lead} />
            </p>
          </div>
        </header>

        {/* Each corner's letter in a cell of its own, heading-sized, so
            the four read before the paragraphs do. */}
        <ol className="hf-stages" data-fade>
          {HIVE_FRAMEWORK.stages.map((stage) => (
            <li key={stage.letter} className="hf-stage">
              <svg
                className="hf-stage-cell"
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
  );

  return <>{children({ hive, window: frameworkWindow })}</>;
}
