const { ethers } = require('ethers');

async function createSonicWallet() {
  try {
    // Generate a new random wallet
    const wallet = ethers.Wallet.createRandom();
    
    console.log('🔐 Sonic Testnet Wallet Created Successfully!');
    console.log('==============================================');
    console.log(`📱 Address: ${wallet.address}`);
    console.log(`🔑 Private Key: ${wallet.privateKey}`);
    console.log(`📝 Mnemonic: ${wallet.mnemonic.phrase}`);
    console.log('');
    console.log('💰 Get test S tokens from: https://testnet.soniclabs.com/account');
    console.log('🌐 Sonic Testnet Explorer: https://testnet.sonicscan.org');
    console.log('');
    console.log('⚠️  IMPORTANT: Save these details securely!');
    console.log('⚠️  Never share your private key or mnemonic!');
    
    // Save to file
    const fs = require('fs');
    const walletData = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
      createdAt: new Date().toISOString(),
      network: 'Sonic Testnet',
      chainId: 14601
    };
    
    fs.writeFileSync('sonic-wallet.json', JSON.stringify(walletData, null, 2));
    console.log('💾 Wallet details saved to: sonic-wallet.json');
    
  } catch (error) {
    console.error('❌ Error creating wallet:', error);
  }
}

createSonicWallet();
