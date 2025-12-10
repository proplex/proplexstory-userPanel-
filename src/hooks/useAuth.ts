"use client";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if(typeof window !== 'undefined') {
      setToken(localStorage.getItem('fandora_auth_token'));
    }
  }, []);

  return { token };
}

