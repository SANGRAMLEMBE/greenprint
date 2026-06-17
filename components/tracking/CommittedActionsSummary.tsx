'use client';

import { useFootprintStore } from '@/lib/store/footprint';
import { ALL_ACTIONS, committedSavingsKg } from '@/lib/actions/data';

export function CommittedActionsSummary() {
  const { committedActionIds, input, result, uncommitAction } = useFootprintStore();

  if (!input || !result) return null;

  const committed = ALL_ACTIONS.filter((a) => committedActionIds.includes(a.id));
  const totalSavedKg = committedSavingsKg(input, committedActionIds);
  const totalSavedT = (totalSavedKg / 1000).toFixed(2);
  const projectedT = Math.max(0, result.totalTCO2ePerYear - totalSavedKg / 1000);

  return (
    <section aria-labelledby="committed-heading" className="rounded-2xl border border-gray-100 bg-white p-6 mt-6">
      <h2 id="committed-heading" className="text-lg font-bold text-coal mb-1">
        Your committed actions
      </h2>

      {committed.length === 0 ? (
        <p className="text-sm text-gray-500">
          No actions committed yet. Head to the action plan to get started.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-leaf/10 p-3">
              <p className="text-xs text-gray-500">Total committed savings</p>
              <p className="text-2xl font-bold text-leaf">{totalSavedT} t</p>
              <p className="text-xs text-gray-500">CO₂e/yr</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Projected footprint</p>
              <p className={`text-2xl font-bold ${projectedT <= 2 ? 'text-leaf' : 'text-coal'}`}>
                {projectedT.toFixed(2)} t
              </p>
              <p className="text-xs text-gray-500">CO₂e/yr</p>
            </div>
          </div>

          <ul className="space-y-2" aria-label="Committed actions list">
            {committed.map((action) => {
              const kg = Math.round(action.getSavingKg(input));
              return (
                <li
                  key={action.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true">{action.icon}</span>
                    <span className="text-sm text-coal">{action.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-leaf">
                      −{(kg / 1000).toFixed(2)} t/yr
                    </span>
                    <button
                      type="button"
                      onClick={() => uncommitAction(action.id)}
                      aria-label={`Remove ${action.title} from committed actions`}
                      className="text-xs text-gray-400 hover:text-ember transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
