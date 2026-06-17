// Emission factors used across the app.
// Sources: DEFRA/DESNZ 2023, US EPA eGRID 2023, IEA 2022, Poore & Nemecek (2018), OWID.
// Each factor has a source + year so any number can be traced back to its origin.

import type {
  CarFuel,
  ConsumptionLevel,
  DietPattern,
  EmissionFactor,
  RegionCode,
  TransitMode,
} from './types';

const DEFRA = 'UK DESNZ/DEFRA GHG conversion factors';
const EPA = 'US EPA Emission Factors for GHG Inventories';
const IEA = 'IEA national electricity carbon intensity';
const POORE = 'Poore & Nemecek (2018), Science';
const OWID = 'Our World in Data — CO₂ & GHG Emissions';

// kg CO₂e per km driven, by fuel type (well-to-wheel average)
export const CAR_FACTORS: Readonly<Record<CarFuel, EmissionFactor>> = {
  petrol: { value: 0.17, unit: 'kg CO₂e / km', source: DEFRA, year: 2023, notes: 'Average petrol car.' },
  diesel: { value: 0.168, unit: 'kg CO₂e / km', source: DEFRA, year: 2023, notes: 'Average diesel car.' },
  hybrid: { value: 0.12, unit: 'kg CO₂e / km', source: DEFRA, year: 2023, notes: 'Average plug-in/full hybrid.' },
  electric: { value: 0.047, unit: 'kg CO₂e / km', source: DEFRA, year: 2023, notes: 'BEV incl. average grid; varies by region.' },
};

// kg CO₂e per passenger-km for common transit modes
export const TRANSIT_FACTORS: Readonly<Record<TransitMode, EmissionFactor>> = {
  bus: { value: 0.097, unit: 'kg CO₂e / p-km', source: DEFRA, year: 2023, notes: 'Average local bus.' },
  train: { value: 0.035, unit: 'kg CO₂e / p-km', source: DEFRA, year: 2023, notes: 'National rail.' },
  metro: { value: 0.028, unit: 'kg CO₂e / p-km', source: DEFRA, year: 2023, notes: 'Light rail / underground.' },
};

// Grid carbon intensity per region (kg CO₂e / kWh)
export const GRID_FACTORS: Readonly<Record<RegionCode, EmissionFactor>> = {
  GB: { value: 0.207, unit: 'kg CO₂e / kWh', source: DEFRA, year: 2023, notes: 'UK grid average.' },
  US: { value: 0.371, unit: 'kg CO₂e / kWh', source: EPA, year: 2023, notes: 'US national average (eGRID).' },
  EU: { value: 0.251, unit: 'kg CO₂e / kWh', source: IEA, year: 2022, notes: 'EU-27 average.' },
  IN: { value: 0.713, unit: 'kg CO₂e / kWh', source: IEA, year: 2022, notes: 'India grid average.' },
  CN: { value: 0.582, unit: 'kg CO₂e / kWh', source: IEA, year: 2022, notes: 'China grid average.' },
  AU: { value: 0.66, unit: 'kg CO₂e / kWh', source: IEA, year: 2022, notes: 'Australia grid average.' },
  world: { value: 0.475, unit: 'kg CO₂e / kWh', source: IEA, year: 2022, notes: 'Global grid average.' },
};

// Natural gas: kg CO₂e per kWh (gross calorific value)
export const GAS_FACTOR: EmissionFactor = {
  value: 0.183,
  unit: 'kg CO₂e / kWh',
  source: DEFRA,
  year: 2023,
  notes: 'Natural gas, gross calorific value.',
};

// Annual dietary footprint by eating pattern (kg CO₂e/yr)
export const DIET_FACTORS: Readonly<Record<DietPattern, EmissionFactor>> = {
  heavy_meat: { value: 3300, unit: 'kg CO₂e / yr', source: POORE, year: 2018, notes: '>100 g meat/day.' },
  medium_meat: { value: 2500, unit: 'kg CO₂e / yr', source: POORE, year: 2018, notes: '50–100 g meat/day.' },
  low_meat: { value: 1900, unit: 'kg CO₂e / yr', source: POORE, year: 2018, notes: '<50 g meat/day.' },
  pescatarian: { value: 1700, unit: 'kg CO₂e / yr', source: POORE, year: 2018, notes: 'Fish, no meat.' },
  vegetarian: { value: 1700, unit: 'kg CO₂e / yr', source: POORE, year: 2018, notes: 'No meat or fish.' },
  vegan: { value: 1500, unit: 'kg CO₂e / yr', source: POORE, year: 2018, notes: 'No animal products.' },
};

// Return flight emissions including radiative forcing uplift
export const FLIGHT_FACTORS = {
  shortHaul: { value: 500, unit: 'kg CO₂e / return flight', source: DEFRA, year: 2023, notes: '<1500 km, RF uplift applied.' },
  mediumHaul: { value: 1500, unit: 'kg CO₂e / return flight', source: DEFRA, year: 2023, notes: '1500–4000 km, RF uplift applied.' },
  longHaul: { value: 3000, unit: 'kg CO₂e / return flight', source: DEFRA, year: 2023, notes: '>4000 km, RF uplift applied.' },
} as const satisfies Record<string, EmissionFactor>;

// Shopping/goods emissions by spending tier (kg CO₂e/yr)
export const CONSUMPTION_FACTORS: Readonly<Record<ConsumptionLevel, EmissionFactor>> = {
  low: { value: 600, unit: 'kg CO₂e / yr', source: 'EEIO-derived estimate', year: 2023, notes: 'Minimal new goods; repair/second-hand.' },
  medium: { value: 1500, unit: 'kg CO₂e / yr', source: 'EEIO-derived estimate', year: 2023, notes: 'Average discretionary spend.' },
  high: { value: 3000, unit: 'kg CO₂e / yr', source: 'EEIO-derived estimate', year: 2023, notes: 'Frequent new purchases.' },
};

// Per-capita averages for the regional comparison. Source: OWID.
export const REGION_AVERAGE_TCO2E: Readonly<Record<RegionCode, number>> = {
  GB: 4.7,
  US: 14.3,
  EU: 6.2,
  IN: 2.0,
  CN: 8.0,
  AU: 15.0,
  world: 4.7,
};

// The Paris Agreement target: 2 tonnes CO₂e per person per year
export const PARIS_TARGET_TCO2E = 2.0;

// Display names for each region code
export const REGION_LABELS: Readonly<Record<RegionCode, string>> = {
  GB: 'United Kingdom',
  US: 'United States',
  EU: 'European Union',
  IN: 'India',
  CN: 'China',
  AU: 'Australia',
  world: 'World average',
};

export const SOURCES = { DEFRA, EPA, IEA, POORE, OWID } as const;
