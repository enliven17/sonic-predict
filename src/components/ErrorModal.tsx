import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle, FaTimes, FaInfoCircle } from 'react-icons/fa';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: {
    title: string;
    message: string;
    type: 'user_rejected' | 'insufficient_balance' | 'network_error' | 'general';
    details?: string;
  } | null;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ 
  isOpen, 
  onClose, 
  error 
}) => {
  if (!isOpen || !error) return null;

  const getErrorIcon = () => {
    switch (error.type) {
      case 'user_rejected':
        return <FaInfoCircle style={{ color: '#f59e0b' }} />;
      case 'insufficient_balance':
        return <FaExclamationTriangle style={{ color: '#ef4444' }} />;
      case 'network_error':
        return <FaExclamationTriangle style={{ color: '#dc2626' }} />;
      default:
        return <FaExclamationTriangle style={{ color: '#ef4444' }} />;
    }
  };

  const getErrorColor = () => {
    switch (error.type) {
      case 'user_rejected':
        return '#f59e0b';
      case 'insufficient_balance':
        return '#ef4444';
      case 'network_error':
        return '#dc2626';
      default:
        return '#ef4444';
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ErrorIcon>
            {getErrorIcon()}
          </ErrorIcon>
          <ModalTitle style={{ color: getErrorColor() }}>{error.title}</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <ErrorMessage>
            {error.message}
          </ErrorMessage>
          
          {error.details && (
            <ErrorDetails>
              <DetailsLabel>Details:</DetailsLabel>
              <DetailsText>{error.details}</DetailsText>
            </ErrorDetails>
          )}

          {error.type === 'user_rejected' && (
            <HelpSection>
              <HelpTitle>💡 What happened?</HelpTitle>
              <HelpText>
                You signed the bet message but rejected the transaction to send S tokens to the treasury. 
                This means your bet was not placed and no tokens were deducted from your wallet.
              </HelpText>
              <HelpTitle>🔄 How to try again?</HelpTitle>
              <HelpText>
                Simply click the bet button again. You'll need to sign the message and approve the transaction.
              </HelpText>
            </HelpSection>
          )}

          {error.type === 'insufficient_balance' && (
            <HelpSection>
              <HelpTitle>💰 Insufficient Balance</HelpTitle>
              <HelpText>
                You don't have enough S tokens to place this bet. Please get more S tokens from the Sonic faucet.
              </HelpText>
              <FaucetLink href="https://testnet.soniclabs.com/account" target="_blank" rel="noopener noreferrer">
                Get S Tokens from Faucet
              </FaucetLink>
            </HelpSection>
          )}
        </ModalBody>

        <ModalFooter>
          <CloseModalButton onClick={onClose}>
            Got it
          </CloseModalButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.colors.border};
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
`;

const ErrorIcon = styled.div`
  font-size: 24px;
  margin-right: 12px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
`;

const ErrorDetails = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const DetailsLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailsText = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-family: 'Courier New', monospace;
  word-break: break-all;
  background: ${({ theme }) => theme.colors.card};
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const HelpSection = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const HelpTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
  margin-top: 16px;
  
  &:first-child {
    margin-top: 0;
  }
`;

const HelpText = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const FaucetLink = styled.a`
  display: inline-block;
  background: #7f5af0;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  
  &:hover {
    background: #6b46c1;
    transform: translateY(-1px);
  }
`;

const ModalFooter = styled.div`
  padding: 16px 24px 24px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: center;
`;

const CloseModalButton = styled.button`
  background: #7f5af0;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 32px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #6b46c1;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;
