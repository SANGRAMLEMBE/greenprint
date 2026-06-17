import {
  CAR_FACTORS,
  DIET_FACTORS,
  GRID_FACTORS,
  CONSUMPTION_FACTORS,
} from '@/lib/carbon';
import type { CategoryKey, FootprintInput } from '@/lib/carbon';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CarbonAction {
  readonly id: string;
  readonly category: CategoryKey;
  readonly title: string;
  readonly description: string;
  readonly getSavingKg: (input: FootprintInput) => number;
  readonly difficulty: Difficulty;
  readonly icon: string;
  readonly source: string;
  readonly condition: (input: FootprintInput) => boolean;
}

const WEEKS = 52;
const GREEN_GRID_KG_KWH = 0.05; // 100% renewable tariff estimate
const HEAT_PUMP_COP = 3; // coefficient of performance

export const ALL_ACTIONS: readonly CarbonAction[] = [
  // ── TRANSPORT ────────────────────────────────────────────────────────────
  {
    id: 'switch-to-ev',
    category: 'transport',
    title: 'Switch to an electric vehicle',
    description:
      'Replace your petrol or diesel car with a battery EV. On the current GB grid, an EV emits 0.047 kg CO₂e/km vs 0.17 kg for petrol — 72% less per kilometre.',
    icon: '⚡',
    difficulty: 'hard',
    source: 'DEFRA GHG Conversion Factors 2023',
    condition: (i) =>
      i.transport.carKmPerWeek > 0 &&
      (i.transport.carFuel === 'petrol' || i.transport.carFuel === 'diesel'),
    getSavingKg: (i) => {
      const current = CAR_FACTORS[i.transport.carFuel].value;
      const ev = CAR_FACTORS.electric.value;
      return Math.max(0, (current - ev) * i.transport.carKmPerWeek * WEEKS);
    },
  },
  {
    id: 'switch-to-hybrid',
    category: 'transport',
    title: 'Switch to a plug-in hybrid',
    description:
      'A plug-in hybrid emits 0.12 kg CO₂e/km — 29% less than a petrol car — and is easier to adopt than a full BEV if you lack home charging.',
    icon: '🔋',
    difficulty: 'medium',
    source: 'DEFRA GHG Conversion Factors 2023',
    condition: (i) =>
      i.transport.carKmPerWeek > 0 && i.transport.carFuel === 'petrol',
    getSavingKg: (i) => {
      const current = CAR_FACTORS.petrol.value;
      const hybrid = CAR_FACTORS.hybrid.value;
      return Math.max(0, (current - hybrid) * i.transport.carKmPerWeek * WEEKS);
    },
  },
  {
    id: 'halve-car-mileage',
    category: 'transport',
    title: 'Halve your car mileage',
    description:
      'Combine errands, carpool, or work from home two days a week. Cutting your weekly car km in half immediately halves your car emissions.',
    icon: '🚗',
    difficulty: 'medium',
    source: 'DEFRA GHG Conversion Factors 2023',
    condition: (i) => i.transport.carKmPerWeek > 50,
    getSavingKg: (i) =>
      (i.transport.carKmPerWeek / 2) *
      WEEKS *
      CAR_FACTORS[i.transport.carFuel].value,
  },
  {
    id: 'car-to-train',
    category: 'transport',
    title: 'Replace car trips with train',
    description:
      'National rail emits 0.035 kg CO₂e per passenger-km — 80% less than a petrol car. Even switching half your car km to train makes a real dent.',
    icon: '🚆',
    difficulty: 'medium',
    source: 'DEFRA GHG Conversion Factors 2023',
    condition: (i) => i.transport.carKmPerWeek > 30,
    getSavingKg: (i) =>
      Math.max(
        0,
        (CAR_FACTORS[i.transport.carFuel].value - 0.035) *
          (i.transport.carKmPerWeek * 0.5) *
          WEEKS
      ),
  },
  {
    id: 'bus-to-metro',
    category: 'transport',
    title: 'Switch from bus to metro / light rail',
    description:
      'Metro emits 0.028 kg CO₂e/km vs bus at 0.097 — 71% lower. Where metro is available, it is the lowest-carbon motorised option.',
    icon: '🚇',
    difficulty: 'easy',
    source: 'DEFRA GHG Conversion Factors 2023',
    condition: (i) =>
      i.transport.transitMode === 'bus' && i.transport.transitKmPerWeek > 0,
    getSavingKg: (i) =>
      Math.max(0, (0.097 - 0.028) * i.transport.transitKmPerWeek * WEEKS),
  },

  // ── HOME ─────────────────────────────────────────────────────────────────
  {
    id: 'green-electricity',
    category: 'home',
    title: 'Switch to a 100% renewable electricity tariff',
    description:
      'A verified renewable tariff drops your electricity from ~207 g CO₂e/kWh to ~50 g. The easiest high-impact change you can make in an afternoon.',
    icon: '☀️',
    difficulty: 'easy',
    source: 'DEFRA GHG Conversion Factors 2023',
    condition: (i) =>
      i.home.electricityKwhPerYear > 0 && i.region === 'GB',
    getSavingKg: (i) =>
      Math.max(
        0,
        (GRID_FACTORS[i.region].value - GREEN_GRID_KG_KWH) *
          i.home.electricityKwhPerYear /
          i.home.householdSize
      ),
  },
  {
    id: 'heat-pump',
    category: 'home',
    title: 'Install an air-source heat pump',
    description:
      'A heat pump uses electricity to move heat rather than burn gas, achieving ~3× efficiency (COP 3). On a clean grid, this can cut home-heating emissions by over 60%.',
    icon: '♨️',
    difficulty: 'hard',
    source: 'DEFRA GHG Conversion Factors 2023 + IEA Heat Pumps',
    condition: (i) => {
      if (i.home.gasKwhPerYear < 5000) return false;
      // Only beneficial if heat pump electricity < gas emissions
      const gridFactor = GRID_FACTORS[i.region].value;
      return gridFactor / HEAT_PUMP_COP < 0.183;
    },
    getSavingKg: (i) => {
      const gridFactor = GRID_FACTORS[i.region].value;
      const gasSaving = i.home.gasKwhPerYear * 0.183;
      const hpElectricity = (i.home.gasKwhPerYear / HEAT_PUMP_COP) * gridFactor;
      return Math.max(0, (gasSaving - hpElectricity) / i.home.householdSize);
    },
  },
  {
    id: 'insulate-home',
    category: 'home',
    title: 'Improve home insulation',
    description:
      'Better loft/wall insulation and draught-proofing can cut gas consumption by 20–30%. Low disruption, permanent saving, and usually subsidised.',
    icon: '🏠',
    difficulty: 'medium',
    source: 'UK Energy Saving Trust estimates',
    condition: (i) => i.home.gasKwhPerYear > 3000,
    getSavingKg: (i) =>
      0.25 * i.home.gasKwhPerYear * 0.183 / i.home.householdSize,
  },
  {
    id: 'lower-thermostat',
    category: 'home',
    title: 'Turn your thermostat down 1 °C',
    description:
      'Each degree reduction cuts gas heating by ~8%. Barely noticeable comfort-wise, immediate saving. Wear a jumper.',
    icon: '🌡️',
    difficulty: 'easy',
    source: 'UK Energy Saving Trust',
    condition: (i) => i.home.gasKwhPerYear > 2000,
    getSavingKg: (i) =>
      0.08 * i.home.gasKwhPerYear * 0.183 / i.home.householdSize,
  },
  {
    id: 'solar-panels',
    category: 'home',
    title: 'Install rooftop solar panels',
    description:
      'A typical 4 kWp domestic system in the UK generates ~3,400 kWh/yr, offsetting ~700 kg CO₂e/yr from the grid.',
    icon: '🔆',
    difficulty: 'hard',
    source: 'DEFRA + UK Solar Trade Association',
    condition: (i) =>
      i.home.electricityKwhPerYear > 1000 && i.region === 'GB',
    getSavingKg: (i) =>
      Math.min(i.home.electricityKwhPerYear, 3400) *
      GRID_FACTORS[i.region].value /
      i.home.householdSize,
  },

  // ── DIET ─────────────────────────────────────────────────────────────────
  {
    id: 'go-vegan',
    category: 'diet',
    title: 'Adopt a vegan diet',
    description:
      'The biggest single dietary shift. A vegan diet produces ~1,500 kg CO₂e/yr vs 2,500 for average meat-eater — a 40% reduction in food emissions alone.',
    icon: '🌱',
    difficulty: 'hard',
    source: 'Poore & Nemecek (2018), Science',
    condition: (i) => i.diet !== 'vegan',
    getSavingKg: (i) =>
      Math.max(0, DIET_FACTORS[i.diet].value - DIET_FACTORS.vegan.value),
  },
  {
    id: 'go-vegetarian',
    category: 'diet',
    title: 'Adopt a vegetarian diet',
    description:
      'Cutting out meat (but keeping dairy/eggs) saves ~800 kg CO₂e/yr compared to medium meat consumption. Globally achievable and increasingly accessible.',
    icon: '🥦',
    difficulty: 'medium',
    source: 'Poore & Nemecek (2018), Science',
    condition: (i) =>
      i.diet === 'heavy_meat' || i.diet === 'medium_meat' || i.diet === 'low_meat',
    getSavingKg: (i) =>
      Math.max(0, DIET_FACTORS[i.diet].value - DIET_FACTORS.vegetarian.value),
  },
  {
    id: 'go-low-meat',
    category: 'diet',
    title: 'Reduce meat to < 50 g/day',
    description:
      'Cutting from heavy to low meat (50 g/day or less) saves ~1,400 kg CO₂e/yr. Even two meat-free days per week makes a measurable difference.',
    icon: '🥗',
    difficulty: 'easy',
    source: 'Poore & Nemecek (2018), Science',
    condition: (i) => i.diet === 'heavy_meat' || i.diet === 'medium_meat',
    getSavingKg: (i) =>
      Math.max(0, DIET_FACTORS[i.diet].value - DIET_FACTORS.low_meat.value),
  },
  {
    id: 'go-pescatarian',
    category: 'diet',
    title: 'Switch to a pescatarian diet',
    description:
      'Replacing meat with fish and plant foods cuts dietary emissions by ~800 kg/yr from medium meat. Fish generally has a much smaller footprint than beef or lamb.',
    icon: '🐟',
    difficulty: 'easy',
    source: 'Poore & Nemecek (2018), Science',
    condition: (i) =>
      i.diet === 'heavy_meat' || i.diet === 'medium_meat' || i.diet === 'low_meat',
    getSavingKg: (i) =>
      Math.max(
        0,
        DIET_FACTORS[i.diet].value - DIET_FACTORS.pescatarian.value
      ),
  },

  // ── FLIGHTS ───────────────────────────────────────────────────────────────
  {
    id: 'cut-long-haul',
    category: 'flights',
    title: 'Eliminate long-haul flights',
    description:
      'A single long-haul return flight emits ~3,000 kg CO₂e (incl. radiative forcing) — more than a typical UK car drives in a year. This is the highest-impact single action for frequent flyers.',
    icon: '✈️',
    difficulty: 'hard',
    source: 'DEFRA GHG Conversion Factors 2023',
    condition: (i) => i.flights.longHaulPerYear > 0,
    getSavingKg: (i) => i.flights.longHaulPerYear * 3000,
  },
  {
    id: 'halve-long-haul',
    category: 'flights',
    title: 'Reduce long-haul flights by half',
    description:
      'Combine trips, take fewer holidays, or take a cruise instead. Halving long-haul is a substantial saving for frequent travellers.',
    icon: '🌍',
    difficulty: 'medium',
    source: 'DEFRA GHG Conversion Factors 2023',
    condition: (i) => i.flights.longHaulPerYear >= 2,
    getSavingKg: (i) => Math.floor(i.flights.longHaulPerYear / 2) * 3000,
  },
  {
    id: 'cut-short-haul',
    category: 'flights',
    title: 'Replace short-haul flights with train',
    description:
      'For trips under ~700 km, high-speed rail is often quicker door-to-door and emits ~95% less CO₂e. Eurostar London–Paris: 6.4 kg vs 149 kg by air.',
    icon: '🚄',
    difficulty: 'medium',
    source: 'DEFRA GHG Conversion Factors 2023',
    condition: (i) => i.flights.shortHaulPerYear > 0,
    getSavingKg: (i) => i.flights.shortHaulPerYear * 500,
  },
  {
    id: 'cut-medium-haul',
    category: 'flights',
    title: 'Reduce medium-haul flights',
    description:
      'Medium-haul flights (1,500–4,000 km) each emit ~1,500 kg CO₂e. Cutting one saves the equivalent of six months of average home energy use.',
    icon: '🛫',
    difficulty: 'medium',
    source: 'DEFRA GHG Conversion Factors 2023',
    condition: (i) => i.flights.mediumHaulPerYear > 0,
    getSavingKg: (i) => i.flights.mediumHaulPerYear * 1500,
  },

  // ── CONSUMPTION ───────────────────────────────────────────────────────────
  {
    id: 'low-consumption',
    category: 'consumption',
    title: 'Adopt a repair & second-hand lifestyle',
    description:
      'Buying less, repairing what you own, and choosing second-hand drops consumption emissions from ~1,500 to ~600 kg CO₂e/yr. The most accessible shift.',
    icon: '♻️',
    difficulty: 'easy',
    source: 'EEIO-derived estimate (2023)',
    condition: (i) => i.consumption !== 'low',
    getSavingKg: (i) =>
      Math.max(
        0,
        CONSUMPTION_FACTORS[i.consumption].value - CONSUMPTION_FACTORS.low.value
      ),
  },
  {
    id: 'medium-consumption',
    category: 'consumption',
    title: 'Moderate your shopping habits',
    description:
      'Moving from high to average consumption cuts ~1,500 kg CO₂e/yr. Think quality over quantity: buy less, buy better, keep longer.',
    icon: '🛍️',
    difficulty: 'easy',
    source: 'EEIO-derived estimate (2023)',
    condition: (i) => i.consumption === 'high',
    getSavingKg: (_i) =>
      CONSUMPTION_FACTORS.high.value - CONSUMPTION_FACTORS.medium.value,
  },
] as const;

/** Gets the top applicable actions ranked by CO₂ saving, minus already committed ones. */
export function getPersonalisedActions(
  input: FootprintInput,
  committedIds: string[]
): (CarbonAction & { savingKgCO2ePerYear: number })[] {
  return ALL_ACTIONS.filter(
    (a) => !committedIds.includes(a.id) && a.condition(input)
  )
    .map((a) => ({
      ...a,
      savingKgCO2ePerYear: Math.round(a.getSavingKg(input)),
    }))
    .filter((a) => a.savingKgCO2ePerYear > 0)
    .sort((a, b) => b.savingKgCO2ePerYear - a.savingKgCO2ePerYear);
}

/** Sums up the CO₂ savings (kg/yr) for all committed action IDs. */
export function committedSavingsKg(
  input: FootprintInput,
  committedIds: string[]
): number {
  return ALL_ACTIONS.filter((a) => committedIds.includes(a.id)).reduce(
    (sum, a) => sum + a.getSavingKg(input),
    0
  );
}
