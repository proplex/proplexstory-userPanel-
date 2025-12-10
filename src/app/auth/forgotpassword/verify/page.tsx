"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSessionStorage, setSessionStorage } from "@/lib/storage";
import api from "@/lib/httpClient";
import { toast } from "react-toastify";
import { watch } from "fs";

const VerifyPage = () => {
  const { register, handleSubmit, watch } = useForm();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [mobile, setMobile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const otp = watch("otp");

  useEffect(() => {
    // Only access sessionStorage on the client side
    if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("auth_token");
      const storedMobile = getSessionStorage("auth_mobile");

      if (!storedToken || !storedMobile) {
        router.push("/auth/forgotpassword");
        return;
      }

      setToken(storedToken);
      setMobile(storedMobile);
      setIsLoading(false);
    }
  }, [router]);

  const onSubmit = async (data: any) => {
    if (!token) {
      toast.error("Invalid session. Please try again.");
      return;
    }

    try {
      const response = await api.post(`/user/verify-otp/${token}`, {
        otpCode: data.otp,
      });

      if (response.status === 200) {
        const accessToken = response.data.data.accessToken;
        const refreshToken = response.data.data.refreshToken;

        setSessionStorage("accessToken", accessToken);
        setSessionStorage("refreshToken", refreshToken);

        if (typeof window !== "undefined") {
          sessionStorage.removeItem("auth_token");
          sessionStorage.removeItem("auth_mobile");
        }

        router.push("/auth/forgotpassword/set-password");
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03a853]"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-2 mb-4">
        <Image
          src="/proplex.png"
          alt="proplex Logo"
          width={180}
          height={180}
          priority
        />
        <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
        <p className="text-sm text-gray-500">
          Follow the steps to reset your password
        </p>
      </div>
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="text-center text-sm text-gray-600 mb-2">
            We've sent a 6-digit code to{" "}
            <span className="font-semibold">{mobile}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reset Code
            </label>
            <Input
              {...register("otp", { required: true })}
              maxLength={6}
              placeholder="Enter 6-digit code"
              className="text-center"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#03a853] hover:bg-[#03a853]/90"
            disabled={otp?.length != 6}
          >
            Verify Code
          </Button>
        </form>
        <div className="flex flex-col items-center gap-2 mt-2">
          <Button
            variant="ghost"
            className="w-full text-[#03a853]"
            type="button"
          >
            Resend Code
          </Button>
          <Button
            onClick={() => router.push("/auth/forgotpassword")}
            variant="ghost"
            className="w-full flex items-center justify-center gap-2 text-gray-600"
            type="button"
          >
            <ArrowLeft size={16} /> Change Mobile Number
          </Button>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-400 text-center">
        Secure authentication powered by proplex
      </div>
    </div>
  );
};

export default VerifyPage;
