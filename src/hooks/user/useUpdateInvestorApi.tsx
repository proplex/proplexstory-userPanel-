// /user/investor/
import api from '@/lib/httpClient';
import React, { useState } from 'react'

type UserProfile = {
  fullName?: string;
  country?: string;
  avatar?: string;
  countryCode?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string; // Use only dob, remove dateOfBirth

  type?: 'individual' | 'organization';
  password?: string;
  mobileNumber?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  }|null;
  wallet?: {
    address: string | null;
    balance: number;
    status: boolean;
  };
};

const useUpdateInvestorApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const updateInvestor = async (data: UserProfile) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Sending update request with data:', data);
      
      const response = await api.put(`/user/update-account`, data);
      console.log('Update response:', response.data);
      
      setLoading(false);
      return response.data;
    } catch (err: any) {
      console.error('Update investor error:', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong');
      setLoading(false);
      throw err;
    }
  }

  return { updateInvestor, loading, error };
}

export default useUpdateInvestorApi
