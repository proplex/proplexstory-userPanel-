import { useState, useEffect } from "react";

export const useBankSearch = (query: string) => {
  const [banks, setBanks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setBanks([]);
      return;
    }

    const fetchBanks = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://ifsc.razorpay.com/banks");
        if (!response.ok) throw new Error("Failed to fetch banks");

        const data: string[] = await response.json();
        const filteredBanks = data.filter((bank) =>
          bank.toLowerCase().includes(query.toLowerCase())
        );

        setBanks(filteredBanks);
      } catch (error) {
        console.error("Error fetching banks:", error);
        setBanks([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchBanks, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { banks, loading };
};

