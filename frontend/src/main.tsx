// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import { getEnv } from './config/enviorement';

async function initApp() {
  await getEnv(); // Initialize the environment

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AuthProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}

initApp().catch(console.error);