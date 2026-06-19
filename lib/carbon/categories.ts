import type { CategoryKey } from './types';

// The five buckets we split a footprint into. I keep the labels here in one
// place so the calculation engine and every chart read the exact same text —
// otherwise "Shopping" in one place and "Shopping & goods" in another slowly
// drift apart as the app grows.
export const CATEGORY_LABELS: Readonly<Record<CategoryKey, string>> = {
  transport: 'Transport',
  home: 'Home energy',
  diet: 'Diet',
  flights: 'Flights',
  consumption: 'Shopping & goods',
};
