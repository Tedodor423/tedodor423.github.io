import "./SdgPage.css";
import { useMemo } from "react";
import { SDG_GOALS, useSdgImage, type SdgStakeholder } from "../data/sdgGoals";
import { headingId } from "../utils/headingId";
import { MarksContext } from "../utils/marksContext";
import { splitAt } from "../utils/markdownSections";
import { Marked } from "./Marked";
import { MarkdownChunk } from "./MarkdownPage";
import { SdgOverview } from "./SdgOverview";

/* The sustainability page: an ordinary run of bands, except that each
 * `## Goal N ...` section folds into a card. Closed, a card shows the goal's
 * tile, a short summary and the face of the stakeholder the goal was argued
 * with; open, it is the section as written.
 *
 * The page is still one Markdown file, edited and searched like every other.
 * Two things in it are read specially:
 *
 *   ## Goal 15 — Life on land     a card, if SDG_GOALS has an entry for 15
 *   **TLDR:** ...                 the card's closed-state summary; the first
 *                                   such line in the section, taken out of
 *                                   the open body
 *
 * Cards in a row share one band. Any other `##` section is a band of its own,
 * exactly as MarkdownPage draws it.
 *
 * The opening band is a two-column hero when it places the `sdg-overview`
 * slot: whatever is written above the slot sits beside the figure, and
 * whatever is below it carries on underneath at reading width. On a narrow
 * screen the columns stack, which is the order the file is written in.
 */

interface Card {
  kind: "goal";
  number: number;
  id: string;
  title: string;
  tldr: string;
  body: string;
}

interface Band {
  kind: "band";
  source: string;
  /** Set on the hero: the Markdown beside the figure. */
  beside?: string;
}

/** The overview slot, as a content file writes it. */
const OVERVIEW_SLOT = /^```component[ \t]*\r?\n[ \t]*sdg-overview[ \t]*\r?\n```[ \t]*$/m;

const TLDR = /^\*\*TLDR:?\*\*:?[ \t]*(.*)$/m;

function parse(content: string): (Band | Card[])[] {
  const { intro, chunks } = splitAt(content, 2);
  const out: (Band | Card[])[] = [];
  const slot = OVERVIEW_SLOT.exec(intro);
  if (slot) {
    out.push({
      kind: "band",
      beside: intro.slice(0, slot.index).trim(),
      source: intro.slice(slot.index + slot[0].length).trim(),
    });
  } else if (intro) {
    out.push({ kind: "band", source: intro });
  }

  for (const { title, body } of chunks) {
    const number = Number(/^Goal\s+(\d+)\b/i.exec(title)?.[1]);
    if (!SDG_GOALS[number]) {
      out.push({ kind: "band", source: `## ${title}\n\n${body}` });
      continue;
    }
    const tldr = TLDR.exec(body);
    const card: Card = {
      kind: "goal",
      number,
      id: headingId(title),
      title,
      tldr: tldr?.[1].trim() ?? "",
      body: tldr ? body.replace(tldr[0], "").trim() : body,
    };
    const last = out[out.length - 1];
    if (Array.isArray(last)) last.push(card);
    else out.push([card]);
  }
  return out;
}

/** The drawn stand-in for a photo we do not have or cannot show. The same
 * figure as the stakeholder map's (StakeholderMap.tsx). */
function Silhouette() {
  return (
    <svg className="sdg-silhouette" viewBox="-8 -9 16 20" aria-hidden>
      <circle cx="0" cy="-3.9" r="3.4" />
      <path d="M -6.6 11.35 C -6.6 4.6 -3.6 1.7 0 1.7 C 3.6 1.7 6.6 4.6 6.6 11.35 Z" />
    </svg>
  );
}

function Face({ who }: { who?: SdgStakeholder }) {
  const { src, failed, onError } = useSdgImage(who?.photo ?? "");
  return (
    <span className="sdg-face">
      <span className="sdg-face-inner">
        {who?.photo && !failed ? (
          <img
            src={src}
            alt={who.name}
            style={{
              objectPosition: who.focus,
              transform: who.zoom ? `scale(${who.zoom})` : undefined,
              transformOrigin: who.focus,
            }}
            onError={onError}
          />
        ) : (
          <>
            <Silhouette />
            {who && <span className="visually-hidden">{who.name}</span>}
          </>
        )}
      </span>
    </span>
  );
}

function Tile({ number }: { number: number }) {
  const { src, failed, onError } = useSdgImage(SDG_GOALS[number].tile);
  if (failed) {
    return (
      <span className="sdg-tile sdg-tile--text" aria-hidden>
        {number}
      </span>
    );
  }
  // Decorative: the heading beside it names the goal.
  return (
    <img
      className="sdg-tile"
      src={src}
      alt=""
      onError={onError}
    />
  );
}

function GoalCard({ card }: { card: Card }) {
  const goal = SDG_GOALS[card.number];
  return (
    <details className="sdg-card">
      <summary>
        <Tile number={card.number} />
        {/* The heading is for the outline, screen readers and search links:
            sighted readers get the same words from the tile. A summary may
            hold a heading but not a block wrapper, so it sits here directly;
            being visually hidden it is out of flow and takes no grid cell. */}
        <h2 id={card.id} className="visually-hidden">
          <Marked text={card.title} />
        </h2>
        <span className="sdg-card-tldr">
          <Marked text={card.tldr} />
        </span>
        <Face who={goal.stakeholder} />
      </summary>
      <div className="sdg-card-body">
        <MarkdownChunk source={card.body} />
      </div>
    </details>
  );
}

/** One array, so a page with no marks does not rerender its consumers. */
const EMPTY: string[] = [];

interface SdgPageProps {
  /** Raw Markdown, imported from src/content/ via ?raw. */
  content: string;
  /** Words to mark, from the `?q=` a search result carried here. */
  marks?: string[];
}

export function SdgPage({ content, marks }: SdgPageProps) {
  const blocks = useMemo(() => parse(content), [content]);

  return (
    <MarksContext.Provider value={marks ?? EMPTY}>
      {/* Bands alternate as on every other page. Index keys are safe: the
          sections of a content file never reorder. */}
      {blocks.map((block, index) => (
        <section
          key={index}
          className="page-band"
          data-band={index % 2 === 0 ? "wax" : "comb"}
        >
          <div className="container">
            {!Array.isArray(block) && block.beside !== undefined && (
              <div className="sdg-hero">
                <div className="markdown-page">
                  <MarkdownChunk source={block.beside} />
                </div>
                <SdgOverview />
              </div>
            )}
            <div className="markdown-page">
              {Array.isArray(block) ? (
                <div className="sdg-cards">
                  {block.map((card) => (
                    <GoalCard key={card.id} card={card} />
                  ))}
                </div>
              ) : (
                <MarkdownChunk source={block.source} />
              )}
            </div>
          </div>
        </section>
      ))}
    </MarksContext.Provider>
  );
}
