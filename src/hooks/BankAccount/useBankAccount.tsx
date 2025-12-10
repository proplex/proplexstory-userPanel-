import { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import api from "../../lib/httpClient";

// Define the bank account schema
const bankAccountSchema = z.object({
  name: z.string().min(1, "Account holder name is required"),
  bank_name: z.string().min(1, "Bank name is required"),
  account_number: z.string()
    .min(8, "Account number must be at least 8 characters")
    .max(18, "Account number must not exceed 18 characters")
    .regex(/^\d+$/, "Account number must contain only digits"),
  reenterAccount: z.string(),
  ifsc_code: z.string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
  isPrimary: z.boolean().default(false),
}).refine((data) => data.account_number === data.reenterAccount, {
  message: "Account numbers do not match",
  path: ["reenterAccount"],
});

// Type definition
type BankAccountFormData = z.infer<typeof bankAccountSchema>;

export const useBankAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addBankAccount = async (formData: BankAccountFormData) => {
    setIsLoading(true);
    try {
      // Validate form data using Zod
      const validatedData = bankAccountSchema.parse(formData);
      const { reenterAccount, ...apiData } = validatedData;

      // API request
      const response = await api.post("/v2/escrow/add-bank-account", apiData);

      if (response?.data?.success) {
        setIsSuccess(true);
        toast.success("Bank account added successfully!");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error("Failed to add bank account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetStates = () => {
    setIsSuccess(false);
    setIsError(false);
    setError(null);
  };

  return {
    isLoading,
    isSuccess,
    isError,
    error,
    resetStates,
    addBankAccount,
  };
};
