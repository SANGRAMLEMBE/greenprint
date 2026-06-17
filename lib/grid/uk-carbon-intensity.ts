export interface GridIntensityResult {
  readonly gCO2ePerKwh: number;
  readonly index: 'very low' | 'low' | 'moderate' | 'high' | 'very high' | 'unknown';
  readonly message: string;
  readonly fetchedAt: string;
  readonly available: boolean;
}

interface ApiResponse {
  data: Array<{
    intensity: {
      actual: number | null;
      forecast: number;
      index: string;
    };
  }>;
}

const MESSAGES: Record<string, string> = {
  'very low':
    'Very low carbon on the grid — perfect time to charge your EV, run the dishwasher, or do laundry.',
  low: 'Low carbon on the grid — a good time for energy-intensive tasks.',
  moderate:
    'Moderate carbon on the grid — consider waiting for a greener window.',
  high: 'High carbon on the grid — avoid non-essential heavy electricity use right now.',
  'very high':
    'Very high carbon on the grid — delay energy-intensive tasks if possible.',
};

// simple 30-min cache so we don't hammer the API on every render
let cache: { result: GridIntensityResult; expiresAt: number } | null = null;
const TTL_MS = 30 * 60 * 1000;

export async function fetchGridIntensity(): Promise<GridIntensityResult> {
  if (cache && Date.now() < cache.expiresAt) return cache.result;

  try {
    const res = await fetch('https://api.carbonintensity.org.uk/intensity', {
      headers: { Accept: 'application/json' },
      next: { revalidate: 1800 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as ApiResponse;
    const entry = json.data[0];
    if (!entry) throw new Error('Empty response');

    const raw = entry.intensity.actual ?? entry.intensity.forecast;
    const index = (entry.intensity.index ?? 'unknown') as GridIntensityResult['index'];

    const result: GridIntensityResult = {
      gCO2ePerKwh: raw,
      index,
      message: MESSAGES[index] ?? 'Grid intensity data is available.',
      fetchedAt: new Date().toISOString(),
      available: true,
    };

    cache = { result, expiresAt: Date.now() + TTL_MS };
    return result;
  } catch {
    const fallback: GridIntensityResult = {
      gCO2ePerKwh: 0,
      index: 'unknown',
      message:
        'Live grid data is temporarily unavailable. Check api.carbonintensity.org.uk for current intensity.',
      fetchedAt: new Date().toISOString(),
      available: false,
    };
    return fallback;
  }
}
