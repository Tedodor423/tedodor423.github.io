/* The hexagon world map, as data.
 *
 * Source: a stylised 872-hexagon drawing (wiki-assets-source/images_dev/
 * world.svg), corrected on 10 Oct 2026 against the Natural Earth 50 m
 * coastline; the record of that is tools/hexmap/README.md. Only the lattice
 * positions are stored, which lets StakeholderMap and VarroaMap colour
 * individual hexagons (a stakeholder's hexagon is a different fill, not a pin
 * dropped on top) and costs about 3 KB.
 *
 * Do not edit PACKED by hand. `node tools/hexmap/export-svg.mjs` draws the
 * map over the real coastline as an SVG; edit that, then
 * `node tools/hexmap/import-svg.mjs` rewrites PACKED here and the country
 * list in hexCountries.ts.
 *
 * Hexagons are pointy-top, spaced COL_W apart horizontally on alternating
 * rows (even rows hold odd columns, odd rows even ones) and ROW_H apart
 * vertically: a hex lattice of pitch 24 with a small gap left between cells.
 *
 * PACKED is one map row per source line: the column indices present in that
 * row, comma-separated, rows separated by ";". Empty rows are empty strings.
 */

/** Lattice origin and pitch, in viewBox units. */
export const ORIGIN_X = 33.9;
export const ORIGIN_Y = 22.8;
export const COL_W = 12.0;
export const ROW_H = 20.784000;

/** Circumradius of one drawn hexagon. Pitch is 24, so cells do not touch. */
export const HEX_R = 11.35;

/** The SVG viewBox the lattice was measured in. */
export const MAP_W = 1852;
export const MAP_H = 733;

/* The projection.
 *
 * Plate carree (equirectangular): longitude and latitude are both linear in
 * the map units, with a slightly different scale on each axis. The four
 * constants were fitted on 10 Oct 2026 by maximising the land overlap of
 * every cell of the original drawing with the Natural Earth coastline: the
 * drawing's nominal 1852/360 scale with 83 deg N at the top scored a soft
 * Jaccard of 0.70, this fit 0.77. The height runs from LAT_TOP down to about
 * 59 deg S, which is why Antarctica is absent. tools/hexmap reads these
 * constants from this file, so change them here only.
 *
 * A cell is about 4.7 degrees across. Every stakeholder on the human
 * practices map lands on a cell of their own country under this projection,
 * except where the stakeholder entry states a `hex` override.
 */
export const DEG_X = 5.093;
export const DEG_Y = 5.052;
export const LON_SHIFT = 1.1;
export const LAT_TOP = 85.9;

export function lonToX(lon: number): number {
  return (lon + 180 - LON_SHIFT) * DEG_X;
}

export function latToY(lat: number): number {
  return (LAT_TOP - lat) * DEG_Y;
}

const PACKED =
  "35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65;" +
  "26,30,32,34,36,38,40,44,46,48,50,52,54,56,58,60,62,64,116,118;" +
  "21,23,25,27,29,31,33,35,37,39,51,53,55,57,59,61,63,97,103,107,109,111,113,115,117,119,121,123,125,127,133;" +
  "4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,52,54,56,58,60,62,80,82,84,86,88,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,132,134,136,138,140,142,144,146,148;" +
  "5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,41,43,45,51,53,55,65,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145,147,149;" +
  "4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,40,42,44,46,54,70,72,76,78,80,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,132,134,136,138,140,142,144,146;" +
  "17,19,21,23,25,27,29,31,33,35,41,43,45,47,71,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,139,141;" +
  "18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,68,70,72,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,132,140;" +
  "21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,73,75,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133;" +
  "22,24,26,28,30,32,34,36,38,40,42,44,46,74,76,78,80,82,84,90,92,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,134,136;" +
  "21,23,25,27,29,31,33,35,37,39,41,43,69,71,73,77,81,83,85,87,89,91,93,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127;" +
  "22,24,26,28,30,32,34,36,38,40,70,72,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,132;" +
  "25,27,29,31,33,35,37,39,71,73,75,77,79,83,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,129;" +
  "26,28,30,32,38,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124;" +
  "29,31,41,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,103,105,107,109,111,113,115,117,119,121,123;" +
  "8,30,32,36,40,42,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,104,106,108,112,114,116,118;" +
  "33,35,37,67,69,71,73,75,77,79,81,83,85,87,89,93,95,105,107,115,117,119;" +
  "38,42,44,48,66,68,70,72,74,76,78,80,82,84,86,88,90,106,116,118;" +
  "39,41,43,45,47,49,69,71,73,75,77,79,81,83,85,87,89,91,93,107;" +
  "40,42,44,46,48,50,52,78,80,82,84,86,88,90,92,114,116,120,122;" +
  "39,41,43,45,47,49,51,53,77,79,81,83,85,87,89,91,115,117,119,121,123,125;" +
  "40,42,44,46,48,50,52,54,56,58,78,80,82,84,86,88,90,118,122,124,130,132,134,136,138;" +
  "41,43,45,47,49,51,53,55,57,79,81,83,85,87,89,121,123,125,133,139,141;" +
  "42,44,46,48,50,52,54,56,80,82,84,86,88,90,128,130,134;" +
  "43,45,47,49,51,53,55,57,79,81,83,85,87,89,93,125,127,129,131,133,135;" +
  "44,46,48,50,52,54,56,80,82,84,86,88,92,122,124,126,128,130,132,134,136;" +
  "43,45,47,49,51,53,81,83,85,87,121,123,125,127,129,131,133,135,137;" +
  "44,46,48,50,52,82,84,86,122,124,126,128,130,132,134,136,138;" +
  "43,45,47,49,51,83,123,125,131,133,135,137;" +
  "42,44,46,48,134,136,148;" +
  "43,45,147;" +
  "42,44,146;" +
  "43,45;" +
  "44";

export interface Hex {
  col: number;
  row: number;
  x: number;
  y: number;
}

/** Every land hexagon, with its lattice indices and viewBox centre. */
export const HEXES: Hex[] = PACKED.split(";").flatMap((line, row) =>
  line
    ? line.split(",").map((c) => {
        const col = Number(c);
        return {
          col,
          row,
          x: ORIGIN_X + COL_W * col,
          y: ORIGIN_Y + ROW_H * row,
        };
      })
    : [],
);

/** The six corners of the hexagon at (cx, cy), as an SVG points string. */
export function hexPoints(cx: number, cy: number, r = HEX_R): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 90);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}
