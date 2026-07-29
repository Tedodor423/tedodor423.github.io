import type { DiscoverRequest, DiscoverResultSet, TargetGene, Transcript } from '../types';
import { getOrganism } from './organisms';
import { transcriptsForClass, registerCustomTranscript } from './transcripts';
import { rngFor } from './prng';
import { gcContent } from './sequence';

function buildSparkline(rng: import('./prng').Rng): number[] {
  let v = rng.range(0.3, 0.7);
  const out: number[] = [];
  for (let i = 0; i < 8; i++) {
    v = Math.min(1, Math.max(0, v + rng.gaussian(0, 0.12)));
    out.push(v);
  }
  return out;
}

function buildTargetGene(transcript: Transcript): TargetGene {
  const rng = rngFor(`gene:${transcript.id}`);
  const evidence = rng.weightedPick<'high' | 'moderate' | 'low'>([
    ['high', 0.45],
    ['moderate', 0.35],
    ['low', 0.2],
  ]);
  return {
    id: `gene:${transcript.id}`,
    transcriptId: transcript.id,
    symbol: transcript.geneSymbol,
    accession: transcript.accession,
    lengthNt: transcript.lengthNt,
    conservationScore: rng.range(0.4, 0.98),
    expressionEvidence: evidence,
    sparkline: buildSparkline(rng),
    description: transcript.description,
  };
}

export function discoverTargets(req: DiscoverRequest): DiscoverResultSet {
  if (req.targetClass === 'custom') {
    if (!req.customFasta) {
      return { organismId: req.organismId || 'custom', targetClass: 'custom', genes: [] };
    }
    const rng = rngFor(`custom:${req.customFasta.length}:${req.customFasta.slice(0, 40)}`);
    const cleanedSeq = req.customFasta
      .split(/\r?\n/)
      .filter((l) => !l.startsWith('>'))
      .join('')
      .toUpperCase()
      .replace(/T/g, 'U')
      .replace(/[^ACGU]/g, '');
    const transcript: Transcript = {
      id: `transcript:custom:${rng.int(1000, 9999)}`,
      organismId: 'custom',
      geneSymbol: 'CUSTOM-1',
      accession: 'user-submitted',
      lengthNt: cleanedSeq.length,
      gcContent: gcContent(cleanedSeq),
      description: 'User-submitted custom sequence',
      sequence: cleanedSeq,
    };
    registerCustomTranscript(transcript);
    return {
      organismId: 'custom',
      targetClass: 'custom',
      genes: [buildTargetGene(transcript)],
    };
  }

  const organism = getOrganism(req.organismId);
  if (!organism) {
    return { organismId: req.organismId, targetClass: req.targetClass, genes: [] };
  }
  const pool = transcriptsForClass(organism, req.targetClass);
  const rng = rngFor(`discover:${organism.id}:${req.targetClass}`);
  const ranked = rng
    .shuffle(pool)
    .slice(0, Math.min(req.numCandidates, pool.length))
    .map(buildTargetGene)
    .sort((a, b) => b.conservationScore - a.conservationScore);

  return { organismId: organism.id, targetClass: req.targetClass, genes: ranked };
}
