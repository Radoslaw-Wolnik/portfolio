
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LandingPageLayout from './layouts/LandingPageLayout'

import HomePage from './pages/HomePage';
import About from './pages/About';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/RestPassword';
import Profile from './pages/Profile';

import ProtectedRoute from './components/ProtectedRoute';

import AudioGenerator from './pages/AudioGeneratorPage';
import PresetManagerPage from './pages/SampleManagerPage';
import CollectionPage from './pages/CollectionPage';
import CreateSamplePage from './pages/CreateSamplePage';

import AdminAddDefaultSoundPage from './pages/AdminAddDefaultSoundPage';
import AdminManagementPage from './pages/AdminManagementPage';
import TokenRefresh from './components/TokenRefresh';

import './style/All.css'
import './style/Modal.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPageLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <About /> },
      { path: '/verify-email/:token', element: <VerifyEmail /> },
      { path: '/reset-password/:token', element: <ResetPassword /> },
      {
        path: '/profile/:userId?',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      { path: '/generate', element: <ProtectedRoute><AudioGenerator /></ProtectedRoute> },
      { path: '/collections', element: <ProtectedRoute><CollectionPage /></ProtectedRoute> },
      { path: '/preset-manage', element: <ProtectedRoute><PresetManagerPage /></ProtectedRoute> },
      { path: '/create-sample', element: <ProtectedRoute><CreateSamplePage /></ProtectedRoute> },
    
      { path: '/admin/add-default-sound', element: <ProtectedRoute><AdminAddDefaultSoundPage /></ProtectedRoute> },
      { path: '/admin/manage', element: <ProtectedRoute><AdminManagementPage /></ProtectedRoute> }
    ],
  },
]);

// prev
//const App: React.FC = () => <RouterProvider router={router} />;

// now
const App: React.FC = () => (
  <>
    <TokenRefresh />
    <RouterProvider router={router} />
  </>
);

/* The normal AuthProvider context folded app look
 * const App: React.FC = () => (
 *   <AuthProvider>
 *     <TokenRefresh />
 *     <RouterProvider router={router} />
 *   </AuthProvider>
 * );
 */

export default App;
