import type { CassetteDesign } from '@/lib/api/types';

const FEATURE_KEY: Record<string, string> = {
  promoter: 'promoter',
  insert: 'misc_feature',
  terminator: 'terminator',
  marker: 'gene',
  'homology-arm': 'misc_feature',
  loop: 'misc_structure',
};

function today(): string {
  const d = new Date();
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
}

function formatOrigin(seq: string): string {
  const lower = seq.toLowerCase();
  const lines: string[] = [];
  for (let i = 0; i < lower.length; i += 60) {
    const pos = String(i + 1).padStart(9, ' ');
    const chunk = lower.slice(i, i + 60);
    const groups: string[] = [];
    for (let g = 0; g < chunk.length; g += 10) groups.push(chunk.slice(g, g + 10));
    lines.push(`${pos} ${groups.join(' ')}`);
  }
  return lines.join('\n');
}

export function buildGenBank(design: CassetteDesign): string {
  const name = `APIARY_${design.chassis.toUpperCase().replace(/-/g, '_')}`;
  const lines: string[] = [];
  lines.push(
    `LOCUS       ${name.padEnd(20)} ${String(design.lengthBp).padStart(5)} bp    DNA     linear   SYN ${today()}`,
  );
  lines.push(`DEFINITION  Synthetic dsRNA expression cassette (${design.topology}) — DEMO DATA, not a real construct.`);
  lines.push('ACCESSION   .');
  lines.push('VERSION     .');
  lines.push('KEYWORDS    .');
  lines.push('SOURCE      synthetic construct');
  lines.push('  ORGANISM  synthetic construct');
  lines.push('FEATURES             Location/Qualifiers');
  lines.push('     source          1..' + design.lengthBp);
  lines.push('                     /organism="synthetic construct"');
  lines.push('                     /mol_type="other DNA"');
  for (const f of design.features) {
    const key = FEATURE_KEY[f.type] ?? 'misc_feature';
    const loc = f.strand === -1 ? `complement(${f.start + 1}..${f.end})` : `${f.start + 1}..${f.end}`;
    lines.push(`     ${key.padEnd(16)}${loc}`);
    lines.push(`                     /label="${f.name}"`);
  }
  for (const site of design.goldenGateSites) {
    if (site.removed) continue;
    lines.push(`     misc_feature    ${site.position + 1}..${site.position + site.sequence.length}`);
    lines.push(`                     /label="${site.enzyme} site"`);
    lines.push(`                     /note="unremoved Golden Gate recognition site"`);
  }
  lines.push('ORIGIN');
  lines.push(formatOrigin(design.sequence));
  lines.push('//');
  return lines.join('\n');
}
