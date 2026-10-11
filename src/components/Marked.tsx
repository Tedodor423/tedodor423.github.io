import { Fragment, useContext } from "react";
import { highlight, type Segment } from "../utils/search";
import { MarksContext } from "../utils/marksContext";
import type { Run } from "../utils/runs";

/** Runs of text, with the matched ones marked. */
export function Segments({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((segment, i) =>
        segment.match ? (
          <mark key={i}>{segment.text}</mark>
        ) : (
          // A fragment rather than a span: this renders no element, so it
          // cannot disturb the layout or the selectors of what wraps it.
          <Fragment key={i}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
}

/** Plain text, with any words the reader searched for marked. */
export function Marked({ text }: { text: string }) {
  const marks = useContext(MarksContext);
  if (!marks.length) return <>{text}</>;
  return <Segments segments={highlight(text, marks)} />;
}

/**
 * A caption or citation line built from runs (src/utils/runs.ts): a link
 * stays a link, a tag stays in code and out of the marks, and the rest is
 * marked like any other text.
 */
export function Runs({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((run, i) =>
        run.code ? (
          <code key={i}>{run.text}</code>
        ) : run.href ? (
          <a key={i} href={run.href} target="_blank" rel="noreferrer">
            <Marked text={run.text} />
          </a>
        ) : (
          <Marked key={i} text={run.text} />
        ),
      )}
    </>
  );
}

/* `**bold**` and `*italic*`, the only inline Markdown the stakeholder files
 * use. A full Markdown renderer would wrap each field in a paragraph, and a
 * field already sits inside one. A marker with no partner stays as typed, so
 * a stray asterisk shows on the page rather than eating the rest of the line. */
const EMPHASIS = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/;

/** Like Marked, with `**bold**` and `*italic*` rendered. Searched-for words
 * are marked inside each run, so a match never straddles an emphasis edge. */
export function MarkedInline({ text }: { text: string }) {
  return (
    <>
      {text.split(EMPHASIS).map((run, i) => {
        if (i % 2 === 0) return run && <Marked key={i} text={run} />;
        return run.startsWith("**") ? (
          <strong key={i}>
            <Marked text={run.slice(2, -2)} />
          </strong>
        ) : (
          <em key={i}>
            <Marked text={run.slice(1, -1)} />
          </em>
        );
      })}
    </>
  );
}
