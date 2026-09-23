import { Link, useLocation } from "react-router-dom";
import Pages, { isGroup, type MenuEntry } from "../pages.ts";

interface Crumb {
  name: string;
  /** Absent for a menu group, which has no page to link to. */
  path?: string;
}

/**
 * The chain of ancestors down to `pathname`, or null when there is no such
 * page. Groups contribute a crumb with no path, so they render as plain text.
 */
function trail(entries: MenuEntry[], pathname: string): Crumb[] | null {
  for (const entry of entries) {
    if (isGroup(entry)) {
      const rest = trail(entry.children, pathname);
      if (rest) return [{ name: entry.name }, ...rest];
      continue;
    }

    if (entry.path === pathname) {
      return [{ name: entry.name, path: entry.path }];
    }

    const rest = entry.children && trail(entry.children, pathname);
    if (rest) return [{ name: entry.name, path: entry.path }, ...rest];
  }

  return null;
}

/**
 * Where you are, as a path: Home > Building NECTAR > Bee lab
 *
 * Every step that has a page of its own is a link. Menu groups do not, so they
 * are plain text. The last crumb is the page you are already on, so it is
 * plain text too, marked aria-current.
 *
 * Renders nothing on the home page, and nothing for a URL with no page behind
 * it, so the Not Found screen stays clean.
 */
export function Breadcrumbs() {
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  const rest = trail(Pages, pathname);
  if (!rest) return null;

  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, ...rest];

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;

          return (
            <li key={crumb.path ?? `group-${crumb.name}`}>
              {crumb.path && !last ? (
                <Link to={crumb.path}>{crumb.name}</Link>
              ) : (
                <span aria-current={last ? "page" : undefined}>
                  {crumb.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
