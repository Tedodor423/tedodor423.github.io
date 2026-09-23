import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { getApi } from '@/lib/api/client';
import { useJob } from '@/lib/hooks/useJob';
import type { Organism, OffTargetReport } from '@/lib/api/types';
import { useWizardStore } from '@/store/wizardStore';
import { ClippedPanel } from '@/components/ui/ClippedPanel';
import { Button } from '@/components/ui/Button';
import { CombProgress } from '@/components/ui/CombProgress';
import { HexMatrix } from '@/components/ui/HexMatrix';
import { OffTargetSweep } from '@/components/viz/OffTargetSweep';
import { Tooltip } from '@/components/ui/Tooltip';

const CANDIDATE_LIMIT = 10;

export function OffTargetScreening() {
  const navigate = useNavigate();
  const store = useWizardStore();
  const reducedMotion = useWizardStore((s) => s.reducedMotion);

  const screenedCandidates = useMemo(
    () =>
      store.sirnaCandidates
        .filter((c) => !c.isSeedFiltered)
        .slice(0, CANDIDATE_LIMIT),
    [store.sirnaCandidates],
  );

  const [species, setSpecies] = useState<Organism[]>([]);
  useEffect(() => {
    getApi()
      .searchOrganisms('')
      .then((all) => setSpecies(all.filter((o) => store.screenSpeciesIds.includes(o.id))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.screenSpeciesIds]);

  const start = useCallback(() => {
    return getApi().screenOffTargets({
      candidateIds: screenedCandidates.map((c) => c.id),
      speciesIds: store.screenSpeciesIds,
      contiguousMatchThreshold: store.contiguousMatchThreshold,
    });
  }, [screenedCandidates, store.screenSpeciesIds, store.contiguousMatchThreshold]);

  const { job } = useJob<OffTargetReport>(
    screenedCandidates.length > 0 && store.screenSpeciesIds.length > 0 ? start : null,
    [screenedCandidates.length, store.screenSpeciesIds.join(','), store.contiguousMatchThreshold],
  );

  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (job?.status === 'succeeded' && job.result) {
      store.setOffTargetReport(job.result);
      setRevealedCount(reducedMotion ? species.length : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.status]);

  useEffect(() => {
    if (job?.status !== 'succeeded' || reducedMotion) return;
    if (revealedCount >= species.length) return;
    const t = setTimeout(() => setRevealedCount((c) => c + 1), 450);
    return () => clearTimeout(t);
  }, [job?.status, revealedCount, species.length, reducedMotion]);

  const sweepDone = job?.status === 'succeeded' && revealedCount >= species.length;
  const [hoverCell, setHoverCell] = useState<{ candidateId: string; speciesId: string } | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <span className="data-text text-xs font-bold tracking-[0.25em] text-brand-yellow uppercase">
          Step 05
        </span>
        <h1 className="font-display mt-1 text-4xl text-paper sm:text-5xl">Off-target screening</h1>
        <p className="mt-2 max-w-xl text-sm text-paper/65">
          Screening {screenedCandidates.length} candidates against {species.length} species at a{' '}
          {store.contiguousMatchThreshold} nt contiguous-match threshold.
        </p>
      </header>

      {store.screenSpeciesIds.length === 0 && (
        <EmptyStateNotice
          message="No species are selected for screening. Off-target screening has nothing to check against."
          actionLabel="Back to run configuration"
          onAction={() => navigate('/configure')}
        />
      )}

      {store.screenSpeciesIds.length > 0 && screenedCandidates.length === 0 && (
        <EmptyStateNotice
          message="No siRNA candidates survived seed-region filtering, or none were tiled yet. There's nothing to screen."
          actionLabel="Back to accessibility & folding"
          onAction={() => navigate('/fold')}
        />
      )}

      {job && job.status !== 'succeeded' && (
        <ClippedPanel cut={14} className="mb-8">
          <div className="p-6">
            <CombProgress progress={job.progress} stage={job.stage} reduceMotion={reducedMotion} />
          </div>
        </ClippedPanel>
      )}

      {job?.status === 'succeeded' && store.offTargetReport && !sweepDone && (
        <ClippedPanel cut={14}>
          <div className="p-6">
            <OffTargetSweep
              candidates={screenedCandidates}
              report={store.offTargetReport}
              species={species}
              revealedCount={revealedCount}
              reducedMotion={reducedMotion}
            />
          </div>
        </ClippedPanel>
      )}

      {sweepDone && store.offTargetReport && (
        <ClippedPanel cut={14}>
          <div className="p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="data-text text-[11px] tracking-widest text-paper/50 uppercase">
                Result matrix — {store.offTargetReport.survivorIds.length} survivor
                {store.offTargetReport.survivorIds.length === 1 ? '' : 's'}
              </span>
              <div className="data-text flex items-center gap-4 text-[11px] text-paper/60">
                <Tooltip label="Longest contiguous match is well below the threshold — low off-target risk.">
                  <Legend color="var(--color-pass)" label="Pass" />
                </Tooltip>
                <Tooltip label="Longest contiguous match is close to the threshold (70%+) but hasn't crossed it — worth a second look.">
                  <Legend color="var(--color-caution)" label="Caution" />
                </Tooltip>
                <Tooltip label="Longest contiguous match meets or exceeds the threshold — this candidate is rejected against this species.">
                  <Legend color="var(--color-hit)" label="Hit" />
                </Tooltip>
                <Tooltip label="This species has no reference transcriptome, so it can't be screened — shown explicitly rather than silently passing.">
                  <Legend hatched label="Unscreenable" />
                </Tooltip>
              </div>
            </div>

            <HexMatrix
              rowLabels={screenedCandidates.map((c) => ({ id: c.id, label: c.senseSeq }))}
              colLabels={species.map((s) => ({ id: s.id, label: s.commonName }))}
              threshold={store.contiguousMatchThreshold}
              onCellHover={(rowId, colId, datum) =>
                setHoverCell(datum ? { candidateId: rowId, speciesId: colId } : null)
              }
              getCell={(rowId, colId) =>
                store.offTargetReport!.cells.find((c) => c.candidateId === rowId && c.speciesId === colId)
              }
            />

            <div className="data-text mt-4 min-h-10 border-t border-navy-tint pt-3 text-xs text-paper/60">
              {hoverCell
                ? (() => {
                    const cell = store.offTargetReport!.cells.find(
                      (c) => c.candidateId === hoverCell.candidateId && c.speciesId === hoverCell.speciesId,
                    );
                    if (!cell) return null;
                    if (cell.unscreenable) return 'No reference transcriptome for this species — not screened.';
                    if (!cell.isHit) return `Longest contiguous match: ${cell.longestMatch} nt — below threshold.`;
                    return (
                      <span>
                        <span className="text-hit">{cell.longestMatch} nt match</span> against{' '}
                        {cell.hitGeneSymbol} ({cell.hitTranscriptAccession}) · k-mer{' '}
                        <span className="seq-text text-paper">{cell.kmer}</span>
                      </span>
                    );
                  })()
                : 'Hover a cell to see the alignment.'}
            </div>
          </div>
        </ClippedPanel>
      )}

      <div className="mt-10 flex justify-between">
        <Button variant="ghost" onClick={() => navigate('/fold')}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button disabled={!sweepDone} onClick={() => navigate('/cassette')}>
          Continue to cassette builder
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function EmptyStateNotice({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <ClippedPanel cut={14} bg="var(--color-navy-tint)" className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3 text-paper/85">
          <AlertTriangle size={18} className="shrink-0 text-caution" />
          <p className="text-sm">{message}</p>
        </div>
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </ClippedPanel>
  );
}

function Legend({ color, label, hatched }: { color?: string; label: string; hatched?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-2.5"
        style={hatched ? { background: 'var(--color-navy-tint)', border: '1px dashed var(--color-navy-deep)' } : { background: color }}
      />
      {label}
    </span>
  );
}
