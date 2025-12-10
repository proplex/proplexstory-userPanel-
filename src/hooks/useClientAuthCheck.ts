import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useClientAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This only runs on the client side
    const checkAuth = () => {
      const accessToken = typeof window !== 'undefined' ? sessionStorage.getItem("accessToken") : null;
      const refreshToken = typeof window !== 'undefined' ? sessionStorage.getItem("refreshToken") : null;
      
      if (!accessToken || !refreshToken) {
        setIsAuthenticated(false);
        router.push("/auth/signin");
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, isLoading };
}
