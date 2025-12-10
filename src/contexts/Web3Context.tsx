import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useToast } from '@/components/ui/use-toast';
import { ethers } from 'ethers';
import api from '@/lib/api';
// Import network utilities
import { checkAndSwitchToU2U, getNetworkInfo, isU2UNetwork, switchToU2UNetwork } from '@/lib/web3/networkUtils';

type WalletConnector = 'metaMask';

// Define U2U testnet chain
const u2uTestnet = {
  id: 2484,
  name: 'U2U Nebulas Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'U2U',
    symbol: 'U2U',
  },
  rpcUrls: {
    default: { http: ['https://rpc-nebulas-testnet.u2u.xyz'] },
    public: { http: ['https://rpc-nebulas-testnet.u2u.xyz'] },
  },
  blockExplorers: {
    default: { name: 'U2U Explorer', url: 'https://testnet.u2uscan.xyz' },
  },
  testnet: true,
} as const;

// Define U2U mainnet chain
const u2uMainnet = {
  id: 39,
  name: 'U2U Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'U2U',
    symbol: 'U2U',
  },
  rpcUrls: {
    default: { http: ['https://rpc-mainnet.u2u.xyz'] },
    public: { http: ['https://rpc-mainnet.u2u.xyz'] },
  },
  blockExplorers: {
    default: { name: 'U2U Explorer', url: 'https://u2uscan.xyz' },
  },
  testnet: false,
} as const;

type Web3ContextType = {
  isConnected: boolean;
  address: `0x${string}` | undefined;
  chainId: number | undefined;
  provider: ethers.providers.Web3Provider | null;
  connectWallet: (connectorId: WalletConnector) => Promise<boolean>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  connectionError: string | null;
  setConnectionError: (error: string | null) => void;
  currentConnector: WalletConnector | null;
  defaultWalletAddress: string | null;
  setWalletAsDefault: (address: string) => Promise<boolean>;
  checkDefaultWallet: (address: string) => Promise<boolean>;
  switchToU2UNetwork: () => Promise<{ success: boolean; message: string }>; // Add manual switch function
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const SUPPORTED_CHAINS = [
  {
    id: u2uTestnet.id,
    name: 'U2U Nebulas Testnet',
    isTestnet: true,
  },
  {
    id: u2uMainnet.id,
    name: 'U2U Mainnet',
    isTestnet: false,
  },
];

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnectionInProgress, setIsConnectionInProgress] = useState(false);
  const [currentConnector, setCurrentConnector] = useState<WalletConnector | null>(null);
  const [defaultWalletAddress, setDefaultWalletAddress] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('walletAddress');
    }
    return null;
  });
  
  const { connect, connectors, status } = useConnect({
    mutation: {
      onError: (error: Error) => {
        setConnectionError(error.message);
        setIsConnecting(false);
      },
      onSuccess: () => {
        setConnectionError(null);
        setIsConnecting(false);
      }
    }
  });
  
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  // Set client-side flag and handle wallet connection state
  useEffect(() => {
    setIsMounted(true);
    
    // Initialize provider if window.ethereum is available
    if (typeof window !== 'undefined' && window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
    }
    
    // Load saved wallet address from sessionStorage on mount
    const savedAddress = sessionStorage.getItem('walletAddress');
    if (savedAddress) {
      setDefaultWalletAddress(savedAddress);
    }
  }, []);
  
  // Save wallet address to sessionStorage when connected and verify chain
  useEffect(() => {
    const handleConnection = async () => {
      if (isConnected && address) {
        console.log('Wallet connected:', { address });
        
        // Use provider to get accurate network information
        let actualChainId: number | undefined = undefined;
        let networkInfo = null;
        if (typeof window !== 'undefined' && window.ethereum) {
          try {
            networkInfo = await getNetworkInfo();
            if (networkInfo) {
              actualChainId = networkInfo.chainId;
              console.log('Actual network from provider:', networkInfo);
              
              // Check if we're on the correct U2U network
              if (!isU2UNetwork(actualChainId)) {
                // Show a toast message indicating we're switching networks
                toast({
                  title: 'Network Switch Required',
                  description: 'Switching to U2U Network...',
                });
                
                // Try to switch to U2U network automatically
                const switched = await checkAndSwitchToU2U();
                if (switched) {
                  // Wait a bit for the network to switch
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  
                  // Recheck network after switching
                  const newNetworkInfo = await getNetworkInfo();
                  if (newNetworkInfo) {
                    actualChainId = newNetworkInfo.chainId;
                    console.log('Network after switching:', newNetworkInfo);
                    
                    // Show success message
                    toast({
                      title: 'Network Switched',
                      description: 'Successfully switched to U2U Network',
                    });
                  }
                } else {
                  const errorMsg = `Please manually switch to ${SUPPORTED_CHAINS.map(c => c.name).join(' or ')}`;
                  setConnectionError(errorMsg);
                  toast({
                    title: 'Network Switch Failed',
                    description: errorMsg,
                    variant: 'destructive',
                  });
                  console.warn(errorMsg, { currentChain: actualChainId, supportedChains: SUPPORTED_CHAINS });
                  return;
                }
              }
            }
          } catch (error) {
            console.error('Error getting network from provider:', error);
          }
        }
        
        // Verify we're on the correct chain
        const isSupportedChain = SUPPORTED_CHAINS.some(chain => chain.id === actualChainId);
        
        if (!isSupportedChain) {
          const errorMsg = `Unsupported chain. Please switch to ${SUPPORTED_CHAINS.map(c => c.name).join(' or ')}`;
          setConnectionError(errorMsg);
          toast({
            title: 'Unsupported Network',
            description: errorMsg,
            variant: 'destructive',
          });
          console.warn(errorMsg, { currentChain: actualChainId, supportedChains: SUPPORTED_CHAINS });
          return;
        }
        
        // Save to session storage
        sessionStorage.setItem('walletAddress', address);
        setDefaultWalletAddress(address);
        
        // Clear any previous errors
        setConnectionError(null);
      } else {
        sessionStorage.removeItem('walletAddress');
        setDefaultWalletAddress(null);
      }
    };
    
    handleConnection();
  }, [isConnected, address, toast]);

  // Handle connection status changes and errors
  useEffect(() => {
    console.log('Connection status:', status, 'Error:', connectionError);
    
    if (status === 'error' && connectionError) {
      console.error('Connection error:', connectionError);
      
      // Don't show error if it's just a connection in progress
      if (!connectionError.includes('already pending')) {
        toast({
          title: 'Connection Error',
          description: connectionError,
          variant: 'destructive',
        });
      }
      
      // Clear error after showing it
      const timer = setTimeout(() => {
        setConnectionError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    // Clear any existing errors on successful connection
    if (status === 'success' && isConnected) {
      setConnectionError(null);
    }
  }, [status, connectionError, toast, isConnected]);

  // Log available connectors for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })));
    }
  }, [connectors]);

  /**
   * Connect to a wallet using the specified connector
   */
  const connectWallet = useCallback(async (connectorId: WalletConnector) => {
    // Prevent multiple connection attempts
    if (isConnectionInProgress) {
      console.log('Connection already in progress, skipping duplicate request');
      return false;
    }

    try {
      setIsConnectionInProgress(true);
      setIsConnecting(true);
      setConnectionError(null);

      // Handle MetaMask wallet
      const connector = connectors.find(c => 
        c.id === connectorId || 
        c.name?.toLowerCase().includes(connectorId.toLowerCase())
      );

      if (!connector) {
        throw new Error(`Wallet ${connectorId} not found`);
      }

      // Connect to the wallet
      await connect({ connector });
      setCurrentConnector(connectorId);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setConnectionError(errorMessage);
      console.error('Wallet connection error:', error);
      throw error;
    } finally {
      setIsConnecting(false);
      setIsConnectionInProgress(false);
    }
  }, [connect, connectors]);

  /**
   * Disconnect the current wallet
   */
  const disconnectWallet = useCallback(() => {
    disconnect();
    setCurrentConnector(null);
  }, [disconnect]);

  const checkDefaultWallet = useCallback(async (address: string) => {
    if (!address) return false;
    
    // If no default wallet is set, return true to allow any wallet
    if (!defaultWalletAddress) {
      return true;
    }
    
    // Check if the connected wallet matches the default wallet
    return address.toLowerCase() === defaultWalletAddress.toLowerCase();
  }, [defaultWalletAddress]);

  const setWalletAsDefault = useCallback(async (address: string) => {
    try {
      // Call API to update default wallet
      await api.post('/user/update-wallet-address', { walletAddress: address });
      
      // Update local state and session storage
      setDefaultWalletAddress(address);
      sessionStorage.setItem('walletAddress', address);
      
      toast({
        title: 'Success',
        description: 'Default wallet address has been updated successfully.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error setting default wallet:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to set default wallet. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  // Manual network switch function
  const manualSwitchToU2UNetwork = useCallback(async () => {
    const result = await switchToU2UNetwork();
    if (result.success) {
      toast({
        title: 'Success',
        description: result.message,
      });
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
    return result;
  }, [toast]);

  // Only render children when client-side to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        address,
        chainId: undefined, // We're getting chainId from provider instead
        provider,
        connectWallet,
        disconnectWallet,
        isConnecting: status === 'pending',
        currentConnector,
        defaultWalletAddress,
        setWalletAsDefault,
        checkDefaultWallet,
        connectionError,
        setConnectionError,
        switchToU2UNetwork: manualSwitchToU2UNetwork, // Expose manual switch function
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}