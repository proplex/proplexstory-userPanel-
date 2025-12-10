import { useState, useEffect } from "react";
import api from "@/lib/httpClient";

interface Transaction {
  _id: string;
  txHash: string;
  from: string;
  to: string;
  symbol: string;
  amount: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  transactionType?: string;
}

interface Pagination {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    pagination: {
      total: number;
      page: number;
      totalPages: number;
      limit: number;
    };
  };
}

interface User {
  _id: string;
  // Add other user properties as needed
}

interface UseTransactionsParams {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string | null;
}

export const useTransactions = ({ 
  page = 1, 
  limit = 10, 
  status, 
  userId 
}: UseTransactionsParams = {}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 10,
  });

  // Fetch transactions when params change
  useEffect(() => {
    console.log('useEffect triggered with:', { page, limit, status, userId });
    if (userId) {
      console.log('Calling fetchTransactions with userId:', userId);
      fetchTransactions(userId);
    } else {
      console.log('No userId available, setting error');
      setLoading(false);
      setError("User ID is required");
    }
  }, [page, limit, status, userId]);

  // Add debug effect to log when transactions change
  useEffect(() => {
    console.log('Transactions updated:', { transactions, loading, error, pagination });
  }, [transactions, loading, error, pagination]);

  const fetchTransactions = async (currentUserId: string) => {
    console.log('fetchTransactions called with userId:', currentUserId);
    if (!currentUserId) {
      console.error('No currentUserId provided to fetchTransactions');
      setError("User ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      });

      const url = `/transactions/user/${currentUserId}?${params.toString()}`;
      console.log('Making API call to:', url);
      const response = await api.get<ApiResponse>(url);
      console.log('API response received:', response);
      
      console.log("API Response:", response.data);
      
      if (response.data.success) {
        setTransactions(response.data.data.transactions);
        setPagination({
          total: response.data.data.pagination.total,
          page: response.data.data.pagination.page,
          totalPages: response.data.data.pagination.totalPages,
          limit: response.data.data.pagination.limit
        });
      }
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError(err.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  // No need for this effect anymore as we're handling it in the user effect

  return {
    transactions,
    loading,
    error,
    pagination,
    refetch: fetchTransactions,
  };
};
