// Curated gene-name pools so candidate lists read like a real screen rather
// than "Gene 1, Gene 2, ...". Not claimed as real annotations — see the
// DEMO DATA marker in the header.

export const ESSENTIAL_GENE_NAMES = [
  'V-ATPase subunit B',
  'Proteasome subunit PSMD4',
  'Elongation factor 1-alpha',
  'Beta-tubulin',
  'Actin-5C',
  'Heat shock protein 70',
  'COPB2 coatomer subunit',
  'Ribosomal protein S6',
  'ATP synthase subunit 6',
];

// Fertility/germline genes — knockdown targets population size rather than
// individual survival.
export const POPULATION_CONTROL_GENE_NAMES = [
  'Vitellogenin',
  'Vasa homolog',
  'Boule',
  'Piwi-like protein 1',
  'Nanos homolog',
  'Transformer-2',
  'Doublesex',
  'Oskar homolog',
  'Egalitarian',
  'Bicaudal-D',
];

// Molting, metamorphosis and cuticle-formation genes — knockdown disrupts
// development rather than acting on an adult-stage essential process.
export const DEVELOPMENTAL_GENE_NAMES = [
  'Ecdysone receptor',
  'Juvenile hormone esterase',
  'Chitin synthase 1',
  'Chitinase-like protein 2',
  'Broad-Complex core protein',
  'Hormone receptor 3',
  'Ultraspiracle',
  'Cuticle protein 19',
  'E93 transcription factor',
];

export const HOUSEKEEPING_GENE_NAMES = [
  'GAPDH',
  'Alpha-tubulin',
  'RPL32',
  'RPS18',
  'Cytochrome c oxidase I',
  'NADH dehydrogenase subunit 1',
  'Hexokinase',
  'Calmodulin',
  'Ubiquitin-conjugating enzyme',
  'Profilin',
  'Arginine kinase',
  'Odorant receptor co-receptor',
];

export function geneSymbolFrom(name: string, index: number): string {
  const words = name.split(/[\s-]+/).filter((w) => /^[A-Za-z]/.test(w));
  const stem =
    words.length >= 2
      ? words
          .slice(0, 2)
          .map((w) => w[0].toUpperCase())
          .join('')
      : (words[0]?.slice(0, 3).toUpperCase() ?? 'GN');
  return `${stem}${index}`;
}
