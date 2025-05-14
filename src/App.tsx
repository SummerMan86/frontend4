import { Routes, Route } from 'react-router-dom';
import { CubeProvider } from '@cubejs-client/react';
import { MantineProvider, createTheme } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { useState } from 'react';
import cubeApi from './utils/cubeApi';
import AppLayout from './components/layout/AppLayout';
import SupplierIncomesTableAG from './components/SupplierIncomesTableAG';

// Create a theme
const theme = createTheme({
  primaryColor: 'blue',
  white: '#fff',
  black: '#1A1B1E',
});

function App() {
  // Use the user's preferred color scheme as the default
  const preferredColorScheme = useColorScheme();
  
  return (
    <MantineProvider 
      theme={theme}
      defaultColorScheme={preferredColorScheme}
    >
      <CubeProvider cubeApi={cubeApi}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<SupplierIncomesTableAG />} />
            <Route path="supplier-incomes" element={<SupplierIncomesTableAG />} />
          </Route>
        </Routes>
      </CubeProvider>
    </MantineProvider>
  );
}

export default App;