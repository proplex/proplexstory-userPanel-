import api from "@/lib/httpClient";
import { useEffect, useState } from "react";

interface NomineeData {
    id: number;
    uuid: string;
    name: string;
    phone: string;
    is_primary: boolean;        
    country_code: string;
    email: string;
    relation: string;
    aadhaar_no: string;
    dob: string;
    avatar: string;
    gender: string;         
    address: string;
    age: number;
    status: boolean;
}


const useFetchNominee = () => {
    const [nominee, setNominee] = useState<NomineeData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const fetchNominees = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/v2/nominee");
            // Assuming the API returns { data: NomineeData[] }
            setNominee(response.data.data || []); // Access the data property of the response
        } catch (err) {
            setError(err as Error);
            setNominee([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchNominees();
    }, []);
    
    return { nominee, isLoading, error, refetch: fetchNominees };
}

export default useFetchNominee;