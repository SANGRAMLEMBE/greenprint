'use client';

import { DIET_FACTORS, FLIGHT_FACTORS, dietKg, flightsKg } from '@/lib/carbon';
import type { DietPattern } from '@/lib/carbon';
import type { StepProps } from './types';

const DIETS: { value: DietPattern; label: string; emoji: string; note: string }[] = [
  { value: 'heavy_meat', label: 'Heavy meat', emoji: '🥩', note: '>100 g/day' },
  { value: 'medium_meat', label: 'Medium meat', emoji: '🍗', note: '50–100 g/day' },
  { value: 'low_meat', label: 'Low meat', emoji: '🥗', note: '<50 g/day' },
  { value: 'pescatarian', label: 'Pescatarian', emoji: '🐟', note: 'Fish, no meat' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥦', note: 'No meat/fish' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱', note: 'No animal products' },
];

type FlightType = 'shortHaulPerYear' | 'mediumHaulPerYear' | 'longHaulPerYear';

const FLIGHTS: { key: FlightType; label: string; range: string; kgPerFlight: number }[] = [
  { key: 'shortHaulPerYear', label: 'Short-haul', range: '< 1,500 km', kgPerFlight: FLIGHT_FACTORS.shortHaul.value },
  { key: 'mediumHaulPerYear', label: 'Medium-haul', range: '1,500–4,000 km', kgPerFlight: FLIGHT_FACTORS.mediumHaul.value },
  { key: 'longHaulPerYear', label: 'Long-haul', range: '> 4,000 km', kgPerFlight: FLIGHT_FACTORS.longHaul.value },
];

export function Step4DietFlights({ draft, updateDraft }: StepProps) {
  const dietKgVal = dietKg(draft.diet);
  const flightKgVal = flightsKg({
    shortHaulPerYear: draft.shortHaulPerYear,
    mediumHaulPerYear: draft.mediumHaulPerYear,
    longHaulPerYear: draft.longHaulPerYear,
  });
  const total = ((dietKgVal + flightKgVal) / 1000).toFixed(2);

  return (
    <div className="space-y-8">
      {/* Live estimate */}
      <div className="rounded-xl bg-gray-50 px-5 py-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">Diet + flights estimate</span>
        <span className="text-xl font-bold text-coal">
          {total} <span className="text-sm font-normal text-gray-500">t CO₂e/yr</span>
        </span>
      </div>

      {/* Diet */}
      <fieldset>
        <legend className="text-base font-semibold text-coal mb-3">🍽️ Dietary pattern</legend>
        <div className="grid grid-cols-2 gap-2">
          {DIETS.map(({ value, label, emoji, note }) => {
            const selected = draft.diet === value;
            const kg = DIET_FACTORS[value].value;
            return (
              <label
                key={value}
                className={`flex items-start gap-2 rounded-xl border-2 p-3 cursor-pointer transition-colors ${
                  selected ? 'border-leaf bg-leaf/5' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="diet"
                  value={value}
                  checked={selected}
                  onChange={() => updateDraft({ diet: value })}
                  className="sr-only"
                />
                <span className="text-xl mt-0.5">{emoji}</span>
                <div>
                  <div className={`text-sm font-semibold ${selected ? 'text-leaf-dark' : 'text-coal'}`}>
                    {label}
                  </div>
                  <div className="text-xs text-gray-500">{note}</div>
                  <div className="text-xs font-medium text-gray-400 mt-0.5">
                    {(kg / 1000).toFixed(1)} t CO₂e/yr
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Flights */}
      <fieldset>
        <legend className="text-base font-semibold text-coal mb-3">✈️ Return flights per year</legend>
        <p className="text-xs text-gray-500 mb-3">
          Includes radiative forcing uplift. Values are return (round-trip) flights.
        </p>
        <div className="space-y-3">
          {FLIGHTS.map(({ key, label, range, kgPerFlight }) => {
            const count = draft[key];
            return (
              <div key={key} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div>
                  <p className="text-sm font-medium text-coal">{label}</p>
                  <p className="text-xs text-gray-500">{range} · {(kgPerFlight / 1000).toFixed(1)} t CO₂e each</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateDraft({ [key]: Math.max(0, count - 1) })}
                    aria-label={`Decrease ${label} flights`}
                    className="w-8 h-8 rounded-full border border-gray-200 text-coal font-bold hover:bg-gray-50 flex items-center justify-center"
                  >
                    −
                  </button>
                  <span
                    className="w-5 text-center font-bold text-coal"
                    aria-live="polite"
                    aria-label={`${count} ${label} flights`}
                  >
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateDraft({ [key]: count + 1 })}
                    aria-label={`Increase ${label} flights`}
                    className="w-8 h-8 rounded-full border border-gray-200 text-coal font-bold hover:bg-gray-50 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
