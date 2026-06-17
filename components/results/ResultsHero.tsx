'use client';

import { useFootprintStore } from '@/lib/store/footprint';
import { PARIS_TARGET_TCO2E } from '@/lib/data/countries';
import { getCarbonGrade } from '@/lib/carbon/grade';
import { useCountUp } from '@/lib/hooks/useCountUp';

function getColour(tco2e: number) {
  if (tco2e <= 2) return { text: 'text-leaf', ring: 'ring-leaf/20', label: 'Below the Paris target ✓' };
  if (tco2e <= 6) return { text: 'text-amber-600', ring: 'ring-amber-200', label: 'Above the Paris target' };
  return { text: 'text-ember', ring: 'ring-ember/20', label: 'Significantly above target' };
}

export function ResultsHero() {
  const { result, comparison, setStep, saveToHistory } = useFootprintStore();
  const animated = useCountUp(result?.totalTCO2ePerYear ?? 0, 1400, 2);

  if (!result || !comparison) return null;

  const { text, ring, label } = getColour(result.totalTCO2ePerYear);
  const grade = getCarbonGrade(result.totalTCO2ePerYear);
  const parisGapT = Math.max(0, result.totalTCO2ePerYear - PARIS_TARGET_TCO2E);

  return (
    <section
      aria-labelledby="results-heading"
      className="relative overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-gray-100 p-8 animate-scale-in"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <p className="text-sm font-medium text-coal-light mb-1">Your annual carbon footprint</p>
          <div className="flex items-end gap-3 mb-1">
            <h2
              id="results-heading"
              className={`text-6xl sm:text-7xl font-black tabular-nums ${text}`}
              aria-label={`${result.totalTCO2ePerYear} tonnes CO₂e per year`}
            >
              {animated.toFixed(2)}
            </h2>
            <span className="text-lg font-medium text-coal-light mb-2">t CO₂e/yr</span>
          </div>
          <p className={`text-sm font-semibold ${text}`}>{label}</p>
        </div>

        {/* Carbon grade badge — instant A–F read */}
        <div
          className={`shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-2xl ${grade.bg} ring-1 ${ring}`}
          aria-label={`Carbon grade ${grade.letter}: ${grade.label}`}
        >
          <span className={`text-5xl font-black leading-none ${grade.color}`}>{grade.letter}</span>
          <span className={`mt-1 text-[10px] font-semibold uppercase tracking-wide ${grade.color}`}>
            grade
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
        <div className="rounded-2xl bg-sand p-4">
          <p className="text-xs text-coal-light mb-1">vs Paris target (2 t)</p>
          <p className={`text-2xl font-bold tabular-nums ${text}`}>{comparison.vsParis}×</p>
          {parisGapT > 0 && (
            <p className="text-xs text-coal-light mt-1">
              Cut <strong>{parisGapT.toFixed(1)} t</strong> to get there
            </p>
          )}
        </div>
        <div className="rounded-2xl bg-sand p-4">
          <p className="text-xs text-coal-light mb-1">vs your region average</p>
          <p className={`text-2xl font-bold tabular-nums ${comparison.vsRegion > 1 ? 'text-ember' : 'text-leaf'}`}>
            {comparison.vsRegion}×
          </p>
          <p className="text-xs text-coal-light mt-1">
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
          className="px-6 py-3 rounded-xl bg-leaf text-white text-sm font-semibold hover:bg-leaf-dark transition-colors shadow-soft hover:shadow-glow"
        >
          See my action plan →
        </button>
        <button
          type="button"
          onClick={() => setStep('questionnaire')}
          className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-coal hover:bg-sand transition-colors"
        >
          Recalculate
        </button>
      </div>
    </section>
  );
}
