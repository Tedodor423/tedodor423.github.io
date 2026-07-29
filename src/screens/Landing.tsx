import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HelixHero } from '@/components/viz/HelixHero';
import { Button } from '@/components/ui/Button';
import { Sparkle } from '@/components/ui/Sparkle';
import { CountUp } from '@/components/ui/CountUp';
import { useWizardStore } from '@/store/wizardStore';

const STATS = [
  { label: 'Transcriptomes indexed', value: 11, format: (n: number) => Math.round(n).toString() },
  { label: 'Candidate sites scored', value: 1284730 },
  { label: 'Off-target species panels run', value: 3862 },
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
              dsRNA design platform
            </span>
            <Sparkle size={16} />
          </div>
          <h1 className="font-display text-6xl leading-[0.95] tracking-tight text-paper sm:text-8xl">
            APIARY
          </h1>
          <p className="font-heading mx-auto mt-6 max-w-2xl text-lg text-paper/80 sm:text-xl">
            From target gene to cloning-ready cassette — occlusion-aware siRNA design, screened
            against the species you actually need to protect.
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
            <div key={stat.label} className="text-center sm:text-left">
              <div className="data-text text-3xl font-bold text-brand-yellow sm:text-4xl">
                <CountUp to={stat.value} reduceMotion={reducedMotion} format={stat.format} />
              </div>
              <div className="mt-1 text-xs tracking-wide text-paper/55 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
