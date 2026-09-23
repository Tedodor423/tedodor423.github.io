import { useId } from 'react';
import { motion } from 'framer-motion';
import { flatTopHex } from '@/lib/viz/hex';
import { COLORS } from '@/lib/theme';

export interface HexCellProps {
  size?: number;
  fill: string;
  /** 0 = fully open (base colour shows through), 1 = fully capped (wax opaque). */
  capFraction?: number;
  capColor?: string;
  stroke?: string;
  strokeWidth?: number;
  title?: string;
  onHover?: (hover: boolean) => void;
  onClick?: () => void;
  className?: string;
  reduceMotion?: boolean;
}

/** The capped-cell primitive: occlusion renders as wax closing in from the
 * cell's top edge, not as an opacity fade. Every accessibility surface in the
 * app (CombStrip, CombProgress) is built from this one shape. */
export function HexCell({
  size = 20,
  fill,
  capFraction = 0,
  capColor = COLORS.wax,
  stroke = COLORS.navyTint,
  strokeWidth = 1,
  title,
  onHover,
  onClick,
  className,
  reduceMotion,
}: HexCellProps) {
  const maskId = useId();
  const r = size / 2;
  const hex = flatTopHex(r, r, r - strokeWidth);
  const clampedCap = Math.min(1, Math.max(0, capFraction));

  return (
    <svg
      width={hex.width}
      height={hex.height}
      viewBox={`0 0 ${hex.width} ${hex.height}`}
      className={className}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <mask id={maskId}>
          <rect x={0} y={0} width={hex.width} height={hex.height} fill="black" />
          <motion.rect
            x={0}
            width={hex.width}
            fill="white"
            initial={false}
            animate={{ height: clampedCap * hex.height, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 210, damping: 32 }}
          />
        </mask>
      </defs>
      <polygon points={hex.points} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      {clampedCap > 0.01 && (
        <polygon points={hex.points} fill={capColor} mask={`url(#${maskId})`} />
      )}
      <polygon points={hex.points} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  );
}
