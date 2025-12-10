import { useState, useEffect } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2 } from 'lucide-react';
import { WalletConnectModal } from './WalletConnectModal';

const METAMASK_ICON = '/metamaskW.png';

export function ConnectWalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    isConnected, 
    address, 
    isConnecting, 
    connectionError 
  } = useWeb3();

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle successful connection
  useEffect(() => {
    if (isConnected && address) {
      console.log('Wallet connected successfully:', { address });
      try {
        // Fallback: persist to sessionStorage (Web3Context also does this)
        sessionStorage.setItem('walletAddress', address);
      } catch {}
      // Close the modal on successful connection
      setIsModalOpen(false);
    } else {
      try {
        sessionStorage.removeItem('walletAddress');
      } catch {}
    }
  }, [isConnected, address]);

  // Display connected state
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2">
          <img src={METAMASK_ICON} alt="MetaMask" className="h-4 w-4" />
          {truncateAddress(address)}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button 
          onClick={() => setIsModalOpen(true)}
          disabled={isConnecting}
          className="gap-2 bg-black hover:bg-black/80"
          variant={connectionError ? 'destructive' : 'default'}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <img src={METAMASK_ICON} alt="MetaMask" className="h-4 w-4" />
              {connectionError ? 'Retry Connection' : 'Connect MetaMask'}
            </>
          )}
        </Button>
        
        {connectionError && (
          <p className="text-xs text-red-500 max-w-[200px] text-center">
            {connectionError}
          </p>
        )}
      </div>
      
      <WalletConnectModal 
        isOpen={isModalOpen} 
        onOpenChange={(open) => {
          setIsModalOpen(open);
          // Clear errors when opening the modal
          if (open && connectionError) {
            const { setConnectionError } = useWeb3();
            setConnectionError(null);
          }
        }}
      />
    </>
  );
}
