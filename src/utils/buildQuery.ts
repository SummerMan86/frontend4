/**
 * Convert the current filter store ➜ Cube JS query fragments
 */
import {
    useFiltersStore,
    DimString,
    DimDate,
    EqualsFilter,
  } from '../stores/useFiltersStore';
  
  export function buildQuery(exclude: (DimString | DimDate)[] = []) {
    const { equalsFilters, dateRanges } = useFiltersStore.getState();
  
    /* equals-filters (strings) */
    const filters: EqualsFilter[] = equalsFilters.filter(
      (f) => !exclude.includes(f.dimension)
    );
  
    /* date ranges ⇒ timeDimensions */
    const timeDimensions = Object.entries(dateRanges)
      .filter(
        (e): e is [DimDate, [Date, Date]] =>
          !!e[1] && !exclude.includes(e[0] as DimDate)
      )
      .map(([dimension, [from, to]]) => ({
        dimension,
        dateRange: [
          from.toISOString().slice(0, 10),
          to.toISOString().slice(0, 10),
        ] as [string, string], // <- tuple satisfies Cube types
      }));
  
    return { filters, timeDimensions };
  }
  