import type { DsrnaApi } from '../client';
import type {
  CassetteDesign,
  CassetteRequest,
  DiscoverRequest,
  DiscoverResultSet,
  FoldingProfile,
  Job,
  Organism,
  OffTargetReport,
  OffTargetRequest,
  SirnaCandidate,
  TilingOpts,
  Transcript,
} from '../types';
import { getOrganism, searchOrganisms as searchOrganismsImpl } from './organisms';
import { listTranscripts as listTranscriptsImpl } from './transcripts';
import { discoverTargets as discoverTargetsImpl } from './targets';
import { tileSirnas as tileSirnasImpl, getCandidateById } from './sirna';
import { getFold } from './fold';
import { screenOffTargets as screenOffTargetsImpl } from './offtarget';
import { buildCassette as buildCassetteImpl, removeGoldenGateSite as removeGoldenGateSiteImpl } from './cassette';
import { startJob, pollJob, withLatency } from './jobs';

export { getCandidateById };

function requireOrganism(id: string): Organism {
  const organism = getOrganism(id);
  if (!organism) throw new Error(`Unknown organism: ${id}`);
  return organism;
}

export function createMockApi(): DsrnaApi {
  return {
    async searchOrganisms(q: string): Promise<Organism[]> {
      return withLatency(searchOrganismsImpl(q));
    },

    async listTranscripts(organismId: string): Promise<Transcript[]> {
      const organism = requireOrganism(organismId);
      return withLatency(listTranscriptsImpl(organism));
    },

    async discoverTargets(req: DiscoverRequest): Promise<Job<DiscoverResultSet>> {
      const job = startJob<DiscoverResultSet>(
        'discover',
        ['Indexing transcriptome', 'Scanning ORFs', 'Scoring conservation', 'Ranking candidates'],
        () => discoverTargetsImpl(req),
        [2200, 5000],
      );
      return withLatency(job, [60, 160]);
    },

    async tileSirnas(transcriptId: string, opts: TilingOpts): Promise<Job<SirnaCandidate[]>> {
      const job = startJob<SirnaCandidate[]>(
        'tile',
        ['Folding transcript', 'Tiling candidate windows', 'Scoring accessibility', 'Ranking by efficacy'],
        () => tileSirnasImpl(transcriptId, opts),
        [2400, 5200],
      );
      return withLatency(job, [60, 160]);
    },

    async foldTranscript(transcriptId: string): Promise<Job<FoldingProfile>> {
      const job = startJob<FoldingProfile>(
        'fold',
        [
          'Parsing transcript',
          'Predicting secondary structure',
          'Computing partition function',
          'Deriving accessibility profile',
        ],
        () => getFold(transcriptId),
        [2000, 4200],
      );
      return withLatency(job, [60, 160]);
    },

    async screenOffTargets(req: OffTargetRequest): Promise<Job<OffTargetReport>> {
      const job = startJob<OffTargetReport>(
        'offtarget',
        ['Building k-mer index', 'Sweeping species panel', 'Aligning candidate hits', 'Compiling report'],
        () => {
          const candidates = req.candidateIds
            .map((id) => getCandidateById(id))
            .filter((c): c is SirnaCandidate => Boolean(c));
          return screenOffTargetsImpl(req, candidates);
        },
        [2600, 6000],
      );
      return withLatency(job, [60, 160]);
    },

    async buildCassette(req: CassetteRequest): Promise<Job<CassetteDesign>> {
      const job = startJob<CassetteDesign>(
        'cassette',
        ['Selecting backbone', 'Assembling features', 'Scanning Golden Gate sites', 'Finalizing construct'],
        () => {
          const candidates = req.candidateIds
            .map((id) => getCandidateById(id))
            .filter((c): c is SirnaCandidate => Boolean(c));
          return buildCassetteImpl(req, candidates);
        },
        [1800, 3600],
      );
      return withLatency(job, [60, 160]);
    },

    async removeGoldenGateSite(design: CassetteDesign, siteIndex: number): Promise<CassetteDesign> {
      return withLatency(removeGoldenGateSiteImpl(design, siteIndex), [120, 260]);
    },

    async pollJob<T>(jobId: string): Promise<Job<T>> {
      return withLatency(pollJob<T>(jobId), [40, 120]);
    },
  };
}
