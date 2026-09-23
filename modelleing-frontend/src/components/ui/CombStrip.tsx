import { HexCell } from './HexCell';
import { NUCLEOTIDE_COLORS, accessibilityColor } from '@/lib/theme';

export interface CombCell {
  /** Nucleotide letter — when present the open cell shows this colour through it. */
  base?: string;
  /** 0 (occluded) .. 1 (fully accessible). Drives cap fraction and, absent a base, cell colour. */
  accessibility: number;
  key?: string | number;
}

export interface CombStripProps {
  cells: CombCell[];
  cellSize?: number;
  gap?: number;
  onHoverIndex?: (index: number | null) => void;
  activeIndex?: number | null;
  reduceMotion?: boolean;
  className?: string;
}

/** Occlusion, rendered as capping. The organising visual idea of the app —
 * an open cell shows its nucleotide colour, a capped cell is waxed opaque. */
export function CombStrip({
  cells,
  cellSize = 16,
  gap = 2,
  onHoverIndex,
  activeIndex,
  reduceMotion,
  className,
}: CombStripProps) {
  return (
    <div
      className={`flex items-center ${className ?? ''}`}
      style={{ gap }}
      onMouseLeave={() => onHoverIndex?.(null)}
    >
      {cells.map((cell, i) => {
        const fill = cell.base
          ? (NUCLEOTIDE_COLORS[cell.base.toUpperCase() as keyof typeof NUCLEOTIDE_COLORS] ??
            accessibilityColor(cell.accessibility))
          : accessibilityColor(cell.accessibility);
        return (
          <HexCell
            key={cell.key ?? i}
            size={cellSize}
            fill={fill}
            capFraction={1 - cell.accessibility}
            reduceMotion={reduceMotion}
            onHover={(h) => onHoverIndex?.(h ? i : null)}
            title={cell.base ? `${cell.base} · ${Math.round(cell.accessibility * 100)}% accessible` : undefined}
            className={activeIndex === i ? 'drop-shadow-[0_0_6px_rgba(242,201,76,0.85)]' : undefined}
          />
        );
      })}
    </div>
  );
}
