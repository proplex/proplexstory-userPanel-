import { useState } from "react";

import { toast } from "react-toastify";
import { ethers } from "ethers";
import { jwtDecode } from "jwt-decode";
import axios from "@/lib/httpClient";
import { useWeb3 } from "@/contexts/Web3Context";
// Import Proplex functions
import { createOrder, getTokenBalance, getTokenAllowance } from "@/lib/web3/Proplex";
import { CONTRACT_ADDRESSES } from "@/lib/web3/Proplex";
// Import network utilities
import { isU2UNetwork, getNetworkInfo } from "@/lib/web3/networkUtils";
// Import blockchain configuration
import { BLOCKCHAIN_CONFIG } from "@/config/blockchain";

interface JwtPayload {
  _id: string;
  [key: string]: any;
}

const getUserIdFromToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const tokenValue = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwtDecode<JwtPayload>(tokenValue);
    return decoded._id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

interface IAssetResponse {
  id: string;
  blockchainOrderManagerAddress: string;

  [key: string]: any;
}

interface IOrderPlace {
  tokensBooked: string; // String representation of the token amount (e.g., "1000000000000000000" for 1 token with 18 decimals)
  paymentValue?: string; // String representation of ETH value to send (optional)
}

// Remove provider from interface since we create it inside the hook
interface PlaceOrderApiProps {
  propertyID: string;
  order: IOrderPlace;
}

const usePlaceOrderApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { address: walletAddress, isConnected } = useWeb3();

  const placeOrder = async ({ propertyID, order }: PlaceOrderApiProps) => {
    if (!isConnected || !walletAddress) {
      const errorMsg =
        "Wallet not connected. Please connect your wallet first.";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }

    setLoading(true);
    setError(null);

    try {
      // Create provider inside the hook
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
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

      // Get asset details including order manager address
      const { data: assetData } = await axios.get<IAssetResponse>(
        `/assets/real-estate/${propertyID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!assetData) {
        throw new Error("Failed to fetch asset details");
      }

      console.log("Asset details:", assetData);
      
      // Try to get token address from different possible fields

      
      console.log("Order Manager Address:", assetData.data.tokenInformation.blockchainOrderManagerAddress);
      
      

      // Check investor's token balance (only if tokenAddress exists)
      
      // Use the provided paymentValue or default to "0"
      const paymentValue = order.paymentValue || "0";
      console.log("payment final is here:", paymentValue);
      
      // Log the parameters being sent to createOrder
      console.log("Creating order with params:", {
        orderManagerAddress: assetData.data.tokenInformation.blockchainOrderManagerAddress,
        investor: walletAddress,
        amount: order.tokensBooked,
        paymentValue: paymentValue
      });

      // Use Proplex createOrder function on blockchain
      // The tokensBooked is already a proper BigNumber string, so we don't need to convert it again
      const txReceipt = await createOrder(provider, {
        orderManagerAddress: assetData.data.tokenInformation.blockchainOrderManagerAddress,
        investor: walletAddress,
        amount: order.tokensBooked, // Already a BigNumber string from the frontend
        paymentValue: paymentValue // Use the actual payment value
      });

      console.log("Transaction mined in block:", txReceipt);
      
      // Extract orderId from events
      const orderCreatedEvent = txReceipt.events?.find(
        (e: any) => e.event === 'OrderCreated'
      );
      
      let orderId;
      if (orderCreatedEvent) {
        orderId = orderCreatedEvent.args?.orderId.toString();
        console.log('Order ID:', orderId);
      } else {
        throw new Error("Failed to extract order ID from transaction receipt");
      }

      // ONLY WEB3 FLOW - Skip web2 database operations if configured
      if (!BLOCKCHAIN_CONFIG.USE_WEB2_DATABASE) {
        // Return early with just blockchain data
        const result = {
          blockchainOrderId: Number(orderId),
          transactionHash: txReceipt.transactionHash,
          blockNumber: txReceipt.blockNumber,
          from: walletAddress,
          tokensBooked: ethers.utils.formatUnits(order.tokensBooked, 18),
        };
        
        toast.success("Order placed on blockchain successfully!");
        return result;
      }

      // WEB2 + WEB3 COMBINED FLOW (only if USE_WEB2_DATABASE is true)
      const token = sessionStorage.getItem("accessToken");
      const userId = getUserIdFromToken(token);

      if (!userId) {
        throw new Error("Failed to authenticate user. Please login again.");
      }

      // Prepare order payload with blockchain data
      const orderPayload = {
        assetId: propertyID,
        investorId: userId,
        tokensBooked: ethers.utils.formatUnits(order.tokensBooked, 18),
        blockchainOrderId: Number(orderId),
        transactionHash: txReceipt.transactionHash,
        blockNumber: txReceipt.blockNumber,
        from: walletAddress,
      };

      console.log("Payload", orderPayload);

      try {
        // Create the order in the database
        const { data: createdOrder } = await axios.post(
          `/orders/?assetId=${propertyID}`,
          orderPayload,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
              "walletAddress": walletAddress
            },
          }
        );

        console.log("Order created with pending status:", createdOrder);

        toast.success("Order placed and processed successfully!");
        return createdOrder;
      } catch (error: any) {
        console.error("Error in order processing:", error);
        // If web2 fails, still return the blockchain data
        const result = {
          blockchainOrderId: Number(orderId),
          transactionHash: txReceipt.transactionHash,
          blockNumber: txReceipt.blockNumber,
          from: walletAddress,
          tokensBooked: ethers.utils.formatUnits(order.tokensBooked, 18),
          web2Error: error.message
        };
        return result;
      }
    } catch (error: any) {
      console.error("Order placement error:", error);
      
      // Provide more detailed error information
      let errorMessage = "Failed to place order";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.reason) {
        errorMessage = `Smart contract error: ${error.reason}`;
      }
      
      if (error.data?.message) {
        errorMessage = `Smart contract error: ${error.data.message}`;
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { placeOrder, loading, error };
};

export default usePlaceOrderApi;