// Mirrors the tokens in src/index.css's @theme block. Kept as plain
// constants because D3 scales and canvas/SVG viz code need JS values, not
// CSS custom properties.

export const COLORS = {
  brandYellow: '#F2C94C',
  navy: '#16265C',
  navyDeep: '#101C47',
  navyTint: '#2E3F73',
  ink: '#0D0D0D',
  flameStart: '#F26B21',
  flameEnd: '#FBB040',
  wax: '#BFA97C',
  paper: '#FFFFFF',
} as const;

export const NUCLEOTIDE_COLORS: Record<'A' | 'C' | 'G' | 'U', string> = {
  A: '#3EC6E0',
  U: '#EF5DA8',
  G: '#57D68D',
  C: '#9B7BF0',
};

export const SEMANTIC_COLORS = {
  pass: '#3FAE72',
  caution: '#D9A441',
  hit: '#E3473F',
} as const;

export function baseColor(base: string): string {
  const key = base.toUpperCase();
  if (key === 'T') return NUCLEOTIDE_COLORS.U;
  return (NUCLEOTIDE_COLORS as Record<string, string>)[key] ?? COLORS.navyTint;
}

/** Continuous accessibility ramp: navy (occluded) -> brand yellow (open).
 * The one place yellow carries data instead of meaning chrome/open-state. */
export function accessibilityColor(t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  const from = { r: 0x2e, g: 0x3f, b: 0x73 }; // navy-tint
  const to = { r: 0xf2, g: 0xc9, b: 0x4c }; // brand-yellow
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * clamped);
  const r = lerp(from.r, to.r);
  const g = lerp(from.g, to.g);
  const b = lerp(from.b, to.b);
  return `rgb(${r}, ${g}, ${b})`;
}
