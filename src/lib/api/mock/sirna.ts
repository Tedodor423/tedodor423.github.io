import type { SirnaCandidate, TilingOpts } from '../types';
import { getFold } from './fold';
import { rngFor } from './prng';
import { gcContent, reverseComplement } from './sequence';

/** Motifs a seed-region filter would flag (position 2-8 of the antisense
 * strand) — simplistic stand-ins for real off-target seed-match heuristics. */
const SEED_RISK_MOTIFS = ['AAAA', 'UUUU', 'GGGG', 'CCCC'];

const candidateCache = new Map<string, SirnaCandidate>();

export function getCandidateById(id: string): SirnaCandidate | undefined {
  return candidateCache.get(id);
}

export function tileSirnas(transcriptId: string, opts: TilingOpts): SirnaCandidate[] {
  const fold = getFold(transcriptId);
  const { sequence, unpairedProbability } = fold;
  const stride = opts.accessibilityWeighting ? 2 : 3;
  const candidates: SirnaCandidate[] = [];

  for (let pos = 0; pos + opts.length <= sequence.length; pos += stride) {
    const rng = rngFor(`sirna:${transcriptId}:${pos}:${opts.length}`);
    const senseSeq = sequence.slice(pos, pos + opts.length);
    const antisenseSeq = reverseComplement(senseSeq);
    const footprint = unpairedProbability.slice(pos, pos + opts.length);
    const accessibility = footprint.reduce((a, b) => a + b, 0) / footprint.length;

    const gc = gcContent(senseSeq);
    const gcPenalty = Math.abs(gc - 0.42); // real siRNAs favour moderate GC
    const seedWindow = antisenseSeq.slice(1, 8);
    const seedRisk = SEED_RISK_MOTIFS.some((m) => seedWindow.includes(m));
    const isSeedFiltered = opts.seedFiltering && seedRisk;

    const deltaGDuplex = -20 - gc * 12 - rng.range(0, 3); // stronger (more negative) with higher GC
    const deltaGOpen = (1 - accessibility) * 12 + rng.range(-0.5, 0.5); // occluded sites cost more to open

    let efficacyScore =
      0.5 * accessibility + 0.3 * (1 - gcPenalty * 2.2) + 0.2 * rng.range(0.6, 1);
    if (isSeedFiltered) efficacyScore *= 0.35;
    efficacyScore = Math.min(0.98, Math.max(0.03, efficacyScore));

    const candidate: SirnaCandidate = {
      id: `sirna:${transcriptId}:${opts.length}:${pos}`,
      transcriptId,
      position: pos,
      length: opts.length,
      senseSeq,
      antisenseSeq,
      efficacyScore,
      accessibility,
      deltaGDuplex,
      deltaGOpen: Math.max(0, deltaGOpen),
      isSeedFiltered,
    };
    candidateCache.set(candidate.id, candidate);
    candidates.push(candidate);
  }

  return candidates.sort((a, b) => b.efficacyScore - a.efficacyScore);
}
