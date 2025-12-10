"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChartLine, ChevronDown } from "lucide-react";
import { IProperty } from "@/constants/global";
import { cn, formatCurrency, roundDownToOneDecimal } from "@/lib/utils";
import useMpesaPaymentApi from "@/hooks/property/useMpesaPaymentApi";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface MpesaPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (response: any) => void;
  property: IProperty;
  totalPrice: number;
  onClick: () => void;
  quantity: number;
  ownerShip: number;
}

export default function MpesaPaymentDialog({
  open,
  onOpenChange,
  onSubmit,
  property,
  totalPrice,
  onClick,
  quantity,
  ownerShip,
}: MpesaPaymentDialogProps) {
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { initiateMpesaPayment, loading, error } = useMpesaPaymentApi();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [progressValue, setProgressValue] = useState(10);

  const handlePayment = async () => {
    if (!phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    // Validate phone number format (Kenyan format)
    const phoneRegex = /^(\+?254|0)?([17]\d{8}|[17]\d{1})$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s+/g, ''))) {
      toast.error("Please enter a valid Kenyan phone number");
      return;
    }

    try {
      const result = await initiateMpesaPayment({
        phoneNumber: phoneNumber.startsWith('0') ? `+254${phoneNumber.slice(1)}` : phoneNumber,
        amount: totalPrice,
        propertyId: property._id,
        tokensBooked: quantity.toString()
      });

      if (result.success) {
        onSubmit({ success: true, data: result.data });
      }
    } catch (error) {
      console.error("MPESA payment failed:", error);
    }
  };

  // Timer + synthetic progress while placing the order
  useEffect(() => {
    if (!loading) {
      setElapsedSeconds(0);
      setProgressValue(10);
      return;
    }

    const startedAt = Date.now();
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startedAt) / 1000);
      setElapsedSeconds(seconds);
      const next = Math.min(95, 10 + Math.floor(Math.sqrt(seconds) * 20));
      setProgressValue(next);
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

  const formatElapsed = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="w-full max-w-[500px] max-h-[90vh] flex flex-col p-4 rounded-xl"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Buy Property Token with MPESA</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            {property.name} |{" "}
            <span className="text-green-500 flex items-center gap-2">
              <ChartLine size={16} />1 Property Token ={" "}
              {property?.tokenInformation?.tokenPrice}
            </span>
          </DialogDescription>
        </DialogHeader>

        <>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl overflow-y-auto flex-1">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-semibold text-gray-700">
                Order Summary
              </h1>
              <ChevronDown
                size={20}
                className={`cursor-pointer transition-transform duration-300 ${
                  showOrderSummary ? "rotate-180" : ""
                }`}
                onClick={() => setShowOrderSummary(!showOrderSummary)}
              />
            </div>
            <div
              className={`w-full transition-all duration-300 ease-in-out transform ${
                showOrderSummary
                  ? "opacity-100 max-h-[1000px]"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Property</span>
                  </div>
                  <span className="text-gray-700 text-md font-medium">
                    {property.name}
                  </span>
                </div>

                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Tokens</span>
                  </div>
                  <span className="text-gray-700 text-md font-medium">
                    {quantity}
                  </span>
                </div>

                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600  font-medium">
                      Price Per Token
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-700 text-md font-medium">
                      {formatCurrency(property?.tokenInformation?.tokenPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Ownership</span>
                  </div>
                  <span className="text-gray-700  text-md font-medium">
                    {roundDownToOneDecimal(ownerShip)}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border-t border-gray-200 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 text-md font-medium">
                      Total Investment
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-700 text-md font-medium">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 space-y-4">
            <h3 className="text-md font-medium">MPESA Payment Details</h3>
            
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your MPESA phone number (e.g., 0712345678)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Enter your MPESA registered phone number to receive payment prompt
              </p>
            </div>
          </div>

          {/* Escrow notice */}
          <div className="w-full p-3 rounded-lg border bg-amber-50 border-amber-200 text-amber-800 text-xs">
            All payments for this property go to a specific escrow account at ABC Bank managed by the TRUSTEE.
          </div>

          {loading && (
            <div className="w-full space-y-2 p-2 border rounded-lg bg-white/50">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Processing your payment...</span>
                <span className="tabular-nums">{formatElapsed(elapsedSeconds)}</span>
              </div>
              <Progress value={progressValue} />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{progressValue}%</span>
                <span>Keep this window open</span>
              </div>
            </div>
          )}

          <DialogFooter className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => onClick()}
              disabled={loading}
            >
              Back
            </Button>
            <Button
              variant="default"
              size="lg"
              className="w-full"
              disabled={loading || !phoneNumber}
              onClick={handlePayment}
            >
              {loading ? "Processing..." : "Pay with MPESA"}
            </Button>
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
}