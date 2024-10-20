// src/providers.tsx
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DeviceProvider } from './contexts/DeviceContext';
import { EnvironmentProvider } from './contexts/EnvironmentContext';
import { BrowserRouter } from 'react-router-dom';
import getEnv, { Environment } from './config/environment';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [env, setEnv] = useState<Environment | null>(null);

  useEffect(() => {
    getEnv().then(setEnv);
  }, []);

  if (env === null) {
    // You might want to show a loading indicator here
    return null;
  }

  return (
    <EnvironmentProvider env={env}>
      <AuthProvider>
        <DeviceProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </DeviceProvider>
      </AuthProvider>
    </EnvironmentProvider>
  );
};