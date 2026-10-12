import { Fragment, useMemo, useState, type CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import { getPathMapping } from "../utils/getPathMapping";
import {
  MEMBERS,
  labelOf,
  memberAnchor,
  useTeamArt,
  type Member,
  type TeamArt,
} from "../data/team";
import "./TeamGallery.css";

/* The halftone disc each member stands in front of, from the posts: one honey
 * dot per cell of a square screen turned 45 degrees, shrinking from the
 * middle out. Drawn once as a single path and placed in every card with
 * <use>, so eighteen cards cost one shape. Units are screen cells. */
const DOTS = 11;
const HALFTONE = (() => {
  const round = (n: number) => Math.round(n * 1000) / 1000;
  let d = "";
  for (let i = -DOTS; i <= DOTS; i++) {
    for (let j = -DOTS; j <= DOTS; j++) {
      const reach = Math.hypot(i, j) / (DOTS + 0.5);
      if (reach >= 1) continue;
      const r = round(0.47 * Math.pow(1 - reach, 0.6));
      if (r < 0.05) continue;
      d += `M${round(i - r)} ${j}a${r} ${r} 0 1 0 ${round(2 * r)} 0a${r} ${r} 0 1 0 ${round(-2 * r)} 0`;
    }
  }
  return d;
})();

/** A run of short items set as "a · b · c", each kept whole on its line, the
 * dot staying with the item before it when the line breaks. */
function Parts({ items }: { items: string[] }) {
  return items.map((item, i) => (
    <Fragment key={item}>
      {i > 0 && " "}
      <span className="tm-part">
        {item}
        {i < items.length - 1 && " ·"}
      </span>
    </Fragment>
  ));
}

/** The member a fragment names (#member-ariana), if any. */
function memberIn(hash: string): string | null {
  return MEMBERS.find((m) => hash === `#${memberAnchor(m.id)}`)?.id ?? null;
}

/**
 * The team page: a honeycomb of the members, after the team's own "Meet the
 * team" posts. Each cell is the post's tall hexagon, with the member's
 * cut-out over the halftone disc, the name in Basenji behind them, and a
 * honey label at the foot with year, course and college.
 *
 * Hovering a cell slides the honey duotone echo out from behind the
 * photograph, as the posts set it, and raises the label to show the line of
 * trivia each post carries; a click does nothing more, and the cell closes
 * as the pointer leaves it. Keyboard focus opens a cell the same way, and so
 * does a tap on a device with nothing that hovers (a phone). The trivia is in
 * the page and in the search index either way, and
 * a result or a link to #member-<id> lands on its cell open.
 */
export function TeamGallery() {
  const art = useTeamArt();
  const { pathname, hash } = useLocation();

  // Opening its page, the gallery carries the page's <h1> (Page.titleInBody).
  const title = useMemo(() => {
    const page = getPathMapping()[pathname];
    return page?.titleInBody ? page.title : null;
  }, [pathname]);

  // The cell a fragment names is held open on arrival, until the pointer
  // leaves it or another cell takes the reader's attention. The check runs
  // while rendering rather than in an effect, so a search result lands on an
  // open cell instead of watching it open.
  const [landed, setLanded] = useState(() => memberIn(hash));
  const [seenHash, setSeenHash] = useState(hash);
  if (hash !== seenHash) {
    setSeenHash(hash);
    setLanded(memberIn(hash));
  }

  return (
    <section
      className="team-gallery"
      aria-labelledby={title ? "tm-title" : undefined}
      aria-label={title ? undefined : "Team members"}
    >
      <svg className="tm-defs" aria-hidden="true" focusable="false">
        <symbol id="tm-halftone" viewBox={`${-DOTS - 1} ${-DOTS - 1} ${2 * DOTS + 2} ${2 * DOTS + 2}`}>
          <path d={HALFTONE} transform="rotate(45)" />
        </symbol>
      </svg>

      <div className="tm-inner">
        {title && (
          <h1 id="tm-title" className="tm-title">
            {title}
          </h1>
        )}

        <ul className="tm-comb">
          {MEMBERS.map((member) => (
            <MemberCell
              key={member.id}
              member={member}
              art={art}
              landed={landed === member.id}
              onRelease={() => setLanded(null)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function MemberCell({
  member,
  art,
  landed,
  onRelease,
}: {
  member: Member;
  art: TeamArt | null | undefined;
  landed: boolean;
  onRelease: () => void;
}) {
  const anchor = memberAnchor(member.id);
  // A photograph that fails on its own (one file missing from the upload)
  // stands down rather than showing a broken image; the cell still reads.
  const [missing, setMissing] = useState(false);
  const shown = art && !missing;

  return (
    // Focusable so the keyboard, and a tap on a phone, can open it
    // (see "open" in the stylesheet). Nothing listens for a click.
    <li
      id={anchor}
      className="tm-cell"
      tabIndex={0}
      data-open={landed || undefined}
      onPointerLeave={landed ? onRelease : undefined}
      onPointerEnter={landed ? undefined : onRelease}
      onFocus={landed ? undefined : onRelease}
    >
      <svg className="tm-dots" aria-hidden="true" focusable="false">
        <use href="#tm-halftone" />
      </svg>

      <div className="tm-head">
        {/* The name's length sets its size, so a long one still fits the
            cell on one line (see .tm-name). */}
        <h2
          className="tm-name"
          style={{ "--letters": member.name.length } as CSSProperties}
        >
          {member.name}
        </h2>
        <p className="tm-roles">
          <Parts items={member.roles} />
        </p>
      </div>

      {shown && (
        <>
          <img
            className="tm-echo"
            src={art.echo(member.id)}
            alt=""
            width={720}
            height={990}
            loading="lazy"
            decoding="async"
          />
          <img
            className="tm-photo"
            src={art.photo(member.id)}
            alt={member.alt}
            width={720}
            height={990}
            loading="lazy"
            decoding="async"
            onError={() => setMissing(true)}
          />
        </>
      )}

      <div className="tm-label">
        <p className="tm-study">
          <Parts items={labelOf(member)} />
        </p>
        <div className="tm-more">
          <div>
            {member.facts.map((fact) => (
              <p key={fact.answer} className="tm-fact">
                {fact.prompt && <span className="tm-prompt">{fact.prompt}</span>}
                {fact.answer}
              </p>
            ))}
          </div>
        </div>
      </div>

      <svg
        className="tm-ring"
        viewBox="0 0 100 125"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <polygon points="7.7,0 92.3,0 100,62.5 92.3,125 7.7,125 0,62.5" />
      </svg>

    </li>
  );
}
