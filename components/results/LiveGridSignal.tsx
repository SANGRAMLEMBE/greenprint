'use client';

import { useEffect, useState } from 'react';
import { fetchGridIntensity } from '@/lib/grid/uk-carbon-intensity';
import type { GridIntensityResult } from '@/lib/grid/uk-carbon-intensity';
import { useFootprintStore } from '@/lib/store/footprint';

const INDEX_COLOURS: Record<string, string> = {
  'very low': 'bg-leaf/10 text-leaf border-leaf/20',
  low: 'bg-green-50 text-green-700 border-green-200',
  moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  'very high': 'bg-ember/10 text-ember border-ember/20',
  unknown: 'bg-gray-50 text-gray-500 border-gray-200',
};

export function LiveGridSignal() {
  const { input } = useFootprintStore();
  const [data, setData] = useState<GridIntensityResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch for GB users
    if (input?.region !== 'GB') return;
    fetchGridIntensity().then((result) => {
      setData(result);
      setLoading(false);
    });
    const id = setInterval(
      () => fetchGridIntensity().then(setData),
      30 * 60 * 1000
    );
    return () => clearInterval(id);
  }, [input?.region]);

  // Only relevant for GB users
  if (input?.region !== 'GB') return null;

  return (
    <section aria-labelledby="grid-heading" className="rounded-2xl border border-gray-100 bg-white p-6">
      <h2 id="grid-heading" className="text-lg font-bold text-coal mb-1">
        ⚡ Live UK grid signal
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Shift heavy electricity use to low-carbon windows to shrink your footprint further.
      </p>

      {loading && (
        <div className="animate-pulse h-16 rounded-xl bg-gray-100" aria-label="Loading grid data" />
      )}

      {!loading && data && (
        <div
          className={`rounded-xl border p-4 ${INDEX_COLOURS[data.index]}`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold capitalize">{data.index} carbon intensity</span>
            {data.available && (
              <span className="text-xs opacity-70">{data.gCO2ePerKwh} g CO₂e/kWh</span>
            )}
          </div>
          <p className="text-sm">{data.message}</p>
          {data.available && (
            <p className="text-xs mt-2 opacity-60">
              Updated {new Date(data.fetchedAt).toLocaleTimeString()} ·{' '}
              <a
                href="https://carbonintensity.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                carbonintensity.org.uk
              </a>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
