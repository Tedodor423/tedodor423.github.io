/* Where the cells of a honeycomb sit, and where they move when one opens.
 *
 * Pure geometry, no React and no content: it takes a list of ids and a width in
 * pixels and hands back a box for each. DbtlGallery.tsx draws it; the map's
 * lattice lives apart from StakeholderMap in the same way (see worldHexes.ts).
 *
 * FLAT-TOP HEXAGONS, which is the pointy-top ones of the rest of the wiki turned
 * sixty degrees. The reason is the opened cell. It is far wider than a cell, and
 * a hexagon that gets wider by being scaled has its corners opened out: the
 * slanted sides flatten and it stops looking like the same shape. Turned flat-top
 * it has two horizontal sides, and widening it lengthens those two and leaves the
 * four slanted ones exactly as they were. So the corner offset here is a fixed
 * number of pixels derived from the height (see SLANT), never a percentage of the
 * width, and every hexagon on the comb has the same sixty-degree corners whatever
 * its proportions.
 *
 * Turning the hexagon turns the lattice with it: flat-top cells interlock in
 * COLUMNS offset vertically, where pointy-top ones interlock in rows offset
 * horizontally.
 *
 * Why this is computed rather than handed to CSS grid: the stagger, the fixed
 * pixel slant and a cell that spans the whole comb are three things
 * `grid-auto-flow: dense` cannot hold together. Absolute pixel boxes also mean
 * the reflow animates with an ordinary CSS transition.
 */

/** Space between cells. The wiki's hexagons never touch; see worldHexes.ts. */
export const GAP = 10;

/** Height over width for a regular flat-top hexagon. */
export const HEX_ASPECT = Math.sqrt(3) / 2;

/**
 * How far in from each vertical edge the flat top starts, as a fraction of the
 * box's HEIGHT. This is the whole point of the flat-top shape: the offset is tied
 * to the height, so stretching the width lengthens the top and bottom sides and
 * leaves every corner at sixty degrees.
 *
 * A regular flat-top hexagon of width W is √3/2·W tall, and its top side runs
 * from W/4 to 3W/4. So the offset is W/4 = (1/(2√3))·H.
 */
export const SLANT = 1 / (2 * Math.sqrt(3));

/** The pixels in from each side where the flat top starts, for a box `h` tall. */
export function slantOf(h: number): number {
  return SLANT * h;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Seat {
  id: string;
  box: Box;
  open: boolean;
}

/* One cell per overarching cycle, ten of them at the time of writing. Five across on
 * a wide screen, which puts them at about 290px: small enough to read as a comb
 * rather than as a row of panels, and still wide enough for a label, because a
 * flat-top hexagon only offers about half its width as a rectangle to set text in. */
export function columnsFor(width: number): number {
  if (width >= 1000) return 5;
  if (width >= 760) return 4;
  if (width >= 520) return 3;
  return 2;
}

/* How tall the opened cell is, from its width. Three numbers, because one does
 * not hold at every screen size.
 *
 * SHARE is the height it wants: well under 1, so it comes out wider than tall,
 * and low enough that the panel inside very nearly fills it. A flat-top hexagon
 * wastes only its two side triangles once the panel takes the full height, and
 * the taller the hexagon the bigger those triangles get.
 *
 * FLOOR is the least height the panel needs for a heading, a stage of text and
 * the dial beside it. CEILING is the other end of the same argument: the side
 * triangles are SLANT × height wide each, so past about 0.62 of the width they
 * eat more of the middle than the text can spare. On a narrow screen the ceiling
 * wins and the panel is shorter than the floor asks for; the one stage on show
 * scrolls inside itself, which is what makes that survivable.
 *
 * The height is NOT snapped to the row pitch. Snapping made it jump by a whole
 * cell at a time, which meant either a third of the hexagon was blank or the
 * panel had no room at all. The packer places the rest of the comb by geometry,
 * so it does not care. */
const OPEN_SHARE = 0.42;
const OPEN_FLOOR = 430;
const OPEN_CEILING = 0.62;

/**
 * The six corners of the flat-top hexagon drawn in a box, matching the clip-path
 * in DbtlGallery.css exactly. Corners stay at sixty degrees however wide the box
 * is, because the inset comes from the height.
 */
export function hexOf({ x, y, w, h }: Box): [number, number][] {
  const s = Math.min(slantOf(h), w / 2);
  return [
    [x + s, y],
    [x + w - s, y],
    [x + w, y + h / 2],
    [x + w - s, y + h],
    [x + s, y + h],
    [x, y + h / 2],
  ];
}

/**
 * Whether the hexagons in two boxes touch.
 *
 * Their *boxes* are no use for this. In a honeycomb the columns interlock, so the
 * bounding boxes of neighbouring columns always overlap while the hexagons inside
 * them never do: the overlap is entirely in the corner triangles the clip-path
 * removes. Testing boxes instead of hexagons pushes a whole extra column out of
 * the way of an opened cell and leaves a hole in the comb.
 *
 * Separating-axis test: a gap along any edge normal means no contact. Both shapes
 * are convex, so it is exact. One pixel of slack, so cells that merely abut are
 * not counted as touching.
 */
export function overlaps(a: Box, b: Box): boolean {
  const first = hexOf(a);
  const second = hexOf(b);

  for (const edges of [first, second]) {
    for (let i = 0; i < edges.length; i += 1) {
      const p = edges[i];
      const q = edges[(i + 1) % edges.length];
      const nx = -(q[1] - p[1]);
      const ny = q[0] - p[0];
      const len = Math.hypot(nx, ny) || 1;

      let aLow = Infinity;
      let aHigh = -Infinity;
      for (const v of first) {
        const d = (v[0] * nx + v[1] * ny) / len;
        if (d < aLow) aLow = d;
        if (d > aHigh) aHigh = d;
      }
      let bLow = Infinity;
      let bHigh = -Infinity;
      for (const v of second) {
        const d = (v[0] * nx + v[1] * ny) / len;
        if (d < bLow) bLow = d;
        if (d > bHigh) bHigh = d;
      }

      if (aHigh < bLow + 1 || bHigh < aLow + 1) return false;
    }
  }
  return true;
}

export function layOutComb(
  ids: string[],
  width: number,
  openId: string | null,
): { seats: Seat[]; height: number } {
  const cols = columnsFor(width);

  /* Flat-top columns overlap by a quarter of a hexagon's width, so the pitch is
   * three quarters of it and the comb's width budget is
   *   W + (cols - 1) * (0.75W + GAP). */
  const W = (width - GAP * (cols - 1)) / (0.75 * (cols - 1) + 1);
  const H = W * HEX_ASPECT;
  const colPitch = 0.75 * W + GAP;
  const rowPitch = H + GAP;

  /* Odd columns are dropped half a cell, which is what makes it a honeycomb
   * rather than a grid of hexagons. */
  const cellBox = (r: number, c: number): Box => ({
    x: c * colPitch,
    y: r * rowPitch + (c % 2 === 0 ? 0 : rowPitch / 2),
    w: W,
    h: H,
  });

  let block: Box | null = null;
  if (openId !== null && ids.includes(openId)) {
    /* The opened cell takes the whole frame and then as many row pitches as it
     * needs. Full width because there is nothing useful to put beside a panel
     * this size, and because the panel's own columns (arrows, text, dial,
     * markers) want every pixel of it.
     *
     * And at the top of the comb, not at the seat the cell came from. A
     * full-width hexagon reaches further left and right than any cell, so opening
     * it in place pushes its neighbours out and leaves a hole above it. Opening
     * at the top gives one predictable shape every time: the panel, and the rest
     * of the comb underneath it. The cell still visibly travels there, because
     * its box is what animates. */
    block = {
      x: 0,
      y: 0,
      w: width,
      h: Math.min(
        Math.max(OPEN_SHARE * width, OPEN_FLOOR),
        OPEN_CEILING * width,
      ),
    };
  }

  /* Row by row, snaking: left to right on even rows, right to left on odd ones.
   * Plain reading order would jump from the last column back to the first at
   * every wrap, which splits a run of consecutive cells (one lab's cycles, in
   * DbtlGallery) across the comb. Snaking makes every wrap a step to the cell
   * straight below, so any run of consecutive ids stays one connected patch. */
  const seats: Seat[] = [];
  let r = 0;
  let c = 0;
  for (const id of ids) {
    if (block && id === openId) {
      seats.push({ id, box: block, open: true });
      continue;
    }
    for (;;) {
      if (c >= cols) {
        r += 1;
        c = 0;
        continue;
      }
      const box = cellBox(r, r % 2 === 0 ? c : cols - 1 - c);
      c += 1;
      if (!block || !overlaps(box, block)) {
        seats.push({ id, box, open: false });
        break;
      }
    }
  }

  const height = seats.reduce(
    (deep, s) => Math.max(deep, s.box.y + s.box.h),
    0,
  );
  return { seats, height };
}
