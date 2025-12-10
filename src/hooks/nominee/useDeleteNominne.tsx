import api from "@/lib/httpClient";
import { useState } from "react";

const useDeleteNominne = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const deleteNominee = async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.delete(`/v2/nominee/${id}`);
            return response.data;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteNominee, isLoading, error };
};

export default useDeleteNominne;