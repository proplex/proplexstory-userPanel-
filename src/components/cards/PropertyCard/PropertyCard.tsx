"use client"

import {  useState } from "react"
import { MapPin,  Star, BookmarkIcon, Share2Icon, PlayIcon, Loader2, BookmarkCheck, ChartLineIcon, TrendingUpIcon, CoinsIcon, LockIcon, IndianRupee } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
const CarouselComponent = dynamic(() => import("@/components/common/CourselComponet"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[220px] bg-gray-200 rounded-[10px] animate-pulse" />
  )
});
import VideoDialog from "@/components/complete-kyc/VideoDialog"
import { Progress } from "@/components/ui/progress"
import { IProperty } from "@/constants/global"
import { InfoIcon } from "@/components/common/InfoIcon"
import ShareCard from "../ShareCard/ShareCard"
import dynamic from "next/dynamic"
import useBookmark from "@/hooks/BookMark/useBookmark"
import AssetReview from "./review/AssetReview"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { toTitleCase } from "@/lib/format.utility"
import { toast } from "react-toastify"
interface PropertyCardProps {
  property: IProperty
  className?: string
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(property?.isBookmarked);
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const { bookmarkProperty } = useBookmark();

  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const totalTokens = property?.tokenInformation?.tokenSupply || 50
  const availableTokens = property?.tokenInformation?.availableTokensToBuy || 0
  const soldTokens = totalTokens - availableTokens
  const percentInvested = Math.round((soldTokens / totalTokens) * 100)

  // Format returns (using targetCapitalAppreciation or netTargetIRR)
  const returns = typeof property?.investmentPerformance?.targetCapitalAppreciation === 'number' 
    ? property.investmentPerformance.targetCapitalAppreciation 
    : typeof property?.investmentPerformance?.netTargetIRR === 'number'
    ? property.investmentPerformance.netTargetIRR
    : 0

  // Get lock-in period
  const lockInPeriod = typeof property?.investmentPerformance?.lockInPeriodValue === 'number'
    ? property.investmentPerformance.lockInPeriodValue
    : 1
  const lockInUnit = typeof property?.investmentPerformance?.lockInPeriodType === 'string'
    ? property.investmentPerformance.lockInPeriodType
    : "year"

  // Get token price
  const tokenPrice = typeof property?.tokenInformation?.tokenPrice === 'number'
    ? property.tokenInformation.tokenPrice
    : 5000
  const currency = property?.currency === "kes" ? "Kshs" : "$"

  // Placeholder for stage label
  const stageLabel = typeof property?.category === 'string' ? property.category : ''

  const images = property?.media?.imageURL || (Array.isArray(property?.media?.gallery) && property.media.gallery.length > 0)
    ? [property?.media?.imageURL].filter(Boolean)
    : [
        "/coursel.jpg",
      ]
  const videoUrl = typeof property?.media?.videoURL === 'string' ? property.media.videoURL : ""

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsVideoOpen(true)
  }

  const handleBookmarkToggle = async () => {
    try {
      setIsBookmarkLoading(true);
      const updatedBookmarkStatus = await bookmarkProperty(property._id);
      if (updatedBookmarkStatus) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row rounded-lg overflow-hidden bg-white shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300",
        className
      )}
    >
      {/* Left side - Image/Video */}
      <div className="relative group w-full md:w-2/5 h-[300px] md:h-auto overflow-hidden">
        <div className="w-full h-full">
          <CarouselComponent images={images} className="rounded-[10px]   h-[315px] w-full" navigation={false} autoplay={false} />
        </div>

        {isVideoOpen && (
          <VideoDialog
            isVideoOpen={isVideoOpen}
            setIsVideoOpen={setIsVideoOpen}
            name={property?.name}
            media_value={videoUrl}
          />
        )}

        {videoUrl && (
          <div
            className="absolute bottom-4 left-4 flex items-center gap-2"
            onClick={handleVideoClick}
          >
            {/* <div className="flex-shrink-0 rounded-full ">
              <PlayIcon className="h-4 w-4 text-white" />
            </div>
            <p className="text-white text-sm font-bold">Watch Video</p> */}
            <Image src= "/watchvideo.svg" alt="video" width={40} height={40} className="cursor-pointer" />
          </div>
        )}

        <div className="absolute group-hover:opacity-100 opacity-0 transition-opacity duration-300 top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-md text-sm font-medium">
          {toTitleCase(stageLabel)}
        </div>
      </div>

      {/* Right side - Details */}
      <div className="flex-1 flex flex-col p-5 md:p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{property?.name}</h2>
            <div className="flex items-center text-gray-600 mt-1.5">
              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span className="text-sm">{property?.landmark || "Location not specified"},{property?.city}</span>
            </div>
          </div>
          <div className="flex gap-2 ml-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-md border-gray-200 hover:bg-gray-50 text-primary/04 hover:text-primary"
              onClick={handleBookmarkToggle}
            >
             {isBookmarkLoading ? (
              <span className="animate-spin"><Loader2 className="w-4 h-4 sm:w-3 text-black sm:h-3 md:w-6 md:h-6" /></span>
            ) : isBookmarked ? (
              <BookmarkCheck className="text-primary" fill="currentColor" />
            ) : (
              <BookmarkIcon className="text-primary" />
            )}
            </Button>
            {isShareOpen && <ShareCard isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} shareUrl={window.location.href} title={property?.name} />}

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-md border-gray-200 hover:bg-gray-50 hover:text-primary"
              onClick={() => setIsShareOpen(true)}

            >
              <Share2Icon className="h-4 w-4" />
              <span className="sr-only">Share property</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-100/80 rounded-md p-2">
            <div className="flex items-center justify-between gap-1 text-gray-500 mb-1 text-sm"> 
              <span>Est APY</span>
              <InfoIcon className="ml-1 text-gray-400"  tooltip="Estimated Annual Percentage Yield" />

              {/* <Info className="h-3.5 w-3.5 ml-1 text-gray-400" /> */}
            </div>
            <div className="text-emerald-500 font-bold text-xl">+{String(returns)}%</div>
          </div>

          <div className="bg-gray-100/80 rounded-md p-2">
            <div className="flex items-center justify-between gap-1 text-gray-500 mb-1 text-sm">
             
              <span>KES Per Token</span>
              <InfoIcon className="ml-1 text-gray-400"  tooltip="KSH is the currency of Kenya" />
            </div>
            <div className="font-bold text-xl text-gray-900">
              {currency} {String(tokenPrice).toLocaleString()}
            </div>
          </div>

          <div className="bg-gray-100/80 rounded-md p-2">
            <div className="flex items-center justify-between gap-1 text-gray-500 mb-1 text-sm">
              <span>Lock-in</span>
              <InfoIcon className="ml-1 text-gray-400"  tooltip="Lock-in period is the time period for which the token is locked in" />
            </div>
            <div className="font-bold text-xl text-gray-900">
              {String(lockInPeriod)} {lockInUnit}
            </div>
          </div>

          <div className="bg-gray-100/80 rounded-md p-2">
            <div className="flex items-center justify-between gap-1 text-gray-500 mb-1 text-sm">
              <span>Total Tokens</span>
              <InfoIcon className="ml-1 text-gray-400"  tooltip="Total number of tokens available for purchase" />
            </div>
            <div className="font-bold text-xl text-black">{String(totalTokens)}</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{percentInvested}% Invested</span>
            <span className="text-sm font-medium text-gray-700">{availableTokens} Tokens left</span>
          </div>
          <div className="w-full bg-gray-100  rounded-full h-2.5">
            <Progress value={percentInvested} className="h-2" />

          </div>
        </div>

        <div className="flex justify-between items-center mt-auto pt-6">
          <div className="flex items-center">
            <div className="flex -space-x-2">
            {[1, 2, 3].map((index) => (
                <Avatar key={index} className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={`/Avatar${index}.png`} />
                  <AvatarFallback>{index}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-700">{23} Investors</span>
          </div>

          <div className="flex items-center justify-center cursor-pointer" onClick={() => setIsReviewOpen(true)}>
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 font-semibold">4.6</span>
            <span className="ml-1 text-sm text-black font-medium">Reviews</span>
          </div>
          {isReviewOpen && <AssetReview open={isReviewOpen} onOpenChange={setIsReviewOpen} />}
        </div>
      </div>
    </div>
  )
}
