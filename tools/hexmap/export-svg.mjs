// Draw the lattice over the real coastline as an SVG you can edit, and report
// where the lattice disagrees with the coastline.
//
//   node tools/hexmap/export-svg.mjs [out.svg]      (default: wiki-assets-source/images_dev/world-hexes.svg)
//
// Needs world-atlas@2's countries-50m.json and countries-110m.json, which it
// downloads once into wiki-assets-source/geo/ (gitignored). Edit the SVG,
// then run import-svg.mjs to write the result back into src/utils.
import fs from "node:fs";
import path from "node:path";
import * as H from "./lib.mjs";

const outPath = process.argv[2] ?? H.DEFAULT_SVG;
const lat = H.readLattice();
const proj = H.projection(lat);
const cells = await H.surveyLattice(lat);
const coast = await H.loadCoast();

// ---- the report ---------------------------------------------------------------
const pct = (f) => `${Math.round(f * 100)}%`;
const present = cells.filter((c) => c.present);
const phantom = present.filter((c) => c.f === 0);
const thin = present.filter((c) => c.f > 0 && c.f < 0.1);
const missing = cells.filter((c) => !c.present && c.f >= 0.5);
const disagree = present.filter((c) => c.country !== "California" && c.majority && c.majority !== c.country && c.majorityShare >= 0.5);
console.log(`${present.length} land cells, ${new Set(present.map((c) => c.country)).size} countries`);
console.log(`cells with no land under them (${phantom.length}): ${phantom.map((c) => `${c.key} ${c.country}`).join(", ") || "none"}`);
console.log(`cells with under 10% land (${thin.length}), islands mostly: ${thin.map((c) => `${c.key} ${c.country} ${pct(c.f)}`).join(", ") || "none"}`);
console.log(`empty positions that are at least half land (${missing.length}): ${missing.map((c) => `${c.key} ${c.majority} ${pct(c.f)}`).join(", ") || "none"}`);
console.log(`cells whose country is not the one holding most of their land (${disagree.length}): ${disagree.map((c) => `${c.key} ${c.country} -> ${c.majority} ${pct(c.majorityShare)}`).join(", ") || "none"}`);

// ---- the drawing ----------------------------------------------------------------
function ringPath(ring, shift) {
  return (
    ring
      .map(([lon, la], i) => {
        const [x, y] = proj.toXY(lon + shift, la);
        return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join("") + "Z"
  );
}
let coastD = "";
for (const g of coast) {
  if (g.name === "Antarctica") continue;
  for (const poly of g.polys)
    for (const ring of poly) {
      let jumps = false;
      for (let i = 1; i < ring.length; i++) if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) jumps = true;
      if (jumps) {
        const unwrapped = ring.map(([lon, la]) => [lon < 0 ? lon + 360 : lon, la]);
        coastD += ringPath(unwrapped, 0) + ringPath(unwrapped, -360);
      } else {
        coastD += ringPath(ring, 0);
        const lons = ring.map((p) => p[0]);
        if (Math.max(...lons) > 170) coastD += ringPath(ring, -360);
        if (Math.min(...lons) < -170) coastD += ringPath(ring, 360);
      }
    }
}

function hue(name) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}
const fillOf = (name) => `hsl(${hue(name)} 55% 72%)`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const pts = (c) => H.hexPoints(c.x, c.y, lat.HEX_R);

let out = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" viewBox="0 0 ${lat.MAP_W} ${lat.MAP_H}" width="${lat.MAP_W}" height="${lat.MAP_H}">
<!--
  HEXAGON WORLD MAP: the editable form of src/utils/worldHexes.ts and
  src/utils/hexCountries.ts. Made by tools/hexmap/export-svg.mjs; read back
  by tools/hexmap/import-svg.mjs, which applies these rules:

    * Every <polygon> is one lattice cell. It is LAND when its fill is not
      "none". Delete a polygon, or set its fill to none, to remove a cell.
      Give a grey grid cell any fill to add it.
    * Cells are located by where they sit, not by id, so duplicating a grid
      cell into the land layer works even if the editor renames it. Do not
      move a polygon off its lattice position.
    * data-country is the country the cell carries. Every cell has one, grid
      cells too: the country holding most of the land under it, or the nearest
      country for open sea. Edit it to change a cell's country. Use the
      Natural Earth name, as src/data/varroa.ts does.
    * The coast, graticule, id and name layers are reference only.

  Strokes: amber = under 10% land (an island, or a stylised coast),
  red = no land at all under the cell. Hover a cell for its numbers.
-->
<rect width="100%" height="100%" fill="#f7f9fb"/>
<g id="coast" inkscape:groupmode="layer" inkscape:label="Real coastline (reference)" sodipodi:insensitive="true">
<path d="${coastD}" fill="#cfd9e2" fill-rule="evenodd" stroke="#4d6a86" stroke-width="0.6"/>
</g>
<g id="graticule" inkscape:groupmode="layer" inkscape:label="Graticule (reference)" sodipodi:insensitive="true" stroke="#9fb0bf" stroke-width="0.5" stroke-dasharray="3 3" font-family="sans-serif" font-size="9" fill="#5a6b7a">
`;
for (let lon = -180; lon <= 180; lon += 30) {
  const [x] = proj.toXY(lon, 0);
  out += `<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${lat.MAP_H}"/><text x="${(x + 2).toFixed(1)}" y="10" stroke="none">${lon}°</text>\n`;
}
for (let la = -60; la <= 80; la += 20) {
  const [, y] = proj.toXY(0, la);
  out += `<line x1="0" y1="${y.toFixed(1)}" x2="${lat.MAP_W}" y2="${y.toFixed(1)}"/><text x="2" y="${(y - 2).toFixed(1)}" stroke="none">${la}°</text>\n`;
}
out += `</g>\n<g id="grid" inkscape:groupmode="layer" inkscape:label="Empty cells (give one a fill to add it)">\n`;
for (const c of cells) {
  if (c.present) continue;
  const country = c.majority || c.nearest;
  out += `<polygon id="c${c.col}r${c.row}" points="${pts(c)}" fill="none" stroke="#c9d1d8" stroke-width="0.5" data-country="${esc(country)}"><title>${esc(`${c.key}: ${country}, ${pct(c.f)} land`)}</title></polygon>\n`;
}
out += `</g>\n<g id="land" inkscape:groupmode="layer" inkscape:label="Land cells (delete to remove)" stroke-linejoin="round">\n`;
for (const c of present) {
  const stroke = c.f === 0 ? "#d62d20" : c.f < 0.1 ? "#d6a200" : "#ffffff";
  const sw = c.f < 0.1 ? 2 : 0.8;
  const note = c.majority && c.majority !== c.country ? `, mostly ${c.majority}` : "";
  out += `<polygon id="c${c.col}r${c.row}" points="${pts(c)}" fill="${fillOf(c.country)}" stroke="${stroke}" stroke-width="${sw}" data-country="${esc(c.country)}"><title>${esc(`${c.key}: ${c.country} (${pct(c.f)} land${note})`)}</title></polygon>\n`;
}
out += `</g>\n<g id="labels" inkscape:groupmode="layer" inkscape:label="Cell ids (reference)" sodipodi:insensitive="true" font-family="sans-serif" font-size="4.6" text-anchor="middle" fill="#334" pointer-events="none">\n`;
for (const c of cells)
  out += `<text x="${c.x.toFixed(1)}" y="${(c.y + 1.6).toFixed(1)}"${c.present ? "" : ' fill="#aab"'}>${c.key}</text>\n`;
out += `</g>\n<g id="names" inkscape:groupmode="layer" inkscape:label="Country names (reference)" sodipodi:insensitive="true" font-family="sans-serif" font-size="8" font-weight="bold" text-anchor="middle" fill="#1d2b3a" stroke="#fff" stroke-width="2" paint-order="stroke" pointer-events="none">\n`;
const groups = new Map();
for (const c of present) (groups.get(c.country) ?? groups.set(c.country, []).get(c.country)).push(c);
for (const [name, cs] of groups) {
  const cx = cs.reduce((a, c) => a + c.x, 0) / cs.length;
  const cy = cs.reduce((a, c) => a + c.y, 0) / cs.length;
  const near = cs.reduce((b, c) => (!b || Math.hypot(c.x - cx, c.y - cy) < Math.hypot(b.x - cx, b.y - cy) ? c : b), null);
  out += `<text x="${near.x.toFixed(1)}" y="${(near.y - 4).toFixed(1)}">${esc(name)}</text>\n`;
}
out += `</g>\n</svg>\n`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out);
console.log(`wrote ${path.relative(H.ROOT, outPath)} (${Math.round(out.length / 1024)} KB)`);
