// src/store/useFiltersStore.ts
import { create } from 'zustand';

export type Filter =
  | { dimension: 'SupplierIncomes.date'; operator: 'between'; values: [string, string] }
  | { dimension: 'SupplierIncomes.warehouseName'; operator: 'equals'; values: string[] }
  | { dimension: 'SupplierIncomes.subject'; operator: 'equals'; values: string[] };
// расширяйте по мере надобности

type FiltersState = {
  filters: Filter[];
  setFilter: (filter: Filter) => void;
  removeFilter: (dimension: Filter['dimension']) => void;
  clearAll: () => void;
};

export const useFiltersStore = create<FiltersState>((set) => ({
  filters: [],

  setFilter: (newFilter) =>
    set((state) => {
      // заменяем фильтр по той же dimension, если он уже был
      console.log('setFilter', newFilter.values[0] );
      const others = state.filters.filter((f) => f.dimension !== newFilter.dimension);
      return { filters: [...others, newFilter] };
    }),

  removeFilter: (dimension) =>
    set((state) => ({ filters: state.filters.filter((f) => f.dimension !== dimension) })),

  clearAll: () => set({ filters: [] }),
}));
