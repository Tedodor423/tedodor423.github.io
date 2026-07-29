import type { Organism, TargetClass, Transcript } from '../types';
import { rngFor } from './prng';
import { generateAccession, generateSequence } from './sequence';
import { getOrganism } from './organisms';
import {
  ESSENTIAL_GENE_NAMES,
  geneSymbolFrom,
  HOUSEKEEPING_GENE_NAMES,
  REPRODUCTION_GENE_NAMES,
  VIRAL_ORF_NAMES,
} from './genes';

export interface PoolEntry {
  transcript: Transcript;
  targetClass: TargetClass;
}

const poolCache = new Map<string, PoolEntry[]>();
const customTranscripts = new Map<string, Transcript>();

export function registerCustomTranscript(t: Transcript): void {
  customTranscripts.set(t.id, t);
}

function buildEntry(
  organism: Organism,
  name: string,
  index: number,
  targetClass: TargetClass,
): PoolEntry {
  const key = `transcript:${organism.id}:${targetClass}:${index}:${name}`;
  const rng = rngFor(key);
  const isViral = organism.kind === 'virus';
  const lengthNt = isViral ? rng.int(1000, 3000) : rng.int(800, 3000);
  const gcTarget = rng.range(0.32, 0.48);
  const sequence = generateSequence(rng, lengthNt, gcTarget);
  const symbol = geneSymbolFrom(name, index);
  return {
    targetClass,
    transcript: {
      id: key,
      organismId: organism.id,
      geneSymbol: symbol,
      accession: generateAccession(rng),
      lengthNt,
      gcContent: rng.range(gcTarget - 0.02, gcTarget + 0.02),
      description: name,
      sequence,
    },
  };
}

export function buildTranscriptPool(organism: Organism): PoolEntry[] {
  const cached = poolCache.get(organism.id);
  if (cached) return cached;

  let entries: PoolEntry[];
  if (organism.kind === 'virus') {
    entries = VIRAL_ORF_NAMES.map((name, i) => buildEntry(organism, name, i, 'viral'));
  } else {
    entries = [
      ...ESSENTIAL_GENE_NAMES.map((name, i) => buildEntry(organism, name, i, 'essential')),
      ...REPRODUCTION_GENE_NAMES.map((name, i) => buildEntry(organism, name, i, 'reproduction')),
      ...HOUSEKEEPING_GENE_NAMES.map((name, i) =>
        buildEntry(organism, name, i, 'essential' as TargetClass),
      ),
    ];
  }
  poolCache.set(organism.id, entries);
  return entries;
}

export function listTranscripts(organism: Organism): Transcript[] {
  return buildTranscriptPool(organism).map((e) => e.transcript);
}

export function transcriptsForClass(organism: Organism, targetClass: TargetClass): Transcript[] {
  const pool = buildTranscriptPool(organism);
  if (targetClass === 'viral') return pool.map((e) => e.transcript);
  return pool.filter((e) => e.targetClass === targetClass).map((e) => e.transcript);
}

export function findTranscript(transcriptId: string): Transcript | undefined {
  const custom = customTranscripts.get(transcriptId);
  if (custom) return custom;

  const organismId = transcriptId.split(':')[1];
  const organism = organismId ? getOrganism(organismId) : undefined;
  if (organism) buildTranscriptPool(organism);

  for (const entries of poolCache.values()) {
    const hit = entries.find((e) => e.transcript.id === transcriptId);
    if (hit) return hit.transcript;
  }
  return undefined;
}
