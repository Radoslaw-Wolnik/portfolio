// src/contexts/EnvironmentContext.tsx
import React, { createContext, ReactNode } from 'react';
import { Environment } from '../config/environment';

export const EnvironmentContext = createContext<Environment | null>(null);

interface EnvironmentProviderProps {
  children: ReactNode;
  env: Environment;
}

export const EnvironmentProvider: React.FC<EnvironmentProviderProps> = ({ children, env }) => {
  return (
    <EnvironmentContext.Provider value={env}>
      {children}
    </EnvironmentContext.Provider>
  );
};