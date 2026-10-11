// Turn an edited world-hexes.svg back into the two data files.
//
//   node tools/hexmap/import-svg.mjs [path/to/world-hexes.svg]
//
// Rules (also written at the top of the SVG itself):
//   * every <polygon> is a cell; it is LAND when its fill is not "none"
//   * the cell is located by the polygon's centre, snapped to the lattice,
//     so an editor renaming a duplicated polygon does not matter
//   * data-country names the country; a polygon without one takes the
//     country of the nearest land polygon that has one, with a warning
// Nothing else in the SVG is read. No download, no network.
import fs from "node:fs";
import path from "node:path";
import * as H from "./lib.mjs";

const inPath = process.argv[2] ?? H.DEFAULT_SVG;
const svg = fs.readFileSync(inPath, "utf8");
const lat = H.readLattice();

const warn = (...a) => console.error("warning:", ...a);

if (/<g\b[^>]*\btransform=/.test(svg)) warn("a <g> carries a transform; group transforms are ignored, only polygon transforms count");

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`));
  return m ? (m[2] ?? m[3]) : undefined;
};
const unescape = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

function fillOf(tag) {
  const style = attr(tag, "style");
  const inStyle = style?.match(/(?:^|;)\s*fill\s*:\s*([^;]+)/);
  const fill = (inStyle ? inStyle[1] : attr(tag, "fill")) ?? "black";
  return fill.trim().toLowerCase();
}

function centreOf(tag) {
  const nums = (attr(tag, "points") ?? "").match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)?.map(Number) ?? [];
  if (nums.length < 6) return null;
  let sx = 0, sy = 0, n = 0;
  for (let i = 0; i + 1 < nums.length; i += 2) (sx += nums[i]), (sy += nums[i + 1]), n++;
  let [cx, cy] = [sx / n, sy / n];
  const t = attr(tag, "transform");
  if (t) {
    const tr = t.match(/translate\(\s*(-?[\d.]+)[\s,]*(-?[\d.]+)?\s*\)/);
    const mx = t.match(/matrix\(\s*(-?[\d.]+)[\s,]+(-?[\d.]+)[\s,]+(-?[\d.]+)[\s,]+(-?[\d.]+)[\s,]+(-?[\d.]+)[\s,]+(-?[\d.]+)\s*\)/);
    if (tr) (cx += Number(tr[1])), (cy += Number(tr[2] ?? 0));
    else if (mx) {
      const [a, b, c, d, e, f] = mx.slice(1).map(Number);
      [cx, cy] = [a * cx + c * cy + e, b * cx + d * cy + f];
    } else warn(`unsupported transform ignored: ${t}`);
  }
  return [cx, cy];
}

/** Nearest lattice position to a point, honouring the row parity. */
function snap(cx, cy) {
  const row = Math.max(0, Math.min(lat.nRows - 1, Math.round((cy - lat.ORIGIN_Y) / lat.ROW_H)));
  const colRaw = (cx - lat.ORIGIN_X) / lat.COL_W;
  let col = Math.round(colRaw);
  if (!H.isLatticePosition(col, row)) col = colRaw > col ? col + 1 : col - 1;
  col = Math.max(0, Math.min(lat.nCols - 1, col));
  const [x, y] = H.cellXY(lat, col, row);
  return { col, row, off: Math.hypot(x - cx, y - cy) };
}

const land = new Map(); // key -> {col,row,country|null}
let polygons = 0, seaPolys = 0;
for (const [tag] of svg.matchAll(/<polygon\b[^>]*>/g)) {
  polygons++;
  const c = centreOf(tag);
  if (!c) continue;
  if (fillOf(tag) === "none") {
    seaPolys++;
    continue;
  }
  const { col, row, off } = snap(...c);
  const k = H.key(col, row);
  if (off > lat.HEX_R * 0.6) warn(`polygon ${attr(tag, "id") ?? "(no id)"} sits ${off.toFixed(1)} units off the lattice; snapped to ${k}`);
  const country = attr(tag, "data-country");
  if (land.has(k)) {
    warn(`two land polygons at ${k}; keeping the first`);
    continue;
  }
  land.set(k, { col, row, country: country ? unescape(country) : null });
}

// Fill in missing countries from the nearest land polygon that has one.
const named = [...land.values()].filter((c) => c.country);
for (const c of land.values()) {
  if (c.country) continue;
  const [x, y] = H.cellXY(lat, c.col, c.row);
  let best = null;
  for (const o of named) {
    const [ox, oy] = H.cellXY(lat, o.col, o.row);
    const d = Math.hypot(ox - x, oy - y);
    if (!best || d < best.d) best = { d, country: o.country };
  }
  c.country = best?.country ?? "Unknown";
  warn(`cell ${c.col}.${c.row} has no data-country; took "${c.country}" from its nearest named cell`);
}

const cells = [...land.values()].sort((a, b) => a.row - b.row || a.col - b.col);
const countries = new Map(cells.map((c) => [H.key(c.col, c.row), c.country]));

// What changes against the files as they are now.
const before = new Set(lat.cells.map((c) => H.key(c.col, c.row)));
const after = new Set(countries.keys());
const added = [...after].filter((k) => !before.has(k));
const removed = [...before].filter((k) => !after.has(k));
const renamed = [...after].filter((k) => before.has(k) && lat.countries.get(k) !== countries.get(k));

H.writeLattice(cells);
H.writeCountries(countries);

console.log(`read ${polygons} polygons (${seaPolys} unfilled) from ${path.relative(H.ROOT, inPath)}`);
console.log(`wrote ${cells.length} land cells, ${new Set(countries.values()).size} countries`);
console.log(`  added ${added.length}: ${added.join(" ")}`);
console.log(`  removed ${removed.length}: ${removed.join(" ")}`);
console.log(`  country changed ${renamed.length}: ${renamed.map((k) => `${k} ${lat.countries.get(k)} -> ${countries.get(k)}`).join("; ")}`);
