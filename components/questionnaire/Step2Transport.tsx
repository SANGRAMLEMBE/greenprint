'use client';

import { CAR_FACTORS, TRANSIT_FACTORS } from '@/lib/carbon';
import { transportKg } from '@/lib/carbon';
import type { CarFuel, TransitMode } from '@/lib/carbon';
import { formatTonnes } from '@/lib/format';
import type { StepProps } from './types';

const CAR_FUELS: { value: CarFuel; label: string; emoji: string }[] = [
  { value: 'petrol', label: 'Petrol', emoji: '⛽' },
  { value: 'diesel', label: 'Diesel', emoji: '🔩' },
  { value: 'hybrid', label: 'Hybrid', emoji: '🔋' },
  { value: 'electric', label: 'Electric', emoji: '⚡' },
];

const TRANSIT_MODES: { value: TransitMode; label: string; emoji: string }[] = [
  { value: 'bus', label: 'Bus', emoji: '🚌' },
  { value: 'train', label: 'Train', emoji: '🚆' },
  { value: 'metro', label: 'Metro', emoji: '🚇' },
];

export function Step2Transport({ draft, updateDraft }: StepProps) {
  const kg = transportKg({
    carKmPerWeek: draft.carKmPerWeek,
    carFuel: draft.carFuel,
    transitKmPerWeek: draft.transitKmPerWeek,
    transitMode: draft.transitMode,
  });
  const tonnes = formatTonnes(kg);

  return (
    <div className="space-y-8">
      {/* Live estimate */}
      <div className="rounded-xl bg-gray-50 px-5 py-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">Transport estimate</span>
        <span className="text-xl font-bold text-coal">
          {tonnes} <span className="text-sm font-normal text-gray-500">t CO₂e/yr</span>
        </span>
      </div>

      {/* Car */}
      <fieldset>
        <legend className="text-base font-semibold text-coal mb-4">🚗 Private car</legend>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="car-km" className="text-sm text-gray-700">
                Kilometres driven per week
              </label>
              <span className="text-sm font-medium text-coal">{draft.carKmPerWeek} km</span>
            </div>
            <input
              id="car-km"
              type="range"
              min={0}
              max={500}
              step={10}
              value={draft.carKmPerWeek}
              onChange={(e) => updateDraft({ carKmPerWeek: Number(e.target.value) })}
              className="w-full accent-leaf"
              aria-label="Weekly car kilometres"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span><span>250</span><span>500 km</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-700 mb-2">Fuel type</p>
            <div className="grid grid-cols-2 gap-2">
              {CAR_FUELS.map(({ value, label, emoji }) => {
                const factor = CAR_FACTORS[value];
                const selected = draft.carFuel === value;
                return (
                  <label
                    key={value}
                    className={`flex items-center gap-2 rounded-lg border-2 p-3 cursor-pointer transition-colors ${
                      selected ? 'border-leaf bg-leaf/5' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="carFuel"
                      value={value}
                      checked={selected}
                      onChange={() => updateDraft({ carFuel: value })}
                      className="sr-only"
                    />
                    <span>{emoji}</span>
                    <div>
                      <div className={`text-sm font-medium ${selected ? 'text-leaf-dark' : 'text-coal'}`}>
                        {label}
                      </div>
                      <div className="text-xs text-gray-400">{factor.value * 1000} g/km</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </fieldset>

      {/* Public transit */}
      <fieldset>
        <legend className="text-base font-semibold text-coal mb-4">🚌 Public transit</legend>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="transit-km" className="text-sm text-gray-700">
                Kilometres per week by transit
              </label>
              <span className="text-sm font-medium text-coal">{draft.transitKmPerWeek} km</span>
            </div>
            <input
              id="transit-km"
              type="range"
              min={0}
              max={200}
              step={5}
              value={draft.transitKmPerWeek}
              onChange={(e) => updateDraft({ transitKmPerWeek: Number(e.target.value) })}
              className="w-full accent-leaf"
              aria-label="Weekly transit kilometres"
            />
          </div>

          <div>
            <p className="text-sm text-gray-700 mb-2">Primary mode</p>
            <div className="grid grid-cols-3 gap-2">
              {TRANSIT_MODES.map(({ value, label, emoji }) => {
                const factor = TRANSIT_FACTORS[value];
                const selected = draft.transitMode === value;
                return (
                  <label
                    key={value}
                    className={`flex flex-col items-center rounded-lg border-2 p-3 cursor-pointer transition-colors text-center ${
                      selected ? 'border-leaf bg-leaf/5' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="transitMode"
                      value={value}
                      checked={selected}
                      onChange={() => updateDraft({ transitMode: value })}
                      className="sr-only"
                    />
                    <span className="text-2xl">{emoji}</span>
                    <span className={`text-sm font-medium mt-1 ${selected ? 'text-leaf-dark' : 'text-coal'}`}>
                      {label}
                    </span>
                    <span className="text-xs text-gray-400">{factor.value * 1000} g/km</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
