/**
 * main.tsx
 * Application entry point that renders the root component
 * Created by SummerMan86 on 2025-05-14
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import global styles (if you have any)
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
// You can add your own global CSS here
import './index.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ AllCommunityModule ]);

// Render the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
/*import React from 'react';
import ReactDOM from 'react-dom/client';
// Регистрация всех Community-модулей AG Grid (включает фильтры, меню и т.д.)
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import './index.css';
import { BrowserRouter } from 'react-router-dom'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);*/