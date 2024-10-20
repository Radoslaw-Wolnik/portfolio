// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import getEnv from './config/enviorement';
import { AppProviders } from 'providers';

async function initApp() {
  await getEnv(); // Initialize the environment

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </React.StrictMode>
  );
}

initApp().catch(console.error);