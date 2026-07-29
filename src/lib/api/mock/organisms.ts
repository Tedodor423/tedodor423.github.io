import type { Organism } from '../types';

export const ORGANISMS: Organism[] = [
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
    id: 'org-apis',
    commonName: 'Western honey bee',
    scientificName: 'Apis mellifera',
    taxid: 7460,
    sourceDb: 'RefSeq',
    transcriptCount: 24385,
    hasReferenceTranscriptome: true,
    kind: 'pollinator',
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
    id: 'org-bombus',
    commonName: 'Buff-tailed bumblebee',
    scientificName: 'Bombus terrestris',
    taxid: 30195,
    sourceDb: 'RefSeq',
    transcriptCount: 20411,
    hasReferenceTranscriptome: true,
    kind: 'pollinator',
  },
  {
    id: 'org-human',
    commonName: 'Human',
    scientificName: 'Homo sapiens',
    taxid: 9606,
    sourceDb: 'RefSeq',
    transcriptCount: 172699,
    hasReferenceTranscriptome: true,
    kind: 'human',
  },
  {
    id: 'org-dwv-a',
    commonName: 'Deformed wing virus A',
    scientificName: 'Deformed wing virus A',
    taxid: 198112,
    sourceDb: 'GenBank',
    transcriptCount: 1,
    hasReferenceTranscriptome: true,
    kind: 'virus',
  },
  {
    id: 'org-dwv-b',
    commonName: 'Deformed wing virus B',
    scientificName: 'Deformed wing virus B',
    taxid: 198172,
    sourceDb: 'GenBank',
    transcriptCount: 1,
    hasReferenceTranscriptome: true,
    kind: 'virus',
  },
  {
    id: 'org-osmia',
    commonName: 'Red mason bee',
    scientificName: 'Osmia bicornis',
    taxid: 1437191,
    sourceDb: 'VectorBase',
    transcriptCount: 0,
    hasReferenceTranscriptome: false,
    kind: 'pollinator',
  },
  {
    id: 'org-nasonia',
    commonName: 'Jewel wasp',
    scientificName: 'Nasonia vitripennis',
    taxid: 7425,
    sourceDb: 'RefSeq',
    transcriptCount: 16891,
    hasReferenceTranscriptome: true,
    kind: 'pollinator',
  },
  {
    id: 'org-tribolium',
    commonName: 'Red flour beetle',
    scientificName: 'Tribolium castaneum',
    taxid: 7070,
    sourceDb: 'RefSeq',
    transcriptCount: 17395,
    hasReferenceTranscriptome: true,
    kind: 'pollinator',
  },
];

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

/** Species offered in the off-target safety panel — everything but the
 * currently-selected target organism and pure viral genomes. */
export function screenableSpeciesPool(excludeOrganismId?: string): Organism[] {
  return ORGANISMS.filter((o) => o.id !== excludeOrganismId && o.kind !== 'virus');
}
