import type { DeliveryChassis } from '@/lib/api/types';

export const CHASSIS_LABELS: Record<DeliveryChassis, string> = {
  's-cerevisiae': 'S. cerevisiae',
  'ecoli-ht115': 'E. coli HT115 (L4440)',
  'snodgrassella-alvi': 'S. alvi',
};

// "E. coli" and "S. cerevisiae/alvi" read as starting with a vowel sound
// ("ee-coli", "ess-cerevisiae"), so they take "an" rather than "a".
export const CHASSIS_ARTICLE: Record<DeliveryChassis, 'a' | 'an'> = {
  's-cerevisiae': 'an',
  'ecoli-ht115': 'an',
  'snodgrassella-alvi': 'an',
};

// Display order across the app — yeast leads.
export const CHASSIS_ORDER: DeliveryChassis[] = ['s-cerevisiae', 'ecoli-ht115', 'snodgrassella-alvi'];
