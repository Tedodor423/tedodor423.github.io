import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import Pages, { isGroup, type Group, type MenuEntry, type Page } from "../pages.ts";
import { SearchField } from "./SearchField";
import { useMedia } from "../utils/useMedia";

/**
 * Below this width the bar no longer fits on one row, so it folds into a
 * wordmark and a Menu button that opens the groups as a list. Bootstrap's `lg`
 * breakpoint. The same query is written out in brand.css: change both.
 */
const COMPACT_MEDIA = "(max-width: 991.98px)";

/**
 * The bar's entries, with consecutive groups that share a `section` gathered
 * under it, so "The project in detail" renders once above its three dropdowns.
 * A `hidden` page is routed but not listed. Pages.ts never changes at runtime,
 * so this is computed once at module load.
 */
interface Cluster {
  section?: string;
  entries: MenuEntry[];
}

const clusters: Cluster[] = [];
for (const entry of Pages) {
  if (!isGroup(entry) && entry.hidden) continue;
  const section = isGroup(entry) ? entry.section : undefined;
  const last = clusters[clusters.length - 1];
  if (last && last.section === section) {
    last.entries.push(entry);
  } else {
    clusters.push({ section, entries: [entry] });
  }
}

/** True if `pathname` is this page or one of its descendants. */
function containsPath(page: Page, pathname: string): boolean {
  return (
    page.path === pathname ||
    (page.children?.some((child) => containsPath(child, pathname)) ?? false)
  );
}

/**
 * True while the menu should be hidden.
 *
 * The menu is sticky, but staying on screen the whole time costs reading room
 * on long pages. So it slides away on the way down and comes straight back on
 * the first scroll up — the nav is reachable from the middle of a page without
 * scrolling to the top. It never hides near the top of the document, and it
 * resets on navigation so a new page always opens with the menu visible.
 */
function useHideOnScrollDown(resetKey: string, revealAbove = 80) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    setHidden(false);
    lastY.current = window.scrollY;
  }, [resetKey]);

  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      // Scroll fires far more often than the screen repaints; coalescing to
      // one read per frame also keeps us off the layout-thrash path.
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY.current;

        // Ignore sub-pixel jitter and elastic overscroll, which would
        // otherwise flap the menu open and shut.
        if (Math.abs(delta) < 4) return;

        setHidden(delta > 0 && y > revealAbove);
        lastY.current = y;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [revealAbove]);

  return hidden;
}

export function Navbar() {
  const { pathname } = useLocation();
  const compact = useMedia(COMPACT_MEDIA);
  // The compact menu, open or shut. Opening /search directly on a phone means
  // intending to type, and the search field lives inside the menu there, so
  // that one page opens with it showing.
  const [menuOpen, setMenuOpen] = useState(
    () => pathname === "/search" && window.matchMedia(COMPACT_MEDIA).matches,
  );
  // An open menu holds the bar in place: it would be odd for the list you are
  // reading to slide away because the page under it moved.
  const hidden = useHideOnScrollDown(pathname) && !menuOpen;
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenGroup(null);
  };

  // Arriving on a page closes everything, except arriving on /search: that is
  // the search field navigating as you type, and shutting the menu then would
  // take the field away mid-word.
  useEffect(() => {
    setOpenGroup(null);
    if (pathname !== "/search") setMenuOpen(false);
  }, [pathname]);

  // Widening the window past the breakpoint leaves no Menu button to close
  // the panel with, so it goes now.
  useEffect(() => {
    if (!compact) setMenuOpen(false);
    setOpenGroup(null);
  }, [compact]);

  // A dropdown left hanging while the bar slides away looks broken.
  useEffect(() => {
    if (hidden) setOpenGroup(null);
  }, [hidden]);

  useEffect(() => {
    if (!openGroup && !menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (menuOpen) {
        closeMenu();
        // Focus was somewhere inside the panel that has just gone.
        toggleRef.current?.focus();
      } else {
        setOpenGroup(null);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) closeMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openGroup, menuOpen]);

  /** The group the current page sits in, opened for you when the menu opens. */
  const currentGroup = Pages.find(
    (entry): entry is Group =>
      isGroup(entry) &&
      entry.children.some((page) => containsPath(page, pathname)),
  );

  return (
    <nav
      ref={navRef}
      className={`site-nav${hidden ? " is-hidden" : ""}${menuOpen ? " is-open" : ""}`}
      aria-label="Main"
    >
      <div className="site-nav-bar">
        <Link
          className="site-nav-brand"
          to="/"
          title="Homepage"
          aria-current={pathname === "/" ? "page" : undefined}
          onClick={closeMenu}
        >
          NECTAR
        </Link>

        {/* Only drawn below the breakpoint (brand.css). Words rather than
            an icon: "Menu" needs no learning, three bars do. */}
        <button
          ref={toggleRef}
          type="button"
          className="site-nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-nav-menu"
          onClick={() => {
            if (menuOpen) {
              closeMenu();
            } else {
              setMenuOpen(true);
              setOpenGroup(currentGroup?.name ?? null);
            }
          }}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        {/* On a wide screen this wrapper is `display: contents`, so the list
            and the search field sit in the bar as if it were not there. In
            the compact menu it is the panel the Menu button opens. */}
        <div id="site-nav-menu" className="site-nav-menu">
          <ul className="site-nav-list">
            {clusters.map((cluster) =>
              cluster.section ? (
                // An overarching title with its groups gathered under it. The
                // title is plain text: it labels the run, it is not a control.
                <li key={cluster.section} className="site-nav-section">
                  <span className="site-nav-section-title">
                    {cluster.section}
                  </span>
                  <ul className="site-nav-section-list">
                    {cluster.entries.map(renderEntry)}
                  </ul>
                </li>
              ) : (
                cluster.entries.map(renderEntry)
              ),
            )}
          </ul>

          {/* The wiki's only search field. Typing in it navigates to
              /search, which is why nothing here links there. On a phone,
              submitting it (the keyboard's Search key) folds the menu away
              so the results it has been filling in underneath show. */}
          <SearchField onSubmit={closeMenu} />
        </div>
      </div>
    </nav>
  );

  /** One bar item: a dropdown for a group, a plain link for a page (Home). */
  function renderEntry(entry: MenuEntry) {
    if (!isGroup(entry)) {
      return (
        <li key={entry.path} className="site-nav-item">
          <Link
            className="site-nav-link"
            to={entry.path}
            aria-current={entry.path === pathname ? "page" : undefined}
            onClick={closeMenu}
          >
            {entry.name}
          </Link>
        </li>
      );
    }
    return renderGroup(entry);
  }

  function renderGroup(group: Group) {
    const open = openGroup === group.name;
    const inSection = group.children.some((page) =>
      containsPath(page, pathname),
    );

    // The compact menu has no hover to lean on, and a tap on a touch screen
    // fires mouseenter and focus as well as click, which would open the
    // group and then toggle it straight shut. So there it answers to click
    // alone, and on a wide screen to everything but click.
    const triggers = compact
      ? {}
      : {
          onMouseEnter: () => setOpenGroup(group.name),
          onMouseLeave: () =>
            setOpenGroup((current) =>
              current === group.name ? null : current,
            ),
          // Focus stands in for hover on a keyboard: tabbing onto the
          // label opens the dropdown, and it closes once focus has left
          // the group entirely (not while moving between its links).
          onFocus: () => setOpenGroup(group.name),
          onBlur: (event: FocusEvent<HTMLLIElement>) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            ) {
              setOpenGroup((current) =>
                current === group.name ? null : current,
              );
            }
          },
        };

    return (
      <li key={group.name} className="site-nav-group" {...triggers}>
        {/* A group has no page, so it is a button rather than a link.
            On a wide screen hover and focus are what open the dropdown and
            clicking is deliberately inert, so a click can never close a
            menu the pointer is still over. In the compact menu a tap opens
            and closes it, one group at a time. */}
        <button
          type="button"
          className="site-nav-group-label"
          aria-expanded={open}
          aria-current={inSection ? "true" : undefined}
          onClick={
            compact
              ? () => setOpenGroup(open ? null : group.name)
              : undefined
          }
        >
          {group.name}
        </button>

        {open && (
          <ul className="site-nav-dropdown">
            {/* The group's own subtitle, when it has one: a muted line at
                the top of the panel, not a link. */}
            {group.subtitle && (
              <li className="site-nav-dropdown-lede">{group.subtitle}</li>
            )}
            {group.children.map((page) => (
              <li key={page.path}>
                <Link
                  to={page.path}
                  aria-current={page.path === pathname ? "page" : undefined}
                  // A tap on the page you are already on changes no
                  // route, so nothing else would close the menu.
                  onClick={closeMenu}
                >
                  <span className="site-nav-dropdown-name">{page.name}</span>
                  {page.subtitle && (
                    <span className="site-nav-dropdown-subtitle">
                      {page.subtitle}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }
}
