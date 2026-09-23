import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ScanLine } from 'lucide-react';
import type { Organism, OffTargetReport, SirnaCandidate } from '@/lib/api/types';

export interface OffTargetSweepProps {
  candidates: SirnaCandidate[];
  report: OffTargetReport;
  species: Organism[];
  revealedCount: number;
  reducedMotion?: boolean;
}

interface RejectionInfo {
  speciesLabel: string;
  kmer?: string;
  geneSymbol?: string;
}

export function OffTargetSweep({ candidates, report, species, revealedCount, reducedMotion }: OffTargetSweepProps) {
  const revealedSpecies = species.slice(0, revealedCount);
  const revealedIds = new Set(revealedSpecies.map((s) => s.id));

  const rejectionByCandidate = useMemo(() => {
    const map = new Map<string, RejectionInfo>();
    for (const cell of report.cells) {
      if (!cell.isHit || !revealedIds.has(cell.speciesId)) continue;
      if (map.has(cell.candidateId)) continue;
      const sp = species.find((s) => s.id === cell.speciesId);
      map.set(cell.candidateId, {
        speciesLabel: sp?.commonName ?? cell.speciesId,
        kmer: cell.kmer,
        geneSymbol: cell.hitGeneSymbol,
      });
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report, revealedCount, species]);

  const [rejectedTray, setRejectedTray] = useState<string[]>([]);
  const [trayOpen, setTrayOpen] = useState(false);

  useEffect(() => {
    const newlyRejected = candidates
      .filter((c) => rejectionByCandidate.has(c.id))
      .map((c) => c.id)
      .filter((id) => !rejectedTray.includes(id));
    if (newlyRejected.length === 0) return;
    const delay = reducedMotion ? 0 : 380;
    const t = setTimeout(() => {
      setRejectedTray((prev) => [...prev, ...newlyRejected]);
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rejectionByCandidate]);

  const activeCandidates = candidates.filter((c) => !rejectedTray.includes(c.id));
  const currentSpecies = species[Math.min(revealedCount, species.length - 1)];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-paper/70">
          <ScanLine size={14} className={revealedCount < species.length ? 'animate-pulse text-brand-yellow' : ''} />
          <span className="data-text text-xs">
            {revealedCount < species.length
              ? `Sweeping ${currentSpecies?.commonName ?? ''}…`
              : 'Sweep complete'}
          </span>
        </div>
        <span className="data-text text-xs text-paper/50">
          {activeCandidates.length} of {candidates.length} candidates remaining
        </span>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {activeCandidates.map((c) => {
            const flagged = rejectionByCandidate.has(c.id) && !rejectedTray.includes(c.id);
            const info = rejectionByCandidate.get(c.id);
            return (
              <motion.div
                key={c.id}
                layout
                initial={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 40, scale: 0.9 }}
                transition={{ duration: reducedMotion ? 0.05 : 0.3 }}
                className={`flex items-center justify-between border px-3 py-2 ${
                  flagged ? 'border-hit bg-hit/10' : 'border-navy-tint bg-navy'
                }`}
              >
                <span className={`seq-text text-xs ${flagged ? 'text-hit line-through decoration-2' : 'text-paper'}`}>
                  {c.senseSeq}
                </span>
                <span className="data-text text-[10px] text-paper/50">
                  {flagged ? `hit · ${info?.speciesLabel}` : `${(c.efficacyScore * 100).toFixed(0)}% eff.`}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <button
        onClick={() => setTrayOpen((v) => !v)}
        className="data-text mt-4 flex w-full items-center justify-between border border-navy-tint px-3 py-2 text-xs text-paper/60 hover:border-paper/30"
      >
        <span>
          Rejected tray — {rejectedTray.length} candidate{rejectedTray.length === 1 ? '' : 's'}
        </span>
        <ChevronDown size={13} className={`transition-transform ${trayOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {trayOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1.5">
              {rejectedTray.map((id) => {
                const c = candidates.find((cc) => cc.id === id);
                const info = rejectionByCandidate.get(id);
                if (!c) return null;
                return (
                  <div key={id} className="flex items-center justify-between border border-hit/40 bg-hit/5 px-3 py-2">
                    <span className="seq-text text-xs text-hit/80 line-through">{c.senseSeq}</span>
                    <span className="data-text text-[10px] text-paper/50">
                      {info?.geneSymbol ? `≈ ${info.geneSymbol}` : ''} in {info?.speciesLabel}
                    </span>
                  </div>
                );
              })}
              {rejectedTray.length === 0 && (
                <p className="px-1 py-2 text-xs text-paper/40">Nothing rejected yet.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
