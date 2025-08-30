"use client";

import React from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { GlobalNotification } from './GlobalNotification';

export const GlobalNotificationWrapper: React.FC = () => {
  const { notification, hideNotification } = useNotification();

  return (
    <GlobalNotification
      notification={notification}
      onClose={hideNotification}
    />
  );
};
