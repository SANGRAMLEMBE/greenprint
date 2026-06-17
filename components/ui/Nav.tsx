'use client';

import { useFootprintStore } from '@/lib/store/footprint';
import type { AppStep } from '@/lib/store/footprint';

const TABS: { id: AppStep; label: string; emoji: string }[] = [
  { id: 'questionnaire', label: 'Calculate', emoji: '🧮' },
  { id: 'results', label: 'Results', emoji: '📊' },
  { id: 'actions', label: 'Actions', emoji: '🎯' },
  { id: 'tracking', label: 'Progress', emoji: '📈' },
];

export function Nav() {
  const { step, setStep, result } = useFootprintStore();
  const hasResult = result !== null;

  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button
            type="button"
            onClick={() => setStep('questionnaire')}
            className="font-bold text-leaf-dark text-base tracking-tight"
          >
            🌍 Carbon Companion
          </button>

          {/* Tabs */}
          <div className="flex" role="tablist" aria-label="App sections">
            {TABS.map(({ id, label, emoji }) => {
              const disabled = id !== 'questionnaire' && !hasResult;
              const active = step === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-disabled={disabled}
                  disabled={disabled}
                  onClick={() => setStep(id)}
                  className={`flex items-center gap-1 px-3 py-4 text-xs font-medium border-b-2 transition-colors ${
                    active
                      ? 'border-leaf text-leaf-dark'
                      : disabled
                      ? 'border-transparent text-gray-300 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-coal hover:border-gray-200'
                  }`}
                >
                  <span aria-hidden="true">{emoji}</span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
