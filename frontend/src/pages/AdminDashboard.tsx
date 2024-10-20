// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { handleApiError } from '../utils/errorHandler';

const AdminDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, blogPostsRes] = await Promise.all([
          api.get('/projects'),
          api.get('/blog-posts')
        ]);
        setProjects(projectsRes.data);
        setBlogPosts(blogPostsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', handleApiError(error));
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        <ul className="space-y-2">
          {projects.map(project => (
            <li key={project.id} className="bg-white shadow rounded p-4">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              <p className="text-gray-600">{project.description}</p>
              <p className="text-sm text-gray-500 mt-2">Status: {project.status}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Blog Posts</h2>
        <ul className="space-y-2">
          {blogPosts.map(post => (
            <li key={post.id} className="bg-white shadow rounded p-4">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-500 mt-2">
                By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;