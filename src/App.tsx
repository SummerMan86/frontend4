import React from 'react';
import { CubeProvider } from '@cubejs-client/react';
import cubeApi from './utils/cubeApi';
import CubeConnectionTest from './components/CubeConnectionTest';
import ManualConnectionTest from './components/ManualConnectionTest';
import SupplierIncomesTableAG from './components/SupplierIncomesTableAG';

function App() {
  return (
    <div className="App"> 
      <CubeProvider cubeApi={cubeApi}>
        <SupplierIncomesTableAG />
      </CubeProvider>
    </div>
  );
}

export default App;