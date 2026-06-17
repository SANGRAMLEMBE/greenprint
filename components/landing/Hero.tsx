'use client';

import { useEffect, useState } from 'react';

// World CO2 emissions are ~37 billion tonnes/year → ~1,173 tonnes per second.
const TONNES_PER_SECOND = 37_000_000_000 / (365.25 * 24 * 60 * 60);

/** A live-ticking counter of global CO2 emitted since the page loaded. */
function GlobalCounter() {
  const [tonnes, setTonnes] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const seconds = (now - start) / 1000;
      setTonnes(seconds * TONNES_PER_SECOND);
      if (!reduce) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span className="tabular-nums font-bold text-coal">
      {Math.floor(tonnes).toLocaleString()}
    </span>
  );
}

export function Hero() {
  return (
    <header className="text-center pt-6 pb-10 animate-fade-in">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-50 px-3 py-1 text-xs font-semibold text-leaf-700 ring-1 ring-leaf-100">
        🌍 Science-backed · Private by design
      </span>

      <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight text-coal leading-[1.1]">
        Know your carbon footprint.
        <br />
        <span className="bg-gradient-to-r from-leaf to-leaf-light bg-clip-text text-transparent">
          Then actually cut it.
        </span>
      </h1>

      <p className="mt-4 text-base text-coal-light max-w-lg mx-auto">
        Five quick questions turn into an honest, source-cited breakdown of your annual CO₂
        and a ranked action plan — with the real kilograms each change saves.
      </p>

      <p className="mt-6 text-sm text-coal-light" aria-live="off">
        <span aria-hidden="true">⏱️</span> Humanity has emitted{' '}
        <GlobalCounter /> tonnes of CO₂ since you opened this page.
      </p>
    </header>
  );
}
