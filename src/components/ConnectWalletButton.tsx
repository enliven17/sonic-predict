"use client";
import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setUserSonicScore } from '@/store/marketsSlice';
import { connectWallet as connectWalletAction, disconnectWallet as disconnectWalletAction } from '@/store/walletSlice';
import { sonicClient, SONIC_TESTNET_CONFIG } from '@/api/sonicClient';
import { useWalletConnection } from '@/hooks/useWalletConnection';

function shortenAddress(address: string) {
  return address.slice(0, 6) + '...' + address.slice(-4);
}

export function ConnectWalletButton() {
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const dispatch = useDispatch();
  const { address, isConnected } = useWalletConnection();

  const connectMetaMask = async () => {
    if (isConnecting) return;
    
    setError(null);
    setIsConnecting(true);
    
    try {
      const result = await sonicClient.connectWallet();
      
      if (result) {
        const { address: walletAddress, networkId } = result;
        
        // Generate or load existing Sonic score
        const existingScore = localStorage.getItem(`sonic_score_${walletAddress}`);
        let sonicScore: number;
        if (existingScore) {
          sonicScore = Number(existingScore);
        } else {
          sonicScore = Math.floor(Math.random() * 151) + 50;
          localStorage.setItem(`sonic_score_${walletAddress}`, String(sonicScore));
        }
        
        dispatch(connectWalletAction({ 
          address: walletAddress, 
          chain: 'EVM', 
          networkId 
        }));
        dispatch(setUserSonicScore({ address: walletAddress, score: sonicScore }));
      } else {
        setError('Failed to connect MetaMask wallet.');
      }
    } catch (e) {
      console.error(e);
      setError('MetaMask wallet connection failed. Please make sure MetaMask is installed and unlocked.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    if (address) {
      dispatch(setUserSonicScore({ address, score: 0 }));
      localStorage.removeItem(`sonic_score_${address}`);
    }
    dispatch(disconnectWalletAction());
    setError(null);
  };

  const closeModal = () => setError(null);

  const getNetworkName = () => {
    if (!isConnected) return '';
    return 'Sonic Testnet';
  };

  return (
    <>
      <ModernConnectButtonWrapper>
        {address ? (
          <ConnectedBox>
            <NetworkBadge>{getNetworkName()}</NetworkBadge>
            <AddressText>{shortenAddress(address)}</AddressText>
            <DisconnectButton onClick={disconnectWallet} title="Disconnect wallet">
              Disconnect
            </DisconnectButton>
          </ConnectedBox>
        ) : (
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <CustomButton onClick={connectMetaMask} disabled={isConnecting}>
              {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
            </CustomButton>
          </div>
        )}
      </ModernConnectButtonWrapper>

      {error && (
        <ModalOverlay role="dialog" aria-modal="true">
          <ModalContent>
            <ModalTitle>Wallet Connection</ModalTitle>
            <ModalMessage>{error}</ModalMessage>
            <ModalActions>
              <SecondaryButton onClick={closeModal}>Close</SecondaryButton>
              <PrimaryButton onClick={connectMetaMask}>Try Again</PrimaryButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}

const ModernConnectButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomButton = styled.button`
  min-width: 140px;
  min-height: 36px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  padding: 8px 18px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.accentGreen};
    color: #fff;
  }
  @media (max-width: 800px) {
    min-width: 110px;
    min-height: 32px;
    font-size: 0.95rem;
    padding: 6px 10px;
  }
`;

const ConnectedBox = styled.div`
  min-width: 280px;
  min-height: 36px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  @media (max-width: 800px) {
    min-width: 240px;
    padding: 6px 12px;
    gap: 8px;
  }
`;

const NetworkBadge = styled.span`
  background: ${({ theme }) => theme.colors.accentGreen};
  color: #fff;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 80px;
  text-align: center;
`;

const AddressText = styled.span`
  flex: 1;
  min-width: 0;
  text-align: center;
  font-weight: 600;
  color: #fff;
  padding: 0 8px;
  font-size: 0.95rem;
`;

const DisconnectButton = styled.button`
  background: ${({ theme }) => theme.colors.accentRed};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
  min-width: 90px;
  text-align: center;
  &:hover {
    background: #c0392b;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 24px;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.card || '#111'};
  color: ${({ theme }) => theme.colors.text || '#fff'};
  border: 1px solid ${({ theme }) => theme.colors.border || 'rgba(255,255,255,0.1)'};
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
  padding: 18px;
`;

const ModalTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.1rem;
`;

const ModalMessage = styled.p`
  margin: 0 0 16px 0;
  font-size: 0.98rem;
  line-height: 1.4;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.text || '#fff'};
  border: 1px solid ${({ theme }) => theme.colors.border || 'rgba(255,255,255,0.25)'};
  border-radius: 10px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
`;
