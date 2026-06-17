'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useFootprintStore } from '@/lib/store/footprint';
import { PARIS_TARGET_TCO2E } from '@/lib/data/countries';
import { committedSavingsKg } from '@/lib/actions/data';

export function ProgressChart() {
  const { history, result, saveToHistory, committedActionIds, input } = useFootprintStore();

  const savingsKg = input ? committedSavingsKg(input, committedActionIds) : 0;

  if (history.length === 0) {
    return (
      <section aria-labelledby="progress-heading" className="rounded-2xl border border-gray-100 bg-white p-6">
        <h2 id="progress-heading" className="text-lg font-bold text-coal mb-2">
          Progress over time
        </h2>
        <div className="rounded-xl bg-gray-50 p-8 text-center">
          <p className="text-3xl mb-3" aria-hidden="true">📈</p>
          <p className="text-sm text-gray-500">
            No history yet. Recalculate your footprint over time to track progress.
          </p>
          {result && (
            <button
              type="button"
              onClick={() => saveToHistory(savingsKg)}
              className="mt-4 px-5 py-2 rounded-lg bg-leaf text-white text-sm font-semibold hover:bg-leaf-dark transition-colors"
            >
              Save today&apos;s footprint
            </button>
          )}
        </div>
      </section>
    );
  }

  const chartData = history.map((h) => ({
    date: h.date,
    footprint: h.totalTCO2ePerYear,
    saved: parseFloat((h.committedSavingsKg / 1000).toFixed(2)),
  }));

  return (
    <section aria-labelledby="progress-heading" className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 id="progress-heading" className="text-lg font-bold text-coal">
          Progress over time
        </h2>
        {result && (
          <button
            type="button"
            onClick={() => saveToHistory(savingsKg)}
            className="text-sm text-leaf font-medium hover:underline"
          >
            + Save today
          </button>
        )}
      </div>

      {/* Chart */}
      <div aria-hidden="true" className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis unit=" t" tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [`${v} t CO₂e/yr`, 'Footprint']} />
            <ReferenceLine
              y={PARIS_TARGET_TCO2E}
              stroke="#1b7a43"
              strokeDasharray="4 2"
              label={{ value: 'Paris 2t', fontSize: 10, fill: '#1b7a43', position: 'insideTopRight' }}
            />
            <Line
              type="monotone"
              dataKey="footprint"
              stroke="#1f2933"
              strokeWidth={2}
              dot={{ fill: '#1f2933', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible table */}
      <table className="w-full mt-4 text-sm">
        <caption className="sr-only">Footprint history over time</caption>
        <thead>
          <tr className="border-b border-gray-100">
            <th scope="col" className="text-left py-1.5 font-semibold text-gray-500">Date</th>
            <th scope="col" className="text-right py-1.5 font-semibold text-gray-500">t CO₂e/yr</th>
            <th scope="col" className="text-right py-1.5 font-semibold text-gray-500">Committed savings</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h.id} className="border-b border-gray-50">
              <td className="py-1.5">{h.date}</td>
              <td className="py-1.5 text-right font-medium">{h.totalTCO2ePerYear}</td>
              <td className="py-1.5 text-right text-leaf">
                {(h.committedSavingsKg / 1000).toFixed(2)} t
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
