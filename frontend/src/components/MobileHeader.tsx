// src/components/MobileHeader.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface MobileHeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary-500 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">My Portfolio</Link>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-3xl">
          ☰
        </button>
      </div>
      {isMenuOpen && (
        <nav className="bg-primary-600 p-4">
          <ul className="space-y-2">
            <li><Link to="/" className="block hover:text-primary-200" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/blog" className="block hover:text-primary-200" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
            <li><Link to="/projects" className="block hover:text-primary-200" onClick={() => setIsMenuOpen(false)}>Projects</Link></li>
            {user ? (
              <>
                <li><Link to="/dashboard" className="block hover:text-primary-200" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                <li><button onClick={() => { logout(); setIsMenuOpen(false); }} className="block hover:text-primary-200">Logout</button></li>
              </>
            ) : (
              <li><Link to="/login" className="block hover:text-primary-200" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default MobileHeader;