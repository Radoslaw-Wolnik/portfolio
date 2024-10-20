// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';


// Public Pages
import HomePage from './pages/HomePage';
import BlogPostList from './pages/BlogPostList';
import BlogPost from './pages/BlogPost';
import BlogSearchResults from './pages/BlogSearchResults';
import PublicProjectPage from './pages/PublicProjectPage';
import DemoUserProjectPage from './pages/DemoUserProjectPage';
import Login from './pages/Login';

// Protected Pages
import UserProfile from './pages/UserProfile';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import BlogPostEditor from './pages/BlogPostEditor';
import ProjectManagement from './pages/ProjectManagement';
import UserListAdmin from './pages/UserListAdmin';
import UserEditAdmin from './pages/UserEditAdmin';
import SiteSettingsAdmin from './pages/SiteSettingsAdmin';
import ProjectDeploymentStatus from './pages/ProjectDeploymentStatus';
import ProjectResourceMonitoring from './pages/ProjectResourceMonitoring';
import DemoUserManagement from './pages/DemoUserManagement';


const AppRoutes: React.FC = () => (
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPostList />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/blog/search" element={<BlogSearchResults />} />
          <Route path="/public-projects" element={<PublicProjectPage />} />
          <Route path="/demo-user-projects" element={<DemoUserProjectPage />} />
          <Route path="/login" element={<Login />} />
  
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
          </Route>
  
          {/* Admin Routes */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/blog/new" element={<BlogPostEditor />} />
            <Route path="/admin/blog/edit/:id" element={<BlogPostEditor />} />
            <Route path="/admin/projects" element={<ProjectManagement />} />
            <Route path="/admin/users" element={<UserListAdmin />} />
            <Route path="/admin/users/:id" element={<UserEditAdmin />} />
            <Route path="/admin/site-settings" element={<SiteSettingsAdmin />} />
            <Route path="/admin/project-deployment" element={<ProjectDeploymentStatus />} />
            <Route path="/admin/project-monitoring" element={<ProjectResourceMonitoring />} />
            <Route path="/admin/demo-users" element={<DemoUserManagement />} />
          </Route>
        </Routes>
);

export default AppRoutes;