/**
 * App.tsx
 * Root application component
 * Created by SummerMan86 on 2025-05-14
 */

import { StrictMode, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { AppShell } from './components/layout/AppShell';
import { useUiStore } from './stores/uiStore';
import { THEME_CONFIG } from './constants/ui';

export default function App() {
  const { colorScheme, setColorScheme } = useUiStore();
  
  // Toggle color scheme handler
  const toggleColorScheme = (value?: 'dark' | 'light') => {
    const newColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(newColorScheme);
  };
  
  // Monitor system color scheme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setColorScheme(event.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [setColorScheme]);
  
  // Handle unhandled errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
      // You could send this to an error reporting service
      useUiStore.getState().setError('An unhandled error occurred. Please refresh the page.');
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Merge theme config with user's color scheme preference
  const theme = {
    ...THEME_CONFIG,
    colorScheme
  };
  
  return (
    <StrictMode>
      <ErrorBoundary>
          <MantineProvider 
            theme={theme}
            defaultColorScheme={colorScheme}
          >
            <Notifications />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<AppShell />}>
                  {/* Dashboard routes */}
                  <Route index element={<div>Dashboard Coming Soon</div>} />
                  
                  {/* Sales routes */}
                  <Route path="sales">
                    <Route index element={<Navigate to="by-product" replace />} />
                    <Route path="by-product" element={<div>Sales by Product Coming Soon</div>} />
                    <Route path="by-region" element={<div>Sales by Region Coming Soon</div>} />
                    <Route path="trends" element={<div>Sales Trends Coming Soon</div>} />
                  </Route>
                  
                  {/* Inventory routes */}
                  <Route path="inventory">
                    <Route index element={<Navigate to="stock" replace />} />
                    <Route path="stock" element={<div>Stock Levels Coming Soon</div>} />
                    <Route path="forecast" element={<div>Forecast Coming Soon</div>} />
                  </Route>
                  
                  {/* Marketplace routes */}
                  <Route path="marketplace">
                    <Route index element={<Navigate to="competitors" replace />} />
                    <Route path="competitors" element={<div>Competitors Coming Soon</div>} />
                    <Route path="share" element={<div>Market Share Coming Soon</div>} />
                  </Route>
                  
                  {/* Supplier routes */}
                  <Route path="supplier-incomes" element={<div>Supplier Incomes Coming Soon</div>} />
                  
                  {/* Report routes */}
                  <Route path="reports">
                    <Route index element={<Navigate to="monthly" replace />} />
                    <Route path="monthly" element={<div>Monthly Reports Coming Soon</div>} />
                    <Route path="annual" element={<div>Annual Reports Coming Soon</div>} />
                    <Route path="custom" element={<div>Custom Reports Coming Soon</div>} />
                  </Route>
                  
                  {/* Settings routes */}
                  <Route path="settings" element={<div>Settings Coming Soon</div>} />
                  
                  {/* 404 catch-all */}
                  <Route path="*" element={
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                      <h2>404 - Page Not Found</h2>
                      <p>The page you are looking for does not exist.</p>
                    </div>
                  } />
                </Route>
              </Routes>
            </BrowserRouter>
          </MantineProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
/*import React from 'react';
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

export default App;*/