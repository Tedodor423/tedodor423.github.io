import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { Link, useLocation } from "react-router-dom";
import {
  EVENTS_BY_DATE,
  THREADS,
  THREAD_NAMES,
  TRACKS,
  TRACK_NAMES,
  fullDate,
  monthLabel,
  months,
  type ThreadId,
  type TimelineEvent,
  type TrackId,
} from "../data/timeline";
import { getPathMapping } from "../utils/getPathMapping";
import { DECK_MEDIA } from "../utils/deck";
import { useMedia } from "../utils/useMedia";
import {
  layout,
  type Item,
  type Layout,
  type Metrics,
} from "../utils/timelineLayout";
import { Marked } from "./Marked";
import "./ProjectTimeline.css";

/* Eight months of the project as one line that runs sideways, a row for each
 * of the five workstreams.
 *
 * WHY ROWS. A single chronological list is the one shape that loses the
 * argument. The project's own account of itself is that the bee lab, the wet
 * lab and the interviews kept redirecting each other: the mite shortage in
 * June rewrote the wet lab's dosing arithmetic, a July interview about price
 * retired a chassis that had had three months of design behind it, and the
 * mini-jamboree feedback in August rebuilt this wiki. Reading down a column of
 * the chart shows that. Reading down a list hides it.
 *
 * Each event is a mark on its row: a dot, or a bar where the record gives a
 * run of days. Its short label hangs off a leader to one side of the row, and
 * src/utils/timelineLayout.ts decides where, so that no two labels collide and
 * no leader runs through somebody else's label.
 *
 * THE RIDE. On a screen big enough to hold the chart whole, it pins and the
 * page's own scrolling carries it left: the track is as much taller than the
 * window as the chart is wider, so one pixel down is one pixel along. Nothing
 * takes over the wheel. A horizontal swipe is passed on as the same scroll,
 * and tabbing to a label moves the page to wherever that label is. On a phone,
 * under reduced motion, or on a screen too short for the chart, it is an
 * ordinary box that scrolls sideways.
 *
 * READING AN ENTRY. Pointing at a label, or tabbing to it, opens a card with
 * the full title and the full account; selecting it keeps the card open, with
 * its links. The house rules forbid content that exists only behind a hover,
 * so the full record is also written out underneath, one entry per event,
 * carrying the ids the search index links to.
 *
 * FOCUS. One mechanism does the filtering: a workstream (its name in the
 * gutter), a thread, or the turning points. Everything outside it fades
 * rather than disappearing, and a thread is also drawn as a line from mark to
 * mark, so following one shows the question crossing between the rows.
 */

type Focus =
  | { kind: "all" }
  | { kind: "track"; id: TrackId }
  | { kind: "thread"; id: ThreadId }
  | { kind: "turns" };

const ALL: Focus = { kind: "all" };

function inFocus(event: TimelineEvent, focus: Focus): boolean {
  switch (focus.kind) {
    case "all":
      return true;
    case "track":
      return event.track === focus.id;
    case "thread":
      return Boolean(event.threads?.includes(focus.id));
    case "turns":
      return Boolean(event.turn);
  }
}

const sameFocus = (a: Focus, b: Focus) =>
  a.kind === b.kind && (!("id" in a) || !("id" in b) || a.id === b.id);

/** The label under an event that says what kind of entry it is. */
function kindOf(event: TimelineEvent): string | null {
  if (event.ahead) return "still ahead";
  if (event.setback && event.turn) return "went wrong, and changed the plan";
  if (event.setback) return "went wrong";
  if (event.turn) return "turning point";
  return null;
}

/** A row's colour, handed to everything drawn for it. */
const laneStyle = (track: TrackId) =>
  ({ "--lane": `var(--lane-${track})` }) as CSSProperties;

/* ---------- sizes ---------- */

/** The label face, in rem. Everything the layout counts is derived from it. */
const LABEL_REM = 0.72;
/** The strip above the first row that carries the acts and the months, px. */
const HEAD = 44;
/** Pixels per day the pinned chart may use, tightest first. Past 32 the
 *  height stops falling: what is left is runs of events on the same few days,
 *  which no amount of width spreads out. */
const DAYS = [20, 22, 24, 26, 28, 32] as const;
/** And the one it uses when it scrolls on its own. */
const LOOSE_DAY = 24;
/** The stage's rules, and a little air above and below the chart, px. */
const STAGE_CHROME = 16;

/**
 * The label face's measurements, read from the page. The width of one
 * character is measured rather than assumed, because the mono stack resolves
 * to a different face on each system and they differ by a tenth.
 */
function metricsOf(): Omit<Metrics, "day"> {
  const root = getComputedStyle(document.documentElement);
  const rem = parseFloat(root.fontSize) || 16;
  const size = LABEL_REM * rem;
  let char = size * 0.61;
  const context = document.createElement("canvas").getContext("2d");
  const stack = root.getPropertyValue("--font-mono").trim();
  if (context && stack) {
    context.font = `${size}px ${stack}`;
    const measured = context.measureText("0".repeat(40)).width / 40;
    // A sliver over, so a label never comes up a pixel short and clips.
    if (measured > 0) char = measured * 1.02;
  }
  const longest = Math.max(
    ...EVENTS_BY_DATE.map((e) => (e.short ?? e.title).length),
  );
  return {
    char,
    label: Math.round(size * 1.35) + 4,
    pad: 4,
    stem: 10,
    gapX: 8,
    gapY: 3,
    lane: 44,
    head: HEAD,
    foot: 10,
    lead: 6,
    tail: Math.ceil(longest * char) + 40,
    tie: 10,
  };
}

/** Where else on the wiki an event is argued out. */
function Links({ event }: { event: TimelineEvent }) {
  if (!event.links?.length) return null;
  return (
    <p className="tl-links">
      <span className="tl-links-label">Read on</span>
      {event.links.map((l) => (
        <Link key={l.href} to={l.href}>
          {l.label}
        </Link>
      ))}
    </p>
  );
}

/* ---------- the marks ---------- */

/** What sits on the axis for one event: a dot, a cross, a ring, or a bar. */
function Mark({ item }: { item: Item }) {
  const { event, x, x2, axis } = item;
  if (x2 !== null) {
    return (
      <rect
        className={event.ahead ? "tl-range is-ahead" : "tl-range"}
        x={x - 3}
        y={axis - 3}
        width={Math.max(6, x2 - x + 6)}
        height={6}
        rx={2}
      />
    );
  }
  if (event.setback) {
    return (
      <g className="tl-cross">
        <circle className="tl-cross-back" cx={x} cy={axis} r={6} />
        <path
          d={`M${x - 3.5} ${axis - 3.5}L${x + 3.5} ${axis + 3.5}M${x + 3.5} ${axis - 3.5}L${x - 3.5} ${axis + 3.5}`}
        />
      </g>
    );
  }
  return (
    <circle
      className={event.ahead ? "tl-dot is-ahead" : "tl-dot"}
      cx={x}
      cy={axis}
      r={4.5}
    />
  );
}

/** The key, drawn with the same marks the chart uses. */
function Legend() {
  const swatch = (children: ReactNode) => (
    <svg className="tl-legend-mark" viewBox="0 0 22 12" aria-hidden="true">
      <line className="tl-axis" x1={0} x2={22} y1={6} y2={6} />
      {children}
    </svg>
  );
  return (
    <ul className="tl-legend" aria-label="Key">
      <li>
        {swatch(<circle className="tl-dot" cx={11} cy={6} r={4.5} />)}
        Event
      </li>
      <li>
        {swatch(
          <rect className="tl-range" x={2} y={3} width={18} height={6} rx={2} />,
        )}
        Several days
      </li>
      <li>
        {swatch(
          <g className="tl-cross">
            <circle className="tl-cross-back" cx={11} cy={6} r={6} />
            <path d="M7.5 2.5L14.5 9.5M14.5 2.5L7.5 9.5" />
          </g>,
        )}
        Went wrong
      </li>
      <li>
        {swatch(<circle className="tl-dot is-ahead" cx={11} cy={6} r={4.5} />)}
        Ahead
      </li>
      <li>
        <span className="tl-legend-turn">Turning point</span>
      </li>
    </ul>
  );
}

/* ---------- the card ---------- */

function Card({
  item,
  kept,
  cardRef,
  onThread,
  onClose,
  onEnter,
  onLeave,
}: {
  item: Item;
  kept: boolean;
  cardRef: RefObject<HTMLDivElement | null>;
  onThread: (id: ThreadId) => void;
  onClose: () => void;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const { event } = item;
  const kind = kindOf(event);
  return (
    <div
      ref={cardRef}
      id="tl-card"
      className={kept ? "tl-card is-kept" : "tl-card"}
      role="group"
      aria-label={event.title}
      tabIndex={-1}
      style={laneStyle(event.track)}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <div className="tl-card-head">
        <p className="tl-card-meta">
          <span className="tl-card-swatch" aria-hidden="true" />
          {fullDate(event)} · {TRACK_NAMES[event.track]}
          {kind ? ` · ${kind}` : ""}
        </p>
        {kept && (
          <button
            type="button"
            className="tl-close"
            aria-label="Close"
            onClick={onClose}
          >
            {/* Drawn here, two strokes, no icon set. */}
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 2L10 10M10 2L2 10" />
            </svg>
          </button>
        )}
      </div>
      <p className="tl-card-title">
        <Marked text={event.title} />
      </p>
      {event.detail && (
        <p className="tl-card-body">
          <Marked text={event.detail} />
        </p>
      )}
      {event.check && (
        <p className="tl-check">
          Figures here are as recorded in the team&rsquo;s own working archive
          and have not yet been reconciled against the lab journals.
        </p>
      )}
      {event.threads?.length ? (
        <p className="tl-threads">
          <span className="tl-threads-label">Part of</span>
          {event.threads.map((id) => (
            <button
              key={id}
              type="button"
              className="tl-thread-link"
              onClick={() => onThread(id)}
            >
              {THREAD_NAMES[id]}
            </button>
          ))}
        </p>
      ) : null}
      <Links event={event} />
      {/* A router link rather than a plain anchor: the record is collapsed, so
          a native fragment jump lands on an element with no layout box and the
          page does not move. ScrollToHash opens the <details> first. */}
      <p className="tl-card-foot">
        <Link to={`#tl-${event.id}`}>This entry in the written record</Link>
      </p>
    </div>
  );
}

/* ---------- the timeline ---------- */

export function ProjectTimeline() {
  const [focus, setFocus] = useState<Focus>(ALL);
  // The card shows the entry under the pointer or keyboard, else the one the
  // reader selected and kept.
  const [hover, setHover] = useState<string | null>(null);
  const [kept, setKept] = useState<string | null>(null);
  const shown = hover ?? kept;

  const ride = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const labels = useRef(new Map<string, HTMLButtonElement>());
  /** How far the chart has moved left, px. */
  const shift = useRef(0);
  const leaving = useRef<number | undefined>(undefined);

  /* Size. The chart pins only where a layout fits the window's height.
   *
   * Opening its page, the stage fills the window from the first frame, with
   * the menu over its top until the first scroll sends the menu away. Two
   * heights, then: the room while the menu shows, and the room once it has
   * gone. */
  const [base] = useState(metricsOf);
  const wide = useMedia(DECK_MEDIA);
  const [room, setRoom] = useState({ arrived: 0, riding: 0, menu: 0 });
  const [viewWidth, setViewWidth] = useState(0);

  useLayoutEffect(() => {
    const barEl = bar.current;
    const viewEl = view.current;
    if (!barEl || !viewEl) return;
    const measure = () => {
      const riding = window.innerHeight - barEl.offsetHeight - STAGE_CHROME;
      const menu =
        document.querySelector<HTMLElement>(".site-nav")?.offsetHeight ?? 0;
      setRoom((prev) =>
        prev.riding === riding && prev.menu === menu
          ? prev
          : { arrived: riding - menu, riding, menu },
      );
      setViewWidth(viewEl.clientWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(barEl);
    observer.observe(viewEl);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Every scale, laid out once: a resize only chooses between them.
  const plans = useMemo(
    () => new Map(DAYS.map((day) => [day, layout({ ...base, day })])),
    [base],
  );
  // The tightest scale that is whole on arrival; failing that, the tightest
  // that is whole once the menu has gone.
  const scales = DAYS.map((day) => plans.get(day)!);
  const fitted =
    wide && room.riding > 0
      ? (scales.find((p) => p.height <= room.arrived) ??
        scales.find((p) => p.height <= room.riding) ??
        null)
      : null;
  const pinned = fitted !== null;
  const plan: Layout = fitted ?? plans.get(LOOSE_DAY)!;
  const travel = pinned ? Math.max(0, plan.width - viewWidth) : 0;
  const byId = useMemo(
    () => new Map(plan.items.map((item) => [item.event.id, item])),
    [plan],
  );

  /* The month and act at the left edge, for the gutter. */
  const [now, setNow] = useState({ month: plan.months[0].month, act: "" });
  const readout = useCallback(() => {
    const at = shift.current + 24;
    const month =
      [...plan.months].reverse().find((m) => m.x <= at)?.month ??
      plan.months[0].month;
    const act = plan.acts.find((a) => at >= a.x0 && at < a.x1)?.name ?? "";
    setNow((prev) =>
      prev.month === month && prev.act === act ? prev : { month, act },
    );
  }, [plan]);

  /* The card sits next to its label, inside the stage, on whichever side has
   * the room. Placed by hand on every frame the chart moves, so it travels
   * with the label rather than being left behind. */
  const placeCard = useCallback(() => {
    const cardEl = card.current;
    const stageEl = stage.current;
    const viewEl = view.current;
    const barEl = bar.current;
    const anchor = shown ? labels.current.get(shown) : null;
    if (!cardEl || !stageEl || !viewEl || !barEl || !anchor) return;
    const a = anchor.getBoundingClientRect();
    const s = stageEl.getBoundingClientRect();
    const v = viewEl.getBoundingClientRect();
    cardEl.style.visibility =
      a.right > v.left && a.left < v.right ? "" : "hidden";
    const w = cardEl.offsetWidth;
    const h = cardEl.offsetHeight;
    const left = Math.min(Math.max(a.left - s.left, 8), s.width - w - 8);
    // Never up under the menu: the bar's top is as high as the card goes.
    const ceiling = barEl.getBoundingClientRect().top - s.top;
    const below = s.bottom - a.bottom;
    const above = a.top - s.top - ceiling;
    const top =
      below >= h + 8 || below >= above
        ? a.bottom - s.top + 6
        : a.top - s.top - h - 6;
    cardEl.style.left = `${Math.max(8, left)}px`;
    cardEl.style.top = `${Math.max(ceiling + 4, top)}px`;
  }, [shown]);

  useLayoutEffect(placeCard, [placeCard, plan]);
  useEffect(readout, [readout]);

  // The ride reads these on every frame; held in refs so that pointing at a
  // label does not tear the scroll listeners down and put them back.
  const follow = useRef({ readout, placeCard });
  follow.current = { readout, placeCard };

  /* The ride: the page's scroll, read once a frame, moves the chart left. */
  useEffect(() => {
    const rideEl = ride.current;
    const canvasEl = canvas.current;
    const stageEl = stage.current;
    if (!pinned || !rideEl || !canvasEl || !stageEl) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      const top = rideEl.getBoundingClientRect().top;
      shift.current = Math.min(travel, Math.max(0, -top));
      canvasEl.style.transform = `translate3d(${-shift.current}px, 0, 0)`;
      follow.current.readout();
      follow.current.placeCard();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    // A sideways swipe or a tilted wheel has nowhere to go on a pinned stage,
    // and in Chrome it would page back through the history. It becomes the
    // same scroll as a turn of the wheel.
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : 1;
      window.scrollBy({ top: event.deltaX * unit, behavior: "instant" });
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    stageEl.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      stageEl.removeEventListener("wheel", onWheel);
      canvasEl.style.transform = "";
      shift.current = 0;
    };
  }, [pinned, travel]);

  /* Unpinned, the box scrolls on its own and is read the same way. */
  const onViewScroll = () => {
    if (pinned || !view.current) return;
    shift.current = view.current.scrollLeft;
    readout();
    placeCard();
  };

  /* A label reached by Tab may be off to the side of a pinned stage, where
   * the browser cannot scroll it into view: move the page to it instead. */
  const reveal = (item: Item) => {
    const rideEl = ride.current;
    if (!pinned || !rideEl) return;
    const from = shift.current;
    if (item.left >= from + 16 && item.left + item.width <= from + viewWidth - 16) {
      return;
    }
    const to = Math.min(travel, Math.max(0, item.x - viewWidth * 0.3));
    const rideTop = rideEl.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: rideTop + to, behavior: "instant" });
  };

  /* ---------- the card's comings and goings ---------- */

  /* In a staircase the labels sit close, so the way from a label into its
   * card can pass over a neighbour. A card already open for one entry
   * therefore changes to another only once the pointer has rested there for
   * a moment; reaching the card first cancels the change. The keyboard is
   * never kept waiting. */
  const switching = useRef<number | undefined>(undefined);
  const hoverNow = useRef(hover);
  hoverNow.current = hover;

  const enter = useCallback((id: string, now = false) => {
    window.clearTimeout(leaving.current);
    window.clearTimeout(switching.current);
    const open = hoverNow.current;
    if (now || open === null || open === id) setHover(id);
    else switching.current = window.setTimeout(() => setHover(id), 140);
  }, []);
  // A short grace, so the pointer can cross the gap from a label to its card.
  const leave = useCallback(() => {
    window.clearTimeout(leaving.current);
    window.clearTimeout(switching.current);
    leaving.current = window.setTimeout(() => setHover(null), 160);
  }, []);
  const holdCard = useCallback(() => {
    window.clearTimeout(leaving.current);
    window.clearTimeout(switching.current);
  }, []);
  useEffect(
    () => () => {
      window.clearTimeout(leaving.current);
      window.clearTimeout(switching.current);
    },
    [],
  );

  const select = (id: string, event: ReactMouseEvent) => {
    const keep = kept !== id;
    setKept(keep ? id : null);
    // From the keyboard, the card's links are next in line.
    if (keep && event.detail === 0) {
      requestAnimationFrame(() => card.current?.focus({ preventScroll: true }));
    }
  };

  // The label that focus is being handed back to, which must not take it as
  // a reason to open the card again.
  const quiet = useRef<string | null>(null);
  const close = useCallback(() => {
    const back = kept ?? hover;
    setKept(null);
    setHover(null);
    if (back && card.current?.contains(document.activeElement)) {
      quiet.current = back;
      labels.current.get(back)?.focus({ preventScroll: true });
    }
  }, [kept, hover]);

  // Escape closes the card, and a press anywhere else lets a kept one go.
  useEffect(() => {
    if (!shown) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    // Labels and marks toggle the card themselves, on click.
    const onDown = (event: PointerEvent) => {
      const target = event.target as Element;
      if (card.current?.contains(target)) return;
      if (target.closest?.(".tl-label, .tl-hit")) return;
      setKept(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [shown, close]);

  /* ---------- focus ---------- */

  const pick = useCallback((next: Focus) => {
    setFocus((current) => (sameFocus(current, next) ? ALL : next));
  }, []);

  const litCount = useMemo(
    () => EVENTS_BY_DATE.filter((e) => inFocus(e, focus)).length,
    [focus],
  );
  const activeThread =
    focus.kind === "thread" ? THREADS.find((t) => t.id === focus.id) : null;
  const activeTrack =
    focus.kind === "track" ? TRACKS.find((t) => t.id === focus.id) : null;

  // A followed thread, drawn from mark to mark in date order.
  const threadPath = useMemo(() => {
    if (focus.kind !== "thread") return null;
    const points = plan.items
      .filter((item) => item.event.threads?.includes(focus.id))
      .map((item) => `${item.x},${item.axis}`);
    return points.length > 1 ? `M${points.join("L")}` : null;
  }, [focus, plan]);

  const monthList = useMemo(() => months(), []);
  const byMonth = useMemo(() => {
    const map = new Map<string, TimelineEvent[]>();
    for (const e of EVENTS_BY_DATE) {
      const key = e.date.slice(0, 7);
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    }
    return map;
  }, []);

  const m = plan.metrics;
  const shownItem = shown ? byId.get(shown) : undefined;

  // On a page that opens on the timeline (Page.titleInBody), the page's
  // title is written in the bar rather than in a header band above it.
  const { pathname } = useLocation();
  const title = useMemo(() => {
    const page = getPathMapping()[pathname];
    return page?.titleInBody ? page.title : null;
  }, [pathname]);

  return (
    <section
      className="project-timeline"
      aria-labelledby={title ? "tl-title" : undefined}
      aria-label={title ? undefined : "Project timeline"}
    >
      {/* Opening its page, a pinned ride starts under the menu at the very
          top of the document (.opens-page in the stylesheet): the stage is
          the whole window from the first frame, and the first scroll already
          moves the chart. */}
      <div
        ref={ride}
        className={[
          "tl-ride",
          pinned ? "is-pinned" : "",
          pinned && title ? "opens-page" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          pinned
            ? ({
                height: `calc(100vh + ${travel}px)`,
                "--tl-nav-h": `${room.menu}px`,
              } as CSSProperties)
            : undefined
        }
      >
        <div ref={stage} className="tl-stage">
          <div ref={bar} className={title ? "tl-bar has-title" : "tl-bar"}>
            {title && (
              <h1 id="tl-title" className="tl-title">
                {title}
              </h1>
            )}
            <div className="tl-controls">
              <div
                className="tl-filter"
                role="group"
                aria-label="What to show"
              >
                <button
                  type="button"
                  className={focus.kind === "all" ? "is-on" : undefined}
                  aria-pressed={focus.kind === "all"}
                  onClick={() => setFocus(ALL)}
                >
                  Everything
                </button>
                <button
                  type="button"
                  className={focus.kind === "turns" ? "is-on" : undefined}
                  aria-pressed={focus.kind === "turns"}
                  onClick={() => pick({ kind: "turns" })}
                >
                  Turning points
                </button>
                <label className="tl-follow">
                  <span>Follow a thread</span>
                  <select
                    value={focus.kind === "thread" ? focus.id : ""}
                    onChange={(e) =>
                      setFocus(
                        e.target.value
                          ? { kind: "thread", id: e.target.value as ThreadId }
                          : ALL,
                      )
                    }
                  >
                    <option value="">None</option>
                    {THREADS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <Legend />
            </div>

            <p className="tl-focus-line" aria-live="polite">
              {activeThread ? (
                <>
                  <strong>{activeThread.name}.</strong> {activeThread.line}{" "}
                  <Link to={activeThread.page}>Where it ends up</Link>.{" "}
                  {litCount} entries.
                </>
              ) : activeTrack ? (
                <>
                  <strong>{activeTrack.name}.</strong> {activeTrack.blurb}{" "}
                  <Link to={activeTrack.page}>The page</Link>. {litCount}{" "}
                  entries.
                </>
              ) : focus.kind === "turns" ? (
                <>
                  <strong>Turning points.</strong> The {litCount} entries that
                  changed what the project was doing next.
                </>
              ) : (
                <>
                  {EVENTS_BY_DATE.filter((e) => !e.ahead).length} dated
                  entries, 12 February to 23 September 2026, plus the two
                  deadlines ahead. Select a workstream by its name to show it
                  alone.
                </>
              )}
            </p>
          </div>

          <div className="tl-chart" style={{ height: plan.height }}>
            <div className="tl-gutter">
              <p className="tl-now" aria-hidden="true">
                <span className="tl-now-month">{monthLabel(now.month)}</span>
                <span className="tl-now-act">{now.act}</span>
              </p>
              {plan.lanes.map((lane) => {
                const on = focus.kind === "track" && focus.id === lane.id;
                return (
                  <button
                    key={lane.id}
                    type="button"
                    className={on ? "tl-lane is-on" : "tl-lane"}
                    style={{ ...laneStyle(lane.id), top: lane.axis }}
                    aria-pressed={on}
                    onClick={() => pick({ kind: "track", id: lane.id })}
                  >
                    {TRACK_NAMES[lane.id]}
                  </button>
                );
              })}
            </div>

            <div ref={view} className="tl-view" onScroll={onViewScroll}>
              <div
                ref={canvas}
                className="tl-canvas"
                style={
                  {
                    width: plan.width,
                    height: plan.height,
                    "--tl-label-h": `${m.label}px`,
                    "--tl-label-size": `${LABEL_REM}rem`,
                    "--tl-label-pad": `${m.pad}px`,
                  } as CSSProperties
                }
              >
                <svg
                  className="tl-svg"
                  width={plan.width}
                  height={plan.height}
                  aria-hidden="true"
                >
                  {plan.acts.map((act) => (
                    <line
                      key={act.id}
                      className="tl-act-rule"
                      x1={act.x0 + 2}
                      x2={act.x1 - 2}
                      y1={1.5}
                      y2={1.5}
                    />
                  ))}
                  {plan.months.map((month) => (
                    <line
                      key={month.month}
                      className="tl-grid"
                      x1={month.x}
                      x2={month.x}
                      y1={20}
                      y2={plan.height}
                    />
                  ))}
                  <line
                    className="tl-record-end"
                    x1={plan.recordEnd}
                    x2={plan.recordEnd}
                    y1={20}
                    y2={plan.height}
                  />
                  {plan.lanes.map((lane) => (
                    <line
                      key={lane.id}
                      className="tl-axis"
                      style={laneStyle(lane.id)}
                      x1={0}
                      x2={plan.width}
                      y1={lane.axis}
                      y2={lane.axis}
                    />
                  ))}
                  {threadPath && (
                    <path className="tl-thread-path" d={threadPath} />
                  )}
                  {plan.items.map((item) => {
                    const lit = inFocus(item.event, focus);
                    const near =
                      item.side === 1 ? item.top + m.label : item.top;
                    return (
                      <g
                        key={item.event.id}
                        className={lit ? "tl-item" : "tl-item is-ghost"}
                        style={laneStyle(item.event.track)}
                      >
                        <line
                          className="tl-leader"
                          x1={item.x}
                          x2={item.x}
                          y1={item.axis - item.side * 5}
                          y2={near}
                        />
                        <Mark item={item} />
                        <circle
                          className="tl-hit"
                          cx={item.x}
                          cy={item.axis}
                          r={9}
                          onPointerEnter={() => enter(item.event.id)}
                          onPointerLeave={leave}
                          onClick={() =>
                            setKept((k) =>
                              k === item.event.id ? null : item.event.id,
                            )
                          }
                        />
                      </g>
                    );
                  })}
                </svg>

                {plan.acts.map((act) => (
                  <span
                    key={act.id}
                    className="tl-act-name"
                    style={{ left: act.x0 + 2 }}
                    aria-hidden="true"
                  >
                    {act.name}
                  </span>
                ))}
                {plan.months.map((month) => (
                  <span
                    key={month.month}
                    className="tl-month"
                    style={{ left: month.x + 4 }}
                    aria-hidden="true"
                  >
                    {monthLabel(month.month).split(" ")[0]}
                  </span>
                ))}
                <span
                  className="tl-record-end-label"
                  style={{ left: plan.recordEnd + 4 }}
                  aria-hidden="true"
                >
                  Record ends
                </span>

                {plan.items.map((item) => {
                  const { event } = item;
                  const lit = inFocus(event, focus);
                  const classes = [
                    "tl-label",
                    item.side === 1 ? "is-up" : "is-down",
                    lit ? "" : "is-ghost",
                    event.turn ? "is-turn" : "",
                    shown === event.id ? "is-shown" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <button
                      key={event.id}
                      ref={(el) => {
                        if (el) labels.current.set(event.id, el);
                        else labels.current.delete(event.id);
                      }}
                      type="button"
                      className={classes}
                      style={{
                        ...laneStyle(event.track),
                        left: item.left,
                        top: item.top,
                        width: item.width,
                      }}
                      aria-expanded={shown === event.id}
                      aria-controls={shown === event.id ? "tl-card" : undefined}
                      onPointerEnter={() => enter(event.id)}
                      onPointerLeave={leave}
                      onFocus={() => {
                        if (quiet.current === event.id) quiet.current = null;
                        else enter(event.id, true);
                        reveal(item);
                      }}
                      onBlur={(e) => {
                        if (!card.current?.contains(e.relatedTarget as Node)) {
                          leave();
                        }
                      }}
                      onClick={(e) => select(event.id, e)}
                    >
                      <span className="tl-sr">
                        {fullDate(event)}, {TRACK_NAMES[event.track]}:{" "}
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {shownItem && (
            <Card
              item={shownItem}
              kept={kept === shownItem.event.id}
              cardRef={card}
              onThread={(id) => setFocus({ kind: "thread", id })}
              onClose={close}
              onEnter={holdCard}
              onLeave={leave}
            />
          )}
        </div>
      </div>

      {/* The heading levels follow the page's: the title is the <h1>, this
          is the section after it, and the months sit under that. */}
      <details className="tl-record">
        <summary>
          <h2 className="tl-record-heading">
            The record in full, as text ({EVENTS_BY_DATE.length} entries)
          </h2>
        </summary>
        <p className="tl-record-note">
          Reconstructed from the team&rsquo;s own working archive, the lab
          journals and the calendars. Entries marked below carry figures that
          have not yet been checked against the journals.
        </p>
        {monthList.map((month) => (
          <div className="tl-record-month" key={month}>
            <h3>{monthLabel(month)}</h3>
            <ul>
              {(byMonth.get(month) ?? []).map((event) => (
                <li key={event.id} id={`tl-${event.id}`} className="tl-entry">
                  <p className="tl-entry-meta">
                    {fullDate(event)} · {TRACK_NAMES[event.track]}
                    {kindOf(event) ? ` · ${kindOf(event)}` : ""}
                  </p>
                  <p className="tl-entry-title">
                    <Marked text={event.title} />
                  </p>
                  {event.detail && (
                    <p className="tl-entry-detail">
                      <Marked text={event.detail} />
                    </p>
                  )}
                  {event.check && (
                    <p className="tl-check">
                      Figures not yet reconciled against the lab journals.
                    </p>
                  )}
                  <Links event={event} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </details>
    </section>
  );
}
