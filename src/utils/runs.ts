/**
 * A caption or citation line, as runs: plain text, a link, or a `[LIT]`-style
 * tag set in code.
 *
 * Captions on the home deck carry links and tags, so they cannot be one
 * string; and the search index wants their words, so they cannot be JSX
 * either. Runs are both: the slide renders them with <Runs> (Marked.tsx), and
 * the index reads runsText().
 */
export interface Run {
  text: string;
  /** Set on a link. */
  href?: string;
  /** Set on a `[LIT]`, `[CALC]` or `[FLAG]` tag: shown in code, never marked. */
  code?: boolean;
}

/** A provenance tag as a run, written the way the wiki writes them. */
export const tag = (name: "LIT" | "CALC" | "FLAG"): Run => ({
  text: `[${name}]`,
  code: true,
});

/** The words of a line, links and tags included, for the index. */
export const runsText = (runs: Run[]): string =>
  runs.map((run) => run.text).join("");
