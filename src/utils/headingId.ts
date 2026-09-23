/**
 * A stable id for a heading, so that other pages, the on-page index and the
 * search results can link straight to it.
 *
 * Engineering-cycle headings are written as `### 1.3 · Can we transcribe it
 * reliably?` or `### B1 · Can we deliver a known dose?`, and get a short,
 * predictable id built from the cycle number: `cycle-1-3`, `cycle-3-3b`,
 * `cycle-b1`. Those ids are quoted across the wiki, so the rule that produces
 * them lives here rather than in a slug library — changing it breaks links.
 *
 * Every other heading gets an ordinary slug of its own text.
 *
 * This is shared: MarkdownPage puts the id on the rendered heading, and the
 * search index builds `#anchor` links from the same Markdown source. If the
 * two ever disagree, every search result lands at the top of the page instead
 * of at the passage it matched.
 */
export function headingId(text: string): string {
  const heading = text.trim();

  const cycle =
    /^([0-9]+\.[0-9]+[a-z]?|[A-Za-z][0-9]+(?:[–-][A-Za-z][0-9]+)?)\s*·/.exec(
      heading,
    );
  if (cycle) {
    return `cycle-${cycle[1].toLowerCase().replace(/[.–-]/g, "-")}`;
  }

  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
