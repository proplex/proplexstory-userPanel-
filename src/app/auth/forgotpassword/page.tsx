"use client";

import React, {Suspense, useEffect} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import useForgotPassword from "@/hooks/auth/useForgotpassword";
import {  setSessionStorage } from "@/lib/storage";

const formSchema = z.object({
  mobile: z
    .string()
    .nonempty("Mobile number is required")

    .refine((val) => val.length === 10, {
      message: "Mobile number must be exactly 10 digits long",
    })

});

type FormData = z.infer<typeof formSchema>;

const Page = () => {
  const router = useRouter();
  const { sendOTP, isLoading, error, token } = useForgotPassword();
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    mobile: "", // initially empty
  },
});

useEffect(() => {
  const savedMobile = sessionStorage.getItem("auth_mobile");
  if (savedMobile) {
    form.setValue("mobile", savedMobile);
  }
}, []);
  const onSubmit = async (data: FormData) => {
    try {
      const formattedMobile = `${data.mobile}`;
      const response = await sendOTP({
        mobileNumber: formattedMobile,
        countryCode: "+254",
      });
      const responseToken = response?.data?.data?._id;
      if (responseToken) {
        setSessionStorage("auth_token", responseToken);
        setSessionStorage("auth_mobile", formattedMobile);
        router.push("/auth/forgotpassword/verify");
      } else {
        console.error("Token is not available in the response");
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to send reset code.";
      toast.error(errorMessage);
      console.error("Error during forgot password:", error);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="flex flex-col items-center justify-center px-4 py-6 mb-4 bg-gray-50 h-screen">
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
          Enter your mobile number to reset your password
        </p>
      </div>

      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg space-y-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex">
                     
                      <Input
                        type="tel"
                        placeholder="Enter Your Mobile Number"
                        className="pl-3 rounded-l-none"
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

            <Button
              type="submit"
              className="w-full bg-[#03a853] hover:bg-[#03a853]/90"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            <Button
              onClick={() => router.push("/auth/signin")}
              className="bg-transparent text-gray-600 hover:bg-transparent hover:text-gray-600"
              type="button"
            >
              <ArrowLeft className="mr-1" size={16} /> Back to Sign in
            </Button>
          </div>
        </Form>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <div className="loader border-4 border-green-500 border-t-transparent rounded-full w-8 h-8 animate-spin" />
          <span className="ml-2">Sending OTP...</span>
        </div>
      )}
    </div>
  </Suspense>
  );
};

export default Page;
