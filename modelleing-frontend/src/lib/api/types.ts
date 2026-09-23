// Domain types for the occlusion-aware RNA design platform.
// Every field a screen renders must trace back to one of these — no component
// invents shape that isn't declared here.

export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export interface Job<T> {
  id: string;
  status: JobStatus;
  progress: number; // 0..1
  stage?: string;
  result?: T;
  error?: string;
}

export interface Organism {
  id: string;
  commonName: string;
  scientificName: string;
  taxid: number;
  sourceDb: 'RefSeq' | 'VectorBase' | 'GenBank';
  transcriptCount: number;
  hasReferenceTranscriptome: boolean;
  /** 'target' = selectable pest in target intake. 'non-target' = ecologically
   * relevant species offered in the safety screening panel (pollinators,
   * beneficial insects, sentinel/indicator species). 'human' = shown only in
   * safety screening, never as a target. */
  kind: 'target' | 'non-target' | 'human';
}

export interface Transcript {
  id: string;
  organismId: string;
  geneSymbol: string;
  accession: string;
  lengthNt: number;
  gcContent: number; // 0..1
  description: string;
  sequence: string; // A/C/G/U
}

export type TargetClass = 'essential' | 'population-control' | 'developmental' | 'custom';

export interface DiscoverRequest {
  organismId: string;
  targetClass: TargetClass;
  numCandidates: number;
  customFasta?: string;
}

export interface TargetGene {
  id: string;
  transcriptId: string;
  symbol: string;
  accession: string;
  lengthNt: number;
  conservationScore: number; // 0..1
  expressionEvidence: 'high' | 'moderate' | 'low';
  sparkline: number[];
  description: string;
}

export type SirnaLength = 19 | 21 | 22 | 24;

export interface TilingOpts {
  length: SirnaLength;
  seedFiltering: boolean;
  accessibilityWeighting: boolean;
}

export interface SirnaCandidate {
  id: string;
  transcriptId: string;
  position: number; // 0-based start on sense strand
  length: number;
  senseSeq: string;
  antisenseSeq: string;
  efficacyScore: number; // 0..1
  accessibility: number; // 0..1, mean unpaired probability across footprint
  deltaGDuplex: number; // kcal/mol, ~ -20..-35
  deltaGOpen: number; // kcal/mol, ~ 0..+12
  isSeedFiltered: boolean;
}

export interface FoldingProfile {
  transcriptId: string;
  sequence: string;
  dotBracket: string;
  pairs: Array<[number, number]>;
  unpairedProbability: number[]; // per-position, 0..1, coherent with dotBracket
}

export type DeliveryChassis = 's-cerevisiae' | 'ecoli-ht115' | 'snodgrassella-alvi';

export interface OffTargetRequest {
  candidateIds: string[];
  speciesIds: string[];
  contiguousMatchThreshold: number;
}

export interface OffTargetHit {
  candidateId: string;
  speciesId: string;
  longestMatch: number; // nt, 0 if no hit
  isHit: boolean; // longestMatch >= threshold
  unscreenable: boolean; // species has no reference transcriptome
  kmer?: string;
  hitTranscriptAccession?: string;
  hitGeneSymbol?: string;
  alignmentOffset?: number;
}

export interface OffTargetReport {
  cells: OffTargetHit[];
  survivorIds: string[];
  rejectedIds: string[];
}

export interface CassetteFeature {
  id: string;
  name: string;
  type: 'promoter' | 'insert' | 'terminator' | 'marker' | 'homology-arm' | 'loop';
  start: number;
  end: number;
  strand: 1 | -1;
}

export interface GoldenGateSite {
  enzyme: 'BsaI' | 'BsmBI' | 'SapI';
  position: number;
  sequence: string;
  removed: boolean;
}

export type CassetteTopology = 'dual-promoter' | 'hairpin' | 'dumbbell';

export interface PromoterOption {
  id: string;
  label: string;
}

export interface MarkerOption {
  id: string;
  label: string;
  /** Host strains/chassis this marker's resistance/auxotrophy actually works in. */
  compatibleChassis: DeliveryChassis[];
}

export interface CassetteRequest {
  candidateIds: string[];
  chassis: DeliveryChassis;
  topology: CassetteTopology;
  /** Ignored for the 'dumbbell' topology, which is promoter-free. */
  promoterId?: string;
  markerId?: string;
}

export interface CassetteDesign {
  id: string;
  topology: CassetteTopology;
  chassis: DeliveryChassis;
  lengthBp: number;
  sequence: string;
  features: CassetteFeature[];
  goldenGateSites: GoldenGateSite[];
}

export interface DiscoverResultSet {
  organismId: string;
  targetClass: TargetClass;
  genes: TargetGene[];
}
