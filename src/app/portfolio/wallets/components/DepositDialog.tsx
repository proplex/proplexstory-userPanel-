'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  amount: string;
  fee: string;
  icon: string;
}

interface CryptoOption {
  symbol: string;
  name: string;
  amount: string;
  fiatValue: string;
}

interface DepositDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const fiatMethods: PaymentMethod[] = [
  {
    id: 'cashfree',
    name: 'Cashfree',
    description: 'For Indian users only',
    amount: '€112,945',
    fee: 'Platform fee (0.1%)',
    icon: 'C',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'For global users',
    amount: '€112,945',
    fee: 'Platform fee (0.1%)',
    icon: 'S',
  },
  {
    id: 'tazapay',
    name: 'Tazapay',
    description: 'For global users',
    amount: '€112,945',
    fee: 'Platform fee (0.1%)',
    icon: 'T',
  },
];

const cryptoOptions: CryptoOption[] = [
  {
    symbol: 'RYZX',
    name: 'RYZX',
    amount: '1,500 RYZX',
    fiatValue: '≈€82,500',
  },
  {
    symbol: 'USDT',
    name: 'USDT',
    amount: '1,500 USDT',
    fiatValue: '≈€82,500',
  },
  {
    symbol: 'USDC',
    name: 'USDC',
    amount: '1,500 USDC',
    fiatValue: '≈€82,500',
  },
];

export const DepositDialog: React.FC<DepositDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTab, setSelectedTab] = React.useState('fiat');
  const [amount, setAmount] = React.useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[700px]">
        <DialogHeader>
          <DialogTitle>Deposit</DialogTitle>
          <p className="text-sm text-gray-500">
            Load funds to your wallet quickly.
          </p>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="fiat" className="flex items-center gap-2">
              <span className="text-sm">💳</span> Using Fiat
            </TabsTrigger>
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <span className="text-sm">₿</span> Using Crypto
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fiat">
            {fiatMethods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center justify-between p-4 rounded-lg mb-2 border ${
                  method.id === 'cashfree' ? 'bg-blue-50 border-blue-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-gray-900 text-white flex items-center justify-center">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{method.amount}</div>
                  <div className="text-sm text-gray-500">{method.fee}</div>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button className="w-full mt-4">Continue</Button>
            </div>
          </TabsContent>

          <TabsContent value="crypto">
            {cryptoOptions.map((option) => (
              <div
                key={option.symbol}
                className="flex items-center justify-between p-4 rounded-lg mb-2 border hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    $
                  </div>
                  <div className="font-medium">{option.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{option.amount}</div>
                  <div className="text-sm text-gray-500">{option.fiatValue}</div>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button className="w-full mt-4">Get Address</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};