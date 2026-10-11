// Shared code for the hexagon world map tools. Node 22, no dependencies.
//
// The lattice itself lives in src/utils/worldHexes.ts (cell positions and the
// projection) and src/utils/hexCountries.ts (the country behind each cell).
// This file reads and writes those two files, and knows how to compare a cell
// with the real coastline (Natural Earth, via the world-atlas@2 package,
// downloaded once into wiki-assets-source/geo/, which is gitignored).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const GEO_DIR = path.join(ROOT, "wiki-assets-source", "geo");
export const WORLD_HEXES = path.join(ROOT, "src", "utils", "worldHexes.ts");
export const HEX_COUNTRIES = path.join(ROOT, "src", "utils", "hexCountries.ts");
export const DEFAULT_SVG = path.join(ROOT, "wiki-assets-source", "images_dev", "world-hexes.svg");

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/";

// ---- the lattice, as the wiki has it ------------------------------------

const CONSTANTS = ["ORIGIN_X", "ORIGIN_Y", "COL_W", "ROW_H", "HEX_R", "MAP_W", "MAP_H", "DEG_X", "DEG_Y", "LON_SHIFT", "LAT_TOP"];

function constant(src, name) {
  const m = src.match(new RegExp(`export const ${name} = (-?[\\d.]+);`));
  if (!m) throw new Error(`${name} not found in worldHexes.ts`);
  return Number(m[1]);
}

export const key = (col, row) => `${col}.${row}`;

/** Everything the two data files say, plus the derived lattice extent. */
export function readLattice() {
  const src = fs.readFileSync(WORLD_HEXES, "utf8");
  const k = Object.fromEntries(CONSTANTS.map((n) => [n, constant(src, n)]));
  const m = src.match(/const PACKED =([\s\S]*?);\r?\n/);
  if (!m) throw new Error("PACKED not found in worldHexes.ts");
  const packed = [...m[1].matchAll(/"([^"]*)"/g)].map((x) => x[1]).join("");
  const cells = [];
  packed.split(";").forEach((line, row) => {
    if (line) for (const c of line.split(",")) cells.push({ col: Number(c), row });
  });
  const nRows = Math.floor((k.MAP_H - k.ORIGIN_Y) / k.ROW_H) + 1;
  const nCols = Math.floor((k.MAP_W - k.ORIGIN_X) / k.COL_W) + 1;
  return { ...k, nRows, nCols, cells, countries: readCountries() };
}

/** Cell key -> country name, from hexCountries.ts. */
export function readCountries() {
  const src = fs.readFileSync(HEX_COUNTRIES, "utf8");
  const m = src.match(/const PACKED: Record<string, string> = \{([\s\S]*?)\r?\n\};/);
  if (!m) throw new Error("PACKED not found in hexCountries.ts");
  const map = new Map();
  for (const [, name, cells] of m[1].matchAll(/"((?:[^"\\]|\\.)*)":\s*"([^"]*)"/g))
    for (const k of cells.split(" ")) if (k) map.set(k, JSON.parse(`"${name}"`));
  return map;
}

/** Even rows hold odd columns and odd rows even ones: see worldHexes.ts. */
export const isLatticePosition = (col, row) => (col + row) % 2 === 1;

export function allPositions(lat) {
  const out = [];
  for (let row = 0; row < lat.nRows; row++)
    for (let col = (row + 1) % 2; col < lat.nCols; col += 2) out.push({ col, row });
  return out;
}

export const cellXY = (lat, col, row) => [lat.ORIGIN_X + lat.COL_W * col, lat.ORIGIN_Y + lat.ROW_H * row];

/** The six lattice neighbours of a cell. */
export const neighbours = (col, row) => [
  [col - 2, row], [col + 2, row], [col - 1, row - 1], [col + 1, row - 1], [col - 1, row + 1], [col + 1, row + 1],
];

export function projection(lat) {
  return {
    toLonLat: (x, y) => [x / lat.DEG_X - 180 + lat.LON_SHIFT, lat.LAT_TOP - y / lat.DEG_Y],
    toXY: (lon, lat_) => [(lon + 180 - lat.LON_SHIFT) * lat.DEG_X, (lat.LAT_TOP - lat_) * lat.DEG_Y],
  };
}

/** Points string of a pointy-top hexagon, as worldHexes.ts draws it. */
export function hexPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 90);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

// ---- writing the two files back ---------------------------------------------

const eolOf = (src) => (src.includes("\r\n") ? "\r\n" : "\n");

/** Replace PACKED in worldHexes.ts. cells: [{col,row}]. Everything else in the file is kept. */
export function writeLattice(cells) {
  const src = fs.readFileSync(WORLD_HEXES, "utf8");
  const EOL = eolOf(src);
  const rows = [];
  for (const c of cells) (rows[c.row] ??= []).push(c.col);
  const nRows = rows.length;
  const lines = [];
  for (let r = 0; r < nRows; r++) {
    const cols = (rows[r] ?? []).sort((a, b) => a - b).join(",");
    lines.push(`  "${cols}${r < nRows - 1 ? ";" : ""}"`);
  }
  const packed = `const PACKED =${EOL}${lines.join(` +${EOL}`)};${EOL}`;
  const out = src.replace(/const PACKED =[\s\S]*?;\r?\n/, packed);
  fs.writeFileSync(WORLD_HEXES, out);
}

/** Replace PACKED in hexCountries.ts. cellCountry: Map<"col.row", name>. */
export function writeCountries(cellCountry) {
  const src = fs.readFileSync(HEX_COUNTRIES, "utf8");
  const EOL = eolOf(src);
  const by = new Map();
  for (const [k, name] of cellCountry) {
    if (!by.has(name)) by.set(name, []);
    by.get(name).push(k);
  }
  const rowCol = (k) => k.split(".").map(Number).reverse();
  const byRowThenCol = (a, b) => {
    const [ra, ca] = rowCol(a);
    const [rb, cb] = rowCol(b);
    return ra - rb || ca - cb;
  };
  const names = [...by.keys()].sort((a, b) => a.localeCompare(b, "en"));
  const body = names.map((n) => `  ${JSON.stringify(n)}: ${JSON.stringify(by.get(n).sort(byRowThenCol).join(" "))},`).join(EOL);
  const out = src.replace(
    /const PACKED: Record<string, string> = \{[\s\S]*?\r?\n\};/,
    `const PACKED: Record<string, string> = {${EOL}${body}${EOL}};`,
  );
  fs.writeFileSync(HEX_COUNTRIES, out);
}

// ---- Natural Earth, through world-atlas ------------------------------------

export async function ensureGeo(file) {
  const p = path.join(GEO_DIR, file);
  if (fs.existsSync(p)) return p;
  fs.mkdirSync(GEO_DIR, { recursive: true });
  const url = GEO_URL + file;
  console.error(`downloading ${url} -> ${path.relative(ROOT, p)}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  fs.writeFileSync(p, Buffer.from(await res.arrayBuffer()));
  return p;
}

/** TopoJSON -> [{name, polys:[[ring,...],...]}], rings as [lon,lat] arrays. */
export function decodeTopo(topo, objName) {
  const { scale, translate } = topo.transform;
  const arcs = topo.arcs.map((arc) => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });
  const ring = (idx) => {
    const out = [];
    for (const i of idx) {
      let a = i < 0 ? arcs[~i].slice().reverse() : arcs[i];
      if (out.length) a = a.slice(1);
      out.push(...a);
    }
    return out;
  };
  const obj = topo.objects[objName];
  return (obj.geometries ?? [obj]).map((g) => ({
    name: g.properties?.name ?? "",
    polys: g.type === "Polygon" ? [g.arcs.map(ring)] : g.type === "MultiPolygon" ? g.arcs.map((p) => p.map(ring)) : [],
  }));
}

export async function loadCountries(res) {
  const topo = JSON.parse(fs.readFileSync(await ensureGeo(`countries-${res}.json`), "utf8"));
  const geoms = decodeTopo(topo, "countries");
  // world-atlas@2 predates the rename; the dataset uses the current name.
  for (const g of geoms) if (g.name === "Macedonia") g.name = "North Macedonia";
  return geoms;
}

// ---- a lon/lat raster of country indices ------------------------------------

export const RES = 10; // pixels per degree
export const LAT_MAX = 84;
export const LAT_MIN = -62;
export const RW = 360 * RES;
export const RH = (LAT_MAX - LAT_MIN) * RES;

export function pixelOf(lon, lat) {
  let i = Math.floor((lon + 180) * RES);
  i = ((i % RW) + RW) % RW;
  const j = Math.floor((LAT_MAX - lat) * RES);
  return j < 0 || j >= RH ? -1 : j * RW + i;
}

/* Edges of a ring. A ring that jumps across the antimeridian is cut at +-180
 * and closed with rays down x = +-180; a pair of rays cancels under even-odd,
 * so what remains is exactly the closing edge each half needs. */
function edgesOf(ring) {
  const out = [];
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % n];
    if (Math.abs(x2 - x1) > 180) {
      const s = Math.sign(x1) || 1;
      const x2u = x2 + 360 * s;
      const t = Math.abs(x2u - x1) < 1e-9 ? 0 : (s * 180 - x1) / (x2u - x1);
      const ym = y1 + t * (y2 - y1);
      out.push([x1, y1, s * 180, ym], [-s * 180, ym, x2, y2], [180, ym, 180, -1000], [-180, ym, -180, -1000]);
    } else out.push([x1, y1, x2, y2]);
  }
  return out;
}

/** Uint16 raster: 0 is sea, k+1 is geoms[k]. Even-odd scanline fill per geometry. */
export function rasterize(geoms) {
  const grid = new Uint16Array(RW * RH);
  geoms.forEach((g, gi) => {
    const rowsX = new Map();
    for (const poly of g.polys)
      for (const ring of poly)
        for (const [x1, y1, x2, y2] of edgesOf(ring)) {
          if (y1 === y2) continue;
          const ymin = Math.min(y1, y2);
          const ymax = Math.max(y1, y2);
          const jStart = Math.max(0, Math.ceil((LAT_MAX - ymax) * RES - 0.5));
          const jEnd = Math.min(RH - 1, Math.floor((LAT_MAX - ymin) * RES - 0.5));
          for (let j = jStart; j <= jEnd; j++) {
            const lat = LAT_MAX - (j + 0.5) / RES;
            if (lat < ymin || lat >= ymax) continue;
            const x = x1 + ((lat - y1) * (x2 - x1)) / (y2 - y1);
            if (!rowsX.has(j)) rowsX.set(j, []);
            rowsX.get(j).push(x);
          }
        }
    for (const [j, xs] of rowsX) {
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const iStart = Math.max(0, Math.ceil((xs[k] + 180) * RES - 0.5));
        const iEnd = Math.min(RW - 1, Math.floor((xs[k + 1] + 180) * RES - 0.5));
        for (let i = iStart; i <= iEnd; i++) grid[j * RW + i] = gi + 1;
      }
    }
  });
  return grid;
}

/** For every pixel, the value of the nearest land pixel (4-neighbour BFS, longitude wraps). */
export function nearestFill(grid) {
  const out = new Uint16Array(grid);
  const dist = new Int32Array(RW * RH).fill(-1);
  const queue = new Int32Array(RW * RH);
  let head = 0, tail = 0;
  for (let p = 0; p < grid.length; p++)
    if (grid[p]) {
      dist[p] = 0;
      queue[tail++] = p;
    }
  while (head < tail) {
    const p = queue[head++];
    const j = (p / RW) | 0;
    const i = p - j * RW;
    const d = dist[p] + 1;
    for (const q of [j > 0 ? p - RW : -1, j < RH - 1 ? p + RW : -1, j * RW + ((i + 1) % RW), j * RW + ((i - 1 + RW) % RW)]) {
      if (q < 0 || dist[q] >= 0) continue;
      dist[q] = d;
      out[q] = out[p];
      queue[tail++] = q;
    }
  }
  return { nearest: out, dist };
}

// ---- sampling a cell ------------------------------------------------------------

/** Offsets covering a pointy-top hexagon of circumradius r, on a grid of `step` map units. */
export function hexOffsets(r, step) {
  const out = [];
  const h = (r * Math.sqrt(3)) / 2;
  for (let y = -r; y <= r; y += step)
    for (let x = -h; x <= h; x += step)
      if (Math.abs(y) <= r - Math.abs(x) / Math.sqrt(3)) out.push([x, y]);
  return out;
}

/** Build the per-cell geography for every lattice position. */
export async function surveyLattice(lat) {
  const countries = await loadCountries("50m");
  const grid = rasterize(countries);
  const { nearest, dist } = nearestFill(grid);
  const nameOf = (v) => (v ? countries[v - 1].name : "");
  const proj = projection(lat);
  // The full lattice cell (pitch / sqrt 3), not the slightly smaller drawn hexagon.
  const pitch = lat.COL_W * 2;
  const offsets = hexOffsets(pitch / Math.sqrt(3), 0.8);
  const present = new Set(lat.cells.map((c) => key(c.col, c.row)));
  const out = [];
  for (const { col, row } of allPositions(lat)) {
    const [cx, cy] = cellXY(lat, col, row);
    const counts = new Map();
    let land = 0;
    for (const [dx, dy] of offsets) {
      const [lon, la] = proj.toLonLat(cx + dx, cy + dy);
      const p = pixelOf(lon, la);
      if (p < 0) continue;
      const v = grid[p];
      if (!v) continue;
      land++;
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
    let maj = 0, majN = 0;
    for (const [v, n] of counts) if (n > majN) (maj = v), (majN = n);
    const [lon, la] = proj.toLonLat(cx, cy);
    const p = pixelOf(lon, la);
    const k = key(col, row);
    out.push({
      col, row, key: k, x: cx, y: cy, lon, lat: la,
      present: present.has(k),
      country: lat.countries.get(k) ?? null,
      f: land / offsets.length,
      majority: nameOf(maj),
      majorityShare: land ? majN / land : 0,
      nearest: p >= 0 ? nameOf(nearest[p]) : "",
      nearestDeg: p >= 0 ? dist[p] / RES : Infinity,
      shares: Object.fromEntries([...counts].map(([v, n]) => [nameOf(v), n / offsets.length])),
    });
  }
  return out;
}

/** Load the coarser countries for drawing. */
export const loadCoast = () => loadCountries("110m");
