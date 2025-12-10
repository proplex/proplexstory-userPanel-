"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Copy, ArrowRight, CopyCheck, Key, BadgeIcon as IdCard } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import SecurityAcknowledgment from "@/components/common/SecurityAcknowledgment"
import SharesSelection from "../projects/orders/SharesSelection"
import { safeFormatCurrency, safeFormatPercentage } from "@/lib/format.utility"
import InvestmentBreakdown from "../projects/orders/InvestmentBreakdown"
import useTokenDetails from "@/hooks/order/useTokenDetails"
import useUserDetails from "@/hooks/user/useUserDetail"

import { toast } from "react-toastify"
import Image from "next/image"
interface InvestmentOverviewProps {
  projectId: string | undefined | string[] | null
  investmentOverview: any
}

export const InvestmentOverview: React.FC<InvestmentOverviewProps> = ({ projectId, investmentOverview }) => {
  // console.log("Investment Overview:", investmentOverview);
  const params = useParams()
  const projectID = params?.projectID as string
  const searchParams = useSearchParams()

  const orderID = searchParams?.get("orderID") || null

  const router = useRouter()
  const tokensSelected = searchParams?.get("tokensSelected") || 0

  const {
    data: tokenDetails,
    loading: tokenDetailsLoading,
    error: tokenDetailsError,
  }: any = useTokenDetails({ projectId: Number(projectID) })

  if (tokenDetailsError) {
    console.log(tokenDetailsError)
    toast.error(tokenDetailsError)
    router.push("/projects")
  }

  const [totalTokensSelected, setTotalTokensSelected] = useState<number>(
    isNaN(Number(tokensSelected)) ? 0 : Number(tokensSelected),
  )

  const orderCalculations = useMemo(() => {
    if (!tokenDetails || totalTokensSelected === 0) {
      return {
        totalShareValue: 0,
        totalOrderValue: 0,
        preTaxReturns: 0,
        eoiPercentage: 0,
        eoiToConfirmOrder: 0,
        investorOwnership: 0,
        breakdown: {
          totalSharesValue: 0,
          fees: [],
        },
      }
    }

    const totalShareValue = tokenDetails.token_amount * totalTokensSelected

    const totalFees = tokenDetails.fees.reduce((acc: number, fee: any) => {
      if (fee.name === "EOI") return acc
      return fee.is_percentage
        ? acc + (totalShareValue / 100) * Number.parseFloat(fee.value)
        : acc + Number.parseFloat(fee.value)
    }, 0)

    const eoiFee = tokenDetails.fees.find((fee: any) => fee.name === "EOI")
    const eoiPercentage = Number.parseFloat(eoiFee?.value || "0")
    const totalOrderValue = totalShareValue + totalFees

    return {
      totalShareValue,
      totalOrderValue,
      preTaxReturns: (tokenDetails.royalty_percentage / 100) * totalShareValue,
      eoiPercentage,
      eoiToConfirmOrder: (eoiPercentage / 100) * totalOrderValue,
      investorOwnership: tokenDetails.total_token === 0 ? 0 : (totalTokensSelected / tokenDetails.total_token) * 100,
      breakdown: {
        totalSharesValue: totalShareValue,
        fees: tokenDetails.fees,
      },
    }
  }, [tokenDetails, totalTokensSelected])

  const { data: user } = useUserDetails()

  const [isBreakdownVisible, setIsBreakdownVisible] = useState(true)

  const [tokenCount, setTokenCount] = useState(Math.floor(Number(investmentOverview?.shares) || 0))
  const [_, setCurrentInvestment] = useState(Number(investmentOverview?.investment) || 0)

  const [isProjectIDCopied, setIsProjectIDCopied] = useState(false)
  const [isKYCVerified, setIsKYCVerified] = useState(false)
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false)
  const [isPanVerified, setIsPanVerified] = useState(false)
  const [showPANDialog, setShowPANDialog] = useState<boolean>(false)

  const handleCopy = async (projectId: string) => {
    try {
      await navigator.clipboard.writeText(projectId)
      setIsProjectIDCopied(true)
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsProjectIDCopied(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  useEffect(() => {
    if (user?.aadhaar_verified && user?.pan_verified) {
      setIsKYCVerified(true)
    }
    if (user?.aadhaar_verified) {
      setIsAadhaarVerified(true)
    }
    if (user?.pan_verified) {
      setIsPanVerified(true)
    }
  }, [user])

  const handleAadharVerificationComplete = () => {
    setIsAadhaarVerified(true)
    setShowPANDialog(true)
  }

  const handleInvestClick = () => {
    // Proceed with investment if KYC is complete
    router.push(`/projects/${projectID}/invest?tokensSelected=${totalTokensSelected}`)
  }

  console.log("tokenDetails", tokenDetails);

  return (
    
    <article className="mt-3 sm:mt-10 md:mt-16 lg:mt-[92px] w-full bg-white rounded-[20px] border border-[#EBEBEB] shadow-sm hover:shadow-md">
      <div className="w-full flex  flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 sm:py-5 ">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
          Investment Overview
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs sm:text-sm text-gray-500 hover:text-gray-900 self-end sm:self-auto"
          onClick={() => handleCopy(projectId as string)}
        >
          Project ID:{" "}
          <span
            title="Project ID"
            className="max-w-[50px] sm:max-w-[75px] md:max-w-[100px] font-bold text-gray-900 truncate"
          >
            {projectId}
          </span>
          {isProjectIDCopied ? (
            <CopyCheck className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
          ) : (
            <Copy className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
          )}
        </Button>
      </div>

      <div className="flex flex-col items-stretch gap-4 sm:gap-6 p-4 sm:p-6 ">
        <div className="flex  items-strech sm:items-stretch justify-between px-3 sm:px-6 gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-8 w-8  p-2 rounded-full bg-gray-100 flex items-center justify-center">
              <Image src="/pre-tax-return.svg" alt="Pre tax-returns" width={24} height={24} />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Est Gross Yields</p>
              <p className="text-lg sm:text-xl font-bold">{safeFormatCurrency(orderCalculations.preTaxReturns)}</p>
            </div>
          </div>

          <div className="flex  items-center justify-center">
            <Separator className="w-[1px] h-full text-gray-600" />
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 h-8 w-8  p-2 rounded-full bg-gray-100 flex items-center justify-center">
              <Image src="/Up.svg" alt="Estimated Returns" width={20} height={20} />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Est Net Yields</p>
              <p className="text-lg sm:text-xl font-bold text-emerald-500">
                {safeFormatPercentage(tokenDetails?.royalty_percentage)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Separator className="w-full" />
        </div>

        <div className="flex flex-wrap  items-stretch  justify-center lg:justify-between md:justify-between sm:justify-between gap-4 sm:gap-0 ">
          <div className="flex items-start justify-center gap-2 p-1">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Image src="/Wallet.svg" alt="Ownership" width={20} height={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Your ownership</p>
              <p className="text-sm sm:text-base font-bold">
                {safeFormatPercentage(orderCalculations.investorOwnership)}
              </p>
            </div>
          </div>

          <div className="flex lg:flex  sm:flex md:flex ">
            <Separator className="w-[1px] h-full text-gray-600" />
          </div>

          <div className="flex items-center  justify-center  ">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Image src="/Lock.svg" alt="Lock-in period" width={16} height={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{`Lock-in period`}</p>
              <p className="text-sm sm:text-base font-bold">
               
                {  `${tokenDetails?.lock_in_period?.value} ${tokenDetails?.lock_in_period?.type} `}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex  sm:flex md:flex ">
            <Separator className="w-[1px] h-full text-gray-600" />
          </div>

          <div className="flex items-center justify-center">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Image src="/fill-activity.svg" alt="Shares" width={20} height={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Your shares</p>
              <p className="text-sm sm:text-base font-bold">{`${
                totalTokensSelected === undefined ? "N/A" : `${totalTokensSelected}`
              }`}</p>
            </div>
          </div>

        </div>
        
      </div>

      <SharesSelection
        availableSupply={tokenDetails?.available_token}
        tokensSelected={totalTokensSelected}
        totalOrderValue={orderCalculations.totalOrderValue}
        tokenPrice={tokenDetails?.token_amount}
        remainingTokens={tokenDetails?.available_token}
        className=" border-gray-200"
        onTokenChange={setTotalTokensSelected}
        underdesign={true}
      />

      <InvestmentBreakdown
        breakdown={orderCalculations.breakdown}
        tokenDetails={tokenDetails}
        totalShareValue={orderCalculations.totalShareValue}
      />

      <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 mt-4 px-4 sm:px-6 py-4 sm:py-6">
        {isKYCVerified ? (
          <Button
            onClick={handleInvestClick}
            disabled={tokenDetails?.available_token === 0 || totalTokensSelected === 0}
            className="w-full h-10 sm:h-12 bg-[#7F56D9] hover:bg-[#7F56D9]/90 text-white text-xs sm:text-sm md:text-base rounded-xl"
          >
            {"Let's Invest"}
            <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        ) : (
          <>
            {/* {!isAadhaarVerified ? (
              <VerifyAadharDialog>
                <span className="rounded-xl w-full h-10 sm:h-12 bg-[#7F56D9] hover:bg-[#7F56D9]/90 text-white flex items-center gap-2 sm:gap-3 justify-center px-3 sm:px-4">
                  <IdCard size={20} className="hidden sm:block" />
                  <IdCard size={16} className="sm:hidden" />
                  <p className="text-white font-light text-xs sm:text-sm md:text-base">Complete KYC to Invest</p>
                </span>
              </VerifyAadharDialog>
            ) : (
              <VerifyPANDialog open={showPANDialog} onOpenChange={setShowPANDialog}>
                <span className="rounded-xl w-full h-10 sm:h-12 bg-[#7F56D9] hover:bg-[#7F56D9]/90 text-white flex items-center gap-2 sm:gap-3 justify-center px-3 sm:px-4">
                  <Key size={20} className="hidden sm:block" />
                  <Key size={16} className="sm:hidden" />
                  <p className="text-xs sm:text-sm md:text-base">Complete KYC to Invest</p>
                </span>
              </VerifyPANDialog>
            )} */}
          </>
        )}

        <SecurityAcknowledgment />
      </div>
    </article>
  )
}

export default InvestmentOverview

