import {
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CheckAnimation from "../../../../../public/lottie-animations/check.json";
import LottieAnimation from "@/components/animation/LottieAnimation";
import { useRouter, useParams } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import ErrorAnimation from "../../../../../public/lottie-animations/Failure.json";
import { toTitleCase } from "@/lib/format.utility";
import { formatStringToTitleCase } from "@/constants/global";
import { ethers } from "ethers";
import { toast } from "sonner";
import axios from "@/lib/httpClient";
// Import Proplex functions
import { completeOrder } from "@/lib/web3/Proplex";
// Import network utilities
import { isU2UNetwork, getNetworkInfo } from "@/lib/web3/networkUtils";
// Import blockchain configuration
import { BLOCKCHAIN_CONFIG } from "@/config/blockchain";
import { Progress } from "@/components/ui/progress";

interface IAssetResponse {
  id: string;
  blockchainOrderManagerAddress: string;
  [key: string]: any;
}
interface OrderResponse {
  order?: {
    blockchainOrderId: string | number;
    transactionHash?: string;
    blockNumber?: number;
    from?: string;
    tokensBooked?: string;
  };
  data?: any;
  [key: string]: any;
}

interface InvestmentSummaryProps {
  open: boolean;
  openChange: (open: boolean) => void;
  response: OrderResponse;
}

//* ---------- 1.  New tiny helper ---------- */
// mini ABI for just symbol() → string
const MINI_ERC20_ABI = ["function symbol() external view returns (string)"];

/* ---------- 2.  Slightly richer interface ---------- */
interface TokenTransfer {
  token: string; // checksum address
  symbol: string; // human readable
  from: string;
  to: string;
  amount: string; // decimal string
  txHash: string; // 0x...
}

/* ---------- 3.  Enhanced parser ---------- */
async function getTokenTransfer(
  receipt: ethers.providers.TransactionReceipt,
  provider: ethers.providers.Provider
): Promise<TokenTransfer | null> {
  const TRANSFER_TOPIC =
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

  for (const l of receipt.logs) {
    if (l.topics[0] === TRANSFER_TOPIC && l.topics.length === 3) {
      const token = ethers.utils.getAddress(l.address); // checksum
      const tokenContract = new ethers.Contract(
        token,
        MINI_ERC20_ABI,
        provider
      );
      const symbol = await tokenContract.symbol(); // ← async call

      return {
        token,
        symbol,
        from: ethers.utils.getAddress("0x" + l.topics[1].slice(26)),
        to: ethers.utils.getAddress("0x" + l.topics[2].slice(26)),
        amount: BigInt(l.data).toString(10),
        txHash: receipt.transactionHash,
      };
    }
  }
  return null;
}

// Utility function to mask account number
const maskAccountNumber = (accountNumber: string): string => {
  if (!accountNumber || accountNumber === "N/A") return "N/A";

  const accountStr = accountNumber.toString();
  if (accountStr.length <= 6) return accountStr; // If too short, return as is

  const firstTwo = accountStr.substring(0, 2);
  const lastFour = accountStr.substring(accountStr.length - 4);
  const maskedMiddle = "*".repeat(accountStr.length - 6);

  return `${firstTwo}${maskedMiddle}${lastFour}`;
};

const InvestmentSummary = ({
  open,
  openChange,
  response,
}: InvestmentSummaryProps) => {
  // Handle both response formats (web2 and web3)
  const orderData = response?.data?.data?.order || response?.data?.order || response?.order as any;
  console.log(orderData , "orderData")

  const blockchainOrderId = orderData?.blockchainOrderId;
  const router = useRouter();
  const params = useParams();
  if (!params?.propertyID) {
    throw new Error("Property ID is required");
  }
  const propertyId = params.propertyID;
  const [isCompletingOrder, setIsCompletingOrder] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [progressValue, setProgressValue] = useState(8);

  // Determine status from response
  const hasData = Boolean(response?.data || response?.order);
  const isSuccess = Boolean(blockchainOrderId);
  const isFailed = !isSuccess;

  // Complete order on blockchain when blockchainOrderId is available
  useEffect(() => {
    if (!blockchainOrderId || orderCompleted) return;

    let isMounted = true;
    const completeOrderOnChain = async () => {
      try {
        if (!isMounted) return;

        setIsCompletingOrder(true);
        setOrderError(null);

        // ONLY WEB3 FLOW - Skip if not using blockchain completion
        if (!BLOCKCHAIN_CONFIG.USE_BLOCKCHAIN_COMPLETION) {
          setOrderCompleted(true);
          toast.success("Order completed successfully!");
          return;
        }

        // Get the connected wallet address and provider from session storage
        const walletAddress = sessionStorage.getItem("walletAddress");
        console.log("Wallet Address:", walletAddress);
        if (!walletAddress) {
          throw new Error(
            "No connected wallet found. Please connect your wallet first."
          );
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Check network
        const networkInfo = await getNetworkInfo();
        if (!networkInfo) {
          const errorMsg = "Failed to get network information.";
          toast.error(errorMsg);
          throw new Error(errorMsg);
        }

        console.log("Network from provider:", networkInfo);
        
        // Check if we're on the correct U2U network (testnet or mainnet)
        if (!isU2UNetwork(networkInfo.chainId)) {
          const errorMsg =
            "Please switch to U2U Network (either Testnet or Mainnet).";
          toast.error(errorMsg);
          throw new Error(errorMsg);
        }

        // Get order details including order manager address
        const response1 = await axios.get(`/assets/real-estate/${propertyId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Asset response:", response1);

        if (!response1.data || !response1.data.data) {
          console.error("Invalid response structure:", response1.data);
          throw new Error(
            "Failed to fetch asset details: Invalid response structure"
          );
        }

        const assetData = response1.data.data;
        console.log("Asset details:", assetData);

        // Check if tokenInformation exists and has blockchainOrderManagerAddress
        if (!assetData.tokenInformation) {
          console.error("Token information not found in response:", assetData);
          throw new Error("Token information not found in asset details");
        }

        const blockchainOrderManagerAddress =
          assetData.tokenInformation.blockchainOrderManagerAddress;

        if (!blockchainOrderManagerAddress) {
          console.error(
            "blockchainOrderManagerAddress not found in tokenInformation:",
            assetData.tokenInformation
          );
          throw new Error(
            "Blockchain order manager address not found in asset details"
          );
        }

        console.log(
          "Blockchain Order Manager Address:",
          blockchainOrderManagerAddress
        );

        // Use Proplex completeOrder function
        const txReceipt = await completeOrder(provider, {
          orderManagerAddress: blockchainOrderManagerAddress,
          orderId: blockchainOrderId.toString()
        });

        if (!isMounted) return;

        console.log("Transaction receipt:", txReceipt);

        // Parse token transfer from transaction receipt
        const tokenTransfer = await getTokenTransfer(txReceipt, provider);
        if (tokenTransfer) {
          console.log("Token Transfer Details:", tokenTransfer);

          // Create transaction record in the backend
          try {
            const response = await axios.post(
              "/transactions",
              {
                token: tokenTransfer.token,
                symbol: tokenTransfer.symbol,
                from: tokenTransfer.from,
                to: tokenTransfer.to,
                amount: tokenTransfer.amount,
                txHash: tokenTransfer.txHash,
                propertyId: propertyId,
                orderId: orderData?._id || orderData?.blockchainOrderId, // Use appropriate ID
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${sessionStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );

            console.log("Transaction record created:", response.data);
          } catch (error) {
            console.error("Failed to create transaction record:", error);
            // Don't fail the entire flow if transaction record creation fails
            toast.warning(
              "Transaction completed but failed to save record. Please contact support."
            );
          }
        }

        setOrderCompleted(true);
        toast.success("Order successfully completed on blockchain");
      } catch (error) {
        if (!isMounted) return;

        console.error("Error completing order on blockchain:", error);
        setOrderError(
          error instanceof Error
            ? error.message
            : "Failed to complete order on blockchain"
        );
        toast.error("Failed to complete order on blockchain");
      } finally {
        if (isMounted) {
          setIsCompletingOrder(false);
        }
      }
    };

    completeOrderOnChain();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [blockchainOrderId, orderCompleted]);

  // Timer + synthetic progress while completing order
  useEffect(() => {
    if (!isCompletingOrder) {
      setElapsedSeconds(0);
      setProgressValue(8);
      return;
    }

    const startedAt = Date.now();
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startedAt) / 1000);
      setElapsedSeconds(seconds);

      // Progress ramps quickly at first, then slows and caps at 92% until completion
      const next = Math.min(92, 8 + Math.floor(Math.sqrt(seconds) * 18));
      setProgressValue(next);
    }, 500);

    return () => clearInterval(interval);
  }, [isCompletingOrder]);

  useEffect(() => {
    if (orderCompleted) {
      // Snap progress to 100% briefly to indicate completion
      setProgressValue(100);
    }
  }, [orderCompleted]);

  const formatElapsed = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogContent
        className="w-full max-w-[450px] h-auto overflow-y-auto p-6 rounded-xl"
        onInteractOutside={(e) => {
          e.preventDefault();
        }
      }
      >
        <DialogHeader className="border-b border-gray-200 ">
          <DialogTitle className="text-lg font-bold ">
            {isSuccess ? "Investment Successful!" : "Transaction Failed"}
          </DialogTitle>
        </DialogHeader>

       <div className="mt-6 space-y-4">
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 md:w-24 md:h-24 rounded-full bg-transparent items-center justify-center">
              <LottieAnimation
                animationData={isSuccess ? CheckAnimation : ErrorAnimation}
                style={{ width: "100%", height: "100%", zIndex: 20 }}
              />
            </div>
            <h1 className="text-2xl font-bold">
              {isSuccess ? " You've  Successfully Invested" : "Transaction Failed"}
            </h1>
            <p className="text-black">
              {isSuccess
                ? `Order Status: ${
                    toTitleCase(orderData?.currentStatus) || "Created"
                  }`
                : isFailed
                ? response?.data?.message ||
                  "The transaction could not be completed"
                : "Transaction status unknown"}
            </p>
          </div>
          
          {/* Transaction details section - show blockchain details */}
          {isSuccess && orderData?.transactionHash && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-blue-700 mb-2">
                Blockchain Transaction
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaction Hash</span>
                <span className="font-medium text-xs">
                  {orderData.transactionHash.substring(0, 6)}...{orderData.transactionHash.substring(orderData.transactionHash.length - 4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Block Number</span>
                <span className="font-medium">
                  {orderData.blockNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tokens Booked</span>
                <span className="font-medium">
                  {orderData.tokensBooked}
                </span>
              </div>
            </div>
          )}

          {isFailed && response?.status === "FAILED" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Reference ID</span>
                <span className="font-medium">
                  {response?.reference_id || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">KES {response?.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-red-600">
                  {response?.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium">
                  {formatDate(response?.date)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Account Number</span>
                <span className="font-medium">
                  {maskAccountNumber(response?.account_no)}
                </span>
              </div>
            </div>
          )}
        </div> 

        {isSuccess && (
          <div className="w-full flex justify-between items-center gap-5">
            <Button
              variant="outline"
              onClick={() => openChange(false)}
              className="w-full"
            >
              Explore more Assets
            </Button>
            {isSuccess && (
              <Button
                onClick={() => router.push(`/my-orders/${orderData?._id || orderData?.blockchainOrderId}`)}
                className="w-full flex items-center justify-center"
              >
                Track Order
              </Button>
            )}
          </div>
        )}
        {isFailed && (
          <div className="w-full flex justify-between items-center gap-5">
            <Button
              variant="outline"
              onClick={() => openChange(false)}
              className="w-full"
            >
              Please try again later
            </Button>
          </div>
        )}

        {/* Escrow notice */}
       

        {isSuccess && (
          <div className="w-full space-y-2">
            {isCompletingOrder && (
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Completing order on blockchain...</span>
                  <span className="tabular-nums">{formatElapsed(elapsedSeconds)}</span>
                </div>
                <Progress value={progressValue} />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{progressValue}%</span>
                  <span>Do not close this window</span>
                </div>
              </div>
            )}
            {orderError && (
              <div className="text-center text-sm text-red-600">
                {orderError}
              </div>
            )}
            <Button
              onClick={() => {
                openChange(false);
                window.location.reload();
              }}
              className="w-full bg-primary text-white"
              disabled={isCompletingOrder}
            >
              {isCompletingOrder ? "Processing..." : "Done"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentSummary;