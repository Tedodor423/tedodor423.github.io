import { Link, useLocation } from 'react-router-dom';
import { WIZARD_STEPS } from '@/store/wizardStore';
import { useWizardStore } from '@/store/wizardStore';
import { Lock } from 'lucide-react';

export function StepRail() {
  const location = useLocation();
  const maxStepReached = useWizardStore((s) => s.maxStepReached);
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.path === location.pathname);

  return (
    <nav
      aria-label="Design run steps"
      className="bench-grid flex shrink-0 flex-row overflow-x-auto border-b border-navy-tint bg-navy-deep lg:h-full lg:w-[104px] lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r"
    >
      {WIZARD_STEPS.map((step, index) => {
        const reachable = index <= maxStepReached;
        const active = index === currentIndex;
        const content = (
          <div
            className={`group relative flex h-16 w-20 shrink-0 flex-col items-center justify-center border-r border-navy-tint/60 lg:h-[104px] lg:w-full lg:border-b lg:border-r-0 ${
              active ? 'bg-brand-yellow' : reachable ? 'hover:bg-navy-tint/40' : 'opacity-35'
            }`}
          >
            <span
              className={`font-display pointer-events-none absolute -top-3 left-1 text-[52px] leading-none tracking-tighter select-none lg:-top-4 lg:left-1 lg:text-[58px] ${
                active ? 'text-ink/25' : 'text-paper/10'
              }`}
            >
              {index}
            </span>
            <span
              className={`data-text relative z-10 px-1 text-center text-[9px] leading-tight font-bold tracking-wide uppercase lg:[writing-mode:vertical-rl] ${
                active ? 'text-ink' : 'text-paper/75'
              }`}
            >
              {step.label}
            </span>
            {!reachable && <Lock size={10} className="absolute right-1.5 bottom-1.5 text-paper/40" />}
          </div>
        );

        return reachable ? (
          <Link key={step.path} to={step.path} aria-current={active ? 'step' : undefined}>
            {content}
          </Link>
        ) : (
          <div key={step.path} aria-disabled className="cursor-not-allowed">
            {content}
          </div>
        );
      })}
    </nav>
  );
}
