"use client";
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '@/lib/httpClient';

interface TransactionDetails {
  id: string;
  type: string;
  txn_date: string;
  amount: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
}

interface UseFetchOrdersResult {
  transactions: TransactionDetails[];
  loading: boolean;
  error: string | null;
  dateRange: { from: Date; to: Date };
  setDateRange: (range: { from: Date; to: Date }) => void;
  pagination: PaginationInfo;
  handlePageChange: (newPage: number) => void;
}

const useFetchTransactions = (): UseFetchOrdersResult => {
  const [transactions, setTransactions] = useState<TransactionDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 10
  });

  const today = new Date();
  const defaultFrom = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const [dateRange, setDateRange] = useState({
    from: defaultFrom,
    to: today,
  });

  const fetchOrders = async (from: Date, to: Date, page: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/v2/escrow/statement', {
        params: {
          start_date: format(from, 'yyyy-MM-dd'),
          end_date: format(to, 'yyyy-MM-dd'),
          page_no: page,
          records_per_page: pagination.recordsPerPage,
        },
      });
      
      setTransactions(response.data.data || []);
      
      // Update pagination info from response
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: Math.ceil(response.data.total_records / pagination.recordsPerPage),
        totalRecords: response.data.total_records || 0
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchOrders(dateRange.from, dateRange.to, newPage);
  };

  useEffect(() => {
    fetchOrders(dateRange.from, dateRange.to, 1);
  }, [dateRange]);

  return { 
    transactions, 
    loading, 
    error, 
    dateRange, 
    setDateRange,
    pagination,
    handlePageChange
  };
};

export default useFetchTransactions;
