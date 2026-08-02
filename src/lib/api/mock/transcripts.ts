import type { Organism, TargetClass, Transcript } from '../types';
import { rngFor } from './prng';
import { generateAccession, generateSequence } from './sequence';
import { getOrganism } from './organisms';
import {
  DEVELOPMENTAL_GENE_NAMES,
  ESSENTIAL_GENE_NAMES,
  geneSymbolFrom,
  HOUSEKEEPING_GENE_NAMES,
  POPULATION_CONTROL_GENE_NAMES,
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
  const lengthNt = rng.int(800, 3000);
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

  const entries: PoolEntry[] = [
    ...ESSENTIAL_GENE_NAMES.map((name, i) => buildEntry(organism, name, i, 'essential')),
    ...HOUSEKEEPING_GENE_NAMES.map((name, i) =>
      buildEntry(organism, name, i, 'essential' as TargetClass),
    ),
    ...POPULATION_CONTROL_GENE_NAMES.map((name, i) =>
      buildEntry(organism, name, i, 'population-control'),
    ),
    ...DEVELOPMENTAL_GENE_NAMES.map((name, i) => buildEntry(organism, name, i, 'developmental')),
  ];
  poolCache.set(organism.id, entries);
  return entries;
}

export function listTranscripts(organism: Organism): Transcript[] {
  return buildTranscriptPool(organism).map((e) => e.transcript);
}

export function transcriptsForClass(organism: Organism, targetClass: TargetClass): Transcript[] {
  const pool = buildTranscriptPool(organism);
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
