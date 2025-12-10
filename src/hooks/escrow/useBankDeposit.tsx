import api from "@/lib/httpClient";
import { useState } from "react";

interface BankDepositResponse {
    data: {
        payment_url: {
            url: string;
        };
    };
}
const useBankDeposit = () => {
    
    const [depositResponse, setDepositResponse] = useState<BankDepositResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [redirectURL, setRedirectURL] = useState<string | null>(null);

    const depositFund = async (amount: number) => {
        setIsLoading(true);
        setError(null); // Reset error state
        
        try {
            const response = await api.post("/v2/escrow/deposit-fund", { amount });
            const jsonData = response.data;
            setDepositResponse(jsonData);
            
            const paymentUrl = jsonData?.data?.payment_url?.url;
            if (!paymentUrl) {
                throw new Error('Invalid payment URL received');
            }
            
            setRedirectURL(paymentUrl);
            return paymentUrl; // Return the URL directly
            
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to deposit fund';
            setError(errorMessage);
            throw error; // Re-throw to handle in component
        } finally {
            setIsLoading(false);
        }
    }

    return { depositFund, isLoading, error, redirectURL };
}

export default useBankDeposit;