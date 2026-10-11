import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  preparePreviews,
  previewOf,
  type LinkPreview as Preview,
} from "../utils/linkPreview";
import { MarkedInline } from "./Marked";
import "./LinkPreview.css";

/* A card for links between pages, the way Wikipedia previews its links: rest
 * the pointer on a link to another page of the wiki, or tab to it, and a card
 * opens under it with that page's title, the section the link lands on, its
 * summary and, beside them, an image.
 *
 * What the card says is the page's entry in src/content/link-previews.md,
 * read by src/utils/linkPreview.ts. A page whose entry has no summary says
 * so; one with no image shows none.
 *
 * One listener on the document serves every link, so a link in the Markdown
 * and a link inside a component behave the same, and no component has to opt
 * in. Mounted once, in App.tsx.
 *
 * Mouse and pen only. A tap is a click on a touch screen, and a card opening
 * on it would cover the page the tap is about to leave. The card can be
 * hovered, so the pointer can cross onto it to read, and Escape closes it
 * (WCAG 1.4.13). */

/**
 * How long the pointer has to settle on a link before its card opens, in ms:
 * short enough to read as immediate. The clock restarts whenever the pointer
 * moves more than SETTLE px along the link, so a pointer passing over a
 * paragraph never settles, and flashes no card at the links it crosses
 * however long they are. From the keyboard it is a plain delay.
 */
const OPEN_DELAY = 80;
/** How far the pointer may drift, in px, and still count as settled. */
const SETTLE = 3;
/** How long the card waits for the pointer to cross from the link onto it. */
const CLOSE_DELAY = 300;
/**
 * Space between the link and the card's edge, in px. The notch stands about
 * 6.5px out of the edge, so this leaves its point a few pixels clear of the
 * word.
 */
const GAP = 11;
/** Least space between the card and the edge of the window, in px. */
const EDGE = 16;
/** How far in from the card's left the notch sits, where the window allows. */
const NOTCH_INSET = 24;
/** Least distance from the notch to either side of the card, in px. */
const NOTCH_MIN = 12;
/**
 * A link box taller than this is a whole card or panel rather than a line of
 * text, and the preview hangs from the pointer instead of from under the box.
 */
const TALL = 48;

/* Links that already say where they go, where a card would only repeat it:
 * the menu and the breadcrumbs, the switch tiles at the top of the case
 * studies (each prints the lead under its name) and the search results
 * (each prints the lead and the passages). */
const SKIP = [
  ".site-nav",
  ".breadcrumbs",
  ".view-switch",
  ".search-result",
].join(", ");

/** The router's base, "/oxford/", with and without its trailing slash. */
const BASE = import.meta.env.BASE_URL;
const ROOT = BASE.replace(/\/$/, "");

/** Ties the link to the card for a screen reader while the card is open. */
const CARD_ID = "link-preview";

/** The route-table path under the base, or null for a URL outside the wiki. */
function routeOf(pathname: string): string | null {
  if (pathname !== ROOT && !pathname.startsWith(BASE)) return null;
  return pathname.slice(ROOT.length).replace(/(.)\/$/, "$1") || "/";
}

/**
 * The page a link opens and the fragment it carries, or null when the link
 * leaves the wiki, stays on the page it is on, or sits in the chrome above.
 */
function targetOf(link: Element): { path: string; hash: string } | null {
  const href = link.getAttribute("href");
  if (!href || link.hasAttribute("download") || link.closest(SKIP)) return null;

  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;

  const path = routeOf(url.pathname);
  if (!path || path === routeOf(window.location.pathname)) return null;
  return { path, hash: url.hash };
}

/** Where the pointer rested, from the top left of the link's box. */
interface Grip {
  x: number;
  y: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

/**
 * What the card hangs from, in window coordinates, and the point along it
 * the notch aims at: `aimTop` when the card opens above, `aimBottom` below.
 *
 * Under the pointer, it is the line of a wrapped link the pointer is on, and
 * the notch aims at the word the pointer rests on; on a tall block of a link
 * (a card in a component), which is a target rather than a line, it is the
 * pointer itself. From the keyboard, it is the whole link, so the card covers
 * none of it, and the notch aims at the middle of the line it opens beside.
 */
function anchorOf(link: Element, at?: Grip) {
  const lines = Array.from(link.getClientRects());
  const first = lines[0] ?? link.getBoundingClientRect();
  const last = lines[lines.length - 1] ?? first;

  if (!at) {
    return {
      top: first.top,
      bottom: last.bottom,
      aimTop: first.left + first.width / 2,
      aimBottom: last.left + last.width / 2,
    };
  }

  const line = lines.find((r) => at.y >= r.top && at.y <= r.bottom) ?? first;
  if (line.height > TALL) {
    return { top: at.y - 12, bottom: at.y + 20, aimTop: at.x, aimBottom: at.x };
  }
  const aim = clamp(at.x, line.left + 2, line.right - 2);
  return { top: line.top, bottom: line.bottom, aimTop: aim, aimBottom: aim };
}

/**
 * Puts the card against its link: under it if it fits, else over it, else as
 * far into the window as it goes. Sideways, the notch sits NOTCH_INSET in
 * from the card's left with its point on the word, and the card slides along
 * as the window's edges require, the notch moving the other way to keep
 * pointing. A card with room on neither side overlaps its link and has no
 * notch, having nothing outside it to point at.
 *
 * False when the link is out of the window, which leaves the card nothing to
 * point at either.
 */
function place(card: HTMLElement, link: Element, grip?: Grip): boolean {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  const box = link.getBoundingClientRect();
  if (box.bottom <= 0 || box.top >= height) return false;

  // The grip is kept relative to the link, so the card follows the link
  // when the page moves under a pointer that has not.
  const at = grip && { x: box.left + grip.x, y: box.top + grip.y };
  const anchor = anchorOf(link, at);
  const size = card.getBoundingClientRect();

  const below = anchor.bottom + GAP;
  const above = anchor.top - GAP - size.height;
  const side =
    below + size.height <= height - EDGE
      ? "below"
      : above >= EDGE
        ? "above"
        : undefined;
  const top =
    side === "below"
      ? below
      : side === "above"
        ? above
        : Math.max(EDGE, height - EDGE - size.height);

  const aim = side === "above" ? anchor.aimTop : anchor.aimBottom;
  const left = Math.max(
    EDGE,
    Math.min(aim - NOTCH_INSET, width - EDGE - size.width),
  );

  card.style.top = `${top}px`;
  card.style.left = `${left}px`;
  if (side) {
    card.dataset.side = side;
    const notch = clamp(aim - left, NOTCH_MIN, size.width - NOTCH_MIN);
    card.style.setProperty("--notch-x", `${notch}px`);
  } else {
    delete card.dataset.side;
  }
  return true;
}

export function LinkPreview() {
  const { pathname } = useLocation();
  const [preview, setPreview] = useState<Preview | null>(null);
  /** An image that failed to load, so the card drops it rather than a hole. */
  const [broken, setBroken] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  /** The link whose card is open, and where the pointer rested on it. */
  const openRef = useRef<{ link: Element; grip?: Grip } | null>(null);
  const hideRef = useRef<() => void>(() => {});

  useEffect(() => {
    let openTimer = 0;
    let closeTimer = 0;
    /** The link whose card is waiting out OPEN_DELAY. */
    let pending: { link: Element; grip?: Grip } | null = null;
    /** Where the mouse last was, in window coordinates. */
    let pointer: Grip | null = null;

    const cancelOpen = () => {
      window.clearTimeout(openTimer);
      pending = null;
    };
    const cancelClose = () => window.clearTimeout(closeTimer);

    const hide = () => {
      cancelOpen();
      cancelClose();
      openRef.current?.link.removeAttribute("aria-describedby");
      openRef.current = null;
      setPreview(null);
    };
    hideRef.current = hide;

    const show = (link: Element, grip?: Grip) => {
      pending = null;
      const target = targetOf(link);
      const next = target && previewOf(target.path, target.hash);
      if (!next || !link.isConnected) return;

      openRef.current?.link.removeAttribute("aria-describedby");
      openRef.current = { link, grip };
      // No link on the wiki sets its own description, so this overwrites
      // nothing.
      link.setAttribute("aria-describedby", CARD_ID);
      setPreview(next);
    };

    const schedule = (link: Element, grip?: Grip) => {
      cancelOpen();
      pending = { link, grip };
      openTimer = window.setTimeout(() => show(link, grip), OPEN_DELAY);
    };

    /** Inside the open link or the card: the pointer may move between them. */
    const within = (node: Node | null) =>
      !!node &&
      (!!openRef.current?.link.contains(node) ||
        !!cardRef.current?.contains(node));

    const onOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const node = event.target as Element;
      if (within(node)) {
        cancelClose();
        return;
      }
      const link = node.closest?.("a[href]");
      if (!link || link === pending?.link || !targetOf(link)) return;
      const box = link.getBoundingClientRect();
      schedule(link, {
        x: event.clientX - box.left,
        y: event.clientY - box.top,
      });
    };

    const onOut = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const from = event.target as Node;
      const to = event.relatedTarget as Node | null;
      if (pending?.link.contains(from) && !(to && pending.link.contains(to))) {
        cancelOpen();
      }
      if (openRef.current && within(from) && !within(to)) {
        cancelClose();
        closeTimer = window.setTimeout(hide, CLOSE_DELAY);
      }
    };

    // Keyboard focus only: a mouse click focuses the link too, and the click
    // is about to leave the page.
    const onFocusIn = (event: FocusEvent) => {
      const link = (event.target as Element).closest?.("a[href]");
      if (!link || link === openRef.current?.link) return;
      if (link.matches(":focus-visible") && targetOf(link)) schedule(link);
    };

    const onFocusOut = (event: FocusEvent) => {
      if (event.target === pending?.link) cancelOpen();
      if (event.target === openRef.current?.link) hide();
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (openRef.current || pending)) hide();
    };

    // A press anywhere but the card ends it: on a link, the click either
    // navigates or opens a tab, and the card belongs to neither.
    const onDown = (event: PointerEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) hide();
    };

    // While the page moves, a waiting card waits for it to stop: tabbing to
    // a link off screen glides the page to it, and the card belongs where
    // the link comes to rest. An open card follows its link, and goes when
    // the link leaves the window. Under a mouse the link soon slides out
    // from under the pointer, and that closes it as leaving would.
    const onMove = () => {
      // What is under the mouse now, since the page has moved under it.
      // Read rather than waited for: a browser need not send pointer events
      // when only the page moves.
      const under = () =>
        pointer && document.elementFromPoint(pointer.x, pointer.y);

      if (pending?.grip) {
        if (!pending.link.contains(under() ?? null)) cancelOpen();
      } else if (pending) {
        schedule(pending.link);
      }

      const open = openRef.current;
      const card = cardRef.current;
      if (!open || !card) return;
      if (!place(card, open.link, open.grip)) {
        hide();
      } else if (open.grip) {
        cancelClose();
        if (!within(under() ?? null)) {
          closeTimer = window.setTimeout(hide, CLOSE_DELAY);
        }
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer = { x: event.clientX, y: event.clientY };

      // Still moving along a link whose card is waiting: wait from here.
      const grip = pending?.grip;
      if (!pending || !grip) return;
      const box = pending.link.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      if (Math.hypot(x - grip.x, y - grip.y) > SETTLE) {
        schedule(pending.link, { x, y });
      }
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown, true);
    window.addEventListener("scroll", onMove, { passive: true });
    window.addEventListener("resize", onMove);

    return () => {
      hide();
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("scroll", onMove);
      window.removeEventListener("resize", onMove);
    };
  }, []);

  // A new page is a new set of links.
  useEffect(() => {
    hideRef.current();
  }, [pathname]);

  // The first card would otherwise pay for the one-time work behind every
  // card (some 35 ms, mostly the search index the section names come from).
  // Done once the browser is idle after the page loads, the first card opens
  // as fast as the rest. Safari has no idle callback, so a short timer
  // stands in.
  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(preparePreviews, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(preparePreviews, 500);
    return () => window.clearTimeout(id);
  }, []);

  // Placed once the card has its size, before it is painted.
  useLayoutEffect(() => {
    const open = openRef.current;
    const card = cardRef.current;
    if (preview && open && card && !place(card, open.link, open.grip)) {
      hideRef.current();
    }
  }, [preview, broken]);

  if (!preview) return null;

  const image = preview.image !== broken ? preview.image : undefined;

  return (
    <div id={CARD_ID} ref={cardRef} className="link-preview" role="tooltip">
      <div className="lp-text">
        <p className="lp-title">{preview.title}</p>
        {preview.section && <p className="lp-section">{preview.section}</p>}
        {preview.summary ? (
          <p className="lp-summary">
            <MarkedInline text={preview.summary} />
          </p>
        ) : (
          <p className="lp-summary is-missing">No summary yet.</p>
        )}
        {image && preview.credit && (
          <p className="lp-credit">Image: {preview.credit}</p>
        )}
      </div>
      {image && (
        // The figure keeps its full alt text on its own page. Here it is a
        // thumbnail beside a summary, and reading the alt out with the
        // description would only lengthen it.
        <div className="lp-figure">
          <img
            src={image}
            alt=""
            decoding="async"
            onError={() => setBroken(image)}
          />
        </div>
      )}
    </div>
  );
}
