// src/components/GlobalFilterBar.tsx
import React, { useMemo } from 'react';
import { useFiltersStore } from '../stores/useFiltersStore';
import { MultiSelect, Button, Flex, Box } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { useCubeQuery } from '@cubejs-client/react';
import '@mantine/dates/styles.css';



/**
 * GlobalFilterBar
 * -------------------------------------------------------------------------
 * Фильтры выровнены по левому краю и растягиваются вправо.
 */
const GlobalFilterBar: React.FC = () => {
    const { filters, setFilter, removeFilter, clearAll } = useFiltersStore();
    const get = (dim: string): any => (filters as any).find((f: any) => f.dimension === dim);
    const today = useMemo(() => new Date(), []);
    const periodAny = get('SupplierIncomes.date');
    const [periodFrom, periodTo] = useMemo<[Date|null, Date|null]>(() => {
      if (periodAny && periodAny.operator === 'between') {
        const [from, to] = periodAny.values as [string, string];
        return [new Date(from), new Date(to)];
      }
      return [null, today];
    }, [periodAny, today]);
  
    // distinct warehouses
    const { resultSet: whRs } = useCubeQuery({
      dimensions: ['SupplierIncomes.warehouseName'],
      measures: ['SupplierIncomes.count'],
      order: { 'SupplierIncomes.warehouseName': 'asc' },
      filters: (filters as any[]).filter((f) => f.dimension !== 'SupplierIncomes.warehouseName'),
      limit: 5000,
    });
    const warehouses = useMemo(() => whRs?.tablePivot().map((r:any) => r['SupplierIncomes.warehouseName']) ?? [], [whRs]);
  
    // distinct articles
    const { resultSet: artRs } = useCubeQuery({
      dimensions: ['SupplierIncomes.supplierArticle'],
      measures: ['SupplierIncomes.count'],
      order: { 'SupplierIncomes.supplierArticle': 'asc' },
      filters: (filters as any[]).filter((f) => f.dimension !== 'SupplierIncomes.supplierArticle'),
      limit: 5000,
    });
    const articles = useMemo(() => artRs?.tablePivot().map((r:any) => r['SupplierIncomes.supplierArticle']) ?? [], [artRs]);
    const whSel = (get('SupplierIncomes.warehouseName')?.values as string[]) ?? [];
    const artSel = (get('SupplierIncomes.supplierArticle')?.values as string[]) ?? [];
  
    return (
      <Flex
        align="center"
        gap="sm"
        wrap="wrap"
        py="xs"
        style={{ width: '100%' }}
      >
        {/* Даты */}
        <DatePickerInput
          size="sm"
          label="Дата с"
          placeholder="Начало"
          value={periodFrom}
          onChange={(v:any) => {            
            const from = v instanceof Date ? v : (v ? new Date(v) : null);
            console.log('from: ', from);            
            const fromNormalized = from?.toISOString();//?.slice(0,10);
            const to = periodTo || today;
            console.log('to: ', to.toISOString().slice(0,10));
            if (from) setFilter({ dimension: 'SupplierIncomes.date', operator: 'between', values: [fromNormalized, to.toISOString()/*.slice(0,10)*/] } as any);
            else removeFilter('SupplierIncomes.date');
          }}
          clearable
          style={{ flex: 1, minWidth: 150 }}
        />
        <DatePickerInput
          size="sm"
          label="Дата по"
          placeholder="Конец"
          value={periodTo}
          onChange={(v:any) => {
            const to = v as Date;
            const from = periodFrom;
            if (from && to) setFilter({ dimension: 'SupplierIncomes.date', operator: 'between', values: [from.toISOString().slice(0,10), to.toISOString().slice(0,10)] } as any);
            else if (!from && !to) removeFilter('SupplierIncomes.date');
          }}
          clearable
          style={{ flex: 1, minWidth: 150 }}
        />
  
        {/* Склад */}
        <MultiSelect
          size="sm"
          data={warehouses}
          label="Склад"
          placeholder="Все"
          searchable
          clearable
          value={whSel}
          onChange={(v:any) => v.length
            ? setFilter({ dimension: 'SupplierIncomes.warehouseName', operator: 'equals', values: v } as any)
            : removeFilter('SupplierIncomes.warehouseName')
          }
          style={{ flex: 1, minWidth: 200 }}
        />
  
        {/* Артикул */}
        <MultiSelect
          size="sm"
          data={articles}
          label="Артикул"
          placeholder="Все"
          searchable
          clearable
          value={artSel}
          onChange={(v:any) => v.length
            ? setFilter({ dimension: 'SupplierIncomes.supplierArticle', operator: 'equals', values: v } as any)
            : removeFilter('SupplierIncomes.supplierArticle' as any)
          }
          style={{ flex: 1, minWidth: 200 }}
        />
  
        {/* Сброс */}
        {filters.length > 0 && (
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
  