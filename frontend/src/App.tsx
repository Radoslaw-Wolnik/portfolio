// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthContext';
import { useAuth } from '@hooks/useAuth';
import TokenRefresh from '@components/TokenRefresh';
import ProtectedRoute from '@components/ProtectedRoute';

// Layouts
import LandingPageLayout from '@layouts/LandingPageLayout';

// Public Pages
import HomePage from '@pages/HomePage';
import BlogPostList from '@pages/BlogPostList';
import BlogPost from '@pages/BlogPost';
import BlogSearchResults from '@pages/BlogSearchResults';
import ProjectsPage from '@pages/ProjectsPage';
import Login from '@pages/Login';

// Protected Pages
import UserProfile from '@pages/UserProfile';

// Admin Pages
import AdminDashboard from '@pages/AdminDashboard';
import BlogPostEditor from '@pages/BlogPostEditor';
import ProjectManagement from '@pages/ProjectManagement';
import UserListAdmin from '@pages/UserListAdmin';
import UserEditAdmin from '@pages/UserEditAdmin';
import SiteSettingsAdmin from '@pages/SiteSettingsAdmin';
import ProjectDeploymentStatus from '@pages/ProjectDeploymentStatus';
import ProjectResourceMonitoring from '@pages/ProjectResourceMonitoring';
import DemoUserManagement from '@pages/DemoUserManagement';

const AuthenticatedApp: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <TokenRefresh />;
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AuthenticatedApp />
        <Routes>
          <Route element={<LandingPageLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPostList />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/blog/search" element={<BlogSearchResults />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/verify-email/:token" element={<EmailVerificationPage />} />

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
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;