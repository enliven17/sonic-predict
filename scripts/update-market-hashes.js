const fs = require('fs');

console.log('🔗 Updating market transaction hashes with real Sonic testnet hashes...\n');

try {
  // Load real transaction hashes
  const realTxHashes = JSON.parse(fs.readFileSync('sonic-real-market-txs.json', 'utf8'));
  
  // Path to seed markets file
  const seedMarketsPath = 'src/constants/seedMarkets.ts';
  
  // Read the current seed markets file
  let seedMarketsContent = fs.readFileSync(seedMarketsPath, 'utf8');
  
  // Update each market's txHash
  realTxHashes.forEach(market => {
    const marketId = market.id;
    const realHash = market.txHash;
    
    // Find the market in the file and update its txHash
    const lines = seedMarketsContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`id: "${marketId}"`)) {
        // Look for txHash in the next 20 lines
        for (let j = i; j < Math.min(i + 20, lines.length); j++) {
          if (lines[j].includes('txHash:')) {
            // Update the txHash
            lines[j] = lines[j].replace(/txHash: "[^"]*"/, `txHash: "${realHash}"`);
            console.log(`✅ ${marketId}: ${realHash.slice(0, 10)}...`);
            break;
          }
        }
        break;
      }
    }
    
    // Join lines back together
    seedMarketsContent = lines.join('\n');
  });
  
  // Write the updated content back to the file
  fs.writeFileSync(seedMarketsPath, seedMarketsContent);
  
  console.log('\n💾 All market transaction hashes updated successfully!');
  console.log('📁 Check src/constants/seedMarkets.ts for the updated hashes.');
  console.log('\n🎯 Next steps:');
  console.log('1. Test the app with real transaction hashes');
  console.log('2. Each hash now links to Sonic testnet explorer');
  console.log('3. Markets are ready for real Sonic testnet betting!');
  
} catch (error) {
  console.error('❌ Error updating market hashes:', error.message);
}
