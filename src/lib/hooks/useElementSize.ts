import { useCallback, useEffect, useState } from 'react';

/** Callback ref, not useRef — the target element in our case often mounts
 * conditionally (after a job resolves), and a useRef + effect-with-[]-deps
 * pattern would set up the observer against a still-null ref and never fire
 * again once the element actually appears. */
export function useElementSize<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const ref = useCallback((el: T | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.contentRect;
      setSize({ width: box.width, height: box.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return { ref, size };
}
