// src/pages/UserEditAdmin.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { handleApiError } from '../utils/errorHandler';
import LoadingSpinner from '../components/LoadingSpinner';

const UserEditAdmin: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setRole(response.data.role);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/users/${id}`, { username, email, role });
      navigate('/admin/users');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="role" className="block mb-1">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-primary-500 text-white py-2 rounded hover:bg-primary-600">
          Update User
        </button>
      </form>
    </div>
  );
};

export default UserEditAdmin;
