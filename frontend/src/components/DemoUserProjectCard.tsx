import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { handleApiError } from '../utils/errorHandler';
import getEnv from '../config/environment';
import { useEnvironment } from '@/hooks/useEnvironment';

interface DemoUserProjectCardProps {
  project: Project;
}

const DemoUserProjectCard: React.FC<DemoUserProjectCardProps> = ({ project }) => {
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);
  const [selectedDemoUser, setSelectedDemoUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(false);
  const { loginDemo, signalProjectExit } = useAuth();
  const env = useEnvironment();

  useEffect(() => {
    const fetchDemoUsers = async () => {
      try {
        const response = await api.get(`/api/demo-users/${project.id}`);
        setDemoUsers(response.data);
      } catch (error) {
        console.error('Error fetching demo users:', handleApiError(error));
      }
    };
    fetchDemoUsers();
  }, [project.id]);

  const startDemoUserSession = async () => {
    if (!selectedDemoUser) return;
    setLoading(true);
    try {
      await api.post(`/api/projects/${project.id}/deploy`);
      const sessionResponse = await api.post('/api/docker-sessions', {
        projectName: project.name,
        username: selectedDemoUser.username
      });
      await loginDemo(selectedDemoUser.username, 'demo_password', project.id);
      const projectUrl = `https://${project.subdomain}.${env.PROJECT_DOMAIN}`;
      const newWindow = window.open(projectUrl, '_blank');
      
      if (newWindow) {
        newWindow.addEventListener('beforeunload', async () => {
          await signalProjectExit(project.id);
          // Clean up the session
          await api.delete(`/api/docker-sessions/${sessionResponse.data.sessionId}`);
        });
      }
    } catch (error) {
      console.error('Error starting demo session:', handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{project.name}</h2>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <p className="text-sm text-gray-500 mb-4">Status: {project.status}</p>
      
      <select
        value={selectedDemoUser?.id || ''}
        onChange={(e) => setSelectedDemoUser(demoUsers.find(u => u.id === e.target.value) || null)}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">Select a demo user</option>
        {demoUsers.map(user => (
          <option key={user.id} value={user.id}>{user.username}</option>
        ))}
      </select>
      <button
        onClick={startDemoUserSession}
        className="w-full bg-secondary-500 text-white px-4 py-2 rounded hover:bg-secondary-600 disabled:opacity-50"
        disabled={!selectedDemoUser || loading}
      >
        Start Demo User Session
      </button>
    </div>
  );
};

export default DemoUserProjectCard;