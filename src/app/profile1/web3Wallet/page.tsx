'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Web3WalletClient component with SSR disabled
const Web3WalletClient = dynamic(
  () => import('@/components/wallet/Web3WalletClient'),
  { 
    ssr: false,
    loading: () => <div className="p-8">Loading wallet component...</div>
  }
);

const Web3WalletPage = () => {
  return <Web3WalletClient />;
};

export default Web3WalletPage;