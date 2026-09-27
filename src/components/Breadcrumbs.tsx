import { Link, useLocation } from "react-router-dom";
import Pages, { isGroup, type MenuEntry } from "../pages.ts";

interface Crumb {
  name: string;
  path: string;
}

/**
 * The chain of ancestors down to `pathname`, or null when there is no such
 * page. A group has no page of its own, so its crumb points at its first page.
 */
function trail(entries: MenuEntry[], pathname: string): Crumb[] | null {
  for (const entry of entries) {
    if (isGroup(entry)) {
      const rest = trail(entry.children, pathname);
      if (rest) return [{ name: entry.name, path: entry.children[0].path }, ...rest];
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
 * Where you are, as a path: Home > Building NECTAR
 *
 * Only the ancestors are listed. The page you are on is already the <h1> right
 * below, so repeating it here adds nothing. Every crumb is a link; a menu
 * group, which has no page of its own, links to its first page.
 *
 * Renders nothing on the home page, nothing when the trail would be "Home"
 * alone, and nothing for a URL with no page behind it, so the Not Found screen
 * stays clean.
 */
export function Breadcrumbs() {
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  const rest = trail(Pages, pathname);
  if (!rest) return null;

  // A group's crumb links to its first page, so on that first page the last
  // crumb would point back at the page itself. Drop it.
  const ancestors = rest.slice(0, -1);
  if (ancestors[ancestors.length - 1]?.path === pathname) ancestors.pop();

  // "Home" on its own says nothing the logo does not already.
  if (ancestors.length === 0) return null;

  const crumbs: Crumb[] = [{ name: "Home", path: "/" }, ...ancestors];

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((crumb) => (
          <li key={`${crumb.name}-${crumb.path}`}>
            <Link to={crumb.path}>{crumb.name}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
