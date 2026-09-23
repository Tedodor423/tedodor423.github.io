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
} from './types';
import { createMockApi } from './mock';

export interface DsrnaApi {
  searchOrganisms(q: string): Promise<Organism[]>;
  listTranscripts(organismId: string): Promise<Transcript[]>;
  discoverTargets(req: DiscoverRequest): Promise<Job<DiscoverResultSet>>;
  tileSirnas(transcriptId: string, opts: TilingOpts): Promise<Job<SirnaCandidate[]>>;
  foldTranscript(transcriptId: string): Promise<Job<FoldingProfile>>;
  screenOffTargets(req: OffTargetRequest): Promise<Job<OffTargetReport>>;
  buildCassette(req: CassetteRequest): Promise<Job<CassetteDesign>>;
  /** Break one detected Golden Gate site by a single silent substitution.
   * Synchronous-feeling by design — a real backend would still round-trip
   * this, but it never needs the queued/running job shape the others do. */
  removeGoldenGateSite(design: CassetteDesign, siteIndex: number): Promise<CassetteDesign>;
  /** Poll an in-flight job by id. Every long-running call above returns a job
   * already ticking; components poll this to observe queued -> running -> succeeded. */
  pollJob<T>(jobId: string): Promise<Job<T>>;
}

class NotImplemented extends Error {
  constructor(method: string) {
    super(
      `HttpApi.${method} is not implemented — this build ships mock-only. ` +
        `Set VITE_API_MODE=mock (the default) or wire a real backend before switching modes.`,
    );
    this.name = 'NotImplemented';
  }
}

/** Stub for the real backend. Correct signatures, no behaviour — wiring this
 * up is the entire job of "connect to live compute" and should require zero
 * changes to any component. */
export class HttpApi implements DsrnaApi {
  searchOrganisms(): Promise<Organism[]> {
    throw new NotImplemented('searchOrganisms');
  }
  listTranscripts(): Promise<Transcript[]> {
    throw new NotImplemented('listTranscripts');
  }
  discoverTargets(): Promise<Job<DiscoverResultSet>> {
    throw new NotImplemented('discoverTargets');
  }
  tileSirnas(): Promise<Job<SirnaCandidate[]>> {
    throw new NotImplemented('tileSirnas');
  }
  foldTranscript(): Promise<Job<FoldingProfile>> {
    throw new NotImplemented('foldTranscript');
  }
  screenOffTargets(): Promise<Job<OffTargetReport>> {
    throw new NotImplemented('screenOffTargets');
  }
  buildCassette(): Promise<Job<CassetteDesign>> {
    throw new NotImplemented('buildCassette');
  }
  removeGoldenGateSite(): Promise<CassetteDesign> {
    throw new NotImplemented('removeGoldenGateSite');
  }
  pollJob<T>(): Promise<Job<T>> {
    throw new NotImplemented('pollJob');
  }
}

let cached: DsrnaApi | null = null;

export function getApi(): DsrnaApi {
  if (cached) return cached;
  const mode = import.meta.env.VITE_API_MODE ?? 'mock';
  cached = mode === 'http' ? new HttpApi() : createMockApi();
  return cached;
}
