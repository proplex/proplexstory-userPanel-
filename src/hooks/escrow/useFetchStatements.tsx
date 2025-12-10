import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '@/lib/httpClient';

const useFetchOrders = (from :any, to:any, getAuthToken:any) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.post('/v2/escrow/statement', {
          page_no: 1,
          records_per_page: 1000,
          start_date: format(from, 'yyyy-MM-dd'),
          end_date: format(to, 'yyyy-MM-dd')
        });
        
        setOrders(response.data.data || []);
      } catch (err:any) {
        setError(err.response?.data?.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [from, to, getAuthToken]);

  return { orders, loading, error };
};

export default useFetchOrders;
