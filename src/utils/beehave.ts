/* Shared vocabulary for the three BEEHAVE figures on the ecological-modelling
 * page: what the regimens and hive profiles are called, the order they are
 * listed in, and how their numbers are printed. The data itself is
 * src/data/beehave.ts, which is generated; nothing here changes a value. */

import type { Regimen } from "../data/beehave";

/** Listed in this order everywhere, as on the page. */
export const REGIMENS: Regimen[] = ["year", "winter", "fall"];

export const REGIMEN_META: Record<
  Regimen,
  { name: string; window: string; color: string }
> = {
  year: {
    name: "Year-round",
    window: "day 1, 365 days",
    color: "var(--regimen-year)",
  },
  winter: {
    name: "Winter",
    window: "day 1, 89 days",
    color: "var(--regimen-winter)",
  },
  fall: {
    name: "Fall",
    window: "day 182, 122 days",
    color: "var(--regimen-fall)",
  },
};

export const PROFILE_NAME = {
  nd: "North Dakota commercial",
  ca: "California commercial",
  auc: "Australia commercial",
} as const;

export type ProfileKey = keyof typeof PROFILE_NAME;

const GROUPED = new Intl.NumberFormat("en-GB");

/** 1750 -> "1,750"; counts and yeast amounts. */
export function fmtInt(n: number): string {
  return GROUPED.format(Math.round(n));
}

/** A concentration or efficiency exactly as the sweep wrote it. */
export function fmtLevel(n: number): string {
  return String(n);
}

/** Honey in kg, one decimal. */
export function fmtKg(n: number): string {
  return `${n.toFixed(1)} kg`;
}

/** A share as a whole percentage. */
export function fmtPct(share: number): string {
  return `${Math.round(share * 100)}%`;
}

/** "collapsed at the end of year 2", or that it lasted the run. */
export function fmtFate(collapseYear: number | null, years = 5): string {
  return collapseYear === null
    ? `survived all ${years} years`
    : `collapsed at the end of year ${collapseYear}`;
}

/** Which honey-kept band a share falls in, 1 (worst) to 5 (90% and up). */
export function keptBand(share: number): 1 | 2 | 3 | 4 | 5 {
  if (share >= 0.9) return 5;
  if (share >= 0.75) return 4;
  if (share >= 0.5) return 3;
  if (share >= 0.25) return 2;
  return 1;
}

export const KEPT_BANDS: { band: 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { band: 5, label: "90% and up" },
  { band: 4, label: "75 to 90%" },
  { band: 3, label: "50 to 75%" },
  { band: 2, label: "25 to 50%" },
  { band: 1, label: "under 25%" },
];
