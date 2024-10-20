// src/layouts/MobileLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MobileHeader from '@components/MobileHeader';
import Footer from '@components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@components/LoadingSpinner';

const MobileLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MobileHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MobileLayout;
