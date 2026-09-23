// Generic FASTA parsing/validation for the custom-sequence intake path. Not
// mock data — this would exist unchanged against a real backend, so it lives
// outside lib/api/mock and components may import it directly.

export type Base = 'A' | 'C' | 'G' | 'U';

export interface FastaRecord {
  header: string;
  sequence: string;
}

const VALID_BASE_RE = /[^ACGTUacgtu]/g;

export interface FastaValidation {
  records: FastaRecord[];
  totalLength: number;
  invalidCharCount: number;
  composition: Record<Base, number>;
  isValid: boolean;
  error?: string;
}

/** Parse + validate pasted FASTA. Accepts DNA or RNA input and normalises to
 * RNA (U) internally. */
export function validateFasta(text: string): FastaValidation {
  const trimmed = text.trim();
  const empty: FastaValidation = {
    records: [],
    totalLength: 0,
    invalidCharCount: 0,
    composition: { A: 0, C: 0, G: 0, U: 0 },
    isValid: false,
    error: 'Paste at least one FASTA record.',
  };
  if (!trimmed) return empty;

  const records: FastaRecord[] = [];
  const lines = trimmed.split(/\r?\n/);
  let currentHeader: string | null = null;
  let currentSeq: string[] = [];
  let invalidCharCount = 0;

  const flush = () => {
    if (currentHeader !== null) {
      records.push({ header: currentHeader, sequence: currentSeq.join('') });
    }
  };

  for (const line of lines) {
    if (line.startsWith('>')) {
      flush();
      currentHeader = line.slice(1).trim() || 'untitled sequence';
      currentSeq = [];
    } else if (line.trim()) {
      const cleaned = line.trim();
      invalidCharCount += (cleaned.match(VALID_BASE_RE) ?? []).length;
      currentSeq.push(cleaned.replace(VALID_BASE_RE, '').toUpperCase().replace(/T/g, 'U'));
    }
  }
  flush();

  if (records.length === 0) {
    return { ...empty, error: 'No ">" header found — paste FASTA-format sequence.' };
  }

  const composition: Record<Base, number> = { A: 0, C: 0, G: 0, U: 0 };
  let totalLength = 0;
  for (const r of records) {
    for (const c of r.sequence) {
      if (c in composition) {
        composition[c as Base]++;
        totalLength++;
      }
    }
  }

  if (totalLength < 50) {
    return {
      records,
      totalLength,
      invalidCharCount,
      composition,
      isValid: false,
      error: `Sequence too short (${totalLength} nt) — need at least 50 nt to tile candidates.`,
    };
  }

  return { records, totalLength, invalidCharCount, composition, isValid: true };
}
