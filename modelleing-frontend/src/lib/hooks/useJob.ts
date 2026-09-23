import { useCallback, useEffect, useRef, useState } from 'react';
import { getApi } from '@/lib/api/client';
import type { Job } from '@/lib/api/types';

/**
 * Kicks off a job via `start`, then polls it until it settles. Re-runs
 * whenever `trigger` changes. This is the one place a component talks to the
 * job-polling seam — mirrors how a real AWS Batch-backed job would be
 * observed, so nothing here changes when VITE_API_MODE flips to 'http'.
 */
export function useJob<T>(
  start: (() => Promise<Job<T>>) | null,
  trigger: unknown[],
): { job: Job<T> | null; restart: () => void } {
  const [job, setJob] = useState<Job<T> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runId = useRef(0);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const run = useCallback(() => {
    if (!start) {
      setJob(null);
      return;
    }
    const thisRun = ++runId.current;
    stopPolling();
    setJob(null);

    start().then((initial) => {
      if (thisRun !== runId.current) return;
      setJob(initial);
      if (initial.status === 'succeeded' || initial.status === 'failed') return;

      const api = getApi();
      pollRef.current = setInterval(async () => {
        if (thisRun !== runId.current) return;
        const next = await api.pollJob<T>(initial.id);
        if (thisRun !== runId.current) return;
        setJob(next);
        if (next.status === 'succeeded' || next.status === 'failed') {
          stopPolling();
        }
      }, 140);
    });
  }, [start, stopPolling]);

  useEffect(() => {
    run();
    return stopPolling;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, trigger);

  return { job, restart: run };
}
