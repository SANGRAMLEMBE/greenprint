'use client';

import { CONSUMPTION_FACTORS } from '@/lib/carbon';
import type { ConsumptionLevel } from '@/lib/carbon';
import { formatTonnes } from '@/lib/format';
import type { StepProps } from './types';

const TIERS: {
  value: ConsumptionLevel;
  label: string;
  emoji: string;
  tagline: string;
  examples: string;
}[] = [
  {
    value: 'low',
    label: 'Minimal',
    emoji: '♻️',
    tagline: 'Repair, reuse & second-hand',
    examples: 'Rarely buy new. Fix what you own. Charity shops, swaps, borrowing.',
  },
  {
    value: 'medium',
    label: 'Average',
    emoji: '🛒',
    tagline: 'Typical consumer',
    examples: 'Mix of new and second-hand. Replace things when they wear out.',
  },
  {
    value: 'high',
    label: 'Frequent shopper',
    emoji: '🛍️',
    tagline: 'High discretionary spend',
    examples: 'Regular new purchases. Latest gadgets, frequent wardrobe updates.',
  },
];

export function Step5Consumption({ draft, updateDraft }: StepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-2">
        Covers clothing, electronics, furniture, and other goods — not food or energy.
        Source: EEIO-derived estimate (2023).
      </p>
      {TIERS.map(({ value, label, emoji, tagline, examples }) => {
        const selected = draft.consumption === value;
        const kg = CONSUMPTION_FACTORS[value].value;
        return (
          <label
            key={value}
            className={`block rounded-xl border-2 p-5 cursor-pointer transition-colors ${
              selected ? 'border-leaf bg-leaf/5' : 'border-gray-100 hover:border-gray-200 bg-white'
            }`}
          >
            <input
              type="radio"
              name="consumption"
              value={value}
              checked={selected}
              onChange={() => updateDraft({ consumption: value })}
              className="sr-only"
            />
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{emoji}</span>
                <div>
                  <p className={`font-semibold ${selected ? 'text-leaf-dark' : 'text-coal'}`}>
                    {label}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">{tagline}</p>
                  <p className="text-xs text-gray-400 mt-1">{examples}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-lg font-bold ${selected ? 'text-leaf-dark' : 'text-coal'}`}>
                  {formatTonnes(kg, 1)} t
                </p>
                <p className="text-xs text-gray-400">CO₂e/yr</p>
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
