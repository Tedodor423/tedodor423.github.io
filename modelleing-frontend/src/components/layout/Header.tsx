import { Link } from 'react-router-dom';
import { Zap, ZapOff } from 'lucide-react';
import { useWizardStore } from '@/store/wizardStore';
import { Tooltip } from '@/components/ui/Tooltip';
import nectarLogo from '@/assets/nectar-logo.png';

export function Header() {
  const reducedMotion = useWizardStore((s) => s.reducedMotion);
  const setReducedMotion = useWizardStore((s) => s.setReducedMotion);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-navy-tint bg-navy px-4 lg:px-6">
      <Link to="/" className="flex items-baseline gap-2">
        <img src={nectarLogo} alt="Nectar" className="h-5 w-auto" />
        <span className="font-heading text-[10px] font-bold tracking-[0.2em] text-paper/50 uppercase">
          Designer
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <Tooltip label="Every number and sequence in this build comes from a seeded mock generator — nothing here is a real biological prediction.">
          <span className="data-text hidden items-center gap-1.5 border border-caution/50 bg-caution/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-caution uppercase sm:inline-flex">
            Demo data — no real predictions
          </span>
        </Tooltip>
        <Tooltip label="Turns off animation across the app — the fold, the docking sequence, job progress, all of it settle instantly instead of animating.">
          <button
            type="button"
            onClick={() => setReducedMotion(!reducedMotion)}
            className="data-text flex items-center gap-1.5 border border-paper/20 px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-paper/70 uppercase transition-colors hover:border-paper/40 hover:text-paper"
            aria-pressed={reducedMotion}
          >
            {reducedMotion ? <ZapOff size={12} /> : <Zap size={12} />}
            <span className="hidden md:inline">{reducedMotion ? 'Motion off' : 'Motion on'}</span>
          </button>
        </Tooltip>
      </div>
    </header>
  );
}
