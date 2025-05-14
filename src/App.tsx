import React from 'react';
import { CubeProvider } from '@cubejs-client/react';
import cubeApi from './utils/cubeApi';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SupplierIncomesPage from './pages/SupplierIncomesPage';
// Import other components as needed

function App() {
  return (
    <CubeProvider cubeApi={cubeApi}>
      <Router>
        <Routes>
          <Route path="/supplier-incomes" element={<SupplierIncomesPage />} />
          {/* Other routes */}
        </Routes>
      </Router>
    </CubeProvider>
  );
}

export default App;