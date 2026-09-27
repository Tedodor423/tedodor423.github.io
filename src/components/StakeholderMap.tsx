import { useEffect, useMemo, useRef, useState } from "react";
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
  STAGE_NAMES,
  STAGE_ORDER,
  STAKEHOLDERS,
  questionsOf,
  stageOf,
  type QuestionId,
  type Stakeholder,
} from "../data/stakeholders";
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
 *     way past. Wheel scrolling snaps around it in both directions: a
 *     downward wheel from above glides straight to the pinned map and one
 *     more glides past it; an upward wheel that brings the map back into
 *     view glides it back to fullscreen and one more glides back above it.
 *     Beyond those zones scrolling is untouched, so the page never feels
 *     held. The pin is position:sticky and only wheels are intercepted -
 *     the scrollbar, touch and keyboard stay native - and both the easing
 *     and the snapping are dropped under prefers-reduced-motion. While the
 *     stage covers the viewport the site menu keeps out of the way (the
 *     html[data-map-stage] rule), because it re-shows itself on any upward
 *     scroll and would sit over the map's top edge.
 *   - Every conversation is one cell. Pointing at a cell grows it into the
 *     person's photograph, with their record in a box beside the face (fixed
 *     per face, never chasing the pointer). Selecting keeps the box until a
 *     click away, Escape, or another selection.
 *   - Picking a question (the panel in the top corner) turns everyone who
 *     fed it into large faces and draws that question's HONEY loop through
 *     them: curved arrows run Hear > Observe > Navigate > Evaluate > Yield
 *     and close back to Hear, and each face is badged with its stage. Stages
 *     come from src/data/stakeholders.ts (stageOf), which records only what
 *     the team's write-up states and defaults the rest to Hear - the
 *     write-up's own definition of the stage.
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
  const clamp = (o: { x: number; y: number }) => {
    o.x = Math.min(Math.max(o.x, m), VIEW.w - m);
    o.y = Math.min(Math.max(o.y, m), VIEW.h - m);
    for (const b of blocks) {
      if (o.x > b.left && o.x < b.right && o.y > b.top && o.y < b.bottom) {
        // Leave through the nearest edge. A panel flush with a map edge
        // makes that exit unreachable, but its distance is then the
        // largest, so another edge wins.
        const dl = o.x - b.left;
        const dr = b.right - o.x;
        const dt = o.y - b.top;
        const db = b.bottom - o.y;
        const min = Math.min(dl, dr, dt, db);
        if (min === dl) o.x = b.left;
        else if (min === dr) o.x = b.right;
        else if (min === dt) o.y = b.top;
        else o.y = b.bottom;
        o.x = Math.min(Math.max(o.x, m), VIEW.w - m);
        o.y = Math.min(Math.max(o.y, m), VIEW.h - m);
        moved = true;
      }
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

/* A profile appears twice: in the box beside the face and in the roster
 * below the map. Only the roster copy is given an id, so a search result has
 * one place to land and the document has no duplicate ids.
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

/* The box beside the face. Anchored to the face, never to the pointer, so it
 * can be read while the pointer rests; a hover previews, a selection shows
 * everything and stays until the reader clicks away. Withheld entries show
 * the withholding note and an anonymous silhouette, nothing else. */
function PersonCard({
  s,
  filter,
  pinned,
  broken,
  onBroken,
  onClose,
}: {
  s: Stakeholder;
  filter: QuestionId | null;
  pinned: boolean;
  broken: Set<string>;
  onBroken: (id: string) => void;
  onClose: () => void;
}) {
  const withheld = Boolean(s.consent);
  const hasPhoto = Boolean(s.photo) && !withheld && !broken.has(s.id);
  const teaser = s.quote ?? s.learnt[0];
  const inCycle = filter && questionsOf(s).includes(filter);
  return (
    <div className="sm-pop-profile">
      <div className="sm-pop-media">
        {hasPhoto ? (
          <img
            src={s.photo}
            alt={`Portrait of ${s.photoShows ?? s.name}`}
            onError={() => onBroken(s.id)}
          />
        ) : (
          <svg viewBox="-12 -12.5 24 25" aria-hidden>
            <polygon className="sm-pop-hex" points={hexPoints(0, 0)} />
            <Silhouette />
          </svg>
        )}
        {hasPhoto && s.photoShows && (
          <p className="sm-pop-photonote">Photo: {s.photoShows}</p>
        )}
      </div>
      <div className="sm-pop-body">
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
          </>
        )}
        {inCycle && (
          <p className="sm-meta sm-stageline">
            {filter} cycle · {STAGE_NAMES[stageOf(filter, s.id)]}
          </p>
        )}
        <QuestionTags s={s} />
        {!withheld && !pinned && teaser && (
          <p className={`sm-pop-teaser${s.quote ? " sm-quote" : ""}`}>
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
        {!withheld && !pinned && (
          <p className="sm-hint">Select to read everything they told us.</p>
        )}
        {!withheld && pinned && s.quote && (
          <p className="sm-quote">
            &ldquo;
            <Marked text={s.quote} />
            &rdquo;
          </p>
        )}
        {!withheld && pinned && s.learnt.length > 0 && (
          <ul className="sm-learnt">
            {s.learnt.map((l) => (
              <li key={l}>
                <Marked text={l} />
              </li>
            ))}
          </ul>
        )}
        {!withheld && pinned && s.changed && (
          <p className="sm-changed">
            <span className="sm-changed-label">What it changed</span>
            <Marked text={s.changed} />
          </p>
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
  // entries render the silhouette instead, in the map and in the card.
  const [broken, setBroken] = useState<Set<string>>(new Set());

  const pinRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLElement>(null);
  const filterboxRef = useRef<HTMLDivElement>(null);

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
  // panels. The panels share the frame's origin with the canvas.
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
    const ro = new ResizeObserver(measure);
    ro.observe(canvas);
    if (headRef.current) ro.observe(headRef.current);
    if (filterboxRef.current) ro.observe(filterboxRef.current);
    return () => ro.disconnect();
  }, []);

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

  /* Snap scrolling around the stage, wheel only, both directions.
   *
   * Going down: from above (the page opens with about one screen of hero
   * above this section), any downward wheel glides the reader straight to
   * the pinned map; one more glides past it, to where the map has just
   * left the screen. Going up, the mirror: an upward wheel while the map
   * peeks back in from above the viewport glides it back to fullscreen,
   * and one more glides back above it, map just below the screen. Outside
   * those zones nothing is intercepted, so scrolling on through the rest
   * of the page never drags - and the post-landing cooldown only swallows
   * wheels that would fire the next snap, for the same reason.
   *
   * Scrollbar drags, touch, keyboard, narrow screens and
   * prefers-reduced-motion stay native, a wheel over the open record
   * scrolls the record, and a wheel against the current glide's direction
   * cancels it and hands control back. If content ever grows above this
   * section, revisit the "any downward wheel from above" rule. */
  useEffect(() => {
    const wrap = pinRef.current;
    if (!wrap) return;
    const wideMq = window.matchMedia("(min-width: 48rem)");
    const stillMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let animating = false;
    let animDown = true;
    // Trackpads keep firing momentum events after a flick; a short silence
    // after each landing keeps one flick to one stop.
    let coolUntil = 0;

    const glide = (target: number) => {
      cancelAnimationFrame(raf);
      animating = true;
      const from = window.scrollY;
      animDown = target >= from;
      const t0 = performance.now();
      // Short enough that a deliberate follow-up wheel is never eaten: the
      // glide plus the cooldown stay under a second.
      const D = 520;
      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      const step = (now: number) => {
        const t = Math.min((now - t0) / D, 1);
        // "instant", explicitly: Bootstrap's reboot sets scroll-behavior:
        // smooth on :root, which would turn every frame of this glide into
        // its own competing native animation.
        window.scrollTo({
          top: from + (target - from) * ease(t),
          behavior: "instant",
        });
        if (t < 1) {
          raf = requestAnimationFrame(step);
        } else {
          animating = false;
          coolUntil = performance.now() + 350;
        }
      };
      raf = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      if (!wideMq.matches || stillMq.matches || e.deltaY === 0) return;
      const t = e.target as Element | null;
      // The open record scrolls itself.
      if (t && t.closest(".sm-pop")) return;
      const down = e.deltaY > 0;
      if (animating) {
        if (down === animDown) {
          e.preventDefault();
        } else {
          cancelAnimationFrame(raf);
          animating = false;
        }
        return;
      }
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      let target: number | null = null;
      if (down) {
        if (r.top > 1) {
          target = window.scrollY + r.top;
        } else if (r.bottom > vh - 1) {
          // Past the map: the wrapper's bottom reaches the viewport's top,
          // the map has just left the screen and the page continues.
          target = window.scrollY + r.bottom;
        }
      } else {
        if (r.top <= 1 && r.bottom >= vh - 1) {
          // On the map: back above it, map just below the screen.
          target = Math.max(0, window.scrollY + r.top - vh);
        } else if (r.bottom > 1 && r.bottom < vh - 1) {
          // The map is peeking back in from the top: bring it back whole,
          // to the same pinned position the downward snap lands on - the
          // one place both fade ramps read as fully present.
          target = window.scrollY + r.top;
        }
      }
      if (target === null) return;
      e.preventDefault();
      if (performance.now() < coolUntil) return;
      glide(target);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(raf);
    };
  }, []);

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
    if (!activeS || !wide || !layout.w || !layout.h) return null;
    const pos = positions.get(activeS.id);
    if (!pos) return null;
    const scale = Math.min(layout.w / MAP_W, layout.h / MAP_H);
    const ox = (layout.w - MAP_W * scale) / 2;
    const oy = (layout.h - MAP_H * scale) / 2;
    const toPx = (p: XY) => ({ x: ox + p.x * scale, y: oy + p.y * scale });
    const f = toPx(pos);
    const isPinned = pinned === activeS.id;
    const w = (isPinned ? 24 : 23) * 16;
    const h = isPinned ? Math.min(layout.h * 0.52, 30 * 16) : 300;
    const gap = HEX_R * ACTIVE_SCALE * scale + 16;
    const M = 12;

    const q = filter;
    const spots = nodes
      .filter((n) => !q || questionsOf(n.s).includes(q))
      .map((n) => {
        const c = toPx(positions.get(n.s.id)!);
        const own = n.s.id === activeS.id;
        const r =
          (own ? HEX_R * ACTIVE_SCALE + 6 : (q ? FACE_R : HEX_R * 1.3) + 4) *
          scale;
        return { ...c, r };
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
        if ((cx - s.x) ** 2 + (cy - s.y) ** 2 < s.r * s.r) n++;
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
  }, [activeS, wide, layout, positions, pinned, filter, nodes]);

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
      <div className="sm-pin" ref={pinRef}>
        <div className="sm-stage">
          <div
            className="sm-frame"
            ref={frameRef}
            onPointerLeave={() => setHovered(null)}
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
                <g className="sm-land" aria-hidden>
                  {HEXES.map((h) => (
                    <polygon
                      key={`${h.col}-${h.row}`}
                      points={hexPoints(h.x, h.y)}
                    />
                  ))}
                </g>

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
                  const cls = [
                    "sm-node",
                    lit ? "" : " is-dim",
                    wantsFace ? " is-face" : "",
                    isActive ? " is-active" : "",
                    isPinned ? " is-pinned" : "",
                    isAnchor ? " is-anchor" : "",
                    isProvisional ? " is-provisional" : "",
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
                      onPointerLeave={
                        lit
                          ? () =>
                              setHovered((h) => (h === s.id ? null : h))
                          : undefined
                      }
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
                        {wantsFace && (
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
                Who we spoke to
              </h2>
              {/* The record's headline numbers, the team's own count. The
               * map plots the conversations written up so far, which is
               * fewer, and the standfirst says so. */}
              <HpStats />
              <p className="sm-standfirst">
                The map plots the {STAKEHOLDERS.length} conversations written
                up so far, {withheld} of them withheld pending consent. Point
                at a marked hexagon and it grows into the person, with their
                record beside it; select it to keep the record open until you
                click away. Pick a question to lay its HONEY loop over the
                map. The full record is below the map as text.
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
                  back, through everyone who fed it; each face is badged with
                  the stage the team&rsquo;s write-up places it in, and the
                  anchor interview carries the heavier rim. A dashed rim is a
                  tag we assigned provisionally, not one the team&rsquo;s
                  question table states.
                </p>
              )}
            </div>

            {(activeS || !wide) && (
              <div
                className={`sm-pop${pinned && pinned === activeId ? " is-pinned" : ""}`}
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
                    pinned={Boolean(pinned) && pinned === activeId}
                    broken={broken}
                    onBroken={(id) =>
                      setBroken((prev) => new Set(prev).add(id))
                    }
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
                <Profile key={s.id} s={s} detail anchor />
              ))}
            </ul>
          </div>
        ))}
      </details>
    </section>
  );
}
