import type { OffTargetHit, OffTargetReport, OffTargetRequest, SirnaCandidate } from '../types';
import { getOrganism } from './organisms';
import { rngFor } from './prng';
import { generateAccession } from './sequence';
import { HOUSEKEEPING_GENE_NAMES, geneSymbolFrom } from './genes';

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
  // Pollinators/relatives run a bit hotter than distant taxa — gives the
  // matrix a believable shape rather than uniform noise.
  const closeness = species.kind === 'pollinator' ? 1 : species.kind === 'human' ? 0.4 : 0.7;
  const longestMatch = Math.round(rng.gaussian(9 + closeness * 6, 4));
  const clamped = Math.max(4, Math.min(candidate.length, longestMatch));
  const isHit = clamped >= threshold;

  if (!isHit) {
    return { candidateId: candidate.id, speciesId, longestMatch: clamped, isHit, unscreenable: false };
  }

  const kmer = candidate.antisenseSeq.slice(0, Math.min(clamped, candidate.antisenseSeq.length));
  const geneName = rng.pick(HOUSEKEEPING_GENE_NAMES);
  return {
    candidateId: candidate.id,
    speciesId,
    longestMatch: clamped,
    isHit,
    unscreenable: false,
    kmer,
    hitGeneSymbol: geneSymbolFrom(geneName, rng.int(100, 999)),
    hitTranscriptAccession: generateAccession(rng),
    alignmentOffset: rng.int(0, 40),
  };
}

export function screenOffTargets(
  req: OffTargetRequest,
  candidates: SirnaCandidate[],
): OffTargetReport {
  const cells: OffTargetHit[] = [];
  const hitByCandidate = new Map<string, boolean>();

  for (const candidate of candidates) {
    let anyHit = false;
    for (const speciesId of req.speciesIds) {
      const cell = scoreCell(candidate, speciesId, req.contiguousMatchThreshold);
      cells.push(cell);
      if (cell.isHit) anyHit = true;
    }
    hitByCandidate.set(candidate.id, anyHit);
  }

  const survivorIds = candidates.filter((c) => !hitByCandidate.get(c.id)).map((c) => c.id);
  const rejectedIds = candidates.filter((c) => hitByCandidate.get(c.id)).map((c) => c.id);

  return { cells, survivorIds, rejectedIds };
}
