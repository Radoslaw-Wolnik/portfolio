// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Me</h3>
            <p className="text-secondary-300">
              I&apos;m a passionate full-stack developer creating innovative web solutions. 
              My portfolio showcases my projects and thoughts on web development.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-secondary-300 hover:text-white">Home</Link></li>
              <li><Link to="/projects" className="text-secondary-300 hover:text-white">Projects</Link></li>
              <li><Link to="/blog" className="text-secondary-300 hover:text-white">Blog</Link></li>
              <li><Link to="/contact" className="text-secondary-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Latest Blog Posts</h3>
            <ul className="space-y-2">
              {/* You can fetch and display actual blog post titles here */}
              <li><Link to="/blog/1" className="text-secondary-300 hover:text-white">Understanding React Hooks</Link></li>
              <li><Link to="/blog/2" className="text-secondary-300 hover:text-white">Building Scalable Node.js Apps</Link></li>
              <li><Link to="/blog/3" className="text-secondary-300 hover:text-white">The Future of Web Development</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-secondary-300 hover:text-white">
                <FaGithub size={24} />
              </a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-secondary-300 hover:text-white">
                <FaLinkedin size={24} />
              </a>
              <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-secondary-300 hover:text-white">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-secondary-700 text-center">
          <p className="text-secondary-400">
            © {new Date().getFullYear()} Your Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;