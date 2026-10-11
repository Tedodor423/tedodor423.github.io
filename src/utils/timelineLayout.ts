import {
  ACTS,
  EVENTS_BY_DATE,
  TRACKS,
  labelOf,
  type TimelineEvent,
  type TrackId,
} from "../data/timeline";

/* Where everything on the horizontal timeline goes, as arithmetic.
 *
 * Time runs left to right at a fixed number of pixels per day, and each
 * workstream is a row with an axis through it. Every event is a mark on its
 * row's axis (a dot, or a bar for a range of days) and a one-line label off to
 * one side, joined to the mark by a vertical leader.
 *
 * THE RULE THAT KEEPS IT READABLE. No two labels overlap, and no leader passes
 * through a label that is not its own. A label hangs to the right of its
 * leader, so a leader at x is only ever crossed by a label that starts at or
 * before x. Placing a row's labels latest first, each new label goes beyond
 * every label already placed within its own width: those all start to its
 * right, so its leader passes under them, and nothing placed later can start
 * to its left of a leader already drawn. A run of close dates comes out as a
 * staircase falling to the right, the earliest event on the longest leader.
 *
 * Rows share the space between them. A row's labels below the axis and the
 * next row's labels above it are measured as two profiles along the time axis,
 * and the two axes sit just far enough apart that the profiles never touch.
 * The bee lab is busiest in July and September and the dry lab in May and June,
 * so a fixed height per row would waste most of it. Each label takes the side
 * of its axis where it adds least: how far out it has to sit, plus how far the
 * neighbouring row already reaches into that space at the same dates.
 *
 * Everything here is measured in pixels from the label face's metrics, which
 * the component reads from the page. The labels are monospaced, so a label's
 * width is its length in characters, and the component sizes each label box
 * to exactly the width counted here.
 */

const DAY_MS = 86_400_000;
/** Whole days since the epoch for an ISO date, read as UTC midnight. */
const dayOf = (iso: string) => Math.round(Date.parse(iso) / DAY_MS);
const isoOf = (day: number) => new Date(day * DAY_MS).toISOString().slice(0, 10);

/** "2026-12" to "2027-01". */
function nextMonth(month: string): string {
  const [y, mo] = month.split("-").map(Number);
  return mo === 12 ? `${y + 1}-01` : `${y}-${String(mo + 1).padStart(2, "0")}`;
}

/** Width of the buckets the row profiles are kept in, px. */
const BUCKET = 4;

export interface Metrics {
  /** Pixels per day. */
  day: number;
  /** Width of one character of the label face, px. */
  char: number;
  /** Height of one label, px. */
  label: number;
  /** Space inside a label either side of its text. */
  pad: number;
  /** From the axis to the nearest label. */
  stem: number;
  /** Between two labels side by side, and one above the other. */
  gapX: number;
  gapY: number;
  /** The least distance between two axes. */
  lane: number;
  /** The strip above the first row that carries the acts and the months. */
  head: number;
  /** Under the last row. */
  foot: number;
  /** Days of space before the first event. */
  lead: number;
  /** Pixels after the last event, for its label to hang into. */
  tail: number;
  /** Least distance between two marks on the same row. */
  tie: number;
}

export interface Item {
  event: TimelineEvent;
  label: string;
  /** The mark, and the end of a range. */
  x: number;
  x2: number | null;
  /** 1 above the axis, -1 below it. */
  side: 1 | -1;
  /** Axis to the label's near edge. */
  offset: number;
  width: number;
  /** The row's axis, from the top of the chart. */
  axis: number;
  /** The label box, from the chart's top left. */
  left: number;
  top: number;
}

export interface Layout {
  metrics: Metrics;
  width: number;
  height: number;
  lanes: { id: TrackId; axis: number }[];
  /** In date order, which is also the order they are written in the DOM. */
  items: Item[];
  /** The first of each month, as YYYY-MM, and where it falls. */
  months: { month: string; x: number }[];
  acts: { id: string; name: string; x0: number; x1: number }[];
  /** The day after the last event that has already happened. */
  recordEnd: number;
}

interface Box {
  x: number;
  width: number;
  offset: number;
}

type Side = "up" | "down";
type Placed = Omit<Item, "axis" | "top">;

/** How many times the rows are laid out against each other. */
const PASSES = 6;

const peak = (a: Float32Array) => a.reduce((most, v) => Math.max(most, v), 0);

/** How far from the axis a label at `x` has to sit on one side of a row. */
function offsetFor(placed: Box[], x: number, width: number, m: Metrics) {
  let offset = m.stem;
  for (const p of placed) {
    // Everything placed so far starts at or after x, so overlapping in time
    // is the same as having a leader inside this label's span.
    if (p.x < x + width + m.gapX) {
      offset = Math.max(offset, p.offset + m.label + m.gapY);
    }
  }
  return offset;
}

export function layout(m: Metrics): Layout {
  const first = dayOf(EVENTS_BY_DATE[0].date) - m.lead;
  const last = Math.max(...EVENTS_BY_DATE.map((e) => dayOf(e.until ?? e.date)));
  const width = Math.ceil((last + 1 - first) * m.day + m.tail);
  // The middle of the day, so a one-day event and the start of a range agree.
  const xOf = (iso: string) => (dayOf(iso) - first + 0.5) * m.day;

  const buckets = Math.ceil(width / BUCKET) + 1;
  const blank = () => ({
    up: new Float32Array(buckets),
    down: new Float32Array(buckets),
  });
  const profiles = TRACKS.map(blank);

  // The marks of each row. Two on the same day would sit on top of each
  // other, so the later one steps right by a mark's width.
  const rows = TRACKS.map((track) => {
    const events = EVENTS_BY_DATE.filter((e) => e.track === track.id);
    const xs: number[] = [];
    for (const e of events) {
      const x = xOf(e.date);
      const prev = xs[xs.length - 1];
      xs.push(prev !== undefined && x - prev < m.tie ? prev + m.tie : x);
    }
    return { events, xs };
  });

  /* One pass over the rows, top to bottom. With `aware` set, a label also
   * weighs how far into the shared space the neighbouring row already reaches
   * at that date: the row above as placed in this pass, the row below as
   * placed in the one before. */
  const pass = (aware: boolean) => {
    const placed = new Map<string, Placed>();
    rows.forEach(({ events, xs }, row) => {
      const reached = blank();
      const sides = { up: [] as Box[], down: [] as Box[] };
      let lastSide: Side = "down";
      for (let i = events.length - 1; i >= 0; i--) {
        const event = events[i];
        const x = xs[i];
        const label = labelOf(event);
        const w = Math.ceil(label.length * m.char + 2 * m.pad);
        const from = Math.max(0, Math.floor((x - 2) / BUCKET));
        const to = Math.min(buckets - 1, Math.ceil((x + w + m.gapX) / BUCKET));
        const pressure = (side: Side) => {
          const next = side === "up" ? profiles[row - 1]?.down : profiles[row + 1]?.up;
          if (!aware || !next) return 0;
          let most = 0;
          for (let b = from; b <= to; b++) most = Math.max(most, next[b]);
          return most;
        };

        const up = offsetFor(sides.up, x, w, m);
        const down = offsetFor(sides.down, x, w, m);
        const costUp = up + pressure("up");
        const costDown = down + pressure("down");
        // Cheaper wins; a draw alternates, so isolated events do not all hang
        // the same way and leave the other side of the row empty.
        const side: Side =
          costUp < costDown
            ? "up"
            : costDown < costUp
              ? "down"
              : lastSide === "up"
                ? "down"
                : "up";
        const offset = side === "up" ? up : down;
        sides[side].push({ x, width: w, offset });
        lastSide = side;

        const profile = reached[side];
        for (let b = from; b <= to; b++) {
          profile[b] = Math.max(profile[b], offset + m.label);
        }

        placed.set(event.id, {
          event,
          label,
          x,
          x2: event.until ? xOf(event.until) : null,
          side: side === "up" ? 1 : -1,
          offset,
          width: w,
          left: x,
        });
      }
      profiles[row] = reached;
    });

    // The axes, top to bottom, as close as the profiles allow.
    const axes: number[] = [m.head + Math.max(peak(profiles[0].up), m.stem)];
    for (let row = 1; row < TRACKS.length; row++) {
      const above = profiles[row - 1].down;
      const below = profiles[row].up;
      let need = 0;
      for (let b = 0; b < buckets; b++) need = Math.max(need, above[b] + below[b]);
      axes.push(axes[row - 1] + Math.max(m.lane, need + 2 * m.gapY));
    }
    const height =
      axes[axes.length - 1] +
      Math.max(peak(profiles[TRACKS.length - 1].down), m.stem) +
      m.foot;
    return { placed, axes, height };
  };

  // Each pass reacts to the last, and the total does not fall steadily: it
  // settles or swings between two arrangements. Keep the shortest.
  let best = pass(false);
  for (let i = 1; i < PASSES; i++) {
    const next = pass(true);
    if (next.height < best.height) best = next;
  }
  const { placed: placedBy, axes, height } = best;

  const axisOf = new Map(TRACKS.map((t, row) => [t.id, axes[row]]));
  const items: Item[] = EVENTS_BY_DATE.map((event) => {
    const placed = placedBy.get(event.id)!;
    const axis = axisOf.get(event.track)!;
    const top =
      placed.side === 1
        ? axis - placed.offset - m.label
        : axis + placed.offset;
    return { ...placed, axis, top };
  });

  // Where a month begins: the left edge of its first day.
  const monthAt = (month: string) =>
    Math.min(width, Math.max(0, xOf(`${month}-01`) - m.day / 2));

  const months: Layout["months"] = [];
  const lastMonth = isoOf(last).slice(0, 7);
  for (let month = isoOf(first).slice(0, 7); month <= lastMonth; month = nextMonth(month)) {
    months.push({ month, x: monthAt(month) });
  }

  const acts = ACTS.map((act) => ({
    id: act.id,
    name: act.name,
    x0: monthAt(act.from),
    x1: monthAt(nextMonth(act.to)),
  }));

  const done = EVENTS_BY_DATE.filter((e) => !e.ahead);
  const recordEnd =
    xOf(done[done.length - 1].until ?? done[done.length - 1].date) + m.day / 2;

  return {
    metrics: m,
    width,
    height,
    lanes: TRACKS.map((t, row) => ({ id: t.id, axis: axes[row] })),
    items,
    months,
    acts,
    recordEnd,
  };
}
