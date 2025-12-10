"use client";
import React, { Suspense } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/httpClient";
import { useRouter } from "next/navigation"
import useUserDetails from "@/hooks/user/useUserDetail";
import { setSessionStorage } from "@/lib/storage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationContent />
    </Suspense>
  );
}

function VerificationContent() {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mobile, setMobile] = useState<string | null>(null);
  const router = useRouter()
  const { fetchData } = useUserDetails();

  useEffect(() => {
    // Get data from session storage
    const storedToken = sessionStorage.getItem("auth_token");
    const storedMobile = sessionStorage.getItem("auth_mobile");
    const isSignIn = sessionStorage.getItem("is_signin");

    if (!storedToken || !storedMobile) {
      router.push('/auth/signin');
      return;
    }

    setToken(storedToken);
    setMobile(storedMobile);
  }, []);

  const handleVerify = async () => {
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Invalid verification session. Please try again.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await api.post(`/user/verify-otp/${token}`, {
        otpCode: otp,
      });

      if (response.data.status === "success") {
        setSuccess("Mobile number verified successfully!");
        setError(null);
        
        // Store tokens
        setSessionStorage("accessToken", response.data.data.accessToken);
        setSessionStorage("refreshToken", response.data.data.refreshToken);
        
        // Clear verification data
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_mobile");
        
        
        // Redirect to home page
        router.push('/');
      } else {
        setError(
          response.data.message || "Verification failed. Please try again."
        );
        setSuccess(null);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Verification failed. Please try again.";
      setError(errorMessage);
      setSuccess(null);
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    if (!token) {
      setError("Invalid verification session. Please sign up again.");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await api.post(`/user/resend-otp/${token}`);
      if (response.data.success) {
        setSuccess("OTP resent successfully!");
        setResendTimer(60);
        setError(null);
      } else {
        setError(response.data.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to resend OTP";
      setError(errorMessage);
      console.error("Resend error:", error);
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // 🧹 Clear messages when user starts typing again
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric digits
    const numericValue = e.target.value.replace(/\D/g, '');
    setOtp(numericValue);
    setError(null);
    setSuccess(null);
  };

  if (!token || !mobile) {
    return null; // or a loading state
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#f9fafb] space-y-2">
      <div className="flex flex-col items-center space-y-2">
        <img src="/proplex.png" alt="proplex Logo" className="h-10 mb-1" />
        <h1 className="text-xl font-semibold text-gray-800">
          Verify Your Mobile
        </h1>
        <p className="text-sm text-gray-500">
          We need to verify your mobile number
        </p>
      </div>
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-4 space-y-2">
        <div className="space-y-3">
          <p className="text-sm text-gray-700 text-center">
            We&apos;ve sent a 6-digit verification code to <br />
            <span className="font-medium"> {mobile}</span>
          </p>
          <div className="text-left space-y-1">
            <label htmlFor="otp" className="text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <Input
              id="otp"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter 6-digit code"
              className={`text-center tracking-widest font-mono ${
                error ? "border-red-500" : ""
              }`}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            {success && (
              <p className="text-sm text-green-500 mt-1">{success}</p>
            )}
            
          </div>
        </div>

        <div className="space-y-2">
          <Button
            className="w-full bg-black hover:bg-black/90 text-white font-medium text-sm"
            onClick={handleVerify}
            disabled={isVerifying || !otp || otp.length != 6}
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </Button>
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="w-full text-xs text-gray-500 hover:underline disabled:opacity-50"
          >
            {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Code"}
          </button>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center">
        Secure authentication powered by{" "}
        <span className="font-medium text-gray-500">proplex</span>
      </p>
    </div>
  );
}
