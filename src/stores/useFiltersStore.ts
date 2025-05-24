import { create } from 'zustand';

export type DimensionDate = 'SupplierIncomes.date';

export type EqualsDimension =
  | 'SupplierIncomes.warehouseName'
  | 'SupplierIncomes.subject'
  | 'SupplierIncomes.supplierArticle';

export type EqualsFilter = {
  dimension: EqualsDimension;
  operator: 'equals';
  values: string[];
};

export type Filter = EqualsFilter;

type FiltersState = {
  filters: Filter[];                                  // equals‑filters
  dateRanges: Record<DimensionDate, [Date, Date] | null>;
  setFilter: (filter: Filter) => void;
  removeFilter: (dimension: EqualsDimension) => void;
  setDateRange: (dim: DimensionDate, range: [Date, Date] | null) => void;
  clearAll: () => void;
};

export const useFiltersStore = create<FiltersState>((set) => ({
  filters: [],
  dateRanges: { 'SupplierIncomes.date': null },

  setFilter: (newFilter) =>
    set((state) => {
      const others = state.filters.filter((f) => f.dimension !== newFilter.dimension);
      return { filters: [...others, newFilter] };
    }),

  removeFilter: (dimension) =>
    set((state) => ({ filters: state.filters.filter((f) => f.dimension !== dimension) })),

  setDateRange: (dim, range) =>
    set((state) => ({
      dateRanges: { ...state.dateRanges, [dim]: range },
    })),

  clearAll: () =>
    set({
      filters: [],
      dateRanges: { 'SupplierIncomes.date': null },
    }),
}));