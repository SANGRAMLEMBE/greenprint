// The one door into the carbon engine. UI code imports from '@/lib/carbon' and
// never reaches into the individual files, so I'm free to reorganise internals
// without touching the rest of the app. The engine has no UI or IO dependencies,
// which is what keeps it easy to unit-test.
export * from './types';
export * from './factors';
export * from './categories';
export * from './calculate';
export { footprintInputSchema } from './schema';
export type { ValidatedInput } from './schema';
