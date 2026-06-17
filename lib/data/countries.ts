// Per-capita GHG data by country. Source: Our World in Data (CC BY 4.0), ~2022 values.
export interface CountryData {
  readonly code: string;
  readonly name: string;
  readonly tco2ePerCapita: number;
  readonly continent: string;
  readonly population: number; // millions
}

export const COUNTRY_DATA: readonly CountryData[] = [
  // Americas
  { code: 'US', name: 'United States', tco2ePerCapita: 14.3, continent: 'North America', population: 335 },
  { code: 'CA', name: 'Canada', tco2ePerCapita: 14.2, continent: 'North America', population: 39 },
  { code: 'MX', name: 'Mexico', tco2ePerCapita: 3.8, continent: 'North America', population: 130 },
  { code: 'BR', name: 'Brazil', tco2ePerCapita: 2.8, continent: 'South America', population: 215 },
  { code: 'AR', name: 'Argentina', tco2ePerCapita: 5.3, continent: 'South America', population: 46 },
  { code: 'CL', name: 'Chile', tco2ePerCapita: 4.7, continent: 'South America', population: 19 },

  // Europe
  { code: 'GB', name: 'United Kingdom', tco2ePerCapita: 4.7, continent: 'Europe', population: 67 },
  { code: 'DE', name: 'Germany', tco2ePerCapita: 8.1, continent: 'Europe', population: 83 },
  { code: 'FR', name: 'France', tco2ePerCapita: 4.7, continent: 'Europe', population: 68 },
  { code: 'IT', name: 'Italy', tco2ePerCapita: 5.3, continent: 'Europe', population: 60 },
  { code: 'ES', name: 'Spain', tco2ePerCapita: 4.9, continent: 'Europe', population: 47 },
  { code: 'PL', name: 'Poland', tco2ePerCapita: 8.7, continent: 'Europe', population: 38 },
  { code: 'NL', name: 'Netherlands', tco2ePerCapita: 7.4, continent: 'Europe', population: 18 },
  { code: 'SE', name: 'Sweden', tco2ePerCapita: 3.8, continent: 'Europe', population: 10 },
  { code: 'NO', name: 'Norway', tco2ePerCapita: 6.2, continent: 'Europe', population: 5 },
  { code: 'RU', name: 'Russia', tco2ePerCapita: 11.4, continent: 'Europe', population: 144 },

  // Middle East
  { code: 'QA', name: 'Qatar', tco2ePerCapita: 35.6, continent: 'Middle East', population: 3 },
  { code: 'KW', name: 'Kuwait', tco2ePerCapita: 25.6, continent: 'Middle East', population: 4 },
  { code: 'SA', name: 'Saudi Arabia', tco2ePerCapita: 18.0, continent: 'Middle East', population: 35 },
  { code: 'AE', name: 'UAE', tco2ePerCapita: 20.7, continent: 'Middle East', population: 10 },
  { code: 'IR', name: 'Iran', tco2ePerCapita: 8.8, continent: 'Middle East', population: 87 },

  // Asia
  { code: 'CN', name: 'China', tco2ePerCapita: 8.0, continent: 'Asia', population: 1412 },
  { code: 'IN', name: 'India', tco2ePerCapita: 2.0, continent: 'Asia', population: 1428 },
  { code: 'JP', name: 'Japan', tco2ePerCapita: 9.0, continent: 'Asia', population: 125 },
  { code: 'KR', name: 'South Korea', tco2ePerCapita: 12.9, continent: 'Asia', population: 52 },
  { code: 'ID', name: 'Indonesia', tco2ePerCapita: 2.3, continent: 'Asia', population: 277 },
  { code: 'PK', name: 'Pakistan', tco2ePerCapita: 1.0, continent: 'Asia', population: 232 },
  { code: 'BD', name: 'Bangladesh', tco2ePerCapita: 0.6, continent: 'Asia', population: 170 },
  { code: 'TH', name: 'Thailand', tco2ePerCapita: 4.1, continent: 'Asia', population: 72 },
  { code: 'VN', name: 'Vietnam', tco2ePerCapita: 3.8, continent: 'Asia', population: 98 },

  // Africa
  { code: 'ZA', name: 'South Africa', tco2ePerCapita: 7.2, continent: 'Africa', population: 60 },
  { code: 'EG', name: 'Egypt', tco2ePerCapita: 2.3, continent: 'Africa', population: 106 },
  { code: 'NG', name: 'Nigeria', tco2ePerCapita: 0.6, continent: 'Africa', population: 220 },
  { code: 'KE', name: 'Kenya', tco2ePerCapita: 0.4, continent: 'Africa', population: 55 },
  { code: 'ET', name: 'Ethiopia', tco2ePerCapita: 0.1, continent: 'Africa', population: 126 },

  // Oceania
  { code: 'AU', name: 'Australia', tco2ePerCapita: 15.0, continent: 'Oceania', population: 26 },
  { code: 'NZ', name: 'New Zealand', tco2ePerCapita: 6.3, continent: 'Oceania', population: 5 },
];

export const WORLD_AVERAGE_TCO2E = 4.7;
export const PARIS_TARGET_TCO2E = 2.0;

const sorted = [...COUNTRY_DATA].sort(
  (a, b) => a.tco2ePerCapita - b.tco2ePerCapita
);

/** Returns rank and percentile vs the 36 countries in COUNTRY_DATA. */
export function getCountryRank(tco2e: number): {
  rank: number;
  total: number;
  percentile: number;
  higherThan: number;
} {
  const total = sorted.length;
  const higherThan = sorted.filter((c) => c.tco2ePerCapita < tco2e).length;
  const rank = higherThan + 1;
  const percentile = Math.round((higherThan / total) * 100);
  return { rank, total, percentile, higherThan };
}

/** Picks a representative set of countries for the comparison chart. */
export function getComparisonCountries(userRegionCode: string): CountryData[] {
  const picks = ['ET', 'IN', 'GB', 'DE', 'US', 'AU', 'QA'];
  const result = picks
    .map((code) => COUNTRY_DATA.find((c) => c.code === code))
    .filter((c): c is CountryData => c !== undefined);

  // Ensure user's own country is included
  const userCountry = COUNTRY_DATA.find((c) => c.code === userRegionCode);
  if (userCountry && !result.find((c) => c.code === userRegionCode)) {
    result.push(userCountry);
    result.sort((a, b) => a.tco2ePerCapita - b.tco2ePerCapita);
  }
  return result;
}
