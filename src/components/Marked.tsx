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
