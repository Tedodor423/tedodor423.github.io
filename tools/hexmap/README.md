# The hexagon world map

The map behind the stakeholder map and the colony-loss map is a lattice of
pointy-top hexagons. Two files in `src/utils/` hold it:

- `worldHexes.ts`: which lattice positions are land, and the projection that
  turns longitude and latitude into map units.
- `hexCountries.ts`: the country each land cell carries.

Neither is hand-typed. Edit the map as a picture and let the scripts here write
the files.

## Edit it

```sh
node tools/hexmap/export-svg.mjs      # writes wiki-assets-source/images_dev/world-hexes.svg
# open the SVG in Inkscape (or any editor), change it, save
node tools/hexmap/import-svg.mjs      # writes the two files in src/utils
```

In the SVG every hexagon is a `<polygon>`:

- A cell is land when its fill is not `none`. Delete a polygon, or set its fill
  to none, to remove a cell. Give one of the faint grid cells any fill to add it.
- Cells are located by position, not by id, so duplicating a grid cell into the
  land layer works even when the editor renames it. Do not move a polygon off
  its lattice position.
- `data-country` names the country the cell carries. Grid cells carry one too
  (the country holding most of the land under them, or the nearest country at
  sea), so a cell you add already knows its country. Edit the attribute to
  change it; use the Natural Earth name, as `src/data/varroa.ts` does.

The coast, graticule, cell-id and country-name layers are for reference and are
not read back. The export also prints where the lattice disagrees with the real
coastline: cells with no land under them, cells with under 10 % land, empty
positions that are at least half land, and cells whose country is not the one
holding most of their land.

## Where it came from

The lattice started as an 872-hexagon stylised drawing
(`wiki-assets-source/images_dev/world.svg`). On 10 October 2026 it was checked
against the Natural Earth 50 m coastline (the `world-atlas@2` build) and
corrected:

- The projection was refitted by maximising land overlap over every cell of the
  drawing (plate carrée, longitude shifted 1.1°, top edge 85.9° N, slightly
  different scales on the two axes). The constants are in `worldHexes.ts`.
- Every cell's country was reassigned to the one holding most of the land under
  it; cells with no land take the nearest country. California is the US cells
  whose land is mostly inside the state border.
- 69 cells that are at least 40 % land were added (interior France, Alaska, the
  Canadian Arctic coast, Iceland, Sydney and Brisbane, the North Island of New
  Zealand, Sri Lanka, Cuba among them), and 17 cells with little or no land were
  removed (a cell in open sea off Scotland, the Baltic, the Bahamas bank, a
  "Fiji" cell 3.6° from Fiji). New Zealand was redrawn on the real islands, and
  Corsica and Sardinia were kept by hand.

Cells under 10 % land are left in on purpose where they stand for real
islands (Hawaii, the Canaries, the Galápagos, the Aleutians, the Falklands);
the export marks them amber so the choice stays visible.

The scripts need Node 22 and nothing else. The first export downloads two
files from `cdn.jsdelivr.net/npm/world-atlas@2/` into `wiki-assets-source/geo/`
(gitignored). Nothing here runs at build time or in the browser.
