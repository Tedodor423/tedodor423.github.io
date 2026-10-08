/* The frozen NECTAR outputs the RNA design page reads.
 *
 * PROVENANCE. Everything here comes out of one precompute run of the dry lab's
 * pipeline (`nectar-clean`, commit and panel checksum in panel.json), frozen on
 * 7 October 2026 and handed over as a 450 MB package. The wiki carries a cut of
 * it, written by tools/nectar_distil.py: all 100 panel genes at index level, and
 * five genes in full. Nothing is recomputed, rescored or normalised here or in
 * the component. The one liberty the cut takes is display rounding on the two
 * series the page draws as curves, and those arrive as integers 0-1000 so that
 * a reader of this file can see where the rounding is.
 *
 * WHICH FIVE, AND WHY THOSE. The literature arm: the panel members with
 * published direct RNAi evidence against Varroa. Their names are public because
 * the studies are, and every record carries the DOI it came from. The team's own
 * selected target is not one of the names on this page.
 *
 * WHAT IS NOT HERE. The weights, the fitted coefficients of the accumulation
 * model, the engineered feature set and the training corpus. They are held back
 * pending the IP position, and the page says so where they would appear.
 */

import panelFile from "../data/nectar/panel.json";

/* ---------- the panel ---------- */

/** How a gene got into the 100-gene panel. Not a claim about its importance. */
export type SelectionRoute =
  | "network"
  | "abundance_stratified"
  | "dsrip"
  | "literature";

/** Whether the full specificity chain ran. The thresholds behind
 * `skipped_computational_scale` are operational, not biological. */
export type SpecificityStatus =
  | "complete"
  | "skipped_computational_scale"
  | "timeout"
  | "failed";

export interface PanelGene {
  panelIndex: number;
  geneId: string;
  geneLabel: string;
  productLabel: string;
  accession: string;
  lengthNt: number;
  route: SelectionRoute;
  designStatus: string;
  specificityStatus: SpecificityStatus;
  candidates23: number;
  candidates24: number;
  regionCount: number;
  networkRank: string | null;
  abundanceRank: string | null;
  abundanceQuintile: string | null;
  dsripTransferCount: string | null;
  literatureClass: string | null;
  inCatalogue: boolean;
  exactEventsTotal: number;
  exactEventsVarroa: number;
  exactEventsApis: number;
  topRegion24: { start: number; end: number; score: number };
  hasWarnings: boolean;
}

export interface Provenance {
  runDateUtc: string;
  nectarCleanCommit: string;
  nectarCleanCommitSubject: string;
  panelFile: string;
  panelSha256: string;
  viennaRna: string;
  bowtie: string;
  edlib: string;
  python: string;
}

/** The top-ranked 96 nt region of a featured gene, carried in the panel file
 * so the construct builder can wrap one without pulling a whole gene file. */
export interface BestRegion {
  start: number;
  end: number;
  score: number;
  feature: string;
  sequence: string;
}

interface PanelFile {
  schemaVersion: string;
  transcriptStatement: string;
  provenance: Provenance;
  featured: string[];
  bestRegions: Record<string, BestRegion>;
  genes: PanelGene[];
}

const panel = panelFile as PanelFile;

export const PANEL: PanelGene[] = panel.genes;
export const PROVENANCE: Provenance = panel.provenance;
export const FEATURED_IDS: string[] = panel.featured;
export const BEST_REGIONS: Record<string, BestRegion> = panel.bestRegions;
export const TRANSCRIPT_STATEMENT: string = panel.transcriptStatement;

export const ROUTE_LABELS: Record<SelectionRoute, string> = {
  network: "Protein network",
  abundance_stratified: "Transcript abundance",
  dsrip: "dsRIP transfer",
  literature: "Published RNAi",
};

/** What each route means as a sentence, because the label alone is a jargon
 * token and a judge should not have to guess. */
export const ROUTE_NOTES: Record<SelectionRoute, string> = {
  network:
    "Entered on its rank in the STRING functional-association analysis of the Varroa proteome.",
  abundance_stratified:
    "Entered by expression, sampled across abundance strata rather than taken from the top of the list.",
  dsrip:
    "Entered on dsRIP evidence that the gene's transcript is handled by the mite's own RNAi machinery.",
  literature:
    "Entered because a published study already silenced it in Varroa and reported the result.",
};

export const ROUTE_ORDER: SelectionRoute[] = [
  "network",
  "abundance_stratified",
  "dsrip",
  "literature",
];

/* ---------- one gene, in full ---------- */

/** The four series the page plots, under the names NECTAR gives them. */
export type MetricKey = "l1" | "l2" | "l3" | "total";

export const METRIC_LABELS: Record<MetricKey, string> = {
  l1: "Varroa Accumulation",
  l2: "Guide Competence",
  l3: "Target Accessibility",
  total: "Combined Evidence",
};

/** What each layer asks of a candidate guide. */
export const METRIC_QUESTIONS: Record<MetricKey, string> = {
  l1: "Does this guide look like the small RNAs Varroa itself accumulates?",
  l2: "Will this strand be the one RISC loads, and will it stay unfolded?",
  l3: "Is the matching site in the target mRNA open rather than paired?",
  total: "The three above in equal thirds, with no weighting applied.",
};

/** NECTAR's own region-metric names, as the handoff stores them. */
export const REGION_METRICS = ["layer1", "layer2", "layer3", "total"] as const;
export type RegionMetric = (typeof REGION_METRICS)[number];

export const REGION_METRIC_OF: Record<RegionMetric, MetricKey> = {
  layer1: "l1",
  layer2: "l2",
  layer3: "l3",
  total: "total",
};

export type GuideLength = "23" | "24";
export const GUIDE_LENGTHS: GuideLength[] = ["23", "24"];

export interface Stat {
  min: number;
  median: number;
  max: number;
}

/** Per-guide values along the transcript. The four series are integers 0-1000
 * (the stored score times a thousand, rounded) because they are drawn as curves
 * at roughly a point per pixel; `stats` and `topGuides` carry stored precision. */
export interface GuideTrack {
  firstStart: number;
  l1: number[];
  l2: number[];
  l3: number[];
  total: number[];
  totalHistogram: number[];
  stats: Record<MetricKey, Stat>;
}

export interface RegionTrack {
  firstStart: number;
  total: number[];
}

/** One candidate guide, every field at stored precision. */
export interface TopGuide {
  start_1based: number;
  end_1based: number;
  target_sequence_dna: string;
  antisense_guide_sequence_rna: string;
  overlap_regions: string;
  crosses_annotation_boundary: boolean;
  layer1_accumulation_linear_predictor: number;
  layer1_accumulation_percentile: number;
  guide_5p_terminal_dg_4bp: number;
  passenger_5p_terminal_dg_4bp: number;
  asymmetry_ddg_4bp: number;
  asymmetry_ddg_5bp: number;
  guide_self_fold_mfe_kcal_mol: number;
  guide_self_fold_structure: string;
  layer2_asymmetry_percentile: number;
  layer2_self_fold_percentile: number;
  layer2_reference_score: number;
  target_whole_p_unpaired: number;
  target_seed_g2_8_p_unpaired: number;
  layer3_whole_accessibility_percentile: number;
  layer3_seed_accessibility_percentile: number;
  layer3_reference_score: number;
  stage10_layer1_percentile: number;
  stage10_layer2_percentile: number;
  stage10_layer3_percentile: number;
  stage10_equal_layer_score: number;
  stage10_equal_layer_rank: number;
  stage10_equal_layer_percentile: number;
  stage10_pareto_front: number;
  stage10_minimum_layer_score: number;
}

export interface GuideSpecificity {
  exact_warning_tier: string;
  offtarget_exact_event_count: number;
  offtarget_longest_exact_match_nt: number;
  offtarget_unique_gene_count: number;
  offtarget_unique_transcript_count: number;
  same_gene_other_transcript_event_count: number;
  varroa_offtarget_exact_event_count: number;
  apis_offtarget_exact_event_count: number;
  full_canonical_guide_exact_match: boolean;
}

export interface TopRegion {
  start: number;
  end: number;
  guides: number;
  score: number;
  rank: number;
  feature: string;
}

export interface RegionSpecificity {
  eventsStored: number;
  start: number;
  end: number;
  tier: string;
  events: number;
  varroaEvents: number;
  apisEvents: number;
  varroaTier: string;
  apisTier: string;
  longestExactNt: number;
  uniqueGenes: number;
  uniqueTranscripts: number;
  /** Positions in `events`, longest match first, capped by the distiller. */
  eventRows: number[];
}

export interface ExactEvent {
  exact_match_length_nt: number;
  exact_warning_tier: string;
  counts_as_offtarget_warning: boolean;
  relationship_to_intended_target: string;
  query_orientation: string;
  target_match_start_1based: number;
  target_match_end_1based: number;
  offtarget: number;
}

export interface OffTarget {
  reference_species: string;
  offtarget_gene_symbol: string;
  offtarget_gene_id: string;
  offtarget_product: string;
  offtarget_transcript_accession: string;
}

export interface SpeciesSummary {
  exact_event_count: number;
  events_by_exact_warning_tier: Record<string, number>;
  events_by_relationship_to_intended_target: Record<string, number>;
  events_counting_as_offtarget_warning: number;
  longest_exact_match_nt: number;
  unique_offtarget_gene_ids: number;
  unique_offtarget_transcripts: number;
}

export interface HomologyScreen {
  species: string;
  assembly: string;
  assemblyName: string;
  exactEvents: number;
  exactStatus: string;
  homologyStatus: string;
  homologyHits: number | null;
  alignmentsAttempted: number | null;
  retrievalCandidates: number | null;
  seedEvents: number | null;
  limitation: string | null;
}

export interface HomologyHit {
  candidate_region_id: string;
  reference_species: string;
  offtarget_gene_symbol: string;
  offtarget_product: string;
  offtarget_transcript_accession: string;
  relationship_to_intended_target: string;
  query_coverage_fraction: number;
  whole_region_identity_fraction: number;
  homology_mismatch_count: number;
  homology_insertion_count: number;
  homology_deletion_count: number;
  homology_longest_exact_run_nt: number;
  literature_high_homology_flag: boolean;
}

/** A curated record of one published RNAi study, with the reference it came
 * from. The team read and scored these by hand; the DOI is in every row. */
export interface LiteratureRecord {
  literature_gene_label: string;
  literature_legacy_aliases: string;
  literature_delivery_route: string;
  literature_evidence_classes: string[];
  literature_knockdown_summary: string;
  literature_knockdown_verified: string;
  literature_phenotype_summary: string;
  literature_phenotype_categories: string[];
  literature_phenotype_significant: string;
  literature_study_scale: string;
  literature_individual_vs_cocktail: string;
  literature_identifier_status: string;
  literature_mapping_method: string;
  literature_replication_note: string | null;
  literature_record_id: string;
  literature_reference_id: string;
  literature_transcript_accession: string | null;
  literature_protein_accession: string | null;
  reference_first_author: string;
  reference_publication_year: number;
  reference_title: string;
  reference_journal: string;
  reference_doi: string;
  reference_pmid: string | null;
  reference_pmcid: string | null;
  reference_primary_url: string;
  secondary_reference_url: string | null;
  retrieved_on: string;
}

export interface Annotation {
  feature: string;
  start: number;
  end: number;
}

export interface SummaryRow {
  candidate_length_nt: string;
  [key: string]: string;
}

export interface GeneData {
  geneId: string;
  geneLabel: string;
  productLabel: string;
  accession: string;
  lengthNt: number;
  designRoute: string;
  selection: {
    route: SelectionRoute;
    networkRank: string | null;
    networkPercentile: string | null;
    abundanceRank: string | null;
    abundancePercentile: string | null;
    abundanceQuintile: string | null;
    dsripTransferCount: string | null;
    literatureClass: string | null;
    transcriptReason: string;
    alternativeNote: string;
    inCatalogue: boolean;
    warnings: string | null;
  };
  literature: LiteratureRecord[];
  expression: Record<string, number | string> | null;
  network: Record<string, unknown> | null;
  sequence: string;
  sequenceSha256: string;
  annotations: Annotation[];
  counts: Record<GuideLength, number>;
  regionLengthNt: number;
  tracks: Record<GuideLength, GuideTrack>;
  regionTracks: Record<GuideLength, RegionTrack>;
  topGuides: Record<GuideLength, TopGuide[]>;
  guideSpecificity: Record<GuideLength, Record<string, GuideSpecificity>>;
  topRegions: Record<GuideLength, Record<RegionMetric, TopRegion[]>>;
  regionSpecificity: Record<string, RegionSpecificity>;
  events: ExactEvent[];
  offtargets: OffTarget[];
  eventLengthHistogram: Record<string, Array<[number, number]>>;
  homologyHits: HomologyHit[];
  homologyScreens: HomologyScreen[];
  exactMatchSummary: Record<string, SpeciesSummary>;
  exactEventTotal: number;
  specificityStatus: SpecificityStatus;
  summaries: {
    pareto: SummaryRow[];
    layerCorrelations: SummaryRow[];
    layer2Correlations: SummaryRow[];
    layer3Correlations: SummaryRow[];
  };
  runParameters: Record<string, string>;
}

/* Each gene file is 100-300 KB, so they are fetched on demand rather than
 * bundled into the page's first load. Vite turns the glob into one chunk per
 * file; the component shows a fixed-height placeholder while one arrives. */
const GENE_FILES = import.meta.glob<{ default: GeneData }>(
  "../data/nectar/LOC*.json",
);

const cache = new Map<string, GeneData>();

export function cachedGene(geneId: string): GeneData | undefined {
  return cache.get(geneId);
}

export async function loadGene(geneId: string): Promise<GeneData> {
  const held = cache.get(geneId);
  if (held) return held;
  const load = GENE_FILES[`../data/nectar/${geneId}.json`];
  if (!load) throw new Error(`no NECTAR data for ${geneId}`);
  const data = (await load()).default;
  cache.set(geneId, data);
  return data;
}

/* ---------- species, and the two screens ---------- */

export const VARROA = "Varroa destructor";
export const APIS = "Apis mellifera";
export const SPECIES_ORDER = [VARROA, APIS];

/* ---------- exact-match warning tiers ---------- */

/** NECTAR's three tiers, shortest first. They are screening evidence for a
 * reader to interpret, not a specificity score and not a pass or a fail. */
export const TIER_ORDER = [
  "caution_exact_16_20",
  "strong_exact_21_22",
  "very_strong_exact_ge23",
] as const;

export const TIER_LABELS: Record<string, string> = {
  caution_exact_16_20: "Caution, 16 to 20 nt",
  strong_exact_21_22: "Strong, 21 to 22 nt",
  very_strong_exact_ge23: "Very strong, 23 nt and over",
  none: "No exact match at 16 nt or more",
};

export const RELATIONSHIP_LABELS: Record<string, string> = {
  different_gene: "A different Varroa gene",
  intended_transcript: "The transcript we designed against",
  same_gene_other_transcript: "Another transcript of the same gene",
  non_target_species: "A non-target species",
};

/* ---------- formatting ---------- */

/** A stored 0-1 score, as the page prints it. Three decimals everywhere, so
 * two numbers on this page are always rounded the same way. */
export function score(value: number): string {
  return value.toFixed(3);
}

/** A track integer back to the 0-1 scale it was rounded from. */
export function fromMilli(value: number): number {
  return value / 1000;
}

/** Thousands separated, for counts that run into the millions. */
export function count(value: number): string {
  return value.toLocaleString("en-GB");
}

/** A probability that can be 1e-7: fixed notation would print 0.000. */
export function probability(value: number): string {
  if (value === 0) return "0";
  return value < 0.001 ? value.toExponential(2) : value.toFixed(4);
}

export function featureLabel(feature: string): string {
  if (feature === "5_prime_UTR") return "5′ UTR";
  if (feature === "3_prime_UTR") return "3′ UTR";
  return feature;
}

/** snake_case out of the handoff, as a sentence. Used for the evidence-class
 * and phenotype-category tokens, which are controlled vocabulary rather than
 * prose and would otherwise print raw. */
export function humanise(token: string): string {
  const words = token.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
