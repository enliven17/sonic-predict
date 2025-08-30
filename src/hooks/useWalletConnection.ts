import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectWallet, disconnectWallet } from '@/store/walletSlice';
import type { RootState } from '@/store';
import { sonicClient } from '@/api/sonicClient';

// MetaMask window extension type
declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWalletConnection() {
  const dispatch = useDispatch();
  const address = useSelector((state: RootState) => state.wallet.address);
  const isConnected = useSelector((state: RootState) => state.wallet.isConnected);
  
  useEffect(() => {
    let isMounted = true;
    
    const checkWalletConnection = async () => {
      try {
        // Check if MetaMask is available
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (!isMounted) return;
          
          if (accounts && accounts.length > 0) {
            const account = accounts[0];
            
            try {
              const network = await sonicClient.getNetwork();
              const networkId = Number(network.chainId);
              
              dispatch(connectWallet({ 
                address: account, 
                chain: 'EVM', 
                networkId 
              }));
              
              // Save to localStorage for persistence
              localStorage.setItem('sonic_wallet_address', account);
              localStorage.setItem('sonic_wallet_network', networkId.toString());
              
            } catch (networkError) {
              console.warn('Network check failed, using stored network:', networkError);
              // Use stored network info if available
              const storedNetwork = localStorage.getItem('sonic_wallet_network');
              const networkId = storedNetwork ? parseInt(storedNetwork) : 14601; // Default to Sonic testnet
              
              dispatch(connectWallet({ 
                address: account, 
                chain: 'EVM', 
                networkId 
              }));
            }
          } else {
            dispatch(disconnectWallet());
            localStorage.removeItem('sonic_wallet_address');
            localStorage.removeItem('sonic_wallet_network');
          }
        } else {
          dispatch(disconnectWallet());
          localStorage.removeItem('sonic_wallet_address');
          localStorage.removeItem('sonic_wallet_network');
        }
      } catch (error) {
        if (!isMounted) return;
        console.warn('Wallet connection check failed:', error);
        dispatch(disconnectWallet());
      }
    };

    // Check if we have stored wallet info
    const storedAddress = localStorage.getItem('sonic_wallet_address');
    const storedNetwork = localStorage.getItem('sonic_wallet_network');
    
    if (storedAddress && !address) {
      // Restore wallet connection from localStorage
      const networkId = storedNetwork ? parseInt(storedNetwork) : 14601;
      dispatch(connectWallet({ 
        address: storedAddress, 
        chain: 'EVM', 
        networkId 
      }));
    }
    
    // Check current wallet connection
    checkWalletConnection();

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          dispatch(disconnectWallet());
          localStorage.removeItem('sonic_wallet_address');
          localStorage.removeItem('sonic_wallet_network');
        } else {
          const account = accounts[0];
          const networkId = storedNetwork ? parseInt(storedNetwork) : 14601;
          
          dispatch(connectWallet({ 
            address: account, 
            chain: 'EVM', 
            networkId 
          }));
          
          localStorage.setItem('sonic_wallet_address', account);
        }
      };

      const handleChainChanged = (chainId: string) => {
        const networkId = parseInt(chainId, 16);
        localStorage.setItem('sonic_wallet_network', networkId.toString());
        
        if (address) {
          dispatch(connectWallet({ 
            address, 
            chain: 'EVM', 
            networkId 
          }));
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, address]);

  return {
    address,
    isConnected,
  };
} 