"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Edit, Pencil, User } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import useInvestorApi from "@/hooks/user/useInvestorApi";
import useUpdateInvestorApi from "@/hooks/user/useUpdateInvestorApi";
import usegetImageURL from "@/hooks/user/usegetImageURL";

import { validateContactForm } from "@/constants/helper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/utils";

interface ProfileFormValues {
  email: string;
  mobileNumber: string;
  countryCode: string;
}

// ...imports remain the same

const ContactPage: React.FC = () => {
  const [editMode, setEditMode] = useState(false);

  const { data, fetchData, loading: investorLoading } = useInvestorApi();
  const { updateInvestor, loading: updateLoading } = useUpdateInvestorApi();
  const [selectedCode, setSelectedCode] = useState(data?.countryCode);
  const [selectedCountry, setSelectedCountry] = useState(data?.mobileNumber);

  console.log(data?.countryCode, data?.country, data?.mobileNumber);

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      email: "",
      mobileNumber: "",
      countryCode: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        email: data.email || "",
        mobileNumber: data.mobileNumber || "",
        countryCode: data.countryCode || "",
      });
    }
  }, [data]);

  const handleSave = async () => {
    const values = form.getValues();
    console.log("Form Values:", values);

    if (!validateContactForm(values)) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    try {
      const response = await updateInvestor({
        ...values,
        mobileNumber: values.mobileNumber,
        email: values.email,
      });
      console.log("contact page response is here:", response);

      if (response) {
        toast.success("Profile updated successfully");
        setEditMode(false);
        fetchData();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const isLoading = investorLoading || !data;

  return (
    <>
      <div className="bg-white rounded-2xl shadow ">
        <div className="flex  bg-blue-50/30 items-center justify-between gap-2 mb-4 p-4">
          <div>
            <div className="flex items-center gap-2">
              <User size={16} />
              {isLoading ? (
                <Skeleton className="w-40 h-6 rounded-md" />
              ) : (
                <h1 className="text-2xl font-semibold">Contact Details</h1>
              )}
            </div>

            {isLoading ? (
              <Skeleton className="w-64 h-4 mt-1 rounded-md" />
            ) : (
              <p className="text-sm text-gray-500">
                {" "}
                'Your contact details for your account security and
                verification.'
              </p>
            )}
          </div>
          {!editMode && !isLoading && (
            <Button variant="outline" onClick={() => setEditMode(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <h1 className="text-sm text-gray-500">Email Address</h1>
              {isLoading ? (
                <Skeleton className="h-10 rounded-md w-full" />
              ) : (
                <Input disabled={!editMode} {...form.register("email")} />
              )}
            </div>

            <div>
              <h1 className="text-sm text-gray-500">Mobile Number</h1>
              {isLoading ? (
                <Skeleton className="h-10 rounded-md w-full" />
              ) : (
                <>
                  <div className="flex gap-2">
                    <Select
                      value={form.watch("countryCode")}
                      onValueChange={(value) => {
                        form.setValue("countryCode", value);
                      }}
                      disabled={true} // Always disabled
                    >
                      <SelectTrigger className=" max-w-[120px]">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <span className="inline-flex items-center gap-2">
                              <Image
                                src={country.flag}
                                alt={country.country}
                                width={20}
                                height={15}
                              />
                              ({country.code})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      disabled={true}
                      {...form.register("mobileNumber")}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {!isLoading && editMode && (
            <div className="border-t w-full mt-6 pt-4 flex justify-end gap-2">
              <Button onClick={handleSave} disabled={updateLoading}>
                Save
              </Button>
              <Button variant="ghost" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactPage;
