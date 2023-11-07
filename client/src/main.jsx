import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes } from './router/RouterProvider';
import { AppProvider } from './contexts/AppContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <Routes />
    </AppProvider>
  </React.StrictMode>
);
