"use client";

import  React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChartLine, Wallet, Smartphone } from "lucide-react";
import { IProperty } from "@/constants/global";
import { cn, formatCurrency, roundDownToOneDecimal } from "@/lib/utils";
import TokenPaymentDialog from "./TokenPaymentDialog";
import MpesaPaymentDialog from "./MpesaPaymentDialog";

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (response: any) => void;
  property: IProperty;
  totalPrice: number;
  onClick: () => void;
  quantity: number;
  ownerShip: number;
}

export default function PaymentMethodDialog({
  open,
  onOpenChange,
  onSubmit,
  property,
  totalPrice,
  onClick,
  quantity,
  ownerShip,
}: PaymentMethodDialogProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"blockchain" | "mpesa" | null>(null);

  const handlePaymentMethodSelect = (method: "blockchain" | "mpesa") => {
    // Only allow blockchain payment method
    if (method === "blockchain") {
      setSelectedPaymentMethod(method);
    }
    // M-Pesa is disabled - do nothing when clicked
  };

  const handleBackToMethods = () => {
    setSelectedPaymentMethod(null);
  };

  const handleSubmit = (response: any) => {
    onSubmit(response);
  };

  if (selectedPaymentMethod === "blockchain") {
    return (
      <TokenPaymentDialog
        open={open}
        onOpenChange={onOpenChange}
        onSubmit={handleSubmit}
        property={property}
        totalPrice={totalPrice}
        onClick={handleBackToMethods}
        quantity={quantity}
        ownerShip={ownerShip}
      />
    );
  }

  if (selectedPaymentMethod === "mpesa") {
    return (
      <MpesaPaymentDialog
        open={open}
        onOpenChange={onOpenChange}
        onSubmit={handleSubmit}
        property={property}
        totalPrice={totalPrice}
        onClick={handleBackToMethods}
        quantity={quantity}
        ownerShip={ownerShip}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="w-full max-w-[500px] max-h-[90vh] flex flex-col p-4 rounded-xl"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Choose Payment Method</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            {property.name} |{" "}
            <span className="text-green-500 flex items-center gap-2">
              <ChartLine size={16} />1 Property Token ={" "}
              {property?.tokenInformation?.tokenPrice}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl overflow-y-auto flex-1">
          <div className="space-y-4">
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

        <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 space-y-4">
          <h3 className="text-md font-medium">Select Payment Method</h3>
          
          <div className="grid grid-cols-1 gap-3">
            <div
              className={cn(
                "flex items-center justify-between border border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors",
                "bg-white"
              )}
              onClick={() => handlePaymentMethodSelect("blockchain")}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wallet className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-medium">Blockchain Payment</h4>
                  <p className="text-sm text-gray-500">Pay with cryptocurrency</p>
                </div>
              </div>
              <div className="text-blue-600 font-medium">Select</div>
            </div>
            
            <div
              className={cn(
                "flex items-center justify-between border border-gray-300 rounded-xl p-4 bg-gray-100 cursor-not-allowed",
                "opacity-60"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Smartphone className="text-green-600" size={20} />
                </div>
                <div>
                  <h4 className="font-medium">Stripe Payment</h4>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </div>
              </div>
              <div className="text-gray-500 font-medium">Coming Soon</div>
            </div>
          </div>
        </div>

        {/* Escrow notice */}


        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => onClick()}
          >
            Back
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}