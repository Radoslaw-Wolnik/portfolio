// src/pages/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as userApi from '../api/user';
import { handleApiError } from '../utils/errorHandler';
import LoadingSpinner from '../components/LoadingSpinner';

const UserProfile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await userApi.updateProfile({ username });
      await refreshUser();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">User Profile</h1>
      {error && <p className="text-red-500 mb-5">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-primary-500 text-white py-2 rounded hover:bg-primary-600"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;