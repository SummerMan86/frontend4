import React from 'react';
import { CubeProvider } from '@cubejs-client/react';
import cubeApi from './utils/cubeApi';
import CubeConnectionTest from './components/CubeConnectionTest';
import ManualConnectionTest from './components/ManualConnectionTest';
import SupplierIncomesDashboard from './components/SupplierIncomesDashboard';

function App() {
  return (
    <div className="App">
      <h1>Cube.js Dashboard</h1>
      
      {/* Manual test with custom inputs */}
      <ManualConnectionTest />
      
      <hr />
      
      {/* Automatic test using configured API */}
      <CubeConnectionTest />
      
      <hr />
      
      <h2>Dashboard (will only work if connection is successful)</h2>
      <CubeProvider cubeApi={cubeApi}>
        <SupplierIncomesDashboard />
      </CubeProvider>
    </div>
  );
}

export default App;