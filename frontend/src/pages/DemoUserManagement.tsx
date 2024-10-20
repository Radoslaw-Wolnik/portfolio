// src/pages/DemoUserManagement.tsx
import React, { useState, useEffect } from 'react';
import api from '@utils/api';
import { handleApiError } from '@utils/errorHandler';
import LoadingSpinner from '@components/LoadingSpinner';

const DemoUserManagement: React.FC = () => {
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ username: '', password: '', projectId: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, projectsResponse] = await Promise.all([
          api.get('/demo-users'),
          api.get('/projects')
        ]);
        setDemoUsers(usersResponse.data);
        setProjects(projectsResponse.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/demo-users', newUser);
      setDemoUsers([...demoUsers, response.data]);
      setNewUser({ username: '', password: '', projectId: '' });
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/demo-users/${userId}`);
      setDemoUsers(demoUsers.filter(user => user.id !== userId));
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Demo User Management</h1>
      {error && <p className="text-red-500 mb-5">{error}</p>}
      
      <h2 className="text-2xl font-semibold mb-3">Create New Demo User</h2>
      <form onSubmit={handleCreateUser} className="mb-8 space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            id="username"
            value={newUser.username}
            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            id="password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="projectId" className="block mb-1">Project</label>
          <select
            id="projectId"
            value={newUser.projectId}
            onChange={(e) => setNewUser({...newUser, projectId: e.target.value})}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select a project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600">
          Create Demo User
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-3">Existing Demo Users</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {demoUsers.map(user => (
          <div key={user.id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-2">{user.username}</h3>
            <p className="text-gray-600 mb-2">Project: {projects.find(p => p.id === user.projectId)?.name || 'Unknown'}</p>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoUserManagement;