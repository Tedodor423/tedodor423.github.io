import { useMemo, useRef, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { area as d3area, curveMonotoneX } from 'd3-shape';
import { CombStrip, type CombCell } from '@/components/ui/CombStrip';
import { useElementSize } from '@/lib/hooks/useElementSize';
import type { FoldingProfile, SirnaCandidate } from '@/lib/api/types';
import { COLORS } from '@/lib/theme';

export interface AccessibilityTrackProps {
  profile: FoldingProfile;
  candidates: SirnaCandidate[];
  selectedCandidateId: string | null;
  onSelectCandidate: (id: string) => void;
  range: [number, number];
  onRangeChange: (range: [number, number]) => void;
  reducedMotion?: boolean;
}

const MIN_WINDOW = 30;
const MAX_WINDOW = 260;
const COMB_CELL_SIZE = 18;
const COMB_GAP = 2;

export function AccessibilityTrack({
  profile,
  candidates,
  selectedCandidateId,
  onSelectCandidate,
  range,
  onRangeChange,
  reducedMotion,
}: AccessibilityTrackProps) {
  const length = profile.sequence.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: sizeRef, size: measured } = useElementSize<HTMLDivElement>();
  const setContainerRefs = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    sizeRef(el);
  };
  const [hoverPos, setHoverPos] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);

  const width = 900;
  const chartHeight = 90;
  const tileHeight = 46;

  const x = useMemo(() => scaleLinear().domain([0, length]).range([0, width]), [length, width]);

  const maxBins = useMemo(() => {
    const availableWidth = measured.width || 700;
    return Math.max(24, Math.floor(availableWidth / (COMB_CELL_SIZE + COMB_GAP)));
  }, [measured.width]);

  const bins = useMemo(() => {
    const binSize = Math.max(1, Math.ceil(length / maxBins));
    const out: Array<{ start: number; end: number; accessibility: number }> = [];
    for (let s = 0; s < length; s += binSize) {
      const e = Math.min(length, s + binSize);
      let sum = 0;
      for (let i = s; i < e; i++) sum += profile.unpairedProbability[i];
      out.push({ start: s, end: e, accessibility: sum / (e - s) });
    }
    return out;
  }, [profile, length, maxBins]);

  const areaPath = useMemo(() => {
    const y = scaleLinear().domain([0, 1]).range([chartHeight - 2, 4]);
    const gen = d3area<{ start: number; accessibility: number }>()
      .x((d) => x(d.start))
      .y0(chartHeight)
      .y1((d) => y(d.accessibility))
      .curve(curveMonotoneX);
    return gen(bins) ?? '';
  }, [bins, x]);

  const combCells: CombCell[] = useMemo(
    () => bins.map((b, i) => ({ key: i, accessibility: b.accessibility })),
    [bins],
  );

  const posFromClientX = (clientX: number): number => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const localX = ((clientX - rect.left) / rect.width) * width;
    return Math.round(x.invert(localX));
  };

  const commitRange = (a: number, b: number) => {
    let start = Math.max(0, Math.min(a, b));
    let end = Math.min(length, Math.max(a, b));
    if (end - start < MIN_WINDOW) end = Math.min(length, start + MIN_WINDOW);
    if (end - start > MAX_WINDOW) end = start + MAX_WINDOW;
    onRangeChange([start, end]);
  };

  const openingEnergy = hoverPos !== null ? (1 - (profile.unpairedProbability[hoverPos] ?? 0.5)) * 12 : null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="data-text text-[11px] tracking-widest text-paper/50 uppercase">
          Transcript accessibility · {length.toLocaleString()} nt
        </span>
        {hoverPos !== null && openingEnergy !== null && (
          <span className="data-text text-[11px] text-brand-yellow">
            pos {hoverPos.toLocaleString()} · ΔG_open ≈ {openingEnergy.toFixed(1)} kcal/mol
          </span>
        )}
      </div>

      <div
        ref={setContainerRefs}
        className="relative cursor-crosshair touch-none select-none"
        onPointerDown={(e) => {
          const p = posFromClientX(e.clientX);
          setDragStart(p);
          commitRange(p, p + MIN_WINDOW);
        }}
        onPointerMove={(e) => {
          const p = posFromClientX(e.clientX);
          setHoverPos(Math.max(0, Math.min(length - 1, p)));
          if (dragStart !== null) commitRange(dragStart, p);
        }}
        onPointerUp={() => setDragStart(null)}
        onPointerLeave={() => {
          setHoverPos(null);
          setDragStart(null);
        }}
      >
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${width} ${chartHeight}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="accessibility-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.brandYellow} stopOpacity={0.85} />
              <stop offset="100%" stopColor={COLORS.navyTint} stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#accessibility-fill)" />
          <rect
            x={x(range[0])}
            width={Math.max(1, x(range[1]) - x(range[0]))}
            y={0}
            height={chartHeight}
            fill={COLORS.paper}
            fillOpacity={0.08}
            stroke={COLORS.brandYellow}
            strokeWidth={1}
          />
        </svg>

        <div className="mt-1.5 overflow-hidden" style={{ width: '100%' }}>
          <CombStrip
            cells={combCells}
            cellSize={COMB_CELL_SIZE}
            gap={COMB_GAP}
            reduceMotion={reducedMotion}
          />
        </div>

        <div className="relative mt-2" style={{ height: tileHeight }}>
          {candidates.map((c) => {
            const left = x(c.position);
            const w = Math.max(2, x(c.position + c.length) - left);
            const h = 6 + c.efficacyScore * (tileHeight - 8);
            const active = c.id === selectedCandidateId;
            return (
              <button
                key={c.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCandidate(c.id);
                  commitRange(
                    Math.max(0, c.position - 40),
                    Math.min(length, c.position + c.length + 40),
                  );
                }}
                title={`${c.senseSeq} · efficacy ${(c.efficacyScore * 100).toFixed(0)}%`}
                className="absolute bottom-0 transition-[height]"
                style={{
                  left: `${(left / width) * 100}%`,
                  width: `${(w / width) * 100}%`,
                  height: h,
                  background: active ? COLORS.brandYellow : COLORS.flameStart,
                  opacity: active ? 1 : 0.55 + c.efficacyScore * 0.3,
                  boxShadow: active ? `0 0 0 1px ${COLORS.brandYellow}` : undefined,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
