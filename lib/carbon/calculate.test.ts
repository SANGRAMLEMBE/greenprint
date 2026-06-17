import { describe, expect, it } from 'vitest';
import {
  calculateFootprint,
  compareFootprint,
  consumptionKg,
  dietKg,
  flightsKg,
  homeKg,
  kgToTonnes,
  round,
  transportKg,
} from './calculate';
import {
  CAR_FACTORS,
  DIET_FACTORS,
  GAS_FACTOR,
  GRID_FACTORS,
  PARIS_TARGET_TCO2E,
} from './factors';
import { footprintInputSchema } from './schema';
import type { FootprintInput } from './types';

// a typical UK user — reused as the base for most test cases
const baseInput: FootprintInput = {
  region: 'GB',
  transport: {
    carKmPerWeek: 100,
    carFuel: 'petrol',
    transitKmPerWeek: 50,
    transitMode: 'train',
  },
  home: {
    electricityKwhPerYear: 3000,
    gasKwhPerYear: 12000,
    householdSize: 2,
  },
  diet: 'medium_meat',
  flights: { shortHaulPerYear: 1, mediumHaulPerYear: 0, longHaulPerYear: 1 },
  consumption: 'medium',
};

describe('helpers', () => {
  it('round avoids floating-point drift', () => {
    expect(round(0.1 + 0.2, 2)).toBe(0.3);
    expect(round(2.345, 2)).toBe(2.35);
    expect(round(2.344, 2)).toBe(2.34);
  });

  it('kgToTonnes converts and rounds to 2dp', () => {
    expect(kgToTonnes(1000)).toBe(1);
    expect(kgToTonnes(2456)).toBe(2.46);
    expect(kgToTonnes(0)).toBe(0);
  });
});

describe('transportKg', () => {
  it('sums car and transit over a full year', () => {
    const expected =
      100 * 52 * CAR_FACTORS.petrol.value + 50 * 52 * 0.035;
    expect(transportKg(baseInput.transport)).toBeCloseTo(expected, 6);
  });

  it('returns 0 when no travel', () => {
    expect(
      transportKg({
        carKmPerWeek: 0,
        carFuel: 'electric',
        transitKmPerWeek: 0,
        transitMode: 'bus',
      }),
    ).toBe(0);
  });

  it('an electric car emits less than a petrol car for the same distance', () => {
    const petrol = transportKg({ ...baseInput.transport, carFuel: 'petrol', transitKmPerWeek: 0 });
    const electric = transportKg({ ...baseInput.transport, carFuel: 'electric', transitKmPerWeek: 0 });
    expect(electric).toBeLessThan(petrol);
  });
});

describe('homeKg', () => {
  it('applies the region grid factor to electricity', () => {
    const single = homeKg({ electricityKwhPerYear: 1000, gasKwhPerYear: 0, householdSize: 1 }, 'GB');
    expect(single).toBeCloseTo(1000 * GRID_FACTORS.GB.value, 6);
  });

  it('uses a dirtier grid for India than the UK', () => {
    const uk = homeKg({ electricityKwhPerYear: 1000, gasKwhPerYear: 0, householdSize: 1 }, 'GB');
    const india = homeKg({ electricityKwhPerYear: 1000, gasKwhPerYear: 0, householdSize: 1 }, 'IN');
    expect(india).toBeGreaterThan(uk);
  });

  it('divides emissions across the household', () => {
    const solo = homeKg({ electricityKwhPerYear: 4000, gasKwhPerYear: 8000, householdSize: 1 }, 'GB');
    const shared = homeKg({ electricityKwhPerYear: 4000, gasKwhPerYear: 8000, householdSize: 4 }, 'GB');
    expect(shared).toBeCloseTo(solo / 4, 6);
  });

  it('treats a household size below 1 as 1 (no divide-by-zero)', () => {
    const result = homeKg({ electricityKwhPerYear: 1000, gasKwhPerYear: 0, householdSize: 0 }, 'GB');
    expect(result).toBeCloseTo(1000 * GRID_FACTORS.GB.value, 6);
    expect(Number.isFinite(result)).toBe(true);
  });

  it('includes gas combustion', () => {
    const withGas = homeKg({ electricityKwhPerYear: 0, gasKwhPerYear: 1000, householdSize: 1 }, 'GB');
    expect(withGas).toBeCloseTo(1000 * GAS_FACTOR.value, 6);
  });
});

describe('dietKg', () => {
  it('maps each pattern to its factor', () => {
    for (const pattern of Object.keys(DIET_FACTORS) as (keyof typeof DIET_FACTORS)[]) {
      expect(dietKg(pattern)).toBe(DIET_FACTORS[pattern].value);
    }
  });

  it('ranks heavy meat above vegan', () => {
    expect(dietKg('heavy_meat')).toBeGreaterThan(dietKg('vegan'));
  });
});

describe('flightsKg', () => {
  it('returns 0 with no flights', () => {
    expect(flightsKg({ shortHaulPerYear: 0, mediumHaulPerYear: 0, longHaulPerYear: 0 })).toBe(0);
  });

  it('scales linearly with flight count', () => {
    const one = flightsKg({ shortHaulPerYear: 1, mediumHaulPerYear: 0, longHaulPerYear: 0 });
    const three = flightsKg({ shortHaulPerYear: 3, mediumHaulPerYear: 0, longHaulPerYear: 0 });
    expect(three).toBeCloseTo(one * 3, 6);
  });

  it('a long-haul flight outweighs a short-haul flight', () => {
    const short = flightsKg({ shortHaulPerYear: 1, mediumHaulPerYear: 0, longHaulPerYear: 0 });
    const long = flightsKg({ shortHaulPerYear: 0, mediumHaulPerYear: 0, longHaulPerYear: 1 });
    expect(long).toBeGreaterThan(short);
  });
});

describe('consumptionKg', () => {
  it('orders low < medium < high', () => {
    expect(consumptionKg('low')).toBeLessThan(consumptionKg('medium'));
    expect(consumptionKg('medium')).toBeLessThan(consumptionKg('high'));
  });
});

describe('calculateFootprint', () => {
  it('total equals the sum of all categories', () => {
    const r = calculateFootprint(baseInput);
    const sum = r.categories.reduce((a, c) => a + c.kgCO2ePerYear, 0);
    expect(r.totalKgCO2ePerYear).toBeCloseTo(round(sum, 1), 1);
  });

  it('category shares sum to ~1', () => {
    const r = calculateFootprint(baseInput);
    const shareSum = r.categories.reduce((a, c) => a + c.share, 0);
    expect(shareSum).toBeCloseTo(1, 2);
  });

  it('categories are sorted largest first and topDriver matches', () => {
    const r = calculateFootprint(baseInput);
    for (let i = 1; i < r.categories.length; i++) {
      expect(r.categories[i - 1].kgCO2ePerYear).toBeGreaterThanOrEqual(
        r.categories[i].kgCO2ePerYear,
      );
    }
    expect(r.topDriver).toEqual(r.categories[0]);
  });

  it('exposes all five categories', () => {
    const r = calculateFootprint(baseInput);
    expect(r.categories).toHaveLength(5);
  });

  it('handles an all-zero lifestyle without NaN', () => {
    const zero: FootprintInput = {
      region: 'world',
      transport: { carKmPerWeek: 0, carFuel: 'electric', transitKmPerWeek: 0, transitMode: 'bus' },
      home: { electricityKwhPerYear: 0, gasKwhPerYear: 0, householdSize: 1 },
      diet: 'vegan',
      flights: { shortHaulPerYear: 0, mediumHaulPerYear: 0, longHaulPerYear: 0 },
      consumption: 'low',
    };
    const r = calculateFootprint(zero);
    // Only diet + consumption remain.
    expect(r.totalKgCO2ePerYear).toBe(round(1500 + 600, 1));
    expect(r.categories.every((c) => Number.isFinite(c.share))).toBe(true);
  });

  it('produces a higher footprint for a high-impact lifestyle', () => {
    const low = calculateFootprint({
      ...baseInput,
      diet: 'vegan',
      flights: { shortHaulPerYear: 0, mediumHaulPerYear: 0, longHaulPerYear: 0 },
      consumption: 'low',
      transport: { ...baseInput.transport, carKmPerWeek: 0, transitKmPerWeek: 0 },
    });
    const high = calculateFootprint({
      ...baseInput,
      diet: 'heavy_meat',
      flights: { shortHaulPerYear: 4, mediumHaulPerYear: 2, longHaulPerYear: 3 },
      consumption: 'high',
      transport: { ...baseInput.transport, carKmPerWeek: 400, carFuel: 'diesel' },
    });
    expect(high.totalTCO2ePerYear).toBeGreaterThan(low.totalTCO2ePerYear);
  });
});

describe('compareFootprint', () => {
  it('flags an above-average UK footprint', () => {
    const c = compareFootprint(9.4, 'GB');
    expect(c.vsRegion).toBe(2); // 9.4 / 4.7
    expect(c.vsParis).toBe(round(9.4 / PARIS_TARGET_TCO2E, 2));
  });

  it('identifies a footprint at the Paris target', () => {
    const c = compareFootprint(PARIS_TARGET_TCO2E, 'world');
    expect(c.vsParis).toBe(1);
  });
});

describe('footprintInputSchema (security boundary)', () => {
  it('accepts a valid payload', () => {
    expect(() => footprintInputSchema.parse(baseInput)).not.toThrow();
  });

  it('rejects negative distances', () => {
    const bad = { ...baseInput, transport: { ...baseInput.transport, carKmPerWeek: -10 } };
    expect(footprintInputSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects an unknown region', () => {
    const bad = { ...baseInput, region: 'MARS' };
    expect(footprintInputSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects a non-integer household size', () => {
    const bad = { ...baseInput, home: { ...baseInput.home, householdSize: 2.5 } };
    expect(footprintInputSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects absurd out-of-range input', () => {
    const bad = { ...baseInput, home: { ...baseInput.home, electricityKwhPerYear: 9_999_999 } };
    expect(footprintInputSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects NaN / Infinity', () => {
    const bad = { ...baseInput, transport: { ...baseInput.transport, carKmPerWeek: Infinity } };
    expect(footprintInputSchema.safeParse(bad).success).toBe(false);
  });
});
