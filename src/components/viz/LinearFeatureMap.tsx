import type { CassetteDesign, CassetteFeature } from '@/lib/api/types';
import { COLORS } from '@/lib/theme';

export const FEATURE_LABELS: Record<CassetteFeature['type'], string> = {
  promoter: 'Promoter',
  insert: 'Insert',
  terminator: 'Terminator',
  marker: 'Marker',
  'homology-arm': 'Homology arm',
  loop: 'Loop',
};

const FEATURE_COLORS: Record<CassetteFeature['type'], string> = {
  promoter: COLORS.brandYellow,
  insert: COLORS.flameStart,
  terminator: COLORS.navyTint,
  marker: '#9B7BF0',
  'homology-arm': '#57D68D',
  loop: COLORS.wax,
};

export function LinearFeatureMap({
  design,
  hoveredFeatureId,
  onHoverFeature,
}: {
  design: CassetteDesign;
  hoveredFeatureId: string | null;
  onHoverFeature: (id: string | null) => void;
}) {
  return (
    <div>
      <div className="flex h-8 w-full overflow-hidden border border-navy-tint">
        {design.features.map((f) => {
          const pct = ((f.end - f.start) / design.lengthBp) * 100;
          const active = hoveredFeatureId === f.id;
          return (
            <div
              key={f.id}
              onMouseEnter={() => onHoverFeature(f.id)}
              onMouseLeave={() => onHoverFeature(null)}
              style={{ width: `${pct}%`, background: FEATURE_COLORS[f.type] }}
              className={`relative flex items-center justify-center border-r border-navy-deep/60 last:border-r-0 ${active ? 'brightness-110' : ''}`}
              title={`${f.name} (${f.start}–${f.end})`}
            >
              {f.strand === 1 ? (
                <span className="text-[8px] text-ink/60">▶</span>
              ) : (
                <span className="text-[8px] text-ink/60">◀</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {(Object.keys(FEATURE_LABELS) as CassetteFeature['type'][])
          .filter((t) => design.features.some((f) => f.type === t))
          .map((t) => (
            <span key={t} className="data-text flex items-center gap-1.5 text-[10px] text-paper/60">
              <span className="inline-block h-2 w-2" style={{ background: FEATURE_COLORS[t] }} />
              {FEATURE_LABELS[t]}
            </span>
          ))}
      </div>
    </div>
  );
}
