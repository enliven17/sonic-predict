export const SONIC_CONFIG = {
  // Sonic Testnet Configuration
  testnet: {
    chainId: 14601,
    chainName: 'Sonic Testnet',
    rpcUrl: 'https://rpc.testnet.soniclabs.com',
    explorerUrl: 'https://testnet.sonicscan.org',
    currencySymbol: 'S',
    faucetUrl: 'https://testnet.soniclabs.com/account',
    // Treasury address for collecting bet payments
    treasuryAddress: '0x1ECc97BAa9e8BbF893eE643B1a08bDd33fF7Bf12', // Your wallet address as treasury
    // Bet fee percentage (0.5% = 0.005)
    betFeePercentage: 0.005,
    // Minimum bet amount in S tokens
    minBetAmount: 0.1,
    // Maximum bet amount in S tokens
    maxBetAmount: 1000
  },
  
  // Sonic Mainnet Configuration
  mainnet: {
    chainId: 14600,
    chainName: 'Sonic Mainnet',
    rpcUrl: 'https://rpc.soniclabs.com',
    explorerUrl: 'https://sonicscan.org',
    currencySymbol: 'S',
    treasuryAddress: '0x1ECc97BAa9e8BbF893eE643B1a08bDd33fF7Bf12',
    betFeePercentage: 0.005,
    minBetAmount: 1,
    maxBetAmount: 10000
  }
};

// Current network (default to testnet)
export const CURRENT_NETWORK = SONIC_CONFIG.testnet;

// Treasury address for current network
export const TREASURY_ADDRESS = CURRENT_NETWORK.treasuryAddress;

// Bet fee calculation
export const calculateBetFee = (amount: number): number => {
  return amount * CURRENT_NETWORK.betFeePercentage;
};

// Total bet amount including fee
export const calculateTotalBetAmount = (amount: number): number => {
  return amount + calculateBetFee(amount);
};
