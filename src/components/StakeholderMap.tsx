import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  HEXES,
  HEX_R,
  hexPoints,
  latToY,
  lonToX,
  ORIGIN_X,
  ORIGIN_Y,
  COL_W,
  ROW_H,
} from "../utils/worldHexes";
import {
  QUESTION_IDS,
  QUESTION_TITLES,
  STAKEHOLDERS,
  questionsOf,
  type QuestionId,
  type Stakeholder,
} from "../data/stakeholders";
import { Marked } from "./Marked";
import "./StakeholderMap.css";

/* Who we spoke to, and where.
 *
 * The map is the hexagon world map from the team asset set, rebuilt from its
 * lattice (src/utils/worldHexes.ts) rather than dropped in as an SVG, so that a
 * stakeholder's cell can be filled differently instead of having a pin laid on
 * top of it. The honeycomb reading is the reason that asset was chosen and it
 * is the only decorative liberty taken here.
 *
 * It groups by country, for two reasons. One is resolution: a cell spans about
 * 4.7 degrees, so Oxford, Reading and Bristol are the same cell and no amount
 * of care separates them. The other is the argument of the page: the case
 * studies are organised by jurisdiction, so country is the unit that means
 * something.
 *
 * The question filter is the team's own idea ("stakeholders tied together into
 * one HONEY cycle are connected by visible links"): pick a question and the
 * map keeps only the people who fed it, with the anchor interview outlined.
 *
 * Nothing here is the only route to its content. The roster below the map
 * carries every profile in the page source, because the wiki rules forbid
 * putting a result or a citation behind a hover, and because a judge reading
 * with a keyboard or a screen reader has to reach all of it.
 */

interface Cell {
  x: number;
  y: number;
  people: Stakeholder[];
}

interface Region {
  name: string;
  people: Stakeholder[];
  cells: Cell[];
  /** Where a pinned card points, in viewBox units. */
  anchor: { x: number; y: number };
}

/** The lattice cell a stakeholder sits on: the override, or the nearest. */
function cellFor(s: Stakeholder): { x: number; y: number } {
  if (s.hex) {
    const [col, row] = s.hex;
    return { x: ORIGIN_X + COL_W * col, y: ORIGIN_Y + ROW_H * row };
  }
  const x = lonToX(s.lon);
  const y = latToY(s.lat);
  let best = HEXES[0];
  let bestD = Infinity;
  for (const h of HEXES) {
    const d = (h.x - x) ** 2 + (h.y - y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = h;
    }
  }
  return { x: best.x, y: best.y };
}

const keyOf = (c: { x: number; y: number }) =>
  `${c.x.toFixed(1)}:${c.y.toFixed(1)}`;

function buildRegions(): Region[] {
  const byRegion = new Map<string, Stakeholder[]>();
  for (const s of STAKEHOLDERS) {
    const list = byRegion.get(s.region) ?? [];
    list.push(s);
    byRegion.set(s.region, list);
  }

  return [...byRegion.entries()].map(([name, people]) => {
    const cells = new Map<string, Cell>();
    for (const s of people) {
      const c = cellFor(s);
      const cell = cells.get(keyOf(c)) ?? { ...c, people: [] };
      cell.people.push(s);
      cells.set(keyOf(c), cell);
    }
    const list = [...cells.values()];
    // Pinned cards point at the middle of the region's cells, so a region
    // spread over a continent does not anchor its card to one corner of itself.
    const anchor = {
      x: list.reduce((t, c) => t + c.x, 0) / list.length,
      y: list.reduce((t, c) => t + c.y, 0) / list.length,
    };
    return { name, people, cells: list, anchor };
  });
}

/** Viewport of the lattice, with room for the enlarged active cell. */
const VIEW = { x: 12, y: 1, w: 1808, h: 729 };

/**
 * How many profiles a hover shows before it stops listing them. The UK has
 * eleven, and eleven full profiles is a card taller than the map it is
 * pointing at. Selecting the region opens all of them.
 */
const PREVIEW = 5;

function QuestionTags({ s }: { s: Stakeholder }) {
  const tags = [
    ...(s.anchors ?? []).map((q) => ({ q, kind: "anchor" })),
    ...s.questions.map((q) => ({ q, kind: "listed" })),
    ...(s.provisional ?? []).map((q) => ({ q, kind: "provisional" })),
  ];
  if (!tags.length) return null;
  return (
    <p className="sm-tags">
      {tags.map(({ q, kind }) => (
        <span
          key={q}
          className={`sm-tag sm-tag--${kind}`}
          title={QUESTION_TITLES[q]}
        >
          {q}
          {kind === "anchor" ? " anchor" : ""}
          {kind === "provisional" ? "?" : ""}
        </span>
      ))}
    </p>
  );
}

/* A profile appears twice: in the hover card and in the roster below the map.
 * Only the roster copy is given an id, so a search result has one place to
 * land and the document has no duplicate ids.
 *
 * <Marked> is what puts a honey background on the words a reader searched for
 * when they arrive here from a result. It renders plain text otherwise. */
function Profile({
  s,
  detail,
  anchor,
}: {
  s: Stakeholder;
  detail: boolean;
  anchor?: boolean;
}) {
  return (
    <li className="sm-profile" id={anchor ? `sm-${s.id}` : undefined}>
      {s.consent ? (
        <>
          <p className="sm-name sm-name--withheld">Interview withheld</p>
          <p className="sm-role">{s.consent.note}</p>
        </>
      ) : (
        <>
          <p className="sm-name">
            <Marked text={s.name} />
          </p>
          <p className="sm-role">
            <Marked text={s.role} />
          </p>
          <p className="sm-meta">
            <Marked text={s.place} />
            {s.date ? ` · ${s.date}` : " · date not recorded"}
          </p>
          <QuestionTags s={s} />
          {detail && s.quote && (
            <p className="sm-quote">
              &ldquo;
              <Marked text={s.quote} />
              &rdquo;
            </p>
          )}
          {detail && s.learnt.length > 0 && (
            <ul className="sm-learnt">
              {s.learnt.map((l) => (
                <li key={l}>
                  <Marked text={l} />
                </li>
              ))}
            </ul>
          )}
          {detail && s.changed && (
            <p className="sm-changed">
              <span className="sm-changed-label">What it changed</span>
              <Marked text={s.changed} />
            </p>
          )}
        </>
      )}
    </li>
  );
}

export function StakeholderMap() {
  const regions = useMemo(buildRegions, []);
  const marked = useMemo(
    () => new Set(regions.flatMap((r) => r.cells.map(keyOf))),
    [regions],
  );
  const withheld = STAKEHOLDERS.filter((s) => s.consent).length;

  const [filter, setFilter] = useState<QuestionId | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  /** The people a region shows under the current filter, anchors first. */
  const visible = useCallback(
    (people: Stakeholder[]) => {
      if (!filter) return people;
      const q = filter;
      return people
        .filter((p) => questionsOf(p).includes(q))
        .sort(
          (a, b) =>
            Number(b.anchors?.includes(q) ?? false) -
            Number(a.anchors?.includes(q) ?? false),
        );
    },
    [filter],
  );

  const activeName = pinned ?? hovered;
  const active = regions.find((r) => r.name === activeName) ?? null;
  const activePeople = active ? visible(active.people) : [];

  // Escape closes a pinned card, which is the only way out for a keyboard user
  // who opened one and does not want to tab back to it.
  useEffect(() => {
    if (!pinned) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPinned(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pinned]);

  const trackCursor = useCallback((e: React.PointerEvent) => {
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box) return;
    setCursor({ x: e.clientX - box.left, y: e.clientY - box.top });
  }, []);

  // A pinned card stops chasing the pointer and sits by the region instead,
  // converting the anchor from viewBox units to rendered pixels.
  const cardAt = useMemo(() => {
    if (!active || !pinned) return cursor;
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box) return cursor;
    return {
      x: ((active.anchor.x - VIEW.x) / VIEW.w) * box.width,
      y: ((active.anchor.y - VIEW.y) / VIEW.h) * box.height,
    };
  }, [active, pinned, cursor]);

  const box = wrapRef.current?.getBoundingClientRect();
  // Keep the card inside the map rather than letting it run off an edge:
  // left of the pointer on the right half, above it on the lower half.
  const flip = Boolean(box && cardAt.x > box.width * 0.55);
  const raise = Boolean(box && cardAt.y > box.height * 0.5);

  const pick = (q: QuestionId | null) => {
    setFilter(q);
    setPinned(null);
    setHovered(null);
  };

  return (
    <section className="stakeholder-map" aria-labelledby="sm-heading">
      <h3 id="sm-heading" className="sm-heading">
        Who we spoke to
      </h3>
      <p className="sm-standfirst">
        {STAKEHOLDERS.length} conversations across {regions.length} countries,{" "}
        {withheld} of them withheld pending consent. Hover a marked cell for the
        people there, or select it to keep the card open. Pick a question to
        keep only the people who fed it; the anchor interview is outlined. Every
        profile is also listed underneath.
      </p>

      <div
        className="sm-filter"
        role="group"
        aria-label="Show one HONEY question"
      >
        <button
          type="button"
          className={filter ? undefined : "is-on"}
          aria-pressed={!filter}
          onClick={() => pick(null)}
        >
          All
        </button>
        {QUESTION_IDS.map((q) => (
          <button
            key={q}
            type="button"
            className={filter === q ? "is-on" : undefined}
            aria-pressed={filter === q}
            title={QUESTION_TITLES[q]}
            onClick={() => pick(filter === q ? null : q)}
          >
            {q}
          </button>
        ))}
      </div>
      {filter && (
        <p className="sm-filter-title">
          <strong>{filter}</strong> {QUESTION_TITLES[filter]}
        </p>
      )}

      <div
        className="sm-canvas"
        ref={wrapRef}
        onPointerMove={trackCursor}
        onPointerLeave={() => setHovered(null)}
      >
        <svg
          viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
          className="sm-svg"
          role="img"
          aria-label={`World map. Stakeholders in ${regions
            .map((r) => r.name)
            .join(", ")}.`}
          onClick={(e) => {
            // A click on the map itself, rather than on a region, lets go.
            if (e.target === e.currentTarget) setPinned(null);
          }}
        >
          {/* Land. Inert: it is the ground the markers sit on, nothing more. */}
          <g className="sm-land">
            {HEXES.map((h) =>
              marked.has(keyOf(h)) ? null : (
                <polygon
                  key={`${h.col}-${h.row}`}
                  points={hexPoints(h.x, h.y)}
                />
              ),
            )}
          </g>

          {regions.map((r) => {
            const people = visible(r.people);
            const live = people.length > 0;
            const isActive = live && r.name === activeName;
            const isPinned = r.name === pinned;
            return (
              <g
                key={r.name}
                className={`sm-region${isActive ? " is-active" : ""}${
                  isPinned ? " is-pinned" : ""
                }${live ? "" : " is-empty"}`}
                tabIndex={live ? 0 : undefined}
                role={live ? "button" : undefined}
                aria-pressed={live ? isPinned : undefined}
                aria-label={
                  live
                    ? `${r.name}: ${people.length} ${
                        people.length === 1 ? "conversation" : "conversations"
                      }`
                    : undefined
                }
                onPointerEnter={live ? () => setHovered(r.name) : undefined}
                onFocus={live ? () => setHovered(r.name) : undefined}
                onBlur={live ? () => setHovered(null) : undefined}
                onClick={
                  live ? () => setPinned(isPinned ? null : r.name) : undefined
                }
                onKeyDown={
                  live
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setPinned(isPinned ? null : r.name);
                        }
                      }
                    : undefined
                }
              >
                {r.cells.map((c) => {
                  const lit = !filter || visible(c.people).length > 0;
                  const anchor = Boolean(
                    filter && c.people.some((p) => p.anchors?.includes(filter)),
                  );
                  return (
                    <polygon
                      key={keyOf(c)}
                      className={`sm-marker${lit ? "" : " is-dim"}${
                        anchor ? " is-anchor" : ""
                      }`}
                      points={hexPoints(
                        c.x,
                        c.y,
                        isActive && lit ? HEX_R + 2.6 : HEX_R,
                      )}
                    />
                  );
                })}
                {/* A comfortable target: the drawn cell is 22 units across. */}
                {live &&
                  r.cells
                    .filter((c) => !filter || visible(c.people).length > 0)
                    .map((c) => (
                      <circle
                        key={`hit-${keyOf(c)}`}
                        className="sm-hit"
                        cx={c.x}
                        cy={c.y}
                        r={17}
                      />
                    ))}
              </g>
            );
          })}
        </svg>

        {active && activePeople.length > 0 && (
          <div
            className={`sm-card${pinned ? " is-pinned" : ""}${
              flip ? " is-flipped" : ""
            }${raise ? " is-raised" : ""}`}
            style={{ left: `${cardAt.x}px`, top: `${cardAt.y}px` }}
            role={pinned ? "dialog" : undefined}
            aria-label={pinned ? `${active.name} stakeholders` : undefined}
          >
            <div className="sm-card-head">
              <h4 className="sm-card-title">{active.name}</h4>
              <span className="sm-card-count">
                {activePeople.length}{" "}
                {activePeople.length === 1 ? "conversation" : "conversations"}
                {filter ? ` on ${filter}` : ""}
              </span>
              {pinned && (
                <button
                  type="button"
                  className="sm-close"
                  onClick={() => setPinned(null)}
                  aria-label="Close"
                >
                  Close
                </button>
              )}
            </div>
            <ul className="sm-list">
              {(pinned ? activePeople : activePeople.slice(0, PREVIEW)).map(
                (s) => (
                  <Profile key={s.id} s={s} detail={Boolean(pinned)} />
                ),
              )}
            </ul>
            {!pinned && (
              <p className="sm-hint">
                {activePeople.length > PREVIEW
                  ? `and ${activePeople.length - PREVIEW} more. Select to read what they told us.`
                  : "Select to read what they told us."}
              </p>
            )}
          </div>
        )}
      </div>

      <details className="sm-roster">
        <summary>
          The full record, as text ({STAKEHOLDERS.length} conversations)
        </summary>
        {regions.map((r) => (
          <div key={r.name} className="sm-roster-region">
            <h4>{r.name}</h4>
            <ul className="sm-list">
              {r.people.map((s) => (
                <Profile key={s.id} s={s} detail anchor />
              ))}
            </ul>
          </div>
        ))}
      </details>
    </section>
  );
}
