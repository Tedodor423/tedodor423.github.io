export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  helpText?: string;
}

export function Slider({ label, value, min, max, step = 1, unit = '', onChange, helpText }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-heading text-sm font-semibold text-paper/90">{label}</span>
        <span className="data-text text-sm text-brand-yellow">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none bg-navy-tint accent-brand-yellow"
        style={{
          background: `linear-gradient(90deg, var(--color-brand-yellow) ${pct}%, var(--color-navy-tint) ${pct}%)`,
        }}
      />
      {helpText && <p className="mt-2 text-xs leading-relaxed text-paper/60">{helpText}</p>}
    </div>
  );
}
