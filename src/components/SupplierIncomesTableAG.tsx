/* SupplierIncomesTableAG.tsx */
import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ColDef } from 'ag-grid-community';
import { Menu, Button, Checkbox, Flex, Loader } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useCubeQuery } from '@cubejs-client/react';
import { useFiltersStore } from '../stores/useFiltersStore';
// AG Grid CSS
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './SupplierIncomesTableAG.css';

interface SupplierIncomeRow {
  sid: number;
  nmid: number;
  subject: string;
  barcode: string;
  supplierArticle: string;
  techSize: string;
  warehouseName: string;
  incomeId: number;
  date: string;
  //lastChangeDate: string;
  count: number;
  totalQuantity: number;
  totalRevenue: number;
  avgPrice: number;
}

const SupplierIncomesTableAG: React.FC = () => {
  const { filters, setFilter, removeFilter } = useFiltersStore();

  // Разделяем дату и остальные фильтры
  const dateFilter = filters.find(f => f.dimension === 'SupplierIncomes.date') as
    | { values: [string, string] }
    | undefined;
  const otherFilters = filters.filter(f => f.dimension !== 'SupplierIncomes.date');

  // Мапим в формат Cube.js
  const timeDimensions = dateFilter
    ? [
        {
          dimension: 'SupplierIncomes.date',
          // обязательно ISO-строки
          dateRange: dateFilter.values.map(v => new Date(v).toISOString()/*.slice(0,10)|*/),
          granularity: 'day' as const,
        },
      ]
    : [];
    const filtersForCube = otherFilters.map(f => ({
      member: f.dimension,          // переименовали
      operator: f.operator,
      values: f.values,
    }));



  const { resultSet, isLoading, error } = useCubeQuery({
    measures: [
      'SupplierIncomes.count',
      'SupplierIncomes.totalQuantity',
      'SupplierIncomes.totalRevenue',
      'SupplierIncomes.avgPrice',
    ],
    dimensions: [
      'SupplierIncomes.sid',
      'SupplierIncomes.nmid',
      'SupplierIncomes.subject',
      'SupplierIncomes.barcode',
      'SupplierIncomes.supplierArticle',
      'SupplierIncomes.techSize',
      'SupplierIncomes.warehouseName',
      'SupplierIncomes.incomeId',
    ],
    timeDimensions: timeDimensions as any,
    order: { 'SupplierIncomes.date': 'asc' },
    filters: filtersForCube as any,
  });

  const rowData = useMemo<SupplierIncomeRow[]>(() => {
    if (!resultSet) return [];
    return resultSet.rawData().map(row => ({
      sid: row['SupplierIncomes.sid'] != null ? Number(row['SupplierIncomes.sid']) : 0,
      nmid: row['SupplierIncomes.nmid'] != null ? Number(row['SupplierIncomes.nmid']) : 0,
      subject: row['SupplierIncomes.subject'] != null ? String(row['SupplierIncomes.subject']) : '',
      barcode: row['SupplierIncomes.barcode'] != null ? String(row['SupplierIncomes.barcode']) : '',
      supplierArticle: row['SupplierIncomes.supplierArticle'] != null ? String(row['SupplierIncomes.supplierArticle']) : '',
      techSize: row['SupplierIncomes.techSize'] != null ? String(row['SupplierIncomes.techSize']) : '',
      warehouseName: row['SupplierIncomes.warehouseName'] != null ? String(row['SupplierIncomes.warehouseName']) : '',
      incomeId: row['SupplierIncomes.incomeId'] != null ? Number(row['SupplierIncomes.incomeId']) : 0,
      date: row['SupplierIncomes.date'] != null ? String(row['SupplierIncomes.date']) : '',
      count: row['SupplierIncomes.count'] != null ? Number(row['SupplierIncomes.count']) : 0,
      totalQuantity: row['SupplierIncomes.totalQuantity'] != null ? Number(row['SupplierIncomes.totalQuantity']) : 0,
      totalRevenue: row['SupplierIncomes.totalRevenue'] != null ? Number(row['SupplierIncomes.totalRevenue']) : 0,
      avgPrice: row['SupplierIncomes.avgPrice'] != null ? Number(row['SupplierIncomes.avgPrice']) : 0,
    }));
  }, [resultSet]);

  // Форматтеры
  const currencyFormatter = (params: any) =>
    params.value != null
      ? (params.value as number).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '';
  const formatDate = (value: string) => (value ? new Date(value).toLocaleDateString('ru-RU') : '');
  const formatDateTime = (value: string) => (value ? new Date(value).toLocaleString('ru-RU') : '');

  const allColumns: ColDef<SupplierIncomeRow>[] = useMemo(
    () => [
      { field: 'date', headerName: 'Дата', filter: 'agDateColumnFilter', valueFormatter: ({ value }) => formatDate(value) },
      //{ field: 'lastChangeDate', headerName: 'Изменено', filter: 'agDateColumnFilter', valueFormatter: ({ value }) => formatDateTime(value) },
      { field: 'sid', headerName: 'SID' },
      { field: 'nmid', headerName: 'NMID' },
      { field: 'subject', headerName: 'Товар' },
      { field: 'barcode', headerName: 'Штрихкод' },
      { field: 'supplierArticle', headerName: 'Артикул' },
      { field: 'techSize', headerName: 'Размер' },
      { field: 'warehouseName', headerName: 'Склад' },
      { field: 'incomeId', headerName: 'ID операции' },
      { field: 'count', headerName: 'Кол-во' },
      { field: 'totalQuantity', headerName: 'Общее кол-во' },
      { field: 'totalRevenue', headerName: 'Выручка', valueFormatter: currencyFormatter },
      { field: 'avgPrice', headerName: 'Средняя цена', valueFormatter: currencyFormatter },
    ],
    []
  );

  const [selectedFields, setSelectedFields] = useState<(keyof SupplierIncomeRow)[]>(
    allColumns.map(c => c.field as keyof SupplierIncomeRow)
  );
  const toggleField = (field: keyof SupplierIncomeRow) =>
    setSelectedFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  const visibleColumns = useMemo(
    () => allColumns.filter(c => selectedFields.includes(c.field as keyof SupplierIncomeRow)),
    [allColumns, selectedFields]
  );

  const defaultColDef = useMemo<ColDef<SupplierIncomeRow>>(
    () => ({ flex: 1, minWidth: 100, sortable: true, filter: true }),
    []
  );

  if (isLoading) return <Loader size="sm" />;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <Flex direction="column" gap="sm">
      {/* Меню колонок */}
      <Flex justify="flex-end">
        <Menu withinPortal position="bottom-end">
          <Menu.Target>
            <Button leftSection={<IconSettings size={14} />} size="xs">
              Колонки
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {allColumns.map(col => (
              <Menu.Item
                key={col.field}
                closeMenuOnClick={false}
                onClick={() => toggleField(col.field as keyof SupplierIncomeRow)}
                rightSection={<Checkbox checked={selectedFields.includes(col.field as keyof SupplierIncomeRow)} tabIndex={-1} styles={{ input: { pointerEvents: 'none' } }} />}
              >
                {col.headerName}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Flex>

      {/* Таблица */}
      <div className="ag-theme-alpine mantine-ag-grid" style={{ height: '600px' }}>
        <AgGridReact<SupplierIncomeRow>
          modules={[AllCommunityModule]}
          gridOptions={{ theme: 'legacy' }}
          rowData={rowData}
          columnDefs={visibleColumns}
          defaultColDef={defaultColDef}
          animateRows
          onCellClicked={params => {
            if (params.colDef.field === 'warehouseName' && params.value) {
              const value = params.value ? String(params.value) : '';
              const existing = filters.find(f => f.dimension === 'SupplierIncomes.warehouseName' && f.values?.[0] === value);
              console.log(existing);
              if (existing?.values.length === 1) {
                console.log('Removing filter');
                console.log('existing: ', existing);
                removeFilter('SupplierIncomes.warehouseName');
              }
              else {
                setFilter({ dimension: 'SupplierIncomes.warehouseName', operator: 'equals', values: [String(params.value)] } as any);
              }
            }
          }}
        />
      </div>
    </Flex>
  );
};

export default SupplierIncomesTableAG;