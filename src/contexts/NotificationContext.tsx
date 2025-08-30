"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotificationData } from '@/components/GlobalNotification';

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationData, 'id'>) => void;
  hideNotification: () => void;
  notification: NotificationData | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationData | null>(null);

  const showNotification = useCallback((notificationData: Omit<NotificationData, 'id'>) => {
    const newNotification: NotificationData = {
      ...notificationData,
      id: Date.now().toString(),
      autoClose: notificationData.autoClose ?? true,
      duration: notificationData.duration ?? 5000, // Default 5 seconds
    };
    
    setNotification(newNotification);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const value: NotificationContextType = {
    showNotification,
    hideNotification,
    notification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
