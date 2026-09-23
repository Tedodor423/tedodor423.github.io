import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Pages, { isGroup, type Page } from "../pages.ts";
import { SearchField } from "./SearchField";

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
  const hidden = useHideOnScrollDown(pathname);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Only groups appear in the menu. Anything at the top level with a path of
  // its own (Home, and the two section landing pages) is routed but unlisted.
  const groups = Pages.filter(isGroup);

  useEffect(() => setOpenGroup(null), [pathname]);

  // A dropdown left hanging while the bar slides away looks broken.
  useEffect(() => {
    if (hidden) setOpenGroup(null);
  }, [hidden]);

  useEffect(() => {
    if (!openGroup) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenGroup(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenGroup(null);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openGroup]);

  return (
    <nav
      ref={navRef}
      className={`site-nav${hidden ? " is-hidden" : ""}`}
      aria-label="Main"
    >
      <div className="site-nav-bar">
        <Link
          className="site-nav-brand"
          to="/"
          title="Homepage"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          NECTAR
        </Link>

        <ul className="site-nav-list">
          {groups.map((group) => {
            const open = openGroup === group.name;
            const inSection = group.children.some((page) =>
              containsPath(page, pathname),
            );

            return (
              <li
                key={group.name}
                className="site-nav-group"
                onMouseEnter={() => setOpenGroup(group.name)}
                onMouseLeave={() =>
                  setOpenGroup((current) =>
                    current === group.name ? null : current,
                  )
                }
              >
                {/* A group has no page, so it is a button rather than a link:
                    its only job is to open the dropdown. */}
                <button
                  type="button"
                  className="site-nav-group-label"
                  aria-expanded={open}
                  aria-current={inSection ? "true" : undefined}
                  onClick={() =>
                    setOpenGroup((current) =>
                      current === group.name ? null : group.name,
                    )
                  }
                >
                  {group.name}
                </button>

                {open && (
                  <ul className="site-nav-dropdown">
                    {group.children.map((page) => (
                      <li key={page.path}>
                        <Link
                          to={page.path}
                          aria-current={
                            page.path === pathname ? "page" : undefined
                          }
                        >
                          <span className="site-nav-dropdown-name">
                            {page.name}
                          </span>
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
          })}
        </ul>

        {/* The wiki's only search field. Typing in it navigates to /search,
            which is why nothing here links there. */}
        <SearchField />
      </div>
    </nav>
  );
}
