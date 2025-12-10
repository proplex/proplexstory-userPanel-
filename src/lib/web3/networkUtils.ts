import { ethers } from "ethers";

// Updated for Story Protocol Aeneid Testnet
export const STORY_CHAIN_IDS = [1315]; // Aeneid Testnet

export const isStoryNetwork = (chainId: number): boolean => {
  return STORY_CHAIN_IDS.includes(chainId);
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

export const checkAndSwitchToStory = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false;
  }

  try {
    const networkInfo = await getNetworkInfo();
    if (!networkInfo) {
      return false;
    }

    console.log('Current network:', networkInfo);
    
    if (isStoryNetwork(networkInfo.chainId)) {
      console.log('Already on Story Protocol network');
      return true;
    }

    // Try to switch to Story Aeneid Testnet (1315) first
    try {
      console.log('Attempting to switch to Story Aeneid Testnet (1315)');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x523' }], // 1315 in hex
      });
      console.log('Successfully switched to Story Aeneid Testnet');
      return true;
    } catch (switchError: any) {
      console.log('Error switching to Story Aeneid Testnet:', switchError);
      
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          console.log('Adding Story Aeneid Testnet to wallet');
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x523',
                chainName: 'Story Aeneid Testnet',
                nativeCurrency: {
                  name: 'IP',
                  symbol: 'IP',
                  decimals: 18,
                },
                rpcUrls: ['https://aeneid.storyrpc.io'],
                blockExplorerUrls: ['https://aeneid.storyscan.io'],
              },
            ],
          });
          console.log('Successfully added and switched to Story Aeneid Testnet');
          return true;
        } catch (addError) {
          console.error('Error adding Story Aeneid Testnet:', addError);
          return false;
        }
      }
      console.error('Error switching to Story Protocol network:', switchError);
      return false;
    }
  } catch (error) {
    console.error('Error checking/switching network:', error);
    return false;
  }
};

// Manual network switch function that can be called from UI
export const switchToStoryNetwork = async (): Promise<{ success: boolean; message: string }> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return { success: false, message: 'MetaMask is not installed!' };
  }

  try {
    // First, try to switch to Story Aeneid Testnet (1315)
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x523' }], // 1315 in hex
    });
    return { success: true, message: 'Switched to Story Aeneid Testnet' };
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        // Add Story Aeneid Testnet network
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x523', // 1315 in hex
              chainName: 'Story Aeneid Testnet',
              nativeCurrency: {
                name: 'IP',
                symbol: 'IP',
                decimals: 18,
              },
              rpcUrls: ['https://aeneid.storyrpc.io'],
              blockExplorerUrls: ['https://aeneid.storyscan.io'],
            },
          ],
        });
        return { success: true, message: 'Added and switched to Story Aeneid Testnet' };
      } catch (addError) {
        console.error('Failed to add Story Aeneid Testnet network:', addError);
        return { success: false, message: 'Failed to add Story Aeneid Testnet network. Please add it manually in MetaMask.' };
      }
    } else {
      console.error('Failed to switch to Story Aeneid Testnet network:', switchError);
      return { success: false, message: 'Failed to switch to Story Aeneid Testnet network. Please switch manually in MetaMask.' };
    }
  }
};