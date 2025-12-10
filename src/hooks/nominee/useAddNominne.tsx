import { useState } from 'react';
import axios from 'axios';
import api from '@/lib/httpClient';

interface NomineeData {
    name: string;
    phone: string;
    is_primary: boolean;
    country_code: string;
    email: string;
    aadhaar_no: string;
    dob: string;
    gender: string;
    address: string;
    age: number;
    status: boolean;
    relation: string;
}

const useAddNominee = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const addNominee = async (nomineeData: NomineeData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post("/v2/nominee", nomineeData);
            return response.data;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { addNominee, isLoading, error };
};

export default useAddNominee;
