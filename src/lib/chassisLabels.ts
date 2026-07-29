import type { DeliveryChassis } from '@/lib/api/types';

export const CHASSIS_LABELS: Record<DeliveryChassis, string> = {
  'ecoli-ht115': 'E. coli HT115 (L4440)',
  'hairpin-cassette': 'hairpin cassette',
  'snodgrassella-alvi': 'engineered S. alvi',
  's-cerevisiae': 'S. cerevisiae',
};

// "E. coli" and "S. cerevisiae/alvi" read as starting with a vowel sound
// ("ee-coli", "ess-cerevisiae"), so they take "an" rather than "a".
export const CHASSIS_ARTICLE: Record<DeliveryChassis, 'a' | 'an'> = {
  'ecoli-ht115': 'an',
  'hairpin-cassette': 'a',
  'snodgrassella-alvi': 'an',
  's-cerevisiae': 'an',
};
