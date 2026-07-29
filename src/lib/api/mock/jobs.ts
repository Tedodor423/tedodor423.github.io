import type { Job, JobStatus } from '../types';

interface JobRecord<T> {
  job: Job<T>;
  timer?: ReturnType<typeof setInterval>;
}

const registry = new Map<string, JobRecord<unknown>>();
let counter = 0;

function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

/**
 * Kick off a mock long-running job. Returns the initial `queued` snapshot
 * immediately; the job genuinely ticks queued -> running (progress + stage
 * advancing) -> succeeded/failed over `durationMs`, polled via pollJob.
 * This is deliberately shaped like an AWS Batch job so no component needs to
 * change when real compute lands.
 */
export function startJob<T>(
  prefix: string,
  stages: string[],
  compute: () => T,
  durationMs: [number, number] = [2000, 6000],
): Job<T> {
  const id = nextId(prefix);
  const job: Job<T> = { id, status: 'queued', progress: 0, stage: stages[0] };
  registry.set(id, { job });

  const queueDelay = 150 + Math.random() * 350;
  setTimeout(() => {
    const rec = registry.get(id) as JobRecord<T> | undefined;
    if (!rec) return;

    const total = durationMs[0] + Math.random() * (durationMs[1] - durationMs[0]);
    const tickMs = 110;
    const totalTicks = Math.max(6, Math.round(total / tickMs));
    let tick = 0;

    const timer = setInterval(() => {
      tick += 1;
      const progress = Math.min(1, tick / totalTicks);
      const current = registry.get(id) as JobRecord<T> | undefined;
      if (!current) {
        clearInterval(timer);
        return;
      }

      if (progress >= 1) {
        clearInterval(timer);
        try {
          const result = compute();
          current.job = {
            ...current.job,
            status: 'succeeded' as JobStatus,
            progress: 1,
            stage: 'Complete',
            result,
          };
        } catch (e) {
          current.job = {
            ...current.job,
            status: 'failed' as JobStatus,
            progress: 1,
            error: e instanceof Error ? e.message : String(e),
          };
        }
        return;
      }

      const stageIdx = Math.min(stages.length - 1, Math.floor(progress * stages.length));
      current.job = {
        ...current.job,
        status: 'running' as JobStatus,
        progress,
        stage: stages[stageIdx],
      };
    }, tickMs);

    rec.timer = timer;
  }, queueDelay);

  return job;
}

export function pollJob<T>(jobId: string): Job<T> {
  const rec = registry.get(jobId);
  if (!rec) {
    throw new Error(`Unknown job id: ${jobId}`);
  }
  return rec.job as Job<T>;
}

/** Small artificial latency for non-job calls, so even "instant" lookups
 * feel like they crossed a network. */
export function withLatency<T>(value: T, ms: [number, number] = [180, 420]): Promise<T> {
  const delay = ms[0] + Math.random() * (ms[1] - ms[0]);
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
}
