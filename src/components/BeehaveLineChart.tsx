import { useId, useRef, useState } from "react";

/* One small line chart for the BEEHAVE figures.
 *
 * The x axis is ordinal: a handful of swept levels or simulated years, evenly
 * spaced, because the sweep values (0, 0.01, 0.05, 0.1, 0.5) are steps the
 * dry lab chose rather than a continuous scale. The y axis is linear, or
 * log-like when `yMap` is passed.
 *
 * Marks follow the dataviz rules the rest of the wiki uses: 2px lines, a 2px
 * surface ring round every marker so crossings stay legible, hairline solid
 * gridlines, and text in ink rather than in the series colour. A marker is
 * hollow where `hollow` says so (a run that ended in collapse), so that state
 * never rests on colour alone.
 *
 * Pointer: hovering anywhere over the plot picks the nearest x and lists every
 * series' value there. Clicking calls `onPick`, so the efficiency figure can be
 * driven from the chart as well as from its slider, which is the keyboard
 * route. Every value the tooltip shows is also in the figure's table, so
 * nothing lives only behind the pointer.
 */

export interface LineSeries {
  key: string;
  name: string;
  color: string;
  /** One value per x position; null where the run had already ended. */
  values: (number | null)[];
  /** Per x position, whether that point is drawn hollow. */
  hollow?: boolean[];
  /** Muted reference line rather than a data series. */
  reference?: boolean;
}

interface Props {
  title: string;
  ariaLabel: string;
  xLabels: string[];
  /** Fuller names for the tooltip head ("Year 3" for an axis tick "3"). */
  xNames?: string[];
  xTitle: string;
  yTicks: number[];
  yFormat: (v: number) => string;
  /** Value to plotted position, for a log-like axis. Identity by default. */
  yMap?: (v: number) => number;
  /** Value at the top of the plot, when it should sit above the last tick. */
  yTop?: number;
  series: LineSeries[];
  /** Horizontal rule across the plot, e.g. the 90% target. */
  rule?: { y: number; label: string };
  /** Column to mark as selected. */
  selected?: number;
  onPick?: (index: number) => void;
  /** Print each series' name at the end of its line. */
  directLabels?: boolean;
  /** How a value reads in the tooltip. Defaults to yFormat. */
  valueFormat?: (v: number) => string;
}

const W = 360;
const H = 232;
const M = { top: 12, right: 12, bottom: 40, left: 52 };

export function BeehaveLineChart({
  title,
  ariaLabel,
  xLabels,
  xNames = xLabels,
  xTitle,
  yTicks,
  yFormat,
  yMap = (v) => v,
  yTop,
  series,
  rule,
  selected,
  onPick,
  directLabels = false,
  valueFormat = yFormat,
}: Props) {
  const clip = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const right = directLabels ? 78 : M.right;
  const plotW = W - M.left - right;
  const plotH = H - M.top - M.bottom;
  const lo = yMap(yTicks[0]);
  const hi = yMap(yTop ?? yTicks[yTicks.length - 1]);
  const n = xLabels.length;
  const x = (i: number) =>
    M.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v: number) => M.top + plotH - ((yMap(v) - lo) / (hi - lo)) * plotH;

  const nearest = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const box = svg.getBoundingClientRect();
    const px = ((clientX - box.left) / box.width) * W;
    const i = Math.round(((px - M.left) / plotW) * (n - 1));
    return Math.min(n - 1, Math.max(0, i));
  };

  // Direct labels sit at the last drawn point of each data series, nudged
  // apart so two lines ending at the same value do not print on each other.
  const labels = directLabels
    ? dodge(
        series
          .filter((s) => !s.reference)
          .map((s) => {
            const last = lastIndex(s.values);
            return last === null
              ? null
              : { key: s.key, name: s.name, y: y(s.values[last] as number) };
          })
          .filter(
            (l): l is { key: string; name: string; y: number } => l !== null,
          ),
        13,
        M.top + 4,
        M.top + plotH,
      )
    : [];

  const shown = hover ?? null;

  return (
    <div className="bh-chart">
      <p className="bh-chart-title">{title}</p>
      <div className="bh-chart-plot">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={ariaLabel}
          onPointerMove={(e) => setHover(nearest(e.clientX))}
          onPointerLeave={() => setHover(null)}
          onClick={(e) => {
            const i = nearest(e.clientX);
            if (i !== null && onPick) onPick(i);
          }}
          className={onPick ? "is-pickable" : undefined}
        >
          <defs>
            <clipPath id={clip}>
              <rect
                x={M.left - 6}
                y={M.top - 6}
                width={plotW + 12}
                height={plotH + 12}
              />
            </clipPath>
          </defs>

          {selected !== undefined && (
            <rect
              className="bh-selected-col"
              x={x(selected) - Math.max(10, plotW / (n - 1) / 2.6)}
              y={M.top}
              width={Math.max(20, plotW / (n - 1) / 1.3)}
              height={plotH}
            />
          )}

          {yTicks.map((t) => (
            <g key={t}>
              <line
                className="bh-grid"
                x1={M.left}
                x2={M.left + plotW}
                y1={y(t)}
                y2={y(t)}
              />
              <text
                className="bh-tick"
                x={M.left - 6}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
              >
                {yFormat(t)}
              </text>
            </g>
          ))}

          {xLabels.map((label, i) => (
            <text
              key={label}
              className="bh-tick"
              x={x(i)}
              y={M.top + plotH + 15}
              textAnchor="middle"
            >
              {label}
            </text>
          ))}
          <text
            className="bh-axis-title"
            x={M.left + plotW / 2}
            y={H - 6}
            textAnchor="middle"
          >
            {xTitle}
          </text>

          {rule && (
            <g>
              <line
                className="bh-rule"
                x1={M.left}
                x2={M.left + plotW}
                y1={y(rule.y)}
                y2={y(rule.y)}
              />
              <text className="bh-rule-label" x={M.left + 4} y={y(rule.y) - 4}>
                {rule.label}
              </text>
            </g>
          )}

          {shown !== null && (
            <line
              className="bh-crosshair"
              x1={x(shown)}
              x2={x(shown)}
              y1={M.top}
              y2={M.top + plotH}
            />
          )}

          <g clipPath={`url(#${clip})`}>
            {series.map((s) => (
              <path
                key={s.key}
                className={s.reference ? "bh-line bh-line--ref" : "bh-line"}
                style={s.reference ? undefined : { stroke: s.color }}
                d={pathOf(s.values, x, y)}
              />
            ))}
            {series
              .filter((s) => !s.reference)
              .map((s) =>
                s.values.map((v, i) =>
                  v === null ? null : (
                    <g key={`${s.key}-${i}`}>
                      <circle
                        className="bh-dot-ring"
                        cx={x(i)}
                        cy={y(v)}
                        r={6.5}
                      />
                      <circle
                        className="bh-dot"
                        style={{
                          stroke: s.color,
                          fill: s.hollow?.[i] ? "var(--surface)" : s.color,
                        }}
                        cx={x(i)}
                        cy={y(v)}
                        r={4.5}
                      />
                    </g>
                  ),
                ),
              )}
          </g>

          {labels.map((l) => (
            <text
              key={l.key}
              className="bh-direct"
              x={W - right + 8}
              y={l.y}
              dy="0.32em"
            >
              {l.name}
            </text>
          ))}
        </svg>

        {shown !== null && (
          <div
            className="bh-tooltip"
            style={{ left: `${(x(shown) / W) * 100}%` }}
            data-side={x(shown) > W * 0.6 ? "left" : "right"}
            aria-hidden="true"
          >
            <p className="bh-tooltip-head">{xNames[shown]}</p>
            <ul>
              {series.map((s) => {
                const v = s.values[shown];
                return (
                  <li key={s.key}>
                    <span
                      className={s.reference ? "bh-key bh-key--ref" : "bh-key"}
                      style={s.reference ? undefined : { background: s.color }}
                    />
                    {s.name}: {v === null ? "ended" : valueFormat(v)}
                    {v !== null && s.hollow?.[shown] ? ", collapsed" : ""}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function lastIndex(values: (number | null)[]): number | null {
  for (let i = values.length - 1; i >= 0; i--) if (values[i] !== null) return i;
  return null;
}

/** An SVG path through the non-null values, broken wherever one is null. */
function pathOf(
  values: (number | null)[],
  x: (i: number) => number,
  y: (v: number) => number,
): string {
  let d = "";
  let pen = false;
  values.forEach((v, i) => {
    if (v === null) {
      pen = false;
      return;
    }
    d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
    pen = true;
  });
  return d;
}

/** Spread label positions so no two are closer than `gap`, inside [lo, hi]. */
function dodge<T extends { y: number }>(
  items: T[],
  gap: number,
  lo: number,
  hi: number,
): T[] {
  const sorted = [...items].sort((a, b) => a.y - b.y).map((it) => ({ ...it }));
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].y - sorted[i - 1].y < gap)
      sorted[i].y = sorted[i - 1].y + gap;
  }
  const overflow = sorted.length ? sorted[sorted.length - 1].y - hi : 0;
  if (overflow > 0) sorted.forEach((it) => (it.y -= overflow));
  for (let i = sorted.length - 2; i >= 0; i--) {
    if (sorted[i + 1].y - sorted[i].y < gap)
      sorted[i].y = sorted[i + 1].y - gap;
  }
  sorted.forEach((it) => (it.y = Math.max(lo, it.y)));
  return sorted;
}
