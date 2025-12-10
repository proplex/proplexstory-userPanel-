'use client';

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const getStatusClasses = (status: string) => {
  switch (status) {
    case "order-created":
      return {
        textClass: "text-blue-800",
        bgClass: "bg-blue-100",
        rounded: "rounded-full",
        text: "Order Created"
      };
    case "awaiting-100%-investment":
      return {
        textClass: "text-yellow-800",
        bgClass: "bg-yellow-100",
        rounded: "rounded-full",
        text: "Awaiting 100% Investment"
      };
    case "security-token-transfer-pending":
      return {
        textClass: "text-purple-800",
        bgClass: "bg-purple-100",
        rounded: "rounded-full",
        text: "Security Token Transfer Pending"
      };
    case "awaiting-documents-to-be-signed":
      return {
        textClass: "text-orange-800",
        bgClass: "bg-orange-100",
        rounded: "rounded-full",
        text: "Awaiting Documents to be Signed"
      };
    case "documents-sent-for-signature-to-be-signed":
      return {
        textClass: "text-indigo-800",
        bgClass: "bg-indigo-100",
        rounded: "rounded-full",
        text: "Documents Sent for Signature"
      };
    case "documents-signed":
      return {
        textClass: "text-green-800",
        bgClass: "bg-green-100",
        rounded: "rounded-full",
        text: "Documents Signed"
      };
    case "full-payment-pending":
      return {
        textClass: "text-amber-800",
        bgClass: "bg-amber-100",
        rounded: "rounded-full",
        text: "Full Payment Pending"
      };
    case "fully-paid":
      return {
        textClass: "text-green-800",
        bgClass: "bg-green-100",
        rounded: "rounded-full",
        text: "Fully Paid"
      };
    case "security-token-transferred-and-order-successfully-completed":
      return {
        textClass: "text-emerald-800",
        bgClass: "bg-emerald-100",
        rounded: "rounded-full",
        text: "Order Successfully Completed"
      };
    case "order-cancelled":
      return {
        textClass: "text-red-800",
        bgClass: "bg-red-100",
        rounded: "rounded-full",
        text: "Order Cancelled"
      };
    case "order-failed":
      return {
        textClass: "text-red-800",
        bgClass: "bg-red-100",
        rounded: "rounded-full",
        text: "Order Failed"
      };
    case "refunded":
      return {
        textClass: "text-gray-800",
        bgClass: "bg-gray-100",
        rounded: "rounded-full",
        text: "Refunded"
      };
    case "order-completed":
      return {
        textClass: "text-emerald-800",
        bgClass: "bg-emerald-100",
        rounded: "rounded-full",
        text: "Order Completed"
      };
    // Legacy cases for backward compatibility
    case "Booked":
      return {
        textClass: "text-green-800",
        bgClass: "bg-green-100",
        rounded: "rounded-full",
        text: "Booked"
      };
    case "Document_Signature_Pending":
      return {
        textClass: "text-blue-800",
        bgClass: "bg-blue-100",
        rounded: "rounded-full",
        text: "Document Signature Pending"
      };
    case "Full_Payment_Done":
      return {
        textClass: "text-green-800",
        bgClass: "bg-green-100",
        rounded: "rounded-full",
        text: "Full Payment Done"
      };
    case "Token_Transfer":
      return {
        textClass: "text-purple-800",
        bgClass: "bg-purple-100",
        rounded: "rounded-full",
        text: "Token Transfer"
      };
    case "Cancelled":
      return {
        textClass: "text-red-800",
        bgClass: "bg-red-100",
        rounded: "rounded-full",
        text: "Cancelled"
      };
    case "Refunded":
      return {
        textClass: "text-gray-800",
        bgClass: "bg-gray-100",
        rounded: "rounded-full",
        text: "Refunded"
      };
    default:
      return {
        textClass: "text-gray-800",
        bgClass: "bg-gray-100",
        rounded: "rounded-full",
        text: status || "Unknown Status"
      };
  }
};

const isOver18 = (dateString: string) => {
  if (!dateString) return false
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age >= 18
}

export const validateForm = (formData: any) => {
  if (!formData.fullName.trim()) {
    toast.error("Full name is required")
    return false
  }
  if (!formData.dob) {
    toast.error("Date of birth is required")
    return false
  }
  if (!isOver18(formData.dob)) {
    toast.error("You must be at least 18 years old")
    return false
  }
  if (!formData.gender) {
    toast.error("Gender is required")
    return false
  }
  return true
}

export const validateContactForm = (formData: any) => {
  if (!formData.email?.trim()) {
    toast.error("Email is required")
    return false
  }
  if (!formData.mobileNumber?.trim()) {
    toast.error("Mobile number is required")
    return false
  }
  if (!formData.countryCode?.trim()) {
    toast.error("Country code is required")
    return false
  }
  return true
}



export const formatDob = (dateString: string | undefined): string => {
  if (!dateString) return '';
  // Extract the YYYY-MM-DD part and create a new Date object
  const [year, month, day] = dateString.split('T')[0].split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};