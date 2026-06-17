'use client';

import { useState } from 'react';
import { calculateFootprint } from '@/lib/carbon';
import { useFootprintStore } from '@/lib/store/footprint';
import type { FootprintInput } from '@/lib/carbon';

interface Scenario {
  id: string;
  label: string;
  emoji: string;
  description: string;
  apply: (input: FootprintInput) => FootprintInput;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'ev',
    label: 'Switch to an EV',
    emoji: '⚡',
    description: 'Replace your car with a battery electric vehicle.',
    apply: (input) => ({
      ...input,
      transport: { ...input.transport, carFuel: 'electric' },
    }),
  },
  {
    id: 'vegetarian',
    label: 'Go vegetarian',
    emoji: '🥦',
    description: 'Eliminate meat and fish from your diet.',
    apply: (input) => ({ ...input, diet: 'vegetarian' }),
  },
  {
    id: 'no-flights',
    label: 'Stop all flying',
    emoji: '✈️',
    description: 'Cut all return flights to zero.',
    apply: (input) => ({
      ...input,
      flights: { shortHaulPerYear: 0, mediumHaulPerYear: 0, longHaulPerYear: 0 },
    }),
  },
];

export function ScenarioSimulator() {
  const { input, result } = useFootprintStore();
  const [active, setActive] = useState<string[]>([]);

  if (!input || !result) return null;

  // TS can't narrow through closures, so bind to local consts first
  const safeInput = input;
  const safeResult = result;

  function isApplicable(scenario: Scenario): boolean {
    if (scenario.id === 'ev') {
      return safeInput.transport.carFuel !== 'electric' && safeInput.transport.carKmPerWeek > 0;
    }
    if (scenario.id === 'vegetarian') {
      return safeInput.diet !== 'vegetarian' && safeInput.diet !== 'vegan';
    }
    if (scenario.id === 'no-flights') {
      const f = safeInput.flights;
      return f.shortHaulPerYear + f.mediumHaulPerYear + f.longHaulPerYear > 0;
    }
    return true;
  }

  function individualSaving(scenario: Scenario): string {
    const mod = scenario.apply(safeInput);
    const r = calculateFootprint(mod);
    const diff = safeResult.totalTCO2ePerYear - r.totalTCO2ePerYear;
    return diff > 0 ? `saves ${diff.toFixed(2)} t` : 'no change';
  }

  const applicable = SCENARIOS.filter(isApplicable);
  if (applicable.length === 0) return null;

  const modifiedInput = active.reduce<FootprintInput>(
    (acc, id) => {
      const s = SCENARIOS.find((sc) => sc.id === id);
      return s ? s.apply(acc) : acc;
    },
    safeInput
  );

  const scenarioResult = active.length > 0 ? calculateFootprint(modifiedInput) : null;
  const saving = scenarioResult
    ? (safeResult.totalTCO2ePerYear - scenarioResult.totalTCO2ePerYear).toFixed(2)
    : null;

  function toggle(id: string) {
    setActive((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <section aria-labelledby="scenario-heading" className="rounded-2xl border border-gray-100 bg-white p-6 mt-6">
      <h2 id="scenario-heading" className="text-lg font-bold text-coal mb-1">
        What if…? Scenario simulator
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Toggle scenarios to see how your footprint changes. All calculations use your exact inputs.
      </p>

      <div className="grid gap-3 mb-4">
        {applicable.map((scenario) => {
          const on = active.includes(scenario.id);
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => toggle(scenario.id)}
              aria-pressed={on}
              className={`flex items-center justify-between rounded-xl border-2 p-4 text-left transition-colors w-full ${
                on ? 'border-leaf bg-leaf/5' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{scenario.emoji}</span>
                <div>
                  <p className={`font-semibold text-sm ${on ? 'text-leaf-dark' : 'text-coal'}`}>
                    {scenario.label}
                  </p>
                  <p className="text-xs text-gray-500">{scenario.description}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-400 shrink-0 ml-4">
                {individualSaving(scenario)}
              </span>
            </button>
          );
        })}
      </div>

      {active.length > 0 && scenarioResult && (
        <div
          className="rounded-xl bg-leaf/10 border border-leaf/20 p-4"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm text-gray-600">Combined scenario footprint</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-3xl font-black text-leaf">
              {scenarioResult.totalTCO2ePerYear}
            </span>
            <span className="text-sm text-gray-500 mb-1">t CO₂e/yr</span>
            <span className="text-sm font-semibold text-leaf mb-1 ml-2">
              (saves {saving} t vs now)
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
