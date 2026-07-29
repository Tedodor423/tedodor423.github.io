import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { HexCell } from '@/components/ui/HexCell';
import { CountUp } from '@/components/ui/CountUp';
import { NUCLEOTIDE_COLORS, COLORS, SEMANTIC_COLORS } from '@/lib/theme';
import type { FoldingProfile, SirnaCandidate } from '@/lib/api/types';

export interface SirnaDockingProps {
  profile: FoldingProfile;
  candidate: SirnaCandidate;
  reducedMotion?: boolean;
}

const PADDING = 4;

export function SirnaDocking({ profile, candidate, reducedMotion = false }: SirnaDockingProps) {
  const occluded = candidate.accessibility < 0.6;
  const [phase, setPhase] = useState<'melt' | 'dock' | 'done'>(
    reducedMotion ? 'done' : occluded ? 'melt' : 'dock',
  );

  useEffect(() => {
    setPhase(reducedMotion ? 'done' : occluded ? 'melt' : 'dock');
    if (reducedMotion) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (occluded) {
      timers.push(setTimeout(() => setPhase('dock'), 1200));
      timers.push(setTimeout(() => setPhase('done'), 1200 + 500 + candidate.length * 40 + 200));
    } else {
      timers.push(setTimeout(() => setPhase('done'), 500 + candidate.length * 40 + 200));
    }
    return () => timers.forEach(clearTimeout);
  }, [candidate.id, candidate.length, occluded, reducedMotion]);

  const start = Math.max(0, candidate.position - PADDING);
  const end = Math.min(profile.sequence.length, candidate.position + candidate.length + PADDING);
  const targetBases = profile.sequence.slice(start, end).split('');
  const footprintStart = candidate.position - start;

  const antisenseBases = candidate.antisenseSeq.split('');
  const deltaDeltaG = candidate.deltaGDuplex + candidate.deltaGOpen;

  const cellSize = 18;
  const gap = 3;
  const rowWidth = targetBases.length * (cellSize + gap);
  const dockOffset = footprintStart * (cellSize + gap);

  const capNow = phase === 'melt' ? 1 : 0;

  const microcopy = occluded
    ? 'This site sits inside a stem — the competing structure has to melt open before the siRNA can dock.'
    : 'This site is already accessible — the siRNA docks directly, no competing structure to displace.';

  return (
    <div>
      <div className="relative overflow-x-auto pb-2" style={{ minHeight: cellSize * 2 + 40 }}>
        <div className="relative" style={{ width: rowWidth }}>
          <div className="flex" style={{ gap }}>
            {targetBases.map((b, i) => {
              const inFootprint = i >= footprintStart && i < footprintStart + candidate.length;
              return (
                <HexCell
                  key={i}
                  size={cellSize}
                  fill={NUCLEOTIDE_COLORS[b.toUpperCase() as keyof typeof NUCLEOTIDE_COLORS] ?? COLORS.navyTint}
                  capFraction={inFootprint ? capNow : 0}
                  reduceMotion={reducedMotion}
                  stroke={COLORS.navyDeep}
                />
              );
            })}
          </div>

          <svg
            className="pointer-events-none absolute left-0"
            style={{ top: cellSize + 6, width: rowWidth, height: 24 }}
          >
            {phase !== 'melt' &&
              antisenseBases.map((_, i) => {
                const cx = dockOffset + i * (cellSize + gap) + cellSize / 2;
                return (
                  <motion.line
                    key={i}
                    x1={cx}
                    x2={cx}
                    y1={0}
                    y2={24}
                    stroke={COLORS.brandYellow}
                    strokeWidth={1.5}
                    initial={reducedMotion ? undefined : { opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ delay: reducedMotion ? 0 : 0.5 + i * 0.04, duration: 0.25 }}
                  />
                );
              })}
          </svg>

          <motion.div
            className="absolute flex"
            style={{ gap, top: cellSize + 30, left: dockOffset }}
            initial={reducedMotion ? undefined : { x: 160, opacity: 0 }}
            animate={phase !== 'melt' ? { x: 0, opacity: 1 } : { x: 160, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {antisenseBases.map((b, i) => (
              <HexCell
                key={i}
                size={cellSize}
                fill={NUCLEOTIDE_COLORS[b.toUpperCase() as keyof typeof NUCLEOTIDE_COLORS] ?? COLORS.navyTint}
                capFraction={0}
                reduceMotion={reducedMotion}
                stroke={COLORS.brandYellow}
              />
            ))}
          </motion.div>
        </div>
      </div>

      <p className="mt-6 max-w-md text-xs leading-relaxed text-paper/60">{microcopy}</p>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <Readout label="ΔG open" value={candidate.deltaGOpen} suffix=" kcal/mol" color={SEMANTIC_COLORS.caution} active={phase === 'done'} reducedMotion={reducedMotion} />
        <Readout label="ΔG duplex" value={candidate.deltaGDuplex} suffix=" kcal/mol" color="#3EC6E0" active={phase === 'done'} reducedMotion={reducedMotion} />
        <Readout label="ΔΔG net" value={deltaDeltaG} suffix=" kcal/mol" color={COLORS.brandYellow} active={phase === 'done'} reducedMotion={reducedMotion} />
      </div>
    </div>
  );
}

function Readout({
  label,
  value,
  suffix,
  color,
  active,
  reducedMotion,
}: {
  label: string;
  value: number;
  suffix: string;
  color: string;
  active: boolean;
  reducedMotion: boolean;
}) {
  const shown = useMemo(() => (active ? value : 0), [active, value]);
  return (
    <div>
      <div className="data-text text-[10px] tracking-widest text-paper/45 uppercase">{label}</div>
      <div className="data-text text-xl font-bold" style={{ color }}>
        <CountUp to={shown} reduceMotion={reducedMotion || !active} duration={0.8} format={(n) => n.toFixed(1)} />
        {suffix}
      </div>
    </div>
  );
}
