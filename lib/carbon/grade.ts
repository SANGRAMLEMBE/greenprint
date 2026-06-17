// Turns an annual footprint into an at-a-glance A–F grade, anchored to the
// 2 t Paris target (A) and the ~16 t high-consumption end of the scale (F).

export interface CarbonGrade {
  letter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  label: string;
  /** Tailwind text colour class. */
  color: string;
  /** Tailwind background tint class. */
  bg: string;
}

const SCALE: { max: number; grade: CarbonGrade }[] = [
  { max: 2, grade: { letter: 'A', label: 'Paris-aligned', color: 'text-leaf', bg: 'bg-leaf-50' } },
  { max: 4, grade: { letter: 'B', label: 'Low impact', color: 'text-leaf-light', bg: 'bg-leaf-50' } },
  { max: 6, grade: { letter: 'C', label: 'Below average', color: 'text-amber-600', bg: 'bg-amber-50' } },
  { max: 9, grade: { letter: 'D', label: 'Above average', color: 'text-amber-700', bg: 'bg-amber-50' } },
  { max: 13, grade: { letter: 'E', label: 'High impact', color: 'text-orange-600', bg: 'bg-orange-50' } },
];

const F_GRADE: CarbonGrade = {
  letter: 'F',
  label: 'Very high impact',
  color: 'text-ember',
  bg: 'bg-red-50',
};

export function getCarbonGrade(tco2e: number): CarbonGrade {
  return SCALE.find((s) => tco2e <= s.max)?.grade ?? F_GRADE;
}
