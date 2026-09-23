import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Dna } from 'lucide-react';
import { getApi } from '@/lib/api/client';
import type { Organism } from '@/lib/api/types';
import { useWizardStore } from '@/store/wizardStore';
import { ClippedPanel } from '@/components/ui/ClippedPanel';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import { Chip } from '@/components/ui/Chip';
import { Tooltip } from '@/components/ui/Tooltip';
import { CHASSIS_LABELS, CHASSIS_ORDER } from '@/lib/chassisLabels';
import { sirnaLengthForOrganism } from '@/lib/rnaiBiology';
import { suggestedSafetySpeciesFor } from '@/lib/safetySpeciesMap';

function thresholdExplainer(v: number): string {
  if (v <= 17) return 'Very stringent — flags almost any partial homology. Expect more candidates rejected.';
  if (v <= 20) return 'Balanced — the conventional cutoff for a plausible siRNA/RISC off-target match.';
  if (v <= 23) return 'Permissive — only long, near-exact matches count. Faster screen, more residual risk.';
  return 'Very permissive — catches only near-identical off-target hits.';
}

export function RunConfiguration() {
  const navigate = useNavigate();
  const store = useWizardStore();
  const [speciesPool, setSpeciesPool] = useState<Organism[]>([]);

  useEffect(() => {
    getApi()
      .searchOrganisms('')
      .then((all) => setSpeciesPool(all.filter((o) => o.kind !== 'target')));
  }, []);

  const derivedLength = useMemo(() => sirnaLengthForOrganism(store.organism), [store.organism]);
  useEffect(() => {
    store.setSirnaLength(derivedLength.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derivedLength.length]);

  const recommendedIds = useMemo(
    () => new Set(suggestedSafetySpeciesFor(store.organism?.id)),
    [store.organism?.id],
  );
  const sortedSpecies = useMemo(
    () =>
      [...speciesPool].sort((a, b) => {
        const ra = recommendedIds.has(a.id) ? 0 : 1;
        const rb = recommendedIds.has(b.id) ? 0 : 1;
        return ra - rb;
      }),
    [speciesPool, recommendedIds],
  );

  const estimatedMinutes = useMemo(() => {
    const base = 3 + store.numCandidates * 0.4 + store.screenSpeciesIds.length * 0.6 + (store.chimericDesign ? 3 : 0);
    return [Math.round(base * 0.8), Math.round(base * 1.35)];
  }, [store.numCandidates, store.screenSpeciesIds.length, store.chimericDesign]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <span className="data-text text-xs font-bold tracking-[0.25em] text-brand-yellow uppercase">
          Step 02
        </span>
        <h1 className="font-display mt-1 text-4xl text-paper sm:text-5xl">Run configuration</h1>
        <p className="mt-2 max-w-xl text-sm text-paper/65">
          Every setting here feeds the mock compute request directly — nothing here is decorative.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <ClippedPanel cut={14}>
            <div className="space-y-6 p-6">
              <Slider
                label="Candidate targets to develop"
                value={store.numCandidates}
                min={1}
                max={20}
                onChange={store.setNumCandidates}
              />

              <Tooltip label={derivedLength.note}>
                <div className="flex items-start justify-between gap-4 border border-navy-tint bg-navy-deep px-4 py-3">
                  <div className="flex items-start gap-2">
                    <Dna size={15} className="mt-0.5 shrink-0 text-brand-yellow" />
                    <div>
                      <div className="font-heading text-sm font-semibold text-paper/90">siRNA duplex length</div>
                      <div className="mt-0.5 text-xs text-paper/55">
                        Auto-derived from {store.organism?.commonName ?? 'target'} Dicer-2/Argonaute processing.
                      </div>
                    </div>
                  </div>
                  <div className="data-text shrink-0 text-2xl font-bold text-brand-yellow">
                    {store.sirnaLength} nt
                  </div>
                </div>
              </Tooltip>

              <Slider
                label="Off-target contiguous-match threshold"
                value={store.contiguousMatchThreshold}
                min={15}
                max={25}
                unit=" nt"
                onChange={store.setContiguousMatchThreshold}
                helpText={thresholdExplainer(store.contiguousMatchThreshold)}
              />
            </div>
          </ClippedPanel>

          <ClippedPanel cut={14}>
            <div className="p-6">
              <div className="mb-3 font-heading text-sm font-semibold text-paper/90">
                Species safety panel
              </div>
              <p className="mb-3 text-xs text-paper/55">
                Nothing is pre-selected. Species flagged{' '}
                <span className="text-brand-yellow">recommended</span> share habitat or a trophic
                link with the selected pest; species without a reference transcriptome cannot be
                screened and are marked accordingly rather than silently skipped.
              </p>
              <div className="flex flex-wrap gap-2">
                {sortedSpecies.map((o) => (
                  <Tooltip
                    key={o.id}
                    label={
                      !o.hasReferenceTranscriptome
                        ? `${o.commonName} has no reference transcriptome and cannot be screened.`
                        : recommendedIds.has(o.id)
                          ? `${o.commonName} — recommended: shares habitat or a trophic link with ${store.organism?.commonName ?? 'the selected pest'}.`
                          : `${o.commonName} — add to the safety panel to screen candidates against it.`
                    }
                  >
                    <span className="relative inline-block">
                      {recommendedIds.has(o.id) && o.hasReferenceTranscriptome && (
                        <span className="absolute -top-1.5 -right-1.5 h-2 w-2 rounded-full bg-brand-yellow" />
                      )}
                      <Chip
                        label={o.commonName}
                        active={store.screenSpeciesIds.includes(o.id)}
                        unscreenable={!o.hasReferenceTranscriptome}
                        onClick={() => o.hasReferenceTranscriptome && store.toggleScreenSpecies(o.id)}
                      />
                    </span>
                  </Tooltip>
                ))}
              </div>
            </div>
          </ClippedPanel>

          <ClippedPanel cut={14}>
            <div className="divide-y divide-navy-tint/60 p-6">
              <Toggle
                label="Seed-region filtering"
                description="Reject candidates with repetitive motifs across positions 2–8 of the antisense strand"
                checked={store.seedFiltering}
                onChange={store.setSeedFiltering}
              />
              <Toggle
                label="Chimeric multi-target design"
                description="Allow a single construct to carry siRNAs against more than one gene"
                checked={store.chimericDesign}
                onChange={store.setChimericDesign}
              />
              <div className="pt-2.5 text-xs text-paper/45">
                Accessibility weighting — preferring binding sites the transcript's own fold
                leaves open — always runs as part of the design pipeline.
              </div>
            </div>
          </ClippedPanel>
        </div>

        <div className="space-y-8">
          <ClippedPanel cut={14}>
            <div className="p-6">
              <div className="mb-3 font-heading text-sm font-semibold text-paper/90">
                Delivery chassis
              </div>
              <div className="space-y-2">
                {CHASSIS_ORDER.map((id) => (
                  <button
                    key={id}
                    onClick={() => store.setChassis(id)}
                    className={`w-full border px-3 py-3 text-left transition-colors ${
                      store.chassis === id
                        ? 'border-brand-yellow bg-brand-yellow/10'
                        : 'border-navy-tint hover:border-paper/30'
                    }`}
                  >
                    <div className="font-heading text-sm font-bold text-paper">{CHASSIS_LABELS[id]}</div>
                  </button>
                ))}
              </div>
            </div>
          </ClippedPanel>

          <ClippedPanel cut={14} bg="var(--color-navy-tint)" offset offsetColor="var(--color-flame-start)">
            <div className="p-6">
              <div className="mb-2 flex items-center gap-2 text-brand-yellow">
                <Clock size={16} />
                <span className="font-heading text-sm font-bold uppercase">Estimated runtime</span>
              </div>
              <div className="data-text text-3xl font-bold text-paper">
                {estimatedMinutes[0]}–{estimatedMinutes[1]} min
              </div>
              <p className="mt-2 text-xs text-paper/60">
                Scales with candidate count, species panel size, and chimeric design. Demo jobs
                below run in seconds — this estimate reflects real batch compute.
              </p>
            </div>
          </ClippedPanel>
        </div>
      </div>

      <div className="mt-10 flex justify-between">
        <Button variant="ghost" onClick={() => navigate('/intake')}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button onClick={() => navigate('/discover')}>
          Run target discovery
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
