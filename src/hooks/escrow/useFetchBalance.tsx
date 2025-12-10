import api from "@/lib/httpClient";
import { useEffect, useState } from "react";

// Define interface for the API response
interface BalanceResponse {
        current_balance: string;

}

const useFetchBalance = () => {
    const [balance, setBalance] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const fetchBalance = async () => {
        setIsLoading(true);
        try {
            const response = await api.get<BalanceResponse>("/v2/escrow/statement");
            // Ensure we have a balance value before setting it
                setBalance(response.data.current_balance);
           
        } catch (error: any) {
            setError(error.message || 'Failed to fetch balance');
            setBalance(undefined);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchBalance();
    }, []);
    
    return { balance, isLoading, error };
}

export default useFetchBalance;