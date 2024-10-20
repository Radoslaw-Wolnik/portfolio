// src/pages/ProjectResourceMonitoring.tsx
import React, { useState, useEffect } from 'react';
import api from '@utils/api';
import { handleApiError } from '@utils/errorHandler';
import { Project } from '@types/api';
import LoadingSpinner from '@components/LoadingSpinner';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ResourceData {
  cpu: number;
  memory: number;
  timestamp: string;
}

interface ProjectResources extends Project {
  resources: ResourceData[];
}

const ProjectResourceMonitoring: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResources[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectResources = async () => {
      try {
        const response = await api.get('/projects/resources');
        setProjects(response.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProjectResources();
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchProjectResources, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Project Resource Monitoring</h1>
      {projects.map((project) => (
        <div key={project.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">{project.name}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold mb-2">CPU Usage</h3>
              <Line 
                data={{
                  labels: project.resources.map(r => new Date(r.timestamp).toLocaleTimeString()),
                  datasets: [{
                    label: 'CPU Usage (%)',
                    data: project.resources.map(r => r.cpu),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                  }]
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Memory Usage</h3>
              <Line 
                data={{
                  labels: project.resources.map(r => new Date(r.timestamp).toLocaleTimeString()),
                  datasets: [{
                    label: 'Memory Usage (MB)',
                    data: project.resources.map(r => r.memory),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                  }]
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectResourceMonitoring;