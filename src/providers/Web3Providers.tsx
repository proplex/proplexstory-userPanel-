'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http, createStorage } from 'wagmi';
import { mainnet, polygon } from 'viem/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';
import { Web3Provider } from '@/contexts/Web3Context';

// Define Polygon Amoy testnet
const polygonAmoy = {
  id: 80002,
  name: 'Polygon Amoy',
  network: 'amoy',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology'] },
    public: { http: ['https://rpc-amoy.polygon.technology'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
} as const;

// Configure chains & providers
const config = createConfig({
  chains: [polygon, polygonAmoy, mainnet],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    injected({
      target: 'trustWallet',
    }),
    coinbaseWallet({
      appName: 'OwnMali',
    }),
  ],
  storage: createStorage({
    key: 'wagmi',
    storage: {
      getItem: (key) => (typeof window !== 'undefined' ? window.localStorage.getItem(key) : null),
      setItem: (key, value) => {
        if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        if (typeof window !== 'undefined') window.localStorage.removeItem(key);
      },
    },
  }),
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          {children}
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </Web3Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
