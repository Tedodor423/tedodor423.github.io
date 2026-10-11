/**
 * Finds places on screen where a decorative flower can grow out of the text.
 *
 * Three kinds of anchor, all of them at a word boundary:
 *
 *   "start"   the space just before the first word of a line
 *   "end"     the space just past the last word of a line
 *   "inline"  a gap between two words, mid-line
 *
 * Any visible text counts, not only Markdown prose. Components put their words
 * in all sorts of elements (spans in a flex row, buttons, figure captions,
 * headings), so nothing is found by tag: text nodes are walked, and each is
 * grouped under the block that lays it out in lines.
 *
 * The two gutter kinds are guaranteed not to touch a glyph: the flower's whole
 * box is checked against every line of text on screen, and a hit test makes
 * sure it sits over its own text's surroundings rather than over a picture, a
 * chart or the next card along. Inline anchors sit in the running text and
 * will overlap it, which is the point of them. Either kind, on text inside a
 * card, a panel or a button, stays inside that box.
 *
 * Only text a reader can actually see is used. A block that is transparent or
 * hidden is passed over, and so is a line that a hit test does not land on:
 * text clipped out of view, or covered by something drawn over it. Hit tests
 * are the expensive part, a few hundred of them for one screen of text, and
 * a caller only ever wants one spot, so they are left out of the search and
 * run by `confirm` on the spot the caller picks.
 *
 * Everything here is measured, never assumed. Line boxes come from Range rects,
 * so inline links, emphasis and code spans are accounted for. Coordinates come
 * back in viewport space, as of the moment of measuring; each spot carries the
 * element it belongs to, so the caller can keep a flower on its word while
 * that element moves.
 */

export type FlowerSide = "start" | "end" | "inline";

export interface FlowerSpot {
  /** Viewport coordinates of the point the stem grows from. */
  stemX: number;
  stemY: number;
  side: FlowerSide;
  /** The block whose text this spot is on. A pinned stage or a sliding panel
   *  moves it without moving the page, and the flower has to go with it. */
  anchor: Element;
  /** Runs the hit tests: true if the text is really visible, and a gutter
   *  flower would sit over its own text's surroundings. Call it on the spot
   *  about to be used, in the same frame as the search. */
  confirm: () => boolean;
}

export interface FlowerFootprint {
  width: number;
  /** How far up from the stem the flower reaches. A gutter flower must clear
   *  every line it overlaps, not only the one it grows from. */
  height: number;
  /** Where the stem meets the ground, as a fraction of the artwork's width.
   *  A flower on the "end" side is mirrored, so it uses 1 - this. */
  stemFrac: number;
  /** Clear space to leave between the text and a gutter flower, px. */
  gap: number;
}

interface LineBox {
  top: number;
  bottom: number;
  left: number;
  right: number;
  /** A point on the line's own text, for the hit test. */
  probeX: number;
  probeY: number;
}

/** Never searched. The blockquote callouts hold every TODO block and are busy
 *  enough already; code, chart labels and form controls are not reading. */
const SKIP =
  "blockquote, pre, svg, select, textarea, script, style, noscript, template";

/** Two rects belong to the same visual line if their tops agree to within this.
 *  Inline code sits a couple of pixels proud of the text around it. */
const LINE_TOLERANCE = 3;

/** Keep clear of the viewport edges. */
const EDGE = 8;

/** At most this many word gaps are measured per call. Every measurement forces
 *  layout, and a screen of prose has hundreds of them, so a random sample is
 *  taken rather than the lot. */
const INLINE_SAMPLE = 60;

/** Whether an element is drawn at all: not transparent, not hidden, and not
 *  inside anything that is. Browsers without checkVisibility get the benefit
 *  of the doubt; the hit tests below still catch most of what it would. */
export function isShown(el: Element): boolean {
  return (
    typeof el.checkVisibility !== "function" ||
    el.checkVisibility({ opacityProperty: true, visibilityProperty: true })
  );
}

/**
 * The element that lays `el`'s text out in lines: the nearest ancestor (or
 * itself) that is not inline. A child of a flex or grid container is
 * blockified by its parent, so each such item is a block of its own, which is
 * what it looks like on screen. `display: contents` boxes have no lines of
 * their own and are stepped through.
 */
function blockOf(
  el: Element,
  root: Element,
  cache: Map<Element, Element>,
): Element {
  const climbed: Element[] = [];
  let node: Element = el;

  for (;;) {
    const known = cache.get(node);
    if (known) {
      climbed.forEach((step) => cache.set(step, known));
      return known;
    }
    const display = getComputedStyle(node).display;
    if (node === root || (display !== "inline" && display !== "contents")) {
      climbed.forEach((step) => cache.set(step, node));
      cache.set(node, node);
      return node;
    }
    climbed.push(node);
    node = node.parentElement ?? root;
  }
}

/**
 * One box per visual line of `texts`, which are the text nodes a single block
 * lays out itself. A text node that wraps returns a rect per line, and a line
 * with links or emphasis in it is several text nodes, so the rects are grouped
 * by top edge and unioned.
 */
function lineBoxes(texts: Text[], range: Range): LineBox[] {
  const lines: LineBox[] = [];

  for (const text of texts) {
    range.selectNodeContents(text);
    for (const rect of range.getClientRects()) {
      if (rect.width < 1 || rect.height < 1) continue;

      const line = lines.find(
        (candidate) => Math.abs(candidate.top - rect.top) <= LINE_TOLERANCE,
      );

      if (line) {
        line.top = Math.min(line.top, rect.top);
        line.bottom = Math.max(line.bottom, rect.bottom);
        line.left = Math.min(line.left, rect.left);
        line.right = Math.max(line.right, rect.right);
      } else {
        lines.push({
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          probeX: rect.left + rect.width / 2,
          probeY: rect.top + rect.height / 2,
        });
      }
    }
  }

  return lines;
}

/** Every space character inside `texts`, as (text node, offset) pairs. Finding
 *  them costs nothing; measuring them is what has to be rationed. */
function wordGaps(texts: Text[]): Array<[Text, number]> {
  const gaps: Array<[Text, number]> = [];
  for (const node of texts) {
    const text = node.data;
    for (let i = 1; i < text.length - 1; i++) {
      if (text[i] === " ") gaps.push([node, i]);
    }
  }
  return gaps;
}

/** Whether what is drawn at (x, y) belongs to `block`: its own text, or the
 *  space around it, rather than something else drawn over or beside it. */
function landsOn(block: Element, x: number, y: number, around: boolean) {
  const hit = document.elementFromPoint(x, y);
  if (!hit) return false;
  return around ? hit.contains(block) : block.contains(hit);
}

/** Computed when nothing is painted: `transparent`, or any colour at alpha 0. */
const UNPAINTED = /^transparent$|^rgba\(.*,\s*0\)$/;

/**
 * Whether the box [left, right] x [top, bottom] fits inside whatever is drawn
 * around `el`'s text: the nearest card, panel or button, meaning anything with
 * a background or a frame on all four sides. Text out on the open page has
 * none and fits anywhere. A flower that hung over the edge of a card would
 * look like a rendering fault rather than something growing from the words.
 */
function fitsSurface(
  el: Element,
  root: Element,
  left: number,
  top: number,
  right: number,
  bottom: number,
): boolean {
  for (let node: Element | null = el; node && node !== root; ) {
    const style = getComputedStyle(node);
    const filled =
      style.backgroundImage !== "none" ||
      !UNPAINTED.test(style.backgroundColor);
    const framed =
      parseFloat(style.borderTopWidth) > 0 &&
      parseFloat(style.borderRightWidth) > 0 &&
      parseFloat(style.borderBottomWidth) > 0 &&
      parseFloat(style.borderLeftWidth) > 0;
    if (filled || framed) {
      const box = node.getBoundingClientRect();
      return (
        left >= box.left &&
        right <= box.right &&
        top >= box.top &&
        bottom <= box.bottom
      );
    }
    node = node.parentElement;
  }
  return true;
}

/**
 * Every spot on screen in `root` where a `footprint`-sized flower can be
 * anchored, in viewport coordinates. None is hit-tested yet: `confirm` the one
 * you mean to use.
 */
export function findFlowerSpots(
  root: Element,
  footprint: FlowerFootprint,
): FlowerSpot[] {
  const { width, height, stemFrac, gap } = footprint;
  const viewW = window.innerWidth;
  const viewH = window.innerHeight;
  const limitRight = viewW - EDGE;

  /* --- the text on screen, grouped by the block that lays it out --- */

  const blockCache = new Map<Element, Element>();
  const onScreen = new Map<Element, boolean>();
  const own = new Map<Element, Text[]>();

  // A long page is tens of thousands of pixels of text, and this runs inside
  // an animation frame, so anything wholly off screen is passed over without
  // looking inside it. Content positioned out of its parent's box is lost to
  // that, which costs a few possible spots and never a wrong one. A box with
  // no size of its own, `display: contents`, is looked inside.
  const offScreen = (el: Element) => {
    const box = el.getBoundingClientRect();
    if (box.width === 0 && box.height === 0) return false;
    return (
      box.bottom < 0 || box.top > viewH || box.right < 0 || box.left > viewW
    );
  };

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) =>
        node.nodeType === Node.ELEMENT_NODE
          ? (node as Element).matches(SKIP) || offScreen(node as Element)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_SKIP
          : /\S/.test((node as Text).data)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP,
    },
  );

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node as Text;
    if (!text.parentElement) continue;
    const block = blockOf(text.parentElement, root, blockCache);

    let visible = onScreen.get(block);
    if (visible === undefined) {
      const box = block.getBoundingClientRect();
      visible =
        box.width > 0 &&
        box.bottom > 0 &&
        box.top < viewH &&
        box.right > 0 &&
        box.left < viewW &&
        isShown(block);
      onScreen.set(block, visible);
    }
    if (!visible) continue;

    const texts = own.get(block);
    if (texts) texts.push(text);
    else own.set(block, [text]);
  }

  /* --- lines: every one is in the way, those on screen can carry one --- */

  const range = document.createRange();
  const obstacles: LineBox[] = [];
  const onScreenLines: Array<[Element, LineBox]> = [];

  for (const [block, texts] of own) {
    for (const line of lineBoxes(texts, range)) {
      obstacles.push(line);
      if (line.bottom > 0 && line.top < viewH)
        onScreenLines.push([block, line]);
    }
  }

  /** The flower's box, [left, left + width] across and [stemY - height, stemY]
   *  down, overlaps no line of text. */
  const clear = (left: number, stemY: number) => {
    const top = stemY - height;
    const right = left + width;
    return !obstacles.some(
      (line) =>
        left < line.right &&
        right > line.left &&
        top < line.bottom &&
        stemY > line.top,
    );
  };

  /** The line's own text is what is drawn there, and so is its block's
   *  surroundings, at the bloom and halfway down the stem. Cheapest first. */
  const confirmGutter =
    (anchor: Element, line: LineBox, left: number) => () => {
      const mid = left + width / 2;
      const top = line.bottom - height;
      return (
        fitsSurface(anchor, root, left, top, left + width, line.bottom) &&
        landsOn(anchor, line.probeX, line.probeY, false) &&
        landsOn(anchor, mid, top + height * 0.3, true) &&
        landsOn(anchor, mid, top + height * 0.7, true)
      );
    };

  // A list's bullets and numbers, and a disclosure triangle, are drawn just
  // before the first word but are not text, so no line box knows they are
  // there. Text in an item that shows one grows nothing on that side.
  const markers = new Map<Element, boolean>();
  const hasMarker = (anchor: Element) => {
    const item = anchor.closest("li, summary");
    if (!item) return false;
    let shown = markers.get(item);
    if (shown === undefined) {
      const style = getComputedStyle(item);
      shown = style.display === "list-item" && style.listStyleType !== "none";
      markers.set(item, shown);
    }
    return shown;
  };

  const gutter: FlowerSpot[] = [];

  for (const [anchor, line] of onScreenLines) {
    // Past the end of the line's last word. Mirrored, so the stem sits at
    // 1 - stemFrac across the box and leans out, away from the text.
    const endLeft = line.right + gap;
    if (endLeft + width < limitRight && clear(endLeft, line.bottom)) {
      gutter.push({
        stemX: endLeft + (1 - stemFrac) * width,
        stemY: line.bottom,
        side: "end",
        anchor,
        confirm: confirmGutter(anchor, line, endLeft),
      });
    }

    // Before the line's first word.
    const startLeft = line.left - gap - width;
    if (
      startLeft > EDGE &&
      !hasMarker(anchor) &&
      clear(startLeft, line.bottom)
    ) {
      gutter.push({
        stemX: startLeft + stemFrac * width,
        stemY: line.bottom,
        side: "start",
        anchor,
        confirm: confirmGutter(anchor, line, startLeft),
      });
    }
  }

  /* --- word gaps, sampled --- */

  const gaps: Array<[Element, Text, number]> = [];
  for (const [block, texts] of own) {
    for (const [node, offset] of wordGaps(texts))
      gaps.push([block, node, offset]);
  }

  const inline: FlowerSpot[] = [];
  const take = Math.min(INLINE_SAMPLE, gaps.length);
  for (let i = 0; i < take; i++) {
    const [anchor, node, offset] =
      gaps[Math.floor(Math.random() * gaps.length)];
    range.setStart(node, offset);
    range.setEnd(node, offset + 1);
    const rect = range.getBoundingClientRect();

    // A space that falls at a line break collapses or stretches to the end of
    // the line; neither is a gap between two words on screen.
    if (rect.width < 2 || rect.width > 14 || rect.height < 1) continue;
    if (rect.bottom <= 0 || rect.top >= viewH) continue;

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    // The caller may mirror an inline flower either way, so the box that has
    // to fit is the one covering both.
    const reach = Math.max(stemFrac, 1 - stemFrac) * width;
    inline.push({
      stemX: x,
      stemY: rect.bottom,
      side: "inline",
      anchor,
      confirm: () =>
        fitsSurface(
          anchor,
          root,
          x - reach,
          rect.bottom - height,
          x + reach,
          rect.bottom,
        ) && landsOn(anchor, x, y, false),
    });
  }

  return [...gutter, ...inline];
}
