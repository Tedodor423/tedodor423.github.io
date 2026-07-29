// Hand-rolled, dependency-free single-page PDF writer. No embedded fonts —
// uses the standard Helvetica base-14 font, so text must be WinAnsi-safe.

function sanitizeAscii(s: string): string {
  return s
    .replace(/Δ/g, 'D')
    .replace(/µ/g, 'u')
    .replace(/[–—]/g, '-')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/·/g, '.')
    .replace(/≈/g, '~')
    .replace(/[^\x20-\x7E]/g, '?');
}

function pdfEscape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

const MAX_LINES = 46;

export function buildReportPdf(title: string, lines: string[]): Blob {
  const body = lines.slice(0, MAX_LINES).map(sanitizeAscii);
  if (lines.length > MAX_LINES) body.push(`… (${lines.length - MAX_LINES} more lines truncated)`);

  const content: string[] = [
    'BT',
    '/F2 18 Tf',
    '40 740 Td',
    `(${pdfEscape(sanitizeAscii(title))}) Tj`,
    '/F1 9 Tf',
    '0 -26 Td',
    '12 TL',
    ...body.map((line) => `(${pdfEscape(line)}) Tj T*`),
    'ET',
  ];
  const streamContent = content.join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>',
    `<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}
