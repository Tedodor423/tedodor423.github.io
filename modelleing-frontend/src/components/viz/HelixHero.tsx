import { useEffect, useMemo, useRef } from 'react';
import { line as d3line, curveNatural } from 'd3-shape';
import { NUCLEOTIDE_COLORS } from '@/lib/theme';
import { rngFor } from '@/lib/api/mock/prng';

const BASES: Array<keyof typeof NUCLEOTIDE_COLORS> = ['A', 'U', 'G', 'C'];
const VIEW_W = 1000;
const VIEW_H = 380;
const MID_Y = VIEW_H / 2;
const AMPLITUDE = 88;
const FREQ = 0.026;
const RUNG_STEP = 14;
const SPEED = 0.00062;

export function HelixHero({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const topPathRef = useRef<SVGPathElement>(null);
  const bottomPathRef = useRef<SVGPathElement>(null);
  const backRungGroupRef = useRef<SVGGElement>(null);
  const frontRungGroupRef = useRef<SVGGElement>(null);
  const parallax = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const visibleRef = useRef(true);

  const xSamples = useMemo(() => {
    const out: number[] = [];
    for (let x = -20; x <= VIEW_W + 20; x += 8) out.push(x);
    return out;
  }, []);

  const rungColors = useMemo(() => {
    const rng = rngFor('helix-hero-bases');
    const colors: string[] = [];
    for (let x = 0; x <= VIEW_W; x += RUNG_STEP) {
      colors.push(NUCLEOTIDE_COLORS[rng.pick(BASES)]);
    }
    return colors;
  }, []);

  const buildPath = useMemo(() => {
    const gen = d3line<[number, number]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(curveNatural);
    return (pts: Array<[number, number]>) => gen(pts) ?? '';
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.01 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      parallax.current.targetX = nx * 14;
      parallax.current.targetY = ny * 8;
    };
    container.addEventListener('mousemove', onMove);
    return () => container.removeEventListener('mousemove', onMove);
  }, [reducedMotion]);

  useEffect(() => {
    let raf = 0;
    let t = 0;

    const render = (tVal: number) => {
      const topPts: Array<[number, number]> = xSamples.map((x) => [
        x,
        MID_Y - AMPLITUDE * Math.sin(FREQ * x + tVal),
      ]);
      const bottomPts: Array<[number, number]> = xSamples.map((x) => [
        x,
        MID_Y + AMPLITUDE * Math.sin(FREQ * x + tVal),
      ]);

      topPathRef.current?.setAttribute('d', buildPath(topPts));
      bottomPathRef.current?.setAttribute('d', buildPath(bottomPts));

      let backHtml = '';
      let frontHtml = '';
      let i = 0;
      for (let x = 0; x <= VIEW_W; x += RUNG_STEP, i++) {
        const theta = FREQ * x + tVal;
        const depth = Math.cos(theta);
        const yTop = MID_Y - AMPLITUDE * Math.sin(theta);
        const yBottom = MID_Y + AMPLITUDE * Math.sin(theta);
        const width = Math.max(1.2, 7 * Math.abs(depth));
        const opacity = 0.22 + 0.68 * ((depth + 1) / 2);
        const color = rungColors[i] ?? NUCLEOTIDE_COLORS.A;
        const h = Math.abs(yBottom - yTop);
        const y = Math.min(yTop, yBottom);
        const rect = `<rect x="${(x - width / 2).toFixed(2)}" y="${y.toFixed(2)}" width="${width.toFixed(2)}" height="${h.toFixed(2)}" rx="${(width / 2).toFixed(2)}" fill="${color}" opacity="${opacity.toFixed(3)}" />`;
        if (depth >= 0) frontHtml += rect;
        else backHtml += rect;
      }

      if (backRungGroupRef.current) backRungGroupRef.current.innerHTML = backHtml;
      if (frontRungGroupRef.current) frontRungGroupRef.current.innerHTML = frontHtml;

      parallax.current.x += (parallax.current.targetX - parallax.current.x) * 0.06;
      parallax.current.y += (parallax.current.targetY - parallax.current.y) * 0.06;
      if (groupRef.current) {
        groupRef.current.setAttribute(
          'transform',
          `translate(${parallax.current.x.toFixed(2)}, ${parallax.current.y.toFixed(2)})`,
        );
      }
    };

    if (reducedMotion) {
      render(0);
      return;
    }

    const loop = () => {
      if (visibleRef.current) {
        t += SPEED * 16;
        render(t);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, xSamples, rungColors, buildPath]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <g ref={groupRef}>
          <g ref={backRungGroupRef} />
          <path ref={topPathRef} fill="none" stroke="var(--color-paper)" strokeWidth={3.5} strokeOpacity={0.85} />
          <path ref={bottomPathRef} fill="none" stroke="var(--color-paper)" strokeWidth={3.5} strokeOpacity={0.85} />
          <g ref={frontRungGroupRef} />
        </g>
      </svg>
    </div>
  );
}
