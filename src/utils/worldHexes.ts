/* The hexagon world map, as data.
 *
 * Source: wiki-assets-source/images_dev/world.svg — 872 hexagons on a regular
 * staggered lattice. The SVG itself is not shipped: it is an 82 KB wall of
 * <polygon> elements with a baked-in background rectangle and a single fill
 * colour, none of which can be styled per hexagon. Storing the lattice
 * positions instead lets StakeholderMap colour individual hexagons (a
 * stakeholder's hexagon is a different fill, not a pin dropped on top) and
 * costs about 3 KB.
 *
 * To regenerate after editing the SVG, re-run the extraction: read every
 * <polygon points="...">, take the centre of its bounding box, and convert to
 * lattice indices with the constants below. Hexagons are pointy-top, spaced
 * COL_W apart horizontally on alternating rows and ROW_H apart vertically,
 * which is a hex lattice of pitch 24 with a small gap left between cells.
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
 * The source map is plate carree (equirectangular): longitude and latitude are
 * both linear in the pixel coordinates, at the same scale. Longitude spans the
 * full -180..180 across the 1852-unit width, which fixes the scale at
 * 1852/360 units per degree; the height is a crop of the same projection,
 * running from 83 deg N down to about 59.7 deg S, which is why Antarctica is
 * absent.
 *
 * Fitted against 32 cities of known coordinates, every one of them lands a
 * mean 11.8 units from the nearest land hexagon — under half the 24-unit
 * lattice pitch, i.e. on the correct hexagon. Verified rather than assumed:
 * see the note in StakeholderMap.tsx about the one place that needs an
 * explicit override.
 */
export const DEG = MAP_W / 360;
export const LAT_TOP = 83;

export function lonToX(lon: number): number {
  return (lon + 180) * DEG;
}

export function latToY(lat: number): number {
  return (LAT_TOP - lat) * DEG;
}

const PACKED =
  "39,41,43,45,47,49,51,53,55,57,59,61,63,65,97,99,107,111;" +
  "26,30,32,34,36,38,40,44,46,48,50,52,54,56,58,60,62,64,66,78,80,116;" +
  "23,25,27,29,33,35,37,39,51,53,55,57,59,61,63,97,103,107,109,111,113,115,117,119,121,125,133;" +
  "6,8,10,12,22,26,28,30,34,36,38,40,42,44,52,54,56,58,60,62,80,82,84,86,94,98,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,132,134,136,138,140,144;" +
  "1,9,11,13,15,17,19,21,23,25,27,29,31,33,35,41,53,55,79,81,85,87,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,133,135,137,139,141,143,145;" +
  "4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,40,42,44,46,54,76,78,80,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,132,134,136,138,140,142,144,146;" +
  "9,17,19,21,23,25,27,29,31,33,35,41,43,45,47,71,73,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,139,141;" +
  "0,4,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,70,72,74,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,132,140;" +
  "21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,73,77,79,81,83,85,87,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127,129,131,139;" +
  "22,24,26,28,30,32,34,36,38,40,42,44,46,48,76,78,80,82,84,90,92,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,134,136;" +
  "23,25,27,29,31,33,35,37,39,41,43,71,73,75,77,81,83,85,87,89,91,93,97,99,101,103,105,107,109,111,113,115,117,119,121,123,125,127;" +
  "24,26,28,30,32,34,36,38,40,72,74,76,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,126,130,132;" +
  "25,27,29,31,33,35,37,39,71,73,75,77,79,83,89,91,93,95,97,99,101,103,105,107,109,111,113,115,117,119,121,123,129;" +
  "26,28,30,32,40,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124;" +
  "29,31,41,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,103,105,107,109,111,113,115,117,119,121,123;" +
  "8,30,32,36,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,104,106,108,112,114,116,118;" +
  "33,35,37,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,105,107,115,117;" +
  "38,44,48,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,106,112,116,118,124,126;" +
  "41,43,45,47,49,69,71,73,75,77,79,81,83,85,87,89,91,93,125;" +
  "42,44,46,48,50,52,78,80,82,84,86,88,90,92,114,116,120,122;" +
  "35,41,43,45,47,49,51,53,79,81,83,85,87,89,91,115,117,119,121,123,125,127,135;" +
  "40,42,44,46,48,50,52,54,56,58,78,80,82,84,86,88,90,122,124,126,130,132,134,136,138;" +
  "41,43,45,47,49,51,53,55,57,79,81,83,85,87,89,121,123,125,131,133,139,141;" +
  "42,44,46,48,50,52,54,56,80,82,84,86,88,90,128,130;" +
  "45,47,49,51,53,55,57,79,81,83,85,87,89,93,125,127,129,131,133,147;" +
  "44,46,48,50,52,54,56,80,82,84,86,88,92,96,98,122,124,126,128,130,132,134,136,142;" +
  "45,47,49,51,53,81,83,85,87,121,123,125,127,129,131,133,135,137;" +
  "44,46,48,50,52,82,84,86,122,124,126,128,130,132,134,136;" +
  "45,47,49,51,83,123,131,133,135;" +
  "44,46,48,134;" +
  "43,45,145;" +
  "42,44,144;" +
  "43,45,49;" +
  "44,58";

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
