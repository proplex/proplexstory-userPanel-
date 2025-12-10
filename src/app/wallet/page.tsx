"use client"

import dynamic from 'next/dynamic'
import ClientLayout from './ClientLayout'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const PortfolioDashboard = dynamic(() => import('./portfolio'), { ssr: false })

export default function WalletPage() {
  return (
    <ClientLayout>
      <div className='max-w-6xl py-4  mx-auto'>
        <Tabs defaultValue="portfolio" className='w-full'>
          <TabsList>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>
          <TabsContent value="portfolio">
            <PortfolioDashboard />
          </TabsContent>
          <TabsContent value="wallet">
            <h1>Wallet</h1>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
}
