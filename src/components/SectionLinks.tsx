import { Link, useLocation } from "react-router-dom";
import Pages, { isGroup, type MenuEntry, type Page } from "../pages.ts";

/** Depth-first search for the page at `pathname`. */
function findPage(entries: MenuEntry[], pathname: string): Page | undefined {
  for (const entry of entries) {
    if (isGroup(entry)) {
      const hit = findPage(entry.children, pathname);
      if (hit) return hit;
      continue;
    }
    if (entry.path === pathname) return entry;
    const hit = entry.children && findPage(entry.children, pathname);
    if (hit) return hit;
  }
  return undefined;
}

/**
 * Links to the sub-pages of the page you are on, shown at the top of that page.
 *
 * The menu stops at two levels, so anything deeper is surfaced here instead:
 * open Dry Lab and RNA design, economical and ecological modelling appear at
 * the top of it; open Case studies and Australia and California appear there.
 *
 * Renders nothing on a page with no children.
 */
export function SectionLinks() {
  const { pathname } = useLocation();
  const page = findPage(Pages, pathname);

  if (!page?.children?.length) return null;

  return (
    <nav className="section-links" aria-label={`Inside ${page.name}`}>
      <ul>
        {page.children.map((child) => (
          <li key={child.path}>
            <Link to={child.path}>{child.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
