import api from "@/lib/httpClient";
import { useState } from "react";

interface WithdrawFundResponse {
  message: string;
  data: {
    txnid: number;
    amount: number;
    bank_account_id: number;
    created_at: string;
    id: number;
    status: string;
    updated_at: string;
  };
}
const useWithDraw = () => {
  const [response,setResponse] = useState<WithdrawFundResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const withDraw = async (
    amount: number,
    bankAccountId: string
  )=> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/v2/escrow/withdraw-fund", {
        amount: amount,
        bank_id: bankAccountId,
      });
      setIsLoading(false);
      setResponse(response.data);
      return response.data.data;
    } catch (err: any) {
      setIsLoading(false);

      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
      return null;
    }
  };

  return { isLoading, error, withDraw,response };
};

export default useWithDraw;
