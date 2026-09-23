import type { ReactNode } from "react";
import { Children, isValidElement, useMemo } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { headingId } from "../utils/headingId";
import { rehypeMark } from "../utils/markTree";
import { MarksContext } from "../utils/marksContext";
import { StakeholderMap } from "./StakeholderMap";
import { HoneyLoop } from "./HoneyLoop";
import { VarroaMap } from "./VarroaMap";
import { ProjectTimeline } from "./ProjectTimeline";

/* Components a content file may place in the page.
 *
 * House rules forbid raw HTML in a Markdown file and say that a page needing
 * one needs a component instead. This is that mechanism: a fenced block whose
 * info string is `component`, holding the name of one of these.
 *
 *     ```component
 *     stakeholder-map
 *     ```
 *
 * It stays plain Markdown, it is greppable, and a name with no entry here
 * renders as an ordinary code block rather than throwing, so a typo is visible
 * in the page instead of blanking it.
 */
const SLOTS: Record<string, () => ReactNode> = {
  "stakeholder-map": () => <StakeholderMap />,
  "honey-loop": () => <HoneyLoop />,
  "varroa-map": () => <VarroaMap />,
  "project-timeline": () => <ProjectTimeline />,
};

/** One array, so a page with no marks does not rerender its consumers. */
const EMPTY: string[] = [];

interface MarkdownPageProps {
  /** Raw Markdown, imported from src/content/ via ?raw. */
  content: string;
  /**
   * Words to mark in the rendered page, from the `?q=` a search result
   * carried here. Empty on a page opened any other way.
   */
  marks?: string[];
}

/** The visible text of a heading, with any inline markup flattened out. */
function textOf(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return textOf(child.props.children);
      }
      return "";
    })
    .join("");
}

/**
 * The id for a rendered heading.
 *
 * The rule itself lives in src/utils/headingId.ts, because the search index
 * builds the same ids straight from the Markdown source and the two have to
 * agree. Here it only needs the heading flattened to text first.
 */
function idOf(children: ReactNode): string {
  return headingId(textOf(children));
}

/**
 * A content file split into its `##` sections, each one rendered as its own
 * band down the page. Fenced blocks are stepped over, so a `##` inside one is
 * source code rather than a heading. Anything above the first `##` is the
 * page's opening band.
 *
 * Splitting the source rather than the rendered tree keeps every section an
 * ordinary Markdown document. Nothing in src/content/ spans a section today
 * (no reference-style link definitions, no footnotes), and a construct that
 * did would have to be written inside one section to resolve.
 */
function sectionsOf(content: string): string[] {
  const sections: string[] = [];
  let current: string[] = [];
  let fenced = false;

  for (const line of content.split("\n")) {
    if (/^\s{0,3}(```|~~~)/.test(line)) {
      fenced = !fenced;
    } else if (
      !fenced &&
      /^##\s/.test(line) &&
      current.some((held) => held.trim())
    ) {
      sections.push(current.join("\n"));
      current = [];
    }
    current.push(line);
  }
  if (current.some((held) => held.trim())) sections.push(current.join("\n"));

  return sections;
}

/** Shared by every band, so the map is not rebuilt once per section. */
const COMPONENTS: Components = {
  // A fenced `component` block is a slot, not source code. Handled on
  // <pre> rather than on <code> so the slot replaces the whole block
  // and does not end up wrapped in a code frame.
  pre: ({ children, ...props }) => {
    const child = Children.toArray(children)[0];
    if (isValidElement<{ className?: string; children?: ReactNode }>(child)) {
      const { className, children: inner } = child.props;
      if (className?.split(" ").includes("language-component")) {
        const slot = SLOTS[textOf(inner).trim()];
        if (slot) return slot();
      }
    }
    return <pre {...props}>{children}</pre>;
  },
  h2: ({ children, ...props }) => (
    <h2 id={idOf(children)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 id={idOf(children)} {...props}>
      {children}
    </h3>
  ),
  a: ({ href, children, ...props }) => {
    if (href?.startsWith("/") && !href.startsWith("//")) {
      return <Link to={href}>{children}</Link>;
    }

    const isExternal = /^https?:/i.test(href ?? "");
    return (
      <a
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
};

/**
 * Renders one Markdown content file as a page body.
 *
 * Content files start at `##` — the `<h1>` comes from the route table in
 * pages.ts, so that heading order stays semantic (h1 -> h2 -> h3).
 *
 * Links written as `/some-page` are internal wiki pages. They are rendered as
 * router links so that they pick up the `/oxford/` base path and navigate
 * without a full page reload; a plain <a href="/some-page"> would 404 on the
 * deployed site. Everything else (http, mailto, #anchor) is left alone.
 */
export function MarkdownPage({ content, marks }: MarkdownPageProps) {
  // Rebuilt only when the words change, so an ordinary page render does not
  // walk the tree at all.
  const rehypePlugins = useMemo(
    () => (marks?.length ? [rehypeMark(marks)] : []),
    [marks],
  );

  const sections = useMemo(() => sectionsOf(content), [content]);

  return (
    // Components placed in a slot below carry text of their own; the context
    // is how the searched words reach them (see Marked.tsx).
    <MarksContext.Provider value={marks ?? EMPTY}>
      {/* Bands alternate down the page. They are plain wrappers until the
          comb treatment is switched on, which is what colours them; see
          CombBands.css. Index keys are safe: the sections of a content file
          are fixed and never reorder. */}
      {sections.map((section, index) => (
        <section
          key={index}
          className="page-band"
          data-band={index % 2 === 0 ? "wax" : "comb"}
        >
          <div className="container">
            <div className="markdown-page">
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={rehypePlugins}
                components={COMPONENTS}
              >
                {section}
              </Markdown>
            </div>
          </div>
        </section>
      ))}
    </MarksContext.Provider>
  );
}
