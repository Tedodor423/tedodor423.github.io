import { useMemo } from 'react';
import { scaleSqrt } from 'd3-scale';
import { COLORS } from '@/lib/theme';

export interface DotDensityProps {
  width: number;
  height: number;
  cols: number;
  rows: number;
  /** Row-major values 0..1, length cols*rows. A real quantity — never a fixed decorative fill. */
  values: number[];
  color?: string;
  maxRadius?: number;
  className?: string;
}

/** Halftone dot field whose density encodes a data channel. */
export function DotDensity({
  width,
  height,
  cols,
  rows,
  values,
  color = COLORS.navyTint,
  maxRadius,
  className,
}: DotDensityProps) {
  const cellW = width / cols;
  const cellH = height / rows;
  const rMax = maxRadius ?? Math.min(cellW, cellH) * 0.42;

  const radius = useMemo(() => scaleSqrt().domain([0, 1]).range([0.4, rMax]), [rMax]);

  const dots = useMemo(() => {
    const out: Array<{ cx: number; cy: number; r: number }> = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const v = values[row * cols + col] ?? 0;
        out.push({
          cx: cellW * (col + 0.5),
          cy: cellH * (row + 0.5),
          r: radius(Math.max(0, Math.min(1, v))),
        });
      }
    }
    return out;
  }, [values, rows, cols, cellW, cellH, radius]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={color} />
      ))}
    </svg>
  );
}
