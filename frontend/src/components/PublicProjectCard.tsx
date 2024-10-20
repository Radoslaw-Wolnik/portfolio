import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { handleApiError } from '../utils/errorHandler';
import getEnv from '../config/environment';

interface ProjectCardProps {
  project: Project;
}

const PublicProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [loading, setLoading] = useState(false);
  const [projectDomain, setProjectDomain] = useState('');
  const [currentProject, setCurrentProject] = useState(project);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const loadEnvironment = async () => {
      const env = await getEnv();
      setProjectDomain(env.PROJECT_DOMAIN);
    };
    loadEnvironment();
  }, []);

  const handleProjectAction = async (action: 'deploy' | 'stop' | 'freeze' | 'unfreeze') => {
    setLoading(true);
    try {
      await api.post(`/api/projects/${currentProject.id}/${action}`);
      const updatedProject = await api.get(`/api/projects/${currentProject.id}`);
      setCurrentProject(updatedProject.data);
    } catch (error) {
      console.error(`Error ${action}ing project:`, handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const startPublicDemo = async () => {
    if (currentProject.status === 'frozen') {
      await handleProjectAction('unfreeze');
    }
    setLoading(true);
    try {
      const response = await api.post('/api/docker-sessions', {
        projectName: currentProject.name,
        username: 'public_user' // You might want to generate a unique username for each public session
      });
      setSessionId(response.data.sessionId);
      const projectUrl = `https://${currentProject.subdomain}.${projectDomain}`;
      window.open(projectUrl, '_blank');
    } catch (error) {
      console.error('Error starting public demo:', handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sessionId) {
        api.post(`/api/docker-sessions/${sessionId}/signal-exit`)
          .catch(error => console.error('Error signaling session exit:', handleApiError(error)));
      }
    };
  }, [sessionId]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{currentProject.name}</h2>
      <p className="text-gray-600 mb-4">{currentProject.description}</p>
      <p className="text-sm text-gray-500 mb-4">Status: {currentProject.status}</p>
      
      <div className="space-y-4">
        <button
          onClick={startPublicDemo}
          className="w-full bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 disabled:opacity-50"
          disabled={loading}
        >
          {currentProject.status === 'frozen' ? 'Unfreeze and Join' : 'Join'} Public Demo
        </button>

        <button 
          onClick={() => handleProjectAction(currentProject.status === 'frozen' ? 'unfreeze' : 'freeze')}
          className="w-full bg-accent-500 text-white px-4 py-2 rounded hover:bg-accent-600"
          disabled={loading}
        >
          {currentProject.status === 'frozen' ? 'Unfreeze Project' : 'Freeze Project'}
        </button>
      </div>
    </div>
  );
};

export default PublicProjectCard;