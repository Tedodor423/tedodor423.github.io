// Generic sequence utilities — pure functions, no randomness, no mock data.
// Safe for any component or export module to import directly.

export function gcContent(seq: string): number {
  let gc = 0;
  for (const c of seq) if (c === 'G' || c === 'C') gc++;
  return seq.length > 0 ? gc / seq.length : 0;
}

const COMPLEMENT: Record<string, string> = { A: 'U', U: 'A', T: 'A', G: 'C', C: 'G' };

export function reverseComplement(seq: string): string {
  let out = '';
  for (let i = seq.length - 1; i >= 0; i--) out += COMPLEMENT[seq[i]] ?? seq[i];
  return out;
}

export function toDna(seq: string): string {
  return seq.replace(/U/g, 'T');
}
