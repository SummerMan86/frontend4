import { useFiltersStore, Filter, DimensionDate } from '../stores/useFiltersStore';

/**
 * Compose parts of a Cube.js query (filters + timeDimensions) based on the
 * global filter store.  Any dimensions supplied in `exclude` are ignored so
 * that individual components can omit their own filter when fetching their
 * distinct lists.
 */
export function buildQuery(
  exclude: (Filter['dimension'] | DimensionDate)[] = []
) {
  const { filters, dateRanges } = useFiltersStore.getState();

  // equals‑filters ---------------------------------------------------------
  const eqFilters = filters.filter((f) => !exclude.includes(f.dimension));

  // timeDimensions ---------------------------------------------------------
  const timeDimensions = (Object.entries(dateRanges) as [
    DimensionDate,
    [Date, Date] | null,
  ][])
    .filter(
      (entry): entry is [DimensionDate, [Date, Date]] => {
        const [dim, range] = entry;
        return range !== null && !exclude.includes(dim);
      }
    )
    .map(([dim, [from, to]]) => ({
      dimension: dim,
      granularity: 'day' as const,
      dateRange: [
        from.toISOString().slice(0, 10),
        to.toISOString().slice(0, 10),
      ] as const,
    }));

  return {
    filters: eqFilters,
    timeDimensions,
  } as const;
}