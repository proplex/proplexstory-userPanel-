// Blockchain configuration
export const BLOCKCHAIN_CONFIG = {
  // Whether to use blockchain for order completion
  // Set to false if you want to use web2 only
  USE_BLOCKCHAIN_COMPLETION: true,
  
  // Whether to use web2 database operations
  // Set to false if you want web3 only
  USE_WEB2_DATABASE: false,
  
  // U2U Network configurations
  U2U_CHAIN_IDS: [2484, 39], // Testnet and Mainnet
  
  // Default decimals for token calculations
  TOKEN_DECIMALS: 18,
};