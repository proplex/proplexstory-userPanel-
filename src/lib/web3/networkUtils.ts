import { ethers } from "ethers";

export const U2U_CHAIN_IDS = [2484, 39]; // Testnet and Mainnet

export const isU2UNetwork = (chainId: number): boolean => {
  return U2U_CHAIN_IDS.includes(chainId);
};

export const getNetworkInfo = async (): Promise<{ chainId: number; name: string } | null> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    return {
      chainId: network.chainId,
      name: network.name
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    return null;
  }
};

export const checkAndSwitchToU2U = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false;
  }

  try {
    const networkInfo = await getNetworkInfo();
    if (!networkInfo) {
      return false;
    }

    console.log('Current network:', networkInfo);
    
    if (isU2UNetwork(networkInfo.chainId)) {
      console.log('Already on U2U network');
      return true;
    }

    // Try to switch to U2U testnet (2484) first
    try {
      console.log('Attempting to switch to U2U testnet (2484)');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x9b4' }], // 2484 in hex
      });
      console.log('Successfully switched to U2U testnet');
      return true;
    } catch (switchError: any) {
      console.log('Error switching to U2U testnet:', switchError);
      
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          console.log('Adding U2U testnet to wallet');
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x9b4',
                chainName: 'U2U Nebulas Testnet',
                nativeCurrency: {
                  name: 'U2U',
                  symbol: 'U2U',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-nebulas-testnet.u2u.xyz'],
                blockExplorerUrls: ['https://testnet.u2uscan.xyz'],
              },
            ],
          });
          console.log('Successfully added and switched to U2U testnet');
          return true;
        } catch (addError) {
          console.error('Error adding U2U testnet:', addError);
          return false;
        }
      }
      console.error('Error switching to U2U network:', switchError);
      return false;
    }
  } catch (error) {
    console.error('Error checking/switching network:', error);
    return false;
  }
};

// Manual network switch function that can be called from UI
export const switchToU2UNetwork = async (): Promise<{ success: boolean; message: string }> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return { success: false, message: 'MetaMask is not installed!' };
  }

  try {
    // First, try to switch to U2U Testnet (2484)
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x9b4' }], // 2484 in hex
    });
    return { success: true, message: 'Switched to U2U Testnet' };
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        // Add U2U Testnet network
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x9b4', // 2484 in hex
              chainName: 'U2U Nebulas Testnet',
              nativeCurrency: {
                name: 'U2U',
                symbol: 'U2U',
                decimals: 18,
              },
              rpcUrls: ['https://rpc-nebulas-testnet.u2u.xyz'],
              blockExplorerUrls: ['https://testnet.u2uscan.xyz'],
            },
          ],
        });
        return { success: true, message: 'Added and switched to U2U Testnet' };
      } catch (addError) {
        console.error('Failed to add U2U Testnet network:', addError);
        return { success: false, message: 'Failed to add U2U Testnet network. Please add it manually in MetaMask.' };
      }
    } else {
      console.error('Failed to switch to U2U Testnet network:', switchError);
      return { success: false, message: 'Failed to switch to U2U Testnet network. Please switch manually in MetaMask.' };
    }
  }
};