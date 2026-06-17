/**
 * Public surface of the carbon engine.
 *
 * Import everything you need from `@/lib/carbon` so the UI never reaches into
 * internal files. The engine has zero UI/IO dependencies and can be reused on
 * the server, the client or in tests unchanged.
 */

export * from './types';
export * from './factors';
export * from './calculate';
export { footprintInputSchema } from './schema';
export type { ValidatedInput } from './schema';
