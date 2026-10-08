/* Reference data for the construct builder on /software.
 *
 * This is ordinary domain reference data: which promoters, terminators and
 * selectable markers are valid in each production chassis, which chassis
 * integrate rather than replicate, and the three architectures the construct
 * can take. The same tables a live backend would need.
 *
 * It was the tail of src/data/rnaDesignCatalog.ts, which also held a generated
 * species list, generated transcript counts and pools of gene names for a
 * walkthrough that ran on invented data. That walkthrough is gone: the page now
 * reads the dry lab's real frozen NECTAR outputs through src/utils/nectarData.ts,
 * and only the construct half is kept, fed by a real NECTAR region. The invented
 * material went with it rather than being carried forward.
 */

export type DeliveryChassis =
  | "s-cerevisiae"
  | "ecoli-ht115"
  | "snodgrassella-alvi";

export const CHASSIS_LABELS: Record<DeliveryChassis, string> = {
  "s-cerevisiae": "S. cerevisiae",
  "ecoli-ht115": "E. coli HT115",
  "snodgrassella-alvi": "S. alvi",
};

export const CHASSIS_NOTES: Record<DeliveryChassis, string> = {
  "s-cerevisiae":
    "Our production chassis. Heat-inactivated yeast in a pollen patty is what NECTAR actually delivers.",
  "ecoli-ht115":
    "RNase III deficient, so dsRNA survives. The standard laboratory production host, and our comparison.",
  "snodgrassella-alvi":
    "A bee gut symbiont. The route we started on and abandoned on regulatory advice.",
};

export const CHASSIS_ORDER: DeliveryChassis[] = [
  "s-cerevisiae",
  "ecoli-ht115",
  "snodgrassella-alvi",
];

export interface PromoterSpec {
  id: string;
  label: string;
  terminatorLabel: string;
}

export const PROMOTERS_BY_CHASSIS: Record<DeliveryChassis, PromoterSpec[]> = {
  "s-cerevisiae": [
    { id: "gal1", label: "GAL1 promoter", terminatorLabel: "CYC1 terminator" },
    { id: "tef1", label: "TEF1 promoter", terminatorLabel: "TEF1 terminator" },
    { id: "adh1", label: "ADH1 promoter", terminatorLabel: "ADH1 terminator" },
  ],
  "ecoli-ht115": [
    { id: "t7", label: "T7 promoter", terminatorLabel: "T7 terminator" },
    { id: "t7lac", label: "T7lac promoter", terminatorLabel: "T7 terminator" },
  ],
  "snodgrassella-alvi": [
    {
      id: "ptrc",
      label: "Ptrc promoter",
      terminatorLabel: "rrnB T1 terminator",
    },
    {
      id: "plac",
      label: "Plac promoter",
      terminatorLabel: "rrnB T1 terminator",
    },
    {
      id: "prrnb",
      label: "PrrnB promoter",
      terminatorLabel: "rrnB T1 terminator",
    },
  ],
};

export interface MarkerSpec {
  id: string;
  label: string;
}

export const MARKERS_BY_CHASSIS: Record<DeliveryChassis, MarkerSpec[]> = {
  "s-cerevisiae": [
    { id: "ura3", label: "URA3" },
    { id: "leu2", label: "LEU2" },
    { id: "his3", label: "HIS3" },
    { id: "kanmx", label: "KanMX (G418R)" },
  ],
  "ecoli-ht115": [
    { id: "ampr", label: "AmpR (bla)" },
    { id: "kanr", label: "KanR (aph)" },
    { id: "cmr", label: "CmR (cat)" },
  ],
  "snodgrassella-alvi": [
    { id: "specr", label: "SpecR (aadA)" },
    { id: "kanr", label: "KanR (aph)" },
  ],
};

/** Chassis where the construct integrates into the host chromosome rather than
 * replicating as a plasmid, so it carries flanking homology arms. */
export const HOMOLOGY_ARM_CHASSIS = new Set<DeliveryChassis>([
  "s-cerevisiae",
  "snodgrassella-alvi",
]);

export function defaultPromoterId(chassis: DeliveryChassis): string {
  return PROMOTERS_BY_CHASSIS[chassis][0].id;
}

export function defaultMarkerId(chassis: DeliveryChassis): string {
  return MARKERS_BY_CHASSIS[chassis][0].id;
}

/* ---------- construct architecture ---------- */

export type CassetteTopology = "dumbbell" | "hairpin" | "dual-promoter";

export const TOPOLOGIES: Array<{
  id: CassetteTopology;
  label: string;
  note: string;
}> = [
  {
    id: "dumbbell",
    label: "Loop-ended dumbbell",
    note: "Covalently closed at both ends, no promoter. This is NECTAR's own architecture, and the only one here whose flanks are a short loop rather than a cassette.",
  },
  {
    id: "hairpin",
    label: "Single promoter, hairpin",
    note: "One promoter and a self-annealing loop. The compact shRNA cassette.",
  },
  {
    id: "dual-promoter",
    label: "Dual opposing promoters",
    note: "Both strands transcribed separately. The classic L4440 arrangement.",
  },
];
