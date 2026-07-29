import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { arc as d3arc } from 'd3-shape';
import type { CassetteDesign, CassetteFeature } from '@/lib/api/types';
import { COLORS } from '@/lib/theme';

const FEATURE_COLORS: Record<CassetteFeature['type'], string> = {
  promoter: COLORS.brandYellow,
  insert: COLORS.flameStart,
  terminator: COLORS.navyTint,
  marker: '#9B7BF0',
  'homology-arm': '#57D68D',
  loop: COLORS.wax,
};

export interface PlasmidMapProps {
  design: CassetteDesign;
  hoveredFeatureId: string | null;
  onHoverFeature: (id: string | null) => void;
  reducedMotion?: boolean;
  size?: number;
}

export function PlasmidMap({ design, hoveredFeatureId, onHoverFeature, reducedMotion, size = 460 }: PlasmidMapProps) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.36;
  const innerR = outerR - 22;

  const angleFor = (bp: number) => (bp / design.lengthBp) * Math.PI * 2 - Math.PI / 2;

  const [sweep, setSweep] = useState(reducedMotion ? 1 : 0);
  useEffect(() => {
    if (reducedMotion) {
      setSweep(1);
      return;
    }
    setSweep(0);
    const start = performance.now();
    const duration = 900;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setSweep(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [design.id, reducedMotion]);

  const insertIndex = design.features.findIndex((f) => f.type === 'insert');
  const arcGen = useMemo(
    () =>
      d3arc<{ startAngle: number; endAngle: number }>()
        .innerRadius(innerR)
        .outerRadius(outerR)
        .padAngle(0.01),
    [innerR, outerR],
  );

  const ticks = useMemo(() => {
    const out: number[] = [];
    for (let bp = 0; bp <= design.lengthBp; bp += 500) out.push(bp);
    return out;
  }, [design.lengthBp]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={outerR + 12} fill="none" stroke={COLORS.navyTint} strokeWidth={1} strokeOpacity={0.4} />
        {ticks.map((bp) => {
          const a = angleFor(bp);
          const x1 = cx + Math.cos(a) * (outerR + 6);
          const y1 = cy + Math.sin(a) * (outerR + 6);
          const x2 = cx + Math.cos(a) * (outerR + 14);
          const y2 = cy + Math.sin(a) * (outerR + 14);
          return <line key={bp} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.paper} strokeOpacity={0.25} strokeWidth={1} />;
        })}

        {design.features.map((f, i) => {
          const isInsert = i === insertIndex;
          const effectiveEnd = isInsert ? f.start + (f.end - f.start) * sweep : f.end;
          const startAngle = angleFor(f.start);
          const endAngle = angleFor(effectiveEnd);
          const d = arcGen({ startAngle, endAngle }) ?? '';
          const active = hoveredFeatureId === f.id;
          const midAngle = (startAngle + endAngle) / 2;
          const labelR = outerR + 30;
          const lx = cx + Math.cos(midAngle) * labelR;
          const ly = cy + Math.sin(midAngle) * labelR;
          const anchorX = cx + Math.cos(midAngle) * (outerR + 14);
          const anchorY = cy + Math.sin(midAngle) * (outerR + 14);

          return (
            <g key={f.id} onMouseEnter={() => onHoverFeature(f.id)} onMouseLeave={() => onHoverFeature(null)} style={{ cursor: 'pointer' }}>
              <path
                d={d}
                fill={FEATURE_COLORS[f.type]}
                opacity={active ? 1 : 0.85}
                stroke={active ? COLORS.paper : 'none'}
                strokeWidth={active ? 1.5 : 0}
              />
              {f.end - f.start > design.lengthBp * 0.03 && (
                <>
                  <line x1={anchorX} y1={anchorY} x2={lx} y2={ly} stroke={COLORS.paper} strokeOpacity={0.3} strokeWidth={0.75} />
                  <text
                    x={lx + (Math.cos(midAngle) > 0 ? 4 : -4)}
                    y={ly}
                    textAnchor={Math.cos(midAngle) > 0 ? 'start' : 'end'}
                    dominantBaseline="middle"
                    className="data-text"
                    fontSize={9.5}
                    fill={active ? COLORS.brandYellow : 'rgba(255,255,255,0.7)'}
                  >
                    {f.name}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {insertIndex >= 0 && sweep > 0.98 && (
          <>
            {[design.features[insertIndex].start, design.features[insertIndex].end].map((bp, i) => {
              const a = angleFor(bp);
              const x = cx + Math.cos(a) * (innerR + (outerR - innerR) / 2);
              const y = cy + Math.sin(a) * (innerR + (outerR - innerR) / 2);
              return (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={3}
                  fill={COLORS.paper}
                  initial={{ opacity: 0.9, scale: 0.4 }}
                  animate={{ opacity: 0, scale: 3.2 }}
                  transition={{ duration: 0.6 }}
                />
              );
            })}
          </>
        )}

        <text x={cx} y={cy - 6} textAnchor="middle" className="data-text" fontSize={13} fill={COLORS.paper} fontWeight={700}>
          {design.lengthBp.toLocaleString()} bp
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" className="data-text" fontSize={9} fill="rgba(255,255,255,0.5)" letterSpacing={1}>
          {design.topology === 'hairpin' ? 'HAIRPIN' : 'DUAL PROMOTER'}
        </text>
      </svg>
    </div>
  );
}
