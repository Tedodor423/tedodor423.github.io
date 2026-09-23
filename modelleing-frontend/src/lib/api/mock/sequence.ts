import type { Rng } from './prng';

export { gcContent, reverseComplement, toDna } from '@/lib/sequenceUtils';

const BASES = ['A', 'C', 'G', 'U'] as const;
export type Base = (typeof BASES)[number];

/** Generate an RNA sequence biased toward a target GC content, in short runs
 * rather than per-base i.i.d. draws so the composition doesn't look uniform. */
export function generateSequence(rng: Rng, length: number, gcTarget: number): string {
  let out = '';
  let i = 0;
  while (i < length) {
    const runLen = Math.min(length - i, rng.int(1, 4));
    const isGc = rng.bool(gcTarget);
    const base = isGc ? rng.pick(['G', 'C'] as const) : rng.pick(['A', 'U'] as const);
    out += base.repeat(runLen);
    i += runLen;
  }
  return out;
}

const ACCESSION_PREFIXES = ['XM', 'NM', 'XR', 'NR'];

export function generateAccession(rng: Rng): string {
  const prefix = rng.pick(ACCESSION_PREFIXES);
  const digits = String(rng.int(1000000, 9999999));
  const version = rng.int(1, 3);
  return `${prefix}_${digits}.${version}`;
}
