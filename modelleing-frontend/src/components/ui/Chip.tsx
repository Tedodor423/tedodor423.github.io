import { X } from 'lucide-react';

export interface ChipProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  unscreenable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

export function Chip({ label, active, disabled, unscreenable, onClick, onRemove }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !unscreenable}
      className={`data-text inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs transition-colors ${
        unscreenable
          ? 'border-caution/60 bg-caution/10 text-caution'
          : active
            ? 'border-brand-yellow bg-brand-yellow text-ink'
            : 'border-paper/25 bg-transparent text-paper/80 hover:border-paper/50'
      } ${disabled && !unscreenable ? 'cursor-not-allowed opacity-40' : ''}`}
      title={unscreenable ? `${label} — no reference transcriptome, cannot be screened` : label}
    >
      {label}
      {unscreenable && <span className="text-[10px] uppercase tracking-wide">unscreenable</span>}
      {onRemove && active && (
        <X
          size={12}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </button>
  );
}
