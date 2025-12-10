"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useSendOTP from "@/hooks/auth/useSendOTP";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useLogin from "@/hooks/auth/useLogin";
import { useEffect } from "react";

const formSchema = z.object({
  mobile: z
    .string()
    .nonempty("Mobile number is required")
    .refine((val) => /^\d+$/.test(val), {
      message: "Mobile number must not contain letters or special characters",
    })
    .refine((val) => val.length === 10, {
      message: "Mobile number must be exactly 10 digits long",
    }),

  password: z
    .string()
      .min(8, "Password is Required")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter (A-Z)",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter (a-z)",
      })

      
});

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [mobile, setMobile] = useState("");
  const router = useRouter();
  const { sendOTP, isLoading } = useLogin();
   useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMobile = sessionStorage.getItem("auth_mobile");
      setMobile(storedMobile || "");
    }
  }, []);
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      mobile: mobile || "",
      password: "",
    },
  });
  const watchedMobile = form.watch("mobile");
  const watchPassword = form.watch("password");

  useEffect(() => {
    if (
      watchedMobile &&
      watchedMobile.length === 9 &&
      watchedMobile.startsWith("7")
    ) {
      sessionStorage.setItem("auth_mobile", watchedMobile);
    }
  }, [watchedMobile]);

  const onSubmit = async (data: any) => {
    try {
      // Format mobile number to remove any non-digit characters
      const formattedMobile = data.mobile.replace(/\D/g, "");

      const response = await sendOTP({
        mobileNumber: formattedMobile,
        countryCode: "+254",
        password: data.password,
      });

      const responseToken = response?.data?.data?._id;
      if (responseToken) {
        sessionStorage.setItem("auth_token", responseToken);
        sessionStorage.setItem("auth_mobile", formattedMobile);
        sessionStorage.setItem("is_signin", "true");
        router.push("/verification");
      } else {
        toast.error("Failed to sign in. Please try again.");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to sign in. Please try again.";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 mb-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col items-center gap-2 mb-4">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/proplex.png"
            alt="proplex Logo"
            width={180}
            height={180}
            priority
          />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-sm text-gray-500">Sign in to your proplex account</p>
      </div>

      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg space-y-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Mobile */}
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Mobile Number
                  </FormLabel>
                  {/* <FormDescription className="text-xs text-gray-500">
                    Enter your 9-digit mobile number without 0 (e.g., 712345678)
                  </FormDescription> */}
                  <FormControl>
                    <div className="relative flex">
                      {/* <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm">
                        +254
                      </span> */}
                      <Input
                        type="tel"
                        className="pl-3 rounded-l-none"
                        placeholder="Enter Your Mobile Number"
                        maxLength={10}
                        {...field}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(e.target.value.replace(/\D/g, ""))
                        }
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
                        placeholder="Enter your password"
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
                  {message && <p className="text-red-500 text-sm">{message}</p>}
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-black "
              disabled={isLoading || !form.formState.isValid || form.formState.isSubmitting}
            >
              Sign in
            </Button>

            <div className="text-center text-sm text-white">
              <Link
                href="/auth/forgotpassword"
                className="text-black hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-[#03a853] hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="loader" />
          <span className="ml-2">Logging in...</span>
        </div>
      )}
    </div>
  );
};

export default Page;
