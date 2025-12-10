import { useState, useEffect, useCallback } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SetDefaultWalletDialog } from "./SetDefaultWalletDialog";
import { InstallGuideDialog } from "./InstallGuideDialog";

const WALLETS = [
  {
    id: "metaMask",
    name: "MetaMask",
    icon: "/metamaskW.png",
    description: "Connect to your MetaMask Wallet",
  },
];

const INSTALL_LINKS: Record<string, string> = {
  metaMask: "https://metamask.io/download/",
};

type WalletConnectModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function WalletConnectModal({
  isOpen,
  onOpenChange,
}: WalletConnectModalProps) {
  const {
    connectWallet,
    isConnected,
    isConnecting,
    currentConnector,
    checkDefaultWallet,
    defaultWalletAddress,
    address,
  } = useWeb3();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showSetDefaultDialog, setShowSetDefaultDialog] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [pendingWalletId, setPendingWalletId] = useState<
    | "metaMask"
    | "trustWallet"
    | "coinbaseWallet"
    | "binanceWallet"
    | "phantom"
    | null
  >(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      setSelectedWallet(null);
      setConnectedAddress(null);
    };
  }, []);

  // Handle wallet connection and permission requests
  const requestWalletConnection = async (walletId: "metaMask") => {
    console.log("Connecting to wallet:", walletId);
    await connectWallet(walletId);

    if (!window.ethereum) {
      // Handle EVM wallets (MetaMask, Trust, etc.)
      if (!window.ethereum) {
        // Signal to caller that no provider is present so it can guide the user
        const noProviderError = new Error("NO_PROVIDER");
        (noProviderError as any).reason = "No Ethereum provider found";
        (noProviderError as any).walletId = walletId;
        throw noProviderError;
      }

      console.log("Requesting accounts...");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts?.[0];

      if (!address) {
        throw new Error(
          "No wallet address found. Please make sure your wallet is unlocked and try again."
        );
      }

      return address;
    }
  };

  // Handle wallet connection and default wallet check
  const handleConnect = useCallback(
    async (walletId: "metaMask") => {
      try {
        setSelectedWallet(walletId);

        // Connect to wallet and get address
        const address = await requestWalletConnection(walletId);
        setConnectedAddress(address);

        // Check if this is the default wallet
        const isDefaultWallet = await checkDefaultWallet(address);

        // If no default wallet is set, show the set default dialog
        if (defaultWalletAddress === null) {
          setShowSetDefaultDialog(true);
          return;
        }

        // If this is not the default wallet, show an error
        if (!isDefaultWallet) {
          toast({
            title: "Wallet Mismatch",
            description:
              "This is not your default wallet address. Please connect with your default wallet.",
            variant: "destructive",
          });
          onOpenChange(false);
          return;
        }

        onOpenChange(false);
        setSelectedWallet(null);
      } catch (error) {
        console.error("Failed to connect to wallet:", error);
        setSelectedWallet(null);

        // Special handling: no provider installed → guide user and open install page
        if (error instanceof Error && error.message === "NO_PROVIDER") {
          const link =
            INSTALL_LINKS[walletId] || "https://metamask.io/download/";
          setPendingWalletId(walletId);
          setShowInstallGuide(true);
          toast({
            title: "Wallet Extension Required",
            description: `No compatible wallet extension was detected. Follow the installation guide.`,
          });
          return;
        }

        let errorMessage = "Failed to connect with wallet. Please try again.";
        if (error instanceof Error) {
          if (error.message.includes("User rejected the request")) {
            errorMessage = "Connection was rejected. Please try again.";
          } else if (error.message.includes("already pending")) {
            errorMessage =
              "A wallet connection is already in progress. Please check your wallet.";
          } else {
            errorMessage = error.message;
          }
        }

        toast({
          title: "Connection Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    [
      connectWallet,
      checkDefaultWallet,
      defaultWalletAddress,
      toast,
      onOpenChange,
    ]
  );

  // Close modal when connected and default wallet is set (if needed)
  useEffect(() => {
    if (isConnected && isMounted && !showSetDefaultDialog) {
      onOpenChange(false);
      setSelectedWallet(null);
    }
  }, [isConnected, isMounted, onOpenChange, showSetDefaultDialog]);

  if (!isMounted) return null;

  const handleSetDefaultSuccess = () => {
    setShowSetDefaultDialog(false);
    onOpenChange(false);
    setSelectedWallet(null);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          onOpenChange(open);
          if (!open) {
            setSelectedWallet(null);
            setConnectedAddress(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {selectedWallet ? "Connect Wallet" : "Choose a Wallet"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {selectedWallet
                ? `Connecting to ${
                    WALLETS.find((w) => w.id === selectedWallet)?.name
                  }...`
                : "Select a wallet to connect to your account"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">
            {!selectedWallet ? (
              WALLETS.map((wallet) => (
                <Button
                  key={wallet.id}
                  variant="outline"
                  className="h-16 justify-start px-4 py-2 text-left"
                  onClick={() => handleConnect(wallet.id as "metaMask")
                  }
                >
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="h-8 w-8 mr-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/wallets/wallet.svg";
                    }}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {wallet.description}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">
                  Opening {WALLETS.find((w) => w.id === selectedWallet)?.name}
                  ...
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Check your wallet to complete the connection
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Set Default Wallet Dialog */}
      {connectedAddress && (
        <SetDefaultWalletDialog
          isOpen={showSetDefaultDialog}
          onOpenChange={setShowSetDefaultDialog}
          walletAddress={connectedAddress}
          onSuccess={handleSetDefaultSuccess}
        />
      )}

      {/* Installation Guide Dialog */}
      <InstallGuideDialog
        isOpen={showInstallGuide}
        onOpenChange={setShowInstallGuide}
        walletId={pendingWalletId}
      />
    </>
  );
}
