import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Eye, Dna } from 'lucide-react';
import { getApi } from '@/lib/api/client';
import { useJob } from '@/lib/hooks/useJob';
import { useElementSize } from '@/lib/hooks/useElementSize';
import type { FoldingProfile, SirnaCandidate } from '@/lib/api/types';
import { useWizardStore } from '@/store/wizardStore';
import { ClippedPanel } from '@/components/ui/ClippedPanel';
import { Button } from '@/components/ui/Button';
import { CombProgress } from '@/components/ui/CombProgress';
import { FoldedStructure } from '@/components/viz/FoldedStructure';
import { AccessibilityTrack } from '@/components/viz/AccessibilityTrack';
import { SirnaDocking } from '@/components/viz/SirnaDocking';
import { Tooltip } from '@/components/ui/Tooltip';

export function FoldingScreen() {
  const navigate = useNavigate();
  const store = useWizardStore();
  const reducedMotion = useWizardStore((s) => s.reducedMotion);

  const geneList = useMemo(
    () =>
      store.selectedGeneIds
        .map((id) => store.discoveredGenes.find((g) => g.id === id))
        .filter((g): g is NonNullable<typeof g> => Boolean(g)),
    [store.selectedGeneIds, store.discoveredGenes],
  );

  const [activeGeneId, setActiveGeneId] = useState<string | null>(geneList[0]?.id ?? null);
  useEffect(() => {
    if (!geneList.some((g) => g.id === activeGeneId)) {
      setActiveGeneId(geneList[0]?.id ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geneList]);

  const gene = geneList.find((g) => g.id === activeGeneId) ?? null;
  const transcriptId = gene?.transcriptId ?? null;

  const isGeneReady = useCallback(
    (transcriptId: string) =>
      Boolean(store.foldingProfiles[transcriptId]) &&
      store.sirnaCandidates.some((c) => c.transcriptId === transcriptId),
    [store.foldingProfiles, store.sirnaCandidates],
  );

  const startFold = useCallback(() => {
    if (!transcriptId) return Promise.reject(new Error('no transcript selected'));
    return getApi().foldTranscript(transcriptId);
  }, [transcriptId]);
  const { job: foldJob } = useJob<FoldingProfile>(transcriptId ? startFold : null, [transcriptId]);

  const startTile = useCallback(() => {
    if (!transcriptId) return Promise.reject(new Error('no transcript selected'));
    return getApi().tileSirnas(transcriptId, {
      length: store.sirnaLength,
      seedFiltering: store.seedFiltering,
      accessibilityWeighting: true,
    });
  }, [transcriptId, store.sirnaLength, store.seedFiltering]);
  const { job: tileJob } = useJob<SirnaCandidate[]>(transcriptId ? startTile : null, [
    transcriptId,
    store.sirnaLength,
  ]);

  useEffect(() => {
    if (foldJob?.status === 'succeeded' && foldJob.result && transcriptId) {
      store.setFoldingProfile(transcriptId, foldJob.result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foldJob?.status, transcriptId]);

  useEffect(() => {
    if (tileJob?.status === 'succeeded' && tileJob.result && transcriptId) {
      store.addSirnaCandidates(transcriptId, tileJob.result);
      if (!store.selectedCandidateId && tileJob.result.length > 0) {
        store.setSelectedCandidateId(tileJob.result[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tileJob?.status, transcriptId]);

  const [colorMode, setColorMode] = useState<'base' | 'accessibility'>('base');
  const [range, setRange] = useState<[number, number]>([0, 150]);
  const { ref: structureRef, size: structureSize } = useElementSize<HTMLDivElement>();

  const profile = transcriptId ? (store.foldingProfiles[transcriptId] ?? null) : null;
  const activeCandidates = useMemo(
    () => store.sirnaCandidates.filter((c) => c.transcriptId === transcriptId),
    [store.sirnaCandidates, transcriptId],
  );
  const candidates = activeCandidates.slice(0, 14);
  const trackCandidates = activeCandidates.slice(0, 60);
  const selectedCandidate = store.sirnaCandidates.find((c) => c.id === store.selectedCandidateId) ?? null;
  const dockingProfile = selectedCandidate ? (store.foldingProfiles[selectedCandidate.transcriptId] ?? null) : null;

  useEffect(() => {
    if (profile) setRange([0, Math.min(150, profile.sequence.length)]);
  }, [profile?.transcriptId]); // eslint-disable-line react-hooks/exhaustive-deps

  const bothReady = foldJob?.status === 'succeeded' && tileJob?.status === 'succeeded' && profile;
  const allGenesReady = geneList.length > 0 && geneList.every((g) => isGeneReady(g.transcriptId));
  const pendingGenes = geneList.filter((g) => !isGeneReady(g.transcriptId));

  if (geneList.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-paper/70">No gene selected yet.</p>
        <Button className="mt-4" onClick={() => navigate('/discover')}>
          Back to target discovery
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10">
      <header className="mb-6">
        <span className="data-text text-xs font-bold tracking-[0.25em] text-brand-yellow uppercase">
          Step 04
        </span>
        <h1 className="font-display mt-1 text-4xl text-paper sm:text-5xl">Accessibility &amp; folding</h1>
        <p className="mt-2 max-w-2xl text-sm text-paper/65">
          <Dna size={13} className="mr-1 inline" />
          {gene?.symbol} · {gene?.accession} — occlusion renders as capping: an open cell shows its
          base colour, a capped cell is sealed by the transcript's own fold.
        </p>
      </header>

      {geneList.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {geneList.map((g) => {
            const ready = isGeneReady(g.transcriptId);
            const active = g.id === activeGeneId;
            return (
              <Tooltip
                key={g.id}
                label={ready ? `${g.symbol} — folded and tiled.` : `${g.symbol} — switch here to fold and tile it.`}
              >
                <button
                  onClick={() => setActiveGeneId(g.id)}
                  className={`data-text flex items-center gap-2 border px-3 py-2 text-xs font-bold transition-colors ${
                    active ? 'border-brand-yellow bg-brand-yellow/10 text-brand-yellow' : 'border-navy-tint text-paper/60 hover:border-paper/30'
                  }`}
                >
                  <span
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${ready ? 'bg-pass text-navy-deep' : 'bg-navy-tint text-transparent'}`}
                  >
                    <Check size={9} strokeWidth={4} />
                  </span>
                  {g.symbol}
                </button>
              </Tooltip>
            );
          })}
        </div>
      )}

      {(!bothReady || foldJob?.status !== 'succeeded' || tileJob?.status !== 'succeeded') && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {foldJob && foldJob.status !== 'succeeded' && (
            <ClippedPanel cut={12}>
              <div className="p-5">
                <div className="mb-2 text-xs text-paper/50">Folding transcript</div>
                <CombProgress progress={foldJob.progress} stage={foldJob.stage} reduceMotion={reducedMotion} cellCount={20} />
              </div>
            </ClippedPanel>
          )}
          {tileJob && tileJob.status !== 'succeeded' && (
            <ClippedPanel cut={12}>
              <div className="p-5">
                <div className="mb-2 text-xs text-paper/50">Tiling siRNA candidates</div>
                <CombProgress progress={tileJob.progress} stage={tileJob.stage} reduceMotion={reducedMotion} cellCount={20} />
              </div>
            </ClippedPanel>
          )}
        </div>
      )}

      {bothReady && profile && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[55fr_45fr]">
          <ClippedPanel cut={16} bg="var(--color-navy)">
            <div className="flex items-center justify-between border-b border-navy-tint/60 p-4">
              <span className="data-text text-[11px] tracking-widest text-paper/50 uppercase">
                Folded structure · window {range[0]}–{range[1]}
              </span>
              <div className="flex gap-1">
                <Tooltip label="Colour each nucleotide by its identity (A/U/G/C).">
                  <button
                    onClick={() => setColorMode('base')}
                    className={`data-text px-2 py-1 text-[10px] font-bold uppercase ${colorMode === 'base' ? 'bg-brand-yellow text-ink' : 'text-paper/50'}`}
                  >
                    Base
                  </button>
                </Tooltip>
                <Tooltip label="Colour each nucleotide by how accessible it is — navy is occluded, yellow is open.">
                  <button
                    onClick={() => setColorMode('accessibility')}
                    className={`data-text flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase ${colorMode === 'accessibility' ? 'bg-brand-yellow text-ink' : 'text-paper/50'}`}
                  >
                    <Eye size={10} /> Accessibility
                  </button>
                </Tooltip>
              </div>
            </div>
            <div ref={structureRef} style={{ height: 520 }}>
              {structureSize.width > 0 && (
                <FoldedStructure
                  profile={profile}
                  range={range}
                  colorMode={colorMode}
                  reducedMotion={reducedMotion}
                  width={structureSize.width}
                  height={structureSize.height}
                  highlightRange={
                    selectedCandidate &&
                    selectedCandidate.transcriptId === transcriptId &&
                    selectedCandidate.position < range[1] &&
                    selectedCandidate.position + selectedCandidate.length > range[0]
                      ? [selectedCandidate.position, selectedCandidate.position + selectedCandidate.length]
                      : null
                  }
                  highlightLabel={selectedCandidate ? `${(selectedCandidate.efficacyScore * 100).toFixed(0)}% efficacy` : undefined}
                />
              )}
            </div>
          </ClippedPanel>

          <div className="space-y-6">
            <ClippedPanel cut={14}>
              <div className="p-4">
                <AccessibilityTrack
                  profile={profile}
                  candidates={trackCandidates}
                  selectedCandidateId={store.selectedCandidateId}
                  onSelectCandidate={store.setSelectedCandidateId}
                  range={range}
                  onRangeChange={setRange}
                  reducedMotion={reducedMotion}
                />
              </div>
            </ClippedPanel>

            <ClippedPanel cut={14}>
              <div className="max-h-64 overflow-x-auto overflow-y-auto">
                <table className="w-full table-fixed border-collapse">
                  <colgroup>
                    <col className="w-14" />
                    <col />
                    <col className="w-16" />
                    <col className="w-16" />
                  </colgroup>
                  <thead className="sticky top-0 bg-navy">
                    <tr className="data-text border-b border-navy-tint text-left text-[10px] tracking-widest text-paper/45 uppercase">
                      <th className="px-3 py-2 font-normal">
                        <Tooltip label="Start coordinate of this candidate on the transcript, 0-based.">
                          <span>Pos</span>
                        </Tooltip>
                      </th>
                      <th className="px-3 py-2 font-normal">
                        <Tooltip label="Sense-strand sequence of the target site — click a row to inspect it, or select it below.">
                          <span>Sense</span>
                        </Tooltip>
                      </th>
                      <th className="px-3 py-2 font-normal">
                        <Tooltip label="Composite predicted knockdown efficacy — weighted from accessibility, GC content, and seed-region risk.">
                          <span>Effic.</span>
                        </Tooltip>
                      </th>
                      <th className="px-3 py-2 font-normal">
                        <Tooltip label="Mean unpaired probability across this candidate's footprint — higher means less occluded by the fold.">
                          <span>Access.</span>
                        </Tooltip>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => {
                          store.setSelectedCandidateId(c.id);
                          setRange([
                            Math.max(0, c.position - 40),
                            Math.min(profile.sequence.length, c.position + c.length + 40),
                          ]);
                        }}
                        className={`data-text cursor-pointer border-b border-navy-tint/40 text-xs hover:bg-navy-tint/25 ${
                          c.id === store.selectedCandidateId ? 'bg-brand-yellow/10' : ''
                        } ${c.isSeedFiltered ? 'opacity-40' : ''}`}
                      >
                        <td className="px-3 py-2 text-paper/60">{c.position}</td>
                        <td className="seq-text truncate px-3 py-2 text-paper" title={c.senseSeq}>
                          {c.senseSeq}
                        </td>
                        <td className="px-3 py-2 text-brand-yellow">{(c.efficacyScore * 100).toFixed(0)}%</td>
                        <td className="px-3 py-2 text-paper/60">{(c.accessibility * 100).toFixed(0)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ClippedPanel>

            {selectedCandidate && dockingProfile && (
              <ClippedPanel cut={14} bg="var(--color-navy-tint)">
                <div className="p-5">
                  <div className="data-text mb-3 text-[11px] tracking-widest text-paper/60 uppercase">
                    Docking preview — {selectedCandidate.senseSeq}
                  </div>
                  <SirnaDocking profile={dockingProfile} candidate={selectedCandidate} reducedMotion={reducedMotion} />
                </div>
              </ClippedPanel>
            )}
          </div>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/discover')}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="flex items-center gap-4">
          {!allGenesReady && pendingGenes.length > 0 && (
            <span className="data-text text-xs text-caution">
              Still need: {pendingGenes.map((g) => g.symbol).join(', ')}
            </span>
          )}
          <Button disabled={!allGenesReady} onClick={() => navigate('/screen')}>
            Continue to off-target screening
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
