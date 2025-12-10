import api from "@/lib/httpClient";
import { useState, useEffect     } from "react";

const useFetchPortfolioOrder = () => {
    const [portfolioOrder, setPortfolioOrder] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    const fetchPortfolioOrder = async () => {
        try {
            setLoading(true);
            const response = await api.get("/v2/order/portfolio/orders");
            setPortfolioOrder(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            setError(error);
        }
    }

    useEffect(() => {
        fetchPortfolioOrder();
    }, []);

    return { portfolioOrder, loading, error };
}
export default useFetchPortfolioOrder;