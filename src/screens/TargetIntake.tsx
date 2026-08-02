import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Dna, Egg, Sprout, FileCode2, Search, CheckCircle2, XCircle } from 'lucide-react';
import { getApi } from '@/lib/api/client';
import type { Organism, TargetClass } from '@/lib/api/types';
import { useWizardStore } from '@/store/wizardStore';
import { ClippedPanel } from '@/components/ui/ClippedPanel';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { validateFasta } from '@/lib/fasta';
import { NUCLEOTIDE_COLORS } from '@/lib/theme';

const CLASS_CARDS: Array<{
  id: TargetClass;
  title: string;
  description: string;
  icon: typeof Dna;
}> = [
  { id: 'essential', title: 'Essential gene', description: 'Housekeeping / viability targets — lethal knockdown.', icon: Dna },
  { id: 'population-control', title: 'Population Control', description: 'Fertility and germline targets — suppresses population size, not individual survival.', icon: Egg },
  { id: 'developmental', title: 'Key Developmental Genes', description: 'Molting and metamorphosis targets — disrupts development rather than an adult-stage process.', icon: Sprout },
  { id: 'custom', title: 'Custom sequence', description: 'Paste your own FASTA-format target region.', icon: FileCode2 },
];

export function TargetIntake() {
  const navigate = useNavigate();
  const { organism, targetClass, customFasta, setOrganism, setTargetClass, setCustomFasta } =
    useWizardStore();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Organism[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSearching(true);
    const t = setTimeout(() => {
      getApi()
        .searchOrganisms(query)
        .then((r) => {
          if (!cancelled) {
            // Target intake only offers pests — non-target/human organisms
            // exist for the safety screening panel later, never as a target.
            setResults(r.filter((o) => o.kind === 'target'));
            setSearching(false);
          }
        });
    }, 180);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  const fastaValidation = useMemo(() => validateFasta(customFasta), [customFasta]);

  const canContinue =
    targetClass === 'custom' ? fastaValidation.isValid : Boolean(organism && targetClass);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <span className="data-text text-xs font-bold tracking-[0.25em] text-brand-yellow uppercase">
          Step 01
        </span>
        <h1 className="font-display mt-1 text-4xl text-paper sm:text-5xl">Target intake</h1>
        <p className="mt-2 max-w-xl text-sm text-paper/65">
          Pick the organism you're targeting and the class of gene the design should knock down.
        </p>
      </header>

      <section className="mb-10">
        <label className="mb-2 block font-heading text-sm font-semibold text-paper/85">
          Organism
        </label>
        <div className="relative">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-paper/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by common name, scientific name, or taxid…"
            className="data-text w-full border border-navy-tint bg-navy py-3 pr-4 pl-10 text-sm text-paper placeholder:text-paper/35 focus:border-brand-yellow focus:outline-none"
          />
        </div>

        <div className="mt-2 max-h-72 overflow-y-auto border border-navy-tint bg-navy-deep">
          {searching && <div className="px-4 py-3 text-xs text-paper/50">Searching…</div>}
          {!searching && results.length === 0 && (
            <div className="px-4 py-3 text-xs text-paper/50">No organisms match "{query}".</div>
          )}
          {!searching &&
            results.map((o) => (
              <button
                key={o.id}
                onClick={() => setOrganism(o)}
                className={`data-text flex w-full items-center justify-between border-b border-navy-tint/60 px-4 py-3 text-left text-sm last:border-b-0 hover:bg-navy-tint/40 ${
                  organism?.id === o.id ? 'bg-brand-yellow/10' : ''
                }`}
              >
                <span>
                  <span className="text-paper">{o.commonName}</span>
                  <span className="ml-2 text-paper/50 italic">{o.scientificName}</span>
                </span>
                <span className="text-paper/40">taxid {o.taxid}</span>
              </button>
            ))}
        </div>

        {organism && (
          <ClippedPanel cut={14} className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <div className="font-heading text-lg font-bold text-paper">{organism.commonName}</div>
                <div className="data-text text-sm text-paper/60 italic">{organism.scientificName}</div>
              </div>
              <div className="data-text flex flex-wrap gap-4 text-xs text-paper/70">
                <Tooltip label={`NCBI-style taxonomy id for ${organism.scientificName}.`}>
                  <span>taxid {organism.taxid}</span>
                </Tooltip>
                <Tooltip label="Which mock sequence database this organism's records are drawn from.">
                  <span>{organism.sourceDb}</span>
                </Tooltip>
                <Tooltip label="Number of transcripts in this organism's mock reference set.">
                  <span>{organism.transcriptCount.toLocaleString()} transcripts</span>
                </Tooltip>
                <Tooltip
                  label={
                    organism.hasReferenceTranscriptome
                      ? 'A reference transcriptome exists, so target discovery and off-target screening can both run against it.'
                      : 'No reference transcriptome available — this organism can be targeted, but it cannot be used as an off-target screening species.'
                  }
                >
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 font-bold uppercase ${
                      organism.hasReferenceTranscriptome
                        ? 'bg-pass/15 text-pass'
                        : 'bg-caution/15 text-caution'
                    }`}
                  >
                    {organism.hasReferenceTranscriptome ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {organism.hasReferenceTranscriptome ? 'Reference transcriptome' : 'No reference transcriptome'}
                  </span>
                </Tooltip>
              </div>
            </div>
          </ClippedPanel>
        )}
      </section>

      <section className="mb-10">
        <label className="mb-3 block font-heading text-sm font-semibold text-paper/85">
          Target class
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CLASS_CARDS.map((card) => {
            const Icon = card.icon;
            const active = targetClass === card.id;
            return (
              <button key={card.id} onClick={() => setTargetClass(card.id)} className="text-left">
                <ClippedPanel
                  cut={14}
                  bg={active ? 'var(--color-brand-yellow)' : 'var(--color-navy)'}
                  className="h-full transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex h-full flex-col gap-3 p-5">
                    <Icon size={26} color={active ? '#0D0D0D' : '#F2C94C'} />
                    <div className={`font-heading text-base font-bold ${active ? 'text-ink' : 'text-paper'}`}>
                      {card.title}
                    </div>
                    <p className={`text-xs leading-relaxed ${active ? 'text-ink/70' : 'text-paper/60'}`}>
                      {card.description}
                    </p>
                  </div>
                </ClippedPanel>
              </button>
            );
          })}
        </div>
      </section>

      {targetClass === 'custom' && (
        <section className="mb-10">
          <label className="mb-2 block font-heading text-sm font-semibold text-paper/85">
            Paste FASTA
          </label>
          <textarea
            value={customFasta}
            onChange={(e) => setCustomFasta(e.target.value)}
            rows={8}
            placeholder={'>my_target_region\nAUGGCCAUGGCGCCCAGAACUGAGAUCAAUAGUACCCGUAUUAACGGGUGA…'}
            className="data-text w-full resize-y border border-navy-tint bg-navy p-4 text-xs text-paper placeholder:text-paper/30 focus:border-brand-yellow focus:outline-none"
          />
          <div className="mt-3">
            {fastaValidation.totalLength > 0 && (
              <div className="mb-2 flex h-3 w-full overflow-hidden border border-navy-tint">
                {(['A', 'C', 'G', 'U'] as const).map((b) => {
                  const pct = (fastaValidation.composition[b] / fastaValidation.totalLength) * 100;
                  return (
                    <div
                      key={b}
                      style={{ width: `${pct}%`, background: NUCLEOTIDE_COLORS[b] }}
                      title={`${b}: ${pct.toFixed(1)}%`}
                    />
                  );
                })}
              </div>
            )}
            <div className="data-text flex items-center justify-between text-xs">
              <span className={fastaValidation.isValid ? 'text-pass' : 'text-caution'}>
                {fastaValidation.isValid
                  ? `Valid — ${fastaValidation.totalLength.toLocaleString()} nt, ${fastaValidation.records.length} record(s)`
                  : (fastaValidation.error ?? 'Paste a sequence to validate')}
              </span>
              {fastaValidation.invalidCharCount > 0 && (
                <span className="text-caution">
                  {fastaValidation.invalidCharCount} non-nucleotide character(s) stripped
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="flex justify-end">
        <Button disabled={!canContinue} onClick={() => navigate('/configure')}>
          Continue to configuration
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
