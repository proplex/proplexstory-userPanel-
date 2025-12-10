"use client";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  DollarSign,
  Lock,
  Minus,
  Plus,
  TrendingUp,
  Users2Icon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CalculateReturns } from "../CalculateReturns";
import { InfoIcon } from "@/components/common/InfoIcon";
import React from "react";

export default function MonthlyReturnsTab({
  fees,
  orderCalculations,
  propertyValues,
  quantity,
  inputValue,
  handleQuantityChange,
  setInputValue,
  showBreakDown,
  setShowBreakDown,
  grossYield,
  netyield,
  ownerShipPercantage,
  monthlyNetReturn
}: {
  fees: any[];
  orderCalculations: any;
  propertyValues: any;
  quantity: number;
  inputValue: string;
  handleQuantityChange: (q: number) => void;
  setInputValue: (val: string) => void;
  showBreakDown: boolean;
  grossYield: number;
  setShowBreakDown: (val: boolean) => void;
  netyield: number;
  ownerShipPercantage: number;
  monthlyNetReturn: number;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 py-1  gap-2 border-b border-gray-200 ">
        <CalculateReturns
          name="Gross Yield"
          icon={<DollarSign size={12} />}
          value={`VND ${grossYield || "0"}`}
          tooltip="This is Gross Yield"
        />
        <CalculateReturns
          name="Net Yield"
          icon={<TrendingUp size={12} />}
          color="#00966A"
          value={`VND ${netyield || "0"}`}
          tooltip="This is Net Yield"
        />
        <CalculateReturns
          name="Ownership"
          icon={<Users2Icon size={12} />}
value={`${(Number(ownerShipPercantage) || 0).toFixed(2)}%`}
          percent={true}
        />
        <CalculateReturns
          name="Total Returns"
          icon={<Lock size={12} />}
          color="#00966A"
          value={`VND ${monthlyNetReturn }`}
        />
      </div>

      <div className="flex justify-between py-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm flex items-center gap-1">
            Cost per Token <InfoIcon size={12} tooltip="dummy data"/>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-black font-semibold text-base">
            {formatCurrency(propertyValues.tokenPrice)}
          </span>
        </div>
      </div>

      <div className="bg-[#F9FAFC] border border-gray-200 rounded-xl p-2 space-y-2">
        <div className="flex items-center justify-between border-b border-black/30 pb-2 ">
          <h1 className="text-md font-semibold">
            {formatCurrency(orderCalculations.totalOrderValue)}
          </h1>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="bg-white text-black hover:bg-primary/20 rounded-full cursor-pointer shadow p-3"
              onClick={() => handleQuantityChange(quantity - 1)}
            >
              <Minus size={16} />
            </Button>

            <input
              type="text"
              min={propertyValues.minimumToken}
              max={propertyValues.maximumToken}
              value={inputValue}
              onChange={(e) => {
                const val = e.target.value;
                setInputValue(val);
                const parsed = parseInt(val, 10);
                if (!isNaN(parsed)) handleQuantityChange(parsed);
              }}
              onBlur={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  if (val < propertyValues.minimumToken)
                    handleQuantityChange(propertyValues.minimumToken);
                  else if (val > propertyValues.maximumToken)
                    handleQuantityChange(propertyValues.maximumToken);
                  else handleQuantityChange(val);
                }
              }}
              className="w-16 text-center font-bold text-lg bg-gray-100 rounded-md px-2 py-1"
            />

            <Button
              type="button"
              className="bg-white text-black hover:bg-primary/20 rounded-full cursor-pointer shadow p-3"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-primary">
          <span
            className="text-sm cursor-pointer hover:text-primary font-medium"
            onClick={() => setShowBreakDown(!showBreakDown)}
          >
            View breakdown
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              showBreakDown ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          className={`transition-all duration-300 ease-in-out transform ${
            showBreakDown
              ? "opacity-100 max-h-[1000px]"
              : "opacity-0 max-h-0 overflow-hidden"
          }`}
        >
          <div className="bg-gray-100 border-gray-200 rounded-lg p-1">
            <div className="flex items-center p-2 justify-between">
              <span className="text-gray-600 text-sm">Total</span>
              <span className="text-sm font-medium">
                {formatCurrency(orderCalculations.totalShareValue)}
              </span>
            </div>
            {fees?.map((fee) => {
                const feeAmount = fee.isPercentage
                  ? (orderCalculations.totalShareValue / 100) * fee.value
                  : Number(fee.value);
                return (
                  <div
                    key={fee._id}
                    className="flex items-center p-2 justify-between"
                  >
                    <span className="text-gray-600 text-sm">
                      {fee.name}
                      <span className="ml-2">
                        {fee.isPercentage
                          ? `(${fee.value}%)`
                          : `(${fee.value})`}
                      </span>
                    </span>
                    <span className="text-sm font-medium">
                      {formatCurrency(feeAmount)}
                    </span>
                  </div>
                );
              })}
            <div className="flex items-center border-t border-gray-200 p-2 justify-between">
              <h1>Total Price</h1>
              <span className="text-md font-semibold">
                {formatCurrency(orderCalculations.totalOrderValue)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
