import api from "@/lib/httpClient";
import { useState } from "react";
const useLike = () => {
  const [isLoader, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const likeButton = async (
    propertyId: number
  )=> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/like", {
        property: propertyId,
      });
      setIsLoading(false);
      return response.data;
    } catch (err: any) {
      setIsLoading(false);

      if (err.response && err.response.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
      return null;
    }
  };

  return { isLoader, error, likeButton };
};

export default useLike;
