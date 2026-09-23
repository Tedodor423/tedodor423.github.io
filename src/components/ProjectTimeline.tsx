import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  EVENTS_BY_DATE,
  THREADS,
  THREAD_NAMES,
  TRACKS,
  TRACK_NAMES,
  actOf,
  dayLabel,
  fullDate,
  monthLabel,
  months,
  type ThreadId,
  type TimelineEvent,
  type TrackId,
} from "../data/timeline";
import { Marked } from "./Marked";
import "./ProjectTimeline.css";

/* Eight months of the project, five workstreams, one grid.
 *
 * WHY A GRID AND NOT A LIST. A single chronological list is the one shape that
 * loses the argument. The project's own account of itself is that the bee lab,
 * the wet lab and the interviews kept redirecting each other: the mite shortage
 * in June rewrote the wet lab's dosing arithmetic, a July interview about price
 * retired a chassis that had had three months of design behind it, and the
 * mini-jamboree feedback in August rebuilt this wiki. Reading across a month
 * shows that. Reading down a list hides it.
 *
 * Time runs down, workstreams run across, and the events sit in date order in
 * the source so that the narrow layout is simply the same DOM in one column.
 * Each event is placed into its lane with `grid-column`, which keeps the
 * chronological reading order and needs no second rendering for small screens.
 *
 * FOCUS. One mechanism does all the filtering: a focus is a workstream, a
 * thread, or the turning points, and everything outside it thins to a date
 * mark rather than disappearing. Following a thread should show the shape of
 * the months it crosses, not delete them, and a reader who picks the bee lab
 * can still see that something was happening in the wet lab that week.
 *
 * NOTHING LIVES ONLY IN THE GRID. The house rules forbid putting content
 * behind a hover or a click, so the full record is written out underneath, one
 * entry per event, carrying the ids the search index links to.
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

/** Column number for a lane, 1-based, in the order TRACKS is written. */
const COLUMN: Record<TrackId, number> = Object.fromEntries(
  TRACKS.map((t, i) => [t.id, i + 1]),
) as Record<TrackId, number>;

/** The label under an event that says what kind of entry it is. */
function kindOf(event: TimelineEvent): string | null {
  if (event.ahead) return "still ahead";
  if (event.setback && event.turn) return "went wrong, and changed the plan";
  if (event.setback) return "went wrong";
  if (event.turn) return "turning point";
  return null;
}

function classOf(event: TimelineEvent, lit: boolean, open: boolean): string {
  return [
    "tl-chip",
    lit ? "" : "is-ghost",
    event.turn ? "is-turn" : "",
    event.setback ? "is-setback" : "",
    event.ahead ? "is-ahead" : "",
    open ? "is-open" : "",
  ]
    .filter(Boolean)
    .join(" ");
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

/* The panel an entry opens.
 *
 * It is a grid item of the lane grid, spanning every column, placed directly
 * after the entry that opened it. That keeps it next to what it belongs to on
 * both layouts: at the foot of a month band it would be twenty entries away
 * from the one that was selected once the columns collapse, and on the wide
 * layout it would lose the lane the entry sits in. */
function Detail({
  event,
  onThread,
  onClose,
}: {
  event: TimelineEvent;
  onThread: (id: ThreadId) => void;
  onClose: () => void;
}) {
  const kind = kindOf(event);
  return (
    <div className="tl-detail" role="group" aria-label={event.title}>
      <div className="tl-detail-head">
        <p className="tl-detail-meta">
          {fullDate(event)} · {TRACK_NAMES[event.track]}
          {kind ? ` · ${kind}` : ""}
        </p>
        <button type="button" className="tl-close" onClick={onClose}>
          Close
        </button>
      </div>
      <h6 className="tl-detail-title">
        <Marked text={event.title} />
      </h6>
      {event.detail && (
        <p className="tl-detail-body">
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
      <p className="tl-detail-foot">
        <Link to={`#tl-${event.id}`}>This entry in the written record</Link>
      </p>
    </div>
  );
}

export function ProjectTimeline() {
  const [focus, setFocus] = useState<Focus>(ALL);
  const [open, setOpen] = useState<string | null>(null);

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

  const litCount = useMemo(
    () => EVENTS_BY_DATE.filter((e) => inFocus(e, focus)).length,
    [focus],
  );

  // Escape closes the open entry, which is the only way out for someone who
  // opened one with a keyboard and does not want to tab back to it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const pick = useCallback((next: Focus) => {
    setFocus((current) => (sameFocus(current, next) ? ALL : next));
  }, []);

  const activeThread =
    focus.kind === "thread" ? THREADS.find((t) => t.id === focus.id) : null;
  const activeTrack =
    focus.kind === "track" ? TRACKS.find((t) => t.id === focus.id) : null;

  // Which act each month opens, so the act heading is written once.
  const actOpenedAt = new Map<string, string>();
  for (const month of monthList) {
    const act = actOf(month);
    if (!actOpenedAt.has(act.id)) actOpenedAt.set(act.id, month);
  }

  return (
    <section className="project-timeline" aria-labelledby="tl-heading">
      <h3 id="tl-heading" className="tl-heading">
        Eight months, five workstreams
      </h3>
      <p className="tl-standfirst">
        Time runs down, workstreams run across. Select an entry to read it.
        Follow a thread to see one question travel between the lanes: the rest
        of the record thins to a date so you can still see what it crossed.
        Everything in the grid is written out in full underneath.
      </p>

      <div className="tl-controls">
        <div
          className="tl-filter"
          role="group"
          aria-label="Show one workstream"
        >
          <button
            type="button"
            className={focus.kind === "all" ? "is-on" : undefined}
            aria-pressed={focus.kind === "all"}
            onClick={() => setFocus(ALL)}
          >
            Everything
          </button>
          {TRACKS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={
                focus.kind === "track" && focus.id === t.id
                  ? "is-on"
                  : undefined
              }
              aria-pressed={focus.kind === "track" && focus.id === t.id}
              onClick={() => pick({ kind: "track", id: t.id })}
            >
              {t.name}
            </button>
          ))}
          <button
            type="button"
            className={focus.kind === "turns" ? "is-on" : undefined}
            aria-pressed={focus.kind === "turns"}
            onClick={() => pick({ kind: "turns" })}
          >
            Turning points
          </button>
        </div>

        <div className="tl-filter" role="group" aria-label="Follow one thread">
          {THREADS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={
                focus.kind === "thread" && focus.id === t.id
                  ? "is-on is-thread"
                  : "is-thread"
              }
              aria-pressed={focus.kind === "thread" && focus.id === t.id}
              onClick={() => pick({ kind: "thread", id: t.id })}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <p className="tl-focus-line" aria-live="polite">
        {activeThread ? (
          <>
            <strong>{activeThread.name}.</strong> {activeThread.line}{" "}
            <Link to={activeThread.page}>Where it ends up</Link>. {litCount}{" "}
            entries.
          </>
        ) : activeTrack ? (
          <>
            <strong>{activeTrack.name}.</strong> {activeTrack.blurb}{" "}
            <Link to={activeTrack.page}>The page</Link>. {litCount} entries.
          </>
        ) : focus.kind === "turns" ? (
          <>
            <strong>Turning points.</strong> The {litCount} entries that changed
            what the project was doing next.
          </>
        ) : (
          <>
            {EVENTS_BY_DATE.filter((e) => !e.ahead).length} dated entries, 12
            February to 23 September 2026, plus the two deadlines ahead.
          </>
        )}
      </p>

      <p className="tl-key">
        A filled entry is a turning point. An outlined entry marks something
        that went wrong, which on this project is often the same thing. A dashed
        entry has not happened yet.
      </p>

      {monthList.map((month) => {
        const act = actOf(month);
        const opensAct = actOpenedAt.get(act.id) === month;
        const events = byMonth.get(month) ?? [];

        return (
          <div className="tl-month" key={month}>
            {opensAct && (
              <>
                <div className="tl-act">
                  <h4 className="tl-act-name">{act.name}</h4>
                  <p className="tl-act-line">{act.line}</p>
                </div>
                {/* Repeated once per act. The column headings are the only
                    thing telling you which lane is which, and a reader three
                    months down the page has lost them. */}
                <div className="tl-lanehead" aria-hidden="true">
                  {TRACKS.map((t) => (
                    <span key={t.id}>{t.name}</span>
                  ))}
                </div>
              </>
            )}
            <h5 className="tl-month-name">{monthLabel(month)}</h5>

            <div className="tl-lanes">
              <div className="tl-guides" aria-hidden="true">
                {TRACKS.map((t) => (
                  <span key={t.id} />
                ))}
              </div>

              {events.map((event) => {
                const lit = inFocus(event, focus);
                const isOpen = event.id === open;
                return (
                  <Fragment key={event.id}>
                    <button
                      type="button"
                      className={classOf(event, lit, isOpen)}
                      style={{ gridColumn: COLUMN[event.track] }}
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : event.id)}
                    >
                      <span className="tl-chip-date">{dayLabel(event)}</span>
                      <span className="tl-chip-track">
                        {TRACK_NAMES[event.track]}
                      </span>
                      <span className="tl-chip-title">{event.title}</span>
                    </button>
                    {isOpen && (
                      <Detail
                        event={event}
                        onThread={(id) => setFocus({ kind: "thread", id })}
                        onClose={() => setOpen(null)}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        );
      })}

      <details className="tl-record">
        <summary>
          The record in full, as text ({EVENTS_BY_DATE.length} entries)
        </summary>
        <p className="tl-record-note">
          Reconstructed from the team&rsquo;s own working archive, the lab
          journals and the calendars. Entries marked below carry figures that
          have not yet been checked against the journals.
        </p>
        {monthList.map((month) => (
          <div className="tl-record-month" key={month}>
            <h4>{monthLabel(month)}</h4>
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
