import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Scissors } from 'lucide-react';
import { getApi } from '@/lib/api/client';
import { useJob } from '@/lib/hooks/useJob';
import type { CassetteDesign, CassetteTopology } from '@/lib/api/types';
import { useWizardStore } from '@/store/wizardStore';
import { ClippedPanel } from '@/components/ui/ClippedPanel';
import { Button } from '@/components/ui/Button';
import { CombProgress } from '@/components/ui/CombProgress';
import { PlasmidMap } from '@/components/viz/PlasmidMap';
import { FEATURE_LABELS, LinearFeatureMap } from '@/components/viz/LinearFeatureMap';
import { CHASSIS_LABELS, CHASSIS_ARTICLE } from '@/lib/chassisLabels';
import { defaultMarkerId, defaultPromoterId, MARKERS_BY_CHASSIS, PROMOTERS_BY_CHASSIS } from '@/lib/cassetteOptions';
import { Tooltip } from '@/components/ui/Tooltip';

const TOPOLOGIES: Array<{ id: CassetteTopology; label: string; note: string }> = [
  { id: 'dual-promoter', label: 'Dual-Promoter Design', note: 'Opposing promoters transcribe both strands — classic L4440 dsRNA' },
  { id: 'hairpin', label: 'Single Promoter with Hairpin Loop', note: 'Single promoter, self-annealing loop — compact shRNA cassette' },
  { id: 'dumbbell', label: 'Dumbbell dsRNA', note: 'Loop-closed both ends, no promoter needed — cell-free enzymatic product' },
];

export function CassetteBuilder() {
  const navigate = useNavigate();
  const store = useWizardStore();
  const reducedMotion = useWizardStore((s) => s.reducedMotion);

  const [topology, setTopology] = useState<CassetteTopology>('dual-promoter');
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | null>(null);
  const [promoterId, setPromoterId] = useState(() => defaultPromoterId(store.chassis));
  const [markerId, setMarkerId] = useState(() => defaultMarkerId(store.chassis));

  useEffect(() => {
    setPromoterId(defaultPromoterId(store.chassis));
    setMarkerId(defaultMarkerId(store.chassis));
  }, [store.chassis]);

  const candidateIds = useMemo(() => {
    const survivors = store.offTargetReport?.survivorIds ?? [];
    const pool = survivors.length > 0 ? survivors : store.sirnaCandidates.map((c) => c.id);
    return pool.slice(0, 3);
  }, [store.offTargetReport, store.sirnaCandidates]);

  const start = useCallback(() => {
    return getApi().buildCassette({ candidateIds, chassis: store.chassis, topology, promoterId, markerId });
  }, [candidateIds, store.chassis, topology, promoterId, markerId]);

  const { job } = useJob<CassetteDesign>(candidateIds.length > 0 ? start : null, [
    candidateIds.join(','),
    store.chassis,
    topology,
    promoterId,
    markerId,
  ]);

  useEffect(() => {
    if (job?.status === 'succeeded' && job.result) store.setCassetteDesign(job.result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?.status]);

  const design = job?.status === 'succeeded' ? job.result : null;

  const handleRemoveSite = async (siteIndex: number) => {
    if (!design) return;
    const updated = await getApi().removeGoldenGateSite(design, siteIndex);
    store.setCassetteDesign(updated);
  };

  const activeDesign = store.cassetteDesign?.id === design?.id ? store.cassetteDesign : design;
  const hoveredFeature = activeDesign?.features.find((f) => f.id === hoveredFeatureId) ?? null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <span className="data-text text-xs font-bold tracking-[0.25em] text-brand-yellow uppercase">
          Step 06
        </span>
        <h1 className="font-display mt-1 text-4xl text-paper sm:text-5xl">Cassette builder</h1>
        <p className="mt-2 max-w-xl text-sm text-paper/65">
          Assembling {candidateIds.length} surviving candidate{candidateIds.length === 1 ? '' : 's'} into{' '}
          {CHASSIS_ARTICLE[store.chassis]} {CHASSIS_LABELS[store.chassis]} construct.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {TOPOLOGIES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTopology(t.id)}
            className={`border px-4 py-2.5 text-left transition-colors ${
              topology === t.id ? 'border-brand-yellow bg-brand-yellow/10' : 'border-navy-tint hover:border-paper/30'
            }`}
          >
            <div className="font-heading text-sm font-bold text-paper">{t.label}</div>
            <div className="text-xs text-paper/55">{t.note}</div>
          </button>
        ))}
      </div>

      {topology !== 'dumbbell' && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Tooltip label={`Only promoters valid for ${CHASSIS_LABELS[store.chassis]} are offered — the terminator follows automatically.`}>
            <div>
              <div className="mb-2 font-heading text-xs font-semibold tracking-wide text-paper/70 uppercase">
                Promoter
              </div>
              <div className="flex flex-wrap gap-2">
                {PROMOTERS_BY_CHASSIS[store.chassis].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPromoterId(p.id)}
                    className={`data-text border px-3 py-2 text-xs font-bold transition-colors ${
                      promoterId === p.id ? 'border-brand-yellow bg-brand-yellow/10 text-brand-yellow' : 'border-navy-tint text-paper/70 hover:border-paper/30'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </Tooltip>

          <Tooltip label={`Only selectable markers compatible with ${CHASSIS_LABELS[store.chassis]} are offered.`}>
            <div>
              <div className="mb-2 font-heading text-xs font-semibold tracking-wide text-paper/70 uppercase">
                Selectable marker
              </div>
              <div className="flex flex-wrap gap-2">
                {MARKERS_BY_CHASSIS[store.chassis].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMarkerId(m.id)}
                    className={`data-text border px-3 py-2 text-xs font-bold transition-colors ${
                      markerId === m.id ? 'border-brand-yellow bg-brand-yellow/10 text-brand-yellow' : 'border-navy-tint text-paper/70 hover:border-paper/30'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </Tooltip>
        </div>
      )}

      {job && job.status !== 'succeeded' && (
        <ClippedPanel cut={14} className="mb-8">
          <div className="p-6">
            <CombProgress progress={job.progress} stage={job.stage} reduceMotion={reducedMotion} />
          </div>
        </ClippedPanel>
      )}

      {activeDesign && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
            <ClippedPanel cut={16}>
              <div className="flex justify-center p-6">
                <PlasmidMap
                  design={activeDesign}
                  hoveredFeatureId={hoveredFeatureId}
                  onHoverFeature={setHoveredFeatureId}
                  reducedMotion={reducedMotion}
                />
              </div>
            </ClippedPanel>

            <div className="space-y-6">
              <ClippedPanel cut={14}>
                <div className="p-5">
                  <div className="data-text mb-3 text-[11px] tracking-widest text-paper/50 uppercase">
                    Linear feature map
                  </div>
                  <LinearFeatureMap
                    design={activeDesign}
                    hoveredFeatureId={hoveredFeatureId}
                    onHoverFeature={setHoveredFeatureId}
                  />
                  {hoveredFeature && (
                    <div className="mt-3 border-t border-navy-tint pt-3">
                      <div className="data-text text-xs text-paper/60">
                        {hoveredFeature.name} · {FEATURE_LABELS[hoveredFeature.type]} ·{' '}
                        {hoveredFeature.end - hoveredFeature.start} bp
                      </div>
                      <div className="seq-text mt-1 max-h-16 overflow-y-auto text-[10px] break-all text-paper/50">
                        {activeDesign.sequence.slice(hoveredFeature.start, hoveredFeature.end)}
                      </div>
                    </div>
                  )}
                </div>
              </ClippedPanel>

              <ClippedPanel cut={14}>
                <div className="p-5">
                  <Tooltip label="These enzymes' recognition sequences will cut the construct during Golden Gate assembly if left in place — usually unwanted inside the insert or backbone.">
                    <div className="mb-3 flex items-center gap-2 text-paper/80">
                      <Scissors size={14} />
                      <span className="data-text text-[11px] tracking-widest uppercase">
                        Golden Gate sites (BsaI / BsmBI / SapI)
                      </span>
                    </div>
                  </Tooltip>
                  {activeDesign.goldenGateSites.length === 0 && (
                    <p className="text-xs text-pass">None detected — construct is clean for Golden Gate assembly.</p>
                  )}
                  <div className="space-y-2">
                    {activeDesign.goldenGateSites.map((site, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between border px-3 py-2 text-xs ${
                          site.removed ? 'border-pass/40 bg-pass/5' : 'border-caution/40 bg-caution/5'
                        }`}
                      >
                        <span className="data-text">
                          {site.enzyme} · pos {site.position} ·{' '}
                          <span className="seq-text">{site.sequence}</span>
                        </span>
                        {site.removed ? (
                          <span className="text-pass">removed</span>
                        ) : (
                          <Tooltip label="Flips a single base inside the recognition sequence to break the cut site, without changing what the construct expresses.">
                            <button
                              onClick={() => handleRemoveSite(i)}
                              className="data-text border border-caution/60 px-2 py-1 text-[10px] font-bold text-caution uppercase hover:bg-caution/10"
                            >
                              Silently remove
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </ClippedPanel>
            </div>
          </div>
        </>
      )}

      <div className="mt-10 flex justify-between">
        <Button variant="ghost" onClick={() => navigate('/screen')}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button disabled={!activeDesign} onClick={() => navigate('/export')}>
          Continue to export
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
