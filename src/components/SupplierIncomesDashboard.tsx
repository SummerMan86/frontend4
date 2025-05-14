import React from 'react';
import { useCubeQuery } from '@cubejs-client/react';

const SupplierIncomesDashboard = () => {
  console.log('step 1');
  
  const { resultSet, isLoading, error } = useCubeQuery({
    measures: ['SupplierIncomes.totalQuantity']
  });
  console.log(error);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    const errorStyle = {
      color: 'red',
      padding: '10px',
      border: '1px solid red',
      borderRadius: '4px',
      backgroundColor: '#ffebee',
    };
    return <div style={errorStyle}>Error: {error.toString()}</div>;
  }

  if (!resultSet) {
    const warningStyle = {
      color: '#856404',
      padding: '10px',
      border: '1px solid #ffeeba',
      borderRadius: '4px',
      backgroundColor: '#fff3cd',
    };
    return <div style={warningStyle}>No data available.</div>;
  }

  const data = resultSet.tablePivot();
  
  return (
    <div>
      <h2>Supplier Incomes</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default SupplierIncomesDashboard;