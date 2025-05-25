import React, { useMemo } from 'react';
import { useFiltersStore } from '../stores/useFiltersStore';
import { MultiSelect, Button, Flex } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { useCubeQuery } from '@cubejs-client/react';
import '@mantine/dates/styles.css';
import { buildQuery } from '../utils/buildQuery';

const GlobalFilterBar: React.FC = () => {
  const {
    filters,
    dateRanges,
    setFilter,
    removeFilter,
    setDateRange,
    clearAll,
  } = useFiltersStore();

  // Date range state for 'SupplierIncomes.date'
  const periodRange = dateRanges['SupplierIncomes.date'];
  const [periodFrom, periodTo] = (periodRange ?? [null, null]) as [
    Date | null,
    Date | null,
  ];

  // Warehouse query (excluding its own filter)
  const whQuery = useMemo(
    () => ({
      dimensions: ['SupplierIncomes.warehouseName'] as const,
      measures: ['SupplierIncomes.count'] as const,
      order: { 'SupplierIncomes.warehouseName': 'asc' } as const,
      ...buildQuery(['SupplierIncomes.warehouseName']),
    }),
    [filters, dateRanges],
  );
  const { resultSet: whRs } = useCubeQuery(whQuery);
  const warehouses = useMemo(
    () => whRs?.tablePivot().map((r: any) => r['SupplierIncomes.warehouseName']) ?? [],
    [whRs],
  );
  const whSel =
    filters.find((f) => f.dimension === 'SupplierIncomes.warehouseName')?.values ?? [];

  // Article query (excluding its own filter)
  const artQuery = useMemo(
    () => ({
      dimensions: ['SupplierIncomes.supplierArticle'] as const,
      measures: ['SupplierIncomes.count'] as const,
      order: { 'SupplierIncomes.supplierArticle': 'asc' } as const,
      ...buildQuery(['SupplierIncomes.supplierArticle']),
    }),
    [filters, dateRanges],
  );
  const { resultSet: artRs } = useCubeQuery(artQuery);
  const articles = useMemo(
    () => artRs?.tablePivot().map((r: any) => r['SupplierIncomes.supplierArticle']) ?? [],
    [artRs],
  );
  const artSel =
    filters.find((f) => f.dimension === 'SupplierIncomes.supplierArticle')?.values ?? [];

  return (
    <Flex align="center" gap="sm" wrap="wrap" py="xs" style={{ width: '100%' }}>
      {/* Date range picker */}
      <DatePickerInput<'range'>
        type="range"
        size="sm"
        label="Дата"
        placeholder="Выберите период"
        value={periodFrom && periodTo ? ([periodFrom, periodTo] as [Date, Date]) : undefined}
        onChange={(val) => {
          if (Array.isArray(val) && val[0] && val[1]) {
            setDateRange('SupplierIncomes.date', [new Date(val[0]), new Date(val[1])]);
          } else {
            setDateRange('SupplierIncomes.date', null);
          }
        }}
        clearable
        style={{ flex: 1, minWidth: 220 }}
      />

      {/* Warehouse filter */}
      <MultiSelect
        size="sm"
        label="Склад"
        placeholder="Все"
        data={warehouses}
        searchable
        clearable
        value={whSel}
        onChange={(v) =>
          v.length
            ? setFilter({
                dimension: 'SupplierIncomes.warehouseName',
                operator: 'equals',
                values: v,
              })
            : removeFilter('SupplierIncomes.warehouseName')
        }
        style={{ flex: 1, minWidth: 200 }}
      />

      {/* Article filter */}
      <MultiSelect
        size="sm"
        label="Артикул"
        placeholder="Все"
        data={articles}
        searchable
        clearable
        value={artSel}
        onChange={(v) =>
          v.length
            ? setFilter({
                dimension: 'SupplierIncomes.supplierArticle',
                operator: 'equals',
                values: v,
              })
            : removeFilter('SupplierIncomes.supplierArticle')
        }
        style={{ flex: 1, minWidth: 200 }}
      />

      {/* Clear all filters */}
      {(filters.length > 0 || dateRanges['SupplierIncomes.date'] !== null) && (
        <Button
          variant="light"
          size="sm"
          onClick={clearAll}
          leftSection={<IconX size={14} />}
          style={{ flex: 'none' }}
        >
          Сбросить
        </Button>
      )}
    </Flex>
  );
};

export default GlobalFilterBar;