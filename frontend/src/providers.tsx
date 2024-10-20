// src/providers.tsx
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { DeviceProvider } from '@/contexts/DeviceContext';
import { BrowserRouter } from 'react-router-dom';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    <DeviceProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </DeviceProvider>
  </AuthProvider>
);