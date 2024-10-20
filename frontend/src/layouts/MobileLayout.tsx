import React, { useState } from 'react';
import MobileHeader from '../components/MobileHeader';
import Footer from '../components/Footer';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <MobileHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MobileLayout;