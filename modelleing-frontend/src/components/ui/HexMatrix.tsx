import { useId } from 'react';
import { flatTopHex } from '@/lib/viz/hex';
import { COLORS, SEMANTIC_COLORS } from '@/lib/theme';

export interface HexMatrixCellDatum {
  longestMatch: number;
  isHit: boolean;
  unscreenable: boolean;
}

export interface HexMatrixProps {
  rowLabels: Array<{ id: string; label: string }>;
  colLabels: Array<{ id: string; label: string }>;
  getCell: (rowId: string, colId: string) => HexMatrixCellDatum | undefined;
  threshold: number;
  cellSize?: number;
  onCellHover?: (rowId: string, colId: string, datum: HexMatrixCellDatum | undefined) => void;
  className?: string;
}

function severityColor(datum: HexMatrixCellDatum | undefined, threshold: number): string {
  if (!datum) return COLORS.navyTint;
  if (datum.unscreenable) return COLORS.navyTint;
  const ratio = datum.longestMatch / threshold;
  if (ratio >= 1) return SEMANTIC_COLORS.hit;
  if (ratio >= 0.7) return SEMANTIC_COLORS.caution;
  return SEMANTIC_COLORS.pass;
}

/** Candidates x species, as a hex lattice. Unscreenable species get a
 * hatched cell rather than a silent pass, so absence of data never reads as
 * a clean result. */
export function HexMatrix({
  rowLabels,
  colLabels,
  getCell,
  threshold,
  cellSize = 26,
  onCellHover,
  className,
}: HexMatrixProps) {
  const hatchId = useId();
  const r = cellSize / 2;
  const hex = flatTopHex(r, r, r - 1);

  return (
    <div className={`overflow-x-auto ${className ?? ''}`}>
      <svg width="0" height="0">
        <defs>
          <pattern
            id={hatchId}
            width="5"
            height="5"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <rect width="5" height="5" fill={COLORS.navyTint} />
            <line x1="0" y1="0" x2="0" y2="5" stroke={COLORS.navyDeep} strokeWidth="2" />
          </pattern>
        </defs>
      </svg>
      <div className="inline-grid" style={{ gridTemplateColumns: `140px repeat(${colLabels.length}, ${cellSize + 4}px)` }}>
        <div />
        {colLabels.map((c) => (
          <div
            key={c.id}
            className="data-text flex items-end justify-center pb-1 text-[10px] text-paper/70"
            style={{ writingMode: 'vertical-rl', height: 90 }}
            title={c.label}
          >
            {c.label}
          </div>
        ))}

        {rowLabels.map((row) => (
          <RowFragment
            key={row.id}
            row={row}
            colLabels={colLabels}
            getCell={getCell}
            threshold={threshold}
            hex={hex}
            hatchId={hatchId}
            onCellHover={onCellHover}
          />
        ))}
      </div>
    </div>
  );
}

function RowFragment({
  row,
  colLabels,
  getCell,
  threshold,
  hex,
  hatchId,
  onCellHover,
}: {
  row: { id: string; label: string };
  colLabels: Array<{ id: string; label: string }>;
  getCell: HexMatrixProps['getCell'];
  threshold: number;
  hex: ReturnType<typeof flatTopHex>;
  hatchId: string;
  onCellHover?: HexMatrixProps['onCellHover'];
}) {
  return (
    <>
      <div className="data-text flex items-center truncate pr-2 text-xs text-paper/80" title={row.label}>
        {row.label}
      </div>
      {colLabels.map((col) => {
        const datum = getCell(row.id, col.id);
        const fill = severityColor(datum, threshold);
        return (
          <svg
            key={col.id}
            width={hex.width}
            height={hex.height}
            viewBox={`0 0 ${hex.width} ${hex.height}`}
            onMouseEnter={() => onCellHover?.(row.id, col.id, datum)}
            onMouseLeave={() => onCellHover?.(row.id, col.id, undefined)}
          >
            <polygon
              points={hex.points}
              fill={datum?.unscreenable ? `url(#${hatchId})` : fill}
              stroke={COLORS.navy}
              strokeWidth={1}
            />
          </svg>
        );
      })}
    </>
  );
}
