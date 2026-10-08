import { Fragment, useContext } from "react";
import { highlight, type Segment } from "../utils/search";
import { MarksContext } from "../utils/marksContext";

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
