import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateFootprint, compareFootprint } from '@/lib/carbon';
import type { FootprintInput, FootprintResult, Comparison } from '@/lib/carbon';

export type AppStep = 'questionnaire' | 'results' | 'actions' | 'tracking';

export interface HistoryEntry {
  id: string;
  date: string;
  totalTCO2ePerYear: number;
  committedSavingsKg: number;
}

interface State {
  input: FootprintInput | null;
  result: FootprintResult | null;
  comparison: Comparison | null;
  step: AppStep;
  committedActionIds: string[];
  history: HistoryEntry[];
}

interface Actions {
  setInput: (input: FootprintInput) => void;
  setStep: (step: AppStep) => void;
  commitAction: (id: string) => void;
  uncommitAction: (id: string) => void;
  saveToHistory: (committedSavingsKg: number) => void;
  reset: () => void;
}

const initial: State = {
  input: null,
  result: null,
  comparison: null,
  step: 'questionnaire',
  committedActionIds: [],
  history: [],
};

export const useFootprintStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initial,

      setInput(input) {
        const result = calculateFootprint(input);
        const comparison = compareFootprint(result.totalTCO2ePerYear, input.region);
        set({ input, result, comparison });
      },

      setStep: (step) => set({ step }),

      commitAction(id) {
        if (!get().committedActionIds.includes(id)) {
          set({ committedActionIds: [...get().committedActionIds, id] });
        }
      },

      uncommitAction(id) {
        set({ committedActionIds: get().committedActionIds.filter((x) => x !== id) });
      },

      saveToHistory(committedSavingsKg) {
        const { result, history } = get();
        if (!result) return;
        const date = new Date().toISOString().split('T')[0];
        const entry: HistoryEntry = {
          id: `${date}-${Date.now()}`,
          date,
          totalTCO2ePerYear: result.totalTCO2ePerYear,
          committedSavingsKg,
        };
        const filtered = history.filter((h) => h.date !== date);
        set({
          history: [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date)),
        });
      },

      reset() {
        set({ ...initial, history: get().history });
      },
    }),
    {
      name: 'carbon-companion-v1',
      skipHydration: true,
    }
  )
);
