import { HexCell } from './HexCell';
import { COLORS } from '@/lib/theme';

export interface CombProgressProps {
  progress: number; // 0..1
  stage?: string;
  cellCount?: number;
  cellSize?: number;
  reduceMotion?: boolean;
  className?: string;
}

/** Job progress rendered as a comb run capping over, left to right — the
 * progress-bar replacement used for every job, including Batch-backed ones later. */
export function CombProgress({
  progress,
  stage,
  cellCount = 24,
  cellSize = 14,
  reduceMotion,
  className,
}: CombProgressProps) {
  const filled = progress * cellCount;
  return (
    <div className={className}>
      <div className="flex items-center" style={{ gap: 2 }}>
        {Array.from({ length: cellCount }, (_, i) => (
          <HexCell
            key={i}
            size={cellSize}
            fill={COLORS.navyTint}
            capColor={COLORS.brandYellow}
            capFraction={Math.min(1, Math.max(0, filled - i))}
            reduceMotion={reduceMotion}
            stroke={COLORS.navy}
          />
        ))}
      </div>
      {stage && (
        <div className="data-text mt-2 flex items-baseline justify-between text-xs text-paper/70">
          <span>{stage}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
      )}
    </div>
  );
}
