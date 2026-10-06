import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  QUESTION_CYCLES,
  QUESTION_IDS,
  QUESTION_TITLES,
  STAGE_NAMES,
  STAGE_ORDER,
  STAKEHOLDERS,
  isKeyTo,
  questionsOf,
  stageOf,
  type HoneyStage,
  type QuestionId,
  type Stakeholder,
} from "../data/stakeholders";
import { useDeckRests } from "../utils/deck";
import { HpStats } from "./HpStats";
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
 * profile photos on a map", "stakeholders tied together into one HONEY cycle
 * are connected by visible links", and "Make HONEY cyclical: H > O > N > E >
 * Y > H". So:
 *
 *   - On a wide screen the map takes the whole viewport and pins briefly,
 *     so the world is seen at once, easing in on the way in and out on the
 *     way past. Scrolling is never intercepted: the pin is position:sticky,
 *     and only once the reader stops with the map part on screen does the
 *     window ease on, to the map whole or to the page either side of it,
 *     whichever way they were going (src/utils/deck.ts). Both the easing
 *     and the settling are dropped under prefers-reduced-motion. While the
 *     stage covers the viewport the site menu keeps out of the way (the
 *     html[data-map-stage] rule), because it re-shows itself on any upward
 *     scroll and would sit over the map's top edge.
 *   - Every conversation is one cell. Pointing at a cell grows it into the
 *     person's photograph, with a small box beside the face (fixed per face,
 *     never chasing the pointer): name, place, date and the questions they
 *     fed, each of which opens that question. Selecting opens the full
 *     record in the same place, in the team's three sections, sized so it
 *     never scrolls, until a click away, Escape, or another selection.
 *   - Picking a question (the list in the bottom corner) turns everyone who
 *     fed it into large faces and draws that question's HONEY loop through
 *     them: curved arrows run Hear > Observe > Navigate > Evaluate > Yield
 *     and close back to Hear, and each face is badged with its stage. Stages
 *     come from src/data/stakeholders.ts (stageOf), which records only what
 *     the team's write-up states and defaults the rest to Hear - the
 *     write-up's own definition of the stage.
 *   - The same pick opens the question's write-up, stage by stage, in a pane
 *     down the right-hand side, and the map shrinks left to make room for
 *     it rather than being covered. The pane never scrolls: its type is
 *     fitted to the room (see the fit effect), so the whole question reads
 *     at once beside the loop it describes.
 *
 * PHOTOS. A face renders only for entries carrying `photo` in
 * src/data/stakeholders.ts. The four withheld interviews never do - a face
 * identifies a person as surely as a name - and an entry whose photograph is
 * missing or not yet uploaded falls back to a drawn silhouette, so the map
 * degrades honestly rather than breaking while the uploads tool is empty.
 *
 * PLACEMENT. At rest each stakeholder sits on their own lattice cell: the
 * stated `hex` override, or the nearest free cell to their coordinates,
 * preferring land but accepting a sea cell when the honest position is far
 * from any land hex (New Zealand). In a question view the faces are large,
 * so they relax apart from their cells until none overlap: a face is "near
 * its country", nothing more precise, and the card states the real place.
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

interface XY {
  x: number;
  y: number;
}

/** A floating panel's box, in canvas pixels. */
interface PanelRect {
  left: number;
  top: number;
  w: number;
  h: number;
}

const VIEW = { x: 0, y: 0, w: MAP_W, h: MAP_H };

/**
 * How far a cell grows. These are mirrored in the CSS (.sm-zoom scales);
 * the copies here size the geometry that depends on them: face spacing,
 * arrow trimming, edge clamping and the card's offset from the face.
 */
const FACE_SCALE = 3.6;
const ACTIVE_SCALE = 4.3;
const FACE_R = HEX_R * FACE_SCALE;

/** Centre distance that keeps two enlarged faces apart with room for arrows. */
const FACE_MIN_DIST = 92;

/**
 * A cell in open water costs this much extra distance, so land is preferred
 * unless the honest position is genuinely offshore of every land hexagon.
 */
const SEA_PENALTY = 30;

/**
 * The write-up pane's type, in px: the largest size it is set at, the size
 * the panel was designed at (below which the pane widens instead of
 * shrinking its type further), and the floor, under which it scrolls after
 * all. PANE_MAX_VW caps the widening, so the map always keeps most of the
 * screen.
 */
const FIT_MAX = 13;
const FIT_COMFORT = 12;
const FIT_MIN = 10.5;
const PANE_MAX_VW = 0.4;

/**
 * The person card. CARD_M is its margin from the canvas edge, in px.
 * A selected card starts at the width its CSS gives it and widens, up to
 * CARD_MAX_REM or the room beside its face, until the whole record fits
 * the height without scrolling; past that its type shrinks, down to
 * FIT_MIN, the pane's floor. HOVER_GRACE is how long, in ms, the small card
 * outlives the pointer leaving its face: long enough to cross the gap to
 * the card and press one of its questions. HOVER_SWITCH is how long the
 * pointer has to rest on another cell, while a card is up, before that
 * cell takes the card over, so a path to the card that grazes a
 * neighbour does not swap the card out from under it.
 */
const CARD_M = 12;
const CARD_MAX_REM = 46;
const HOVER_GRACE = 260;
const HOVER_SWITCH = 140;

const cellKey = (col: number, row: number) => `${col}:${row}`;
const LAND = new Set(HEXES.map((h) => cellKey(h.col, h.row)));

function centreOf(col: number, row: number): XY {
  return { x: ORIGIN_X + COL_W * col, y: ORIGIN_Y + ROW_H * row };
}

const dist = (a: XY, b: XY) => Math.hypot(a.x - b.x, a.y - b.y);

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

/** A no-go rectangle for faces, in viewBox units, margins included. */
interface Block {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Push enlarged faces apart until none overlap, a few units at a time, and
 * out of the floating panels' rectangles, so no face ends up under the
 * heading or the question list where it would lose its pointer events. The
 * seeds are the resting cells (unique by construction, so no zero-distance
 * pair), the result is deterministic for a given panel layout, and only
 * computed for the people the current question shows.
 */
function relax(points: { id: string; x: number; y: number }[], blocks: Block[]) {
  const p = points.map((o) => ({ ...o }));
  const m = HEX_R * ACTIVE_SCALE + 8;
  // Bounds and blocks are enforced inside every pass, not after the last
  // one, so a cluster pushed against an edge or a panel spreads sideways
  // instead of being clamped back into overlap.
  let moved = false;
  const bound = (o: XY) => {
    o.x = Math.min(Math.max(o.x, m), VIEW.w - m);
    o.y = Math.min(Math.max(o.y, m), VIEW.h - m);
  };
  const inside = (o: XY, b: Block) =>
    o.x > b.left && o.x < b.right && o.y > b.top && o.y < b.bottom;
  const clamp = (o: XY) => {
    bound(o);
    // Leave a panel through the nearest edge that lands somewhere free:
    // inside the map and outside every panel. The heading and the question
    // list stack down the left and, on a shorter screen or with the map
    // shrunk for the write-up pane, wall off that whole side between them,
    // so the plain nearest edge would drop a face from one straight into
    // the other. Only when no edge is free does the nearest one win, for
    // the next round to move the face on; a round per panel settles it.
    for (let round = 0; round <= blocks.length; round++) {
      const b = blocks.find((k) => inside(o, k));
      if (!b) return;
      const exits = [
        { x: b.left, y: o.y },
        { x: b.right, y: o.y },
        { x: o.x, y: b.top },
        { x: o.x, y: b.bottom },
      ]
        .map((e) => {
          const d = dist(e, o);
          bound(e);
          return { ...e, d, free: !blocks.some((k) => inside(e, k)) };
        })
        .sort((p, q) => p.d - q.d);
      const exit = exits.find((e) => e.free) ?? exits[0];
      o.x = exit.x;
      o.y = exit.y;
      moved = true;
    }
  };
  for (const o of p) clamp(o);
  for (let pass = 0; pass < 80; pass++) {
    moved = false;
    for (let i = 0; i < p.length; i++) {
      for (let j = i + 1; j < p.length; j++) {
        const dx = p[j].x - p[i].x;
        const dy = p[j].y - p[i].y;
        const d = Math.hypot(dx, dy);
        if (d >= FACE_MIN_DIST) continue;
        if (d < 1) {
          // Coincident: two faces ejected to the same block edge. A push
          // along a zero-length vector is NaN, so nudge them apart
          // vertically and let the next pass separate them properly.
          p[i].y -= 1;
          p[j].y += 1;
          moved = true;
          continue;
        }
        const push = (FACE_MIN_DIST - d) / 2 / d;
        p[i].x -= dx * push;
        p[i].y -= dy * push;
        p[j].x += dx * push;
        p[j].y += dy * push;
        clamp(p[i]);
        clamp(p[j]);
        moved = true;
      }
    }
    if (!moved) break;
  }
  return p;
}

/**
 * A curved arrow from face a to face b: a quadratic arc bowed to the left of
 * travel, trimmed so it leaves from under the source and lands its head just
 * off the target's rim instead of underneath it.
 */
function arcPath(a: XY, b: XY): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d;
  const uy = dy / d;
  const t0 = Math.min(FACE_R * 0.55, d * 0.3);
  const t1 = Math.min(FACE_R + 9, d * 0.45);
  const ax = a.x + ux * t0;
  const ay = a.y + uy * t0;
  const bx = b.x - ux * t1;
  const by = b.y - uy * t1;
  const k = Math.min(d * 0.16, 56);
  const cx = (ax + bx) / 2 - uy * k;
  const cy = (ay + by) / 2 + ux * k;
  return `M ${ax.toFixed(1)} ${ay.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
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

/** Every question a conversation fed, in question order. Stated and
 * provisional tags read the same here: a reader is shown the questions, not
 * our confidence in the tagging (the map's dashed rim still carries that). */
const tagsOf = (s: Stakeholder) =>
  QUESTION_IDS.filter((q) => questionsOf(s).includes(q));

/* The questions a person fed. On the map each one is a button that opens
 * that question in the picker; in the roster they are plain labels. */
function QuestionTags({
  s,
  filter,
  onPick,
}: {
  s: Stakeholder;
  filter?: QuestionId | null;
  onPick?: (q: QuestionId) => void;
}) {
  const tags = tagsOf(s);
  if (!tags.length) return null;
  return (
    <p className="sm-tags">
      {tags.map((q) =>
        onPick ? (
          <button
            key={q}
            type="button"
            className={`sm-tag${filter === q ? " is-on" : ""}`}
            title={QUESTION_TITLES[q]}
            aria-label={`${q}: ${QUESTION_TITLES[q]}`}
            aria-pressed={filter === q}
            onClick={() => onPick(q)}
          >
            {q}
          </button>
        ) : (
          <span key={q} className="sm-tag" title={QUESTION_TITLES[q]}>
            {q}
          </span>
        ),
      )}
    </p>
  );
}

/** Place and interview date, the date left out where none is recorded. */
function Meta({ s }: { s: Stakeholder }) {
  return (
    <p className="sm-meta">
      <Marked text={s.consent ? s.region : s.place} />
      {!s.consent && s.date && (
        <>
          {" · "}
          <Marked text={s.date} />
        </>
      )}
    </p>
  );
}

/* The three sections of a record, under the team's own headings. Each
 * heading shows even when its section is still empty: the write-up is not
 * finished, and nothing is put in its place. The quote is part of what we
 * learnt. `level` keeps the heading order right wherever the record sits. */
function RecordSections({ s, level }: { s: Stakeholder; level: 3 | 5 }) {
  const H = `h${level}` as "h3" | "h5";
  return (
    <>
      <section className="sm-sec">
        <H className="sm-sec-head">Why did we choose this stakeholder</H>
        {s.why && (
          <p>
            <Marked text={s.why} />
          </p>
        )}
      </section>
      <section className="sm-sec">
        <H className="sm-sec-head">What did we learn from them</H>
        {s.quote && (
          <p className="sm-quote">
            &ldquo;
            <Marked text={s.quote} />
            &rdquo;
          </p>
        )}
        {s.learnt.length > 0 && (
          <ul className="sm-learnt">
            {s.learnt.map((l) => (
              <li key={l}>
                <Marked text={l} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="sm-sec">
        <H className="sm-sec-head">How did this impact the project</H>
        {s.changed && (
          <p>
            <Marked text={s.changed} />
          </p>
        )}
      </section>
    </>
  );
}

/* A profile appears twice: in the box beside the face and in the roster
 * below the map. Only the roster copy is given an id, so a search result has
 * one place to land and the document has no duplicate ids.
 *
 * <Marked> is what puts a honey background on the words a reader searched for
 * when they arrive here from a result. It renders plain text otherwise. */
function Profile({ s }: { s: Stakeholder }) {
  return (
    <li className="sm-profile" id={`sm-${s.id}`}>
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
          <Meta s={s} />
          <QuestionTags s={s} />
          <RecordSections s={s} level={5} />
        </>
      )}
    </li>
  );
}

/* The box beside the face. Anchored to the face, never to the pointer.
 *
 * Pointing at a face opens the small version: who, where, when, and the
 * questions they fed, each of which opens that question. Selecting opens the
 * full record in the same place, sized so it never scrolls (see the fit
 * effect). The photograph is not repeated: the selected face is already
 * showing it. Withheld entries show the withholding note and nothing else. */
function PersonCard({
  s,
  filter,
  pinned,
  photoNote,
  onPick,
  onClose,
}: {
  s: Stakeholder;
  filter: QuestionId | null;
  pinned: boolean;
  /** Who the face on the map shows, when that is not simply the name. */
  photoNote?: string;
  onPick: (q: QuestionId) => void;
  onClose: () => void;
}) {
  const withheld = Boolean(s.consent);
  return (
    <div className="sm-pop-profile">
      {pinned && (
        <button
          type="button"
          className="sm-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg viewBox="0 0 10 10" aria-hidden>
            <path d="M 1.5 1.5 L 8.5 8.5 M 8.5 1.5 L 1.5 8.5" />
          </svg>
        </button>
      )}
      <p className={`sm-name${withheld ? " sm-name--withheld" : ""}`}>
        {withheld ? "Interview withheld" : <Marked text={s.name} />}
      </p>
      {pinned && (
        <p className="sm-role">
          {withheld ? s.consent!.note : <Marked text={s.role} />}
        </p>
      )}
      <Meta s={s} />
      <QuestionTags s={s} filter={filter} onPick={onPick} />
      {pinned && !withheld && photoNote && (
        <p className="sm-meta">Photo: {photoNote}</p>
      )}
      {pinned && !withheld && <RecordSections s={s} level={3} />}
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

  const [filter, setFilter] = useState<QuestionId | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  // Photograph URLs that failed to load - not uploaded yet, or gone. Those
  // entries render the silhouette instead, in the map and in the card.
  const [broken, setBroken] = useState<Set<string>>(new Set());

  const pinRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLElement>(null);
  const filterboxRef = useRef<HTMLDivElement>(null);
  const qpanelRef = useRef<HTMLElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  // The small card stays up while the pointer crosses from the face to it,
  // and for as long as the pointer is on it. See HOVER_GRACE and
  // HOVER_SWITCH.
  const leaveTimer = useRef(0);
  const enterTimer = useRef(0);
  const holdHover = () => {
    window.clearTimeout(leaveTimer.current);
    window.clearTimeout(enterTimer.current);
  };
  const enterHover = (id: string) => {
    holdHover();
    if (hovered === null) setHovered(id);
    else if (hovered !== id) {
      enterTimer.current = window.setTimeout(
        () => setHovered(id),
        HOVER_SWITCH,
      );
    }
  };
  const releaseHover = () => {
    holdHover();
    leaveTimer.current = window.setTimeout(
      () => setHovered(null),
      HOVER_GRACE,
    );
  };
  useEffect(() => holdHover, []);
  // The HONEY stage under the pointer in the cycle panel, picking that
  // stage's people out on the map.
  const [stageHover, setStageHover] = useState<HoneyStage | null>(null);

  // Wide screens get the fullscreen stage and the box beside the face;
  // narrow ones keep everything in normal flow with the card under the map.
  const [wide, setWide] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 48rem)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 48rem)");
    const onChange = () => setWide(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // The canvas size and the corner panels' rectangles, in CSS pixels: what
  // the card placement needs to anchor beside a face and to keep off the
  // panels. The panels share the frame's origin with the canvas. The
  // write-up pane is not one of them: it sits beside the canvas, not over
  // it, so no face ever has to dodge it.
  const [layout, setLayout] = useState<{
    w: number;
    h: number;
    panels: PanelRect[];
  }>({ w: 0, h: 0, panels: [] });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const measure = () => {
      const rect = (el: HTMLElement | null): PanelRect | null =>
        el
          ? {
              left: el.offsetLeft,
              top: el.offsetTop,
              w: el.offsetWidth,
              h: el.offsetHeight,
            }
          : null;
      setLayout({
        w: canvas.clientWidth,
        h: canvas.clientHeight,
        panels: [rect(headRef.current), rect(filterboxRef.current)].filter(
          (r): r is PanelRect => r !== null,
        ),
      });
    };
    // The canvas narrows while the write-up pane opens, and the question
    // list grows its key when a question is picked; both are sizes, so the
    // observer catches them.
    const ro = new ResizeObserver(measure);
    ro.observe(canvas);
    if (headRef.current) ro.observe(headRef.current);
    if (filterboxRef.current) ro.observe(filterboxRef.current);
    measure();
    return () => ro.disconnect();
  }, []);

  /* The write-up pane does not scroll: the whole question has to be readable
   * at once, beside the loop it describes. So its type is fitted to the
   * room - the largest size up to FIT_MAX at which every stage fits. If that
   * would drop below FIT_COMFORT, the pane widens instead (up to
   * PANE_MAX_VW, the map giving up the width) just far enough to hold
   * FIT_COMFORT. Only a viewport too short even then falls back to a
   * scrolling pane at FIT_MIN. Measured, not estimated, because the stage
   * texts are the team's to edit (src/content/questions) and their length
   * moves.
   *
   * The pane's height is its content's, capped by the room, so "fits" is
   * simply scrollHeight within clientHeight. Trial widths go on the pane
   * alone, so only the pane relays out per trial; the chosen width goes on
   * the frame, where the canvas reads it too. Narrow screens keep the pane
   * in flow and are left alone. */
  useLayoutEffect(() => {
    const pane = qpanelRef.current;
    const frame = frameRef.current;
    if (!filter || !pane || !frame) return;
    const wideMq = window.matchMedia("(min-width: 48rem)");
    const fit = () => {
      frame.style.removeProperty("--sm-pane-w");
      pane.style.removeProperty("--sm-pane-w");
      pane.style.removeProperty("--sm-qfit");
      pane.removeAttribute("data-overflow");
      if (!wideMq.matches) return;
      const fits = (px: number) => {
        pane.style.setProperty("--sm-qfit", `${px}px`);
        return pane.scrollHeight <= pane.clientHeight;
      };
      const largest = () => {
        if (fits(FIT_MAX)) return FIT_MAX;
        if (!fits(FIT_MIN)) return 0;
        let lo = FIT_MIN;
        let hi = FIT_MAX;
        while (hi - lo > 0.125) {
          const mid = (lo + hi) / 2;
          if (fits(mid)) lo = mid;
          else hi = mid;
        }
        return lo;
      };
      const widthTo = (px: number) =>
        pane.style.setProperty("--sm-pane-w", `${px}px`);
      let size = largest();
      if (size < FIT_COMFORT) {
        let lo = pane.offsetWidth;
        let hi = Math.max(lo, Math.round(window.innerWidth * PANE_MAX_VW));
        widthTo(hi);
        if (fits(FIT_COMFORT)) {
          while (hi - lo > 8) {
            const mid = Math.round((lo + hi) / 2);
            widthTo(mid);
            if (fits(FIT_COMFORT)) hi = mid;
            else lo = mid;
          }
          widthTo(hi);
        }
        size = largest();
        frame.style.setProperty("--sm-pane-w", `${hi}px`);
        pane.style.removeProperty("--sm-pane-w");
      }
      pane.style.setProperty("--sm-qfit", `${size || FIT_MIN}px`);
      pane.toggleAttribute("data-overflow", size === 0);
    };
    fit();
    // Only the viewport changes the room; the frame is the viewport here.
    const ro = new ResizeObserver(fit);
    ro.observe(frame);
    // The brand faces load from static.igem.wiki, possibly after this first
    // fit, and a swapped face re-wraps every line.
    document.fonts.addEventListener("loadingdone", fit);
    return () => {
      ro.disconnect();
      document.fonts.removeEventListener("loadingdone", fit);
      frame.style.removeProperty("--sm-pane-w");
    };
  }, [filter]);

  /* The pin-and-move-on scroll treatment. The stage is position:sticky, so
   * scrolling never stops working; this only eases the stage in while it
   * arrives and out while the reader moves past, and does nothing on narrow
   * screens or under prefers-reduced-motion. */
  useEffect(() => {
    const wrap = pinRef.current;
    const frame = frameRef.current;
    if (!wrap || !frame) return;
    const wideMq = window.matchMedia("(min-width: 48rem)");
    const stillMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = wrap.getBoundingClientRect();
      // While the stage covers the viewport, the menu stays away even on an
      // upward scroll (it re-shows itself then, and would cover the map's
      // top edge). The CSS for this attribute is in StakeholderMap.css.
      document.documentElement.toggleAttribute(
        "data-map-stage",
        wideMq.matches && r.top <= 1 && r.bottom >= vh - 1,
      );
      if (!wideMq.matches || stillMq.matches) {
        frame.style.opacity = "";
        frame.style.transform = "";
        return;
      }
      // The ramps match the pin's short hold (see .sm-pin), so the fade
      // plays out inside the glide past the map rather than before it.
      const enter = Math.min(Math.max((vh - r.top) / (vh * 0.35), 0), 1);
      const exit = Math.min(Math.max((r.bottom - vh) / (vh * 0.35), 0), 1);
      const t = Math.min(enter, exit);
      frame.style.opacity = (0.3 + 0.7 * t).toFixed(3);
      frame.style.transform = `scale(${(0.93 + 0.07 * t).toFixed(4)})`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.documentElement.removeAttribute("data-map-stage");
    };
  }, []);

  /* Settling around the stage. The map's rests go to the deck
   * (src/utils/deck.ts), the same one the home page's slides use: the screen
   * just above the map, the map filling the screen, and the screen just
   * after it. Scrolling stays native the whole way; a reader who stops
   * while the map is part on screen is eased on to whichever of those they
   * were heading for. Narrow screens sit it out, and the deck itself stands
   * still under prefers-reduced-motion. If content ever grows directly
   * above this section, the first rest still reads it whole. */
  const rests = useCallback(() => {
    const wrap = pinRef.current;
    if (!wide || !wrap) return [];
    const r = wrap.getBoundingClientRect();
    const top = r.top + window.scrollY;
    return [Math.max(0, top - window.innerHeight), top, r.bottom + window.scrollY];
  }, [wide]);
  useDeckRests(rests);

  const shows = (s: Stakeholder) => !filter || questionsOf(s).includes(filter);

  /** Cell centres at rest; a question's faces relax apart, keeping clear
   * of the floating panels' measured rectangles. See relax. */
  const positions = useMemo(() => {
    const base = new Map(nodes.map((n) => [n.s.id, { x: n.x, y: n.y }]));
    if (!filter) return base;
    const q = filter;
    let blocks: Block[] = [];
    if (layout.w && layout.h) {
      const scale = Math.min(layout.w / MAP_W, layout.h / MAP_H);
      const ox = (layout.w - MAP_W * scale) / 2;
      const oy = (layout.h - MAP_H * scale) / 2;
      const m = FACE_R + 6;
      blocks = layout.panels.map((r) => ({
        left: (r.left - ox) / scale - m,
        top: (r.top - oy) / scale - m,
        right: (r.left + r.w - ox) / scale + m,
        bottom: (r.top + r.h - oy) / scale + m,
      }));
    }
    const displaced = relax(
      nodes
        .filter((n) => questionsOf(n.s).includes(q))
        .map((n) => ({ id: n.s.id, x: n.x, y: n.y })),
      blocks,
    );
    for (const d of displaced) base.set(d.id, { x: d.x, y: d.y });
    return base;
  }, [nodes, filter, layout]);

  /* The question's HONEY loop, drawn as one closed tour: the faces grouped
   * and ordered Hear > Observe > Navigate > Evaluate > Yield (only the
   * stages that have people), walked nearest-neighbour within a stage so the
   * path does not zigzag, and closed back to the start - the write-up's "H >
   * O > N > E > Y > H", not a decoration. */
  const loop = useMemo(() => {
    if (!filter) return [] as string[];
    const q = filter;
    const at = (id: string) => positions.get(id)!;
    const groups = STAGE_ORDER.map((st) =>
      nodes.filter(
        (n) => questionsOf(n.s).includes(q) && stageOf(q, n.s.id) === st,
      ),
    ).filter((g) => g.length > 0);
    const order: string[] = [];
    let prev: XY | null = null;
    for (const g of groups) {
      const remaining = new Set(g.map((n) => n.s.id));
      let cur: string;
      if (prev) {
        const from = prev;
        cur = [...remaining].reduce((m, id) =>
          dist(at(id), from) < dist(at(m), from) ? id : m,
        );
      } else {
        cur = [...remaining].reduce((m, id) =>
          at(id).x < at(m).x ? id : m,
        );
      }
      for (;;) {
        order.push(cur);
        remaining.delete(cur);
        if (!remaining.size) break;
        const p = at(cur);
        cur = [...remaining].reduce((m, id) =>
          dist(at(id), p) < dist(at(m), p) ? id : m,
        );
      }
      prev = at(order[order.length - 1]);
    }
    if (order.length < 2) return [];
    return order.map((id, i) =>
      arcPath(at(id), at(order[(i + 1) % order.length])),
    );
  }, [nodes, filter, positions]);

  const activeId = pinned ?? hovered;
  const activeS = STAKEHOLDERS.find((s) => s.id === activeId) ?? null;
  const activePinned = Boolean(activeS) && pinned === activeId;

  /* The active face in canvas pixels, and how far the card keeps from its
   * centre. The svg letterboxes with `meet`, so viewBox units are mapped
   * through the same fit here. */
  const faceGeom = useMemo(() => {
    if (!activeS || !layout.w || !layout.h) return null;
    const pos = positions.get(activeS.id);
    if (!pos) return null;
    const scale = Math.min(layout.w / MAP_W, layout.h / MAP_H);
    const ox = (layout.w - MAP_W * scale) / 2;
    const oy = (layout.h - MAP_H * scale) / 2;
    const toPx = (p: XY) => ({ x: ox + p.x * scale, y: oy + p.y * scale });
    return {
      toPx,
      scale,
      face: toPx(pos),
      gap: HEX_R * ACTIVE_SCALE * scale + 16,
    };
  }, [activeS, layout, positions]);

  /* The card's real size, measured, for cardPos. A selected card never
   * scrolls: if the record is taller than the canvas allows, the card widens
   * (narrowest width that fits, up to CARD_MAX_REM or the room beside the
   * face, so it can still sit next to it) and its lines get longer and the
   * record shorter. If that is not enough the type shrinks, to FIT_MIN at
   * the smallest; only a canvas too short even then gets a scrolling card. The measurement runs before paint, so the card
   * is never seen at the wrong size or place. */
  const popKey = activeS
    ? `${activeS.id}:${activePinned ? "pin" : "hover"}:${filter ?? ""}`
    : "";
  const [popSize, setPopSize] = useState<{
    key: string;
    w: number;
    h: number;
  } | null>(null);
  useLayoutEffect(() => {
    const el = popRef.current;
    if (!el || !wide || !popKey) return;
    el.style.removeProperty("width");
    el.style.removeProperty("max-height");
    el.style.removeProperty("font-size");
    el.removeAttribute("data-overflow");
    if (activePinned && faceGeom) {
      const room = layout.h - 2 * CARD_M;
      const fits = () => el.offsetHeight <= room;
      if (!fits()) {
        const rem =
          parseFloat(getComputedStyle(document.documentElement).fontSize) ||
          16;
        const { face, gap } = faceGeom;
        const beside = Math.max(
          face.x - gap - CARD_M,
          layout.w - face.x - gap - CARD_M,
        );
        let lo = el.offsetWidth;
        let hi = Math.max(lo, Math.min(CARD_MAX_REM * rem, beside));
        el.style.width = `${hi}px`;
        if (fits()) {
          while (hi - lo > 8) {
            const mid = Math.round((lo + hi) / 2);
            el.style.width = `${mid}px`;
            if (fits()) hi = mid;
            else lo = mid;
          }
          el.style.width = `${hi}px`;
        } else {
          let big = parseFloat(getComputedStyle(el).fontSize);
          let small = FIT_MIN;
          el.style.fontSize = `${small}px`;
          if (fits()) {
            while (big - small > 0.125) {
              const mid = (big + small) / 2;
              el.style.fontSize = `${mid}px`;
              if (fits()) small = mid;
              else big = mid;
            }
            el.style.fontSize = `${small}px`;
          } else {
            el.style.maxHeight = `${room}px`;
            el.setAttribute("data-overflow", "");
          }
        }
      }
    }
    const next = { key: popKey, w: el.offsetWidth, h: el.offsetHeight };
    setPopSize((p) =>
      p && p.key === next.key && p.w === next.w && p.h === next.h ? p : next,
    );
  }, [popKey, activePinned, wide, layout.w, layout.h, faceGeom]);

  /* Where the card sits: the spot nearest the active face that covers
   * nothing the reader could otherwise use. Every candidate position - the
   * four spots beside the face first, then a coarse grid over the whole
   * stage - is scored against the other visible cells' clickable circles,
   * the active face itself and the two corner panels; the least-covering
   * candidate wins, distance to the face breaking ties, so the card sits
   * beside the face when it can and steps just far enough away when the
   * face lives in a dense cluster. The svg letterboxes with `meet`, so
   * viewBox units are mapped through the same fit here. Card heights are
   * estimates - real cards are usually shorter - which is fine for keeping
   * clear of things. */
  const cardPos = useMemo(() => {
    if (!activeS || !wide || !faceGeom) return null;
    const { toPx, scale, face: f, gap } = faceGeom;
    // The measured size once there is one for this card; until then (the
    // first render of a new card, before the measuring effect) an estimate.
    const measured = popSize && popSize.key === popKey ? popSize : null;
    const w = measured ? measured.w : (activePinned ? 26 : 18) * 16;
    const h = measured ? measured.h : activePinned ? layout.h * 0.6 : 120;
    const M = CARD_M;

    const q = filter;
    const spots = nodes
      .filter((n) => !q || questionsOf(n.s).includes(q))
      .map((n) => {
        const c = toPx(positions.get(n.s.id)!);
        const own = n.s.id === activeS.id;
        const r =
          (own ? HEX_R * ACTIVE_SCALE + 6 : (q ? FACE_R : HEX_R * 1.3) + 4) *
          scale;
        return { ...c, r, own };
      });

    const clampX = (x: number) => Math.min(Math.max(x, M), layout.w - w - M);
    const clampY = (y: number) => Math.min(Math.max(y, M), layout.h - h - M);
    const candidates = [
      { left: f.x + gap, top: f.y - h / 2 },
      { left: f.x - gap - w, top: f.y - h / 2 },
      { left: f.x - w / 2, top: f.y + gap },
      { left: f.x - w / 2, top: f.y - gap - h },
    ].map((c) => ({ left: clampX(c.left), top: clampY(c.top) }));
    for (let gx = M; gx <= layout.w - w - M; gx += 72) {
      for (let gy = M; gy <= layout.h - h - M; gy += 72) {
        candidates.push({ left: gx, top: gy });
      }
    }

    const covers = (c: { left: number; top: number }) => {
      let n = 0;
      for (const s of spots) {
        const cx = Math.min(Math.max(s.x, c.left), c.left + w);
        const cy = Math.min(Math.max(s.y, c.top), c.top + h);
        // Covering the face the card describes defeats the card, so it
        // outweighs anything else it could cover.
        if ((cx - s.x) ** 2 + (cy - s.y) ** 2 < s.r * s.r) n += s.own ? 100 : 1;
      }
      for (const r of layout.panels) {
        if (
          c.left < r.left + r.w &&
          c.left + w > r.left &&
          c.top < r.top + r.h &&
          c.top + h > r.top
        ) {
          // A covered panel is worse than a covered cell: the question
          // picker is the way out of the current view.
          n += 3;
        }
      }
      return n;
    };

    let best = candidates[0];
    let bestScore = Infinity;
    let bestDist = Infinity;
    for (const c of candidates) {
      const score = covers(c);
      if (score > bestScore) continue;
      const dx = Math.max(c.left - f.x, f.x - (c.left + w), 0);
      const dy = Math.max(c.top - f.y, f.y - (c.top + h), 0);
      const d = Math.hypot(dx, dy);
      if (score < bestScore || d < bestDist) {
        best = c;
        bestScore = score;
        bestDist = d;
      }
    }
    return best;
  }, [
    activeS,
    activePinned,
    wide,
    layout,
    positions,
    filter,
    nodes,
    popSize,
    popKey,
    faceGeom,
  ]);

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

  // A selected record stays until the mouse clicks away: anywhere outside
  // the stage lets go. Clicks inside are handled by the cells.
  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (t && t.closest(".sm-frame")) return;
      setPinned(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [pinned]);

  const pick = (q: QuestionId | null) => {
    setFilter(q);
    setPinned(null);
    setHovered(null);
    setStageHover(null);
  };

  // Land never changes, and the stage re-renders on every frame of the
  // canvas narrowing for the write-up pane, so the lattice is built once.
  const land = useMemo(
    () => (
      <g className="sm-land" aria-hidden>
        {HEXES.map((h) => (
          <polygon key={`${h.col}-${h.row}`} points={hexPoints(h.x, h.y)} />
        ))}
      </g>
    ),
    [],
  );

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
      <div className="sm-pin" ref={pinRef}>
        <div className="sm-stage">
          <div
            className={`sm-frame${filter ? " has-pane" : ""}`}
            ref={frameRef}
            onPointerLeave={() => {
              holdHover();
              setHovered(null);
            }}
          >
            <div className="sm-canvas" ref={canvasRef}>
              <svg
                viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
                preserveAspectRatio="xMidYMid meet"
                className="sm-svg"
                role="group"
                aria-label="World map of the stakeholder conversations"
                onClick={(e) => {
                  // A click on the sea, rather than on a cell, lets go.
                  if (e.target === e.currentTarget) setPinned(null);
                }}
              >
                <defs>
                  {/* Crops a photograph, or the silhouette, to the cell. */}
                  <clipPath id="sm-hexclip">
                    <polygon points={hexPoints(0, 0)} />
                  </clipPath>
                  <marker
                    id="sm-arrow"
                    viewBox="0 0 10 10"
                    refX="7.5"
                    refY="5"
                    markerWidth="4.4"
                    markerHeight="4.4"
                    orient="auto-start-reverse"
                  >
                    <path className="sm-arrowhead" d="M 0 0.6 L 9.4 5 L 0 9.4 Z" />
                  </marker>
                </defs>

                {/* Land. Inert: the ground the faces sit on, nothing more.
                 * Drawn complete, because a face may drift off its cell. */}
                {land}

                {filter && (
                  <g className="sm-links" aria-hidden>
                    {loop.map((d) => (
                      <g key={d}>
                        <path className="sm-link-casing" d={d} />
                        <path
                          className="sm-link"
                          d={d}
                          markerEnd="url(#sm-arrow)"
                        />
                      </g>
                    ))}
                  </g>
                )}

                {drawOrder.map(({ s }) => {
                  const lit = shows(s);
                  const pos = positions.get(s.id)!;
                  const isActive = lit && s.id === activeId;
                  const isPinned = s.id === pinned;
                  const isAnchor = Boolean(
                    filter && s.anchors?.includes(filter),
                  );
                  const isProvisional = Boolean(
                    filter &&
                      (s.provisional ?? []).includes(filter) &&
                      !s.questions.includes(filter) &&
                      !(s.anchors ?? []).includes(filter),
                  );
                  const wantsFace = Boolean(filter) && lit;
                  const hasPhoto =
                    Boolean(s.photo) && !s.consent && !broken.has(s.id);
                  const nodeStage =
                    filter && lit ? stageOf(filter, s.id) : null;
                  const cls = [
                    "sm-node",
                    lit ? "" : " is-dim",
                    wantsFace ? " is-face" : "",
                    isActive ? " is-active" : "",
                    isPinned ? " is-pinned" : "",
                    isAnchor ? " is-anchor" : "",
                    isProvisional ? " is-provisional" : "",
                    s.consent ? " is-withheld" : "",
                    stageHover && nodeStage
                      ? nodeStage === stageHover
                        ? " is-stagelit"
                        : " is-stagefade"
                      : "",
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
                      onPointerEnter={lit ? () => enterHover(s.id) : undefined}
                      onPointerLeave={lit ? releaseHover : undefined}
                      onFocus={lit ? () => setHovered(s.id) : undefined}
                      onBlur={lit ? () => setHovered(null) : undefined}
                      /* pointerup, not click: hovering re-orders this element
                       * so its enlarged face paints on top, and Chrome
                       * refuses to synthesise a click across that reorder. */
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
                        {/* Withheld entries get the same silhouette, ghosted
                         * by CSS: a person whose identity is not shown, not
                         * a gap. */}
                        {!hasPhoto && <Silhouette />}
                        <polygon className="sm-rim" points={hexPoints(0, 0)} />
                        {/* Only the conversations the question file marks
                         * as central wear the stage letter; everyone else
                         * stays an unbadged face. */}
                        {wantsFace && isKeyTo(filter!, s.id) && (
                          <g
                            className="sm-stage-badge"
                            aria-hidden
                            transform="translate(8.2, -8.2)"
                          >
                            <polygon points={hexPoints(0, 0, 4.8)} />
                            <text y="1.8">{stageOf(filter!, s.id)}</text>
                          </g>
                        )}
                      </g>
                      {/* The pointer target never grows with the face, so an
                       * enlarged neighbour cannot steal the cells around it.
                       * The visuals are pointer-inert; this circle is the
                       * whole target. */}
                      {lit && (
                        <circle
                          className="sm-hit"
                          cx="0"
                          cy="0"
                          r={wantsFace ? 34 : 11.9}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* The page's section heading lives here, in the panel, rather
             * than in the Markdown: the stage takes the viewport, so a
             * heading above it would only be glimpsed mid-glide. */}
            <header className="sm-head" ref={headRef}>
              <h2 id="sm-heading" className="sm-heading">
                Our human practices mapped
              </h2>
              {/* The record's headline numbers, the team's own count. The
               * map plots the conversations written up so far, which is
               * fewer; the full record below the map lists them. */}
              <HpStats />
              <p className="sm-standfirst">
                Click on stakeholders or select a question to explore our
                project.
              </p>
            </header>

            {/* The six questions in full, always readable, one per row; the
             * selected one is the honey row rather than a caption elsewhere. */}
            <div className="sm-filterbox" ref={filterboxRef}>
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
                  All conversations
                </button>
                {QUESTION_IDS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={filter === q ? "is-on" : undefined}
                    aria-pressed={filter === q}
                    onClick={() => pick(filter === q ? null : q)}
                  >
                    <strong>{q}</strong> {QUESTION_TITLES[q]}
                  </button>
                ))}
              </div>
              {filter && (
                <p className="sm-filter-key">
                  Arrows run this cycle&rsquo;s HONEY loop, Hear to Yield and
                  back. Conversations central to the question wear their
                  stage letter, the anchor interview carries the heavier rim,
                  and a dashed rim is a tag we assigned provisionally, not
                  one the team&rsquo;s question table states. Hover a stage
                  in the write-up to pick its people out.
                </p>
              )}
            </div>

            {/* The question walked through its HONEY stages, from the
             * question's own file (src/content/questions), in the pane down
             * the right-hand side. Hovering or focusing a stage picks its
             * people out on the map. */}
            {filter && (
              <aside
                className="sm-qpanel"
                ref={qpanelRef}
                aria-labelledby="sm-qpanel-title"
              >
                <header className="sm-qpanel-head">
                  <p className="sm-qpanel-id">{filter} through the HONEY loop</p>
                  <h3 id="sm-qpanel-title" className="sm-qpanel-title">
                    {QUESTION_TITLES[filter]}
                  </h3>
                </header>
                {QUESTION_CYCLES[filter].stages.map((st) => (
                  <section
                    key={st.stage}
                    className={`sm-qstage${
                      stageHover === st.stage ? " is-hover" : ""
                    }`}
                    tabIndex={0}
                    onPointerEnter={() => setStageHover(st.stage)}
                    onPointerLeave={() =>
                      setStageHover((h) => (h === st.stage ? null : h))
                    }
                    onFocus={() => setStageHover(st.stage)}
                    onBlur={() =>
                      setStageHover((h) => (h === st.stage ? null : h))
                    }
                  >
                    <h4 className="sm-qstage-head">
                      <span className="sm-qstage-letter" aria-hidden>
                        {st.stage}
                      </span>
                      {STAGE_NAMES[st.stage]}
                      {st.people.length > 0 && (
                        <span className="sm-qstage-count">
                          {st.people.length}{" "}
                          {st.people.length === 1
                            ? "conversation"
                            : "conversations"}
                        </span>
                      )}
                    </h4>
                    {st.body && (
                      <div className="sm-qstage-body">
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {st.body}
                        </Markdown>
                      </div>
                    )}
                  </section>
                ))}
              </aside>
            )}

            {(activeS || !wide) && (
              <div
                ref={popRef}
                className={`sm-pop${activePinned ? " is-pinned" : ""}`}
                onPointerEnter={activePinned ? undefined : holdHover}
                onPointerLeave={activePinned ? undefined : releaseHover}
                style={
                  cardPos
                    ? { left: `${cardPos.left}px`, top: `${cardPos.top}px` }
                    : undefined
                }
                role={pinned ? "dialog" : undefined}
                aria-label={pinned ? "Selected conversation" : undefined}
              >
                {activeS ? (
                  <PersonCard
                    s={activeS}
                    filter={filter}
                    pinned={activePinned}
                    photoNote={
                      activeS.photo && !broken.has(activeS.id)
                        ? activeS.photoShows
                        : undefined
                    }
                    onPick={pick}
                    onClose={() => setPinned(null)}
                  />
                ) : (
                  <p className="sm-pop-hint">
                    Tap a marked hexagon and the conversation appears here.
                  </p>
                )}
              </div>
            )}
          </div>
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
                <Profile key={s.id} s={s} />
              ))}
            </ul>
          </div>
        ))}
      </details>
    </section>
  );
}
