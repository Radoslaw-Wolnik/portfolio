// src/pages/ProjectManagement.tsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { handleApiError } from '../utils/errorHandler';

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ name: '', description: '', gitUrl: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', handleApiError(error));
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setNewProject({ name: '', description: '', gitUrl: '' });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', handleApiError(error));
    }
  };

  const handleProjectAction = async (projectId: string, action: 'deploy' | 'stop' | 'freeze' | 'unfreeze') => {
    try {
      await api.post(`/projects/${projectId}/${action}`);
      fetchProjects();
    } catch (error) {
      console.error(`Error ${action}ing project:`, handleApiError(error));
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Project Management</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              rows={3}
              required
            />
          </div>
          <div>
            <label htmlFor="gitUrl" className="block text-sm font-medium text-gray-700">Git URL</label>
            <input
              type="url"
              id="gitUrl"
              value={newProject.gitUrl}
              onChange={(e) => setNewProject({ ...newProject, gitUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
          >
            Create Project
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Existing Projects</h2>
        <ul className="space-y-4">
          {projects.map(project => (
            <li key={project.id} className="bg-white shadow rounded p-4">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <p className="text-gray-600">{project.description}</p>
              <p className="text-sm text-gray-500 mt-2">Status: {project.status}</p>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => handleProjectAction(project.id, 'deploy')}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Deploy
                </button>
                <button
                  onClick={() => handleProjectAction(project.id, 'stop')}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Stop
                </button>
                <button
                  onClick={() => handleProjectAction(project.id, project.status === 'frozen' ? 'unfreeze' : 'freeze')}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {project.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ProjectManagement;