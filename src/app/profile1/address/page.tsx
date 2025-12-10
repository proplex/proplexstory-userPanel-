"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";

import { useProfile } from "../ProfileContext";

interface AddressFormValues {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

const AddressPage: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const { data, loading, updateProfile } = useProfile();

  const form = useForm<AddressFormValues>({
    defaultValues: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  useEffect(() => {
    if (data?.address) {
      form.reset({
        street: data.address.street || "",
        city: data.address.city || "",
        state: data.address.state || "",
        country: data.address.country || "",
        postalCode: data.address.postalCode || "",
      });
    }
  }, [data, form]);

  const handleSave = async (values: AddressFormValues) => {
    try {
      const success = await updateProfile({
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          country: values.country,
          postalCode: values.postalCode,
        },
      });
      console.log("Update successful:", success);

      if (success) {
        setEditMode(false); // Move this before the toast
        // toast.success('address updated successfully')
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
    }
  };

  const hasAddress = !!data?.address;

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-50/30 px-6 py-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <h2 className="text-xl font-semibold">Address Details</h2>
          </div>
          <p className="text-sm text-gray-500">
            Manage your residential address details
          </p>
        </div>

        {!editMode && !loading && hasAddress && (
          <Button variant="outline" onClick={() => setEditMode(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      {/* Empty State */}
      {!hasAddress && !editMode && !loading && (
        <div className="flex flex-col items-center justify-center text-center gap-3 px-6 py-10 bg-gray-50">
          <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center">
            <MapPin size={28} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-700">
            No Address Added
          </h3>
          <p className="text-sm text-gray-500">
            Add your residential address to complete your profile
          </p>
          <Button
            onClick={() => setEditMode(true)}
            size="sm"
            className="bg-primary text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Address
          </Button>
        </div>
      )}

      {/* Form or View */}
      {(hasAddress || editMode || loading) && (
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="px-6 py-6 space-y-6"
        >
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
              editMode ? "bg-white" : "bg-gray-50"
            } p-4 rounded-xl`}
          >
            {[
              { label: "Street", name: "street" },
              { label: "City", name: "city" },
              { label: "State", name: "state" },
              { label: "Country", name: "country" },
              { label: "Postal Code", name: "postalCode" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block text-sm text-gray-600 mb-1">
                  {label}
                </label>
                {loading ? (
                  <Skeleton className="h-10 rounded-md w-full" />
                ) : editMode ? (
                  <>
                    <Input
                      {...form.register(name as keyof AddressFormValues, {
                        required: `${label} is required`,
                      })}
                    />
                    {form.formState.errors[name as keyof AddressFormValues] && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          form.formState.errors[name as keyof AddressFormValues]
                            ?.message as string
                        }
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-medium text-gray-800">
                    {data?.address?.[name as keyof AddressFormValues] ||
                      "Not Set"}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          {editMode && !loading && (
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button type="submit">Save</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default AddressPage;
