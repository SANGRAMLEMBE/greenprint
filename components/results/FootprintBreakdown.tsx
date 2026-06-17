'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFootprintStore } from '@/lib/store/footprint';

const COLOURS: Record<string, string> = {
  transport: '#1b7a43',
  home: '#2ecc71',
  diet: '#f59e0b',
  flights: '#ef4444',
  consumption: '#8b5cf6',
};

const CATEGORY_LABELS: Record<string, string> = {
  transport: 'Transport',
  home: 'Home energy',
  diet: 'Diet',
  flights: 'Flights',
  consumption: 'Shopping',
};

export function FootprintBreakdown() {
  const { result } = useFootprintStore();
  if (!result) return null;

  const data = result.categories.map((c) => ({
    name: CATEGORY_LABELS[c.key] ?? c.label,
    value: Math.round(c.kgCO2ePerYear),
    key: c.key,
    share: Math.round(c.share * 100),
  }));

  return (
    <section aria-labelledby="breakdown-heading" className="rounded-2xl border border-gray-100 bg-white p-6">
      <h2 id="breakdown-heading" className="text-lg font-bold text-coal mb-4">
        Footprint breakdown
      </h2>

      {/* Chart — hidden from screen readers, table below is the accessible version */}
      <div aria-hidden="true" className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ share }: { share: number }) => `${share}%`}
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={COLOURS[entry.key] ?? '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number) => [`${v} kg CO₂e/yr`, '']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible table equivalent */}
      <table className="w-full mt-4 text-sm">
        <caption className="sr-only">Annual carbon footprint by category</caption>
        <thead>
          <tr className="border-b border-gray-100">
            <th scope="col" className="text-left py-2 font-semibold text-gray-500">Category</th>
            <th scope="col" className="text-right py-2 font-semibold text-gray-500">kg CO₂e/yr</th>
            <th scope="col" className="text-right py-2 font-semibold text-gray-500">Share</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.key} className="border-b border-gray-50">
              <td className="py-2 flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLOURS[row.key] ?? '#94a3b8' }}
                  aria-hidden="true"
                />
                {row.name}
              </td>
              <td className="py-2 text-right font-medium text-coal">
                {row.value.toLocaleString()}
              </td>
              <td className="py-2 text-right text-gray-500">{row.share}%</td>
            </tr>
          ))}
          <tr className="font-bold">
            <td className="py-2">Total</td>
            <td className="py-2 text-right text-coal">
              {result.totalKgCO2ePerYear.toLocaleString()}
            </td>
            <td className="py-2 text-right text-gray-500">100%</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-3 text-xs text-gray-400">
        Biggest driver: <strong className="text-coal">{result.topDriver.label}</strong> at{' '}
        {Math.round(result.topDriver.share * 100)}% of your total.
      </p>
    </section>
  );
}
