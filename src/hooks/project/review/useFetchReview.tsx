import api from "@/lib/httpClient";
import axios from "axios";
import { useState, useEffect     } from "react";

const useFetchReview = (projectId: string) => {
   const[loading, setLoading] = useState(false);
   const[error, setError] = useState(null);
   const[data, setData] = useState(null);

   const fetchReviews = async () => {
    setLoading(true);
    try {
        const response = await api.get(`/v2/review/${projectId}`);
        setData(response.data.data);
    } catch (error: any) {
        setError(error);
    }
   }
   useEffect(() => {
    fetchReviews();
   }, []);

   return { data, loading, error };
};

export default useFetchReview;