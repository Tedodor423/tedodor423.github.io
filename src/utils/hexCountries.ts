/* Which country each hexagon of the world map belongs to.
 *
 * The lattice in worldHexes.ts is 872 land cells with no identity: the
 * stakeholder map only ever needed "is this the nearest cell to a point?".
 * Colouring a country needs the inverse, so this file names every cell.
 *
 * HOW IT WAS BUILT, and how to rebuild it. Each cell centre was converted back
 * to lon/lat with the inverse of the projection documented in worldHexes.ts,
 * then tested against the Natural Earth 110m country polygons (the
 * world-atlas@2 build of them) with a point-in-polygon test. 682 cells fell
 * inside a country. The other 190 did not, because the source SVG is a
 * stylised drawing rather than a projection of the real coastline, so its
 * coastal and island cells sit up to a few degrees off the true border; those
 * were snapped to the country with the nearest polygon edge. No network
 * request happens at runtime or at build time -- the polygons were used once,
 * here, and only the result is committed.
 *
 * KNOWN LIMITS, which the component states on the page rather than hiding:
 *  - A cell spans about 4.7 degrees. 50 countries in the loss dataset are
 *    smaller than that and have no cell at all (Belgium, Switzerland, Denmark,
 *    Israel, Slovakia and so on). They are absent from the map and present in
 *    the table underneath it.
 *  - Iceland is not drawn in the source SVG, so it cannot be shown even though
 *    the dataset lists it as varroa-free.
 *  - A handful of far-offshore cells snapped to the nearest mainland rather
 *    than to their own territory (the Galapagos cell reads as Peru).
 *  - "California" is not a Natural Earth country. It is the three cells below,
 *    down the US west coast, carrying the almond-fleet proxy series that the
 *    dataset defines; see the provenance line the map shows for it.
 *
 * Values are "col.row col.row ..." against the same lattice indices as
 * worldHexes.ts, so a cell here is the cell there.
 */

const PACKED: Record<string, string> = {
  "Afghanistan": "102.11 104.11 101.12",
  "Algeria": "77.10 74.11 76.11 73.12 75.12 77.12 72.13 74.13 76.13 78.13 75.14 77.14",
  "Angola": "80.21 79.22 81.22 83.22 80.23 82.23",
  "Argentina": "46.25 45.26 47.26 49.26 51.26 46.27 48.27 45.28 47.28 49.28 44.29 46.29 48.29 45.30 44.31 45.32",
  "Australia": "131.22 133.22 128.23 130.23 127.24 129.24 131.24 133.24 122.25 124.25 126.25 128.25 130.25 132.25 134.25 136.25 142.25 121.26 123.26 125.26 127.26 129.26 131.26 133.26 135.26 137.26 122.27 124.27 126.27 128.27 130.27 132.27 134.27 136.27 123.28 131.28 133.28 135.28 134.29",
  "Bangladesh": "113.14",
  "Belarus": "87.6",
  "Bolivia": "46.23 48.23 45.24 47.24 49.24",
  "Botswana": "85.24 84.25 86.25",
  "Brazil": "48.19 50.19 52.19 45.20 47.20 49.20 51.20 53.20 44.21 46.21 48.21 50.21 52.21 54.21 56.21 58.21 45.22 47.22 49.22 51.22 53.22 55.22 57.22 50.23 52.23 54.23 56.23 51.24 53.24 55.24 57.24 52.25 54.25 56.25 53.26 52.27",
  "California": "22.9 23.10 24.11",
  "Cambodia": "118.17",
  "Cameroon": "79.18",
  "Canada": "39.0 41.0 26.1 30.1 32.1 34.1 36.1 38.1 40.1 25.2 27.2 29.2 33.2 35.2 37.2 39.2 22.3 26.3 28.3 30.3 34.3 36.3 38.3 44.3 15.4 17.4 19.4 21.4 23.4 25.4 27.4 29.4 31.4 33.4 35.4 41.4 18.5 20.5 22.5 24.5 26.5 28.5 30.5 32.5 34.5 40.5 42.5 44.5 46.5 17.6 19.6 21.6 23.6 25.6 27.6 29.6 31.6 33.6 35.6 41.6 43.6 45.6 47.6 18.7 20.7 22.7 24.7 26.7 28.7 30.7 32.7 34.7 36.7 38.7 40.7 42.7 44.7 46.7 48.7 50.7 39.8 41.8 43.8 47.8 49.8 46.9 48.9",
  "Central African Rep.": "84.17 81.18 83.18 85.18",
  "Colombia": "41.18 43.18 45.18 42.19 44.19 43.20",
  "Congo": "80.19 82.19 81.20 78.21",
  "Costa Rica": "38.17",
  "Côte d'Ivoire": "72.17 73.18",
  "Croatia": "82.9",
  "Cuba": "41.14",
  "Cyprus": "88.11",
  "Czechia": "80.7",
  "Dem. Rep. Congo": "84.19 86.19 83.20 85.20 82.21 84.21 86.21 85.22",
  "Ecuador": "41.20",
  "Egypt": "89.12 86.13 88.13 87.14 89.14",
  "Eq. Guinea": "78.19",
  "Estonia": "84.5 86.5",
  "Ethiopia": "91.16 90.17 92.17 91.18 93.18",
  "Falkland Is.": "49.32 58.33",
  "Fiji": "125.24 147.24 98.25",
  "Finland": "85.4 87.4",
  "France": "73.8 77.8 78.9",
  "Gabon": "79.20",
  "Georgia": "92.9",
  "Germany": "79.6 78.7",
  "Ghana": "74.17",
  "Greece": "83.10 85.10 86.11",
  "Greenland": "43.0 45.0 47.0 49.0 51.0 53.0 55.0 57.0 59.0 61.0 63.0 65.0 44.1 46.1 48.1 50.1 52.1 54.1 56.1 58.1 60.1 62.1 64.1 66.1 51.2 53.2 55.2 57.2 59.2 61.2 63.2 53.4 55.4 54.5",
  "Guatemala": "35.16",
  "Guinea": "68.17 70.17",
  "Guyana": "49.18",
  "Honduras": "37.16",
  "Hungary": "83.8",
  "Chad": "81.14 82.15 84.15 81.16 83.16 82.17",
  "Chile": "44.25 44.27 43.30 42.31 43.32 44.33",
  "China": "126.7 128.7 111.8 113.8 125.8 127.8 129.8 131.8 110.9 112.9 114.9 116.9 118.9 120.9 122.9 124.9 126.9 128.9 107.10 109.10 111.10 113.10 115.10 117.10 119.10 121.10 123.10 125.10 127.10 110.11 112.11 114.11 116.11 118.11 120.11 122.11 126.11 111.12 113.12 115.12 117.12 119.12 121.12 123.12 118.13 120.13 122.13 124.13 117.14 121.14 123.14",
  "India": "106.11 108.11 107.12 109.12 106.13 108.13 110.13 112.13 114.13 105.14 107.14 109.14 111.14 104.15 106.15 108.15 112.15 105.16 107.16 106.17",
  "Indonesia": "114.19 116.19 115.20 117.20 119.20 121.20 123.20 125.20 127.20 122.21 124.21 126.21 130.21 132.21 134.21 121.22 123.22 125.22",
  "Iran": "94.11 96.11 98.11 100.11 97.12 99.12 100.13",
  "Iraq": "92.11 93.12 95.12",
  "Ireland": "71.6 70.7",
  "Italy": "79.8 80.9 81.10",
  "Japan": "139.8 134.9 136.9 130.11 132.11 129.12",
  "Kazakhstan": "103.6 96.7 98.7 100.7 102.7 104.7 106.7 108.7 110.7 97.8 99.8 101.8 103.8 105.8 107.8 109.8 96.9 98.9 104.9",
  "Kenya": "90.19 91.20",
  "Kyrgyzstan": "106.9 108.9",
  "Laos": "118.15",
  "Liberia": "71.18",
  "Libya": "84.11 79.12 83.12 80.13 82.13 84.13 83.14 85.14",
  "Lithuania": "85.6",
  "Madagascar": "93.24 92.25 96.25",
  "Malawi": "89.22",
  "Malaysia": "125.18 120.19 122.19",
  "Mali": "73.14 72.15 74.15 76.15 71.16 73.16",
  "Mauritania": "69.14 71.14 68.15 70.15",
  "Mexico": "25.12 27.12 29.12 26.13 28.13 30.13 32.13 29.14 31.14 30.15 32.15 36.15 33.16",
  "Mongolia": "114.7 118.7 120.7 115.8 117.8 119.8 121.8 123.8",
  "Morocco": "72.11 71.12 66.13 68.13 67.14",
  "Mozambique": "88.23 90.23 89.24 88.25",
  "Myanmar": "116.13 115.14 114.15 116.15 115.16",
  "Namibia": "79.24 81.24 83.24 80.25 82.25 81.26",
  "Netherlands": "77.6",
  "New Zealand": "145.30 144.31",
  "Niger": "79.14 78.15 80.15 75.16 77.16 79.16",
  "Nigeria": "76.17 78.17 80.17 77.18",
  "North Korea": "130.9",
  "North Macedonia": "84.9",
  "Norway": "78.1 80.1 79.4 76.5 78.5",
  "Pakistan": "103.12 105.12 102.13 104.13 103.14",
  "Papua New Guinea": "135.20 136.21 138.21 139.22 141.22",
  "Paraguay": "48.25 50.25",
  "Peru": "35.20 40.21 42.21 41.22 43.22 42.23 44.23",
  "Philippines": "124.17 126.17",
  "Poland": "81.6 83.6 82.7 84.7",
  "Portugal": "71.10",
  "Romania": "85.8",
  "Russia": "97.0 99.0 107.0 111.0 116.1 23.2 97.2 103.2 107.2 109.2 111.2 113.2 115.2 117.2 119.2 121.2 125.2 133.2 40.3 42.3 52.3 54.3 56.3 58.3 60.3 62.3 80.3 82.3 84.3 86.3 94.3 98.3 102.3 104.3 106.3 108.3 110.3 112.3 114.3 116.3 118.3 120.3 122.3 124.3 126.3 128.3 130.3 132.3 134.3 136.3 138.3 140.3 144.3 91.4 93.4 95.4 97.4 99.4 101.4 103.4 105.4 107.4 109.4 111.4 113.4 115.4 117.4 119.4 121.4 123.4 125.4 127.4 129.4 131.4 133.4 135.4 137.4 139.4 141.4 143.4 145.4 88.5 90.5 92.5 94.5 96.5 98.5 100.5 102.5 104.5 106.5 108.5 110.5 112.5 114.5 116.5 118.5 120.5 122.5 124.5 126.5 128.5 130.5 132.5 134.5 136.5 138.5 140.5 142.5 144.5 146.5 89.6 91.6 93.6 95.6 97.6 99.6 101.6 105.6 107.6 109.6 111.6 113.6 115.6 117.6 119.6 121.6 123.6 125.6 127.6 129.6 131.6 139.6 141.6 90.7 92.7 94.7 112.7 116.7 122.7 124.7 130.7 132.7 140.7 91.8 93.8 95.8",
  "Rwanda": "87.20",
  "S. Sudan": "88.17 87.18 89.18",
  "Saudi Arabia": "91.12 90.13 92.13 94.13 96.13 91.14 93.14 95.14 97.14 92.15 94.15",
  "Senegal": "67.16 69.16",
  "Sierra Leone": "69.18",
  "Slovenia": "81.8",
  "Somalia": "96.17 92.19",
  "Somaliland": "94.17",
  "South Africa": "83.26 85.26 87.26 82.27 84.27 86.27 83.28",
  "Spain": "76.9 73.10 75.10",
  "Sri Lanka": "112.17",
  "Sudan": "86.15 88.15 90.15 85.16 87.16 89.16 86.17",
  "Sweden": "81.4 80.5",
  "Syria": "90.11",
  "Tajikistan": "105.10",
  "Tanzania": "89.20 88.21 90.21",
  "Thailand": "117.16 116.17",
  "Togo": "75.18",
  "Turkey": "90.9 87.10 89.10 91.10 93.10",
  "Turkmenistan": "100.9 97.10 99.10 101.10",
  "Uganda": "88.19",
  "Ukraine": "86.7 88.7 87.8 89.8",
  "United Arab Emirates": "98.13",
  "United Kingdom": "73.6 72.7 74.7",
  "United States of America": "6.3 8.3 10.3 12.3 1.4 9.4 11.4 13.4 4.5 6.5 8.5 10.5 12.5 14.5 16.5 9.6 0.7 4.7 21.8 23.8 25.8 27.8 29.8 31.8 33.8 35.8 37.8 45.8 24.9 26.9 28.9 30.9 32.9 34.9 36.9 38.9 40.9 42.9 44.9 25.10 27.10 29.10 31.10 33.10 35.10 37.10 39.10 41.10 43.10 26.11 28.11 30.11 32.11 34.11 36.11 38.11 40.11 31.12 33.12 35.12 37.12 39.12 40.13 8.15",
  "Uruguay": "50.27 51.28",
  "Uzbekistan": "102.9 103.10",
  "Venezuela": "44.17 48.17 47.18 46.19",
  "Vietnam": "119.14",
  "W. Sahara": "70.13",
  "Yemen": "96.15 93.16 95.16",
  "Zambia": "87.22 84.23 86.23",
  "Zimbabwe": "87.24",
};

/** Lattice key for a cell, matching the keys inside PACKED. */
export const cellKey = (col: number, row: number) => `${col}.${row}`;

/** Cell key -> country name, for every one of the 872 land cells. */
export const HEX_COUNTRY: Map<string, string> = new Map(
  Object.entries(PACKED).flatMap(([name, cells]) =>
    cells.split(" ").map((cell) => [cell, name] as [string, string]),
  ),
);

/** Country name -> its cell keys. */
export const COUNTRY_HEXES: Map<string, string[]> = new Map(
  Object.entries(PACKED).map(([name, cells]) => [name, cells.split(" ")]),
);
