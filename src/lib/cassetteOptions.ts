import type { DeliveryChassis } from '@/lib/api/types';

// Static reference data: which promoter/terminator systems and selectable
// markers are actually valid in a given chassis. Real domain knowledge, not
// mock-generated — a live backend would need this exact same table, so it
// lives outside lib/api/mock and screens may import it directly.

export interface PromoterSpec {
  id: string;
  label: string;
  terminatorLabel: string;
}

export interface MarkerSpec {
  id: string;
  label: string;
}

export const PROMOTERS_BY_CHASSIS: Record<DeliveryChassis, PromoterSpec[]> = {
  's-cerevisiae': [
    { id: 'gal1', label: 'GAL1 promoter', terminatorLabel: 'CYC1 terminator' },
    { id: 'tef1', label: 'TEF1 promoter', terminatorLabel: 'TEF1 terminator' },
    { id: 'adh1', label: 'ADH1 promoter', terminatorLabel: 'ADH1 terminator' },
  ],
  'ecoli-ht115': [
    { id: 't7', label: 'T7 promoter', terminatorLabel: 'T7 terminator' },
    { id: 't7lac', label: 'T7lac promoter', terminatorLabel: 'T7 terminator' },
  ],
  'snodgrassella-alvi': [
    { id: 'ptrc', label: 'Ptrc promoter', terminatorLabel: 'rrnB T1 terminator' },
    { id: 'plac', label: 'Plac promoter', terminatorLabel: 'rrnB T1 terminator' },
    { id: 'prrnb', label: 'PrrnB promoter', terminatorLabel: 'rrnB T1 terminator' },
  ],
};

export const MARKERS_BY_CHASSIS: Record<DeliveryChassis, MarkerSpec[]> = {
  's-cerevisiae': [
    { id: 'ura3', label: 'URA3' },
    { id: 'leu2', label: 'LEU2' },
    { id: 'his3', label: 'HIS3' },
    { id: 'kanmx', label: 'KanMX (G418R)' },
  ],
  'ecoli-ht115': [
    { id: 'ampr', label: 'AmpR (bla)' },
    { id: 'kanr', label: 'KanR (aph)' },
    { id: 'cmr', label: 'CmR (cat)' },
  ],
  'snodgrassella-alvi': [
    { id: 'specr', label: 'SpecR (aadA)' },
    { id: 'kanr', label: 'KanR (aph)' },
  ],
};

/** Chassis where the construct integrates into the host chromosome rather
 * than replicating as a plasmid — these carry flanking homology arms. */
export const HOMOLOGY_ARM_CHASSIS = new Set<DeliveryChassis>(['s-cerevisiae', 'snodgrassella-alvi']);

export function defaultPromoterId(chassis: DeliveryChassis): string {
  return PROMOTERS_BY_CHASSIS[chassis][0].id;
}

export function defaultMarkerId(chassis: DeliveryChassis): string {
  return MARKERS_BY_CHASSIS[chassis][0].id;
}
