"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useUpdateInvestorApi from "@/hooks/user/useUpdateInvestorApi";
import SucessDialogue from "./SucessDialogue";

const passwordRequirements = [
  { label: "At least 8 characters", regex: /.{8,}/ },
  { label: "One uppercase letter (A-Z)", regex: /[A-Z]/ },
  { label: "One lowercase letter (a-z)", regex: /[a-z]/ },
];

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof formSchema>;

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showdialogue, setDialogue] = useState(false);

  const router = useRouter();
  const { updateInvestor } = useUpdateInvestorApi();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = form.watch("password");

  const passwordChecklist = passwordRequirements.map((req) => ({
    label: req.label,
    passed: req.regex.test(watchPassword || ""),
  }));

  const showPasswordBox = passwordChecklist.some((item) => !item.passed);

  

  const onSubmit = async (data: FormData) => {
    try {

      await updateInvestor({ password: data.password });  
      setDialogue(true);
      setTimeout(()=>{
        router.push("/");
      },3000);

    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to update password. Please try again.";
      toast.error(errorMessage);
      console.error("Error during password update:", error);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
        <p className="text-sm text-gray-500">
          Set a new password for your account
        </p>
      </div>

      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg space-y-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

            {/* Password Checklist */}
            {/* {showPasswordBox && ( */}
           
            {/* )} */}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-[#03a853] hover:bg-[#03a853]/90"
              disabled={
                form.formState.isSubmitting ||
                showPasswordBox ||
                !form.formState.isValid
              }
            >
              Set Password
            </Button>
          </form>
        </Form>
      </div>
      {showdialogue && <SucessDialogue/>}
    </div>
  );
};

export default Page;
