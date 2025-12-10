import { useState } from "react"
import api from "@/lib/httpClient"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

const useFullPayment = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<any>(null)
  const router = useRouter();

  const handleFullPayment = async (orderID: string) => {
    setIsLoading(true)
    try {
      const response = await api.post(`/v2/order/full-payment/${orderID}`);
      console.log(response.data);
      setPaymentData(response.data);
      router.replace(`/orders/${orderID}/track-order`);
      toast.success(response.data.message)
    } catch (error: any) {
        setError(error as string)
        toast.error(error.response.data.message)
    } finally {
        setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    paymentData,
    handleFullPayment,
  }
}

export default useFullPayment