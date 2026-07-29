import { create } from 'zustand';
import type {
  CassetteDesign,
  DeliveryChassis,
  FoldingProfile,
  Organism,
  OffTargetReport,
  SirnaCandidate,
  SirnaLength,
  TargetClass,
  TargetGene,
} from '@/lib/api/types';

export const WIZARD_STEPS = [
  { path: '/', label: 'Start', description: 'Landing page — kick off a new design run.' },
  {
    path: '/intake',
    label: 'Target intake',
    description: 'Pick the organism and the class of gene the design should knock down.',
  },
  {
    path: '/configure',
    label: 'Run configuration',
    description: 'Set candidate count, siRNA length, off-target stringency, species panel, and delivery chassis.',
  },
  {
    path: '/discover',
    label: 'Target discovery',
    description: 'Mock compute job scans the transcriptome and ranks candidate genes.',
  },
  {
    path: '/fold',
    label: 'Accessibility & folding',
    description: "Fold the transcript and tile siRNA candidates against where the fold leaves the sequence open.",
  },
  {
    path: '/screen',
    label: 'Off-target screening',
    description: 'Cross-screen surviving candidates against the chosen species safety panel.',
  },
  {
    path: '/cassette',
    label: 'Cassette builder',
    description: 'Assemble survivors into a cloning-ready expression cassette on the chosen backbone.',
  },
  {
    path: '/export',
    label: 'Export',
    description: 'Download GenBank, FASTA, primers, and a PDF report generated from this run.',
  },
] as const;

interface WizardState {
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;

  maxStepReached: number;
  markStepReached: (index: number) => void;

  organism: Organism | null;
  targetClass: TargetClass | null;
  customFasta: string;
  setOrganism: (o: Organism | null) => void;
  setTargetClass: (c: TargetClass | null) => void;
  setCustomFasta: (f: string) => void;

  numCandidates: number;
  sirnaLength: SirnaLength;
  contiguousMatchThreshold: number;
  screenSpeciesIds: string[];
  seedFiltering: boolean;
  accessibilityWeighting: boolean;
  chimericDesign: boolean;
  chassis: DeliveryChassis;
  setNumCandidates: (n: number) => void;
  setSirnaLength: (n: SirnaLength) => void;
  setContiguousMatchThreshold: (n: number) => void;
  toggleScreenSpecies: (id: string) => void;
  setSeedFiltering: (v: boolean) => void;
  setAccessibilityWeighting: (v: boolean) => void;
  setChimericDesign: (v: boolean) => void;
  setChassis: (c: DeliveryChassis) => void;

  discoveredGenes: TargetGene[];
  selectedGeneId: string | null;
  setDiscoveredGenes: (g: TargetGene[]) => void;
  setSelectedGeneId: (id: string | null) => void;

  sirnaCandidates: SirnaCandidate[];
  selectedCandidateId: string | null;
  setSirnaCandidates: (c: SirnaCandidate[]) => void;
  setSelectedCandidateId: (id: string | null) => void;

  foldingProfile: FoldingProfile | null;
  setFoldingProfile: (f: FoldingProfile | null) => void;

  offTargetReport: OffTargetReport | null;
  setOffTargetReport: (r: OffTargetReport | null) => void;

  cassetteDesign: CassetteDesign | null;
  setCassetteDesign: (d: CassetteDesign | null) => void;

  reset: () => void;
}

const initial = {
  organism: null,
  targetClass: null,
  customFasta: '',

  numCandidates: 8,
  sirnaLength: 21 as SirnaLength,
  contiguousMatchThreshold: 19,
  screenSpeciesIds: [] as string[],
  seedFiltering: true,
  accessibilityWeighting: true,
  chimericDesign: false,
  chassis: 'ecoli-ht115' as DeliveryChassis,

  discoveredGenes: [] as TargetGene[],
  selectedGeneId: null,

  sirnaCandidates: [] as SirnaCandidate[],
  selectedCandidateId: null,

  foldingProfile: null,
  offTargetReport: null,
  cassetteDesign: null,
};

export const useWizardStore = create<WizardState>((set) => ({
  reducedMotion: false,
  setReducedMotion: (v) => set({ reducedMotion: v }),

  maxStepReached: 0,
  markStepReached: (index) => set((s) => ({ maxStepReached: Math.max(s.maxStepReached, index) })),

  ...initial,
  setOrganism: (o) => set({ organism: o }),
  setTargetClass: (c) => set({ targetClass: c }),
  setCustomFasta: (f) => set({ customFasta: f }),

  setNumCandidates: (n) => set({ numCandidates: n }),
  setSirnaLength: (n) => set({ sirnaLength: n }),
  setContiguousMatchThreshold: (n) => set({ contiguousMatchThreshold: n }),
  toggleScreenSpecies: (id) =>
    set((s) => ({
      screenSpeciesIds: s.screenSpeciesIds.includes(id)
        ? s.screenSpeciesIds.filter((x) => x !== id)
        : [...s.screenSpeciesIds, id],
    })),
  setSeedFiltering: (v) => set({ seedFiltering: v }),
  setAccessibilityWeighting: (v) => set({ accessibilityWeighting: v }),
  setChimericDesign: (v) => set({ chimericDesign: v }),
  setChassis: (c) => set({ chassis: c }),

  setDiscoveredGenes: (g) => set({ discoveredGenes: g }),
  setSelectedGeneId: (id) => set({ selectedGeneId: id }),

  setSirnaCandidates: (c) => set({ sirnaCandidates: c }),
  setSelectedCandidateId: (id) => set({ selectedCandidateId: id }),

  setFoldingProfile: (f) => set({ foldingProfile: f }),
  setOffTargetReport: (r) => set({ offTargetReport: r }),
  setCassetteDesign: (d) => set({ cassetteDesign: d }),

  reset: () => set({ ...initial, maxStepReached: 0 }),
}));
