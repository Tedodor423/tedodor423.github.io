import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HelixHero } from '@/components/viz/HelixHero';
import { Button } from '@/components/ui/Button';
import { Sparkle } from '@/components/ui/Sparkle';
import { CountUp } from '@/components/ui/CountUp';
import { Tooltip } from '@/components/ui/Tooltip';
import { useWizardStore } from '@/store/wizardStore';
import nectarLogo from '@/assets/nectar-logo.png';

const STATS = [
  {
    label: 'Transcriptomes indexed',
    value: 11,
    format: (n: number) => Math.round(n).toString(),
    tooltip: 'Organisms with a mock reference transcriptome available to search in this demo.',
  },
  {
    label: 'Candidate sites scored',
    value: 1284730,
    tooltip: 'Cumulative siRNA binding sites tiled and scored across demo runs — a decorative running counter, not live data.',
  },
  {
    label: 'Off-target species panels run',
    value: 3862,
    tooltip: 'Cumulative off-target screening passes across demo runs — a decorative running counter, not live data.',
  },
];

export function Landing() {
  const navigate = useNavigate();
  const reset = useWizardStore((s) => s.reset);
  const reducedMotion = useWizardStore((s) => s.reducedMotion);

  return (
    <div className="flex min-h-full flex-col">
      <div className="relative flex min-h-[560px] flex-1 items-center overflow-hidden bg-navy">
        <div className="absolute inset-0 opacity-90">
          <HelixHero reducedMotion={reducedMotion} />
        </div>
        <div className="bench-grid pointer-events-none absolute inset-0 opacity-20" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 640px 380px at center, var(--color-navy) 0%, color-mix(in srgb, var(--color-navy) 65%, transparent) 55%, transparent 80%)',
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkle size={16} />
            <span className="data-text text-xs font-bold tracking-[0.25em] text-brand-yellow uppercase">
              Occlusion-aware RNA design platform
            </span>
            <Sparkle size={16} />
          </div>
          <h1>
            <img src={nectarLogo} alt="Nectar" className="mx-auto h-16 w-auto sm:h-24" />
          </h1>
          <div className="font-heading mt-3 text-sm font-bold tracking-[0.4em] text-paper/70 uppercase sm:text-base">
            Designer
          </div>
          <p className="font-heading mx-auto mt-6 max-w-2xl text-lg text-paper/80 sm:text-xl">
            From target gene to cloning-ready cassette — occlusion-aware RNA design, screened to
            prevent off-target toxicity and increase targeting efficacy.
          </p>
          <div className="mt-10 flex justify-center">
            <Button
              onClick={() => {
                reset();
                navigate('/intake');
              }}
              className="text-base"
            >
              New design run
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-tint bg-navy-deep px-6 py-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {STATS.map((stat) => (
            <Tooltip key={stat.label} label={stat.tooltip}>
              <div className="text-center sm:text-left">
                <div className="data-text text-3xl font-bold text-brand-yellow sm:text-4xl">
                  <CountUp to={stat.value} reduceMotion={reducedMotion} format={stat.format} />
                </div>
                <div className="mt-1 text-xs tracking-wide text-paper/55 uppercase">{stat.label}</div>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
