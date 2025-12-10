import api from "@/lib/httpClient";
import { useState } from "react";

const useUpdateNominee = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateNominee = async (id: string, data: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.put(`/v2/nominee/${id}`, data);
            return response.data;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { updateNominee, isLoading, error };
};

export default useUpdateNominee;