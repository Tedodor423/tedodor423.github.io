import type {
  CassetteDesign,
  CassetteFeature,
  CassetteRequest,
  DeliveryChassis,
  GoldenGateSite,
  SirnaCandidate,
} from '../types';
import { rngFor } from './prng';
import { generateSequence, toDna } from './sequence';

const CHASSIS_LABELS: Record<
  DeliveryChassis,
  { promoter: string; terminator: string; marker: string; usesHomologyArms: boolean }
> = {
  'ecoli-ht115': {
    promoter: 'T7 promoter',
    terminator: 'T7 terminator',
    marker: 'AmpR (bla)',
    usesHomologyArms: false,
  },
  'hairpin-cassette': {
    promoter: 'T7 promoter',
    terminator: 'T7 terminator',
    marker: 'AmpR (bla)',
    usesHomologyArms: false,
  },
  'snodgrassella-alvi': {
    promoter: 'Ptrc constitutive promoter',
    terminator: 'rrnB T1 terminator',
    marker: 'SpecR (aadA)',
    usesHomologyArms: true,
  },
  's-cerevisiae': {
    promoter: 'GAL1 promoter',
    terminator: 'CYC1 terminator',
    marker: 'URA3',
    usesHomologyArms: true,
  },
};

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
  const labels = CHASSIS_LABELS[req.chassis];
  const rng = rngFor(`cassette:${req.chassis}:${req.topology}:${req.candidateIds.join(',')}`);

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

  const promoterSeq = toDna(generateSequence(rng, rng.int(60, 120), 0.55));
  const terminatorSeq = toDna(generateSequence(rng, rng.int(40, 70), 0.5));
  const markerSeq = toDna(generateSequence(rng, rng.int(600, 850), 0.5));
  const homologyArmSeq = () => toDna(generateSequence(rng, rng.int(300, 480), 0.4));

  const features: CassetteFeature[] = [];
  const parts: string[] = [];
  let cursor = 0;

  const push = (name: string, type: CassetteFeature['type'], seq: string, strand: 1 | -1 = 1) => {
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

  if (labels.usesHomologyArms) {
    push('5′ homology arm', 'homology-arm', homologyArmSeq(), 1);
  }

  push(labels.marker, 'marker', markerSeq, 1);

  if (req.topology === 'hairpin') {
    push(labels.promoter, 'promoter', promoterSeq, 1);
    push('shRNA insert', 'insert', insertSense + HAIRPIN_LOOP + insertAntisense, 1);
    push(labels.terminator, 'terminator', terminatorSeq, 1);
  } else {
    push(labels.promoter, 'promoter', promoterSeq, 1);
    push('dsRNA insert', 'insert', insertSense, 1);
    push(labels.terminator, 'terminator', terminatorSeq, 1);
    push(`${labels.promoter} (opposing)`, 'promoter', promoterSeq, -1);
  }

  if (labels.usesHomologyArms) {
    push('3′ homology arm', 'homology-arm', homologyArmSeq(), 1);
  }

  const sequence = parts.join('');
  const goldenGateSites = findGoldenGateSites(sequence);

  return {
    id: `cassette:${req.chassis}:${req.topology}:${req.candidateIds.length}`,
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
