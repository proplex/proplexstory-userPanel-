'use client'

import api from '@/lib/httpClient';
import { useState, useEffect, useCallback } from 'react';

const useInvestorApi = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const[mobile, setMobile] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Making API call to /user/investor');
      
      const userResponse = await api.get('/user/investor');
      console.log('API Response:', {
        status: userResponse.status,
        hasData: !!userResponse.data,
        dataStructure: userResponse.data ? Object.keys(userResponse.data) : null
      });
      console.log("api resposne in useinvestro:",userResponse);

      if (userResponse.status !== 200) {
        throw new Error(`Failed to fetch investor data: ${userResponse.status}`);
      }

      if (!userResponse.data?.data) {
        console.warn('API response missing expected data structure');
      }
      
      setData(userResponse.data?.data);
      setMobile(userResponse.data?.data?.mobileNumber);
    } catch (err: any) {
      console.error('Fetch error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.message || 'Something went wrong');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = window.sessionStorage?.getItem('accessToken');
      const refreshToken = window.sessionStorage?.getItem('refreshToken');
      
      console.log('Auth tokens:', { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
      
      if (accessToken && refreshToken) {
        console.log('Initiating investor data fetch');
        fetchData();
      } else {
        console.warn('Missing required tokens for API call');
      }
    }
  }, [fetchData]);

  return { data, loading, error, fetchData, mobile };
};

export default useInvestorApi;