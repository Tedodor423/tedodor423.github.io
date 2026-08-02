// Maps a target pest to the non-target species most worth screening against,
// based on shared habitat/crop system or trophic relationship (predator,
// parasitoid, pollinator, or a standard sentinel for that pest's order).
// Not a real ecological risk assessment — a curated starting panel a user
// would plausibly reach for, given the pest.

const PANEL_BY_ORGANISM: Record<string, string[]> = {
  'org-varroa': ['org-apis', 'org-bombus', 'org-osmia', 'org-nasonia'],
  'org-leptinotarsa': ['org-coccinella', 'org-chrysoperla', 'org-monarch', 'org-apis'],
  'org-diabrotica': ['org-monarch', 'org-apis', 'org-bombus', 'org-coccinella'],
  'org-spodoptera': ['org-monarch', 'org-bombyx', 'org-coccinella', 'org-chrysoperla'],
  'org-plutella': ['org-bombyx', 'org-monarch', 'org-chrysoperla', 'org-coccinella'],
  'org-bemisia': ['org-coccinella', 'org-chrysoperla', 'org-nasonia', 'org-apis'],
  'org-myzus': ['org-coccinella', 'org-chrysoperla', 'org-nasonia', 'org-apis'],
  'org-halyomorpha': ['org-nasonia', 'org-coccinella', 'org-apis', 'org-monarch'],
};

const DEFAULT_PANEL = ['org-apis', 'org-bombus', 'org-monarch', 'org-coccinella'];

/** Species ids worth suggesting for the safety panel, given the selected
 * target organism (or the default panel for a custom/no-organism run). */
export function suggestedSafetySpeciesFor(organismId: string | undefined | null): string[] {
  if (!organismId) return DEFAULT_PANEL;
  return PANEL_BY_ORGANISM[organismId] ?? DEFAULT_PANEL;
}
