import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useWeb3 } from '@/contexts/Web3Context';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface SetDefaultWalletDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  walletAddress: string;
  onSuccess?: () => void;
}

export function SetDefaultWalletDialog({
  isOpen,
  onOpenChange,
  walletAddress,
  onSuccess,
}: SetDefaultWalletDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setWalletAsDefault } = useWeb3();
  const { toast } = useToast();

  const handleSetAsDefault = async () => {
    try {
      setIsLoading(true);
      const success = await setWalletAsDefault(walletAddress);
      
      if (success) {
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Failed to set default wallet:', error);
      toast({
        title: 'Error',
        description: 'Failed to set default wallet. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set as Default Wallet</DialogTitle>
          <DialogDescription className="pt-2">
            Do you want to set this as your default wallet address? This will be used for all future transactions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm break-all">
          {walletAddress}
        </div>
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSetAsDefault}
            disabled={isLoading}
            className="ml-2"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Set as Default
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
