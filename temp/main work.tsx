import React from 'react';
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
);


