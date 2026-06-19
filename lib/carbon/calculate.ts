// Core calculation functions. All work in kg CO₂e; tonnes only at display time.

import {
  CAR_FACTORS,
  CONSUMPTION_FACTORS,
  DIET_FACTORS,
  FLIGHT_FACTORS,
  GAS_FACTOR,
  GRID_FACTORS,
  PARIS_TARGET_TCO2E,
  REGION_AVERAGE_TCO2E,
  TRANSIT_FACTORS,
} from './factors';
import type {
  CategoryKey,
  CategoryResult,
  FootprintInput,
  FootprintResult,
  RegionCode,
} from './types';
import { CATEGORY_LABELS } from './categories';

const WEEKS_PER_YEAR = 52;

/** Rounds to N decimal places cleanly (avoids 0.1+0.2 style float issues). */
export function round(value: number, dp = 2): number {
  const f = 10 ** dp;
  return Math.round((value + Number.EPSILON) * f) / f;
}

/** Convert kilograms of CO₂e to tonnes. */
export function kgToTonnes(kg: number): number {
  return round(kg / 1000, 2);
}

/** Annual transport emissions in kg CO₂e (car + transit combined). */
export function transportKg(input: FootprintInput['transport']): number {
  const car = input.carKmPerWeek * WEEKS_PER_YEAR * CAR_FACTORS[input.carFuel].value;
  const transit =
    input.transitKmPerWeek * WEEKS_PER_YEAR * TRANSIT_FACTORS[input.transitMode].value;
  return car + transit;
}

// Electricity uses the region's grid intensity. Divided by household size so
// each person only counts their share of shared energy.
export function homeKg(
  input: FootprintInput['home'],
  region: RegionCode,
): number {
  const electricity = input.electricityKwhPerYear * GRID_FACTORS[region].value;
  const gas = input.gasKwhPerYear * GAS_FACTOR.value;
  const householdSize = Math.max(1, input.householdSize);
  return (electricity + gas) / householdSize;
}

/** Annual diet emissions in kg CO₂e. */
export function dietKg(input: FootprintInput['diet']): number {
  return DIET_FACTORS[input].value;
}

/** Annual flight emissions in kg CO₂e (return trips, radiative forcing included). */
export function flightsKg(input: FootprintInput['flights']): number {
  return (
    input.shortHaulPerYear * FLIGHT_FACTORS.shortHaul.value +
    input.mediumHaulPerYear * FLIGHT_FACTORS.mediumHaul.value +
    input.longHaulPerYear * FLIGHT_FACTORS.longHaul.value
  );
}

/** Annual shopping/goods emissions in kg CO₂e. */
export function consumptionKg(input: FootprintInput['consumption']): number {
  return CONSUMPTION_FACTORS[input].value;
}

/** Calculates total footprint and per-category breakdown from validated input. */
export function calculateFootprint(input: FootprintInput): FootprintResult {
  const raw: Record<CategoryKey, number> = {
    transport: transportKg(input.transport),
    home: homeKg(input.home, input.region),
    diet: dietKg(input.diet),
    flights: flightsKg(input.flights),
    consumption: consumptionKg(input.consumption),
  };

  const total = (Object.values(raw) as number[]).reduce((a, b) => a + b, 0);

  const categories: CategoryResult[] = (Object.keys(raw) as CategoryKey[])
    .map((key) => ({
      key,
      label: CATEGORY_LABELS[key],
      kgCO2ePerYear: round(raw[key], 1),
      share: total > 0 ? round(raw[key] / total, 4) : 0,
    }))
    .sort((a, b) => b.kgCO2ePerYear - a.kgCO2ePerYear);

  return {
    totalKgCO2ePerYear: round(total, 1),
    totalTCO2ePerYear: kgToTonnes(total),
    categories,
    // sorted desc, so index 0 is always the biggest category
    topDriver: categories[0],
  };
}

export interface Comparison {
  readonly userTCO2e: number;
  readonly regionAverageTCO2e: number;
  readonly parisTargetTCO2e: number;
  readonly vsRegion: number;   // 1.0 = exactly at regional average
  readonly vsParis: number;
}

/** Compares the user's total against their region average and the 2t Paris target. */
export function compareFootprint(
  totalTCO2e: number,
  region: RegionCode,
): Comparison {
  const regionAverageTCO2e = REGION_AVERAGE_TCO2E[region];
  return {
    userTCO2e: round(totalTCO2e, 2),
    regionAverageTCO2e,
    parisTargetTCO2e: PARIS_TARGET_TCO2E,
    vsRegion: regionAverageTCO2e > 0 ? round(totalTCO2e / regionAverageTCO2e, 2) : 0,
    vsParis: round(totalTCO2e / PARIS_TARGET_TCO2E, 2),
  };
}
