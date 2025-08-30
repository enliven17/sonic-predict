import { ethers } from 'ethers';

// Sonic testnet network configuration
export const SONIC_TESTNET_CONFIG = {
  chainId: 14601,
  chainName: 'Sonic Testnet',
  rpcUrl: 'https://rpc.testnet.soniclabs.com',
  explorerUrl: 'https://testnet.sonicscan.org',
  currencySymbol: 'S',
  faucetUrl: 'https://testnet.soniclabs.com/account'
};

// Sonic mainnet network configuration
export const SONIC_MAINNET_CONFIG = {
  chainId: 146,
  chainName: 'Sonic',
  rpcUrl: 'https://rpc.soniclabs.com',
  explorerUrl: 'https://sonicscan.org',
  currencySymbol: 'S'
};

export class SonicClient {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            // User disconnected wallet
            this.signer = null;
          } else {
            // User switched accounts
            this.getSigner();
          }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId: string) => {
          const networkId = parseInt(chainId, 16);
          console.log('Network changed to:', networkId);
        });

      } catch (error) {
        console.error('Failed to initialize provider:', error);
      }
    }
  }

  async connectWallet(): Promise<{ address: string; networkId: number } | null> {
    if (!this.provider) {
      throw new Error('MetaMask not detected');
    }

    try {
      // Request account access
      const accounts = await this.provider.send('eth_requestAccounts', []);
      const address = accounts[0];

      // Get network info
      const network = await this.provider.getNetwork();
      const networkId = Number(network.chainId);

      // Check if we're on Sonic network
      if (networkId !== SONIC_TESTNET_CONFIG.chainId && networkId !== SONIC_MAINNET_CONFIG.chainId) {
        // Prompt user to switch to Sonic testnet
        await this.switchToSonicTestnet();
        return { address, networkId: SONIC_TESTNET_CONFIG.chainId };
      }

      this.signer = await this.provider.getSigner();
      return { address, networkId };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return null;
    }
  }

  async switchToSonicTestnet(): Promise<boolean> {
    if (!this.provider) return false;

    try {
      await this.provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${SONIC_TESTNET_CONFIG.chainId.toString(16)}` }
      ]);
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await this.provider.send('wallet_addEthereumChain', [
            {
              chainId: `0x${SONIC_TESTNET_CONFIG.chainId.toString(16)}`,
              chainName: SONIC_TESTNET_CONFIG.chainName,
              rpcUrls: [SONIC_TESTNET_CONFIG.rpcUrl],
              blockExplorerUrls: [SONIC_TESTNET_CONFIG.explorerUrl],
              nativeCurrency: {
                name: 'Sonic',
                symbol: SONIC_TESTNET_CONFIG.currencySymbol,
                decimals: 18
              }
            }
          ]);
          return true;
        } catch (addError) {
          console.error('Failed to add Sonic testnet to MetaMask:', addError);
          return false;
        }
      }
      return false;
    }
  }

  async getSigner(): Promise<ethers.JsonRpcSigner | null> {
    if (!this.provider) return null;
    
    if (!this.signer) {
      this.signer = await this.provider.getSigner();
    }
    
    return this.signer;
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async sendTransaction(transaction: ethers.TransactionRequest): Promise<ethers.TransactionResponse> {
    const signer = await this.getSigner();
    if (!signer) throw new Error('Signer not available');
    
    return await signer.sendTransaction(transaction);
  }

  async signMessage(message: string): Promise<string> {
    const signer = await this.getSigner();
    if (!signer) throw new Error('Signer not available');
    
    return await signer.signMessage(message);
  }

  async getNetwork(): Promise<ethers.Network> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    return await this.provider.getNetwork();
  }

  isConnected(): boolean {
    return this.provider !== null && this.signer !== null;
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }
}

// Singleton instance
export const sonicClient = new SonicClient();
