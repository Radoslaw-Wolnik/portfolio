import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { handleApiError } from '../utils/errorHandler';
import LoadingSpinner from '../components/LoadingSpinner';
import DemoUserProjectCard from '../components/DemoUserProjectCard';

const DemoUserProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', handleApiError(error));
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Demo User Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <DemoUserProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default DemoUserProjectPage;