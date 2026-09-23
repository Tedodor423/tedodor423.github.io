import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

export function CountUp({
  to,
  duration = 1.4,
  reduceMotion,
  format = (n: number) => Math.round(n).toLocaleString('en-US'),
}: {
  to: number;
  duration?: number;
  reduceMotion?: boolean;
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(reduceMotion ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [to, duration, reduceMotion]);

  return <span ref={ref}>{format(display)}</span>;
}
