// src/pages/ProjectDeploymentStatus.tsx
import React, { useState, useEffect } from 'react';
import api from '@utils/api';
import { handleApiError } from '@utils/errorHandler';
import LoadingSpinner from '@components/LoadingSpinner';

interface DeploymentStatus extends Project {
  deployment: 'deployed' | 'deploying' | 'failed'; // htere is no deployment status in actual project add it and functions ?
  lastDeploymentTime?: string;
}

const ProjectDeploymentStatus: React.FC = () => {
  const [projects, setProjects] = useState<DeploymentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects/deployment-status');
        setProjects(response.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchProjects, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleDeploy = async (projectId: string) => {
    try {
      await api.post(`/projects/${projectId}/deploy`);
      // Refetch projects to update status
      const response = await api.get('/projects/deployment-status');
      setProjects(response.data);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleStop = async (projectId: string) => {
    try {
      await api.post(`/projects/${projectId}/stop`);
      // Refetch projects to update status
      const response = await api.get('/projects/deployment-status');
      setProjects(response.data);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Project Deployment Status</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <p className="mb-2">
              Status: 
              <span className={`font-semibold ${
                project.deployment === 'deployed' ? 'text-green-600' :
                project.deployment === 'deploying' ? 'text-yellow-600' :
                project.deployment === 'failed' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {project.deployment.charAt(0).toUpperCase() + project.deployment.slice(1)}
              </span>
            </p>
            {project.lastDeploymentTime && (
              <p className="text-sm text-gray-500 mb-4">
                Last deployed: {new Date(project.lastDeploymentTime).toLocaleString()}
              </p>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => handleDeploy(project.id)}
                disabled={project.deployment === 'deploying'}
                className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 disabled:opacity-50"
              >
                Deploy
              </button>
              <button
                onClick={() => handleStop(project.id)}
                disabled={project.status === 'stopped'}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              >
                Stop
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDeploymentStatus;