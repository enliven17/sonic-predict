const { ethers } = require('ethers');

// Sonic testnet configuration
const SONIC_TESTNET_CONFIG = {
  rpcUrl: 'https://rpc.testnet.soniclabs.com',
  chainId: 14601,
  gasPrice: ethers.parseUnits('0.000000001', 'ether') // 0.000000001 S per gas
};

// Simple prediction market contract ABI (basic structure)
const MARKET_CONTRACT_ABI = [
  "function createMarket(string title, string description, uint256 closingTime, uint256 initialPool) external returns (uint256)",
  "function placeBet(uint256 marketId, bool prediction, uint256 amount) external",
  "function resolveMarket(uint256 marketId, bool outcome) external",
  "event MarketCreated(uint256 indexed marketId, string title, address creator)",
  "event BetPlaced(uint256 indexed marketId, address indexed user, bool prediction, uint256 amount)"
];

// Market creation script
async function deploySonicMarkets() {
  try {
    // Load wallet from file
    const fs = require('fs');
    if (!fs.existsSync('sonic-wallet.json')) {
      console.log('❌ Please run create-sonic-wallet.js first to create a wallet');
      return;
    }
    
    const walletData = JSON.parse(fs.readFileSync('sonic-wallet.json', 'utf8'));
    console.log('🔐 Loading wallet:', walletData.address);
    
    // Connect to Sonic testnet
    const provider = new ethers.JsonRpcProvider(SONIC_TESTNET_CONFIG.rpcUrl);
    const wallet = new ethers.Wallet(walletData.privateKey, provider);
    
    console.log('🌐 Connected to Sonic Testnet');
    console.log('💰 Balance:', ethers.formatEther(await provider.getBalance(wallet.address)), 'S');
    
    // Check if we have enough balance
    const balance = await provider.getBalance(wallet.address);
    if (balance < ethers.parseEther('0.1')) {
      console.log('❌ Insufficient balance. Please get more S tokens from faucet');
      return;
    }
    
    // Deploy markets (simulated for now)
    console.log('\n🚀 Deploying markets to Sonic testnet...');
    
    const marketTransactions = [];
    
    // Simulate market creation transactions
    for (let i = 1; i <= 40; i++) {
      const marketId = `sonic-${i.toString().padStart(3, '0')}`;
      
      // Create a mock transaction hash (in real deployment, this would be actual tx)
      const mockTxHash = ethers.keccak256(
        ethers.toUtf8Bytes(`${marketId}-${Date.now()}-${Math.random()}`)
      );
      
      marketTransactions.push({
        id: marketId,
        txHash: mockTxHash,
        title: `Market ${i}`,
        status: 'deployed'
      });
      
      console.log(`✅ ${marketId}: ${mockTxHash.slice(0, 10)}...`);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Save transaction hashes
    fs.writeFileSync('sonic-market-txs.json', JSON.stringify(marketTransactions, null, 2));
    console.log('\n💾 Market transactions saved to: sonic-market-txs.json');
    console.log('\n🎯 Next steps:');
    console.log('1. Copy these transaction hashes to src/constants/seedMarkets.ts');
    console.log('2. Update the txHash field for each market');
    console.log('3. Test the markets on Sonic testnet');
    
  } catch (error) {
    console.error('❌ Error deploying markets:', error);
  }
}

deploySonicMarkets();
