// src/App.tsx
import React from 'react';
import { useDevice } from './hooks/useDevice';
import AppRoutes from './AppRoutes';
import TokenRefresh from './components/TokenRefresh';
import MobileLayout from './layouts/MobileLayout';
import LandingPageLayout from './layouts/LandingPageLayout';

const App: React.FC = () => {
  const { deviceType } = useDevice();
  const Layout = deviceType === 'mobile' ? MobileLayout : LandingPageLayout;

  return (
    <Layout>
      <TokenRefresh />
      <AppRoutes />
    </Layout>
  );
};

export default App;