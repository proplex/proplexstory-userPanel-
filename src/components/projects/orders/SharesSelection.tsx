"use client";

import Icon from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { safeFormatCurrency } from "@/lib/format.utility";
import { toast } from "react-toastify";
import { useState } from "react";

interface SharesSelectionProps {
  availableSupply: number | undefined;
  tokensSelected: number;
  totalOrderValue: number;
  tokenPrice: number | undefined;
  remainingTokens: number | undefined;
  className: string;
  underdesign: boolean;
  onTokenChange?: (newCount: number) => void;
}

const SharesSelection = ({
  availableSupply,
  tokensSelected,
  totalOrderValue,
  tokenPrice,
  remainingTokens,
  className,
  underdesign,
  onTokenChange,
}: SharesSelectionProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleIncrement = () => {
    const newCount = tokensSelected + 1;
    if (availableSupply && newCount > availableSupply) {
      const errorMsg = `You cannot select more than ${availableSupply} available tokens`;
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
      return;
    }
    setErrorMessage(null);
    onTokenChange?.(newCount);
  };

  const handleDecrement = () => {
    const newCount = Math.max(0, tokensSelected - 1);
    setErrorMessage(null);
    onTokenChange?.(newCount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters and leading zeros
    const value = e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, '');

    // Convert to number, defaulting to 0 if empty
    const numValue = value === '' ? 0 : Number(value);

    // Check against available supply if exists
    if (availableSupply && numValue > availableSupply) {
      const errorMsg = `You cannot select more than ${availableSupply} available tokens`;
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
      onTokenChange?.(availableSupply);
      return;
    }

    setErrorMessage(null);
    onTokenChange?.(numValue);
  };

  return (
    <article
      className={`flex flex-col ${className}`}
    >
      <div className={`flex items-center justify-between gap-2 p-5 w-full ${underdesign ? 'border-t border-dashed border-gray-200' : ''}`}>
        <div className="flex flex-col items-start space-y-2">
          <p className="text-xl lg:text-3xl md:text-2xl sm:text-xl font-bold">
            {safeFormatCurrency(totalOrderValue ?? 0)}
          </p>
          <p className="flex items-center">
            <span className="text-xs font-medium text-gray-500">
              Include tax, stamp duty, etc,.
              <Icon name="info-circle" className="text-purple-500" />
            </span>
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className={`h-5 w-5 lg:h-12 lg:w-12 md:h-10 md:w-10 sm:h-6 sm:w-6 rounded-full ${tokensSelected > 0
                  ? 'bg-[#7F56D9] hover:bg-[#7F56D9]/90'
                  : 'bg-[#A8B1BD] hover:bg-[#A8B1BD]/70'
                } text-white hover:text-white border-0`}
              onClick={handleDecrement}
            >
              <Icon
                name="minus"
                className="text-xl lg:text-3xl md:text-2xl sm:text-xl text-white font-black"
              />
            </Button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={availableSupply === undefined}
              value={tokensSelected}
              onChange={handleInputChange}
              className="
    w-16 
    text-center 
    lg:text-3xl md:text-2xl sm:text-xl
    font-bold 
    rounded-md 
    border 
    border-transparent
    focus:border-gray-300
    focus:ring-2
    focus:ring-gray-300
    py-1 
    bg-white
    outline-none
    px-2
    peer
  "
            />

            <Button
              variant="outline"
              size="icon"
              className={`h-5 w-5 lg:h-12 lg:w-12 md:h-10 md:w-10 sm:h-6 sm:w-6 rounded-full ${tokensSelected > 0 && tokensSelected === availableSupply
                  ? 'bg-[#A8B1BD] hover:bg-[#A8B1BD]/70'
                  : 'bg-[#7F56D9] hover:bg-[#7F56D9]/90'
                } text-white hover:text-white border-0`}
              onClick={handleIncrement}
              
            >
              <Icon
                name="plus"
                className="text-xl lg:text-3xl md:text-2xl sm:text-xl text-white font-black"
              />
            </Button>
          </div>
          <div className="flex items-center w-full  font-medium justify-center gap-1 text-xs">
            <span className="text-gray-500">Each token Price: </span>
            <span className="text-gray-700">
              {safeFormatCurrency(Number(tokenPrice))}
            </span>
          </div>
        </div>
      </div>
      {errorMessage && (
        <div className="px-5 pb-2 text-red-500 text-xs text-right">
          {errorMessage}
        </div>
      )}
    </article>
  );
};

export default SharesSelection;