"use client";

import { useState, useEffect } from "react";
import api from "@/lib/httpClient";
import { AxiosError } from "axios";

export interface PortfolioMetricsResponse {
  metrics: {
    totalInvestment: number;
    holdings: number;
    cashFlows: number;
    totalValue: number;
    date: string;
    allTimeReturns: number;
    holdingsReturn: number;
    cashFlowReturn: number;
    annualCashFlow: number;
  };
  summary: {
    uniqueAssets: number;
    totalOrders: number;
    totalInvestment: number;
    totalTokens: number;
    totalCurrentValue: number;
    annualCashFlow: number;
  };
  cashFlowBreakdown: {
    assets: {
      assetId: string;
      monthlyCashFlow: number;
      annualCashFlow: number;
      ownershipPercentage: number;
    }[];
  };
}

// ---- Hook ----
const useFetchPortfolioMetrics = () => {
  const [metricsData, setmetricsData] = useState<PortfolioMetricsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<
    AxiosError<{ statusCode: number; message: string }> | null
  >(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);

    const userId =
      typeof window !== "undefined"
        ? sessionStorage.getItem("userId")
        : null;

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<PortfolioMetricsResponse>(
        `/portfolio/users/${userId}/metrics`
      );
      setmetricsData(response.data);
    } catch (err: unknown) {
      if ((err as AxiosError).isAxiosError) {
        setError(err as AxiosError<{ statusCode: number; message: string }>);
      } else {
        console.error("Unexpected error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return { metricsData, loading, error, fetchMetrics };
};

export default useFetchPortfolioMetrics;
