import type { Organism, SirnaLength } from '@/lib/api/types';

// Per-pest Dicer-2/Argonaute-2 processing notes driving the siRNA duplex
// length the pipeline tiles at. Not a real biological database — a
// plausible, order-appropriate default per curated target pest, so the
// length disappears as a manual dial and reads as a pipeline decision instead.
const BY_ORGANISM: Record<string, { length: SirnaLength; note: string }> = {
  'org-varroa': {
    length: 21,
    note: 'Varroa Dicer-2 processes long dsRNA into 21 nt duplexes for Argonaute-2/RISC loading.',
  },
  'org-leptinotarsa': {
    length: 21,
    note: 'Coleopteran Dicer-2/Ago2 processing favors 21 nt duplexes — the most RNAi-responsive insect order studied.',
  },
  'org-diabrotica': {
    length: 21,
    note: 'Coleopteran Dicer-2/Ago2 processing favors 21 nt duplexes — the most RNAi-responsive insect order studied.',
  },
  'org-spodoptera': {
    length: 22,
    note: 'Lepidopteran Dicer-2 processing is comparatively less efficient; a 22 nt duplex improves RISC loading stability.',
  },
  'org-plutella': {
    length: 22,
    note: 'Lepidopteran Dicer-2 processing is comparatively less efficient; a 22 nt duplex improves RISC loading stability.',
  },
  'org-bemisia': {
    length: 21,
    note: 'Hemipteran Dicer-2/Ago2 processing is consistent with the 21 nt insect default.',
  },
  'org-myzus': {
    length: 19,
    note: 'Aphid RNAi response is comparatively variable; a shorter 19 nt duplex is the better-supported choice in the literature.',
  },
  'org-halyomorpha': {
    length: 21,
    note: 'Hemipteran Dicer-2/Ago2 processing is consistent with the 21 nt insect default.',
  },
};

const DEFAULT_RESULT = {
  length: 21 as SirnaLength,
  note: 'No target-specific Dicer/Argonaute data — defaulting to the canonical 21 nt Dicer-2 product length.',
};

export function sirnaLengthForOrganism(organism: Organism | null): { length: SirnaLength; note: string } {
  if (!organism) return DEFAULT_RESULT;
  return BY_ORGANISM[organism.id] ?? DEFAULT_RESULT;
}
