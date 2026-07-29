import { Link } from 'react-router-dom';
import { Zap, ZapOff } from 'lucide-react';
import { useWizardStore } from '@/store/wizardStore';

export function Header() {
  const reducedMotion = useWizardStore((s) => s.reducedMotion);
  const setReducedMotion = useWizardStore((s) => s.setReducedMotion);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-navy-tint bg-navy px-4 lg:px-6">
      <Link to="/" className="font-display flex items-center gap-2 text-xl tracking-tight text-brand-yellow">
        APIARY
      </Link>

      <div className="flex items-center gap-3">
        <span className="data-text hidden items-center gap-1.5 border border-caution/50 bg-caution/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-caution uppercase sm:inline-flex">
          Demo data — no real predictions
        </span>
        <button
          type="button"
          onClick={() => setReducedMotion(!reducedMotion)}
          className="data-text flex items-center gap-1.5 border border-paper/20 px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-paper/70 uppercase transition-colors hover:border-paper/40 hover:text-paper"
          aria-pressed={reducedMotion}
          title="Toggle reduced motion"
        >
          {reducedMotion ? <ZapOff size={12} /> : <Zap size={12} />}
          <span className="hidden md:inline">{reducedMotion ? 'Motion off' : 'Motion on'}</span>
        </button>
      </div>
    </header>
  );
}
