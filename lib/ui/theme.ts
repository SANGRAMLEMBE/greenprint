import type { CategoryKey } from '@/lib/carbon';

// One home for every colour the charts and the SVG scene reach for. These
// mirror the Tailwind tokens in tailwind.config.ts — recharts and inline SVG
// can't use Tailwind class names, so they need the raw hex values here. Keeping
// them in a single object means a brand tweak is a one-line change.
export const BRAND = {
  leaf: '#1b7a43',
  leafLight: '#2ecc71',
  coal: '#1f2933',
  amber: '#f59e0b',
  red: '#ef4444',
  violet: '#8b5cf6',
  gridLine: '#f3f4f6',
} as const;

// The colour each footprint category is drawn in, shared by the pie chart,
// the legend and the breakdown table so a category always looks the same.
export const CATEGORY_COLORS: Readonly<Record<CategoryKey, string>> = {
  transport: BRAND.leaf,
  home: BRAND.leafLight,
  diet: BRAND.amber,
  flights: BRAND.red,
  consumption: BRAND.violet,
};

// A footprint's colour on the "how do I compare" scale: green if we're at or
// near the Paris target, amber in the middle, red once it climbs high.
export function footprintColor(tco2e: number): string {
  if (tco2e <= 2) return BRAND.leaf;
  if (tco2e <= 6) return BRAND.amber;
  return BRAND.red;
}
