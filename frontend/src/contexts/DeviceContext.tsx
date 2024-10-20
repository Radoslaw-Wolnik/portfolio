// src/contexts/DeviceContext.tsx
import React, { createContext, useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'desktop';

interface DeviceContextType {
  deviceType: DeviceType;
}

export const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DeviceContext.Provider value={{ deviceType }}>
      {children}
    </DeviceContext.Provider>
  );
};