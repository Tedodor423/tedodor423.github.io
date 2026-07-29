import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronDown, TerminalSquare } from 'lucide-react';
import { getApi } from '@/lib/api/client';
import { useJob } from '@/lib/hooks/useJob';
import type { DiscoverResultSet } from '@/lib/api/types';
import { useWizardStore } from '@/store/wizardStore';
import { ClippedPanel } from '@/components/ui/ClippedPanel';
import { Button } from '@/components/ui/Button';
import { CombProgress } from '@/components/ui/CombProgress';
import { Sparkline } from '@/components/ui/Sparkline';

const EVIDENCE_LABEL: Record<string, string> = { high: 'High', moderate: 'Moderate', low: 'Low' };
const EVIDENCE_COLOR: Record<string, string> = { high: 'text-pass', moderate: 'text-caution', low: 'text-paper/50' };

export function TargetDiscovery() {
  const navigate = useNavigate();
  const store = useWizardStore();
  const reducedMotion = useWizardStore((s) => s.reducedMotion);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const lastDecile = useRef(-1);

  const start = useCallback(() => {
    return getApi().discoverTargets({
      organismId: store.organism?.id ?? 'custom',
      targetClass: store.targetClass ?? 'essential',
      numCandidates: store.numCandidates,
      customFasta: store.targetClass === 'custom' ? store.customFasta : undefined,
    });
  }, [store.organism?.id, store.targetClass, store.numCandidates, store.customFasta]);

  const { job } = useJob<DiscoverResultSet>(start, [
    store.organism?.id,
    store.targetClass,
    store.numCandidates,
  ]);

  useEffect(() => {
    if (!job) return;
    const decile = Math.floor(job.progress * 10);
    if (decile === lastDecile.current) return;
    lastDecile.current = decile;
    const orgName = store.organism?.scientificName ?? 'custom sequence';
    const messages: Record<number, string> = {
      0: `Connecting to ${orgName} transcriptome index…`,
      1: `Loaded ${store.organism?.transcriptCount.toLocaleString() ?? '1'} transcript records`,
      3: 'Scanning open reading frames for class-matched candidates',
      5: 'Cross-referencing conservation scores against sibling taxa',
      7: 'Pulling RNA-seq expression evidence per candidate',
      9: `Ranking ${store.numCandidates} candidate${store.numCandidates === 1 ? '' : 's'} by composite score`,
    };
    if (messages[decile]) setLogs((prev) => [...prev, messages[decile]]);
    if (job.status === 'succeeded') setLogs((prev) => [...prev, 'Discovery job complete.']);
  }, [job, store.organism, store.numCandidates]);

  useEffect(() => {
    if (job?.status === 'succeeded' && job.result) {
      store.setDiscoveredGenes(job.result.genes);
      if (!store.selectedGeneId && job.result.genes.length > 0) {
        store.setSelectedGeneId(job.result.genes[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.status]);

  const running = job && job.status !== 'succeeded' && job.status !== 'failed';
  const genes = store.discoveredGenes;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <span className="data-text text-xs font-bold tracking-[0.25em] text-brand-yellow uppercase">
          Step 03
        </span>
        <h1 className="font-display mt-1 text-4xl text-paper sm:text-5xl">Target discovery</h1>
        <p className="mt-2 max-w-xl text-sm text-paper/65">
          Scanning {store.organism?.commonName ?? 'the submitted sequence'} for{' '}
          {store.targetClass ?? 'candidate'} genes.
        </p>
      </header>

      {job && (
        <ClippedPanel cut={14} className="mb-8">
          <div className="p-6">
            <CombProgress progress={job.progress} stage={job.stage} reduceMotion={reducedMotion} />
            <div className="mt-5 flex items-center gap-2 text-paper/50">
              <TerminalSquare size={14} />
              <span className="data-text text-[11px] tracking-widest uppercase">Job log</span>
            </div>
            <div className="data-text mt-2 max-h-32 space-y-1 overflow-y-auto bg-navy-deep p-3 text-[11px] text-pass/80">
              {logs.map((l, i) => (
                <div key={i}>
                  <span className="text-paper/30">{`>`}</span> {l}
                </div>
              ))}
              {running && <div className="animate-pulse text-paper/40">▌</div>}
            </div>
          </div>
        </ClippedPanel>
      )}

      {job?.status === 'succeeded' && (
        <ClippedPanel cut={14}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="data-text border-b border-navy-tint text-left text-[11px] tracking-widest text-paper/50 uppercase">
                  <th className="px-4 py-3 font-normal">Symbol</th>
                  <th className="px-4 py-3 font-normal">Accession</th>
                  <th className="px-4 py-3 font-normal">Length</th>
                  <th className="px-4 py-3 font-normal">Conservation</th>
                  <th className="px-4 py-3 font-normal">Expression</th>
                  <th className="px-4 py-3 font-normal">Trend</th>
                  <th className="px-4 py-3 font-normal" />
                </tr>
              </thead>
              <tbody>
                {genes.map((g) => {
                  const isOpen = expanded === g.id;
                  const isSelected = store.selectedGeneId === g.id;
                  return (
                    <Fragment key={g.id}>
                      <tr
                        onClick={() => setExpanded(isOpen ? null : g.id)}
                        className={`data-text cursor-pointer border-b border-navy-tint/50 text-sm hover:bg-navy-tint/25 ${
                          isSelected ? 'bg-brand-yellow/5' : ''
                        }`}
                      >
                        <td className="px-4 py-3 font-bold text-paper">{g.symbol}</td>
                        <td className="px-4 py-3 text-paper/60">{g.accession}</td>
                        <td className="px-4 py-3 text-paper/60">{g.lengthNt.toLocaleString()} nt</td>
                        <td className="px-4 py-3 text-paper/70">{(g.conservationScore * 100).toFixed(0)}%</td>
                        <td className={`px-4 py-3 font-bold ${EVIDENCE_COLOR[g.expressionEvidence]}`}>
                          {EVIDENCE_LABEL[g.expressionEvidence]}
                        </td>
                        <td className="px-4 py-3">
                          <Sparkline values={g.sparkline} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <ChevronDown
                            size={14}
                            className={`inline-block text-paper/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="border-b border-navy-tint/50 bg-navy-deep">
                          <td colSpan={7} className="px-4 py-4">
                            <p className="mb-3 text-xs text-paper/60">{g.description}</p>
                            <Button
                              variant={isSelected ? 'secondary' : 'primary'}
                              onClick={() => store.setSelectedGeneId(g.id)}
                              className="text-xs"
                            >
                              {isSelected ? 'Selected for folding' : 'Use this gene'}
                            </Button>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ClippedPanel>
      )}

      <div className="mt-10 flex justify-between">
        <Button variant="ghost" onClick={() => navigate('/configure')}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button disabled={job?.status !== 'succeeded' || !store.selectedGeneId} onClick={() => navigate('/fold')}>
          Continue to folding
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
