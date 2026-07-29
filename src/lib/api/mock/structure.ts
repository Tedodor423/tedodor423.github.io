import type { Rng } from './prng';

/**
 * Compose a balanced dot-bracket string out of recognisable secondary-structure
 * elements (stems terminating in hairpin loops, multiloops formed when a stem's
 * interior holds more than one child element) rather than emitting random
 * brackets. This is what makes `FoldedStructure` resolve into loops and ladders
 * instead of a hairball.
 */
export function generateDotBracket(rng: Rng, length: number, depth = 0): string {
  let out = '';
  let remaining = length;

  while (remaining > 0) {
    const minStemFootprint = 9; // 3bp stem * 2 + 3nt loop minimum
    const canStem = remaining >= minStemFootprint && depth < 5;
    const wantsStem = canStem && rng.bool(0.5 - depth * 0.05);

    if (wantsStem) {
      const maxStem = Math.min(8, Math.floor((remaining - 3) / 2));
      const stemLen = rng.int(3, Math.max(3, maxStem));
      const maxInterior = remaining - 2 * stemLen;
      if (maxInterior < 3) {
        const dotLen = Math.min(remaining, rng.int(1, 5));
        out += '.'.repeat(dotLen);
        remaining -= dotLen;
        continue;
      }
      const interiorLen = rng.int(3, maxInterior);
      const interior = generateDotBracket(rng, interiorLen, depth + 1);
      out += '('.repeat(stemLen) + interior + ')'.repeat(stemLen);
      remaining -= 2 * stemLen + interiorLen;
    } else {
      const dotLen = Math.min(remaining, rng.int(1, 6));
      out += '.'.repeat(dotLen);
      remaining -= dotLen;
    }
  }

  return out;
}

/** Stack-parse a dot-bracket string into 0-based (i, j) pair indices. */
export function parsePairs(dotBracket: string): Array<[number, number]> {
  const stack: number[] = [];
  const pairs: Array<[number, number]> = [];
  for (let i = 0; i < dotBracket.length; i++) {
    const c = dotBracket[i];
    if (c === '(') stack.push(i);
    else if (c === ')') {
      const j = stack.pop();
      if (j !== undefined) pairs.push([j, i]);
    }
  }
  return pairs;
}

function smooth(values: number[], window: number): number[] {
  const out = new Array(values.length);
  const half = Math.floor(window / 2);
  for (let i = 0; i < values.length; i++) {
    let sum = 0;
    let n = 0;
    for (let k = -half; k <= half; k++) {
      const idx = i + k;
      if (idx >= 0 && idx < values.length) {
        sum += values[idx];
        n++;
      }
    }
    out[i] = sum / n;
  }
  return out;
}

/**
 * Derive per-position unpaired probability that is coherent with the fold:
 * paired positions land low, loop/flank positions land high, smoothed so
 * accessibility "breathes" a little at stem boundaries instead of stepping.
 */
export function deriveUnpairedProbability(rng: Rng, dotBracket: string): number[] {
  const raw = Array.from(dotBracket, (c) => {
    const base = c === '.' ? 0.88 : 0.1;
    return base + rng.gaussian(0, 0.06);
  });
  const smoothed = smooth(raw, 5);
  return smoothed.map((v) => Math.min(0.98, Math.max(0.02, v)));
}

export interface FoldOutput {
  dotBracket: string;
  pairs: Array<[number, number]>;
  unpairedProbability: number[];
}

export function foldSequence(rng: Rng, length: number): FoldOutput {
  const dotBracket = generateDotBracket(rng, length);
  const pairs = parsePairs(dotBracket);
  const unpairedProbability = deriveUnpairedProbability(rng, dotBracket);
  return { dotBracket, pairs, unpairedProbability };
}
