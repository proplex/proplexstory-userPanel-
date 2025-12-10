import api from "@/lib/httpClient";
import { useState } from "react";
import { toast } from "react-toastify";

interface CancelData {
  reason: string;
}

const useDeleteRaiseCancel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

    const deleteCancel = async (orderId: number) => {
    if (!orderId || isNaN(orderId)) {
      throw new Error("Invalid order ID");
    }

    try {               
      setIsLoading(true);
      setError(null);

      const response = await api.delete(`/v2/cancel/${orderId}`);

      setSuccess("Cancel request deleted successfully");
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to cancel order";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

return { deleteCancel, isLoading, error, success };
};

export default useDeleteRaiseCancel;