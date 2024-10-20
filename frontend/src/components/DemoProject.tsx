// src/components/DemoProject.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import * as projectApi from '../api/project';
import * as dockerSessionApi from '../api/dockerSession';
import { handleApiError } from '@utils/errorHandler';
import getEnv from '../config/environment';

interface DemoProjectProps {
  project: Project;
}

const DemoProject: React.FC<DemoProjectProps> = ({ project }) => {
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [projectDomain, setProjectDomain] = useState('');
  const { loginDemo } = useAuth();

  useEffect(() => {
    const loadEnvironment = async () => {
      const env = await getEnv();
      setProjectDomain(env.PROJECT_DOMAIN);
    };
    loadEnvironment();
  }, []);

  const startDemo = async () => {
    setLoading(true);
    try {
      const response = await projectApi.deployProject(project.id);
      if (response.data.message === 'Project deployed successfully') {
        const sessionResponse = await dockerSessionApi.createSession(project.name, 'demo_user');
        setDemoUser(sessionResponse.data.data);
        await loginDemo(sessionResponse.data.data.username, 'demo_password', project.id);
      }
    } catch (error) {
      console.error('Error starting demo:', handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const swapUser = async (newUsername: string) => {
    if (!demoUser) return;
    setLoading(true);
    try {
      const response = await dockerSessionApi.swapUser(demoUser.id, newUsername);
      setDemoUser(response.data.data);
    } catch (error) {
      console.error('Error swapping user:', handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{project.name}</h2>
      <p className="text-gray-600 mb-4">{project.description}</p>
      
      {!demoUser ? (
        <button
          onClick={startDemo}
          disabled={loading}
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 disabled:opacity-50"
        >
          {loading ? 'Starting Demo...' : 'Start Demo'}
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-green-600">Demo active as: {demoUser.username}</p>
          <div className="flex space-x-2">
            <button
              onClick={() => swapUser('user1')}
              disabled={loading}
              className="bg-secondary-500 text-white px-4 py-2 rounded hover:bg-secondary-600 disabled:opacity-50"
            >
              Switch to User 1
            </button>
            <button
              onClick={() => swapUser('user2')}
              disabled={loading}
              className="bg-secondary-500 text-white px-4 py-2 rounded hover:bg-secondary-600 disabled:opacity-50"
            >
              Switch to User 2
            </button>
          </div>
          <a
            href={`https://${project.subdomain}.${projectDomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-accent-500 text-white px-4 py-2 rounded hover:bg-accent-600"
          >
            Open Demo
          </a>
        </div>
      )}
    </div>
  );
};

export default DemoProject;