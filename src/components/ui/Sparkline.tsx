import { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { line as d3line, curveMonotoneX } from 'd3-shape';

export function Sparkline({
  values,
  width = 90,
  height = 26,
  color = 'var(--color-brand-yellow)',
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  const d = useMemo(() => {
    const x = scaleLinear().domain([0, values.length - 1]).range([2, width - 2]);
    const y = scaleLinear().domain([0, 1]).range([height - 3, 3]);
    const gen = d3line<number>()
      .x((_, i) => x(i))
      .y((v) => y(v))
      .curve(curveMonotoneX);
    return gen(values) ?? '';
  }, [values, width, height]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}
