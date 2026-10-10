/* The pictures on the sustainability page: the goal tiles, the overview of all
 * seventeen, and the face of the stakeholder each goal is argued with.
 *
 * The words stay in src/content/sustainability.md. This file only says which
 * picture goes with which `## Goal N` section, so the page can be edited
 * without touching code.
 *
 * Images are not in the repo. The sources are in the gitignored
 * wiki-assets-source/images_dev/sdg/, which the dev server answers at
 * <base>/images-dev/sdg/ (the images-dev plugin in vite.config.ts). The
 * published site loads them from static.igem.wiki under assets/sdg/, where
 * the uploads tool keeps the basename and converts to .avif, so the URL is
 * knowable before the upload. Until then the published page shows a
 * silhouette in place of a face and no tile.
 *
 * TEMPORARY FALLBACK, as for the stakeholder photos. A published build that
 * cannot load the static.igem.wiki image tries the original in the
 * gitignored public/local/sdg/, which the GitHub Pages preview fills from
 * wiki-assets-source/images_dev/sdg/ and the wiki's own CI never has. Once
 * the static.igem.wiki URLs answer, drop sdgLocal and useSdgImage's second
 * try.
 */

import { useState } from "react";

const PUBLISHED = "https://static.igem.wiki/teams/6391/wiki/assets/sdg/";

export function sdgImage(basename: string): string {
  return import.meta.env.DEV
    ? `${import.meta.env.BASE_URL}images-dev/sdg/${basename}.png`
    : `${PUBLISHED}${basename}.avif`;
}

function sdgLocal(basename: string): string | null {
  if (import.meta.env.DEV) return null;
  return `${import.meta.env.BASE_URL}local/sdg/${basename}.png`;
}

/** The image's current source, the handler for its onError, and whether
 *  every source has failed. */
export function useSdgImage(basename: string) {
  const [misses, setMisses] = useState(0);
  const sources = [sdgImage(basename), sdgLocal(basename)].filter(
    (s): s is string => s !== null,
  );
  return {
    src: sources[misses],
    failed: misses >= sources.length,
    onError: () => setMisses((m) => m + 1),
  };
}

export interface SdgStakeholder {
  name: string;
  /** Basename in images_dev/sdg/. Omitted: the silhouette is drawn. */
  photo?: string;
  /** Where the face sits in a landscape photo, as CSS object-position. */
  focus?: string;
  /** Enlarges the photo about `focus`, for a face that is small in frame. */
  zoom?: number;
}

export interface SdgGoal {
  /** The goal tile, a basename in images_dev/sdg/. */
  tile: string;
  /** Omitted while a stakeholder cannot be named on the page. */
  stakeholder?: SdgStakeholder;
}

/** Keyed by goal number: a `## Goal 15 ...` section takes entry 15. */
export const SDG_GOALS: Record<number, SdgGoal> = {
  15: {
    tile: "sdg15",
    stakeholder: {
      name: "Austein McLoughlin",
      photo: "austein-mcloughlin",
      focus: "50% 25%",
      zoom: 1.6,
    },
  },
  2: {
    tile: "sdg2",
    // No photo in images_dev/sdg/ yet.
    stakeholder: { name: "Melanie Teece" },
  },
  17: {
    tile: "sdg17",
    stakeholder: { name: "Michael Morrison", photo: "michael-morrison" },
  },
};

/** The overview of all seventeen goals, placed by the `sdg-overview` slot. */
export const SDG_OVERVIEW = "sdgs";
