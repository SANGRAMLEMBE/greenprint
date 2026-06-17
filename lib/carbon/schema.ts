// Validate all user input with zod before it hits the calculation functions.

import { z } from 'zod';

const nonNegative = (max: number) =>
  z.number().finite().min(0).max(max);

export const footprintInputSchema = z.object({
  region: z.enum(['GB', 'US', 'EU', 'IN', 'CN', 'AU', 'world']),
  transport: z.object({
    carKmPerWeek: nonNegative(10_000),
    carFuel: z.enum(['petrol', 'diesel', 'hybrid', 'electric']),
    transitKmPerWeek: nonNegative(10_000),
    transitMode: z.enum(['bus', 'train', 'metro']),
  }),
  home: z.object({
    electricityKwhPerYear: nonNegative(200_000),
    gasKwhPerYear: nonNegative(200_000),
    householdSize: z.number().int().min(1).max(20),
  }),
  diet: z.enum([
    'heavy_meat',
    'medium_meat',
    'low_meat',
    'pescatarian',
    'vegetarian',
    'vegan',
  ]),
  flights: z.object({
    shortHaulPerYear: nonNegative(365),
    mediumHaulPerYear: nonNegative(365),
    longHaulPerYear: nonNegative(365),
  }),
  consumption: z.enum(['low', 'medium', 'high']),
});

/** Parse unknown data into a validated FootprintInput, throwing on failure. */
export type ValidatedInput = z.infer<typeof footprintInputSchema>;
