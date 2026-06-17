'use client';

import { useState, useRef, useEffect } from 'react';
import { useFootprintStore } from '@/lib/store/footprint';
import { footprintInputSchema } from '@/lib/carbon';
import { Step1Region } from './Step1Region';
import { Step2Transport } from './Step2Transport';
import { Step3Home } from './Step3Home';
import { Step4DietFlights } from './Step4DietFlights';
import { Step5Consumption } from './Step5Consumption';
import { DEFAULT_DRAFT } from './types';
import type { DraftInput } from './types';

const STEP_TITLES = [
  'Where do you live?',
  'How do you get around?',
  'Your home energy',
  'Diet & flights',
  'Shopping & goods',
];
const STEP_LABELS = ['Region', 'Transport', 'Home', 'Diet & Flights', 'Shopping'];
const TOTAL = 5;

export function QuestionnaireShell() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<DraftInput>(DEFAULT_DRAFT);
  const { setInput, setStep: setAppStep } = useFootprintStore();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  function updateDraft(patch: Partial<DraftInput>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function handleNext() {
    if (step < TOTAL) {
      setStep((s) => s + 1);
      return;
    }
    const validated = footprintInputSchema.parse({
      region: draft.region,
      transport: {
        carKmPerWeek: draft.carKmPerWeek,
        carFuel: draft.carFuel,
        transitKmPerWeek: draft.transitKmPerWeek,
        transitMode: draft.transitMode,
      },
      home: {
        electricityKwhPerYear: draft.electricityKwhPerYear,
        gasKwhPerYear: draft.gasKwhPerYear,
        householdSize: draft.householdSize,
      },
      diet: draft.diet,
      flights: {
        shortHaulPerYear: draft.shortHaulPerYear,
        mediumHaulPerYear: draft.mediumHaulPerYear,
        longHaulPerYear: draft.longHaulPerYear,
      },
      consumption: draft.consumption,
    });
    setInput(validated);
    setAppStep('results');
  }

  const pct = Math.round((step / TOTAL) * 100);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <div className="mb-2 flex justify-between text-xs text-gray-500" aria-hidden="true">
        <span>{STEP_LABELS[step - 1]}</span>
        <span>{step}/{TOTAL}</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={TOTAL}
        aria-label={`Step ${step} of ${TOTAL}`}
        className="mb-8 h-1.5 rounded-full bg-gray-100 overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-leaf transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-coal mb-6 outline-none"
      >
        {STEP_TITLES[step - 1]}
      </h1>

      <div key={step} className="animate-fade-in">
        {step === 1 && <Step1Region draft={draft} updateDraft={updateDraft} />}
        {step === 2 && <Step2Transport draft={draft} updateDraft={updateDraft} />}
        {step === 3 && <Step3Home draft={draft} updateDraft={updateDraft} />}
        {step === 4 && <Step4DietFlights draft={draft} updateDraft={updateDraft} />}
        {step === 5 && <Step5Consumption draft={draft} updateDraft={updateDraft} />}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 1}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-coal border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-leaf text-white hover:bg-leaf-dark transition-colors shadow-sm"
        >
          {step === TOTAL ? 'See my footprint →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
