'use client';

import { homeKg } from '@/lib/carbon';
import { formatTonnes } from '@/lib/format';
import type { StepProps } from './types';

export function Step3Home({ draft, updateDraft }: StepProps) {
  const kg = homeKg(
    {
      electricityKwhPerYear: draft.electricityKwhPerYear,
      gasKwhPerYear: draft.gasKwhPerYear,
      householdSize: draft.householdSize,
    },
    draft.region
  );
  const tonnes = formatTonnes(kg);

  return (
    <div className="space-y-8">
      {/* Live estimate */}
      <div className="rounded-xl bg-gray-50 px-5 py-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">Home energy estimate (your share)</span>
        <span className="text-xl font-bold text-coal">
          {tonnes} <span className="text-sm font-normal text-gray-500">t CO₂e/yr</span>
        </span>
      </div>

      <fieldset className="space-y-6">
        <legend className="sr-only">Home energy usage</legend>

        {/* Electricity */}
        <div>
          <label htmlFor="electricity" className="block text-sm font-semibold text-coal mb-1">
            ⚡ Electricity usage
          </label>
          <p className="text-xs text-gray-500 mb-2">UK average: 2,900 kWh/yr · US average: 10,500 kWh/yr</p>
          <div className="flex items-center gap-3">
            <input
              id="electricity"
              type="number"
              min={0}
              max={100000}
              step={100}
              value={draft.electricityKwhPerYear}
              onChange={(e) =>
                updateDraft({ electricityKwhPerYear: Math.max(0, Number(e.target.value)) })
              }
              className="w-36 rounded-lg border border-gray-200 px-3 py-2 text-sm text-coal focus:outline-none focus:border-leaf"
              aria-label="Annual electricity usage in kWh"
            />
            <span className="text-sm text-gray-500">kWh/year</span>
          </div>
        </div>

        {/* Gas */}
        <div>
          <label htmlFor="gas" className="block text-sm font-semibold text-coal mb-1">
            🔥 Natural gas usage
          </label>
          <p className="text-xs text-gray-500 mb-2">UK average: 12,000 kWh/yr · Enter 0 if you don&apos;t use gas</p>
          <div className="flex items-center gap-3">
            <input
              id="gas"
              type="number"
              min={0}
              max={100000}
              step={100}
              value={draft.gasKwhPerYear}
              onChange={(e) =>
                updateDraft({ gasKwhPerYear: Math.max(0, Number(e.target.value)) })
              }
              className="w-36 rounded-lg border border-gray-200 px-3 py-2 text-sm text-coal focus:outline-none focus:border-leaf"
              aria-label="Annual gas usage in kWh"
            />
            <span className="text-sm text-gray-500">kWh/year</span>
          </div>
        </div>

        {/* Household size */}
        <div>
          <p className="text-sm font-semibold text-coal mb-1">🏠 Household size</p>
          <p className="text-xs text-gray-500 mb-3">
            Energy emissions are split equally. Your share = total ÷ {draft.householdSize}.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => updateDraft({ householdSize: Math.max(1, draft.householdSize - 1) })}
              aria-label="Decrease household size"
              className="w-9 h-9 rounded-full border border-gray-200 text-coal text-lg font-bold hover:bg-gray-50 flex items-center justify-center"
            >
              −
            </button>
            <span
              className="w-8 text-center text-xl font-bold text-coal"
              aria-live="polite"
              aria-label={`${draft.householdSize} people`}
            >
              {draft.householdSize}
            </span>
            <button
              type="button"
              onClick={() => updateDraft({ householdSize: Math.min(20, draft.householdSize + 1) })}
              aria-label="Increase household size"
              className="w-9 h-9 rounded-full border border-gray-200 text-coal text-lg font-bold hover:bg-gray-50 flex items-center justify-center"
            >
              +
            </button>
            <span className="text-sm text-gray-500">people</span>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
