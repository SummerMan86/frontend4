import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useCubeQuery } from '@cubejs-client/react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Define a type for Cube.js errors
interface CubejsError extends Error {
  response?: {
    error?: string;
    stack?: string;
    requestId?: string;
    [key: string]: any;
  };
  status?: number;
}

const SupplierIncomesTableAG: React.FC = () => {
  const { resultSet, isLoading, error } = useCubeQuery(
    {
      measures: ['SupplierIncomes.count', 'SupplierIncomes.totalQuantity', 'SupplierIncomes.totalRevenue', 'SupplierIncomes.avgPrice'],
      dimensions: ['SupplierIncomes.warehouseName'],
      order: { 'SupplierIncomes.totalRevenue': 'desc' },
    }
  );

  

  if (isLoading) return <div className="flex items-center justify-center w-full h-full">Загрузка таблицы…</div>;
  if (error) return <div>Ошибка: {error.toString()}</div>;
  if (!resultSet) return <div>Нет данных</div>;

  const rowData = resultSet.tablePivot().map((row) => {
    const flat: Record<string, any> = {};
    Object.entries(row).forEach(([key, value]) => {
      flat[key.split('.').pop()!] = value;
    });
    return flat;
  });

  const columnDefs = [
    { headerName: 'Склад', field: 'warehouseName', sortable: true },
    { headerName: 'Поставки', field: 'count', sortable: true },
    { headerName: 'Товары, шт', field: 'totalQuantity', sortable: true },
    { headerName: 'Выручка', field: 'totalRevenue', sortable: true },
    { headerName: 'Средняя цена', field: 'avgPrice', sortable: true },
  ];
  console.log('rowData: ', rowData);
  console.log('columnDefs: ', columnDefs);

  return (
    <div className="ag-theme-alpine" style={{ height: '500px', width: '100%', margin: '20px 0' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          flex: 1,
          minWidth: 100,
          resizable: true
        }}
        // Tell AG Grid to use legacy CSS-based themes
        theme="legacy"
      />
    </div>
  );
};

export default SupplierIncomesTableAG;