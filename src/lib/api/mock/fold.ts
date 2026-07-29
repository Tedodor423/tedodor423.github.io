import type { FoldingProfile } from '../types';
import { rngFor } from './prng';
import { foldSequence } from './structure';
import { findTranscript } from './transcripts';

const foldCache = new Map<string, FoldingProfile>();

/** The single source of truth for a transcript's fold — reused by
 * FoldedStructure, AccessibilityTrack/CombStrip, and siRNA tiling so
 * accessibility numbers agree everywhere they appear. */
export function getFold(transcriptId: string): FoldingProfile {
  const cached = foldCache.get(transcriptId);
  if (cached) return cached;

  const transcript = findTranscript(transcriptId);
  const sequence = transcript?.sequence ?? '';
  const rng = rngFor(`fold:${transcriptId}`);
  const { dotBracket, pairs, unpairedProbability } = foldSequence(rng, sequence.length);
  const profile: FoldingProfile = { transcriptId, sequence, dotBracket, pairs, unpairedProbability };
  foldCache.set(transcriptId, profile);
  return profile;
}
