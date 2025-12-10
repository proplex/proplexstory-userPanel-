"use client";
import dynamic from "next/dynamic";
import {
  Copy,
  Info,
  CopyCheck,
  Terminal,
  Calendar,
  CalendarFold,
} from "lucide-react";
import React, { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter, usePathname } from "next/navigation";
import { IProperty } from "@/constants/global";
import { formatCurrency, roundDownToOneDecimal } from "@/lib/utils";
import InvestmentSummary from "./InvestmentSummary";
import LottieAnimation from "@/components/animation/LottieAnimation";
import SecureAnimation from "../../../../../public/lottie-animations/Secure.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InvestmentSecurityDialog } from "./InfoDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MonthlyReturnsTab from "@/components/cards/PropertyCard/TokenTabs/MonthlyReturnsTab";
import usePlaceOrderApi from "@/hooks/property/usePlaceOrderApi";
import { toast } from "react-toastify";
import useTokenStore from "@/store/tokenStore";
import useAuthStore from "@/store/authTokenStore";
import YearlyReturnsTab from "@/components/cards/PropertyCard/TokenTabs/YearlyReturnsTab";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";

const TokenPaymentDialog = dynamic(() => import("./TokenPaymentDialog"), {
  ssr: false,
});
const TokenSelectingDialog = dynamic(() => import("./TokenSelectingDialog"), {
  ssr: false,
});
// Import our new payment method dialog
const PaymentMethodDialog = dynamic(() => import("./PaymentMethodDialog"), {
  ssr: false,
});
// llyodsAdded={isLlyodsAdded} // <--- here

export default function Token({
  property,
  kycCompleted,
  onOrderValueChange,
  llyodsAdded,
}: {
  property: IProperty;
  kycCompleted: boolean;
  onOrderValueChange?: (value: number) => void;
  llyodsAdded?: boolean;
}) {
  const [showBreakDown, setShowBreakDown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [updatedProperty, setUpdatedProperty] = useState(property);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const setTokenStore = useTokenStore((state) => state.setToken);
  const tokenStore = useTokenStore((state) => state.token);

  const [quantity, setQuantity] = useState(
    tokenStore
      ? tokenStore
      : property?.tokenInformation?.minimumTokensToBuy || 0
  );
  const [inputValue, setInputValue] = useState(String(quantity));
  const [infoDialog, setInfoDialog] = useState(false);
  const [step, setStep] = useState<
    | "TokenSelecting"
    | "TokenPayment"
    | "InvestmentSummary"
    | "email"
    | "otp"
    | null
  >(null);

  // const isPlaceOrder = pathname.includes("");

  const { placeOrder, loading, error } = usePlaceOrderApi();

  // Memoize property values
  const propertyValues = useMemo(
    () => ({
      tokenPrice: updatedProperty?.tokenInformation?.tokenPrice || 0,
      minimumToken: updatedProperty?.tokenInformation?.minimumTokensToBuy || 0,
      maximumToken: updatedProperty?.tokenInformation?.maximumTokensToBuy || 0,
      availableTokens:
        updatedProperty?.tokenInformation?.availableTokensToBuy || 0,
      grossTargetIRR:
        updatedProperty?.investmentPerformance?.grossTargetIRR || 0,
      lockInPeriodValue:
        updatedProperty?.investmentPerformance?.lockInPeriodValue || 0,
      lockInPeriodType:
        updatedProperty?.investmentPerformance?.lockInPeriodType || "",
    }),
    [updatedProperty]
  );

  // Memoize fees
  const fees = useMemo(() => {
    const registrationFees = updatedProperty?.fees?.registration || [];
    const legalFees = updatedProperty?.fees?.legal || [];
    const platfromFee = updatedProperty?.fees.platform || [];
    const brokerageFee = updatedProperty?.fees.brokerage || [];
    const reservesFee = updatedProperty?.fees.reserves || [];
    const insuranceFee = updatedProperty?.fees.insurance || [];
    return [
      ...registrationFees,
      ...legalFees,
      ...platfromFee,
      ...brokerageFee,
      ...reservesFee,
      ...insuranceFee,
    ];
  }, [updatedProperty?.fees]);

  console.log(updatedProperty,"updatedProperty")

  // Memoize order calculations
  const orderCalculations = useMemo(() => {
    if (quantity === 0) {
      return {
        totalShareValue: 0,
        totalOrderValue: 0,
        preTaxReturns: 0,
        investorOwnership: 0,
        breakdown: {
          totalSharesValue: 0,
          fees: [],
        },
      };
    }

    //pre tax return rental

    const totalShareValue = propertyValues.tokenPrice * quantity;

    const totalFees = fees.reduce((acc: number, fee: any) => {
      // Skip fees that are not active
      if (!fee.status) return acc;

      return fee.isPercentage
        ? acc + (totalShareValue / 100) * Number.parseFloat(fee.value)
        : acc + Number.parseFloat(fee.value);
    }, 0);

    const totalOrderValue = totalShareValue + totalFees;

    if (onOrderValueChange) {
      onOrderValueChange(totalOrderValue);
    }
    return {
      totalShareValue,
      totalOrderValue,
      preTaxReturns: (propertyValues.grossTargetIRR / 100) * totalShareValue,
      investorOwnership: (quantity / propertyValues.availableTokens) * 100,
      breakdown: {
        totalSharesValue: totalShareValue,
        fees: fees,
      },
    };
  }, [quantity, propertyValues, fees, onOrderValueChange]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }, []);

  const handleTokenSelectingSubmit = useCallback(() => {
    setStep("TokenPayment");
  }, []);

  const handleTokenPaymentSubmit = useCallback(
    (paymentResponse: any) => {
      setResponse(paymentResponse);
      setStep("InvestmentSummary");
      setUpdatedProperty((prev) => ({
        ...prev,
        tokenInformation: {
          ...prev.tokenInformation,
          availableTokensToBuy:
            prev.tokenInformation?.availableTokensToBuy - quantity,
        },
      }));
      router.refresh();
    },
    [quantity, router]
  );

  const handleRequestOtp = useCallback(
    ({ email, token }: { email: string; token: string }) => {
      setEmail(email);
      setToken(token);
      setStep("otp");
    },
    []
  );

  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      setInputValue(String(newQuantity));
      if (newQuantity < propertyValues.minimumToken) {
        setTokenError(
          `Minimum ${propertyValues.minimumToken} tokens required.`
        );
        return;
      }
      if (newQuantity > propertyValues.maximumToken) {
        setTokenError(
          `You can only buy up to ${propertyValues.maximumToken} tokens.`
        );
        return;
      }
      setTokenStore(newQuantity);
      setQuantity(newQuantity);
      setTokenError(null);
    },
    [propertyValues.minimumToken, propertyValues.maximumToken]
  );

  const accesToken =
    typeof window !== "undefined"
      ? sessionStorage.getItem("accessToken")
      : null;
  const walletAddress =
    typeof window !== "undefined"
      ? sessionStorage.getItem("walletAddress")
      : null;
  const handleNavigate = useCallback(() => {
    if (accesToken) {
      router.push(`/place-order/${params?.propertyID}`);
    }
  }, [accesToken]);

  // Monthly Gross Yield
  const monthGrossYield = useMemo(() => {
    const totalPrice = orderCalculations.totalOrderValue;
    const grossYield =
      updatedProperty?.investmentPerformance?.grossRentalYield || 0;
    if (!totalPrice || !grossYield) return 5;
    return (totalPrice * (grossYield / 100)) / 12; // % → decimal, then annual → monthly
  }, [
    orderCalculations.totalOrderValue,
    updatedProperty?.investmentPerformance?.grossRentalYield,
  ]);

  // Yearly Gross Yield
  const yearGrossYield = useMemo(() => {
    const totalPrice = orderCalculations.totalOrderValue;
    const grossYield =
      updatedProperty?.investmentPerformance?.grossRentalYield || 0;
    if (!totalPrice || !grossYield) return 0;
    return totalPrice * (grossYield / 100); // Annual amount
  }, [
    orderCalculations.totalOrderValue,
    updatedProperty?.investmentPerformance?.grossRentalYield,
  ]);

  //net yield year and month
  const yearNetYield = useMemo(() => {
    const totalPrice = orderCalculations.totalOrderValue;
    const netYield =
      updatedProperty?.investmentPerformance?.netRentalYield || 0;
    const grossYield =
      updatedProperty?.investmentPerformance?.grossRentalYield || 0;
    const insurancePercent = 5; // Lloyd's 5%

    if (!totalPrice || !netYield) return 0;

    const grossYieldAmount = totalPrice * (grossYield / 100);

    if (!llyodsAdded) {
      // No insurance
      return totalPrice * (netYield / 100);
    }

    // Insurance applied
    return (
      totalPrice * (netYield / 100) -
      grossYieldAmount * (insurancePercent / 100)
    );
  }, [
    orderCalculations.totalOrderValue,
    updatedProperty?.investmentPerformance?.netRentalYield,
    updatedProperty?.investmentPerformance?.grossRentalYield,
    llyodsAdded,
  ]);

  const monthNetYield = useMemo(() => {
    if (!yearNetYield) return 0;
    return yearNetYield / 12;
  }, [yearNetYield]);

  // returned yearly net return
  const yearlyuNetReturn = useMemo(() => {
    const totalPrice = orderCalculations.totalOrderValue;
    const netReturn = updatedProperty?.investmentPerformance?.irr || 0;
    const grossYield =
      updatedProperty?.investmentPerformance?.grossRentalYield || 0;
    if (!totalPrice || !netReturn) return 0;
    const grossYieldAmount = totalPrice * (grossYield / 100);

    if (!llyodsAdded) {
      // No insurance
      return totalPrice * (netReturn / 100);
    }
    // Insurance applied
    const insurancePercent = 5; // Lloyd's 5%
    return (
      totalPrice * (netReturn / 100) -
      grossYieldAmount * (insurancePercent / 100)
    );
  }, [
    updatedProperty?.investmentPerformance?.netRentalYield,
    updatedProperty?.investmentPerformance?.grossRentalYield,
    llyodsAdded,
    orderCalculations.totalShareValue,
  ]);

  const monthlyNetReturn = useMemo(() => {
    if (!yearlyuNetReturn) return 0;
    return yearlyuNetReturn / 12;
  }, [yearlyuNetReturn]);

  const handleNavigation = () => {};
  const propertyId = (params?.propertyId as string) || property._id;


  return (
    <>
      <div className="border border-gray-200 rounded-xl shadow-sm p-4 bg-white lg:w-[400px]">
        <div className="flex justify-between">
          <h1 className="text-lg font-bold">
            {/* {isPlaceOrder ? "Returns Summary" : "Calculate Returns"} */}
            Calculate Returns
          </h1>
          <div className="flex items-center justify-center gap-1">
            <span className="text-gray-600 text-[14px]"> Asset ID: </span>
            <span className="text-gray-600 text-sm">
              {" "}
              {params?.propertyId?.slice(-4)}
            </span>

            <button
              onClick={() => handleCopy(params?.propertyID as string)}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              {copied ? (
                <CopyCheck size={12} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>
        </div>
        <hr />
        <div className="pt-3">
          <Tabs defaultValue="monthly">
            <TabsList className="w-full flex bg-white rounded-none p-0 ">
              <TabsTrigger
                value="monthly"
                className="w-full py-2 px-4 text-sm font-medium border-b transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] rounded-none "
              >
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  Monthly
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="w-full py-2 px-4 text-sm font-medium border-b  transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#2563EB] rounded-none "
              >
                <div className="flex items-center gap-2">
                  <CalendarFold size={14} />
                  Yearly
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monthly">
              <MonthlyReturnsTab
                fees={fees}
                orderCalculations={orderCalculations}
                propertyValues={propertyValues}
                quantity={quantity}
                inputValue={inputValue}
                handleQuantityChange={handleQuantityChange}
                setInputValue={setInputValue}
                showBreakDown={showBreakDown}
                setShowBreakDown={setShowBreakDown}
                grossYield={roundDownToOneDecimal(monthGrossYield)}
                netyield={roundDownToOneDecimal(monthNetYield)}
                ownerShipPercantage={orderCalculations.investorOwnership}
                monthlyNetReturn={roundDownToOneDecimal(monthlyNetReturn)}
              />
            </TabsContent>
            <TabsContent value="yearly">
              <YearlyReturnsTab
                fees={fees}
                orderCalculations={orderCalculations}
                propertyValues={propertyValues}
                quantity={quantity}
                inputValue={inputValue}
                handleQuantityChange={handleQuantityChange}
                setInputValue={setInputValue}
                showBreakDown={showBreakDown}
                setShowBreakDown={setShowBreakDown}
                yearlyGrossYield={roundDownToOneDecimal(yearGrossYield)}
                yearlyNetYield={roundDownToOneDecimal(yearNetYield)}
                ownerShipPercantage={orderCalculations.investorOwnership}
                yearlyNetReturns={roundDownToOneDecimal(yearlyuNetReturn)}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex w-full flex-col justify-center  items-center gap-2 space-y-2">
          <div className="w-full ">
            {quantity === 0 ? (
              <div className="flex items-center justify-center gap-2 w-full">
                <Button
                  variant="primary"
                  disabled={
                    !!tokenError || quantity < 1 || quantity > propertyValues.maximumToken
                  }
                  className="w-full md:max-w-md text-white cursor-not-allowed bg-gray-300 font-semibold py-3 sm:py-4 lg:py-5 text-sm sm:text-base rounded-lg"
                  onClick={() => setStep("email")}
                >
                  Please select a Token
                </Button>
              </div>
            ) : accesToken ? (
              !kycCompleted ? (
                <div className="flex justify-center w-full">
                  <Button
                    variant="primary"
                    disabled={
                      !!tokenError || quantity < 1 || quantity > propertyValues.maximumToken
                    }
                    className="w-full md:max-w-md text-white cursor-pointer font-semibold py-3 sm:py-4 lg:py-5 text-sm sm:text-base rounded-lg transition-all duration-200 hover:opacity-90"
                    onClick={() => router.push("/kyc")}
                  >
                    Complete KYC to Invest
                  </Button>
                </div>
              ) : !walletAddress ? (
                <div className="flex justify-center w-full">
                  <div className="w-full md:max-w-md">
                    <ConnectWalletButton />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center w-full">
                  <Button
                    disabled={
                      !!tokenError || quantity < 1 || quantity > propertyValues.maximumToken
                    }
                    className="w-full md:max-w-md font-semibold bg-black hover:bg-black py-3 sm:py-4 lg:py-5 text-sm sm:text-base rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setStep("TokenSelecting")}
                  >
                    Invest  Now
                  </Button>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center w-full">
                <Button
                  variant="primary"
                  disabled={
                    !!tokenError ||
                    quantity < propertyValues.minimumToken ||
                    quantity > propertyValues.maximumToken
                  }
                  className="w-full md:max-w-md text-white cursor-pointer font-semibold py-3 sm:py-4 lg:py-5 text-sm sm:text-base rounded-lg transition-all duration-200 hover:opacity-90"
                  onClick={() => router.push("/auth/signin")}
                >
                  Login to Invest
                </Button>
              </div>
            )}
            {tokenError && (
              <Alert
                className="mt-4 border-l-4 border-red-MAXIMUMTOKEN bg-red-50 dark:bg-red-900/20 max-w-md mx-auto text-sm sm:text-base"
                variant="destructive"
              >
                <AlertTitle className="text-red-800 dark:text-red-200">
                  Error
                </AlertTitle>
                <AlertDescription className="text-red-600 dark:text-red-300">
                  {tokenError}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
         <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <div className="h-8 w-8  rounded-full bg-transparent  items-center justify-center">
              <LottieAnimation
                animationData={SecureAnimation}
                style={{ width: "100%", height: "100%", zIndex: 20 }}
              />
            </div>
            <span className="text-gray-600 text-md">
              {" "}
              Your unit is legally protected
            </span>
          </div>
          <button className="" onClick={() => setInfoDialog(true)}>
            <Info size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      <TokenSelectingDialog
        open={step === "TokenSelecting"}
        onOpenChange={() => setStep(null)}
        onSubmit={handleTokenSelectingSubmit}
        property={updatedProperty}
        quantity={quantity}
        setQuantity={setQuantity}
        totalPrice={orderCalculations.totalOrderValue}
        ownerShip={orderCalculations.investorOwnership}
      />

      {/* Replace TokenPaymentDialog with our new PaymentMethodDialog */}
      <PaymentMethodDialog
        open={step === "TokenPayment"}
        onOpenChange={() => setStep(null)}
        onSubmit={handleTokenPaymentSubmit}
        property={updatedProperty}
        onClick={() => setStep("TokenSelecting")}
        totalPrice={orderCalculations.totalOrderValue}
        quantity={quantity}
        ownerShip={orderCalculations.investorOwnership}
      />

      <InvestmentSummary
        open={step === "InvestmentSummary"}
        openChange={() => setStep(null)}
        response={response}
      />


      {/* <OtpDialog
        open={step === "otp"}
        onOpenChange={(open) => setStep(open ? "otp" : null)}
        email={email}
        token={token}
        onBack={() => setStep("email")}
        onSubmit={() => {
          setStep(null);
        }}
      /> */}

      <InvestmentSecurityDialog
        open={infoDialog}
        onOpenChange={setInfoDialog}
      />
    </>
  );
}