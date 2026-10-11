/* Which country each hexagon of the world map belongs to.
 *
 * The lattice in worldHexes.ts is 872 land cells with no identity: the
 * stakeholder map only ever needed "is this the nearest cell to a point?".
 * Colouring a country needs the inverse, so this file names every cell.
 *
 * HOW IT IS BUILT. Each cell carries the country that holds most of the land
 * under it on the Natural Earth 50 m coastline (the world-atlas@2 build),
 * sampled through the projection in worldHexes.ts; a cell with no land under
 * it takes the nearest country. "California" is not a Natural Earth country:
 * it is the United States cells whose land lies mostly inside the state
 * border, carrying the almond-fleet proxy series the dataset defines. Names
 * are Natural Earth's, as src/data/varroa.ts uses them. No network request
 * happens at runtime or at build time: the assignment is made once by
 * tools/hexmap and only the result is committed. To change a cell's country,
 * edit it in the exported SVG and import it back (tools/hexmap/README.md).
 *
 * KNOWN LIMITS, which the component states on the page rather than hiding:
 *  - A cell spans about 4.7 degrees. 47 countries in the loss dataset are
 *    smaller than that and hold no cell (Belgium, Switzerland, Czechia,
 *    Slovakia, Israel and so on). They are absent from the map and present in
 *    the table underneath it.
 *  - The majority rule is applied even where it leaves a country short:
 *    Denmark, Austria and Serbia hold one cell each, and the Netherlands
 *    none, because a large neighbour holds more of every nearby cell.
 *  - Island cells with under 10 % land stand for real islands (Hawaii, the
 *    Canaries, the Galapagos) and carry the country that owns them.
 *
 * Values are "col.row col.row ..." against the same lattice indices as
 * worldHexes.ts, so a cell here is the cell there.
 */

const PACKED: Record<string, string> = {
  "Afghanistan": "102.11 99.12 101.12",
  "Albania": "81.10",
  "Algeria": "73.12 75.12 70.13 72.13 74.13 76.13 73.14 75.14 77.14",
  "Angola": "79.22 81.22 80.23 82.23 81.24",
  "Argentina": "45.26 47.26 44.27 46.27 48.27 45.28 47.28 44.29 46.29 48.29 43.30 45.30 44.31 43.32 45.32",
  "Australia": "128.23 130.23 134.23 125.24 127.24 129.24 131.24 133.24 135.24 122.25 124.25 126.25 128.25 130.25 132.25 134.25 136.25 121.26 123.26 125.26 127.26 129.26 131.26 133.26 135.26 137.26 122.27 124.27 126.27 128.27 130.27 132.27 134.27 136.27 138.27 123.28 125.28 131.28 133.28 135.28 137.28 134.29 136.29",
  "Austria": "79.8",
  "Azerbaijan": "93.10",
  "Bahamas": "41.14",
  "Bangladesh": "111.14",
  "Belarus": "84.7 86.7",
  "Benin": "74.17",
  "Bolivia": "44.23 46.23 45.24 47.24 46.25",
  "Botswana": "82.25 84.25 83.26",
  "Brazil": "52.19 45.20 47.20 49.20 51.20 53.20 44.21 46.21 48.21 50.21 52.21 54.21 56.21 58.21 43.22 45.22 47.22 49.22 51.22 53.22 55.22 57.22 48.23 50.23 52.23 54.23 56.23 49.24 51.24 53.24 55.24 57.24 50.25 52.25 54.25 56.25 51.26 53.26 50.27 52.27 51.28",
  "Burkina Faso": "72.17",
  "California": "21.10 22.11",
  "Cambodia": "118.17",
  "Cameroon": "79.18 78.19",
  "Canada": "35.0 37.0 39.0 41.0 43.0 45.0 26.1 30.1 32.1 34.1 36.1 38.1 40.1 21.2 23.2 25.2 27.2 29.2 31.2 33.2 35.2 37.2 39.2 14.3 16.3 18.3 20.3 22.3 24.3 26.3 28.3 30.3 32.3 34.3 36.3 38.3 40.3 42.3 44.3 15.4 17.4 19.4 21.4 23.4 25.4 27.4 29.4 31.4 33.4 35.4 37.4 41.4 43.4 45.4 14.5 16.5 18.5 20.5 22.5 24.5 26.5 28.5 30.5 32.5 34.5 40.5 42.5 44.5 46.5 17.6 19.6 21.6 23.6 25.6 27.6 29.6 31.6 33.6 35.6 41.6 43.6 45.6 47.6 18.7 20.7 22.7 24.7 26.7 28.7 30.7 32.7 34.7 36.7 38.7 40.7 42.7 44.7 46.7 48.7 50.7 35.8 37.8 39.8 41.8 43.8 45.8 47.8 49.8 38.9 40.9 46.9",
  "Central African Rep.": "81.18 83.18",
  "Chad": "80.15 82.15 81.16 80.17 82.17",
  "Chile": "44.25 43.26 43.28 42.29 42.31 44.33",
  "China": "126.7 123.8 125.8 127.8 108.9 110.9 112.9 122.9 124.9 126.9 128.9 107.10 109.10 111.10 113.10 115.10 117.10 119.10 121.10 123.10 125.10 106.11 108.11 110.11 112.11 114.11 116.11 118.11 120.11 122.11 124.11 107.12 109.12 111.12 113.12 115.12 117.12 119.12 121.12 123.12 110.13 112.13 116.13 118.13 120.13 122.13 124.13 117.14 119.14 121.14 123.14",
  "Colombia": "42.17 41.18 40.19 42.19 44.19 43.20",
  "Congo": "80.19 79.20 78.21",
  "Côte d'Ivoire": "71.18",
  "Croatia": "80.9",
  "Cuba": "40.15",
  "Dem. Rep. Congo": "82.19 84.19 86.19 81.20 83.20 85.20 80.21 82.21 84.21 83.22 85.22",
  "Denmark": "77.6",
  "Ecuador": "39.20 41.20",
  "Egypt": "84.13 86.13 85.14 87.14",
  "Eritrea": "89.16",
  "Ethiopia": "88.17 90.17 89.18 91.18",
  "Finland": "84.3 83.4 85.4 84.5",
  "France": "73.8 75.8 74.9 76.9",
  "Gabon": "77.20",
  "Germany": "76.7 78.7 77.8",
  "Ghana": "73.18",
  "Greece": "83.10 84.11",
  "Greenland": "47.0 49.0 51.0 53.0 55.0 57.0 59.0 61.0 63.0 65.0 44.1 46.1 48.1 50.1 52.1 54.1 56.1 58.1 60.1 62.1 64.1 51.2 53.2 55.2 57.2 59.2 61.2 63.2 52.3 54.3 56.3 58.3 60.3 62.3 51.4 53.4 55.4 54.5",
  "Guatemala": "35.16",
  "Guinea": "68.17",
  "Guinea-Bissau": "66.17",
  "Guyana": "49.18 48.19",
  "Haiti": "42.15",
  "Honduras": "37.16",
  "Hungary": "81.8",
  "Iceland": "65.4",
  "India": "105.12 104.13 106.13 108.13 114.13 103.14 105.14 107.14 109.14 104.15 106.15 108.15 105.16 107.16 106.17",
  "Indonesia": "114.19 115.20 117.20 119.20 121.20 123.20 125.20 118.21 122.21 124.21 130.21 132.21 121.22 123.22 125.22",
  "Iran": "94.11 96.11 98.11 95.12 97.12 96.13 98.13",
  "Iraq": "92.11 91.12 93.12",
  "Ireland": "70.7",
  "Italy": "78.9 77.10",
  "Japan": "134.9 130.11 132.11 129.12",
  "Jordan": "89.12",
  "Kazakhstan": "100.7 102.7 104.7 106.7 95.8 97.8 99.8 101.8 103.8 105.8 107.8 109.8 96.9 100.9 102.9 104.9 106.9",
  "Kenya": "88.19 90.19 89.20",
  "Kyrgyzstan": "105.10",
  "Laos": "116.15",
  "Liberia": "69.18",
  "Libya": "79.12 83.12 78.13 80.13 82.13 79.14 81.14 83.14",
  "Lithuania": "83.6",
  "Madagascar": "93.24 92.25",
  "Malaysia": "116.19 120.19 122.19",
  "Mali": "71.14 72.15 74.15 71.16 73.16 70.17",
  "Mauritania": "69.14 66.15 68.15 70.15 69.16",
  "Mexico": "26.13 28.13 30.13 29.14 31.14 30.15 32.15 36.15 33.16",
  "Mongolia": "111.8 113.8 115.8 117.8 119.8 121.8 114.9 116.9 118.9 120.9",
  "Morocco": "71.12 68.13 67.14",
  "Mozambique": "88.23 90.23 87.24 89.24 88.25 87.26",
  "Myanmar": "113.14 115.14 112.15 114.15",
  "Namibia": "79.24 80.25 81.26",
  "New Zealand": "148.29 147.30 146.31",
  "Nicaragua": "38.17",
  "Niger": "76.15 78.15 75.16 77.16 79.16",
  "Nigeria": "76.17 78.17 75.18 77.18",
  "North Korea": "127.10",
  "Norway": "80.3 76.5 78.5",
  "Oman": "97.14 96.15",
  "Pakistan": "104.11 103.12 100.13 102.13",
  "Panama": "39.18",
  "Papua New Guinea": "134.21 136.21 138.21 133.22",
  "Paraguay": "48.25 49.26",
  "Peru": "40.21 42.21 41.22 42.23 43.24",
  "Poland": "80.7 82.7",
  "Portugal": "69.10",
  "Romania": "84.9",
  "Russia": "116.1 118.1 97.2 103.2 107.2 109.2 111.2 113.2 115.2 117.2 119.2 121.2 123.2 125.2 127.2 133.2 86.3 88.3 94.3 96.3 98.3 100.3 102.3 104.3 106.3 108.3 110.3 112.3 114.3 116.3 118.3 120.3 122.3 124.3 126.3 128.3 130.3 132.3 134.3 136.3 138.3 140.3 142.3 144.3 146.3 148.3 87.4 89.4 91.4 93.4 95.4 97.4 99.4 101.4 103.4 105.4 107.4 109.4 111.4 113.4 115.4 117.4 119.4 121.4 123.4 125.4 127.4 129.4 131.4 133.4 135.4 137.4 139.4 141.4 143.4 145.4 147.4 149.4 86.5 88.5 90.5 92.5 94.5 96.5 98.5 100.5 102.5 104.5 106.5 108.5 110.5 112.5 114.5 116.5 118.5 120.5 122.5 124.5 126.5 128.5 130.5 132.5 134.5 136.5 138.5 140.5 142.5 144.5 146.5 85.6 87.6 89.6 91.6 93.6 95.6 97.6 99.6 101.6 103.6 105.6 107.6 109.6 111.6 113.6 115.6 117.6 119.6 121.6 123.6 125.6 127.6 129.6 131.6 139.6 141.6 88.7 90.7 92.7 94.7 96.7 98.7 108.7 110.7 112.7 114.7 116.7 118.7 120.7 122.7 124.7 128.7 130.7 132.7 140.7 91.8 93.8 129.8 131.8 133.8 90.9 92.9 130.9 136.9",
  "S. Sudan": "85.18 87.18",
  "Saudi Arabia": "88.13 90.13 92.13 94.13 89.14 91.14 93.14 95.14 90.15 92.15 94.15",
  "Senegal": "67.16",
  "Serbia": "82.9",
  "Solomon Is.": "139.22 141.22",
  "Somalia": "93.18 92.19 91.20",
  "South Africa": "85.26 82.27 84.27 86.27 83.28",
  "South Korea": "126.11 128.11",
  "Spain": "71.10 73.10 70.11 72.11 66.13",
  "Sri Lanka": "107.18",
  "Sudan": "84.15 86.15 88.15 83.16 85.16 87.16 84.17 86.17",
  "Suriname": "50.19",
  "Sweden": "82.3 79.4 81.4 80.5 79.6 81.6",
  "Syria": "90.11",
  "Tajikistan": "103.10",
  "Tanzania": "87.20 86.21 88.21 90.21 87.22 89.22",
  "Thailand": "115.16 117.16 116.17",
  "Trinidad and Tobago": "48.17",
  "Tunisia": "77.12",
  "Turkey": "85.10 87.10 89.10 91.10 86.11 88.11",
  "Turkmenistan": "97.10 99.10 100.11",
  "Ukraine": "83.8 85.8 87.8 89.8",
  "United Kingdom": "70.5 72.5 71.6 68.7 72.7",
  "United States of America": "4.3 6.3 8.3 10.3 12.3 5.4 7.4 9.4 11.4 13.4 4.5 6.5 8.5 10.5 12.5 21.8 23.8 25.8 27.8 29.8 31.8 33.8 22.9 24.9 26.9 28.9 30.9 32.9 34.9 36.9 42.9 44.9 23.10 25.10 27.10 29.10 31.10 33.10 35.10 37.10 39.10 41.10 43.10 24.11 26.11 28.11 30.11 32.11 34.11 36.11 38.11 40.11 25.12 27.12 29.12 31.12 33.12 35.12 37.12 39.12 32.13 38.13 8.15",
  "Uruguay": "49.28",
  "Uzbekistan": "98.9 101.10",
  "Venezuela": "44.17 43.18 45.18 47.18 46.19",
  "Vietnam": "118.15 119.16",
  "Yemen": "93.16 95.16",
  "Zambia": "84.23 86.23 83.24",
  "Zimbabwe": "85.24 86.25",
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
