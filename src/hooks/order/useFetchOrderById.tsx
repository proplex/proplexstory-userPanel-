import api from "@/lib/httpClient";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { IOrder } from "@/constants/global";

interface UseFetchOrderByIdReturn {
  order: IOrder | null;
  loading: boolean;
  error: Error | null;
  fetchOrder: (orderId: string) => Promise<void>;
}

const useFetchOrderById = (p0: string): UseFetchOrderByIdReturn => {
    const [order, setOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const params = useParams()
    const fetchOrder = useCallback(async (orderId: string) => {
        if (!orderId) {
            setError(new Error("Order ID is required"));
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/orders/${orderId}`);
            if (response.data?.data) {
                setOrder(response.data.data);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to fetch order details";
            setError(new Error(errorMessage));
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const orderId = params?.orderID;
        if (orderId) {
            fetchOrder(String(orderId));
        }
    }, [params, fetchOrder]);

    return { order, fetchOrder, loading, error };
}

export default useFetchOrderById;