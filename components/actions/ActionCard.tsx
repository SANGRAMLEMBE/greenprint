'use client';

import { useFootprintStore } from '@/lib/store/footprint';
import type { CarbonAction } from '@/lib/actions/data';

const DIFFICULTY_STYLES = {
  easy: 'bg-green-50 text-green-700',
  medium: 'bg-amber-50 text-amber-700',
  hard: 'bg-red-50 text-red-700',
};

interface Props {
  action: CarbonAction & { savingKgCO2ePerYear: number };
  committed: boolean;
}

export function ActionCard({ action, committed }: Props) {
  const { commitAction, uncommitAction } = useFootprintStore();
  const savingT = (action.savingKgCO2ePerYear / 1000).toFixed(2);

  return (
    <article
      className={`rounded-2xl border p-5 transition-all duration-200 ${
        committed
          ? 'border-leaf/30 bg-leaf-50 shadow-soft'
          : 'border-gray-100 bg-white hover:border-leaf/20 hover:shadow-soft'
      }`}
      aria-label={`${action.title}. Saves ${savingT} tonnes CO₂e per year.`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl mt-0.5" aria-hidden="true">{action.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className={`text-sm font-semibold ${committed ? 'text-leaf-dark' : 'text-coal'}`}>
                {action.title}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFFICULTY_STYLES[action.difficulty]}`}>
                {action.difficulty}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{action.description}</p>
            <p className="text-xs text-gray-400 mt-1.5">Source: {action.source}</p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-2xl font-black text-leaf leading-none">{savingT}</p>
          <p className="text-xs text-gray-400">t CO₂e/yr</p>
          <p className="text-xs text-gray-400">{action.savingKgCO2ePerYear.toLocaleString()} kg</p>
        </div>
      </div>

      <div className="mt-4">
        {committed ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-leaf flex items-center gap-1.5">
              <span aria-hidden="true">✓</span> Committed
            </span>
            <button
              type="button"
              onClick={() => uncommitAction(action.id)}
              className="text-xs text-gray-400 hover:text-ember underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => commitAction(action.id)}
            className="w-full rounded-lg border border-leaf text-leaf text-sm font-semibold py-2 hover:bg-leaf hover:text-white transition-colors"
          >
            Commit to this action
          </button>
        )}
      </div>
    </article>
  );
}
