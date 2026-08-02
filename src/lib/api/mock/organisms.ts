import type { Organism } from '../types';

// Curated pests — the species selectable as a design target. Chosen for
// breadth across the orders where RNAi biopesticides are actually being
// pursued in the literature: Acari, Coleoptera, Lepidoptera, Hemiptera.
export const TARGET_ORGANISMS: Organism[] = [
  {
    id: 'org-varroa',
    commonName: 'Varroa mite',
    scientificName: 'Varroa destructor',
    taxid: 109461,
    sourceDb: 'RefSeq',
    transcriptCount: 21372,
    hasReferenceTranscriptome: true,
    kind: 'target',
  },
  {
    id: 'org-leptinotarsa',
    commonName: 'Colorado potato beetle',
    scientificName: 'Leptinotarsa decemlineata',
    taxid: 7539,
    sourceDb: 'RefSeq',
    transcriptCount: 18904,
    hasReferenceTranscriptome: true,
    kind: 'target',
  },
  {
    id: 'org-diabrotica',
    commonName: 'Western corn rootworm',
    scientificName: 'Diabrotica virgifera',
    taxid: 50390,
    sourceDb: 'RefSeq',
    transcriptCount: 19662,
    hasReferenceTranscriptome: true,
    kind: 'target',
  },
  {
    id: 'org-spodoptera',
    commonName: 'Fall armyworm',
    scientificName: 'Spodoptera frugiperda',
    taxid: 7108,
    sourceDb: 'RefSeq',
    transcriptCount: 23210,
    hasReferenceTranscriptome: true,
    kind: 'target',
  },
  {
    id: 'org-plutella',
    commonName: 'Diamondback moth',
    scientificName: 'Plutella xylostella',
    taxid: 51655,
    sourceDb: 'RefSeq',
    transcriptCount: 18540,
    hasReferenceTranscriptome: true,
    kind: 'target',
  },
  {
    id: 'org-bemisia',
    commonName: 'Silverleaf whitefly',
    scientificName: 'Bemisia tabaci',
    taxid: 7038,
    sourceDb: 'RefSeq',
    transcriptCount: 20117,
    hasReferenceTranscriptome: true,
    kind: 'target',
  },
  {
    id: 'org-myzus',
    commonName: 'Green peach aphid',
    scientificName: 'Myzus persicae',
    taxid: 13164,
    sourceDb: 'RefSeq',
    transcriptCount: 17836,
    hasReferenceTranscriptome: true,
    kind: 'target',
  },
  {
    id: 'org-halyomorpha',
    commonName: 'Brown marmorated stink bug',
    scientificName: 'Halyomorpha halys',
    taxid: 286706,
    sourceDb: 'RefSeq',
    transcriptCount: 19348,
    hasReferenceTranscriptome: true,
    kind: 'target',
  },
];

// Ecologically important non-target species offered in the safety screening
// panel — pollinators, beneficial predators/parasitoids, domesticated and
// aquatic sentinels. Never selectable as a design target.
export const NON_TARGET_ORGANISMS: Organism[] = [
  {
    id: 'org-apis',
    commonName: 'Western honey bee',
    scientificName: 'Apis mellifera',
    taxid: 7460,
    sourceDb: 'RefSeq',
    transcriptCount: 24385,
    hasReferenceTranscriptome: true,
    kind: 'non-target',
  },
  {
    id: 'org-bombus',
    commonName: 'Buff-tailed bumblebee',
    scientificName: 'Bombus terrestris',
    taxid: 30195,
    sourceDb: 'RefSeq',
    transcriptCount: 20411,
    hasReferenceTranscriptome: true,
    kind: 'non-target',
  },
  {
    id: 'org-osmia',
    commonName: 'Red mason bee',
    scientificName: 'Osmia bicornis',
    taxid: 1437191,
    sourceDb: 'VectorBase',
    transcriptCount: 0,
    hasReferenceTranscriptome: false,
    kind: 'non-target',
  },
  {
    id: 'org-monarch',
    commonName: 'Monarch butterfly',
    scientificName: 'Danaus plexippus',
    taxid: 13037,
    sourceDb: 'RefSeq',
    transcriptCount: 16324,
    hasReferenceTranscriptome: true,
    kind: 'non-target',
  },
  {
    id: 'org-bombyx',
    commonName: 'Domestic silkworm',
    scientificName: 'Bombyx mori',
    taxid: 7091,
    sourceDb: 'RefSeq',
    transcriptCount: 22987,
    hasReferenceTranscriptome: true,
    kind: 'non-target',
  },
  {
    id: 'org-coccinella',
    commonName: 'Seven-spot ladybird',
    scientificName: 'Coccinella septempunctata',
    taxid: 41139,
    sourceDb: 'RefSeq',
    transcriptCount: 15982,
    hasReferenceTranscriptome: true,
    kind: 'non-target',
  },
  {
    id: 'org-chrysoperla',
    commonName: 'Green lacewing',
    scientificName: 'Chrysoperla carnea',
    taxid: 189513,
    sourceDb: 'VectorBase',
    transcriptCount: 0,
    hasReferenceTranscriptome: false,
    kind: 'non-target',
  },
  {
    id: 'org-nasonia',
    commonName: 'Jewel wasp',
    scientificName: 'Nasonia vitripennis',
    taxid: 7425,
    sourceDb: 'RefSeq',
    transcriptCount: 16891,
    hasReferenceTranscriptome: true,
    kind: 'non-target',
  },
  {
    id: 'org-tribolium',
    commonName: 'Red flour beetle',
    scientificName: 'Tribolium castaneum',
    taxid: 7070,
    sourceDb: 'RefSeq',
    transcriptCount: 17395,
    hasReferenceTranscriptome: true,
    kind: 'non-target',
  },
  {
    id: 'org-daphnia',
    commonName: 'Water flea',
    scientificName: 'Daphnia magna',
    taxid: 35525,
    sourceDb: 'RefSeq',
    transcriptCount: 14762,
    hasReferenceTranscriptome: true,
    kind: 'non-target',
  },
];

export const HUMAN_ORGANISM: Organism = {
  id: 'org-human',
  commonName: 'Human',
  scientificName: 'Homo sapiens',
  taxid: 9606,
  sourceDb: 'RefSeq',
  transcriptCount: 172699,
  hasReferenceTranscriptome: true,
  kind: 'human',
};

export const ORGANISMS: Organism[] = [...TARGET_ORGANISMS, ...NON_TARGET_ORGANISMS, HUMAN_ORGANISM];

export function searchOrganisms(q: string): Organism[] {
  const query = q.trim().toLowerCase();
  if (!query) return ORGANISMS;
  return ORGANISMS.filter(
    (o) =>
      o.commonName.toLowerCase().includes(query) ||
      o.scientificName.toLowerCase().includes(query) ||
      String(o.taxid).includes(query),
  );
}

export function getOrganism(id: string): Organism | undefined {
  return ORGANISMS.find((o) => o.id === id);
}

/** Every species that can appear in the safety screening panel — every
 * non-target/human organism, regardless of the currently selected pest. */
export function screenableSpeciesPool(): Organism[] {
  return [...NON_TARGET_ORGANISMS, HUMAN_ORGANISM];
}
