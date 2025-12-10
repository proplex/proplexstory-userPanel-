"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Lock, Phone, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setSessionStorage } from "@/lib/storage";
import useSignUp from "@/hooks/auth/useSignUp";

const passwordRequirements = [
  { label: "At least 8 characters", regex: /.{8,}/ },
  { label: "One uppercase letter (A-Z)", regex: /[A-Z]/ },
  { label: "One lowercase letter (a-z)", regex: /[a-z]/ },
];
const formSchema = z
  .object({
    mobile: z
      .string()
      .nonempty("Mobile number is required")

      .refine((val) => val.length === 10, {
        message: "Mobile number must be exactly 10 digits long",
      }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter (A-Z)",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter (a-z)",
      })
      ,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { sendOTP, isLoading, error, token } = useSignUp();

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    // Check if password meets all requirements before submitting

    try {
      const response = await sendOTP({
        mobileNumber: data.mobile,
        countryCode: "+254",
        password: data.password,
      });

      const responseToken = response?.data?.data?._id;
      if (responseToken) {
        setSessionStorage("auth_token", responseToken);
        setSessionStorage("auth_mobile", data.mobile);
        router.push("/auth/signup/success");
      } else {
        console.error("Token is not available in the response");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to create account. Please try again.";
      toast.error(errorMessage);
      console.error("Error during signup:", error);
    }
  };

  const watchPassword = form.watch("password");
  const watchConfirmPassword = form.watch("confirmPassword");

  const passwordChecklist = passwordRequirements.map((req) => ({
    label: req.label,
    passed: req.regex.test(watchPassword || ""),
  }));

  const showPasswordBox = passwordChecklist.some((item) => !item.passed);
  const isPasswordValid = passwordChecklist.every((item) => item.passed);

  // Add error display for form errors

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 mb-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col items-center gap-2 mb-4">
        <Image
          src="/proplex.png"
          alt="proplex Logo"
          width={180}
          height={180}
          priority
        />
        <h1 className="text-2xl font-bold text-gray-800">Create an account</h1>
        <p className="text-sm text-gray-500">
          Join Proplex to start your Real Estate Investment journey
        </p>
      </div>

      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg space-y-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Mobile Number */}
            <FormField
              control={form.control}
              name="mobile"
              rules={{ required: "Mobile number is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex">
                      {/* <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm">
                        +254
                      </span> */}
                      <Input
                        type="tel"
                        className="pl-3 rounded-l-none"
                        placeholder="Enter Your Mobile Number"
                        value={field.value}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(
                            /\D/g,
                            ""
                          );
                          if (numericValue.length <= 10) {
                            field.onChange(numericValue);
                          }
                        }}
                        maxLength={10}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create strong password"
                        className="pl-10 pr-10"
                        {...field}
                      />
                      {showPassword ? (
                        <EyeOff
                          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <Eye
                          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{ required: "Please confirm your password" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        className="pl-10 pr-10"
                        {...field}
                      />
                      {showConfirmPassword ? (
                        <EyeOff
                          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                          onClick={() => setShowConfirmPassword(false)}
                        />
                      ) : (
                        <Eye
                          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer"
                          onClick={() => setShowConfirmPassword(true)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            
            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-black/200"
              disabled={
                isLoading || !isPasswordValid || !form.formState.isValid
              }
            >
              Create Account
            </Button>

            {/* Signin Link */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-[#03a853] hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="loader" />
          <span className="ml-2">Creating your account...</span>
        </div>
      )}
    </div>
  );
};

export default Page;
