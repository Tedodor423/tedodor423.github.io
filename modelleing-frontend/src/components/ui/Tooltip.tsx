import { useState, type MouseEvent, type FocusEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface TooltipProps {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Portal-rendered so it always escapes clip-path'd panels (a clip-path
 * clips its whole subtree, including anything absolutely positioned inside
 * it — a normal in-place tooltip would get cut off at the panel's edge).
 * The wrapper is `display: contents` so it never affects flex/grid layout
 * of whatever it wraps; position is taken from the cursor/focus target
 * rather than the wrapper's own box, since a `display: contents` element
 * has no box to measure.
 */
const HALF_WIDTH = 124; // half of the tooltip's max-width, plus a little breathing room
const EDGE_MARGIN = 8;

export function Tooltip({ label, children, className }: TooltipProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const showAt = (x: number, y: number) => {
    const clampedX = Math.min(window.innerWidth - HALF_WIDTH - EDGE_MARGIN, Math.max(HALF_WIDTH + EDGE_MARGIN, x));
    const clampedY = Math.max(36, y);
    setPos({ x: clampedX, y: clampedY });
  };
  const hide = () => setPos(null);

  return (
    <span
      style={{ display: 'contents' }}
      className={className}
      onMouseEnter={(e: MouseEvent) => showAt(e.clientX, e.clientY)}
      onMouseMove={(e: MouseEvent) => showAt(e.clientX, e.clientY)}
      onMouseLeave={hide}
      onFocus={(e: FocusEvent) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        showAt(rect.left + rect.width / 2, rect.top);
      }}
      onBlur={hide}
    >
      {children}
      {pos &&
        createPortal(
          <div
            role="tooltip"
            className="pointer-events-none fixed z-[9999]"
            style={{ left: pos.x, top: pos.y - 10, transform: 'translate(-50%, -100%)' }}
          >
            <div className="data-text max-w-[240px] border border-brand-yellow/40 bg-ink px-2.5 py-1.5 text-[11px] leading-snug text-paper shadow-[0_3px_0_rgba(0,0,0,0.35)]">
              {label}
            </div>
          </div>,
          document.body,
        )}
    </span>
  );
}
