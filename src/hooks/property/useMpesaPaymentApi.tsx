import { useState } from "react";
import { toast } from "react-toastify";
import axios from "@/lib/httpClient";

interface IMpesaPayment {
  phoneNumber: string;
  amount: number;
  propertyId: string;
  tokensBooked: string;
}

interface IMpesaPaymentResponse {
  success: boolean;
  data?: any;
  error?: string;
}

const useMpesaPaymentApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initiateMpesaPayment = async (paymentData: IMpesaPayment): Promise<IMpesaPaymentResponse> => {
    setLoading(true);
    setError(null);

    try {
      // Call your backend route for ABC Bank MPESA integration
      const response = await axios.post('/api/mpesa/abc-bank-payment', {
        phoneNumber: paymentData.phoneNumber,
        amount: paymentData.amount,
        propertyId: paymentData.propertyId,
        tokensBooked: paymentData.tokensBooked
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });

      if (response.data.success) {
        toast.success("MPESA payment request sent successfully! Please check your phone to complete the payment.");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.message || "Failed to initiate MPESA payment");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to initiate MPESA payment";
      toast.error(errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { initiateMpesaPayment, loading, error };
};

export default useMpesaPaymentApi;