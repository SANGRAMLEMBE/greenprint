import type { RegionCode, CarFuel, TransitMode, DietPattern, ConsumptionLevel } from '@/lib/carbon';

export interface DraftInput {
  region: RegionCode;
  carKmPerWeek: number;
  carFuel: CarFuel;
  transitKmPerWeek: number;
  transitMode: TransitMode;
  electricityKwhPerYear: number;
  gasKwhPerYear: number;
  householdSize: number;
  diet: DietPattern;
  shortHaulPerYear: number;
  mediumHaulPerYear: number;
  longHaulPerYear: number;
  consumption: ConsumptionLevel;
}

export interface StepProps {
  draft: DraftInput;
  updateDraft: (patch: Partial<DraftInput>) => void;
}

export const DEFAULT_DRAFT: DraftInput = {
  region: 'GB',
  carKmPerWeek: 100,
  carFuel: 'petrol',
  transitKmPerWeek: 30,
  transitMode: 'train',
  electricityKwhPerYear: 2900,
  gasKwhPerYear: 12000,
  householdSize: 2,
  diet: 'medium_meat',
  shortHaulPerYear: 1,
  mediumHaulPerYear: 0,
  longHaulPerYear: 0,
  consumption: 'medium',
};
