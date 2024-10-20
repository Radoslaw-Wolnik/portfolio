// src/layouts/MobileLayout.tsx
import React from 'react';
import MobileHeader from '@components/MobileHeader';
import Footer from '@components/Footer';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <MobileHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MobileLayout;