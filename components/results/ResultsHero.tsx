'use client';

import { useFootprintStore } from '@/lib/store/footprint';
import { PARIS_TARGET_TCO2E } from '@/lib/data/countries';

function getColour(tco2e: number) {
  if (tco2e <= 2) return { text: 'text-leaf', bg: 'bg-leaf/10', label: 'Below Paris target ✓' };
  if (tco2e <= 6) return { text: 'text-amber-600', bg: 'bg-amber-50', label: 'Above Paris target' };
  return { text: 'text-ember', bg: 'bg-ember/10', label: 'Significantly above target' };
}

export function ResultsHero() {
  const { result, comparison, setStep, saveToHistory } = useFootprintStore();
  if (!result || !comparison) return null;

  const { text, bg, label } = getColour(result.totalTCO2ePerYear);
  const parisGapT = Math.max(0, result.totalTCO2ePerYear - PARIS_TARGET_TCO2E);

  return (
    <section aria-labelledby="results-heading" className={`rounded-2xl ${bg} p-8`}>
      <p className="text-sm font-medium text-gray-500 mb-1">Your annual carbon footprint</p>
      <div className="flex items-end gap-3 mb-2">
        <h2
          id="results-heading"
          className={`text-6xl font-black ${text}`}
          aria-label={`${result.totalTCO2ePerYear} tonnes CO₂e per year`}
        >
          {result.totalTCO2ePerYear}
        </h2>
        <span className="text-xl font-medium text-gray-500 mb-2">t CO₂e/yr</span>
      </div>

      <p className={`text-sm font-semibold ${text} mb-4`}>{label}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-white/70 p-4">
          <p className="text-xs text-gray-500 mb-1">vs Paris target (2 t)</p>
          <p className={`text-2xl font-bold ${text}`}>{comparison.vsParis}×</p>
          {parisGapT > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Cut <strong>{parisGapT.toFixed(1)} t</strong> to reach the target
            </p>
          )}
        </div>
        <div className="rounded-xl bg-white/70 p-4">
          <p className="text-xs text-gray-500 mb-1">vs your region average</p>
          <p className={`text-2xl font-bold ${comparison.vsRegion > 1 ? 'text-ember' : 'text-leaf'}`}>
            {comparison.vsRegion}×
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Regional avg: {comparison.regionAverageTCO2e} t/yr
          </p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => {
            saveToHistory(0);
            setStep('actions');
          }}
          className="px-5 py-2.5 rounded-lg bg-leaf text-white text-sm font-semibold hover:bg-leaf-dark transition-colors shadow-sm"
        >
          See my action plan →
        </button>
        <button
          type="button"
          onClick={() => setStep('questionnaire')}
          className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-coal hover:bg-white/70 transition-colors"
        >
          Recalculate
        </button>
      </div>
    </section>
  );
}
