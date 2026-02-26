import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { Toaster } from './app/components/ui/sonner';
import './styles/index.css';

// Renderizar la aplicación
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" richColors />
  </React.StrictMode>
);
