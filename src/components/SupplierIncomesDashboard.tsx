import React, { useEffect } from 'react';
import { useCubeQuery } from '@cubejs-client/react';

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

const SupplierIncomesDashboard = () => {
  console.log("step 1");
  
  const queryResult = useCubeQuery({
    measures: ['SupplierIncomes.count'],
    dimensions: ['SupplierIncomes.warehouseName'],
    timeDimensions: [
      {
        dimension: 'SupplierIncomes.lastChangeDate',
        granularity: 'month'
      }
    ]
  });
  
  const { resultSet, isLoading, error } = queryResult;
  
  useEffect(() => {
    // Log for debugging
    console.log("Query result:", queryResult);
    console.log("Query status:", { 
      isLoading, 
      hasError: !!error, 
      errorDetails: error,
      hasData: !!resultSet
    });
  }, [queryResult, resultSet, isLoading, error]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    // Cast error to our custom interface
    const cubejsError = error as CubejsError;
    
    return (
      <div style={{color: 'red', padding: '10px', border: '1px solid red'}}>
        <h3>Error Details:</h3>
        <p>Message: {cubejsError.message || "Unknown error"}</p>
        <p>Type: {typeof cubejsError === 'object' ? Object.prototype.toString.call(cubejsError) : typeof cubejsError}</p>
        
        {cubejsError.response && (
          <div>
            <h4>Server Error:</h4>
            <pre style={{background: '#f5f5f5', padding: '10px'}}>
              {cubejsError.response.error || JSON.stringify(cubejsError.response, null, 2)}
            </pre>
          </div>
        )}
        
        <h4>Full Error Object:</h4>
        <pre>{JSON.stringify(cubejsError, null, 2)}</pre>
      </div>
    );
  }

  if (!resultSet) {
    return <div style={{color: '#856404', padding: '10px'}}>
      No data available. This could mean your cube doesn't have any matching data.
    </div>;
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