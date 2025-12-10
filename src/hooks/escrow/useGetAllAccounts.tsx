"use client";
import api from "@/lib/httpClient";
import React, { useState, useEffect } from "react";
interface BankDetail {
  id: string;
  user_id: number;
  name: string;
  bank_name: string;
  bank_account: string;
  bank_ifsc: string;
  verified: string; // You could use 'boolean' if you expect it to be true/fa
}
const useGetAllAccounts = () => {
  const [banks, setBanks] = useState<BankDetail[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAllBankAccounts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/v2/escrow/bank-accounts");
      const data = response.data.data;
    console.log(data)

      setBanks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBankAccounts();
  }, []);

  return { banks, error, loading };
};

export default useGetAllAccounts;
