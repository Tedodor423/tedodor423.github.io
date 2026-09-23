import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { StepRail } from './StepRail';
import { WIZARD_STEPS, useWizardStore } from '@/store/wizardStore';

export function AppShell() {
  const location = useLocation();
  const reducedMotion = useWizardStore((s) => s.reducedMotion);
  const markStepReached = useWizardStore((s) => s.markStepReached);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    const index = WIZARD_STEPS.findIndex((s) => s.path === location.pathname);
    if (index >= 0) markStepReached(index);
  }, [location.pathname, markStepReached]);

  return (
    <div className="flex min-h-svh flex-col bg-navy-deep text-paper lg:flex-row">
      <StepRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
