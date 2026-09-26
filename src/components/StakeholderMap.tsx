import { useEffect, useMemo, useState } from "react";
import {
  HEXES,
  HEX_R,
  hexPoints,
  latToY,
  lonToX,
  MAP_H,
  MAP_W,
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
 * lattice (src/utils/worldHexes.ts) rather than dropped in as an SVG, so that
 * a stakeholder's cell can be drawn differently instead of having a pin laid
 * on top of it. The honeycomb reading is the reason that asset was chosen.
 *
 * The design is the team's own, from the 25 September write-up: "display
 * profile photos on a map", and "stakeholders tied together into one HONEY
 * cycle are connected by visible links". So: every conversation is one cell.
 * Pointing at a cell grows it into the person's photograph and puts their
 * record in a fixed panel under the map (fixed, because a card chasing the
 * pointer cannot be read while the pointer moves). Selecting a cell keeps the
 * record there until you select something else, click away or press Escape.
 * Picking a question turns everyone who fed it into faces and joins them into
 * one network, anchors first.
 *
 * PHOTOS. A face renders only for entries carrying `photo` in
 * src/data/stakeholders.ts. The four withheld interviews never do - a face
 * identifies a person as surely as a name - and an entry whose photograph is
 * missing or not yet uploaded falls back to a drawn silhouette, so the map
 * degrades honestly rather than breaking while the uploads tool is empty.
 *
 * PLACEMENT. Each stakeholder gets their own lattice cell: the stated `hex`
 * override, or the nearest free cell to their coordinates, preferring land
 * but accepting a sea cell when the honest position is far from any land hex
 * (New Zealand) or when a cluster outgrows a small island (the UK holds
 * eleven conversations and about seven cells). A cell is a plotting position,
 * not a claim about where a person was sitting - the card states the real
 * place. Under a question filter the enlarged faces of a dense cluster relax
 * a short way apart so they stay legible; the links and the land underneath
 * keep the geography readable.
 *
 * Nothing here is the only route to its content. The roster below the map
 * carries every profile in the page source, because the wiki rules forbid
 * putting a result or a citation behind a hover, and because a judge reading
 * with a keyboard or a screen reader has to reach all of it.
 */

interface MapNode {
  s: Stakeholder;
  /** Assigned cell centre, in viewBox units. */
  x: number;
  y: number;
}

/** Everything drawn, with room for a face enlarged at the map's edge. */
const VIEW = { x: 0, y: 0, w: MAP_W, h: MAP_H };

/**
 * How far the cell under the pointer grows. The growth itself lives in the
 * CSS (filtered faces scale 1.7, the active cell 2.35); this copy of the
 * larger factor only sizes the clamping margin in relax().
 */
const ACTIVE_SCALE = 2.35;

/**
 * Centre distance below which two enlarged faces start to overlap: two hexes
 * at the 1.7 face scale sit side by side at sqrt(3) * 1.7 * HEX_R = 33.4, and
 * 36 leaves a sliver of ground between them.
 */
const FACE_MIN_DIST = 36;

/**
 * A cell in open water costs this much extra distance, so land is preferred
 * unless the honest position is genuinely offshore of every land hexagon.
 */
const SEA_PENALTY = 30;

const cellKey = (col: number, row: number) => `${col}:${row}`;
const LAND = new Set(HEXES.map((h) => cellKey(h.col, h.row)));

function centreOf(col: number, row: number) {
  return { x: ORIGIN_X + COL_W * col, y: ORIGIN_Y + ROW_H * row };
}

/**
 * One cell per stakeholder. Overrides claim their cell first; everyone else
 * takes the nearest unclaimed lattice position to their coordinates, land
 * preferred. Deterministic: array order, ties broken by row then column.
 */
function assignCells(): MapNode[] {
  const claimed = new Set<string>();
  const byId = new Map<string, MapNode>();

  for (const s of STAKEHOLDERS) {
    if (!s.hex) continue;
    const [col, row] = s.hex;
    claimed.add(cellKey(col, row));
    byId.set(s.id, { s, ...centreOf(col, row) });
  }

  for (const s of STAKEHOLDERS) {
    if (s.hex) continue;
    const tx = lonToX(s.lon);
    const ty = latToY(s.lat);
    const c0 = Math.round((tx - ORIGIN_X) / COL_W);
    const r0 = Math.round((ty - ORIGIN_Y) / ROW_H);
    let best: { col: number; row: number; score: number } | null = null;
    for (let row = r0 - 8; row <= r0 + 8; row++) {
      if (row < 0 || row > 34) continue;
      for (let col = c0 - 8; col <= c0 + 8; col++) {
        // Only every other (col, row) pair is a lattice position: see PACKED.
        if (col < 0 || col > 151 || (col + row) % 2 === 0) continue;
        if (claimed.has(cellKey(col, row))) continue;
        const c = centreOf(col, row);
        const score =
          Math.hypot(c.x - tx, c.y - ty) +
          (LAND.has(cellKey(col, row)) ? 0 : SEA_PENALTY);
        if (
          !best ||
          score < best.score ||
          (score === best.score &&
            (row < best.row || (row === best.row && col < best.col)))
        ) {
          best = { col, row, score };
        }
      }
    }
    // The window holds hundreds of cells and there are 26 people, so a free
    // cell always exists; the fallback is only for the type system.
    const cell = best ?? { col: c0, row: r0 + ((c0 + r0) % 2 === 0 ? 1 : 0) };
    claimed.add(cellKey(cell.col, cell.row));
    byId.set(s.id, { s, ...centreOf(cell.col, cell.row) });
  }

  return STAKEHOLDERS.map((s) => byId.get(s.id)!);
}

/**
 * Push enlarged faces apart until none overlap, a few units at a time. The
 * displacement is small (a cell or two), deterministic, and clamped to the
 * map, and it only runs on the people the current question shows.
 */
function relax(points: { id: string; x: number; y: number }[]) {
  const p = points.map((o) => ({ ...o }));
  for (let pass = 0; pass < 40; pass++) {
    let moved = false;
    for (let i = 0; i < p.length; i++) {
      for (let j = i + 1; j < p.length; j++) {
        const dx = p[j].x - p[i].x;
        const dy = p[j].y - p[i].y;
        const d = Math.hypot(dx, dy);
        if (d >= FACE_MIN_DIST) continue;
        // d is never 0: every node starts on its own cell.
        const push = (FACE_MIN_DIST - d) / 2 / d;
        p[i].x -= dx * push;
        p[i].y -= dy * push;
        p[j].x += dx * push;
        p[j].y += dy * push;
        moved = true;
      }
    }
    if (!moved) break;
  }
  const m = HEX_R * ACTIVE_SCALE;
  for (const o of p) {
    o.x = Math.min(Math.max(o.x, m), VIEW.w - m);
    o.y = Math.min(Math.max(o.y, m), VIEW.h - m);
  }
  return p;
}

/** The drawn stand-in for a missing or unpublishable photograph. */
function Silhouette() {
  return (
    <g className="sm-silhouette" clipPath="url(#sm-hexclip)" aria-hidden>
      <circle cx="0" cy="-3.9" r="3.4" />
      <path d="M -6.6 11.35 C -6.6 4.6 -3.6 1.7 0 1.7 C 3.6 1.7 6.6 4.6 6.6 11.35 Z" />
    </g>
  );
}

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

/* A profile appears twice: in the panel under the map and in the roster below.
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

/* The fixed panel under the map. It always occupies its space, so pointing at
 * the map never reflows the page; a hover previews, a selection shows all of
 * it. Withheld entries show the withholding note and an anonymous silhouette,
 * nothing else. */
function Dock({
  s,
  pinned,
  broken,
  onBroken,
  onClose,
}: {
  s: Stakeholder | null;
  pinned: boolean;
  broken: Set<string>;
  onBroken: (id: string) => void;
  onClose: () => void;
}) {
  if (!s) {
    return (
      <p className="sm-dock-hint">
        Point at a marked hexagon, or Tab to one, and the conversation appears
        here. Select it to keep the record open while you read.
      </p>
    );
  }
  const withheld = Boolean(s.consent);
  const hasPhoto = Boolean(s.photo) && !withheld && !broken.has(s.id);
  const teaser = s.quote ?? s.learnt[0];
  return (
    <div className="sm-dock-profile">
      <div className="sm-dock-media">
        {hasPhoto ? (
          <img
            src={s.photo}
            alt={`Portrait of ${s.photoShows ?? s.name}`}
            onError={() => onBroken(s.id)}
          />
        ) : (
          <svg viewBox="-12 -12.5 24 25" aria-hidden>
            <polygon className="sm-dock-hex" points={hexPoints(0, 0)} />
            <Silhouette />
          </svg>
        )}
        {hasPhoto && s.photoShows && (
          <p className="sm-dock-photonote">Photo: {s.photoShows}</p>
        )}
      </div>
      <div className="sm-dock-body">
        {pinned && (
          <button
            type="button"
            className="sm-close"
            onClick={onClose}
            aria-label="Close"
          >
            Close
          </button>
        )}
        {withheld ? (
          <>
            <p className="sm-name sm-name--withheld">Interview withheld</p>
            <p className="sm-role">{s.consent!.note}</p>
            <p className="sm-meta">{s.region}</p>
            <QuestionTags s={s} />
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
            {!pinned && teaser && (
              <p className={`sm-dock-teaser${s.quote ? " sm-quote" : ""}`}>
                {s.quote ? (
                  <>
                    &ldquo;
                    <Marked text={s.quote} />
                    &rdquo;
                  </>
                ) : (
                  <Marked text={teaser} />
                )}
              </p>
            )}
            {!pinned && (
              <p className="sm-hint">Select to read everything they told us.</p>
            )}
            {pinned && s.quote && (
              <p className="sm-quote">
                &ldquo;
                <Marked text={s.quote} />
                &rdquo;
              </p>
            )}
            {pinned && s.learnt.length > 0 && (
              <ul className="sm-learnt">
                {s.learnt.map((l) => (
                  <li key={l}>
                    <Marked text={l} />
                  </li>
                ))}
              </ul>
            )}
            {pinned && s.changed && (
              <p className="sm-changed">
                <span className="sm-changed-label">What it changed</span>
                <Marked text={s.changed} />
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function StakeholderMap() {
  const nodes = useMemo(assignCells, []);
  const regions = useMemo(() => {
    const byRegion = new Map<string, Stakeholder[]>();
    for (const s of STAKEHOLDERS) {
      byRegion.set(s.region, [...(byRegion.get(s.region) ?? []), s]);
    }
    return [...byRegion.entries()].map(([name, people]) => ({ name, people }));
  }, []);
  const withheld = STAKEHOLDERS.filter((s) => s.consent).length;

  const [filter, setFilter] = useState<QuestionId | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  // Photograph URLs that failed to load - not uploaded yet, or gone. Those
  // entries render the silhouette instead, in the map and in the panel.
  const [broken, setBroken] = useState<Set<string>>(new Set());

  const shows = (s: Stakeholder) => !filter || questionsOf(s).includes(filter);

  /** Cell centres, except that a filtered cluster relaxes apart. See relax. */
  const positions = useMemo(() => {
    const base = new Map(nodes.map((n) => [n.s.id, { x: n.x, y: n.y }]));
    if (!filter) return base;
    const q = filter;
    const displaced = relax(
      nodes
        .filter((n) => questionsOf(n.s).includes(q))
        .map((n) => ({ id: n.s.id, x: n.x, y: n.y })),
    );
    for (const d of displaced) base.set(d.id, { x: d.x, y: d.y });
    return base;
  }, [nodes, filter]);

  /* One HONEY cycle as a network: the anchors joined to each other, and every
   * supporting interview joined to its nearest anchor. A dashed link marks a
   * provisional tag - one we inferred, not one the team's table states - the
   * same distinction the tag chips below draw with a dashed border. */
  const links = useMemo(() => {
    if (!filter) return [];
    const q = filter;
    const vis = nodes.filter((n) => questionsOf(n.s).includes(q));
    const at = (id: string) => positions.get(id)!;
    const anchors = vis.filter((n) => n.s.anchors?.includes(q));
    if (!anchors.length) return [];
    const edges: { a: string; b: string; dashed: boolean }[] = [];
    const chain = [...anchors].sort((m, n) => at(m.s.id).x - at(n.s.id).x);
    for (let i = 1; i < chain.length; i++) {
      edges.push({ a: chain[i - 1].s.id, b: chain[i].s.id, dashed: false });
    }
    for (const n of vis) {
      if (n.s.anchors?.includes(q)) continue;
      const p = at(n.s.id);
      let best = anchors[0];
      let bestD = Infinity;
      for (const a of anchors) {
        const ap = at(a.s.id);
        const d = Math.hypot(ap.x - p.x, ap.y - p.y);
        if (d < bestD) {
          bestD = d;
          best = a;
        }
      }
      edges.push({
        a: n.s.id,
        b: best.s.id,
        dashed:
          (n.s.provisional ?? []).includes(q) && !n.s.questions.includes(q),
      });
    }
    return edges;
  }, [nodes, filter, positions]);

  const activeId = pinned ?? hovered;
  const activeS = STAKEHOLDERS.find((s) => s.id === activeId) ?? null;

  // Escape lets go of a selection, which is the only way out for a keyboard
  // user who selected a record and does not want to tab back to it.
  useEffect(() => {
    if (!pinned) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPinned(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pinned]);

  // A selected record stays until the mouse clicks away: anywhere outside the
  // map and its panel lets go. Clicks inside are handled by the cells.
  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (t && (t.closest(".sm-canvas") || t.closest(".sm-dock"))) return;
      setPinned(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [pinned]);

  const pick = (q: QuestionId | null) => {
    setFilter(q);
    setPinned(null);
    setHovered(null);
  };

  // The active cell paints last so its enlarged face is never under a
  // neighbour. The sort is stable, so nothing else changes order.
  const drawOrder = useMemo(
    () =>
      [...nodes].sort(
        (a, b) => Number(a.s.id === activeId) - Number(b.s.id === activeId),
      ),
    [nodes, activeId],
  );

  return (
    <section className="stakeholder-map" aria-labelledby="sm-heading">
      <h3 id="sm-heading" className="sm-heading">
        Who we spoke to
      </h3>
      <p className="sm-standfirst">
        {STAKEHOLDERS.length} conversations across {regions.length} countries,{" "}
        {withheld} of them withheld pending consent. Point at a marked hexagon
        and it grows into the person; their record appears in the panel under
        the map, and selecting the hexagon keeps it there until you click away.
        Pick a question to see everyone who fed it, joined into one cycle.
        Every profile is also listed underneath as text.
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
          <span className="sm-filter-key">
            The heavier rim is the anchor interview. A dashed link is a tag we
            assigned provisionally, not one the team&rsquo;s question table
            states.
          </span>
        </p>
      )}

      <div className="sm-canvas" onPointerLeave={() => setHovered(null)}>
        <svg
          viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
          className="sm-svg"
          role="group"
          aria-label="World map of the stakeholder conversations"
          onClick={(e) => {
            // A click on the map itself, rather than on a cell, lets go.
            if (e.target === e.currentTarget) setPinned(null);
          }}
        >
          <defs>
            {/* Crops a photograph, or the silhouette, to the cell shape. */}
            <clipPath id="sm-hexclip">
              <polygon points={hexPoints(0, 0)} />
            </clipPath>
          </defs>

          {/* Land. Inert: it is the ground the markers sit on, nothing more.
           * Cells someone stands on are drawn by their node instead. */}
          <g className="sm-land" aria-hidden>
            {HEXES.map((h) =>
              nodes.some((n) => n.x === h.x && n.y === h.y) ? null : (
                <polygon key={`${h.col}-${h.row}`} points={hexPoints(h.x, h.y)} />
              ),
            )}
          </g>

          {filter && (
            <g className="sm-links" aria-hidden>
              {links.map(({ a, b, dashed }) => {
                const pa = positions.get(a)!;
                const pb = positions.get(b)!;
                return (
                  <line
                    key={`${a}-${b}`}
                    className={`sm-link${dashed ? " is-provisional" : ""}`}
                    x1={pa.x}
                    y1={pa.y}
                    x2={pb.x}
                    y2={pb.y}
                  />
                );
              })}
            </g>
          )}

          {drawOrder.map(({ s }) => {
            const lit = shows(s);
            const pos = positions.get(s.id)!;
            const isActive = lit && s.id === activeId;
            const isPinned = s.id === pinned;
            const isAnchor = Boolean(filter && s.anchors?.includes(filter));
            const wantsFace = Boolean(filter) && lit;
            const hasPhoto =
              Boolean(s.photo) && !s.consent && !broken.has(s.id);
            const cls = [
              "sm-node",
              lit ? "" : " is-dim",
              wantsFace ? " is-face" : "",
              isActive ? " is-active" : "",
              isPinned ? " is-pinned" : "",
              isAnchor ? " is-anchor" : "",
              s.consent ? " is-withheld" : "",
            ].join("");
            return (
              <g
                key={s.id}
                className={cls}
                style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                tabIndex={lit ? 0 : undefined}
                role={lit ? "button" : undefined}
                aria-pressed={lit ? isPinned : undefined}
                aria-label={
                  lit
                    ? s.consent
                      ? `Interview withheld pending consent, ${s.region}`
                      : `${s.name}, ${s.role}`
                    : undefined
                }
                onPointerEnter={lit ? () => setHovered(s.id) : undefined}
                onFocus={lit ? () => setHovered(s.id) : undefined}
                onBlur={lit ? () => setHovered(null) : undefined}
                /* pointerup, not click: hovering re-orders this element so
                 * its enlarged face paints on top, and Chrome refuses to
                 * synthesise a click across that reorder. The pointer is
                 * released on the cell either way. */
                onPointerUp={
                  lit
                    ? (e) => {
                        if (e.button !== 0) return;
                        setPinned(isPinned ? null : s.id);
                      }
                    : undefined
                }
                onKeyDown={
                  lit
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setPinned(isPinned ? null : s.id);
                        }
                      }
                    : undefined
                }
              >
                <g className="sm-zoom">
                  <polygon className="sm-cell" points={hexPoints(0, 0)} />
                  {hasPhoto && (
                    <image
                      className="sm-face"
                      href={s.photo}
                      x={-HEX_R}
                      y={-HEX_R}
                      width={HEX_R * 2}
                      height={HEX_R * 2}
                      preserveAspectRatio="xMidYMid slice"
                      clipPath="url(#sm-hexclip)"
                      aria-hidden
                      onError={() =>
                        setBroken((prev) => new Set(prev).add(s.id))
                      }
                    />
                  )}
                  {/* Withheld entries get the same silhouette, ghosted by
                   * CSS: a person whose identity is not shown, not a gap. */}
                  {!hasPhoto && <Silhouette />}
                  <polygon className="sm-rim" points={hexPoints(0, 0)} />
                  {/* A comfortable target: the drawn cell is 22 units across. */}
                  {lit && <circle className="sm-hit" cx="0" cy="0" r="17" />}
                </g>
              </g>
            );
          })}
        </svg>

        <div className="sm-dock" role="region" aria-label="Selected conversation">
          <Dock
            s={activeS}
            pinned={Boolean(pinned) && pinned === activeId}
            broken={broken}
            onBroken={(id) => setBroken((prev) => new Set(prev).add(id))}
            onClose={() => setPinned(null)}
          />
        </div>
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
