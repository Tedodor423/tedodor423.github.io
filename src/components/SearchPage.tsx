import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { highlight, search, termsOf } from "../utils/search";
import { Segments } from "./Marked";

/**
 * The results at /search.
 *
 * There is no field on this page. The one in the menu bar (SearchField) is
 * the only one, and it writes `?q=` as you type; this page reads it and
 * renders. So a search is linkable and survives a reload, and the results are
 * live without a second box to keep in step with the first.
 *
 * No debounce, no spinner. The corpus is in the bundle already (see
 * src/utils/search.ts), so a query is a synchronous pass over a few hundred
 * kilobytes and finishes inside a frame. Anything asynchronous would only add
 * a flicker of staleness.
 *
 * A result links to `/page?q=...#heading`: the fragment puts the reader at the
 * passage, and the query travels with them so the words they searched for are
 * marked in the page they land on.
 */

export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";

  const { pages, corrections, forms } = useMemo(() => search(query), [query]);
  const terms = termsOf(query);
  const passages = pages.reduce((sum, page) => sum + page.hits.length, 0);

  /** The page, at the passage, carrying the query that found it. */
  const linkTo = (path: string, anchor: string) =>
    `${path}?q=${encodeURIComponent(query)}${anchor ? `#${anchor}` : ""}`;

  return (
    <div className="search">
      {/* Said plainly, because a search read either way answers a question
          slightly different from the one that was asked. Spacing found the
          words asked for; spelling found the closest thing to them. */}
      {corrections.map((correction) => (
        <p className="search-correction" key={correction.typed}>
          {correction.kind === "spacing" ? (
            <>
              Reading <em>{correction.typed}</em> as{" "}
              {correction.used.join(", ")}.
            </>
          ) : (
            <>
              No page says <em>{correction.typed}</em>. Showing{" "}
              {correction.used.join(", ")}.
            </>
          )}
        </p>
      ))}

      {terms.length > 0 && (
        <p className="search-count" role="status">
          {pages.length === 0
            ? `Nothing on the wiki matches "${query.trim()}".`
            : `${passages} passage${passages === 1 ? "" : "s"} on ${pages.length} page${pages.length === 1 ? "" : "s"}.`}
        </p>
      )}

      {pages.map((page) => (
        <article className="search-result" key={page.path}>
          <h2>
            <Link to={linkTo(page.path, "")}>
              <Segments segments={highlight(page.title, forms)} />
            </Link>
          </h2>
          <ul className="search-hits">
            {page.hits.map((hit) => (
              <li key={`${hit.path}#${hit.anchor}`}>
                {/* The whole passage is the link, heading and snippet
                    together: the snippet is the part that tells you whether
                    to go, so it should be the part you can click. */}
                <Link className="search-hit" to={linkTo(hit.path, hit.anchor)}>
                  <span className="search-hit-heading">
                    {hit.heading ? (
                      <Segments segments={highlight(hit.heading, forms)} />
                    ) : (
                      "Top of the page"
                    )}
                  </span>
                  <span className="search-snippet">
                    <Segments segments={hit.snippet} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
