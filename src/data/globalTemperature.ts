/* Global mean surface temperature, year by year, for the warming chart in
 * the opening of the human practices page (src/components/HpIntro.tsx).
 *
 * NASA GISS Surface Temperature Analysis, version 4 (GISTEMP v4), the
 * "Land-Ocean: Global Means" table, column J-D (the January to December
 * mean). Each value is the difference, in degrees Celsius, from the
 * 1951-1980 average. Copied from GLB.Ts+dSST.csv as downloaded on 11 Oct
 * 2026; nothing was rounded, smoothed or filled. 2026 is left out because
 * its year is not complete in that file. NASA data is in the public domain.
 *
 * To update: download the CSV from TEMPERATURE_SOURCE.data, take the J-D
 * column from 1880, and replace ANOMALIES, ten values to a line.
 */

export const TEMPERATURE_SOURCE = {
  label: "NASA GISS, GISTEMP v4",
  /** The dataset's home page, which the chart's source line links to. */
  url: "https://data.giss.nasa.gov/gistemp/",
  /** The file the numbers come from. */
  data: "https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv",
  baseline: "1951-1980",
};

/** The first year in ANOMALIES. */
export const TEMPERATURE_FROM = 1880;

/** Annual mean anomaly in °C, one per year from TEMPERATURE_FROM. */
export const ANOMALIES: number[] = [
  -0.17, -0.09, -0.11, -0.18, -0.28, -0.33, -0.31, -0.36, -0.18, -0.11,
  -0.36, -0.22, -0.27, -0.31, -0.30, -0.23, -0.11, -0.11, -0.28, -0.18,
  -0.08, -0.16, -0.28, -0.37, -0.47, -0.26, -0.22, -0.38, -0.42, -0.48,
  -0.44, -0.44, -0.37, -0.34, -0.15, -0.14, -0.36, -0.46, -0.30, -0.27,
  -0.27, -0.18, -0.28, -0.26, -0.27, -0.22, -0.11, -0.22, -0.20, -0.36,
  -0.15, -0.09, -0.16, -0.28, -0.13, -0.20, -0.15, -0.03, 0.00, -0.02,
  0.12, 0.18, 0.06, 0.09, 0.20, 0.09, -0.07, -0.03, -0.11, -0.11,
  -0.17, -0.07, 0.01, 0.08, -0.13, -0.14, -0.19, 0.05, 0.06, 0.03,
  -0.02, 0.06, 0.03, 0.05, -0.20, -0.11, -0.06, -0.02, -0.08, 0.05,
  0.03, -0.08, 0.01, 0.16, -0.07, -0.01, -0.10, 0.18, 0.07, 0.16,
  0.26, 0.32, 0.14, 0.31, 0.16, 0.12, 0.18, 0.32, 0.39, 0.27,
  0.45, 0.41, 0.22, 0.23, 0.31, 0.45, 0.33, 0.47, 0.61, 0.38,
  0.39, 0.53, 0.63, 0.62, 0.53, 0.68, 0.64, 0.66, 0.54, 0.66,
  0.72, 0.61, 0.65, 0.67, 0.75, 0.89, 1.01, 0.91, 0.85, 0.98,
  1.01, 0.85, 0.89, 1.17, 1.28, 1.18,
];

/** The last year in ANOMALIES. */
export const TEMPERATURE_TO = TEMPERATURE_FROM + ANOMALIES.length - 1;

/** The anomaly for a year, or null outside the series. */
export function anomalyIn(year: number): number | null {
  return ANOMALIES[year - TEMPERATURE_FROM] ?? null;
}
