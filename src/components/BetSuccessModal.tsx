import React from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';

interface BetSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  betData: {
    side: 'yes' | 'no';
    amount: number;
    fee: number;
    totalAmount: number;
    marketTitle: string;
    treasuryTxHash: string;
  } | null;
}

export const BetSuccessModal: React.FC<BetSuccessModalProps> = ({ 
  isOpen, 
  onClose, 
  betData 
}) => {
  if (!isOpen || !betData) return null;

  const explorerUrl = `https://testnet.sonicscan.org/tx/${betData.treasuryTxHash}`;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <SuccessIcon>
            <FaCheckCircle />
          </SuccessIcon>
          <ModalTitle>Bet Placed Successfully! 🎯</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <BetDetails>
            <DetailRow>
              <DetailLabel>Market:</DetailLabel>
              <DetailValue>{betData.marketTitle}</DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Your Bet:</DetailLabel>
              <DetailValue $side={betData.side}>
                {betData.side.toUpperCase()} - {betData.amount.toFixed(4)} S
              </DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Fee:</DetailLabel>
              <DetailValue>{betData.fee.toFixed(4)} S</DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Total Paid:</DetailLabel>
              <TotalAmount>{betData.totalAmount.toFixed(4)} S</TotalAmount>
            </DetailRow>
          </BetDetails>

          <TransactionInfo>
            <TransactionLabel>Transaction Hash:</TransactionLabel>
            <TransactionHash>
              {betData.treasuryTxHash.slice(0, 10)}...{betData.treasuryTxHash.slice(-8)}
            </TransactionHash>
            <ExplorerLink href={explorerUrl} target="_blank" rel="noopener noreferrer">
              <FaExternalLinkAlt />
              View on Sonic Explorer
            </ExplorerLink>
          </TransactionInfo>

          <SuccessMessage>
            Your bet has been recorded on the Sonic blockchain! 
            You can track the transaction using the link above.
          </SuccessMessage>
        </ModalBody>

        <ModalFooter>
          <CloseModalButton onClick={onClose}>
            Close
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

const SuccessIcon = styled.div`
  color: #10b981;
  font-size: 24px;
  margin-right: 12px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
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

const BetDetails = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  font-size: 14px;
`;

const DetailValue = styled.span<{ $side?: 'yes' | 'no' }>`
  color: ${({ theme, $side }) => 
    $side === 'yes' ? '#10b981' : 
    $side === 'no' ? '#ef4444' : 
    theme.colors.text
  };
  font-weight: 600;
  font-size: 14px;
`;

const TotalAmount = styled.span`
  color: #7f5af0;
  font-weight: 700;
  font-size: 16px;
`;

const TransactionInfo = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TransactionLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 8px;
`;

const TransactionHash = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
  word-break: break-all;
`;

const ExplorerLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #7f5af0;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  padding: 8px 16px;
  border: 1px solid #7f5af0;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: #7f5af0;
    color: white;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1.5;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
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
