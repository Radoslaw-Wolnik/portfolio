// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to My Portfolio</h1>
        <p className="text-xl text-gray-600">
          {user ? `Hello, ${user.username}!` : 'Hi there! I&apos;m a full-stack developer passionate about creating innovative web solutions.'}
        </p>
      </section>

      <section className="bg-primary-100 rounded-lg p-8">
        <h2 className="text-3xl font-semibold mb-4">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Replace with actual project data */}
          {[1, 2, 3].map((project) => (
            <div key={project} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Project {project}</h3>
              <p className="text-gray-600 mb-4">Brief description of the project goes here.</p>
              <Link to={`/projects/${project}`} className="text-primary-600 hover:text-primary-800">
                Learn more
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Latest Blog Posts</h2>
        <div className="space-y-6">
          {/* Replace with actual blog post data */}
          {[1, 2, 3].map((post) => (
            <div key={post} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Blog Post {post}</h3>
              <p className="text-gray-600 mb-4">Preview of the blog post content goes here...</p>
              <Link to={`/blog/${post}`} className="text-primary-600 hover:text-primary-800">
                Read more
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary-100 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-xl text-gray-600 mb-6">
          Interested in working together? Let&apos;s connect!
        </p>
        <Link
          to="/contact"
          className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition duration-300"
        >
          Contact Me
        </Link>
      </section>
    </div>
  );
};

export default HomePage;