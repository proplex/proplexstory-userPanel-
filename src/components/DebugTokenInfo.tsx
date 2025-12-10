import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/contexts/Web3Context';
import { getTokenBalance, getTokenAllowance } from '@/lib/web3/Proplex';
import { Button } from '@/components/ui/button';

interface DebugTokenInfoProps {
  tokenAddress: string;
  orderManagerAddress: string;
  propertyId: string;
}

const DebugTokenInfo: React.FC<DebugTokenInfoProps> = ({ 
  tokenAddress, 
  orderManagerAddress,
  propertyId
}) => {
  const { address: walletAddress, isConnected } = useWeb3();
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [tokenAllowance, setTokenAllowance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const checkBalances = async () => {
    if (!isConnected || !walletAddress) return;
    
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Check token balance
      const balance = await getTokenBalance(provider, tokenAddress, walletAddress);
      setTokenBalance(ethers.utils.formatUnits(balance, 18));
      
      // Check token allowance
      const allowance = await getTokenAllowance(provider, tokenAddress, walletAddress, orderManagerAddress);
      setTokenAllowance(ethers.utils.formatUnits(allowance, 18));
      
      console.log('Debug Info:', {
        walletAddress,
        tokenAddress,
        orderManagerAddress,
        tokenBalance: ethers.utils.formatUnits(balance, 18),
        tokenAllowance: ethers.utils.formatUnits(allowance, 18)
      });
    } catch (error) {
      console.error('Error checking balances:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && walletAddress) {
      checkBalances();
    }
  }, [isConnected, walletAddress, tokenAddress, orderManagerAddress]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
      <h3 className="text-lg font-semibold mb-2">Debug Token Information</h3>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Property ID:</span> {propertyId}
        </div>
        <div>
          <span className="font-medium">Wallet Address:</span> {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}
        </div>
        <div>
          <span className="font-medium">Token Address:</span> {tokenAddress?.substring(0, 6)}...{tokenAddress?.substring(tokenAddress.length - 4)}
        </div>
        <div>
          <span className="font-medium">Order Manager:</span> {orderManagerAddress?.substring(0, 6)}...{orderManagerAddress?.substring(orderManagerAddress.length - 4)}
        </div>
        <div>
          <span className="font-medium">Token Balance:</span> {tokenBalance} tokens
        </div>
        <div>
          <span className="font-medium">Token Allowance:</span> {tokenAllowance} tokens
        </div>
      </div>
      <Button 
        onClick={checkBalances} 
        disabled={loading || !isConnected}
        className="mt-2"
        size="sm"
      >
        {loading ? 'Checking...' : 'Refresh Balances'}
      </Button>
    </div>
  );
};

export default DebugTokenInfo;