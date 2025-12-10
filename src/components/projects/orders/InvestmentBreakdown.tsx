"use client";

import { Button } from "@/components/ui/button";
import { safeFormatCurrency, safeFormatPercentage } from "@/lib/format.utility";
import { ChevronUp, Info } from "lucide-react";
import React from "react";


const InvestmentBreakdown = ({
  breakdown,
  tokenDetails,
  totalShareValue,
  className
}: { breakdown: any, tokenDetails: any, totalShareValue: any, className?: string}) => {
  const [isBreakdownVisible, setIsBreakdownVisible] = React.useState(false);

  const formatCurrency = (value: number) => {
    return isNaN(value)
      ? "0"
      : value.toLocaleString("en-KE", { style: "currency", currency: "KES" });
  };

  return (
    <article className={`bg-transparent w-full space-y-4 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-end">
        <button
          onClick={() => setIsBreakdownVisible(!isBreakdownVisible)}
          className="flex items-center gap-1 text-[#20BFBE] text-sm font-medium"
        >
          {isBreakdownVisible ? "Collapse" : "Show"} breakup
          <ChevronUp
            className={`h-4 w-4 transition-transform ${
              isBreakdownVisible ? "" : "rotate-180"
            }`}
          />
        </button>
      </div>

      {isBreakdownVisible && (
        <div className="space-y-4 bg-gray-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Total shares value</span>
              <Button variant="ghost" size="icon" className="h-4 w-4">
                <Info className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-sm">
              {formatCurrency(Number(breakdown?.totalSharesValue))}
            </span>
          </div>

          {breakdown?.fees?.filter((fee: any) => fee?.name !== "EOI").map((fee: any) => (
            <div key={fee?.id} className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {fee?.is_percentage ? (
                  <span className="text-sm text-gray-500">
                    {fee?.name} ({safeFormatPercentage(fee?.value)})
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">
                    {fee?.name} 
                  </span>
                )}

                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <Info className="h-3 w-3" />
                </Button>
              </div>
              {fee?.is_percentage ? (
                <span className="text-sm">
                  {safeFormatCurrency(
                    (totalShareValue / 100) * fee?.value
                  )}
                </span>
              ) : (
                <span className="text-sm">
                  {safeFormatCurrency(Number(fee?.value))}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default InvestmentBreakdown;
