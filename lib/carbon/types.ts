// All emissions are in kg CO₂e internally; converted to tonnes only for display.
// CO₂e uses IPCC AR6 GWP100 factors throughout.

/** A single emission factor with source info so every number is traceable. */
export interface EmissionFactor {
  /** Numeric value of the factor. */
  readonly value: number;
  /** Human-readable unit, e.g. "kg CO₂e / km". */
  readonly unit: string;
  /** Where the factor was sourced from. */
  readonly source: string;
  /** Publication year of the source dataset. */
  readonly year: number;
  /** Optional clarifying note (assumptions, scope, caveats). */
  readonly notes?: string;
}

/** Supported car fuel types. */
export type CarFuel = 'petrol' | 'diesel' | 'hybrid' | 'electric';

/** Supported public-transport modes. */
export type TransitMode = 'bus' | 'train' | 'metro';

/** Dietary patterns, ordered roughly high → low impact. */
export type DietPattern =
  | 'heavy_meat'
  | 'medium_meat'
  | 'low_meat'
  | 'pescatarian'
  | 'vegetarian'
  | 'vegan';

/** Discretionary-consumption lifestyle tiers. */
export type ConsumptionLevel = 'low' | 'medium' | 'high';

/**
 * Supported regions for grid-electricity intensity and country comparison.
 * "world" is the global average fallback used when a user's region is unknown.
 */
export type RegionCode = 'GB' | 'US' | 'EU' | 'IN' | 'CN' | 'AU' | 'world';

/** Raw, validated user input for a footprint estimate. */
export interface FootprintInput {
  readonly region: RegionCode;
  readonly transport: {
    /** Kilometres driven per week in a private car. */
    readonly carKmPerWeek: number;
    readonly carFuel: CarFuel;
    /** Kilometres per week by public transit. */
    readonly transitKmPerWeek: number;
    readonly transitMode: TransitMode;
  };
  readonly home: {
    /** Electricity consumption in kWh per year. */
    readonly electricityKwhPerYear: number;
    /** Natural-gas consumption in kWh per year (0 if none). */
    readonly gasKwhPerYear: number;
    /** Number of people sharing the household (footprint is divided by this). */
    readonly householdSize: number;
  };
  readonly diet: DietPattern;
  readonly flights: {
    /** Return short-haul flights per year (< 1500 km). */
    readonly shortHaulPerYear: number;
    /** Return medium-haul flights per year (1500–4000 km). */
    readonly mediumHaulPerYear: number;
    /** Return long-haul flights per year (> 4000 km). */
    readonly longHaulPerYear: number;
  };
  readonly consumption: ConsumptionLevel;
}

/** The five top-level categories we report on. */
export type CategoryKey =
  | 'transport'
  | 'home'
  | 'diet'
  | 'flights'
  | 'consumption';

/** Per-category result, in kg CO₂e per year. */
export interface CategoryResult {
  readonly key: CategoryKey;
  readonly label: string;
  readonly kgCO2ePerYear: number;
  /** Share of total, 0–1. */
  readonly share: number;
}

/** Full footprint result. */
export interface FootprintResult {
  /** Total annual footprint in kg CO₂e. */
  readonly totalKgCO2ePerYear: number;
  /** Total annual footprint in tonnes CO₂e (rounded to 2 dp). */
  readonly totalTCO2ePerYear: number;
  /** Per-category breakdown, sorted largest → smallest. */
  readonly categories: readonly CategoryResult[];
  /** The single category driving the largest share of emissions. */
  readonly topDriver: CategoryResult;
}
