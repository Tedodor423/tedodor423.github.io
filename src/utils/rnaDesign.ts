/* The NectarDesigner walkthrough's engine: every sequence, fold, score and
 * screen the figure on /software shows.
 *
 * READ THIS BEFORE YOU BELIEVE A NUMBER THAT CAME OUT OF HERE.
 *
 * This file is a DEMONSTRATION of the pipeline's shape, not the pipeline. It
 * generates sequences from a seeded pseudo-random generator, folds them with a
 * grammar that emits plausible stems and loops rather than by minimising free
 * energy, and scores off-target homology by drawing a number instead of
 * aligning anything. No output of this file is a biological prediction, and
 * none of it touches the team's real ranking code, whose weights and
 * thresholds are held back pending the IP position.
 *
 * What it does reproduce faithfully is the ARGUMENT: which decision each stage
 * makes, what it needs from the stage before it, and what it hands the stage
 * after. Change the pest and the duplex length changes; change the threshold
 * and candidates die; kill enough candidates and the cassette has less to
 * carry. That chain is the real claim the page makes, and it is the chain a
 * reader can drive here.
 *
 * DETERMINISTIC ON PURPOSE. Every generator seeds from a stable string key
 * rather than from call order, so the same selections always give the same
 * page. Two readers comparing notes see the same numbers, and so does anyone
 * checking a screenshot against the live page.
 *
 * Swapping in real compute means replacing the bodies below and leaving every
 * signature alone. The component never reaches past these functions.
 */

import {
  DEVELOPMENTAL_GENE_NAMES,
  ESSENTIAL_GENE_NAMES,
  HOMOLOGY_ARM_CHASSIS,
  HOUSEKEEPING_GENE_NAMES,
  MARKERS_BY_CHASSIS,
  POPULATION_CONTROL_GENE_NAMES,
  PROMOTERS_BY_CHASSIS,
  getOrganism,
  type CassetteTopology,
  type DeliveryChassis,
  type SirnaLength,
  type TargetClass,
} from "../data/rnaDesignCatalog";

/* ---------- the seeded generator ---------- */

function mulberry32(seed: number) {
  let a = seed;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a. Turns a descriptive key into a seed, so `rngFor("fold:VD-001")`
 * always yields the same stream however many other draws happened first. */
function hashString(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

class Rng {
  private next: () => number;

  constructor(seed: number) {
    this.next = mulberry32(seed);
  }

  float(): number {
    return this.next();
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  int(min: number, maxInclusive: number): number {
    return Math.floor(this.range(min, maxInclusive + 1));
  }

  bool(pTrue = 0.5): boolean {
    return this.next() < pTrue;
  }

  pick<T>(items: readonly T[]): T {
    return items[this.int(0, items.length - 1)];
  }

  weightedPick<T>(entries: Array<[T, number]>): T {
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let r = this.range(0, total);
    for (const [value, weight] of entries) {
      r -= weight;
      if (r <= 0) return value;
    }
    return entries[entries.length - 1][0];
  }

  shuffle<T>(items: readonly T[]): T[] {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  gaussian(mean = 0, stdDev = 1): number {
    const u1 = Math.max(this.next(), 1e-9);
    const u2 = this.next();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stdDev;
  }
}

function rngFor(key: string): Rng {
  return new Rng(hashString(key));
}

/* ---------- sequence helpers ---------- */

export function gcContent(seq: string): number {
  let gc = 0;
  for (const base of seq) if (base === "G" || base === "C") gc++;
  return seq.length > 0 ? gc / seq.length : 0;
}

const COMPLEMENT: Record<string, string> = {
  A: "U",
  U: "A",
  T: "A",
  G: "C",
  C: "G",
};

export function reverseComplement(seq: string): string {
  let out = "";
  for (let i = seq.length - 1; i >= 0; i--) out += COMPLEMENT[seq[i]] ?? seq[i];
  return out;
}

export function toDna(seq: string): string {
  return seq.replace(/U/g, "T");
}

/** Built in short runs rather than base by base, so the composition does not
 * read as uniform noise the way an independent draw per position would. */
function generateSequence(rng: Rng, length: number, gcTarget: number): string {
  let out = "";
  let i = 0;
  while (i < length) {
    const runLength = Math.min(length - i, rng.int(1, 4));
    const isGc = rng.bool(gcTarget);
    const base = isGc ? rng.pick(["G", "C"] as const) : rng.pick(["A", "U"] as const);
    out += base.repeat(runLength);
    i += runLength;
  }
  return out;
}

const ACCESSION_PREFIXES = ["XM", "NM", "XR", "NR"];

function generateAccession(rng: Rng): string {
  return `${rng.pick(ACCESSION_PREFIXES)}_${rng.int(1000000, 9999999)}.${rng.int(1, 3)}`;
}

function symbolFrom(name: string, index: number): string {
  const words = name.split(/[\s-]+/).filter((word) => /^[A-Za-z]/.test(word));
  const stem =
    words.length >= 2
      ? words
          .slice(0, 2)
          .map((word) => word[0].toUpperCase())
          .join("")
      : (words[0]?.slice(0, 3).toUpperCase() ?? "GN");
  return `${stem}${index}`;
}

/* ---------- transcripts ---------- */

export interface Transcript {
  id: string;
  organismId: string;
  geneSymbol: string;
  accession: string;
  lengthNt: number;
  gcContent: number;
  description: string;
  sequence: string;
}

interface PoolEntry {
  transcript: Transcript;
  targetClass: TargetClass;
}

const poolCache = new Map<string, PoolEntry[]>();

function buildEntry(
  organismId: string,
  name: string,
  index: number,
  targetClass: TargetClass,
): PoolEntry {
  const key = `transcript:${organismId}:${targetClass}:${index}:${name}`;
  const rng = rngFor(key);
  const lengthNt = rng.int(800, 3000);
  const gcTarget = rng.range(0.32, 0.48);
  return {
    targetClass,
    transcript: {
      id: key,
      organismId,
      geneSymbol: symbolFrom(name, index),
      accession: generateAccession(rng),
      lengthNt,
      gcContent: rng.range(gcTarget - 0.02, gcTarget + 0.02),
      description: name,
      sequence: generateSequence(rng, lengthNt, gcTarget),
    },
  };
}

function transcriptPool(organismId: string): PoolEntry[] {
  const cached = poolCache.get(organismId);
  if (cached) return cached;

  const entries: PoolEntry[] = [
    ...ESSENTIAL_GENE_NAMES.map((name, i) =>
      buildEntry(organismId, name, i, "essential"),
    ),
    ...HOUSEKEEPING_GENE_NAMES.map((name, i) =>
      buildEntry(organismId, name, i, "essential"),
    ),
    ...POPULATION_CONTROL_GENE_NAMES.map((name, i) =>
      buildEntry(organismId, name, i, "population-control"),
    ),
    ...DEVELOPMENTAL_GENE_NAMES.map((name, i) =>
      buildEntry(organismId, name, i, "developmental"),
    ),
  ];
  poolCache.set(organismId, entries);
  return entries;
}

export function findTranscript(transcriptId: string): Transcript | undefined {
  const organismId = transcriptId.split(":")[1];
  if (organismId) transcriptPool(organismId);
  for (const entries of poolCache.values()) {
    const hit = entries.find((entry) => entry.transcript.id === transcriptId);
    if (hit) return hit.transcript;
  }
  return undefined;
}

/* ---------- stage 1: ranking candidate genes ---------- */

export interface TargetGene {
  id: string;
  transcriptId: string;
  symbol: string;
  accession: string;
  lengthNt: number;
  /** 0..1. On the real pipeline this is a percentile across the proteome. */
  conservationScore: number;
  expressionEvidence: "high" | "moderate" | "low";
  description: string;
}

function buildTargetGene(transcript: Transcript): TargetGene {
  const rng = rngFor(`gene:${transcript.id}`);
  return {
    id: `gene:${transcript.id}`,
    transcriptId: transcript.id,
    symbol: transcript.geneSymbol,
    accession: transcript.accession,
    lengthNt: transcript.lengthNt,
    conservationScore: rng.range(0.4, 0.98),
    expressionEvidence: rng.weightedPick<"high" | "moderate" | "low">([
      ["high", 0.45],
      ["moderate", 0.35],
      ["low", 0.2],
    ]),
    description: transcript.description,
  };
}

export function discoverTargets(
  organismId: string,
  targetClass: TargetClass,
  numCandidates: number,
): TargetGene[] {
  if (!getOrganism(organismId)) return [];
  const pool = transcriptPool(organismId)
    .filter((entry) => entry.targetClass === targetClass)
    .map((entry) => entry.transcript);

  return rngFor(`discover:${organismId}:${targetClass}`)
    .shuffle(pool)
    .slice(0, Math.min(numCandidates, pool.length))
    .map(buildTargetGene)
    .sort((a, b) => b.conservationScore - a.conservationScore);
}

/* ---------- stage 2, step 1: folding and accessibility ---------- */

export interface FoldingProfile {
  transcriptId: string;
  sequence: string;
  dotBracket: string;
  pairs: Array<[number, number]>;
  /** Per position, 0..1, and coherent with the dot-bracket above it. */
  unpairedProbability: number[];
}

/* How far apart a stem's two halves may sit. Real RNA secondary structure is
 * overwhelmingly LOCAL: hairpins close over tens of nucleotides, not over the
 * whole transcript. Without this bound the grammar below happily opens a stem
 * at position 5 and closes it at position 2,700, which has two bad effects.
 * The drawn structure stops resembling RNA, and worse, a window view of a few
 * hundred nucleotides then contains almost no COMPLETE pair, so the folding
 * figure draws a bare backbone and reports zero base pairs. */
const MAX_LOOP_SPAN = 70;

/* A grammar rather than a random bracket string: stems that terminate in
 * hairpin loops, and multiloops where a stem's interior holds more than one
 * child. That is what makes the drawn structure resolve into recognisable
 * elements instead of a tangle. It is NOT free-energy minimisation. */
function generateDotBracket(rng: Rng, length: number, depth = 0): string {
  let out = "";
  let remaining = length;

  while (remaining > 0) {
    const minStemFootprint = 9; // a 3 bp stem either side of a 3 nt loop
    const canStem = remaining >= minStemFootprint && depth < 5;

    if (canStem && rng.bool(0.5 - depth * 0.05)) {
      const maxStem = Math.min(8, Math.floor((remaining - 3) / 2));
      const stemLength = rng.int(3, Math.max(3, maxStem));
      const maxInterior = Math.min(
        remaining - 2 * stemLength,
        MAX_LOOP_SPAN,
      );
      if (maxInterior < 3) {
        const dots = Math.min(remaining, rng.int(1, 5));
        out += ".".repeat(dots);
        remaining -= dots;
        continue;
      }
      const interiorLength = rng.int(3, maxInterior);
      out +=
        "(".repeat(stemLength) +
        generateDotBracket(rng, interiorLength, depth + 1) +
        ")".repeat(stemLength);
      remaining -= 2 * stemLength + interiorLength;
    } else {
      const dots = Math.min(remaining, rng.int(1, 6));
      out += ".".repeat(dots);
      remaining -= dots;
    }
  }

  return out;
}

function parsePairs(dotBracket: string): Array<[number, number]> {
  const stack: number[] = [];
  const pairs: Array<[number, number]> = [];
  for (let i = 0; i < dotBracket.length; i++) {
    if (dotBracket[i] === "(") stack.push(i);
    else if (dotBracket[i] === ")") {
      const opened = stack.pop();
      if (opened !== undefined) pairs.push([opened, i]);
    }
  }
  return pairs;
}

function smooth(values: number[], window: number): number[] {
  const out = new Array<number>(values.length);
  const half = Math.floor(window / 2);
  for (let i = 0; i < values.length; i++) {
    let sum = 0;
    let n = 0;
    for (let k = -half; k <= half; k++) {
      const index = i + k;
      if (index >= 0 && index < values.length) {
        sum += values[index];
        n++;
      }
    }
    out[i] = sum / n;
  }
  return out;
}

/** Paired positions land low, loop and flank positions land high, then the
 * whole profile is smoothed so accessibility breathes at a stem boundary
 * rather than stepping off a cliff. */
function deriveUnpairedProbability(rng: Rng, dotBracket: string): number[] {
  const raw = Array.from(dotBracket, (char) => {
    const base = char === "." ? 0.88 : 0.1;
    return base + rng.gaussian(0, 0.06);
  });
  return smooth(raw, 5).map((value) => Math.min(0.98, Math.max(0.02, value)));
}

const foldCache = new Map<string, FoldingProfile>();

/** One fold per transcript, shared by the accessibility track, the tiling and
 * the docking readout, so no two figures on the page can disagree about how
 * accessible a position is. */
export function getFold(transcriptId: string): FoldingProfile {
  const cached = foldCache.get(transcriptId);
  if (cached) return cached;

  const sequence = findTranscript(transcriptId)?.sequence ?? "";
  const rng = rngFor(`fold:${transcriptId}`);
  const dotBracket = generateDotBracket(rng, sequence.length);
  const profile: FoldingProfile = {
    transcriptId,
    sequence,
    dotBracket,
    pairs: parsePairs(dotBracket),
    unpairedProbability: deriveUnpairedProbability(rng, dotBracket),
  };
  foldCache.set(transcriptId, profile);
  return profile;
}

/* ---------- stage 2, steps 2 and 3: tiling and scoring ---------- */

export interface SirnaCandidate {
  id: string;
  transcriptId: string;
  /** 0-based start on the sense strand. */
  position: number;
  length: number;
  senseSeq: string;
  antisenseSeq: string;
  /** 0..1, the combined score the ranking sorts on. */
  efficacyScore: number;
  /** 0..1, mean unpaired probability across the footprint. */
  accessibility: number;
  /** kcal/mol, negative: the duplex forming. */
  deltaGDuplex: number;
  /** kcal/mol, positive: the cost of melting the site open first. */
  deltaGOpen: number;
  /** Repetitive motif across antisense positions 2 to 8. */
  isSeedFiltered: boolean;
}

/** Stand-ins for a real seed-match heuristic, chosen to be visibly crude. */
const SEED_RISK_MOTIFS = ["AAAA", "UUUU", "GGGG", "CCCC"];

const tileCache = new Map<string, SirnaCandidate[]>();

export function tileSirnas(
  transcriptId: string,
  length: SirnaLength,
  seedFiltering: boolean,
): SirnaCandidate[] {
  const key = `${transcriptId}|${length}|${seedFiltering}`;
  const cached = tileCache.get(key);
  if (cached) return cached;

  const { sequence, unpairedProbability } = getFold(transcriptId);
  const candidates: SirnaCandidate[] = [];

  for (let pos = 0; pos + length <= sequence.length; pos += 2) {
    const rng = rngFor(`sirna:${transcriptId}:${pos}:${length}`);
    const senseSeq = sequence.slice(pos, pos + length);
    const antisenseSeq = reverseComplement(senseSeq);
    const footprint = unpairedProbability.slice(pos, pos + length);
    const accessibility =
      footprint.reduce((a, b) => a + b, 0) / footprint.length;

    const gc = gcContent(senseSeq);
    // Real siRNAs favour moderate GC, so distance from it is the penalty.
    const gcPenalty = Math.abs(gc - 0.42);
    const isSeedFiltered =
      seedFiltering &&
      SEED_RISK_MOTIFS.some((motif) => antisenseSeq.slice(1, 8).includes(motif));

    let efficacyScore =
      0.5 * accessibility + 0.3 * (1 - gcPenalty * 2.2) + 0.2 * rng.range(0.6, 1);
    if (isSeedFiltered) efficacyScore *= 0.35;

    candidates.push({
      id: `sirna:${transcriptId}:${length}:${pos}`,
      transcriptId,
      position: pos,
      length,
      senseSeq,
      antisenseSeq,
      efficacyScore: Math.min(0.98, Math.max(0.03, efficacyScore)),
      accessibility,
      // Stronger (more negative) with higher GC.
      deltaGDuplex: -20 - gc * 12 - rng.range(0, 3),
      // An occluded site costs more to open.
      deltaGOpen: Math.max(0, (1 - accessibility) * 12 + rng.range(-0.5, 0.5)),
      isSeedFiltered,
    });
  }

  const sorted = candidates.sort((a, b) => b.efficacyScore - a.efficacyScore);
  tileCache.set(key, sorted);
  return sorted;
}

/* ---------- stage 2, step 4: the off-target screen ---------- */

export interface OffTargetHit {
  candidateId: string;
  speciesId: string;
  /** nt. 0 when the species could not be screened at all. */
  longestMatch: number;
  isHit: boolean;
  /** No reference transcriptome, so absence of a hit means absence of data. */
  unscreenable: boolean;
  kmer?: string;
  hitGeneSymbol?: string;
  hitTranscriptAccession?: string;
}

export interface OffTargetReport {
  cells: OffTargetHit[];
  survivorIds: string[];
  rejectedIds: string[];
  /** Species in the panel that carry no reference transcriptome. */
  unscreenableSpeciesIds: string[];
}

function scoreCell(
  candidate: SirnaCandidate,
  speciesId: string,
  threshold: number,
): OffTargetHit {
  const species = getOrganism(speciesId);

  if (!species || !species.hasReferenceTranscriptome) {
    return {
      candidateId: candidate.id,
      speciesId,
      longestMatch: 0,
      isHit: false,
      unscreenable: true,
    };
  }

  const rng = rngFor(`offtarget:${candidate.id}:${speciesId}`);
  // Closely related arthropods run hotter than distant taxa, so the matrix has
  // a believable shape instead of uniform noise.
  const closeness =
    species.kind === "non-target" ? 1 : species.kind === "human" ? 0.4 : 0.7;
  const drawn = Math.round(rng.gaussian(9 + closeness * 6, 4));
  const longestMatch = Math.max(4, Math.min(candidate.length, drawn));
  const isHit = longestMatch >= threshold;

  if (!isHit) {
    return {
      candidateId: candidate.id,
      speciesId,
      longestMatch,
      isHit,
      unscreenable: false,
    };
  }

  return {
    candidateId: candidate.id,
    speciesId,
    longestMatch,
    isHit,
    unscreenable: false,
    kmer: candidate.antisenseSeq.slice(0, longestMatch),
    hitGeneSymbol: symbolFrom(
      rng.pick(HOUSEKEEPING_GENE_NAMES),
      rng.int(100, 999),
    ),
    hitTranscriptAccession: generateAccession(rng),
  };
}

export function screenOffTargets(
  candidates: SirnaCandidate[],
  speciesIds: string[],
  threshold: number,
): OffTargetReport {
  const cells: OffTargetHit[] = [];
  const hitByCandidate = new Map<string, boolean>();

  for (const candidate of candidates) {
    let anyHit = false;
    for (const speciesId of speciesIds) {
      const cell = scoreCell(candidate, speciesId, threshold);
      cells.push(cell);
      if (cell.isHit) anyHit = true;
    }
    hitByCandidate.set(candidate.id, anyHit);
  }

  return {
    cells,
    survivorIds: candidates
      .filter((one) => !hitByCandidate.get(one.id))
      .map((one) => one.id),
    rejectedIds: candidates
      .filter((one) => hitByCandidate.get(one.id))
      .map((one) => one.id),
    unscreenableSpeciesIds: speciesIds.filter(
      (id) => getOrganism(id)?.hasReferenceTranscriptome === false,
    ),
  };
}

/* ---------- stage 2, step 6: the expression-ready construct ---------- */

export interface CassetteFeature {
  id: string;
  name: string;
  type:
    | "promoter"
    | "insert"
    | "terminator"
    | "marker"
    | "homology-arm"
    | "loop";
  start: number;
  end: number;
  strand: 1 | -1;
}

export interface GoldenGateSite {
  enzyme: "BsaI" | "BsmBI" | "SapI";
  position: number;
  sequence: string;
  removed: boolean;
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

const HAIRPIN_LOOP = "TTCAAGAGA"; // the canonical short-hairpin loop spacer

const ENZYMES = [
  { name: "BsaI" as const, fwd: "GGTCTC", rev: "GAGACC" },
  { name: "BsmBI" as const, fwd: "CGTCTC", rev: "GAGACG" },
  { name: "SapI" as const, fwd: "GCTCTTC", rev: "GAAGAGC" },
];

function findGoldenGateSites(sequence: string): GoldenGateSite[] {
  const sites: GoldenGateSite[] = [];
  for (const enzyme of ENZYMES) {
    for (const motif of [enzyme.fwd, enzyme.rev]) {
      let from = 0;
      let index: number;
      while ((index = sequence.indexOf(motif, from)) !== -1) {
        sites.push({
          enzyme: enzyme.name,
          position: index,
          sequence: motif,
          removed: false,
        });
        from = index + 1;
      }
    }
  }
  return sites.sort((a, b) => a.position - b.position);
}

export function buildCassette(
  candidates: SirnaCandidate[],
  chassis: DeliveryChassis,
  topology: CassetteTopology,
  promoterId: string,
  markerId: string,
): CassetteDesign {
  const carried = candidates.slice(0, 3);
  const rng = rngFor(
    `cassette:${chassis}:${topology}:${promoterId}:${markerId}:${carried
      .map((one) => one.id)
      .join(",")}`,
  );

  const insertSense = toDna(carried.map((one) => one.senseSeq).join(""));
  const insertAntisense = toDna(carried.map((one) => one.antisenseSeq).join(""));

  const features: CassetteFeature[] = [];
  const parts: string[] = [];
  let cursor = 0;

  const push = (
    name: string,
    type: CassetteFeature["type"],
    seq: string,
    strand: 1 | -1 = 1,
  ) => {
    const start = cursor;
    parts.push(seq);
    cursor += seq.length;
    features.push({
      id: `feat-${features.length}`,
      name,
      type,
      start,
      end: cursor,
      strand,
    });
  };

  if (topology === "dumbbell") {
    // Covalently closed at both ends and promoter-free, because nothing
    // transcribes it in vivo. This is the architecture NECTAR actually makes.
    const loopCap = () => toDna(generateSequence(rng, rng.int(8, 14), 0.5));
    push("5' loop closure", "loop", loopCap(), 1);
    push("dsRNA duplex", "insert", insertSense + HAIRPIN_LOOP + insertAntisense, 1);
    push("3' loop closure", "loop", loopCap(), -1);
  } else {
    const promoter =
      PROMOTERS_BY_CHASSIS[chassis].find((one) => one.id === promoterId) ??
      PROMOTERS_BY_CHASSIS[chassis][0];
    const marker =
      MARKERS_BY_CHASSIS[chassis].find((one) => one.id === markerId) ??
      MARKERS_BY_CHASSIS[chassis][0];
    const integrates = HOMOLOGY_ARM_CHASSIS.has(chassis);

    const promoterSeq = () => toDna(generateSequence(rng, rng.int(60, 120), 0.55));
    const terminatorSeq = () => toDna(generateSequence(rng, rng.int(40, 70), 0.5));
    const armSeq = () => toDna(generateSequence(rng, rng.int(300, 480), 0.4));

    if (integrates) push("5' homology arm", "homology-arm", armSeq(), 1);
    push(marker.label, "marker", toDna(generateSequence(rng, rng.int(600, 850), 0.5)), 1);

    if (topology === "hairpin") {
      push(promoter.label, "promoter", promoterSeq(), 1);
      push("shRNA insert", "insert", insertSense + HAIRPIN_LOOP + insertAntisense, 1);
      push(promoter.terminatorLabel, "terminator", terminatorSeq(), 1);
    } else {
      push(promoter.label, "promoter", promoterSeq(), 1);
      push("dsRNA insert", "insert", insertSense, 1);
      push(promoter.terminatorLabel, "terminator", terminatorSeq(), 1);
      push(`${promoter.label} (opposing)`, "promoter", promoterSeq(), -1);
      push(`${promoter.terminatorLabel} (opposing)`, "terminator", terminatorSeq(), -1);
    }

    if (integrates) push("3' homology arm", "homology-arm", armSeq(), 1);
  }

  const sequence = parts.join("");
  return {
    id: `cassette:${chassis}:${topology}:${promoterId}:${markerId}:${carried.length}`,
    topology,
    chassis,
    lengthBp: sequence.length,
    sequence,
    features,
    goldenGateSites: findGoldenGateSites(sequence),
  };
}

/** Break one recognition site by flipping a single interior base. The real
 * thing would pick a codon-aware synonymous substitution; this shows the
 * detect-and-remove interaction without claiming that. */
export function removeGoldenGateSite(
  design: CassetteDesign,
  siteIndex: number,
): CassetteDesign {
  const site = design.goldenGateSites[siteIndex];
  if (!site || site.removed) return design;

  const rng = rngFor(`ggremove:${design.id}:${siteIndex}`);
  const at = site.position + Math.floor(site.sequence.length / 2);
  const replacement = rng.pick(
    ["A", "C", "G", "T"].filter((base) => base !== design.sequence[at]),
  );

  return {
    ...design,
    sequence:
      design.sequence.slice(0, at) + replacement + design.sequence.slice(at + 1),
    goldenGateSites: design.goldenGateSites.map((one, i) =>
      i === siteIndex ? { ...one, removed: true } : one,
    ),
  };
}

/* ---------- stage 2, step 6: what comes out ---------- */

const GENBANK_KEY: Record<CassetteFeature["type"], string> = {
  promoter: "promoter",
  insert: "misc_feature",
  terminator: "terminator",
  marker: "gene",
  "homology-arm": "misc_feature",
  loop: "misc_structure",
};

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

function gbDate(): string {
  const now = new Date();
  return `${String(now.getDate()).padStart(2, "0")}-${MONTHS[now.getMonth()]}-${now.getFullYear()}`;
}

export function buildGenBank(design: CassetteDesign): string {
  const name = `NECTAR_${design.chassis.toUpperCase().replace(/-/g, "_")}`;
  const lines: string[] = [
    `LOCUS       ${name.padEnd(20)} ${String(design.lengthBp).padStart(5)} bp    DNA     linear   SYN ${gbDate()}`,
    `DEFINITION  Synthetic dsRNA expression cassette (${design.topology}). GENERATED DEMONSTRATION SEQUENCE, not a real construct.`,
    "ACCESSION   .",
    "VERSION     .",
    "KEYWORDS    .",
    "SOURCE      synthetic construct",
    "  ORGANISM  synthetic construct",
    "COMMENT     Produced by the NectarDesigner walkthrough on the Oxford iGEM",
    "            2026 wiki. Every base below comes from a seeded generator and",
    "            no part of it is a biological prediction. Do not order it.",
    "FEATURES             Location/Qualifiers",
    `     source          1..${design.lengthBp}`,
    '                     /organism="synthetic construct"',
    '                     /mol_type="other DNA"',
  ];

  for (const feature of design.features) {
    const location =
      feature.strand === -1
        ? `complement(${feature.start + 1}..${feature.end})`
        : `${feature.start + 1}..${feature.end}`;
    lines.push(`     ${GENBANK_KEY[feature.type].padEnd(16)}${location}`);
    lines.push(`                     /label="${feature.name}"`);
  }

  for (const site of design.goldenGateSites) {
    if (site.removed) continue;
    lines.push(
      `     misc_feature    ${site.position + 1}..${site.position + site.sequence.length}`,
    );
    lines.push(`                     /label="${site.enzyme} site"`);
    lines.push('                     /note="unremoved Golden Gate recognition site"');
  }

  lines.push("ORIGIN");
  const lower = design.sequence.toLowerCase();
  for (let i = 0; i < lower.length; i += 60) {
    const groups: string[] = [];
    const chunk = lower.slice(i, i + 60);
    for (let g = 0; g < chunk.length; g += 10) groups.push(chunk.slice(g, g + 10));
    lines.push(`${String(i + 1).padStart(9, " ")} ${groups.join(" ")}`);
  }
  lines.push("//");

  return lines.join("\n");
}

export function buildFasta(design: CassetteDesign): string {
  const wrapped: string[] = [];
  for (let i = 0; i < design.sequence.length; i += 70) {
    wrapped.push(design.sequence.slice(i, i + 70));
  }
  return [
    `>NECTAR_${design.chassis}_${design.topology}_${design.lengthBp}bp GENERATED DEMONSTRATION SEQUENCE, not a real construct`,
    ...wrapped,
    "",
  ].join("\n");
}

export interface Primer {
  name: string;
  sequence: string;
  lengthNt: number;
  tmC: number;
  notes: string;
}

/** Wallace rule. Crude, and the right level of crude for a check primer. */
function wallaceTm(seq: string): number {
  let gc = 0;
  let at = 0;
  for (const base of seq.toUpperCase()) {
    if (base === "G" || base === "C") gc++;
    else if (base === "A" || base === "T") at++;
  }
  return 4 * gc + 2 * at;
}

export function buildPrimers(
  design: CassetteDesign,
  candidates: SirnaCandidate[],
): Primer[] {
  const forward = design.sequence.slice(0, 20);
  const reverse = toDna(reverseComplement(design.sequence.slice(-20).replace(/T/g, "U")));

  const primers: Primer[] = [
    {
      name: "cassette-F",
      sequence: forward,
      lengthNt: forward.length,
      tmC: wallaceTm(forward),
      notes: "Full-construct forward, anneals at position 1",
    },
    {
      name: "cassette-R",
      sequence: reverse,
      lengthNt: reverse.length,
      tmC: wallaceTm(reverse),
      notes: `Full-construct reverse, anneals at position ${design.lengthBp - 19}`,
    },
  ];

  if (design.features.some((one) => one.type === "insert")) {
    candidates.slice(0, 3).forEach((candidate, i) => {
      const seq = toDna(candidate.senseSeq);
      primers.push({
        name: `check-insert-${i + 1}`,
        sequence: seq,
        lengthNt: seq.length,
        tmC: wallaceTm(seq),
        notes: `Verifies the ${candidate.length} nt window at transcript position ${candidate.position}`,
      });
    });
  }

  return primers;
}

export function primersToCsv(primers: Primer[]): string {
  return [
    "name,sequence,length_nt,tm_c,notes",
    ...primers.map(
      (one) =>
        `${one.name},${one.sequence},${one.lengthNt},${one.tmC.toFixed(1)},"${one.notes}"`,
    ),
    "# GENERATED DEMONSTRATION DATA from the Oxford iGEM 2026 wiki. Not real primers.",
  ].join("\n");
}

/** Hands the browser a file without a server or a library. */
export function downloadText(filename: string, text: string, mime: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
