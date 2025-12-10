import React from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/contexts/Web3Context';

const NetworkSwitcher = () => {
  const { switchToU2UNetwork, connectionError } = useWeb3();

  const handleSwitchNetwork = async () => {
    await switchToU2UNetwork();
  };

  if (!connectionError || !connectionError.includes('Unsupported chain')) {
    return null;
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-yellow-800 mb-2">
        You are connected to an unsupported network. Please switch to U2U Network.
      </p>
      <Button onClick={handleSwitchNetwork} variant="default">
        Switch to U2U Network
      </Button>
    </div>
  );
};

export default NetworkSwitcher;