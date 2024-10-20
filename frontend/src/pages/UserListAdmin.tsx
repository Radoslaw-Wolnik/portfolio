// src/pages/UserListAdmin.tsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { handleApiError } from '../utils/errorHandler';
import LoadingSpinner from '../components/LoadingSpinner';

const UserListAdmin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">User List</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                <button className="text-red-500 hover:text-red-700">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListAdmin;
