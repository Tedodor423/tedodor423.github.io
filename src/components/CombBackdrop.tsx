import type { CSSProperties, ReactElement, ReactNode } from "react";
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useState,
} from "react";
import "./CombBackdrop.css";

/* The brood comb behind a whole page, from the title down to the footer: the
 * Bee Lab pages (Page.backdrop in src/pages.ts). The page is laid over the
 * photograph and its type inverts; CombBackdrop.css has the rules.
 *
 * The photograph is served from static.igem.wiki. It is the uploads tool's
 * .avif conversion of comb-bg.jpg, a 2000px, 291 KB copy of the 6240px, 12 MB
 * comb.JPG in wiki-assets-source/images_dev/. The comb bands (CombBands) paint
 * the same file. If it fails to load, the page shows a plain dark wax instead.
 */
export const COMB_SRC =
  "https://static.igem.wiki/teams/6391/wiki/assets/comb-bg.avif";

/* ---------- the type trial ---------- */

/* EXPERIMENT, development only. How the type sits on the comb is still open,
 * so `yarn dev` shows a switcher in the window's corner that sets the colour
 * of every line of text on the page, and the background behind it, at once.
 * The production build ships DEFAULT_TRIAL. Set SHOW_TRIAL to true to put the
 * switcher on the published preview too. Once the team has chosen, keep that
 * pair as the defaults in CombBackdrop.css and delete the switcher, the
 * data-type / data-ground / data-shape rules it drives, and <Ink> with the
 * places it is used if the choice is not "behind each line". */

const SHOW_TRIAL = import.meta.env.DEV;

/** The colour of the type, and the ground behind it ("none": straight on the
 *  comb). Curated pairs, as on the home page's mite slide, so every choice
 *  reads. */
const TEXTS = [
  { key: "wax", label: "Wax", type: "wax", ground: "none" },
  { key: "white", label: "White", type: "white", ground: "none" },
  { key: "honey", label: "Yellow", type: "honey", ground: "none" },
  { key: "wax-on-black", label: "Wax on black", type: "wax", ground: "black" },
  { key: "white-on-black", label: "White on black", type: "white", ground: "black" },
  { key: "honey-on-black", label: "Yellow on black", type: "honey", ground: "black" },
  { key: "black-on-wax", label: "Black on wax", type: "black", ground: "wax" },
  { key: "black-on-white", label: "Black on white", type: "black", ground: "white" },
  { key: "black-on-honey", label: "Black on yellow", type: "black", ground: "honey" },
] as const;

/** How much of the page the ground covers. */
const SHAPES = [
  { key: "line", label: "Behind each line" },
  { key: "block", label: "Behind each block" },
  { key: "sheet", label: "One sheet behind the column" },
] as const;

type TextKey = (typeof TEXTS)[number]["key"];
type ShapeKey = (typeof SHAPES)[number]["key"];
type Trial = { text: TextKey; shape: ShapeKey };

const DEFAULT_TRIAL: Trial = { text: "wax", shape: "line" };
const TRIAL_KEY = "nectar:comb-type";

function readTrial(): Trial {
  try {
    const saved = JSON.parse(localStorage.getItem(TRIAL_KEY) ?? "{}");
    return {
      text: TEXTS.some((t) => t.key === saved.text) ? saved.text : DEFAULT_TRIAL.text,
      shape: SHAPES.some((s) => s.key === saved.shape) ? saved.shape : DEFAULT_TRIAL.shape,
    };
  } catch {
    return DEFAULT_TRIAL;
  }
}

function useTrial() {
  const [trial, setTrial] = useState<Trial>(() =>
    SHOW_TRIAL ? readTrial() : DEFAULT_TRIAL,
  );
  const update = (next: Partial<Trial>) =>
    setTrial((current) => {
      const merged = { ...current, ...next };
      try {
        localStorage.setItem(TRIAL_KEY, JSON.stringify(merged));
      } catch {
        // Storage refused: the choice still holds for this visit.
      }
      return merged;
    });
  return [trial, update] as const;
}

function TypeTrial({
  trial,
  onChange,
}: {
  trial: Trial;
  onChange: (next: Partial<Trial>) => void;
}) {
  const bare = TEXTS.find((t) => t.key === trial.text)?.ground === "none";
  return (
    <fieldset className="cb-trial">
      <legend>Type trial (dev only)</legend>
      <label>
        Text{" "}
        <select
          value={trial.text}
          onChange={(e) => onChange({ text: e.target.value as TextKey })}
        >
          {TEXTS.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Background{" "}
        {/* Off while the text has no ground: there is nothing to shape. */}
        <select
          value={trial.shape}
          disabled={bare}
          onChange={(e) => onChange({ shape: e.target.value as ShapeKey })}
        >
          {SHAPES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  );
}

/* ---------- a ground behind each line ---------- */

/** True while the ground is drawn behind each line, which needs every run of
 *  text in an inline box of its own. Off everywhere else, so no other page
 *  and no other treatment gets the extra markup. */
const InkLines = createContext(false);

/** Tags that start a block of their own, which a run of text stops at. */
const BLOCKS = new Set([
  "p", "ul", "ol", "li", "pre", "blockquote", "table", "div",
  "h1", "h2", "h3", "h4", "h5", "h6", "hr",
]);

/** An element's tag: its own type, or for a react-markdown component, the
 *  tag of the Markdown node it renders. */
function tagOf(child: ReactElement): string {
  if (typeof child.type === "string") return child.type;
  const { node } = child.props as { node?: { tagName?: string } };
  return node?.tagName ?? "";
}

/**
 * The words of a paragraph, heading or list item, each run of them in a
 * span.ink that carries the ground line by line. A list item's nested list or
 * paragraphs stay outside, as the blocks they are. Renders its children
 * untouched unless the ground is behind each line.
 */
export function Ink({ children }: { children: ReactNode }) {
  const lines = useContext(InkLines);
  if (!lines) return <>{children}</>;

  const out: ReactNode[] = [];
  let run: ReactNode[] = [];
  const flush = () => {
    // A run of bare whitespace between two blocks gets no box: it would draw
    // a fleck of ground with nothing on it.
    if (run.some((c) => typeof c !== "string" || c.trim())) {
      out.push(
        <span className="ink" key={`ink-${out.length}`}>
          {run}
        </span>,
      );
    } else {
      out.push(...run);
    }
    run = [];
  };
  for (const child of Children.toArray(children)) {
    if (isValidElement(child) && BLOCKS.has(tagOf(child))) {
      flush();
      out.push(child);
    } else {
      run.push(child);
    }
  }
  flush();
  return <>{out}</>;
}

/* ---------- the backdrop ---------- */

interface CombBackdropProps {
  /** Off, the children render as they are, with no wrapper at all. */
  on: boolean;
  children: ReactNode;
}

export function CombBackdrop({ on, children }: CombBackdropProps) {
  const [trial, setTrial] = useTrial();
  if (!on) return <>{children}</>;

  const text = TEXTS.find((t) => t.key === trial.text) ?? TEXTS[0];
  const shape = text.ground === "none" ? undefined : trial.shape;

  // Handed to CSS as a custom property, so the URL lives in one place for the
  // backdrop and the bands both.
  const style = { "--comb-src": `url("${COMB_SRC}")` } as CSSProperties;

  return (
    <>
      <InkLines.Provider value={shape === "line"}>
        <div
          className="comb-backdrop"
          style={style}
          data-type={text.type}
          data-ground={text.ground}
          data-shape={shape}
        >
          {children}
        </div>
      </InkLines.Provider>
      {/* Outside the wrapper: its clip-path would cut a fixed control off
          as soon as the footer scrolled into the corner. */}
      {SHOW_TRIAL && <TypeTrial trial={trial} onChange={setTrial} />}
    </>
  );
}
