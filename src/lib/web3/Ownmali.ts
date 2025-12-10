import { 
  ethers, 
  Contract, 
  BigNumber, 
  BigNumberish, 
  ContractTransaction, 
  ContractReceipt,
  ContractInterface,
  providers,
  Signer,
  utils
} from "ethers";
import { EventEmitter } from 'events';
import { Interface } from "ethers/lib/utils";

type EventMap = {
  'AssetDeployed': { assetAddress: string; spvAddress: string; owner: string; txHash: string };
  'SPVDeployed': { spvAddress: string; id: string; name: string; txHash: string };
  'OrderCreated': { orderId: BigNumber; investor: string; amount: BigNumber };
  'OrderCompleted': { orderId: BigNumber; investor: string; amount: BigNumber };
  'OrderCancelled': { orderId: BigNumber };
  'Transfer': { from: string; to: string; amount: BigNumber };
  'Approval': { owner: string; spender: string; amount: BigNumber };
};

// ABI Type
type ABI = ethers.ContractInterface;

// Type for ABI that might be wrapped in an object with 'abi' property
interface ABIWrapper {
  abi: ethers.ContractInterface;
  [key: string]: any;
}

// Import ABIs with type assertion
const OwnmaliOrderManagerABI = require("../web3/ABIS/OwnmaliOrderManager.json") as ABI;
const OwnmaliAssetABI = require("../web3/ABIS/OwnmaliAsset.json") as ABI;
const OwnmaliRegistryABI = require("../web3/ABIS/OwnmaliRegistry.json") as ABI;
const OwnmaliAssetManagerABI = require("../web3/ABIS/OwnmaliAssetManager.json") as ABI;
const OwnmaliSPVABI = require("../web3/ABIS/OwnmaliSPV.json") as ABI;
const OwnmaliSpvFactoryABI = require("../web3/ABIS/OwnmaliSpvFactory.json") as ABI;
const OwnmaliAssetFactoryABI = require("../web3/ABIS/OwnmaliAssetFactory.json") as ABI;
const OwnmaliFinancialLedgerABI = require("../web3/ABIS/OwnmaliFinancialLedger.json") as ABI;
const IdentityRegistryABI = require("../web3/ABIS/IdentityRegistry.json") as ABI;
const ModularComplianceABI = require("../web3/ABIS/ModularCompliance.json") as ABI;

// Re-export commonly used types
export type { BigNumber, BigNumberish, ContractTransaction, ContractReceipt } from "ethers";

// Contract interfaces
export interface IOwnmaliOrderManager extends ethers.Contract {
  orderCounter(overrides?: ethers.CallOverrides): Promise<BigNumber>;
  createOrder(
    investor: string, 
    amount: BigNumberish, 
    overrides?: ethers.Overrides & { from?: string }
  ): Promise<ethers.ContractTransaction>;
  completeOrder(
    orderId: BigNumberish, 
    overrides?: ethers.Overrides & { from?: string }
  ): Promise<ethers.ContractTransaction>;
  cancelOrder(
    orderId: BigNumberish, 
    overrides?: ethers.Overrides & { from?: string }
  ): Promise<ethers.ContractTransaction>;
  getOrder(
    orderId: BigNumberish, 
    overrides?: ethers.CallOverrides
  ): Promise<[BigNumber, string, BigNumber, number, BigNumber, string]>;
  
  // Event types
  on(event: 'OrderCreated', listener: (orderId: BigNumber, investor: string, amount: BigNumber) => void): this;
  on(event: 'OrderCompleted', listener: (orderId: BigNumber, investor: string, amount: BigNumber) => void): this;
  on(event: 'OrderCancelled', listener: (orderId: BigNumber) => void): this;
}

export interface IOwnmaliAsset extends ethers.Contract {
  balanceOf(account: string): Promise<BigNumber>;
  transfer(to: string, amount: BigNumberish): Promise<ContractTransaction>;
  approve(spender: string, amount: BigNumberish): Promise<ContractTransaction>;
  transferFrom(from: string, to: string, amount: BigNumberish): Promise<ContractTransaction>;
}

export interface IOwnmaliAssetFactory extends ethers.Contract {
  prepareDeploy(
    spvId: string,
    name: string,
    symbol: string,
    decimals: number,
    maxSupply: BigNumberish,
    spvIdHash: string,
    assetTypeHash: string
  ): Promise<ContractTransaction>;
  
  executeDeploy(
    identityRegistry: string,
    compliance: string,
    claimIssuerRegistry: string,
    claimRegistry: string,
    spv: string,
    owner: string
  ): Promise<ContractTransaction>;
}

export interface IOwnmaliSPVFactory extends ethers.Contract {
  createSPV(
    id: string,
    name: string,
    countryCode: string,
    metadataCID: string
  ): Promise<ContractTransaction>;
}

export interface IOwnmaliRegistry extends ethers.Contract {
  registerSPV(
    id: string,
    name: string,
    countryCode: string,
    metadataCID: string
  ): Promise<ContractTransaction>;
  
  registerAsset(
    spvId: string,
    name: string,
    symbol: string,
    assetType: string,
    metadataCID: string
  ): Promise<ContractTransaction>;
}

// Contract addresses
export const CONTRACT_ADDRESSES = {
  // Amoy Testnet (Polygon)
  80002: {
    // Core Contracts
    orderManager: "0x67E5067d72C434D947c861Fa2B571e46e37C6341", // Implementation address
    asset: "0x56bc000bb3393122B7ef68A372bf51d13EB1f25D", // Implementation address
    registry: "0x89cB8c5E197EABbFF001282E06C68e7e6b0ed8a6", // Proxy address
    assetFactory: "0xB517647af92264bbD3Fdb5ed0ED12Cc224ec2d9E", // Proxy address
    spvFactory: "0xb6A409b8C74f3F932315a47A190398e2A880D1Df", // Proxy address
    assetManager: "0x0000000000000000000000000000000000000000", // TODO: Add actual address
    financialLedger: "0x0000000000000000000000000000000000000000", // TODO: Add actual address
    
    // Compliance Contracts
    identityRegistry: "0x1bfE79c579c72f43D07F5F43878afdBD09a2726a",
    modularCompliance: "0xe42eE8C6ca221b582fd8Fb93476DB1c47E08e244",
    claimIssuerRegistry: "0xEAFaF64aDbc6a626261B4dC5aAED112cC6844bE5",
    claimRegistry: "0x5Efdfa516F4F8Bac356f2eb6c0d8F9424A629f47",
    
    // Test Addresses
    testAssetOwner: "0x6928Fc433dBE09B1b10bEeDf390B0F00f7476465",
    testInvestor: "0x80F390AB073Ef7d09268e84ddA6E431b5A7dC895"
  }
} as const;

/**
 * Core Types
 */
type OrderStatus = 'Pending' | 'Completed' | 'Cancelled';

/**
 * Order Information
 */
interface Order {
  orderId: BigNumber;
  investor: string;
  amount: BigNumber;
  status: OrderStatus;
  createdAt: BigNumber;
  metadataCID?: string;
}

/**
 * SPV Information
 */
interface SPVInfo {
  id: string;
  name: string;
  owner: string;
  countryCode: string;
  metadataCID: string;
  isActive: boolean;
  createdAt: BigNumber;
  updatedAt: BigNumber;
}

/**
 * Asset Information
 */
interface AssetInfo {
  id: string;
  name: string;
  symbol: string;
  spvId: string;
  assetType: string;
  metadataCID: string;
  isActive: boolean;
  createdAt: BigNumber;
  updatedAt: BigNumber;
  tokenAddress: string;
}

/**
 * Asset Deployment Parameters
 */
interface AssetDeploymentParams {
  spvId: string;
  assetName: string;
  assetSymbol: string;
  decimals: number;
  maxSupply: BigNumberish;
  spvIdHash: string;
  assetTypeHash: string;
  metadataCID?: string;
}

/**
 * SPV Deployment Parameters
 */
interface SPVDeploymentParams {
  id: string;
  name: string;
  countryCode: string;
  metadataCID: string;
  owner?: string;
}

/**
 * Contract Events
 */
interface ContractEvents {
  OrderCreated: {
    orderId: BigNumber;
    investor: string;
    amount: BigNumber;
  };
  OrderCompleted: {
    orderId: BigNumber;
    investor: string;
    amount: BigNumber;
  };
  AssetDeployed: {
    assetAddress: string;
    name: string;
    symbol: string;
    spvId: string;
  };
  SPVDeployed: {
    spvAddress: string;
    id: string;
    name: string;
  };
}

/**
 * Transaction Options
 */
interface TransactionOptions {
  gasLimit?: BigNumberish;
  gasPrice?: BigNumberish;
  value?: BigNumberish;
  nonce?: number;
  chainId?: number;
  from?: string;
  maxFeePerGas?: BigNumberish;
  maxPriorityFeePerGas?: BigNumberish;
}

/**
 * Contract Deployment Options
 */
interface ContractDeploymentOptions extends TransactionOptions {
  confirmations?: number;
  timeout?: number;
  pollInterval?: number;
}

/**
 * OwnmaliUser - Main class for interacting with Ownmali smart contracts
 */
export class OwnmaliUser {
  private eventEmitter = new EventEmitter();
  
  // Event emitter methods
  on<T extends keyof EventMap>(event: T, listener: (data: EventMap[T]) => void): void {
    this.eventEmitter.on(event, listener);
  }
  
  off<T extends keyof EventMap>(event: T, listener: (data: EventMap[T]) => void): void {
    this.eventEmitter.off(event, listener);
  }
  
  private emit<T extends keyof EventMap>(event: T, data: EventMap[T]): void {
    this.eventEmitter.emit(event, data);
  }
  // Event names for filtering
  private static readonly Events = {
    OrderCreated: 'OrderCreated',
    OrderCompleted: 'OrderCompleted',
    OrderCancelled: 'OrderCancelled',
    AssetDeployed: 'AssetDeployed',
    SPVDeployed: 'SPVDeployed',
    Transfer: 'Transfer',
    Approval: 'Approval'
  } as const;
  // Provider and Signer
  private readonly provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
  private readonly signer: ethers.Signer;
  
  // Core contract instances with proper typing
  private readonly orderManagerContract: IOwnmaliOrderManager;
  private assetContract: IOwnmaliAsset;
  private readonly registryContract: IOwnmaliRegistry;
  private readonly assetFactoryContract: IOwnmaliAssetFactory;
  private readonly spvFactoryContract: IOwnmaliSPVFactory;
  
  // Optional contract instances
  private spvContract: ethers.Contract | null = null;
  private financialLedgerContract: ethers.Contract | null = null;
  
  // Compliance contracts
  private readonly identityRegistryContract: ethers.Contract;
  private readonly modularComplianceContract: ethers.Contract;
  
  // Contract addresses
  private readonly addresses: {
    [key: string]: string;
  };

  /**
   * Creates a new instance of OwnmaliUser
   * @param provider - Ethers provider (Web3Provider or JsonRpcProvider)
   * @param chainId - Chain ID (default: 80002 for Amoy testnet)
   * @param options - Additional options including contract addresses
   */
  constructor(
    provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    chainId: number = 80002, // Default to Amoy testnet
    options: {
      spvAddress?: string;
      assetAddress?: string;
      financialLedgerAddress?: string;
      assetManagerAddress?: string;
    } = {}
  ) {
    // Validate chain ID
    if (!CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    this.provider = provider;
    this.signer = this.provider.getSigner();
    this.addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];

        // Initialize with the getABI method available for the instance

    // Initialize core contracts with proper typing
    this.orderManagerContract = new ethers.Contract(
      this.addresses.orderManager,
      this.getABI(OwnmaliOrderManagerABI),
      this.signer
    ) as IOwnmaliOrderManager;

    this.assetContract = new ethers.Contract(
      options.assetAddress || this.addresses.asset,
      this.getABI(OwnmaliAssetABI),
      this.signer
    ) as IOwnmaliAsset;

    this.registryContract = new ethers.Contract(
      this.addresses.registry,
      this.getABI(OwnmaliRegistryABI),
      this.signer
    ) as unknown as IOwnmaliRegistry;

    this.assetFactoryContract = new ethers.Contract(
      this.addresses.assetFactory,
      this.getABI(OwnmaliAssetFactoryABI),
      this.signer
    ) as unknown as IOwnmaliAssetFactory;

    this.spvFactoryContract = new ethers.Contract(
      this.addresses.spvFactory,
      this.getABI(OwnmaliSpvFactoryABI),
      this.signer
    ) as unknown as IOwnmaliSPVFactory;

    // Initialize SPV contract if address is provided
    if (options.spvAddress) {
      this.spvContract = new ethers.Contract(
        options.spvAddress,
        this.getABI(OwnmaliSPVABI),
        this.signer
      );
    }

    // Initialize Financial Ledger contract if address is provided
    if (options.financialLedgerAddress) {
this.financialLedgerContract = new ethers.Contract(
        options.financialLedgerAddress,
        this.getABI(OwnmaliFinancialLedgerABI),
        this.signer
      );
    }

    // Initialize compliance contracts
    this.identityRegistryContract = new ethers.Contract(
      this.addresses.identityRegistry,
      this.getABI(IdentityRegistryABI),
      this.signer
    );

    this.modularComplianceContract = new ethers.Contract(
      this.addresses.modularCompliance,
      this.getABI(ModularComplianceABI),
      this.signer
    );
    
    // Bind methods to maintain 'this' context
    this.createOrder = this.createOrder.bind(this);
    this.completeOrder = this.completeOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.getOrder = this.getOrder.bind(this);
    this.transfer = this.transfer.bind(this);
    this.approve = this.approve.bind(this);
    this.transferFrom = this.transferFrom.bind(this);
    this.balanceOf = this.balanceOf.bind(this);
    this.allowance = this.allowance.bind(this);
    this.prepareAssetDeployment = this.prepareAssetDeployment.bind(this);
    this.executeAssetDeployment = this.executeAssetDeployment.bind(this);
    this.createSPV = this.createSPV.bind(this);
  }

  /**
   * Create a new order
   * @param investor - Address of the investor
   * @param amount - Amount of tokens to order (in wei)
   * @param options - Transaction options
   * @returns Transaction receipt with order ID
   */
  async createOrder(
    investor: string,
    amount: BigNumberish,
    options: TransactionOptions = {}
  ): Promise<{ receipt: ContractReceipt; orderId: BigNumber }> {
    try {
      // Validate input
      if (!ethers.utils.isAddress(investor)) {
        throw new Error('Invalid investor address');
      }
      
      const amountBN = BigNumber.from(amount);
      if (amountBN.lte(0)) {
        throw new Error('Order amount must be greater than 0');
      }

      // Prepare transaction options
      const txOptions = {
        ...options,
        gasLimit: options.gasLimit || 300000, // Default gas limit
      };

      // Send transaction
      const tx = await this.orderManagerContract.createOrder(investor, amountBN, txOptions);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Get the order ID from the event
      const event = receipt.events?.find((e: any) => e.event === 'OrderCreated');
      if (!event) {
        throw new Error('OrderCreated event not found');
      }
      
      const orderId = event.args?.orderId;
      if (!orderId) {
        throw new Error('Could not retrieve order ID from event');
      }
      
      return { receipt, orderId };
    } catch (error) {
      console.error('Error creating order:', error);
      throw this.parseError(error);
    }
  }
  
  /**
   * Get the total number of orders
   * @returns Total number of orders
   */
  async getOrderCount(): Promise<number> {
    try {
      // This assumes there's a public orderCounter variable in the contract
      const count = await this.orderManagerContract.orderCounter();
      return count.toNumber();
    } catch (error) {
      console.error('Error getting order count:', error);
      throw this.parseError(error);
    }
  }

  /**
   * Complete an existing order
   * @param orderId - ID of the order to complete
   * @param options - Transaction options
   * @returns Transaction receipt
   */
  async completeOrder(
    orderId: BigNumberish,
    options: TransactionOptions = {}
  ): Promise<ContractReceipt> {
    try {
      // Validate input
      const orderIdBN = BigNumber.from(orderId);
      if (orderIdBN.lte(0)) {
        throw new Error('Invalid order ID');
      }
      
      // Prepare transaction options
      const txOptions = {
        ...options,
        gasLimit: options.gasLimit || 300000, // Default gas limit
      };
      
      // Send transaction
      const tx = await this.orderManagerContract.completeOrder(orderIdBN, txOptions);
      
      // Wait for transaction confirmation
      return await tx.wait();
    } catch (error) {
      console.error('Error completing order:', error);
      throw this.parseError(error);
    }
  }

  /**
   * Cancel an existing order
   * @param orderId - ID of the order to cancel
   * @param options - Transaction options
   * @returns Transaction receipt
   */
  async cancelOrder(
    orderId: BigNumberish,
    options: TransactionOptions = {}
  ): Promise<ContractReceipt> {
    try {
      // Validate input
      const orderIdBN = BigNumber.from(orderId);
      if (orderIdBN.lte(0)) {
        throw new Error('Invalid order ID');
      }
      
      // Prepare transaction options
      const txOptions = {
        ...options,
        gasLimit: options.gasLimit || 200000, // Default gas limit
      };
      
      // Send transaction
      const tx = await this.orderManagerContract.cancelOrder(orderIdBN, txOptions);
      
      // Wait for transaction confirmation
      return await tx.wait();
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw this.parseError(error);
    }
  }

  /**
   * Get order details
   * @param orderId - ID of the order
   * @returns Order details
   */
  async getOrder(orderId: BigNumberish): Promise<Order> {
    try {
      // Validate input
      const orderIdBN = BigNumber.from(orderId);
      if (orderIdBN.lte(0)) {
        throw new Error('Invalid order ID');
      }
      
      // Get order details from contract - destructure the tuple
      const [id, investor, amount, status, createdAt, metadataCID] = 
        await this.orderManagerContract.getOrder(orderIdBN);
      
      return {
        orderId: id,
        investor,
        amount,
        status: this.mapOrderStatus(Number(status)),
        createdAt,
        metadataCID: metadataCID || ''
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      throw this.parseError(error);
    }
  }

  /**
   * Get multiple orders by their IDs
   * @param orderIds - Array of order IDs
   * @returns Array of order details
   */
  async getOrders(orderIds: BigNumberish[]): Promise<Order[]> {
    try {
      // Validate input
      if (!Array.isArray(orderIds) || orderIds.length === 0) {
        throw new Error('Invalid order IDs');
      }
      
      // Get order details from contract
      const orders = await Promise.all(
        orderIds.map(id => this.getOrder(id))
      );
      
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw this.parseError(error);
    }
  }

  /**
   * Get token allowance
   * @param owner - Address of the token owner
   * @param spender - Address of the spender
   * @returns Allowance amount as BigNumber
   */
  async allowance(owner: string, spender: string): Promise<BigNumber> {
    try {
      // Validate input
      if (!ethers.utils.isAddress(owner) || !ethers.utils.isAddress(spender)) {
        throw new Error('Invalid owner or spender address');
      }
      
      // Get allowance from contract
      return await this.assetContract.allowance(owner, spender);
    } catch (error) {
      console.error('Error getting allowance:', error);
      throw this.parseError(error);
    }
  }

  /**
   * Get token balance
   * @param account - Address to check balance for
   * @returns Balance as BigNumber
   */
  async balanceOf(account: string): Promise<BigNumber> {
    try {
      // Validate input
      if (!ethers.utils.isAddress(account)) {
        throw new Error('Invalid account address');
      }
      
      // Get balance from contract
      return await this.assetContract.balanceOf(account);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw this.parseError(error);
    }
  }

  /**
   * Transfer tokens to another address
   * @param to - Recipient address
   * @param amount - Amount to transfer (in wei)
   * @param options - Transaction options
   * @returns Transaction receipt
   */
  async transfer(
    to: string,
    amount: BigNumberish,
    options: TransactionOptions = {}
  ): Promise<ContractReceipt> {
    try {
      // Validate input
      if (!ethers.utils.isAddress(to)) {
        throw new Error('Invalid recipient address');
      }
      
      const amountBN = BigNumber.from(amount);
      if (amountBN.lte(0)) {
        throw new Error('Transfer amount must be greater than 0');
      }

      // Send transaction with proper overrides
      const txOptions = {
        gasLimit: options.gasLimit || 200000, // Default gas limit
        ...options
      };
      
      const tx = await this.assetContract.transfer(to, amountBN);
      
      // Wait for transaction confirmation
      return await tx.wait();
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw this.parseError(error);
    }
  }

  /**
   * Transfer tokens from one address to another (requires approval)
   * @param from - Sender address
   * @param to - Recipient address
   * @param amount - Amount to transfer (in wei)
   * @param options - Transaction options
   * @returns Transaction receipt
   */
  async transferFrom(
    from: string,
    to: string,
    amount: BigNumberish,
    options: TransactionOptions = {}
  ): Promise<ContractReceipt> {
    try {
      // Validate input
      if (!ethers.utils.isAddress(from) || !ethers.utils.isAddress(to)) {
        throw new Error('Invalid sender or recipient address');
      }
      
      const amountBN = BigNumber.from(amount);
      if (amountBN.lte(0)) {
        throw new Error('Transfer amount must be greater than 0');
      }
      
      // Send transaction with proper overrides
      const txOptions = {
        gasLimit: options.gasLimit || 200000, // Default gas limit
        ...options
      };
      
      const tx = await this.assetContract.transferFrom(from, to, amountBN);
      
      // Wait for transaction confirmation
      return await tx.wait();
    } catch (error) {
      console.error('Error transferring tokens from:', error);
      throw this.parseError(error);
    }
  }

  /**
   * Approve token transfer
   * @param spender - Address allowed to spend the tokens
   * @param amount - Amount to approve (in wei)
   * @param options - Transaction options
   * @returns Transaction receipt
   */
  async approve(
    spender: string,
    amount: BigNumberish,
    options: TransactionOptions = {}
  ): Promise<ContractReceipt> {
    try {
      // Validate input
      if (!ethers.utils.isAddress(spender)) {
        throw new Error('Invalid spender address');
      }
      
      const amountBN = BigNumber.from(amount);
      if (amountBN.lte(0)) {
        throw new Error('Approval amount must be greater than 0');
      }
      
      // Send transaction with proper overrides
      const txOptions = {
        gasLimit: options.gasLimit || 100000, // Default gas limit
        ...options
      };
      
      const tx = await this.assetContract.approve(spender, amountBN);
      
      // Wait for transaction confirmation
      return await tx.wait();
    } catch (error) {
      console.error('Error approving token transfer:', error);
      throw this.parseError(error);
    }
  }

  /**
   * Prepare asset deployment
   * @param params - Asset deployment parameters
   * @param options - Transaction options
   * @returns Transaction receipt
   */
  async prepareAssetDeployment(
    params: AssetDeploymentParams,
    options: TransactionOptions = {}
  ): Promise<ContractReceipt> {
    try {
      // Validate input
      if (!params.spvId || !params.assetName || !params.assetSymbol) {
        throw new Error('Missing required parameters');
      }
      
      if (params.decimals < 0 || params.decimals > 18) {
        throw new Error('Decimals must be between 0 and 18');
      }
      
      const maxSupply = BigNumber.from(params.maxSupply);
      if (maxSupply.lte(0)) {
        throw new Error('Max supply must be greater than 0');
      }
      
      // Prepare transaction options
      const txOptions = {
        gasLimit: options.gasLimit || 1000000, // Default gas limit
        ...options
      };
      
      // Call the prepareDeploy function
      const tx = await this.assetFactoryContract.prepareDeploy(
        params.spvId,
        params.assetName,
        params.assetSymbol,
        params.decimals,
        params.maxSupply,
        params.spvIdHash,
        params.assetTypeHash
      );
      
      // Wait for transaction confirmation
      return await tx.wait();
    } catch (error) {
      console.error('Error preparing asset deployment:', error);
      throw this.parseError(error);
    }
  }

  /**
   * Execute asset deployment
   * @param spvAddress - Address of the SPV
   * @param assetOwner - Address of the asset owner
   * @param options - Transaction options
   * @returns Transaction receipt and deployed asset address
   */
  async executeAssetDeployment(
    spvAddress: string,
    assetOwner: string,
    options: TransactionOptions = {}
  ): Promise<{ receipt: ContractReceipt; assetAddress: string }> {
    try {
      // Validate input
      if (!ethers.utils.isAddress(spvAddress) || !ethers.utils.isAddress(assetOwner)) {
        throw new Error('Invalid SPV or asset owner address');
      }
      
      // Get contract addresses from the deployed instance
      const identityRegistry = this.addresses.identityRegistry;
      const compliance = this.addresses.modularCompliance;
      
      // Prepare transaction options
      const txOptions = {
        gasLimit: options.gasLimit || 1500000, // Default gas limit
        ...options
      };
      
      // Call the executeDeploy function
      const tx = await this.assetFactoryContract.executeDeployment(
        identityRegistry,
        compliance,
        ethers.constants.AddressZero, // claimIssuerRegistry (not used in current implementation)
        ethers.constants.AddressZero, // claimRegistry (not used in current implementation)
        spvAddress,
        { ...txOptions, from: assetOwner }
      );
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Extract deployed asset address from events
      const event = receipt.events?.find(
        (e: any) => e.event === OwnmaliUser.Events.AssetDeployed
      );
      
      if (!event || !event.args || !event.args.assetAddress) {
        throw new Error('Failed to extract asset address from deployment event');
      }
      
      const assetAddress = event.args.assetAddress;
      
      // Update the asset contract instance
      this.assetContract = new ethers.Contract(
        assetAddress,
        this.getABI(OwnmaliAssetABI),
        this.signer
      ) as IOwnmaliAsset;
      
      // Emit event for tracking
      this.emit('AssetDeployed', {
        assetAddress,
        spvAddress,
        owner: assetOwner,
        txHash: receipt.transactionHash
      });
      
      return { receipt, assetAddress };
    } catch (error) {
      console.error('Error executing asset deployment:', error);
      throw this.parseError(error);
    }
  }

  /**
   * Create a new SPV
   * @param params - SPV deployment parameters
   * @param options - Transaction options
   * @returns Transaction receipt and deployed SPV address
   */
  async createSPV(
    params: SPVDeploymentParams,
    options: TransactionOptions = {}
  ): Promise<{ receipt: ContractReceipt; spvAddress: string }> {
    try {
      // Validate input
      if (!params.id || !params.name || !params.countryCode) {
        throw new Error('Missing required parameters');
      }
      
      // Call the createSPV function
      const tx = await this.spvFactoryContract.createSPV(
        params.id,
        params.name,
        params.countryCode,
        params.metadataCID
      );
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Extract deployed SPV address from events
      const event = receipt.events?.find(
        (e: any) => e.event === OwnmaliUser.Events.SPVDeployed
      );
      
      if (!event || !event.args || !event.args.spvAddress) {
        throw new Error('Failed to extract SPV address from deployment event');
      }
      
      const spvAddress = event.args.spvAddress;
      
      // Update the SPV contract instance
      this.spvContract = new ethers.Contract(
        spvAddress,
        this.getABI(OwnmaliSPVABI),
        this.signer
      );
      
      // Emit event for tracking
      this.emit('SPVDeployed', {
        spvAddress,
        id: params.id,
        name: params.name,
        txHash: receipt.transactionHash
      });
      
      return { receipt, spvAddress };
    } catch (error) {
      console.error('Error creating SPV:', error);
      throw this.parseError(error);
    }
  }

  /**
   * Helper method to get ABI from various formats
   * @param abi - The ABI in various possible formats
   * @returns The normalized ABI as ContractInterface
   */
  private getABI(abi: any): ethers.ContractInterface {
    const isABIWrapper = (a: any): a is ABIWrapper => 
      a && typeof a === 'object' && 'abi' in a;

    if (isABIWrapper(abi)) {
      return abi.abi;
    }
    if (Array.isArray(abi)) {
      return abi as ethers.ContractInterface;
    }
    if (typeof abi === 'string') {
      try {
        return JSON.parse(abi);
      } catch (e) {
        console.warn('Failed to parse ABI string:', e);
      }
    }
    return [];
  }

  /**
   * Parse and handle contract errors
   * @param error - The error object
   * @returns A more user-friendly error
   */
  private parseError(error: any): Error {
    // Default error message
    let message = error.message || 'An unknown error occurred';
    
    // Try to extract revert reason
    const revertReason = this.extractRevertReason(error);
    if (revertReason) {
      message = revertReason;
    }
    
    // Handle specific error cases
    if (error.code === 'CALL_EXCEPTION') {
      message = 'Contract call reverted';
    } else if (error.code === 'INVALID_ARGUMENT') {
      message = 'Invalid arguments provided to contract function';
    } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      message = 'Transaction would fail (check contract state or gas limit)';
    }
    
    // Handle transaction underpriced
    if (error.code === 'UNPREDICTABLE_GAS_LIMIT' || error.message?.includes('reverted')) {
      return new Error('Transaction failed. The contract may have reverted.');
    }
    
    // Handle contract revert with reason
    if (error.reason) {
      // Extract the revert reason if it's a JSON-RPC error
      const revertReason = this.extractRevertReason(error);
      return new Error(revertReason || `Transaction reverted: ${error.reason}`);
    }
    
    // Handle generic errors
    return error instanceof Error ? error : new Error('An unknown error occurred');
  }

  /**
   * Extract revert reason from error
   * @param error - The error object
   * @returns Extracted revert reason or null if not found
   */
  private extractRevertReason(error: any): string | null {
    try {
      if (error.data) {
        // Handle different error formats
        const errorData = typeof error.data === 'string' 
          ? error.data 
          : error.data.data || error.data.message;
        
        if (errorData) {
          // Try to extract revert reason from the error data
          const revertData = errorData.startsWith('0x') 
            ? errorData.substring(2) 
            : errorData;
          
          // Check if it's a standard revert with reason string
          if (revertData.startsWith('08c379a0')) { // Error(string) selector
            const reason = ethers.utils.defaultAbiCoder.decode(
              ['string'],
              '0x' + revertData.substring(8)
            );
            return reason[0];
          }
          
          // Check if it's a custom error
          // This would require the contract ABI to properly decode
          return 'Transaction reverted with custom error';
        }
      }
      
      return null;
    } catch (e) {
      console.error('Error extracting revert reason:', e);
      return null;
    }
  }

  /**
   * Helper to map order status enum to string
   * @param status - Numeric status code
   * @returns Human-readable status string
   */
  private mapOrderStatus(status: number): OrderStatus {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Completed';
      case 2: return 'Cancelled';
      default: return 'Pending'; // Default to Pending for unknown statuses
    }
  }

  /**
   * Get the registry contract instance
   */
  getRegistryContract(): ethers.Contract {
    return this.registryContract;
  }

  /**
   * Get the asset factory contract instance
   */
  getAssetFactoryContract(): ethers.Contract {
    return this.assetFactoryContract;
  }

  /**
   * Get the SPV factory contract instance
   */
  getSPVFactoryContract(): ethers.Contract {
    return this.spvFactoryContract;
  }

  /**
   * Get the Order Manager contract instance
   */
  getOrderManagerContract(): ethers.Contract {
    return this.orderManagerContract;
  }

  /**
   * Get the Asset contract instance
   */
  getAssetContract(): ethers.Contract {
    return this.assetContract;
  }

  /**
   * Get the SPV contract instance
   * @throws Error if SPV contract is not initialized
   */
  getSPVContract(): ethers.Contract {
    if (!this.spvContract) {
      throw new Error('SPV contract not initialized. Please provide SPV address in constructor.');
    }
    return this.spvContract;
  }

  /**
   * Get the Financial Ledger contract instance
   * @throws Error if Financial Ledger contract is not initialized
   */
  getFinancialLedgerContract(): ethers.Contract {
    if (!this.financialLedgerContract) {
      throw new Error('Financial Ledger contract not initialized');
    }
    return this.financialLedgerContract;
  }

  /**
   * Set the SPV contract address
   * @param spvAddress Address of the SPV contract
   */
  setSPVContract(spvAddress: string): void {
    this.spvContract = new ethers.Contract(
      spvAddress,
      OwnmaliSPVABI,
      this.signer
    ) as ethers.Contract;
  }

  /**
   * Set the Financial Ledger contract address
   * @param financialLedgerAddress Address of the Financial Ledger contract
   */
  setFinancialLedgerContract(financialLedgerAddress: string): void {
    this.financialLedgerContract = new ethers.Contract(
      financialLedgerAddress,
      this.getABI(OwnmaliFinancialLedgerABI),
      this.signer
    ) as ethers.Contract;
  }
}
