'use client';

import { GRID_FACTORS, REGION_LABELS, REGION_AVERAGE_TCO2E } from '@/lib/carbon';
import type { RegionCode } from '@/lib/carbon';
import type { StepProps } from './types';

const REGIONS: RegionCode[] = ['GB', 'US', 'EU', 'IN', 'CN', 'AU', 'world'];

export function Step1Region({ draft, updateDraft }: StepProps) {
  return (
    <fieldset>
      <legend className="sr-only">Select your region</legend>
      <div className="grid gap-3">
        {REGIONS.map((code) => {
          const selected = draft.region === code;
          const grid = GRID_FACTORS[code];
          const avg = REGION_AVERAGE_TCO2E[code];
          return (
            <label
              key={code}
              className={`flex items-center justify-between rounded-xl border-2 p-4 cursor-pointer transition-colors ${
                selected
                  ? 'border-leaf bg-leaf/5'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="region"
                  value={code}
                  checked={selected}
                  onChange={() => updateDraft({ region: code })}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selected ? 'border-leaf' : 'border-gray-300'
                  }`}
                >
                  {selected && <div className="w-2 h-2 rounded-full bg-leaf" />}
                </div>
                <span className={`font-medium ${selected ? 'text-leaf-dark' : 'text-coal'}`}>
                  {REGION_LABELS[code]}
                </span>
              </div>
              <div className="text-right text-xs text-gray-500 space-y-0.5">
                <div>Grid: {grid.value * 1000} g CO₂e/kWh</div>
                <div>Avg: {avg} t/yr</div>
              </div>
            </label>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-gray-400">
        Your region determines the electricity grid carbon intensity used in calculations.
      </p>
    </fieldset>
  );
}
