import { useEffect, useMemo, useRef, useState } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
  forceRadial,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import { HexCell } from '@/components/ui/HexCell';
import { NUCLEOTIDE_COLORS, accessibilityColor, COLORS } from '@/lib/theme';
import type { FoldingProfile } from '@/lib/api/types';

interface SimNode extends SimulationNodeDatum {
  localIndex: number;
  globalIndex: number;
  base: string;
  paired: boolean;
  accessibility: number;
}

type SimLink = SimulationLinkDatum<SimNode>;

export interface FoldedStructureProps {
  profile: FoldingProfile;
  range: [number, number];
  colorMode?: 'base' | 'accessibility';
  highlightRange?: [number, number] | null;
  highlightLabel?: string;
  reducedMotion?: boolean;
  width: number;
  height: number;
}

function buildGraph(profile: FoldingProfile, range: [number, number]) {
  const [start, end] = range;
  const paired = new Set<number>();
  const pairLinksGlobal: Array<[number, number]> = [];
  for (const [i, j] of profile.pairs) {
    if (i >= start && i < end && j >= start && j < end) {
      paired.add(i);
      paired.add(j);
      pairLinksGlobal.push([i, j]);
    }
  }
  const nodes: SimNode[] = [];
  for (let g = start; g < end; g++) {
    nodes.push({
      localIndex: g - start,
      globalIndex: g,
      base: profile.sequence[g] ?? 'A',
      paired: paired.has(g),
      accessibility: profile.unpairedProbability[g] ?? 0.5,
    });
  }
  return { nodes, pairLinksGlobal };
}

export function FoldedStructure({
  profile,
  range,
  colorMode = 'base',
  highlightRange,
  highlightLabel,
  reducedMotion = false,
  width,
  height,
}: FoldedStructureProps) {
  const { nodes: baseNodes, pairLinksGlobal } = useMemo(
    () => buildGraph(profile, range),
    [profile, range],
  );

  const [renderNodes, setRenderNodes] = useState<SimNode[]>(baseNodes);
  const [settleProgress, setSettleProgress] = useState(0);
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null);

  useEffect(() => {
    if (width <= 0 || height <= 0 || baseNodes.length === 0) return;

    const nodes = baseNodes.map((n, i) => ({
      ...n,
      x: 24 + (i / Math.max(1, baseNodes.length - 1)) * (width - 48),
      y: height / 2,
    }));
    const nodeByLocal = new Map(nodes.map((n) => [n.localIndex, n]));
    const [start] = range;

    const backboneLinks: SimLink[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      backboneLinks.push({ source: nodes[i], target: nodes[i + 1] });
    }
    const pairLinks: SimLink[] = pairLinksGlobal
      .map(([gi, gj]) => {
        const a = nodeByLocal.get(gi - start);
        const b = nodeByLocal.get(gj - start);
        return a && b ? ({ source: a, target: b } as SimLink) : null;
      })
      .filter((l): l is SimLink => l !== null);

    const radius = Math.min(width, height) / 2.5;
    const sim = forceSimulation<SimNode>(nodes)
      .force('backbone', forceLink<SimNode, SimLink>(backboneLinks).distance(9).strength(0.9))
      .force('pair', forceLink<SimNode, SimLink>(pairLinks).distance(11).strength(0.75))
      .force('charge', forceManyBody().strength(-22))
      .force('collide', forceCollide(5.2))
      .force('radial', forceRadial(radius, width / 2, height / 2).strength(0.035))
      .alpha(1)
      .alphaDecay(0.018)
      .stop();

    simRef.current = sim;

    if (reducedMotion) {
      for (let k = 0; k < 260; k++) sim.tick();
      setRenderNodes(nodes.slice());
      setSettleProgress(1);
      return;
    }

    setSettleProgress(0);
    let raf = 0;
    let frame = 0;
    const step = () => {
      sim.tick();
      frame++;
      if (frame % 2 === 0) {
        setRenderNodes(nodes.slice());
        setSettleProgress(Math.min(1, 1 - sim.alpha()));
      }
      if (sim.alpha() > sim.alphaMin() && frame < 400) {
        raf = requestAnimationFrame(step);
      } else {
        setRenderNodes(nodes.slice());
        setSettleProgress(1);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [baseNodes, pairLinksGlobal, range, width, height, reducedMotion]);

  const highlightSet = useMemo(() => {
    if (!highlightRange) return null;
    const [hs, he] = highlightRange;
    const [start] = range;
    const set = new Set<number>();
    for (let g = hs; g < he; g++) {
      const li = g - start;
      if (li >= 0 && li < baseNodes.length) set.add(li);
    }
    return set;
  }, [highlightRange, range, baseNodes.length]);

  const backboneD = useMemo(() => {
    return renderNodes
      .map((n, i) => `${i === 0 ? 'M' : 'L'}${(n.x ?? 0).toFixed(1)},${(n.y ?? 0).toFixed(1)}`)
      .join(' ');
  }, [renderNodes]);

  const pairSegments = useMemo(() => {
    const [start] = range;
    const byLocal = new Map(renderNodes.map((n) => [n.localIndex, n]));
    return pairLinksGlobal
      .map(([gi, gj]) => {
        const a = byLocal.get(gi - start);
        const b = byLocal.get(gj - start);
        return a && b ? { x1: a.x ?? 0, y1: a.y ?? 0, x2: b.x ?? 0, y2: b.y ?? 0 } : null;
      })
      .filter((s): s is { x1: number; y1: number; x2: number; y2: number } => s !== null);
  }, [renderNodes, pairLinksGlobal, range]);

  const highlightCentroid = useMemo(() => {
    if (!highlightSet || highlightSet.size === 0) return null;
    let sx = 0;
    let sy = 0;
    let n = 0;
    for (const node of renderNodes) {
      if (highlightSet.has(node.localIndex)) {
        sx += node.x ?? 0;
        sy += node.y ?? 0;
        n++;
      }
    }
    return n > 0 ? { x: sx / n, y: sy / n } : null;
  }, [highlightSet, renderNodes]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0"
      >
        <g transform="translate(-2,-2)">
          <path d={backboneD} fill="none" stroke={COLORS.paper} strokeOpacity={0.35} strokeWidth={1.5} />
        </g>
        <g transform="translate(2,2)">
          {pairSegments.map((s, i) => (
            <line
              key={i}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke={COLORS.brandYellow}
              strokeOpacity={0.55}
              strokeWidth={1}
              strokeDasharray="2 2"
            />
          ))}
        </g>
        {highlightCentroid && (
          <g>
            <line
              x1={highlightCentroid.x}
              y1={Math.max(14, highlightCentroid.y - 40)}
              x2={highlightCentroid.x}
              y2={highlightCentroid.y}
              stroke={COLORS.brandYellow}
              strokeWidth={1}
            />
            <text
              x={highlightCentroid.x}
              y={Math.max(10, highlightCentroid.y - 46)}
              textAnchor="middle"
              className="data-text"
              fontSize={10}
              fill={COLORS.brandYellow}
            >
              {highlightLabel}
            </text>
          </g>
        )}
      </svg>

      {renderNodes.map((n) => {
        const fill =
          colorMode === 'base'
            ? (NUCLEOTIDE_COLORS[n.base.toUpperCase() as keyof typeof NUCLEOTIDE_COLORS] ??
              COLORS.navyTint)
            : accessibilityColor(n.accessibility);
        const isHighlighted = highlightSet?.has(n.localIndex);
        return (
          <div
            key={n.localIndex}
            className="absolute"
            style={{
              left: (n.x ?? 0) - 6,
              top: (n.y ?? 0) - 6,
              filter: isHighlighted ? `drop-shadow(0 0 5px ${COLORS.brandYellow})` : undefined,
              zIndex: isHighlighted ? 5 : 1,
            }}
          >
            <HexCell
              size={12}
              fill={fill}
              capFraction={(1 - n.accessibility) * settleProgress}
              reduceMotion={reducedMotion}
              stroke={COLORS.navyDeep}
              strokeWidth={0.6}
            />
          </div>
        );
      })}
    </div>
  );
}
