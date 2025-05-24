// src/components/GlobalFilterBar.tsx
import React, { useMemo } from 'react';
import { Flex, Box, MultiSelect, Button } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconX } from '@tabler/icons-react';
import { useCubeQuery } from '@cubejs-client/react';

import { useFiltersStore, DimDate } from '../stores/useFiltersStore';
import { buildQuery } from '../utils/buildQuery';

import '@mantine/dates/styles.css';

/* ------------------------------------------------------------------ */
/*  local aliases – keep literals in one place                        */
/* ------------------------------------------------------------------ */
type EqualsDim =
  | 'SupplierIncomes.warehouseName'
  | 'SupplierIncomes.subject'
  | 'SupplierIncomes.supplierArticle';

const WAREHOUSE_DIM: EqualsDim = 'SupplierIncomes.warehouseName';
const SUBJECT_DIM:   EqualsDim = 'SupplierIncomes.subject';
const DATE_DIM:      DimDate   = 'SupplierIncomes.date';

/* ------------------------------------------------------------------ */
/*  helper                                                            */
/* ------------------------------------------------------------------ */
const toDate = (v: Date | string | null): Date | null =>
  v instanceof Date ? v : v ? new Date(v) : null;

const extractStrings = (rs: any, field: string): string[] =>
  rs?.tablePivot()
      .map((r: any) => r[field] as string | null)
      .filter(Boolean) as string[] ?? [];

/* ================================================================== */
/*  Component                                                         */
/* ================================================================== */
const GlobalFilterBar: React.FC = () => {
  /* ---------- store ---------- */
  const {
    equalsFilters,
    dateRanges,
    setEqualsFilter,
    setDateRange,
    clearAll,
  } = useFiltersStore();

  /* ---------- selections ---------- */
  const whSelected   = equalsFilters.find((f) => f.dimension === WAREHOUSE_DIM)?.values ?? [];
  const subjSelected = equalsFilters.find((f) => f.dimension === SUBJECT_DIM)?.values ?? [];

  const range       = dateRanges[DATE_DIM] ?? null;   // [Date,Date] | null
  const from        = range?.[0] ?? null;
  const to          = range?.[1] ?? null;

  /* ---------- cube helpers ---------- */
  const { resultSet: whRs } = useCubeQuery({
    dimensions: [WAREHOUSE_DIM],
    order:      { [WAREHOUSE_DIM]: 'asc' },
    ...buildQuery([WAREHOUSE_DIM]),
  });
  const warehouses = useMemo(
    () => extractStrings(whRs, WAREHOUSE_DIM),
    [whRs],
  );

  const { resultSet: subjRs } = useCubeQuery({
    dimensions: [SUBJECT_DIM],
    order:      { [SUBJECT_DIM]: 'asc' },
    ...buildQuery([SUBJECT_DIM]),
  });
  const subjects = useMemo(
    () => extractStrings(subjRs, SUBJECT_DIM),
    [subjRs],
  );

  /* ---------- render ---------- */
  return (
    <Flex align="center" gap="sm" wrap="wrap" py="xs" style={{ width: '100%' }}>
      {/* date from */}
      <Box style={{ flex: 1, minWidth: 150 }}>
        <DatePickerInput
          size="sm"
          label="Дата с"
          placeholder="Начало"
          value={from}
          clearable
          onChange={(val) => {
            const d = toDate(val);
            if (!d) {
              // clear “from”
              to ? setDateRange(DATE_DIM, [to, to]) : setDateRange(DATE_DIM, null);
            } else {
              setDateRange(DATE_DIM, [d, to ?? d]);
            }
          }}
        />
      </Box>

      {/* date to */}
      <Box style={{ flex: 1, minWidth: 150 }}>
        <DatePickerInput
          size="sm"
          label="Дата по"
          placeholder="Конец"
          value={to}
          clearable
          onChange={(val) => {
            const d = toDate(val);
            if (!d) {
              // clear “to”
              from ? setDateRange(DATE_DIM, [from, from]) : setDateRange(DATE_DIM, null);
            } else {
              setDateRange(DATE_DIM, [from ?? d, d]);
            }
          }}
        />
      </Box>

      {/* warehouse */}
      <Box style={{ flex: 1, minWidth: 200 }}>
        <MultiSelect
          size="sm"
          label="Склад"
          placeholder="Все"
          data={warehouses}
          searchable
          clearable
          //noOptionsMessage="Не найдено"
          value={whSelected}
          onChange={(vals) => setEqualsFilter(WAREHOUSE_DIM, vals)}
        />
      </Box>

      {/* subject / article */}
      <Box style={{ flex: 1, minWidth: 200 }}>
        <MultiSelect
          size="sm"
          label="Артикул"
          placeholder="Все"
          data={subjects}
          searchable
          clearable
          //noOptionsMessage="Не найдено"
          value={subjSelected}
          onChange={(vals) => setEqualsFilter(SUBJECT_DIM, vals)}
        />
      </Box>

      {/* reset */}
      {(equalsFilters.length || Object.keys(dateRanges).length) && (
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
