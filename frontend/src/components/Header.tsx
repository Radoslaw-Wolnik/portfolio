// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary-500 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">My Portfolio</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-primary-200">Home</Link></li>
            <li><Link to="/blog" className="hover:text-primary-200">Blog</Link></li>
            <li><Link to="/projects" className="hover:text-primary-200">Projects</Link></li>
            {user ? (
              <>
                <li><Link to="/dashboard" className="hover:text-primary-200">Dashboard</Link></li>
                <li><button onClick={logout} className="hover:text-primary-200">Logout</button></li>
              </>
            ) : (
              <li><Link to="/login" className="hover:text-primary-200">Login</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;