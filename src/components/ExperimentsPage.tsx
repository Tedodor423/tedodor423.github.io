import "./ExperimentsPage.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { headingId } from "../utils/headingId";
import { splitAt } from "../utils/markdownSections";
import { MarksContext } from "../utils/marksContext";
import { Marked } from "./Marked";
import { MarkdownChunk } from "./MarkdownPage";

/* The experiments-and-protocols layout: a menu of every experiment down the
 * left, held in place while the write-up scrolls beside it.
 *
 * The page is still one ordinary Markdown file, so it is edited, searched and
 * linked like every other page. What changes is how its headings are read:
 *
 *   ## Block 1: ...      a block, one entry in the menu
 *   ### Aim              the three parts of a block, in the team's template
 *   ### Experiments        (Aim, Experiments, Discussion)
 *   #### <experiment>    under Experiments only: one expandable experiment,
 *                          listed in the menu under its block
 *   ##### <protocol>     inside an experiment: its full protocol
 *
 * A `##` section without an `### Experiments` part (Yeast production, Where
 * this connects) renders as plain prose and is listed in the menu by its
 * heading alone. Nothing here depends on the word "Block": when a heading
 * carries one, the write-up keeps it as a label over the name and the menu
 * shows just the number, as "1. <name>".
 */

interface Experiment {
  id: string;
  title: string;
  body: string;
}

interface Part {
  id: string;
  title: string;
  /** Prose under the part heading, above any experiments. */
  body: string;
  /** Set on the Experiments part only. */
  experiments?: Experiment[];
}

interface Section {
  id: string;
  /** "Block 1", when the heading carries one. */
  label?: string;
  /** The "1" of that label, which is all the menu shows of it. */
  number?: string;
  /** The heading with the label taken off. */
  name: string;
  /** The heading as written, for search marks and the accessible name. */
  title: string;
  intro: string;
  parts: Part[];
  experiments: Experiment[];
}

function parse(content: string) {
  // Ids are the same ones the search index builds from this file, so a
  // result lands on its heading. "Aim" and "Discussion" repeat once per
  // block; the first keeps the plain id the index points at and later ones
  // are numbered, so every id on the page is still unique.
  const taken = new Map<string, number>();
  const idFor = (title: string) => {
    const id = headingId(title);
    const seen = taken.get(id) ?? 0;
    taken.set(id, seen + 1);
    return seen ? `${id}-${seen + 1}` : id;
  };

  const page = splitAt(content, 2);

  const sections = page.chunks.map((chunk): Section => {
    const labelled = /^(Block\s+(\d+))\s*:\s*(.+)$/i.exec(chunk.title);
    const id = idFor(chunk.title);
    const split = splitAt(chunk.body, 3);

    const parts = split.chunks.map((part): Part => {
      const partId = idFor(part.title);
      if (part.title.toLowerCase() !== "experiments") {
        return { id: partId, title: part.title, body: part.body };
      }
      const items = splitAt(part.body, 4);
      return {
        id: partId,
        title: part.title,
        body: items.intro,
        experiments: items.chunks.map((item) => ({
          id: idFor(item.title),
          title: item.title,
          body: item.body,
        })),
      };
    });

    return {
      id,
      label: labelled?.[1],
      number: labelled?.[2],
      name: labelled?.[3] ?? chunk.title,
      title: chunk.title,
      intro: split.intro,
      parts,
      experiments: parts.flatMap((part) => part.experiments ?? []),
    };
  });

  return { intro: page.intro, sections };
}

/**
 * Opens whatever an element is folded inside and scrolls to it. The same
 * thing ScrollToHash does on a change of fragment; needed here as well for a
 * second click on the link already in the address bar, which changes nothing
 * the router can see.
 */
function reveal(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  for (
    let box = target.closest("details");
    box;
    box = box.parentElement?.closest("details") ?? null
  ) {
    box.open = true;
  }
  target.scrollIntoView();
}

/** One array, so a page with no marks does not rerender its consumers. */
const EMPTY: string[] = [];

interface ExperimentsPageProps {
  /** Raw Markdown, imported from src/content/ via ?raw. */
  content: string;
  /** Words to mark, from the `?q=` a search result carried here. */
  marks?: string[];
}

export function ExperimentsPage({ content, marks }: ExperimentsPageProps) {
  const { intro, sections } = useMemo(() => parse(content), [content]);
  const { hash } = useLocation();
  const main = useRef<HTMLDivElement>(null);

  // The block being read, marked in the menu so the reader can see where
  // they are in a long page. It is the block crossing a line a third of the
  // way down the window: low enough to clear the sticky site menu, high
  // enough that a block counts as read once its heading has gone past.
  const [current, setCurrent] = useState<string | undefined>(sections[0]?.id);

  useEffect(() => {
    const blocks =
      main.current?.querySelectorAll<HTMLElement>("[data-section]");
    if (!blocks?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCurrent((entry.target as HTMLElement).dataset.section);
          }
        }
      },
      { rootMargin: "-33% 0px -66% 0px" },
    );
    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, [sections]);

  const jump = (id: string) => () => {
    if (hash === `#${id}`) reveal(id);
  };

  return (
    <MarksContext.Provider value={marks ?? EMPTY}>
      <div className="container xp">
        <nav className="xp-menu" aria-labelledby="xp-menu-title">
          <p className="xp-menu-title" id="xp-menu-title">
            Experiments
          </p>
          <ol className="xp-menu-list">
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  to={`#${section.id}`}
                  onClick={jump(section.id)}
                  className="xp-menu-block"
                  aria-current={current === section.id ? "location" : undefined}
                >
                  {section.number && (
                    <span className="xp-menu-number">{section.number}.</span>
                  )}
                  {/* A real space, so it reads "1. <name>" aloud and when
                      copied; the grid draws the visible gap. */}
                  {section.number && " "}
                  {section.name}
                </Link>
                {section.experiments.length > 0 && (
                  <ol>
                    {section.experiments.map((experiment) => (
                      <li key={experiment.id}>
                        <Link
                          to={`#${experiment.id}`}
                          onClick={jump(experiment.id)}
                        >
                          {experiment.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="xp-main" ref={main}>
          {intro && (
            <div className="markdown-page">
              <MarkdownChunk source={intro} />
            </div>
          )}

          {/* Blocks alternate comb and wax, like the bands on every other
              page; plain wrappers when the comb treatment is off. Index keys
              are safe: the sections of a content file never reorder. */}
          {sections.map((section, index) => (
            <section
              key={section.id}
              className="page-band xp-block"
              data-band={index % 2 === 0 ? "comb" : "wax"}
              data-section={section.id}
              aria-labelledby={section.id}
            >
              <div className="markdown-page">
                <h2 id={section.id}>
                  {section.label && (
                    <span className="xp-block-label">
                      <Marked text={section.label} />
                      {/* Read aloud as "Block 1: ...", as written. */}
                      <span className="visually-hidden">: </span>
                    </span>
                  )}
                  <Marked text={section.name} />
                </h2>

                <MarkdownChunk source={section.intro} />

                {section.parts.map((part) => (
                  <div
                    key={part.id}
                    className={
                      section.experiments.length ? "xp-part" : undefined
                    }
                  >
                    <h3 id={part.id}>
                      <Marked text={part.title} />
                    </h3>
                    <MarkdownChunk source={part.body} />

                    {part.experiments && (
                      <div className="xp-experiments">
                        {part.experiments.map((experiment) => (
                          <details
                            key={experiment.id}
                            className="xp-experiment"
                          >
                            <summary>
                              <h4 id={experiment.id}>
                                <Marked text={experiment.title} />
                              </h4>
                            </summary>
                            <div className="xp-experiment-body">
                              <MarkdownChunk source={experiment.body} />
                            </div>
                          </details>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </MarksContext.Provider>
  );
}
