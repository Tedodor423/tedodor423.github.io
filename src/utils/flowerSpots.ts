/**
 * Finds places on the page where a decorative flower can grow out of the text.
 *
 * Three kinds of anchor, all of them at a word boundary:
 *
 *   "start"   the gutter outside the first word of a line
 *   "end"     the ragged-right space past the last word of a line
 *   "inline"  a gap between two words, mid-line
 *
 * The two gutter kinds are guaranteed not to touch a glyph: both sit in space
 * that is empty by construction, and each candidate is also checked against the
 * line above, whose own ragged end may reach further out. Inline anchors sit in
 * the running text and will overlap it, which is the point of them.
 *
 * Everything here is measured, never assumed. Line boxes come from Range rects,
 * so inline links, emphasis and code spans are accounted for. Coordinates come
 * back in document space and go stale on reflow, so remeasure after a resize.
 */

export type FlowerSide = "start" | "end" | "inline";

export interface FlowerSpot {
  /** Document coordinates of the point the stem grows from. */
  stemX: number;
  stemY: number;
  side: FlowerSide;
}

export interface FlowerFootprint {
  /** Only the width matters here. How tall the flower is decides how far up it
   *  reaches, which is the caller's problem: these spots are about horizontal
   *  clearance from the text. */
  width: number;
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
}

/** Blocks whose lines can carry a flower. Deliberately prose only: the
 *  blockquote callouts hold every TODO and FIGURE placeholder and are busy
 *  enough already. */
const BLOCKS = "p, li, td";

/** Two rects belong to the same visual line if their tops agree to within this.
 *  Inline code sits a couple of pixels proud of the text around it. */
const LINE_TOLERANCE = 3;

/** Keep clear of the viewport edges. */
const EDGE = 8;

/** At most this many word gaps are measured per call. Every measurement forces
 *  layout, and a page of prose has a few thousand of them, so a random sample
 *  is taken rather than the lot. */
const INLINE_SAMPLE = 60;

/**
 * Merges a block's client rects into one box per visual line.
 *
 * A Range over a paragraph containing inline elements returns several rects per
 * line, one per inline box, so they are grouped by top edge and unioned.
 */
function lineBoxes(el: Element): LineBox[] {
  const range = document.createRange();
  range.selectNodeContents(el);

  const lines: LineBox[] = [];

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
      });
    }
  }

  return lines.sort((a, b) => a.top - b.top);
}

/** Every space character inside `block`, as (text node, offset) pairs. Finding
 *  them costs nothing; measuring them is what has to be rationed. */
function wordGaps(block: Element): Array<[Text, number]> {
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  const gaps: Array<[Text, number]> = [];

  let node = walker.nextNode() as Text | null;
  while (node) {
    const text = node.data;
    for (let i = 1; i < text.length - 1; i++) {
      if (text[i] === " ") gaps.push([node, i]);
    }
    node = walker.nextNode() as Text | null;
  }

  return gaps;
}

/**
 * Every spot in `root` where a `footprint`-sized flower can be anchored, in
 * document coordinates.
 */
export function findFlowerSpots(
  root: ParentNode,
  footprint: FlowerFootprint,
): FlowerSpot[] {
  const { width, stemFrac, gap } = footprint;
  const gutter: FlowerSpot[] = [];
  const inline: FlowerSpot[] = [];

  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const limitRight = window.innerWidth - EDGE;

  const blocks = [...root.querySelectorAll(BLOCKS)].filter(
    (block) => !block.closest("blockquote"),
  );

  for (const block of blocks) {
    const lines = lineBoxes(block);

    // Start at the second line: the first has no line above it to check
    // against inside this block, and the flower would grow up into whatever
    // sits in the margin above.
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const above = lines[i - 1];

      // Past the end of the line's last word, into the ragged right. Clear as
      // long as the line above does not reach out this far. Mirrored, so the
      // stem sits at 1 - stemFrac across the box.
      const endLeft = line.right + gap;
      if (endLeft > above.right && endLeft + width < limitRight) {
        gutter.push({
          stemX: endLeft + (1 - stemFrac) * width + scrollX,
          stemY: line.bottom + scrollY,
          side: "end",
        });
      }

      // Before the line's first word, in the gutter outside the block. Blocks
      // are left-aligned, so this is normally clear by the width of the gap.
      const startLeft = line.left - gap - width;
      if (startLeft + width < above.left && startLeft > EDGE) {
        gutter.push({
          stemX: startLeft + stemFrac * width + scrollX,
          stemY: line.bottom + scrollY,
          side: "start",
        });
      }
    }
  }

  // Word gaps, sampled. Measuring all of them would mean thousands of forced
  // layouts for one flower.
  const gaps: Array<[Text, number]> = [];
  for (const block of blocks) gaps.push(...wordGaps(block));

  const range = document.createRange();
  const take = Math.min(INLINE_SAMPLE, gaps.length);
  for (let i = 0; i < take; i++) {
    const [node, offset] = gaps[Math.floor(Math.random() * gaps.length)];
    range.setStart(node, offset);
    range.setEnd(node, offset + 1);
    const rect = range.getBoundingClientRect();

    // A space that falls at a line break collapses or stretches to the end of
    // the line; neither is a gap between two words on screen.
    if (rect.width < 2 || rect.width > 14 || rect.height < 1) continue;

    inline.push({
      stemX: rect.left + rect.width / 2 + scrollX,
      stemY: rect.bottom + scrollY,
      side: "inline",
    });
  }

  return [...gutter, ...inline];
}
