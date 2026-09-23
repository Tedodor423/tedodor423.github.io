import type { CassetteDesign } from '@/lib/api/types';

export function buildFasta(design: CassetteDesign): string {
  const header = `>NECTAR_DESIGNER_${design.chassis}_${design.topology}_${design.lengthBp}bp DEMO DATA`;
  const wrapped: string[] = [];
  for (let i = 0; i < design.sequence.length; i += 70) {
    wrapped.push(design.sequence.slice(i, i + 70));
  }
  return `${header}\n${wrapped.join('\n')}\n`;
}
