import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * The search field in the menu bar. The only one on the wiki: the search page
 * has no field of its own, it just reads this one through the URL.
 *
 * There is no state here at all. The query lives in `/search?q=...`, the field
 * displays whatever is in that URL, and typing navigates. That makes the back
 * button, a reload, a bookmark and a pasted link all behave without anything
 * to keep in sync, and it means the field is empty everywhere except on the
 * search page, which is where a query is still live.
 *
 * The first keystroke pushes a history entry, so Back returns to the page
 * being read. Every keystroke after that replaces it, or Back would walk the
 * query backwards one letter at a time.
 */

/** Drawn here rather than pulled from an icon set: two shapes, no dependency. */
function Glass() {
  return (
    <svg
      className="site-search-glass"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="6.75" cy="6.75" r="4.75" />
      <line x1="10.5" y1="10.5" x2="15" y2="15" />
    </svg>
  );
}

export function SearchField() {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();
  const input = useRef<HTMLInputElement>(null);

  const onSearchPage = pathname === "/search";
  // Read from the URL wherever it appears, not only on the search page: a
  // result carries `?q=` to the page it opens, so the field keeps the query
  // while the reader works through what it found.
  const query = new URLSearchParams(search).get("q") ?? "";

  // Opening /search directly, from a bookmark or a link, means intending to
  // type. Anywhere else the field must not steal the caret.
  useEffect(() => {
    if (onSearchPage) input.current?.focus();
    // Mount only: re-focusing on every query change would fight the caret.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (next: string) => {
    // Emptying the field on a page opened from a result means "stop marking
    // these words", not "take me to an empty search". Drop the query and stay
    // put, keeping the fragment so the reader does not lose their place.
    if (!next && !onSearchPage) {
      navigate(`${pathname}${hash}`, { replace: true });
      return;
    }

    navigate(next ? `/search?q=${encodeURIComponent(next)}` : "/search", {
      replace: onSearchPage,
    });
  };

  return (
    <form
      className="site-search"
      role="search"
      onSubmit={(event) => {
        // Results are already live; submitting has nothing left to do, and a
        // real submit would reload the page out of the router.
        event.preventDefault();
        input.current?.blur();
      }}
    >
      <Glass />
      <input
        ref={input}
        type="search"
        value={query}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          // Only when there is something to clear. Off the search page the
          // field is empty, and Escape must not navigate to it.
          if (event.key === "Escape" && query) onChange("");
        }}
        aria-label="Search this wiki"
        placeholder="Search"
        autoComplete="off"
        spellCheck={false}
      />
    </form>
  );
}
