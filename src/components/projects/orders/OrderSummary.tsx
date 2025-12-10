"use client";

import { useAuth } from "@/hooks/useAuth";
import useAuthTokenStore from "@/store/authTokenStore";

const OrderSummary = () => {
  const { token } = useAuth();
  const { getAuthToken, setAuthToken } = useAuthTokenStore();

  return (
    <div>
      <h1>Order Summary</h1>
    </div>
  );
}

export default OrderSummary;