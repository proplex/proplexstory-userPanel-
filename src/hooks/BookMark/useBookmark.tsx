import api from "@/lib/httpClient";
import { useState } from "react";
import { toast } from "react-toastify";
const useBookmark = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const bookmarkProperty = async (
    assetId: string
  )=> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put(`/assets/bookmark?assetId=${assetId}`);
      setIsLoading(false);
      return response.data;
    } catch (err: any) {
      setIsLoading(false);

      if (err.response && err.response.data?.message) {
        toast.error(err.response.data.message)
      } else {
        setError("An unexpected error occurred.");
      }
      return null;
    }
  };

  return { isLoading, error, bookmarkProperty };
};

export default useBookmark;
