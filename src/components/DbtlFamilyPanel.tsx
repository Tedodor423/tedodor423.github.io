import { useEffect, useMemo, useRef, useState } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import {
  STAGE_NAME,
  STAGE_ORDER,
  splitName,
  type Family,
  type StageKey,
} from "../utils/dbtlCycles";
import { DbtlDial } from "./DbtlDial";

/* What is inside an opened hexagon: one overarching cycle, all of its turns.
 *
 * ONE STAGE AT A TIME. The panel shows a single beat of a single turn, and moving
 * on is a click: the two arrows, a quarter of the dial, or one of the markers.
 * Nothing scrolls past anything else. The four controls are four ways of setting
 * the same index into `stops`, which is every turn crossed with its four stages in
 * reading order, so PREVIOUS and NEXT run straight through the whole workstream
 * (Learn of 1.1 is followed by Design of 1.2) and the dial and the markers follow.
 *
 * A stage whose text is longer than the panel scrolls inside its own box. That is
 * the only scrolling here, and it never crosses a heading.
 */

/* Internal links have to become router links here for the same reason they do in
 * MarkdownPage: a plain href would miss the /oxford/ base path. */
const MD: Components = {
  // A five-column comparison will not fit the column a hexagon leaves. Wrapped
  // so it scrolls sideways on its own rather than stretching the panel.
  table: ({ children, ...props }) => (
    <div className="dbtl-stage-table">
      <table {...props}>{children}</table>
    </div>
  ),
  a: ({ href, children, ...props }) => {
    if (href?.startsWith("/") && !href.startsWith("//")) {
      return <Link to={href}>{children}</Link>;
    }
    const external = /^https?:/i.test(href ?? "");
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
};

function Prose({ children }: { children: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={MD}>
      {children}
    </Markdown>
  );
}

/** A chevron, drawn rather than borrowed from an icon set. */
function Chevron({ back }: { back?: boolean }) {
  return (
    <svg className="dbtl-step-chevron" viewBox="0 0 12 20" aria-hidden="true">
      <path d={back ? "M9,2 L3,10 L9,18" : "M3,2 L9,10 L3,18"} />
    </svg>
  );
}

/** The cross on the close control. Two strokes, same hand as the chevron. */
function Cross() {
  return (
    <svg className="dbtl-close-cross" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3,3 L13,13 M13,3 L3,13" />
    </svg>
  );
}

/** One place in the record: a turn of the cycle, and one of its four stages. */
interface Stop {
  cycle: string;
  stage: StageKey;
}

interface PanelProps {
  family: Family;
  /** A turn to open at, from a `#cycle-3-4` link. */
  startAt?: string;
  onClose: () => void;
}

export function DbtlFamilyPanel({ family, startAt, onClose }: PanelProps) {
  const stops = useMemo<Stop[]>(
    () =>
      family.cycles.flatMap((cycle) =>
        STAGE_ORDER.map((stage) => ({ cycle: cycle.id, stage })),
      ),
    [family],
  );

  const [at, setAt] = useState(() => {
    const found = stops.findIndex((stop) => stop.cycle === startAt);
    return found === -1 ? 0 : found;
  });
  const [lit, setLit] = useState<StageKey | null>(null);
  const close = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);

  const stop = stops[Math.min(at, stops.length - 1)];
  const cycle =
    family.cycles.find((one) => one.id === stop.cycle) ?? family.cycles[0];
  const body = cycle.stages[stop.stage];
  const opens = stop.stage === STAGE_ORDER[0];

  // Opening a cell unmounts the button that was focused, which would otherwise
  // drop a keyboard reader back to the top of the document.
  useEffect(() => {
    close.current?.focus();
  }, []);

  /* A new stage starts at its own beginning, not where the last one was left. */
  useEffect(() => {
    if (box.current) box.current.scrollTop = 0;
  }, [at]);

  const goTo = (index: number) =>
    setAt(Math.max(0, Math.min(stops.length - 1, index)));

  /* The heading is the question and nothing else: the lab is already said by the
   * colour of the rule round the panel. A family with no question written yet
   * (the family file carries a TODO for it) falls back to its name. */
  const asked = Boolean(family.question);
  const turn = family.cycles.findIndex((one) => one.id === stop.cycle);

  return (
    <>
      {/* In the flat bottom of the hexagon, which is the one edge with width to
          spare and nothing else wanting it. */}
      <button
        type="button"
        className="dbtl-close"
        ref={close}
        onClick={onClose}
        aria-label="Close this cycle"
        title="Close"
      >
        <Cross />
      </button>

      <div className="dbtl-panel">
        <header className="dbtl-panel-head">
          <h3>{asked ? family.question : splitName(family.name).rest}</h3>
        </header>

        <div className="dbtl-panel-main">
          <div className="dbtl-reader">
            {/* Which turn of the cycle this is, and roughly when it ran. */}
            <p className="dbtl-reader-now">
              <span className="dbtl-reader-num">{cycle.number}</span>
              <span className="dbtl-reader-q">{cycle.question}</span>
              {cycle.when ? (
                <span className="dbtl-reader-when">{cycle.when}</span>
              ) : null}
            </p>

            {/* Keyed on the stop, so React replaces the box rather than editing
                it in place and the new stage can fade in. */}
            <div
              className="dbtl-stage"
              key={`${stop.cycle}:${stop.stage}`}
              ref={box}
              tabIndex={0}
            >
              {/* The family's own standfirst, where it exists, on the stop the
                  reader lands on when the hexagon opens. It introduces the whole
                  overarching cycle rather than any one stage, and two of them
                  carry a visible TODO inside it, so it cannot be left unrendered. */}
              {at === 0 && family.blurb ? (
                <div className="dbtl-stage-blurb">
                  <Prose>{family.blurb}</Prose>
                </div>
              ) : null}

              <h4 className="dbtl-stage-name">
                {STAGE_NAME[stop.stage]}
                <span className="dbtl-stage-status">{cycle.status}</span>
              </h4>

              {/* The Question beat frames the whole turn, so it sits over the
                  turn's first stage and not over each of them. */}
              {opens && cycle.framing ? (
                <div className="dbtl-stage-framing">
                  <Prose>{cycle.framing}</Prose>
                </div>
              ) : null}
              {opens && cycle.summary ? (
                <div className="dbtl-stage-framing">
                  <Prose>{cycle.summary}</Prose>
                </div>
              ) : null}

              {body ? (
                <Prose>{body}</Prose>
              ) : (
                <p className="dbtl-stage-gap">
                  Not written into the four stages yet.
                </p>
              )}
            </div>
          </div>

          {/* The controls, all in one column: the two steps through the stages,
              then one small hexagon per cycle with the current one grown into the
              dial, like the dots under a phone screen, so it is visible that there
              is more to either side. */}
          <div className="dbtl-marks">
            <div className="dbtl-steps">
              <button
                type="button"
                className="dbtl-step"
                onClick={() => goTo(at - 1)}
                disabled={at === 0}
              >
                <Chevron back />
                <span className="dbtl-step-words">Previous</span>
              </button>
              <button
                type="button"
                className="dbtl-step"
                onClick={() => goTo(at + 1)}
                disabled={at === stops.length - 1}
              >
                <span className="dbtl-step-words">Next</span>
                <Chevron />
              </button>
            </div>

            <div className="dbtl-marks-row">
              {family.cycles.map((one, index) => {
                const active = one.id === stop.cycle;
                const first = index * STAGE_ORDER.length;
                return (
                  <div
                    key={one.id}
                    className="dbtl-mark"
                    data-active={active ? "yes" : "no"}
                  >
                    {active ? (
                      <DbtlDial
                        current={stop.stage}
                        lit={lit}
                        onLight={setLit}
                        onPick={(stage) =>
                          goTo(first + STAGE_ORDER.indexOf(stage))
                        }
                        label={one.number}
                      />
                    ) : (
                      <button
                        type="button"
                        className="dbtl-mark-hit"
                        title={`${one.number} ${one.question}`}
                        aria-label={`Go to cycle ${one.number}: ${one.question}`}
                        onClick={() => goTo(first)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {/* Only worth saying when there is more than one. */}
            {family.cycles.length > 1 ? (
              <p className="dbtl-marks-count">
                Cycle {turn + 1} of {family.cycles.length}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
