// src/pages/ForgotPassword.tsx
import React, { useState } from 'react';
import api from '@utils/api';
import { handleApiError } from '@utils/errorHandler';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('Password reset instructions have been sent to your email.');
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">Forgot Password</h1>
      {error && <p className="text-red-500 mb-5">{error}</p>}
      {message && <p className="text-green-500 mb-5">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-primary-500 text-white py-2 rounded hover:bg-primary-600">
          Reset Password
        </button>
      </form>
    </div>
  );
};
