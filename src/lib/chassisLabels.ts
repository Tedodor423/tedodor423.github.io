import type { DeliveryChassis } from '@/lib/api/types';

export const CHASSIS_LABELS: Record<DeliveryChassis, string> = {
  'ecoli-ht115': 'E. coli HT115 (L4440)',
  'hairpin-cassette': 'hairpin cassette',
  'snodgrassella-alvi': 'engineered S. alvi',
  's-cerevisiae': 'S. cerevisiae',
};
