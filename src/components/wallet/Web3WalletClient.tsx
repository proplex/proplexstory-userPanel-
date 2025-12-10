"use client";

import {
  Copy,
  Wallet,
  CircleCheck,
  LinkIcon,
  AlertCircle,
  Key,
  Lock,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/app/profile1/ProfileContext";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import useUserDetails from "@/hooks/user/useUserDetail";
import api from "@/lib/httpClient";
import { useWeb3 } from "@/contexts/Web3Context";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Define types for API responses
interface PrimaryWalletResponse {
  primaryWallet: string;
}

const Web3WalletClient = () => {
  // Get wallet state from Web3Context
  const {
    isConnected,
    address: walletAddress,
    isConnecting,
    connectWallet,
    disconnectWallet,
    defaultWalletAddress: primaryWallet,
    chainId,
  } = useWeb3();

  const [isPrimaryWallet, setIsPrimaryWallet] = useState<boolean>(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [connectedSince] = useState<string | null>(
    new Date().toLocaleDateString()
  );
  const [error, setError] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  );
  const { updateProfile } = useProfile();
  const { data: userData } = useUserDetails();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);

  // Handle disconnection
  const handleDisconnectWallet = useCallback(() => {
    disconnectWallet();
    setBalance(null);
    setSigner(null);
    setError(null);
  }, [disconnectWallet]);

  // Check if connected wallet is the primary wallet and fetch details
  useEffect(() => {
    const checkAndFetchWallet = async () => {
      // Check session storage first
      const savedWallet = sessionStorage.getItem("walletDetails");

      if (walletAddress) {
        const isPrimary =
          primaryWallet &&
          walletAddress.toLowerCase() === primaryWallet.toLowerCase();
        setIsPrimaryWallet(!!isPrimary);

        try {
          await fetchWalletDetails(walletAddress);
        } catch (err) {
          console.error("Error fetching wallet details:", err);
        }
      } else if (savedWallet) {
        // If no wallet connected but we have saved session, try to restore
        try {
          const { address } = JSON.parse(savedWallet);
          if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();

            if (accounts.includes(address)) {
              // If the saved wallet is still connected, update the state
              const isPrimary =
                primaryWallet &&
                address.toLowerCase() === primaryWallet.toLowerCase();
              setIsPrimaryWallet(!!isPrimary);
              await fetchWalletDetails(address);
            }
          }
        } catch (err) {
          console.error("Error restoring wallet from session:", err);
          sessionStorage.removeItem("walletDetails");
        }
      } else {
        setIsPrimaryWallet(false);
      }
    };

    checkAndFetchWallet();
  }, [walletAddress, primaryWallet]);

  // Fetch wallet details including balance and network info
  const fetchWalletDetails = async (address: string) => {
    if (!window.ethereum) {
      throw new Error("Ethereum provider not found");
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);
      const ethBalance = ethers.utils.formatEther(balance);

      // Format balance with 4 decimal places
      const formattedBalance = `${parseFloat(ethBalance).toFixed(4)} ${
        network.name === "homestead" ? "ETH" : "MATIC"
      }`;

      setBalance(formattedBalance);

      // Get signer for the connected address
      const signer = provider.getSigner();
      setSigner(signer);

      // Save wallet details to session storage
      const walletDetails = {
        address,
        balance: ethBalance,
        chainId: network.chainId,
        network: network.name,
        connectedAt: new Date().toISOString(),
      };

      sessionStorage.setItem("walletDetails", JSON.stringify(walletDetails));

      // Update profile if updateProfile is available
      if (updateProfile) {
        await updateProfile({
          wallet: {
            address,
            balance: parseFloat(ethBalance),
            status: true,
            chainId: network.chainId,
          },
        });
      }

      return walletDetails;
    } catch (err) {
      console.error("Error fetching wallet details:", err);
      toast.error("Failed to fetch wallet details");
      throw err;
    }
  };

  // Load wallet details from session storage on component mount
  useEffect(() => {
    const loadWalletFromSession = async () => {
      try {
        const savedWallet = sessionStorage.getItem("walletDetails");
        if (savedWallet) {
          const { address, balance, chainId } = JSON.parse(savedWallet);

          // Check if the saved wallet is still connected
          if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();

            if (accounts.includes(address)) {
              await fetchWalletDetails(address);
            } else {
              // Clear session if wallet is not connected
              sessionStorage.removeItem("walletDetails");
            }
          }
        }
      } catch (err) {
        console.error("Error loading wallet from session:", err);
      }
    };

    loadWalletFromSession();
  }, []);

  // Handle wallet connection
  const handleConnectClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isConnecting) return;

    const connectButton = e.currentTarget as HTMLButtonElement;
    const previousText = connectButton.textContent;

    try {
      if (previousText) {
        connectButton.textContent = "Connecting...";
      }
      connectButton.disabled = true;

      if (!userData?.kycCompleted) {
        throw new Error(
          "Please complete your KYC verification before connecting a wallet"
        );
      }

      // Connect wallet using Web3Context
      await connectWallet("metaMask");

      if (walletAddress) {
        await fetchWalletDetails(walletAddress);
        toast.success("Wallet connected successfully");
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      setError(error.message || "Failed to connect wallet");
      toast.error(error.message || "Failed to connect wallet");
    } finally {
      if (connectButton) {
        connectButton.disabled = false;
        if (previousText) {
          connectButton.textContent = previousText;
        }
      }
    }
  };

  // Set wallet as primary
  const handleSetPrimaryWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress || !password) return;

    setIsSettingPrimary(true);
    try {
      await api.post("/user/set-primary-wallet", {
        walletAddress,
        password,
      });

      toast.success("Primary wallet set successfully!");
      setShowPasswordModal(false);
      setPassword("");
    } catch (err: any) {
      console.error("Failed to set primary wallet:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update primary wallet";
      toast.error(errorMessage);
    } finally {
      setIsSettingPrimary(false);
    }
  };

  // Copy wallet address to clipboard
  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard
        .writeText(walletAddress)
        .then(() => {
          toast.success("Wallet address copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy address");
        });
    }
  };

  // Toggle password modal
  const promptForPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPasswordModal(true);
  };

  // Sign message with connected wallet
  const signMessage = async () => {
    if (!signer) {
      toast.error("No signer available. Please connect wallet first.");
      return;
    }

    try {
      const message = "Sign this message to verify your wallet ownership";
      const signature = await signer.signMessage(message);
      toast.success("Message signed successfully");
      return signature;
    } catch (error) {
      console.error("Error signing message:", error);
      toast.error("Failed to sign message");
      throw error;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center">
          <Wallet className="w-6 h-6 text-blue-600 mr-2" />
          WEB 3 Wallet
        </h2>
        {isConnected ? (
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-4 py-1 rounded-full">
            <CircleCheck className="w-4 h-4 mr-1 inline-block" />
            Connected
          </span>
        ) : (
          <div className="space-y-4">
            {!userData?.kycCompleted ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle
                      className="h-5 w-5 text-yellow-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Please complete your KYC verification to connect a wallet.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <Button onClick={handleConnectClick} disabled={isConnecting}>
                <Wallet className="mr-2 h-4 w-4" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        )}
      </div>

      <p className="text-gray-500 mt-2">Wallet details</p>
      {primaryWallet && (
        <div className="mt-2 mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <Key className="w-4 h-4 mr-2 text-blue-500" />
            <p className="text-sm text-blue-700">
              Primary Wallet:{" "}
              <span className="font-mono text-xs">{primaryWallet}</span>
              {isPrimaryWallet && (
                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Current Wallet
                </span>
              )}
            </p>
          </div>
          {!isPrimaryWallet && isConnected && (
            <button
              onClick={promptForPassword}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Lock className="w-3 h-3 mr-1" />
              Set as Primary Wallet
            </button>
          )}
        </div>
      )}
      {isConnected && walletAddress ? (
        <div className="mt-5 p-6 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-5">
            <div>
              <p className="text-gray-600">Wallet ID</p>
              <div className="flex items-center">
                <code className="text-black mr-2">{walletAddress}</code>
                <Copy
                  size={16}
                  className="cursor-pointer"
                  onClick={copyToClipboard}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Wallet Balance</p>
              <p className="text-lg font-medium">{balance || "Loading..."}</p>
            </div>
          </div>
          <div className="text-left text-gray-400 mt-4">
            Connected Since
            <p className="text-black">{connectedSince}</p>
          </div>
        </div>
      ) : (
        <div className="mt-5 p-6 bg-gray-50 rounded-lg text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Wallet className="w-12 h-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">
              Wallet is not connected
            </h3>
            <p className="text-gray-500">
              {userData?.kycCompleted
                ? "Connect your wallet to view your balance and interact with the application."
                : "Please complete your KYC verification to connect a wallet."}
            </p>
            {userData?.kycCompleted && (
              <Button
                onClick={handleConnectClick}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Verify Your Identity</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please enter your password to set this wallet as your primary
              wallet.
            </p>

            <form onSubmit={handleSetPrimaryWallet}>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isSettingPrimary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSettingPrimary || !password.trim()}
                >
                  {isSettingPrimary ? "Updating..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Web3WalletClient;
