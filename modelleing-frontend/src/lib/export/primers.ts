import type { CassetteDesign, SirnaCandidate } from '@/lib/api/types';
import { reverseComplement, toDna } from '@/lib/sequenceUtils';

interface Primer {
  name: string;
  sequence: string;
  lengthNt: number;
  tmC: number;
  notes: string;
}

function wallaceTm(seq: string): number {
  let gc = 0;
  let at = 0;
  for (const c of seq.toUpperCase()) {
    if (c === 'G' || c === 'C') gc++;
    else if (c === 'A' || c === 'T') at++;
  }
  return 4 * gc + 2 * at;
}

export function buildPrimers(design: CassetteDesign, candidates: SirnaCandidate[]): Primer[] {
  const primers: Primer[] = [];
  const fwd = design.sequence.slice(0, 20);
  const rev = reverseComplement(toDna(design.sequence).slice(-20).replace(/T/g, 'U')).replace(/U/g, 'T');

  primers.push({
    name: 'cassette-F',
    sequence: fwd,
    lengthNt: fwd.length,
    tmC: wallaceTm(fwd),
    notes: 'Full-construct forward, anneals at position 1',
  });
  primers.push({
    name: 'cassette-R',
    sequence: rev,
    lengthNt: rev.length,
    tmC: wallaceTm(rev),
    notes: `Full-construct reverse, anneals at position ${design.lengthBp - 19}`,
  });

  const insertFeature = design.features.find((f) => f.type === 'insert');
  if (insertFeature) {
    candidates.slice(0, 3).forEach((c, i) => {
      const seq = toDna(c.senseSeq);
      primers.push({
        name: `check-insert-${i + 1}`,
        sequence: seq,
        lengthNt: seq.length,
        tmC: wallaceTm(seq),
        notes: `Verifies ${c.senseSeq.length} nt candidate at transcript pos ${c.position}`,
      });
    });
  }

  return primers;
}

export function primersToCsv(primers: Primer[]): string {
  const header = 'name,sequence,length_nt,tm_c,notes';
  const rows = primers.map(
    (p) => `${p.name},${p.sequence},${p.lengthNt},${p.tmC.toFixed(1)},"${p.notes}"`,
  );
  return [header, ...rows].join('\n') + '\n';
}
