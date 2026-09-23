import type {
  CassetteDesign,
  CassetteFeature,
  CassetteRequest,
  GoldenGateSite,
  SirnaCandidate,
} from '../types';
import { rngFor } from './prng';
import { generateSequence, toDna } from './sequence';
import { HOMOLOGY_ARM_CHASSIS, MARKERS_BY_CHASSIS, PROMOTERS_BY_CHASSIS } from '@/lib/cassetteOptions';

const HAIRPIN_LOOP = 'TTCAAGAGA'; // canonical short-hairpin loop spacer

interface Enzyme {
  name: GoldenGateSite['enzyme'];
  fwd: string;
  rev: string;
}

const ENZYMES: Enzyme[] = [
  { name: 'BsaI', fwd: 'GGTCTC', rev: 'GAGACC' },
  { name: 'BsmBI', fwd: 'CGTCTC', rev: 'GAGACG' },
  { name: 'SapI', fwd: 'GCTCTTC', rev: 'GAAGAGC' },
];

function findGoldenGateSites(sequence: string): GoldenGateSite[] {
  const sites: GoldenGateSite[] = [];
  for (const enzyme of ENZYMES) {
    for (const motif of [enzyme.fwd, enzyme.rev]) {
      let from = 0;
      let idx: number;
      while ((idx = sequence.indexOf(motif, from)) !== -1) {
        sites.push({ enzyme: enzyme.name, position: idx, sequence: motif, removed: false });
        from = idx + 1;
      }
    }
  }
  return sites.sort((a, b) => a.position - b.position);
}

export function buildCassette(
  req: CassetteRequest,
  candidates: SirnaCandidate[],
): CassetteDesign {
  const rng = rngFor(
    `cassette:${req.chassis}:${req.topology}:${req.promoterId}:${req.markerId}:${req.candidateIds.join(',')}`,
  );

  const insertSense = candidates
    .slice(0, 3)
    .map((c) => c.senseSeq)
    .join('')
    .replace(/U/g, 'T');
  const insertAntisense = candidates
    .slice(0, 3)
    .map((c) => c.antisenseSeq)
    .join('')
    .replace(/U/g, 'T');

  const features: CassetteFeature[] = [];
  const parts: string[] = [];
  let cursor = 0;

  const push = (name: string, type: CassetteFeature['type'], seq: string, strand: 1 | -1 = 1) => {
    const start = cursor;
    parts.push(seq);
    cursor += seq.length;
    features.push({ id: `feat-${features.length}`, name, type, start, end: cursor, strand });
  };

  if (req.topology === 'dumbbell') {
    // Cell-free enzymatic product — covalently closed loops at both ends,
    // no promoter/terminator/marker, because nothing expresses it in vivo.
    const loopCapSeq = () => toDna(generateSequence(rng, rng.int(8, 14), 0.5));
    push('5′ loop closure', 'loop', loopCapSeq(), 1);
    push('dsRNA duplex', 'insert', insertSense + HAIRPIN_LOOP + insertAntisense, 1);
    push('3′ loop closure', 'loop', loopCapSeq(), -1);
  } else {
    const promoterSpec =
      PROMOTERS_BY_CHASSIS[req.chassis].find((p) => p.id === req.promoterId) ??
      PROMOTERS_BY_CHASSIS[req.chassis][0];
    const markerSpec =
      MARKERS_BY_CHASSIS[req.chassis].find((m) => m.id === req.markerId) ??
      MARKERS_BY_CHASSIS[req.chassis][0];
    const usesHomologyArms = HOMOLOGY_ARM_CHASSIS.has(req.chassis);

    const promoterSeq = () => toDna(generateSequence(rng, rng.int(60, 120), 0.55));
    const terminatorSeq = () => toDna(generateSequence(rng, rng.int(40, 70), 0.5));
    const markerSeq = toDna(generateSequence(rng, rng.int(600, 850), 0.5));
    const homologyArmSeq = () => toDna(generateSequence(rng, rng.int(300, 480), 0.4));

    if (usesHomologyArms) push('5′ homology arm', 'homology-arm', homologyArmSeq(), 1);
    push(markerSpec.label, 'marker', markerSeq, 1);

    if (req.topology === 'hairpin') {
      push(promoterSpec.label, 'promoter', promoterSeq(), 1);
      push('shRNA insert', 'insert', insertSense + HAIRPIN_LOOP + insertAntisense, 1);
      push(promoterSpec.terminatorLabel, 'terminator', terminatorSeq(), 1);
    } else {
      // dual-promoter: opposing promoters transcribe the same insert from
      // both directions — each strand's transcription unit gets its own
      // matching terminator.
      push(promoterSpec.label, 'promoter', promoterSeq(), 1);
      push('dsRNA insert', 'insert', insertSense, 1);
      push(promoterSpec.terminatorLabel, 'terminator', terminatorSeq(), 1);
      push(`${promoterSpec.label} (opposing)`, 'promoter', promoterSeq(), -1);
      push(`${promoterSpec.terminatorLabel} (opposing)`, 'terminator', terminatorSeq(), -1);
    }

    if (usesHomologyArms) push('3′ homology arm', 'homology-arm', homologyArmSeq(), 1);
  }

  const sequence = parts.join('');
  const goldenGateSites = findGoldenGateSites(sequence);

  return {
    id: `cassette:${req.chassis}:${req.topology}:${req.promoterId}:${req.markerId}:${req.candidateIds.length}`,
    topology: req.topology,
    chassis: req.chassis,
    lengthBp: sequence.length,
    sequence,
    features,
    goldenGateSites,
  };
}

/** Silently break one recognition site by flipping a single interior base —
 * demonstrates the "detect and remove" interaction without claiming real
 * codon-aware synonymous substitution. */
export function removeGoldenGateSite(design: CassetteDesign, siteIndex: number): CassetteDesign {
  const site = design.goldenGateSites[siteIndex];
  if (!site || site.removed) return design;

  const rng = rngFor(`ggremove:${design.id}:${siteIndex}`);
  const mutatePos = site.position + Math.floor(site.sequence.length / 2);
  const current = design.sequence[mutatePos];
  const alternatives = ['A', 'C', 'G', 'T'].filter((b) => b !== current);
  const replacement = rng.pick(alternatives);
  const sequence =
    design.sequence.slice(0, mutatePos) + replacement + design.sequence.slice(mutatePos + 1);

  const goldenGateSites = design.goldenGateSites.map((s, i) =>
    i === siteIndex ? { ...s, removed: true } : s,
  );

  return { ...design, sequence, goldenGateSites };
}
