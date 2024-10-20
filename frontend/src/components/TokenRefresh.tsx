import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const TokenRefresh: React.FC = () => {
  const { refreshToken } = useAuth();

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refreshToken().catch((error: Error) => {
        console.error('Failed to refresh token:', error);
      });
    }, 45 * 60 * 1000); // 45 minutes

    return () => clearInterval(refreshInterval);
  }, [refreshToken]);

  return null;
};

export default TokenRefresh;