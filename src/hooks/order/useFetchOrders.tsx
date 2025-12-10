import api from "@/lib/httpClient"
import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from "date-fns";

const defaultPagination = {
  limit: 10,
  page: 1,
  totalCount: 0,
  totalPages: 0,
};

export const useFetchOrder = (
  orderStatus: "fully-paid",
  dateRange: { from: Date; to?: Date } | undefined,
  quickSelect: string,
  page: number = 1,
  limit: number = defaultPagination.limit
) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<any>(defaultPagination);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params: any = {
          orderStatus,
          page,
          limit,
        };

        // If custom date range is provided
        if (dateRange) {
          params.fromDate = format(dateRange.from, "yyyy-MM-dd");
          if (dateRange.to) {
            params.toDate = format(dateRange.to, "yyyy-MM-dd");
          }
        }

        // Quick select → set fromDate/toDate instead of "true"
        if (quickSelect) {
          const today = new Date();
          switch (quickSelect) {
            case "last-month": {
              const from = startOfMonth(subMonths(today, 1));
              const to = endOfMonth(subMonths(today, 1));
              params.fromDate = format(from, "yyyy-MM-dd");
              params.toDate = format(to, "yyyy-MM-dd");
              break;
            }
            case "last-3-months": {
              const from = startOfMonth(subMonths(today, 3));
              const to = endOfMonth(subMonths(today, 1));
              params.fromDate = format(from, "yyyy-MM-dd");
              params.toDate = format(to, "yyyy-MM-dd");
              break;
            }
            case "last-6-months": {
              const from = startOfMonth(subMonths(today, 6));
              const to = endOfMonth(subMonths(today, 1));
              params.fromDate = format(from, "yyyy-MM-dd");
              params.toDate = format(to, "yyyy-MM-dd");
              break;
            }
            case "last-year": {
              const from = startOfYear(subMonths(today, 12));
              const to = endOfYear(subMonths(today, 12));
              params.fromDate = format(from, "yyyy-MM-dd");
              params.toDate = format(to, "yyyy-MM-dd");
              break;
            }
            case "today": {
              params.fromDate = format(today, "yyyy-MM-dd");
              params.toDate = format(today, "yyyy-MM-dd");
              break;
            }
          }
        }

        const response = await api.get(`/orders`, { params });

        setOrders(response.data.data);
        setPagination(response.data.pagination);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orderStatus, dateRange, quickSelect, page, limit]);

  return { data: orders, error, loading, pagination };
};
