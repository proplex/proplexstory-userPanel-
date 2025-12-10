import api from "@/lib/httpClient";
import { toast } from "react-toastify";

export const updateAccount = async (userID: string, data: any) => {
  try {
    const response = await api.put(`/auth/update-account/${userID}`, data);
    toast.success("Account updated successfully");
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    throw error;
  }
};
