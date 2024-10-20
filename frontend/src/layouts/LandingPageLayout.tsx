// src/layouts/LandingPageLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/Header';
import Footer from '@components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@components/LoadingSpinner';

const LandingPageLayout: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
