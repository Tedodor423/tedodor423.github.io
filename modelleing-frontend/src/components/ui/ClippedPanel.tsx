import type { CSSProperties, ReactNode } from 'react';

function clipPath(cut: number): string {
  return `polygon(${cut}px 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, ${cut}px 100%, 0 calc(100% - ${cut}px), 0 ${cut}px)`;
}

export interface ClippedPanelProps {
  children: ReactNode;
  cut?: number;
  bg?: string;
  className?: string;
  style?: CSSProperties;
  /** Flat offset shadow, no blur — the brand's depth device. */
  offset?: boolean;
  offsetColor?: string;
  as?: 'div' | 'section' | 'article' | 'header';
}

export function ClippedPanel({
  children,
  cut = 18,
  bg = 'var(--color-navy)',
  className = '',
  style,
  offset = false,
  offsetColor = 'var(--color-flame-start)',
  as: Tag = 'div',
}: ClippedPanelProps) {
  const path = clipPath(cut);
  return (
    <div className={`relative ${className}`} style={style}>
      {offset && (
        <div
          aria-hidden
          className="absolute inset-0 translate-x-[7px] translate-y-[7px]"
          style={{ background: offsetColor, clipPath: path }}
        />
      )}
      <Tag className="relative h-full w-full" style={{ background: bg, clipPath: path }}>
        {children}
      </Tag>
    </div>
  );
}
