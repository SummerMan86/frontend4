import { create } from 'zustand';

/* ────────────────────────────────────────────────────────────
   Dimensions that we support in filters
   ──────────────────────────────────────────────────────────── */
export type DimString =
  | 'SupplierIncomes.warehouseName'
  | 'SupplierIncomes.subject'
  | 'SupplierIncomes.supplierArticle';

export type DimDate =
  | 'SupplierIncomes.date'
  | 'SupplierIncomes.lastChangeDate';

/* ────────── filter shapes ────────── */
export interface EqualsFilter {
  dimension: DimString;
  operator: 'equals';
  values: string[];        // multi-select – 1 or more values
}

type DateRange = [Date, Date] | null;

/* ────────── zustand store ────────── */
interface FiltersState {
  /* string filters */
  equalsFilters: EqualsFilter[];

  /* date ranges keyed by dimension name */
  dateRanges: Partial<Record<DimDate, DateRange>>;

  /* setters */
  setEqualsFilter: (dimension: DimString, values: string[]) => void;
  clearEqualsFilter: (dimension: DimString) => void;

  setDateRange: (dimension: DimDate, range: DateRange) => void;
  clearDateRange: (dimension: DimDate) => void;

  clearAll: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  equalsFilters: [],
  dateRanges: {},

  setEqualsFilter: (dim, values) =>
    set((state) => {
      const others = state.equalsFilters.filter((f) => f.dimension !== dim);
      return values.length
        ? { equalsFilters: [...others, { dimension: dim, operator: 'equals', values }] }
        : { equalsFilters: others };
    }),

  clearEqualsFilter: (dim) =>
    set((state) => ({
      equalsFilters: state.equalsFilters.filter((f) => f.dimension !== dim),
    })),

  setDateRange: (dim, range) =>
    set((state) => ({
      dateRanges: { ...state.dateRanges, [dim]: range },
    })),

  clearDateRange: (dim) =>
    set((state) => {
      const { [dim]: _, ...rest } = state.dateRanges;
      return { dateRanges: rest };
    }),

  clearAll: () => set({ equalsFilters: [], dateRanges: {} }),
}));
