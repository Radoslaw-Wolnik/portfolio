// src/pages/EmailVerification.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@utils/api';
import { handleApiError } from '@utils/errorHandler';
import LoadingSpinner from '@components/LoadingSpinner';

const EmailVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.post('/auth/verify-email', { token });
        setSuccess(true);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      {success ? (
        <>
          <h1 className="text-3xl font-bold mb-5 text-green-600">Email Verified</h1>
          <p className="mb-5">Your email has been successfully verified.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600"
          >
            Proceed to Login
          </button>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-5 text-red-600">Verification Failed</h1>
          <p className="text-red-500 mb-5">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600"
          >
            Return to Home
          </button>
        </>
      )}
    </div>
  );
};

export default EmailVerification;