import React, { useMemo, useCallback } from 'react';
import {
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
} from 'mantine-react-table';
import { IconSelector, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useCubeQuery } from '@cubejs-client/react';
import dayjs from 'dayjs';

// Zustand-хранилище глобальных фильтров
import { useFiltersStore, Filter } from '../stores/useFiltersStore';

// ---- Тип строки, приходящей из CubeJS
export interface SupplierIncomeRow {
    date: string;
    lastChangeDate: string;
    sid: number;
    nmId: number;
    subject: string;
    barcode: string;
    supplierArticle: string;
    size: string;
    warehouseName: string;
    quantity: number;
    price: number;
    revenue: number;
  }
  
  const baseQuery = {
    measures: [],
    dimensions: [
      'SupplierIncomes.date',
      'SupplierIncomes.lastChangeDate',
      'SupplierIncomes.sid',
      'SupplierIncomes.nmId',
      'SupplierIncomes.subject',
      'SupplierIncomes.barcode',
      'SupplierIncomes.supplierArticle',
      'SupplierIncomes.size',
      'SupplierIncomes.warehouseName',
      'SupplierIncomes.quantity',
      'SupplierIncomes.price',
      'SupplierIncomes.revenue',
    ],
    order: { 'SupplierIncomes.date': 'asc' as const },
  };
  
  /** Аккуратная таблица на MantineReactTable v2 */
  
  // --- общие отступы для ячеек
  // --- общие отступы для ячеек (заменили sx на style для совместимости типов)
  const commonPadding = { style: { padding: '4px 8px' } } as const;
  
  // --- кастомные иконки сортировки и селектора колонок
  const icons = {
    IconSortAscending: IconChevronUp,
    IconSortDescending: IconChevronDown,
    IconColumnSelector: IconSelector,
  };
  
  // --- описание колонок таблицы
  const columns: MRT_ColumnDef<SupplierIncomeRow>[] = [
    { accessorKey: 'date', header: 'Дата', mantineTableHeadCellProps: commonPadding },
    { accessorKey: 'lastChangeDate', header: 'Изменено', mantineTableHeadCellProps: commonPadding },
    { accessorKey: 'sid', header: 'SID', mantineTableHeadCellProps: commonPadding },
    { accessorKey: 'nmId', header: 'NMID', mantineTableHeadCellProps: commonPadding },
    { accessorKey: 'subject', header: 'Товар', mantineTableHeadCellProps: commonPadding },
    { accessorKey: 'barcode', header: 'Штрихкод', mantineTableHeadCellProps: commonPadding },
    { accessorKey: 'supplierArticle', header: 'Артикул', mantineTableHeadCellProps: commonPadding },
    { accessorKey: 'size', header: 'Размер', mantineTableHeadCellProps: commonPadding },
    { accessorKey: 'warehouseName', header: 'Склад', mantineTableHeadCellProps: commonPadding },
    { accessorKey: 'quantity', header: 'Количество', mantineTableHeadCellProps: commonPadding },
    { accessorKey: 'price', header: 'Цена', mantineTableHeadCellProps: commonPadding },
    { accessorKey: 'revenue', header: 'Выручка', mantineTableHeadCellProps: commonPadding },
  ];
  
  export default function SupplierIncomesTableMRT() {
    // --- глобальные фильтры из zustand
    const filters = useFiltersStore((s) => s.filters);
    const setFilter = useFiltersStore((s) => s.setFilter);
    const removeFilter = useFiltersStore((s) => s.removeFilter);
  
    // --- формируем query: добавляем filters только если они заданы
    const query = useMemo(
      () => (filters.length > 0 ? { ...baseQuery, filters } : baseQuery),
      [filters],
    );
  
    const { resultSet, isLoading, error } = useCubeQuery(
      query as any,
      { subscribe: false },
    );
  
    const data: SupplierIncomeRow[] = useMemo(() => {
      if (!resultSet) return [];
      return resultSet.tablePivot().map((r: any) => ({
        date: r['SupplierIncomes.date'],
        lastChangeDate: r['SupplierIncomes.lastChangeDate'],
        sid: Number(r['SupplierIncomes.sid']),
        nmId: Number(r['SupplierIncomes.nmId']),
        subject: r['SupplierIncomes.subject'],
        barcode: r['SupplierIncomes.barcode'],
        supplierArticle: r['SupplierIncomes.supplierArticle'],
        size: r['SupplierIncomes.size'],
        warehouseName: r['SupplierIncomes.warehouseName'],
        quantity: Number(r['SupplierIncomes.quantity']),
        price: Number(r['SupplierIncomes.price']),
        revenue: Number(r['SupplierIncomes.revenue']),
      }));
    }, [resultSet]);
  
    return (
      <MantineReactTable
        columns={columns}
        data={data}
        icons={icons}
        enableColumnResizing
        layoutMode="grid"
        mantineTableProps={{ style: { fontSize: 14 } }}
        mantineTableHeadCellProps={commonPadding}
        mantineTableBodyCellProps={commonPadding}
        initialState={{ pagination: { pageIndex: 0, pageSize: 20 } }}
        state={{ isLoading }}
      />
    );
  }
  