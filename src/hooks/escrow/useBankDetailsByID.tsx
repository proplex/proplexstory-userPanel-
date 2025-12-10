"use client";

import api from "@/lib/httpClient";
import { useEffect, useState } from "react";

const useBankDetailsByID = (bankID: string) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getBankByID = async (id: string) => {
      try {
        setIsLoading(true);
        if(bankID === ""){
            throw new Error("Bank ID is required to retrieve bank information");
        }
        const response = await api.get(`/v2/escrow/bank-accounts/${id}`);
        const bankData = response?.data?.data;
        setData(bankData);
      } catch (error: any) {
        setError(error.message || error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getBankByID(bankID);
  }, [bankID]);

  return { data, error, isLoading };
};

export default useBankDetailsByID;
