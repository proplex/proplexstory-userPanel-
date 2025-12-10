import api from '@/lib/httpClient';
import { useState, useEffect } from 'react';

const useTokenDetails = ({projectId}: {projectId: number}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/v2/project/investment-details/${projectId}`, { signal });
        setData(response.data.data);
        console.log("Token Details: ", response.data.data);

      } catch (err : any) {
        if (!signal.aborted) {
          setError(err?.response?.data?.message || 'Something went wrong');
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort(); // Cleanup on unmount
  }, [projectId]);

  return { data, loading, error };
};

export default useTokenDetails;