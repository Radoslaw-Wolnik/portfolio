// src/layouts/LandingPageLayout.tsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface LandingPageLayoutProps {
  children: React.ReactNode;
}

const LandingPageLayout: React.FC<LandingPageLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPageLayout;