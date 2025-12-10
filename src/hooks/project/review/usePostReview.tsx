import api from "@/lib/httpClient";
import { useState } from "react";

const usePostReview = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const postReview = async (review: any) => {
    setLoading(true);
    try {
      const response = await api.post("/v2/review", review);
      return response.data;
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { postReview, loading, error };
};

export default usePostReview;
