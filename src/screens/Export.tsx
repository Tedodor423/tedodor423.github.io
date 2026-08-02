import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RotateCcw } from 'lucide-react';
import { useWizardStore } from '@/store/wizardStore';
import { ClippedPanel } from '@/components/ui/ClippedPanel';
import { Button } from '@/components/ui/Button';
import { buildGenBank } from '@/lib/export/genbank';
import { buildFasta } from '@/lib/export/fasta';
import { buildPrimers, primersToCsv } from '@/lib/export/primers';
import { buildReportPdf } from '@/lib/export/pdf';
import { downloadText, downloadBlob } from '@/lib/export/download';
import { CHASSIS_LABELS } from '@/lib/chassisLabels';
import { Tooltip } from '@/components/ui/Tooltip';

const KEYWORD_RE = /^(LOCUS|DEFINITION|ACCESSION|VERSION|KEYWORDS|SOURCE|FEATURES|ORIGIN|\/\/)/;
const FEATURE_RE = /^ {5}\S/;
const QUALIFIER_RE = /^\s+\//;

function highlightLine(line: string, i: number) {
  let cls = 'text-paper/55';
  if (KEYWORD_RE.test(line)) cls = 'text-brand-yellow font-bold';
  else if (FEATURE_RE.test(line)) cls = 'text-[#57D68D]';
  else if (QUALIFIER_RE.test(line)) cls = 'text-paper/45';
  else if (/^\s*\d/.test(line)) cls = 'text-paper/70';
  return (
    <div key={i} className={cls}>
      {line || ' '}
    </div>
  );
}

export function Export() {
  const navigate = useNavigate();
  const store = useWizardStore();
  const design = store.cassetteDesign;

  const genbank = useMemo(() => (design ? buildGenBank(design) : ''), [design]);
  const genbankLines = useMemo(() => genbank.split('\n'), [genbank]);

  const summaryLines = useMemo(() => {
    if (!design) return [];
    return [
      `Run date: ${new Date().toLocaleString()}`,
      `Organism: ${store.organism?.commonName ?? 'custom sequence'} (${store.organism?.scientificName ?? '-'})`,
      `Target class: ${store.targetClass ?? '-'}`,
      `Target gene(s): ${
        store.discoveredGenes
          .filter((g) => store.selectedGeneIds.includes(g.id))
          .map((g) => g.symbol)
          .join(', ') || '-'
      }`,
      `siRNA length: ${store.sirnaLength} nt`,
      `Off-target threshold: ${store.contiguousMatchThreshold} nt contiguous match`,
      `Species screened: ${store.screenSpeciesIds.length}`,
      `Survivors: ${store.offTargetReport?.survivorIds.length ?? 0} / ${
        (store.offTargetReport?.survivorIds.length ?? 0) + (store.offTargetReport?.rejectedIds.length ?? 0)
      } screened candidates (${store.sirnaCandidates.length} tiled total)`,
      `Delivery chassis: ${CHASSIS_LABELS[store.chassis]}`,
      `Cassette topology: ${design.topology}`,
      `Cassette length: ${design.lengthBp} bp`,
      `Golden Gate sites remaining: ${design.goldenGateSites.filter((s) => !s.removed).length}`,
      '',
      'DEMO DATA — every value above comes from a seeded mock generator, not a real prediction.',
    ];
  }, [design, store]);

  if (!design) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-paper/70">No cassette design yet.</p>
        <Button className="mt-4" onClick={() => navigate('/cassette')}>
          Back to cassette builder
        </Button>
      </div>
    );
  }

  const gbText = genbank;
  const fastaText = buildFasta(design);
  const primers = buildPrimers(design, store.sirnaCandidates);
  const csvText = primersToCsv(primers);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <span className="data-text text-xs font-bold tracking-[0.25em] text-brand-yellow uppercase">
          Step 07
        </span>
        <h1 className="font-display mt-1 text-4xl text-paper sm:text-5xl">Export</h1>
        <p className="mt-2 max-w-xl text-sm text-paper/65">
          Client-generated files from this run — no server round-trip.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <ClippedPanel cut={14}>
            <div className="space-y-1.5 p-5">
              {summaryLines.map((l, i) => (
                <div key={i} className="data-text text-xs text-paper/70">
                  {l}
                </div>
              ))}
            </div>
          </ClippedPanel>

          <div className="grid grid-cols-1 gap-2">
            <Tooltip label="Full annotated construct — sequence plus a FEATURES table, ready to open in a plasmid viewer.">
              <Button onClick={() => downloadText(`nectar_designer_cassette.gb`, gbText, 'text/plain')}>
                <Download size={14} /> .gb GenBank
              </Button>
            </Tooltip>
            <Tooltip label="Plain sequence only, no annotations — for BLAST, alignment tools, or synthesis order forms.">
              <Button variant="secondary" onClick={() => downloadText(`nectar_designer_cassette.fasta`, fastaText, 'text/plain')}>
                <Download size={14} /> .fasta
              </Button>
            </Tooltip>
            <Tooltip label="Forward/reverse primers for the full construct, plus a check primer per surviving candidate, with Wallace-rule Tm estimates.">
              <Button variant="secondary" onClick={() => downloadText(`nectar_designer_primers.csv`, csvText, 'text/csv')}>
                <Download size={14} /> Primer CSV
              </Button>
            </Tooltip>
            <Tooltip label="A one-page run summary as a real PDF, generated in the browser — no server involved.">
              <Button
                variant="secondary"
                onClick={() =>
                  downloadBlob('nectar_designer_report.pdf', buildReportPdf('NECTAR DESIGNER design run — DEMO DATA', summaryLines))
                }
              >
                <Download size={14} /> PDF report
              </Button>
            </Tooltip>
          </div>
        </div>

        <ClippedPanel cut={16}>
          <div className="flex items-center justify-between border-b border-navy-tint/60 px-4 py-3">
            <span className="data-text text-[11px] tracking-widest text-paper/50 uppercase">
              GenBank preview
            </span>
            <span className="data-text text-[10px] text-paper/40">{genbankLines.length} lines</span>
          </div>
          <div className="seq-text max-h-[560px] overflow-auto p-4 text-[11px] leading-relaxed whitespace-pre">
            {genbankLines.map(highlightLine)}
          </div>
        </ClippedPanel>
      </div>

      <div className="mt-10 flex justify-between">
        <Button variant="ghost" onClick={() => navigate('/cassette')}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            store.reset();
            navigate('/');
          }}
        >
          <RotateCcw size={16} />
          Start a new design run
        </Button>
      </div>
    </div>
  );
}
