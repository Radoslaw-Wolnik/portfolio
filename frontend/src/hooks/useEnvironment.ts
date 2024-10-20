// src/hooks/useEnvironment.ts
import { useContext } from 'react';
import { EnvironmentContext } from '../contexts/EnvironmentContext';

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (context === null) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
};