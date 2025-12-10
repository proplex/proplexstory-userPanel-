import { useState } from 'react';
import { toast } from 'react-toastify';

export const useBankAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resetStates = () => {
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
  };

  const addBankAccount = async (formData: any) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add your actual API call here
      // const response = await api.addBankAccount(formData);

      setIsSuccess(true);
      toast.success("Bank account added successfully");
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Failed to add bank account'));
      toast.error(err instanceof Error ? err.message : 'Failed to add bank account');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isSuccess,
    isError,
    error,
    addBankAccount,
    resetStates,
  };
}; 