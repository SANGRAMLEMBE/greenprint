'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useFootprintStore } from '@/lib/store/footprint';
import { getComparisonCountries, getCountryRank, PARIS_TARGET_TCO2E } from '@/lib/data/countries';
import { BRAND, footprintColor } from '@/lib/ui/theme';

export function CountryComparison() {
  const { result, input } = useFootprintStore();
  if (!result || !input) return null;

  const countries = getComparisonCountries(input.region);
  const { percentile, higherThan, total } = getCountryRank(result.totalTCO2ePerYear);

  const chartData = [
    ...countries.map((c) => ({
      name: c.name.replace('United ', 'UK').replace('United States', 'USA'),
      value: c.tco2ePerCapita,
      isUser: false,
      code: c.code,
    })),
    {
      name: 'You',
      value: result.totalTCO2ePerYear,
      isUser: true,
      code: 'YOU',
    },
  ].sort((a, b) => a.value - b.value);

  return (
    <section aria-labelledby="compare-heading" className="rounded-2xl border border-gray-100 bg-white p-6">
      <h2 id="compare-heading" className="text-lg font-bold text-coal mb-1">
        Global comparison
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Your footprint is higher than{' '}
        <strong className="text-coal">{higherThan} of {total}</strong> comparison countries ({percentile}th percentile).
      </p>

      {/* Chart */}
      <div aria-hidden="true" className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 4, right: 32 }}>
            <XAxis type="number" unit=" t" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={56} />
            <Tooltip formatter={(v: number) => [`${v} t CO₂e/capita`, '']} />
            <ReferenceLine x={PARIS_TARGET_TCO2E} stroke={BRAND.leaf} strokeDasharray="4 2" label={{ value: '2t target', fontSize: 10, fill: BRAND.leaf }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry) => (
                // The user's own bar is dark so it stands out; every other
                // country is tinted by how its footprint compares to the target.
                <Cell
                  key={entry.code}
                  fill={entry.isUser ? BRAND.coal : footprintColor(entry.value)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible table */}
      <table className="w-full mt-4 text-sm">
        <caption className="sr-only">Carbon footprint per capita by country</caption>
        <thead>
          <tr className="border-b border-gray-100">
            <th scope="col" className="text-left py-1.5 font-semibold text-gray-500">Country</th>
            <th scope="col" className="text-right py-1.5 font-semibold text-gray-500">t CO₂e/capita</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((row) => (
            <tr key={row.code} className={`border-b border-gray-50 ${row.isUser ? 'font-bold' : ''}`}>
              <td className="py-1.5">{row.isUser ? '→ You' : row.name}</td>
              <td className="py-1.5 text-right">{row.value.toFixed(1)}</td>
            </tr>
          ))}
          <tr>
            <td className="py-1.5 text-gray-400 italic">Paris target</td>
            <td className="py-1.5 text-right text-leaf font-medium">2.0</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-xs text-gray-400">
        Source: Our World in Data — CO₂ &amp; GHG Emissions (CC BY 4.0). Values ~2022.
      </p>
    </section>
  );
}
