'use client';

import { useFootprintStore } from '@/lib/store/footprint';
import { committedSavingsKg } from '@/lib/actions/data';
import { PARIS_TARGET_TCO2E } from '@/lib/data/countries';
import { formatTonnes } from '@/lib/format';

export function ActionPlanHeader() {
  const { result, input, committedActionIds } = useFootprintStore();
  if (!result || !input) return null;

  // Three numbers tell the whole story: where you are now, what you've pledged
  // to save, and where that lands you. "Projected" is current minus pledged.
  const savedKg = committedSavingsKg(input, committedActionIds);
  const savedT = formatTonnes(savedKg);
  const projectedT = Math.max(0, result.totalTCO2ePerYear - savedKg / 1000);
  const parisGapT = Math.max(0, result.totalTCO2ePerYear - PARIS_TARGET_TCO2E);

  return (
    <section aria-labelledby="plan-heading" className="rounded-2xl bg-coal text-white p-6 mb-6">
      <h2 id="plan-heading" className="text-xl font-bold mb-1">
        Your personalised action plan
      </h2>
      <p className="text-sm text-gray-300 mb-4">
        Actions ranked by impact — the biggest savings first. All figures are based on your
        actual inputs, not averages.
      </p>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white/10 p-3">
          <p className="text-xs text-gray-400">Current</p>
          <p className="text-2xl font-bold">{result.totalTCO2ePerYear}</p>
          <p className="text-xs text-gray-400">t CO₂e/yr</p>
        </div>
        <div className="rounded-xl bg-white/10 p-3">
          <p className="text-xs text-gray-400">Committed savings</p>
          <p className="text-2xl font-bold text-leaf">{savedT}</p>
          <p className="text-xs text-gray-400">t CO₂e/yr</p>
        </div>
        <div className="rounded-xl bg-white/10 p-3">
          <p className="text-xs text-gray-400">Projected</p>
          <p className={`text-2xl font-bold ${projectedT <= 2 ? 'text-leaf' : 'text-amber-400'}`}>
            {projectedT.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">t CO₂e/yr</p>
        </div>
      </div>

      {parisGapT > 0 && savedKg === 0 && (
        <p className="mt-4 text-sm text-amber-300">
          You need to cut <strong>{parisGapT.toFixed(1)} t</strong> to reach the Paris target. Start by committing to the top actions below.
        </p>
      )}
      {projectedT <= PARIS_TARGET_TCO2E && savedKg > 0 && (
        <p className="mt-4 text-sm text-leaf font-semibold">
          🎉 Your committed actions put you at or below the Paris target!
        </p>
      )}
    </section>
  );
}
