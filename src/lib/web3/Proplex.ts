import { ethers } from 'ethers';

// Import ABIs
import ProplexSPVFactoryABI from './ABIs/ProplexSPVFactory.json';
import ProplexAssetFactoryABI from './ABIs/ProplexAssetFactory.json';
import ProplexAssetABI from './ABIs/ProplexAsset.json';
import ProplexOrderManagerABI from './ABIs/ProplexOrderManager.json';

// Contract Addresses (from Addresses.md)
export const CONTRACT_ADDRESSES = {
  SPVFactory: '0x19e647c2fDbFaAC1B2d7F5eD141c657C1afCDafa',
  AssetFactory: '0xF2edEE4CFE26a0d7f808826D0351bcaaed555aE1',
  Registry: '0xB6E65EDA9537A205aA9c6dc09D78Cbe7b1ec8328',
  // Mock compliance contracts (for testnet)
  MockIdentityRegistry: '0x962185B4912bFb91bA9c4b26CE905E484Fa216c1',
  MockModularCompliance: '0xad7C8C502DbbFCD74c2F68f002822048Af8985F9',
  MockClaimIssuerRegistry: '0x047E36d57b021e92ceb6d3b87aFEa480c5D9A388',
  MockClaimRegistry: '0x37F9Df8f735c1F44dAbc8B86f57b840Ba189b54A',
} as const;

// Types
export interface DeploySPVParams {
  spvId: string;
  name: string;
  admin: string;
  metaCID: string; // bytes32 as hex string
}

export interface PrepareDeployParams {
  spvId: string;
  name: string;
  symbol: string;
  decimals: number;
  maxSupply: string; // BigNumber as string
  assetId: string; // bytes32 as hex string
  metaCID: string; // bytes32 as hex string
}

export interface ExecuteDeployParams {
  tokenPrice: string; // BigNumber as string
  identityRegistry: string;
  compliance: string;
  issuerRegistry: string;
  claimRegistry: string;
  spv: string;
  assetOwner: string;
}

export interface ApproveParams {
  assetTokenAddress: string;
  spender: string;
  amount: string; // BigNumber as string
}

export interface CreateOrderParams {
  orderManagerAddress: string;
  investor: string;
  amount: string; // BigNumber as string
  paymentValue: string; // ETH amount to send with transaction
}

export interface CompleteOrderParams {
  orderManagerAddress: string;
  orderId: string; // BigNumber as string
}

/**
 * Get a signer from the provider
 * @param provider - Ethers provider (e.g., from MetaMask)
 * @returns Signer instance
 */
export const getSigner = async (provider: ethers.providers.Web3Provider): Promise<ethers.Signer> => {
  return provider.getSigner();
};

/**
 * Deploy a new SPV (Special Purpose Vehicle)
 * @param provider - Ethers provider
 * @param params - SPV deployment parameters
 * @returns Transaction receipt
 */
export const deploySPV = async (
  provider: ethers.providers.Web3Provider,
  params: DeploySPVParams
): Promise<ethers.ContractReceipt> => {
  try {
    const signer = await getSigner(provider);
    const spvFactory = new ethers.Contract(
      CONTRACT_ADDRESSES.SPVFactory,
      ProplexSPVFactoryABI.abi,
      signer
    );

    const metadataBytes32 = ethers.utils.formatBytes32String(
       params.metaCID.substring(0, 31)
      );
    // Convert metaCID to bytes32 if it's not already
    // const metaCIDBytes32 = params.metaCID.startsWith('0x') 
    //   ? params.metaCID 
    //   : ethers.utils.formatBytes32String(params.metaCID);

    const tx = await spvFactory.deploySPV(
      params.spvId,
      params.name,
      params.admin,
      metadataBytes32
    );

    const receipt = await tx.wait();
    console.log('SPV deployed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error deploying SPV:', error);
    throw error;
  }
};

/**
 * Prepare asset deployment (Step 1 of 2)
 * @param provider - Ethers provider
 * @param params - Asset preparation parameters
 * @returns Transaction receipt
 */
export const prepareDeploy = async (
  provider: ethers.providers.Web3Provider,
  params: PrepareDeployParams
): Promise<ethers.ContractReceipt> => {
  try {
    const signer = await getSigner(provider);
    const assetFactory = new ethers.Contract(
      CONTRACT_ADDRESSES.AssetFactory,
      ProplexAssetFactoryABI.abi,
      signer
    );

    const assetIdBytes32=  ethers.utils.formatBytes32String(
       params.assetId.substring(0, 31)
      );
    // Convert to bytes32 if needed
    // const assetIdBytes32 = params.assetId.startsWith('0x')
    //   ? params.assetId
    //   : ethers.utils.formatBytes32String(params.assetId);
    
    const metaCIDBytes32 = ethers.utils.formatBytes32String(
       params.metaCID.substring(0, 31)
      );

    const tx = await assetFactory.prepareDeploy(
      params.spvId,
      params.name,
      params.symbol,
      params.decimals,
      ethers.BigNumber.from(params.maxSupply),
      assetIdBytes32,
      metaCIDBytes32
    );

    const receipt = await tx.wait();
    console.log('Asset deployment prepared:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error preparing asset deployment:', error);
    throw error;
  }
};

/**
 * Execute asset deployment (Step 2 of 2)
 * @param provider - Ethers provider
 * @param params - Asset execution parameters
 * @returns Transaction receipt
 */
export const executeDeploy = async (
  provider: ethers.providers.Web3Provider,
  params: ExecuteDeployParams
): Promise<ethers.ContractReceipt> => {
  try {
    const signer = await getSigner(provider);
    const assetFactory = new ethers.Contract(
      CONTRACT_ADDRESSES.AssetFactory,
      ProplexAssetFactoryABI.abi,
      signer
    );

    const tx = await assetFactory.executeDeploy(
      ethers.BigNumber.from(params.tokenPrice),
      params.identityRegistry,
      params.compliance,
      params.issuerRegistry,
      params.claimRegistry,
      params.spv,
      params.assetOwner
    );

    const receipt = await tx.wait();
    console.log('Asset deployed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error executing asset deployment:', error);
    throw error;
  }
};

/**
 * Approve tokens for spending (required before completeOrder)
 * @param provider - Ethers provider
 * @param params - Approval parameters
 * @returns Transaction receipt
 */
export const approveTokens = async (
  provider: ethers.providers.Web3Provider,
  params: ApproveParams
): Promise<ethers.ContractReceipt> => {
  try {
    const signer = await getSigner(provider);
    const assetToken = new ethers.Contract(
      params.assetTokenAddress,
      ProplexAssetABI.abi,
      signer
    );

    const tx = await assetToken.approve(
      params.spender,
      ethers.BigNumber.from(params.amount)
    );

    const receipt = await tx.wait();
    console.log('Tokens approved successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error approving tokens:', error);
    throw error;
  }
};

/**
 * Create a new order
 * @param provider - Ethers provider
 * @param params - Order creation parameters
 * @returns Transaction receipt with orderId in events
 */
export const createOrder = async (
  provider: ethers.providers.Web3Provider,
  params: CreateOrderParams
): Promise<ethers.ContractReceipt> => {
  try {
    console.log("createOrder", provider, params);
    const signer = await getSigner(provider);
    const orderManager = new ethers.Contract(
      params.orderManagerAddress,
      ProplexOrderManagerABI.abi,
      signer
    );

    // Log the transaction details before sending
    console.log("Preparing to create order with details:", {
      investor: params.investor,
      amount: params.amount,
      paymentValue: params.paymentValue,
      orderManagerAddress: params.orderManagerAddress
    });

    const totalPayment = ethers.BigNumber.from(params.paymentValue).add(ethers.utils.parseUnits("1", 18));
    console.log("totalPayment", totalPayment);

    // The amount is already a BigNumber string from the frontend, so we don't need to convert it again
    const tx = await orderManager.createOrder(
      params.investor,
      params.amount ,
      {
        value: totalPayment
      }
    );

    console.log("Transaction sent, waiting for confirmation...");
    const receipt = await tx.wait();
    console.log('Order created successfully:', receipt);
    
    // Extract orderId from events
    const orderCreatedEvent = receipt.events?.find(
      (e: any) => e.event === 'OrderCreated'
    );
    if (orderCreatedEvent) {
      console.log('Order ID:', orderCreatedEvent.args?.orderId.toString());
    }
    
    return receipt;
  } catch (error: any) {
    console.error('Error creating order:', error);
    
    // Provide more detailed error information
    if (error.reason) {
      console.error('Revert reason:', error.reason);
    }
    
    if (error.data?.message) {
      console.error('Error data message:', error.data.message);
    }
    
    // Re-throw the error with more context
    throw new Error(`Failed to create order: ${error.message || error.reason || 'Unknown error'}`);
  }
};

/**
 * Complete an existing order
 * @param provider - Ethers provider
 * @param params - Order completion parameters
 * @returns Transaction receipt
 */
export const completeOrder = async (
  provider: ethers.providers.Web3Provider,
  params: CompleteOrderParams
): Promise<ethers.ContractReceipt> => {
  try {
    const signer = await getSigner(provider);
    const orderManager = new ethers.Contract(
      params.orderManagerAddress,
      ProplexOrderManagerABI.abi,
      signer
    );

    // The orderId is already a BigNumber string, so we don't need to convert it again
    const tx = await orderManager.completeOrder(
      ethers.BigNumber.from(params.orderId) // params.orderId is already a BigNumber string
    );

    const receipt = await tx.wait();
    console.log('Order completed successfully:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error completing order:', error);
    throw error;
  }
};

// Helper Functions

/**
 * Get SPV address by SPV ID
 * @param provider - Ethers provider
 * @param spvId - SPV identifier
 * @returns SPV contract address
 */
export const getSPVAddress = async (
  provider: ethers.providers.Web3Provider,
  spvId: string
): Promise<string> => {
  try {
    const signer = await getSigner(provider);
    const spvFactory = new ethers.Contract(
      CONTRACT_ADDRESSES.SPVFactory,
      ProplexSPVFactoryABI.abi,
      signer
    );

    const spvIdHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(spvId));
    const spvAddress = await spvFactory.spvOf(spvIdHash);
    
    return spvAddress;
  } catch (error) {
    console.error('Error getting SPV address:', error);
    throw error;
  }
};

/**
 * Get DAO address by SPV ID
 * @param provider - Ethers provider
 * @param spvId - SPV identifier
 * @returns DAO contract address
 */
export const getDAOAddress = async (
  provider: ethers.providers.Web3Provider,
  spvId: string
): Promise<string> => {
  try {
    const signer = await getSigner(provider);
    const spvFactory = new ethers.Contract(
      CONTRACT_ADDRESSES.SPVFactory,
      ProplexSPVFactoryABI.abi,
      signer
    );

    const spvIdHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(spvId));
    const daoAddress = await spvFactory.daoOf(spvIdHash);
    
    return daoAddress;
  } catch (error) {
    console.error('Error getting DAO address:', error);
    throw error;
  }
};

/**
 * Get Ledger address by SPV ID
 * @param provider - Ethers provider
 * @param spvId - SPV identifier
 * @returns Ledger contract address
 */
export const getLedgerAddress = async (
  provider: ethers.providers.Web3Provider,
  spvId: string
): Promise<string> => {
  try {
    const signer = await getSigner(provider);
    const spvFactory = new ethers.Contract(
      CONTRACT_ADDRESSES.SPVFactory,
      ProplexSPVFactoryABI.abi,
      signer
    );

    const spvIdHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(spvId));
    const ledgerAddress = await spvFactory.ledgerOf(spvIdHash);
    
    return ledgerAddress;
  } catch (error) {
    console.error('Error getting Ledger address:', error);
    throw error;
  }
};

/**
 * Get assets deployed for a specific SPV
 * @param provider - Ethers provider
 * @param spvId - SPV identifier
 * @returns Array of asset addresses
 */
export const getAssetsOfSPV = async (
  provider: ethers.providers.Web3Provider,
  spvId: string
): Promise<string[]> => {
  try {
    const signer = await getSigner(provider);
    const assetFactory = new ethers.Contract(
      CONTRACT_ADDRESSES.AssetFactory,
      ProplexAssetFactoryABI.abi,
      signer
    );

    const spvIdHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(spvId));
    const assets = await assetFactory.getAssetsOfSPV(spvIdHash);
    
    return assets;
  } catch (error) {
    console.error('Error getting assets of SPV:', error);
    throw error;
  }
};

/**
 * Get AssetManager address for a specific asset
 * @param provider - Ethers provider
 * @param assetAddress - Asset token address
 * @returns AssetManager contract address
 */
export const getAssetManagerAddress = async (
  provider: ethers.providers.Web3Provider,
  assetAddress: string
): Promise<string> => {
  try {
    const signer = await getSigner(provider);
    const assetFactory = new ethers.Contract(
      CONTRACT_ADDRESSES.AssetFactory,
      ProplexAssetFactoryABI.abi,
      signer
    );

    const assetManagerAddress = await assetFactory.assetManagerOf(assetAddress);
    
    return assetManagerAddress;
  } catch (error) {
    console.error('Error getting AssetManager address:', error);
    throw error;
  }
};

/**
 * Get OrderManager address for a specific asset
 * @param provider - Ethers provider
 * @param assetAddress - Asset token address
 * @returns OrderManager contract address
 */
export const getOrderManagerAddress = async (
  provider: ethers.providers.Web3Provider,
  assetAddress: string
): Promise<string> => {
  try {
    const signer = await getSigner(provider);
    const assetFactory = new ethers.Contract(
      CONTRACT_ADDRESSES.AssetFactory,
      ProplexAssetFactoryABI.abi,
      signer
    );

    const orderManagerAddress = await assetFactory.orderManagerOf(assetAddress);
    
    return orderManagerAddress;
  } catch (error) {
    console.error('Error getting OrderManager address:', error);
    throw error;
  }
};

/**
 * Get order details
 * @param provider - Ethers provider
 * @param orderManagerAddress - OrderManager contract address
 * @param orderId - Order ID
 * @returns Order details
 */
export const getOrder = async (
  provider: ethers.providers.Web3Provider,
  orderManagerAddress: string,
  orderId: string
): Promise<{
  investor: string;
  amount: ethers.BigNumber;
  status: number;
  createdAt: number;
}> => {
  try {
    const signer = await getSigner(provider);
    const orderManager = new ethers.Contract(
      orderManagerAddress,
      ProplexOrderManagerABI.abi,
      signer
    );

    const order = await orderManager.getOrder(ethers.BigNumber.from(orderId));
    
    return {
      investor: order.investor,
      amount: order.amount,
      status: order.status,
      createdAt: order.createdAt
    };
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

/**
 * Get token price from asset contract
 * @param provider - Ethers provider
 * @param assetAddress - Asset token address
 * @returns Token price
 */
export const getTokenPrice = async (
  provider: ethers.providers.Web3Provider,
  assetAddress: string
): Promise<ethers.BigNumber> => {
  try {
    const signer = await getSigner(provider);
    const asset = new ethers.Contract(
      assetAddress,
      ProplexAssetABI.abi,
      signer
    );

    const price = await asset.getTokenPrice();
    
    return price;
  } catch (error) {
    console.error('Error getting token price:', error);
    throw error;
  }
};

/**
 * Get token balance
 * @param provider - Ethers provider
 * @param assetAddress - Asset token address
 * @param account - Account address
 * @returns Token balance
 */
export const getTokenBalance = async (
  provider: ethers.providers.Web3Provider,
  assetAddress: string,
  account: string
): Promise<ethers.BigNumber> => {
  try {
    const signer = await getSigner(provider);
    const asset = new ethers.Contract(
      assetAddress,
      ProplexAssetABI.abi,
      signer
    );

    const balance = await asset.balanceOf(account);
    
    return balance;
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw error;
  }
};

/**
 * Get token allowance
 * @param provider - Ethers provider
 * @param assetAddress - Asset token address
 * @param owner - Owner address
 * @param spender - Spender address
 * @returns Token allowance
 */
export const getTokenAllowance = async (
  provider: ethers.providers.Web3Provider,
  assetAddress: string,
  owner: string,
  spender: string
): Promise<ethers.BigNumber> => {
  try {
    const signer = await getSigner(provider);
    const asset = new ethers.Contract(
      assetAddress,
      ProplexAssetABI.abi,
      signer
    );

    const allowance = await asset.allowance(owner, spender);
    
    return allowance;
  } catch (error) {
    console.error('Error getting token allowance:', error);
    throw error;
  }
};

// Utility functions for bytes32 conversion
export const stringToBytes32 = (str: string): string => {
  return ethers.utils.formatBytes32String(str);
};

export const bytes32ToString = (bytes32: string): string => {
  return ethers.utils.parseBytes32String(bytes32);
};

// Export all ABIs for direct use if needed
export { 
  ProplexSPVFactoryABI, 
  ProplexAssetFactoryABI, 
  ProplexAssetABI, 
  ProplexOrderManagerABI 
};