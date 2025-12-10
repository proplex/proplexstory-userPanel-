"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type InstallGuideDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  walletId: 'metaMask' | 'trustWallet' | 'coinbaseWallet' | 'binanceWallet' | 'phantom' | null;
};

const TITLES: Record<string, string> = {
  metaMask: 'Install MetaMask',
  trustWallet: 'Install Trust Wallet Extension',
  coinbaseWallet: 'Install Coinbase Wallet Extension',
  binanceWallet: 'Install Binance Wallet',
  phantom: 'Install Phantom',
};

const LINKS: Record<string, string> = {
  metaMask: 'https://metamask.io/download/',
  trustWallet: 'https://trustwallet.com/browser-extension',
  coinbaseWallet: 'https://www.coinbase.com/wallet/extension',
  binanceWallet: 'https://www.bnbchain.org/en/wallets',
  phantom: 'https://phantom.app/download',
};

export function InstallGuideDialog({ isOpen, onOpenChange, walletId }: InstallGuideDialogProps) {
  const title = walletId ? TITLES[walletId] : 'Install a Wallet Extension';
  const link = walletId ? LINKS[walletId] : 'https://metamask.io/download/';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            Follow these steps to install and set up your wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click the button below to open the official installation page.</li>
            <li>Add the extension to your browser and complete the setup.</li>
            <li>Create a wallet or import an existing one with your seed phrase.</li>
            <li>Return to proplex and click Connect Wallet again.</li>
          </ol>

          <div className="rounded-md bg-muted p-3 text-xs">
            Tip: Keep your seed phrase secure and never share it with anyone.
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={() => window.open(link, '_blank', 'noopener')} className="px-6">
              Open Install Page
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

