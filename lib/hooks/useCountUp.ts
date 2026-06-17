'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts a number up from 0 to `target` over `duration` ms.
 * Falls back to the final value immediately when the user prefers reduced motion.
 */
export function useCountUp(target: number, duration = 1200, decimals = 2): number {
  const [value, setValue] = useState(0);
  const frame = useRef<number>();

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || target === 0) {
      setValue(target);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo for a satisfying decelerating count
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const factor = 10 ** decimals;
      setValue(Math.round(target * eased * factor) / factor);
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, duration, decimals]);

  return value;
}
