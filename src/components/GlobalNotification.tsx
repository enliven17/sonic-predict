"use client";

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle, FaTimes, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  details?: string;
  autoClose?: boolean;
  duration?: number;
}

interface GlobalNotificationProps {
  notification: NotificationData | null;
  onClose: () => void;
}

export const GlobalNotification: React.FC<GlobalNotificationProps> = ({ 
  notification, 
  onClose 
}) => {
  useEffect(() => {
    if (notification?.autoClose && notification.duration) {
      const timer = setTimeout(() => {
        onClose();
      }, notification.duration);
      
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <FaCheckCircle style={{ color: '#10b981' }} />;
      case 'error':
        return <FaExclamationTriangle style={{ color: '#ef4444' }} />;
      case 'warning':
        return <FaExclamationTriangle style={{ color: '#f59e0b' }} />;
      case 'info':
        return <FaInfoCircle style={{ color: '#3b82f6' }} />;
      default:
        return <FaInfoCircle style={{ color: '#3b82f6' }} />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'rgba(44, 182, 125, 0.1)'; // Sonic yeşil glass
      case 'error':
        return 'rgba(242, 95, 76, 0.1)'; // Sonic kırmızı glass
      case 'warning':
        return 'rgba(255, 137, 6, 0.1)'; // Sonic turuncu glass
      case 'info':
        return 'rgba(127, 90, 240, 0.1)'; // Sonic mor glass
      default:
        return 'rgba(127, 90, 240, 0.1)';
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return 'rgba(44, 182, 125, 0.3)'; // Sonic yeşil border
      case 'error':
        return 'rgba(242, 95, 76, 0.3)'; // Sonic kırmızı border
      case 'warning':
        return 'rgba(255, 137, 6, 0.3)'; // Sonic turuncu border
      case 'info':
        return 'rgba(127, 90, 240, 0.3)'; // Sonic mor border
      default:
        return 'rgba(127, 90, 240, 0.3)';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return '#2CB67D'; // Sonic yeşil
      case 'error':
        return '#F25F4C'; // Sonic kırmızı
      case 'warning':
        return '#FF8906'; // Sonic turuncu
      case 'info':
        return '#7F5AF0'; // Sonic mor
      default:
        return '#7F5AF0';
    }
  };

  return (
    <NotificationContainer>
      <NotificationContent 
        $type={notification.type}
        $backgroundColor={getBackgroundColor()}
        $borderColor={getBorderColor()}
      >
        <NotificationIcon>
          {getIcon()}
        </NotificationIcon>
        
        <NotificationText>
          <NotificationTitle>{notification.title}</NotificationTitle>
          <NotificationMessage>{notification.message}</NotificationMessage>
          {notification.details && (
            <NotificationDetails>{notification.details}</NotificationDetails>
          )}
        </NotificationText>
        
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </NotificationContent>
    </NotificationContainer>
  );
};

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  width: 90vw;
  
  @media (max-width: 600px) {
    top: 10px;
    right: 10px;
    left: 10px;
    width: auto;
  }
`;

const NotificationContent = styled.div<{
  $type: string;
  $backgroundColor: string;
  $borderColor: string;
}>`
  background: ${({ $backgroundColor }) => $backgroundColor};
  border: 1px solid ${({ $borderColor }) => $borderColor};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  animation: slideInRight 0.3s ease-out;
  backdrop-filter: blur(20px);
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${({ $backgroundColor }) => $backgroundColor};
    border-radius: 16px 0 0 16px;
  }
`;

const NotificationIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
`;

const NotificationText = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
  line-height: 1.3;
`;

const NotificationMessage = styled.div`
  font-size: 14px;
  color: #A1A1AA;
  line-height: 1.4;
  margin-bottom: 8px;
`;

const NotificationDetails = styled.div`
  font-size: 12px;
  color: #A1A1AA;
  font-family: 'Courier New', monospace;
  background: rgba(15, 15, 35, 0.8);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  word-break: break-all;
  line-height: 1.3;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #A1A1AA;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(15, 15, 35, 0.8);
    color: #FFFFFF;
  }
`;
