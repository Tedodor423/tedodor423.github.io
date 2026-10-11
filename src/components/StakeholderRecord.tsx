import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GROUPS,
  MAP_ANCHOR,
  QUESTION_IDS,
  QUESTION_TITLES,
  STAKEHOLDERS,
  questionAnchor,
  questionsOf,
  recordAnchor,
  titleOf,
  type Stakeholder,
} from "../data/stakeholders";
import { glideTo } from "../utils/glide";
import { installMapMorph, rideToMap } from "../utils/mapMorph";
import { chainWheel } from "../utils/wheelChain";
import { assignCells } from "../utils/stakeholderCells";
import { HEXES, HEX_R, MAP_H, MAP_W, hexPoints } from "../utils/worldHexes";
import { Marked, MarkedInline } from "./Marked";
import "./StakeholderRecord.css";

/* Every interview in full, at the foot of the human practices page.
 *
 * The map's card carries a conversation's key points and a link here; this
 * is where the rest of the team's write-up lives: the key points again, then
 * why we interviewed them, what we learned and how it changed NECTAR, under
 * the write-up's own headings. It is also the text copy of everything the
 * map shows, which is why nothing on the map is hover-only, and where a
 * search result for a person lands (recordAnchor).
 *
 * The people are grouped as the 10 October write-up groups them (academics,
 * industry, beekeepers, regulators), in each file's `order`. A list of them
 * all runs down the left and stays in view while the record scrolls, with
 * the interview being read marked in it. The stakeholder map, shrunk, holds
 * the right-hand side the same way and marks where that interview took
 * place. On a narrow screen the list sits above the record instead, and the
 * small map, which only repeats each interview's place line, is left out.
 */

/**
 * A link to somewhere else on this page. A plain fragment link, so it works
 * as one (copy, open in a new tab), and ScrollToHash puts the window on it.
 * Following it when the address already names that fragment changes nothing
 * the router can see, so then it scrolls directly.
 */
function FragmentLink({
  anchor,
  className,
  current,
  onFollow,
  children,
}: {
  anchor: string;
  className?: string;
  /** Marks the link as the place on screen, for the list. */
  current?: boolean;
  /** Takes the reader there itself, returning true if it did; the link
   * then leaves the address alone. Only for a plain click. */
  onFollow?: () => boolean;
  children: ReactNode;
}) {
  const { hash } = useLocation();
  const onClick = (e: MouseEvent) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    if (onFollow?.()) {
      e.preventDefault();
      return;
    }
    if (hash !== `#${anchor}`) return;
    e.preventDefault();
    document.getElementById(anchor)?.scrollIntoView();
  };
  return (
    <Link
      to={{ hash: anchor }}
      className={className}
      aria-current={current ? "location" : undefined}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

/**
 * Back up to the full-size map. Where the small map can grow back into it
 * (src/utils/mapMorph.ts), the window jumps there and it does; elsewhere it
 * is a short ride (src/utils/glide.ts, the one way this wiki moves the
 * window) rather than the browser's own smooth scroll, which takes seconds
 * over a record this long, landing where the map's fragment would. Still a real link underneath, so a modified click opens it
 * in a new tab as a link would. The address is left as it was: changing the
 * fragment would have ScrollToHash scroll the window as well.
 */
function BackToMap() {
  const onClick = (e: MouseEvent) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    const map = document.getElementById(MAP_ANCHOR);
    if (!map) return;
    e.preventDefault();
    if (rideToMap()) return;
    const margin = parseFloat(getComputedStyle(map).scrollMarginTop) || 0;
    glideTo(map.getBoundingClientRect().top + window.scrollY - margin);
  };
  return (
    <Link to={{ hash: MAP_ANCHOR }} className="sr-back" onClick={onClick}>
      Go back to main map
      {/* Expand: two arrows out to opposite corners. */}
      <svg className="sr-back-icon" viewBox="0 0 16 16" aria-hidden>
        <path d="M 9.5 2.5 H 13.5 V 6.5 M 13.5 2.5 L 9 7 M 6.5 13.5 H 2.5 V 9.5 M 2.5 13.5 L 7 9" />
      </svg>
    </Link>
  );
}

/** A link to one conversation's write-up. */
export function RecordLink({
  id,
  ...rest
}: {
  id: string;
  className?: string;
  current?: boolean;
  onFollow?: () => boolean;
  children: ReactNode;
}) {
  return <FragmentLink anchor={recordAnchor(id)} {...rest} />;
}

/** The photograph, cropped to the map's hexagon. Tries the same URLs the map
 * does, in order, and leaves the space empty once they are spent. */
function Portrait({ s }: { s: Stakeholder }) {
  const urls = s.photo ? [s.photo, ...(s.photoFallbacks ?? [])] : [];
  const [miss, setMiss] = useState(0);
  if (miss >= urls.length) return null;
  return (
    <img
      className="sr-photo"
      src={urls[miss]}
      // The name is the heading beside it.
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setMiss((m) => m + 1)}
    />
  );
}

/** The questions a conversation fed, each opening that question on the map. */
function QuestionLinks({ s }: { s: Stakeholder }) {
  const tags = QUESTION_IDS.filter((q) => questionsOf(s).includes(q));
  if (!tags.length) return null;
  return (
    <p className="sr-tags">
      {tags.map((q) => (
        <Link
          key={q}
          to={{ hash: questionAnchor(q) }}
          className="sr-tag"
          title={QUESTION_TITLES[q]}
          aria-label={`${q}: ${QUESTION_TITLES[q]}, on the map`}
        >
          {q}
        </Link>
      ))}
    </p>
  );
}

function Section({ head, children }: { head: string; children?: ReactNode }) {
  return (
    <section className="sr-sec">
      <h5 className="sr-sec-head">{head}</h5>
      {children}
    </section>
  );
}

function Entry({ s }: { s: Stakeholder }) {
  const anchor = recordAnchor(s.id);
  if (s.consent) {
    return (
      <article className="sr-entry" id={anchor} data-id={s.id}>
        <h4 className="sr-name sr-name--withheld">Interview withheld</h4>
        <p className="sr-role">{s.consent.note}</p>
      </article>
    );
  }
  const title = titleOf(s);
  return (
    <article
      className="sr-entry"
      id={anchor}
      data-id={s.id}
      aria-labelledby={`${anchor}-name`}
    >
      <header className="sr-entry-head">
        <Portrait s={s} />
        <div className="sr-who">
          <h4 className="sr-name" id={`${anchor}-name`}>
            <Marked text={title} />
          </h4>
          {s.label && (
            <p className="sr-people">
              <Marked text={s.name} />
            </p>
          )}
          {s.role !== title && (
            <p className="sr-role">
              <Marked text={s.role} />
            </p>
          )}
          <p className="sr-meta">
            <Marked text={s.place} />
            {s.date && (
              <>
                {" · "}
                <Marked text={s.date} />
              </>
            )}
            {s.photo && s.photoShows && <> · Photo: {s.photoShows}</>}
          </p>
          <QuestionLinks s={s} />
        </div>
      </header>

      {s.points.length > 0 && (
        <Section head="Key points">
          <ul className="sr-points">
            {s.points.map((p) => (
              <li key={p}>
                <MarkedInline text={p} />
              </li>
            ))}
          </ul>
        </Section>
      )}
      <Section head="Why we interviewed">
        {s.why && (
          <p>
            <MarkedInline text={s.why} />
          </p>
        )}
      </Section>
      <Section head="What we learned">
        {s.quote && (
          <p className="sr-quote">
            &ldquo;
            <MarkedInline text={s.quote} />
            &rdquo;
          </p>
        )}
        {s.learntIsList ? (
          <ul className="sr-points">
            {s.learnt.map((l) => (
              <li key={l}>
                <MarkedInline text={l} />
              </li>
            ))}
          </ul>
        ) : (
          s.learnt.map((l) => (
            <p key={l}>
              <MarkedInline text={l} />
            </p>
          ))
        )}
      </Section>
      <Section head="How we implemented the advice to change NECTAR">
        {s.changed && (
          <p>
            <MarkedInline text={s.changed} />
          </p>
        )}
      </Section>
    </article>
  );
}

/** The land, drawn once: it never changes. */
const LAND = (
  <g className="sr-where-land">
    {HEXES.map((h) => (
      <polygon key={`${h.col}-${h.row}`} points={hexPoints(h.x, h.y)} />
    ))}
  </g>
);

/** How much larger than a land cell a person's cell is drawn on the small map. */
const PEOPLE_SCALE = 1.35;

/** Where the place line reads the same as the country, say it once. */
const placeLine = (s: Stakeholder) =>
  s.consent
    ? s.region
    : s.place === s.region
      ? s.place
      : `${s.place}, ${s.region}`;

/**
 * The stakeholder map, small: everyone on the cell they hold on the big map,
 * and a mark on the one whose interview is being read, which glides from
 * place to place as the reader moves through the record. `placed` is the
 * last interview read, so the mark stays where it was, hidden, while the
 * reader is above the first one rather than jumping from a corner when it
 * comes back. Every interview states its place in its own text, so the map
 * and its caption are a picture of that and kept out of the accessibility
 * tree; the link above them, back up to the full-size map, is not.
 */
function WhereMap({
  current,
  placed,
}: {
  current: Stakeholder | null;
  placed: Stakeholder | null;
}) {
  const cells = useMemo(
    () => new Map(assignCells().map((n) => [n.s.id, n])),
    [],
  );
  const at = placed ? cells.get(placed.id) : undefined;
  return (
    <div className="sr-where">
      <BackToMap />
      {/* The frame the morph flies between this and the big map
       * (src/utils/mapMorph.ts). */}
      <div className="sr-where-fly">
        <svg
          className="sr-where-map"
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {LAND}
          {/* A third larger than a land cell: at this size the big map's own
           * cells are specks, and the spread of the interviews is the point. */}
          <g className="sr-where-people">
            {[...cells.values()].map((n) => (
              <polygon
                key={n.s.id}
                points={hexPoints(n.x, n.y, HEX_R * PEOPLE_SCALE)}
              />
            ))}
          </g>
          {at && (
            <g
              className={`sr-where-mark${current ? "" : " is-off"}`}
              style={{ transform: `translate(${at.x}px, ${at.y}px)` }}
            >
              <circle className="sr-where-ring" r={HEX_R * 4.4} />
              <polygon
                className="sr-where-cell"
                points={hexPoints(0, 0, HEX_R * 2.5)}
              />
            </g>
          )}
        </svg>
      </div>
      {current && (
        <div className="sr-where-caption" aria-hidden>
          <p className="sr-where-name">
            {current.consent ? "Interview withheld" : titleOf(current)}
          </p>
          <p className="sr-where-place">{placeLine(current)}</p>
        </div>
      )}
    </div>
  );
}

/** How far down the viewport an interview's top has to pass before the list
 * marks it as the one being read. */
const READ_LINE = 0.3;

export function StakeholderRecord() {
  const groups = useMemo(
    () =>
      GROUPS.map((name) => ({
        name,
        people: STAKEHOLDERS.filter((s) => s.group === name),
      })).filter((g) => g.people.length > 0),
    [],
  );

  const rootRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState<string | null>(null);
  // The last interview read, for the small map's mark (see WhereMap).
  const [placed, setPlaced] = useState<string | null>(null);
  const byId = useMemo(() => new Map(STAKEHOLDERS.map((s) => [s.id, s])), []);

  /* The interview being read: the last one whose top has passed the read
   * line. Measured on scroll, once a frame, and only while the record is on
   * screen. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const box = root.getBoundingClientRect();
      const vh = window.innerHeight;
      if (box.bottom < 0 || box.top > vh) {
        setCurrent(null);
        return;
      }
      let id: string | null = null;
      for (const el of root.querySelectorAll<HTMLElement>(".sr-entry")) {
        if (el.getBoundingClientRect().top > vh * READ_LINE) break;
        id = el.dataset.id ?? null;
      }
      setCurrent(id);
      if (id) setPlaced(id);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // The big map turning into the small one as the reader scrolls between
  // them, and back.
  useEffect(installMapMorph, []);

  // A wheel over the list goes on to scroll the page once the list is at
  // its end (src/utils/wheelChain.ts).
  useEffect(() => {
    const nav = navRef.current;
    return nav ? chainWheel(nav) : undefined;
  }, []);

  /* Keep the marked name in sight in the list, which scrolls on its own when
   * it is taller than the window. Its own scroll only, never the page's. */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !current || nav.scrollHeight <= nav.clientHeight) return;
    const item = nav.querySelector<HTMLElement>('[aria-current="location"]');
    if (!item) return;
    const n = nav.getBoundingClientRect();
    const r = item.getBoundingClientRect();
    const pad = 24;
    if (r.top < n.top + pad) nav.scrollTop -= n.top + pad - r.top;
    else if (r.bottom > n.bottom - pad)
      nav.scrollTop += r.bottom - (n.bottom - pad);
  }, [current]);

  return (
    <section
      className="stakeholder-record"
      ref={rootRef}
      aria-label="Every interview in full"
    >
      <nav className="sr-nav" ref={navRef} aria-label="Stakeholders">
        {groups.map((g) => (
          <div key={g.name} className="sr-nav-group">
            <p className="sr-nav-head">{g.name}</p>
            <ul>
              {g.people.map((s) => (
                <li key={s.id}>
                  <RecordLink
                    id={s.id}
                    className="sr-nav-link"
                    current={current === s.id}
                  >
                    {s.consent ? "Interview withheld" : titleOf(s)}
                  </RecordLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sr-body">
        {groups.map((g) => (
          <section
            key={g.name}
            className="sr-group"
            aria-labelledby={`sr-group-${g.name.toLowerCase()}`}
          >
            <h3
              className="sr-group-head"
              id={`sr-group-${g.name.toLowerCase()}`}
            >
              {g.name}
            </h3>
            {g.people.map((s) => (
              <Entry key={s.id} s={s} />
            ))}
          </section>
        ))}
      </div>

      <WhereMap
        current={(current && byId.get(current)) || null}
        placed={(placed && byId.get(placed)) || null}
      />
    </section>
  );
}
