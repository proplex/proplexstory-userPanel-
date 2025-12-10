"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  BookmarkCheck,
  BookmarkIcon,
  Loader2,
  MapPin,
  Play,
  Share2Icon,
  Star,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import VideoDialog from "@/components/complete-kyc/VideoDialog";
import { toTitleCase } from "@/lib/format.utility";
import { IProperty } from "@/constants/global";
import ShareCard from "../ShareCard/ShareCard";
import useBookmark from "@/hooks/BookMark/useBookmark";
import { toast } from "react-toastify";
import { cn, formatCurrency, formatCurrencyWithOutZero } from "@/lib/utils";
import { InfoIcon } from "@/components/common/InfoIcon";

const CarouselComponent = dynamic(
  () => import("@/components/common/CourselComponet"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[220px] bg-gray-200 rounded-[10px] animate-pulse" />
    ),
  }
);

interface PropertyCardProps {
  property: IProperty;
}

export default function AssetCard({ property }: PropertyCardProps) {
  const [isClient, setIsClient] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(property?.isBookmarked);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const { bookmarkProperty } = useBookmark();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBookmarkToggle = async () => {
    try {
      setIsBookmarkLoading(true);
      const updatedBookmarkStatus = await bookmarkProperty(property._id);
      if (updatedBookmarkStatus) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to toggle bookmark.");
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const returns = property.investmentPerformance?.grossTargetIRR || 0;
  const formattedReturns = `${returns}%`;

  const totalTokens = property.tokenInformation?.tokenSupply || 5000;
  const availableTokens = property.tokenInformation?.availableTokensToBuy || 0;
  const investedPercentage = Math.round(
    ((totalTokens - availableTokens) / totalTokens) * 100
  );
  const lockInPeriod = property.investmentPerformance?.lockInPeriodValue || 1;
  const lockInType = property.investmentPerformance?.lockInPeriodType || "year";
  const lockInText = `${lockInPeriod} ${lockInType}${
    lockInPeriod > 1 ? "s" : ""
  }`;

  const images =
    property?.media?.imageURL || property?.media?.gallery?.length > 0
      ? [property?.media?.imageURL, ...(property?.media?.gallery || [])].filter(
          Boolean
        )
      : ["/coursel.jpg"];

  const hasVideo = !!property.media?.videoURL;
  const rating = 4.6;

  if (!isClient) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-xl bg-white border border-gray-100">
      <div className="group relative p-2">
        <CarouselComponent
          images={images}
          className="rounded-[10px] h-[220px]"
          navigation={false}
          autoplay={false}
        />

        <Badge className="absolute left-4 top-4 bg-[#12B981] text-white font-medium px-4 py-1 rounded-full">
          {toTitleCase(property.category)}
        </Badge>

        <div className="hidden group-hover:flex absolute right-4 top-4 gap-2">
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "h-10 w-10 rounded-full bg-white",
              isBookmarked ? "text-primary" : "text-gray-400"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleBookmarkToggle();
            }}
          >
            {isBookmarkLoading ? (
              <span className="animate-spin">
                <Loader2 className="w-4 h-4 text-black sm:w-3 sm:h-3 md:w-6 md:h-6" />
              </span>
            ) : isBookmarked ? (
              <BookmarkCheck className="text-primary" fill="currentColor" />
            ) : (
              <BookmarkIcon className="text-primary" />
            )}
          </Button>

          {isShareOpen && (
            <ShareCard
              isOpen={isShareOpen}
              onClose={() => setIsShareOpen(false)}
              shareUrl={`${window.location.origin}/property/${property._id}`}
              title={property?.name}
            />
          )}

          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 rounded-full bg-white"
            onClick={() => setIsShareOpen(true)}
          >
            <Share2Icon />
          </Button>
        </div>

        {isVideoOpen && (
          <VideoDialog
            isVideoOpen={isVideoOpen}
            setIsVideoOpen={setIsVideoOpen}
            name={property?.name}
            media_value={property?.media?.videoURL}
          />
        )}

        {hasVideo && (
          <Button
            className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/70 p-2 text-white hover:bg-black/80"
            onClick={() => setIsVideoOpen(true)}
          >
            <Play size={10} />
            <span className="text-sm font-medium">Watch video</span>
          </Button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold truncate">{property.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <MapPin size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-500">
            {property?.landmark}
          </span>
        </div>

        <div className="flex justify-between items-center gap-4 rounded-lg bg-[#F9FAFB] p-2 mt-4 ">
          <div className="flex flex-col">
            <div className="flex justify-center items-center gap-1 text-gray-500 ">
              <span className="text-xs ">Exp Yield</span>
              <InfoIcon
                tooltip={formatCurrency(property?.totalPropertyValueAfterFees)}
                size={10}
              />
            </div>
            <span className="text-base font-semibold text-[#12B981]">
              {property?.investmentPerformance?.grossRentalYield || 0}%
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-center items-center gap-1 text-gray-500 ">
              <span className="text-xs ">Est. IRR</span>
              <InfoIcon
                tooltip={formatCurrency(property?.totalPropertyValueAfterFees)}
                size={10}
              />
            </div>
            <span className="text-base font-semibold  text-[#12B981]">
              {property?.investmentPerformance?.irr?.toFixed(2) || 0}%
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-center items-center gap-1  text-gray-500 ">
              <span className="text-xs ">Asset Value</span>
              <InfoIcon
                tooltip={formatCurrency(property?.totalPropertyValueAfterFees)}
                size={10}
              />
            </div>
            <span className="text-base font-semibold">
              {formatCurrency(property?.totalPropertyValueAfterFees)}
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-[#04966A]">
              {investedPercentage}% Invested
            </span>
            <span className="text-sm text-purple-500 font-medium">
              {availableTokens} Tokens left
            </span>
          </div>
          <Progress value={investedPercentage} className="h-2" />
        </div>

      {property.investors && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-4">
              {property.investors.slice(0, 3).map((i, index) => (
                <Avatar key={index} className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={i.avatar} />
                  <AvatarFallback>{i.fullName}</AvatarFallback>
                </Avatar>
              ))}
              {property.investors.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white text-[10px] flex items-center justify-center font-semibold text-gray-700">
                  {property.investors.length - 3}
                </div>
              )}
            </div>
            <span className="text-gray-700 font-semibold text-xs">
              {property.investors.length} Investors
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-xs">{rating}</span>
          </div>
          </div>
      )}

        <Button
          className="mt-3 w-full bg-black text-white py-4 rounded-lg lg:bg-transparent lg:border-black lg:text-black lg:hover:bg-black lg:hover:text-white xl:bg-transparent xl:border-black xl:text-black xl:hover:bg-black xl:hover:text-white 2xl:bg-transparent 2xl:border-black 2xl:text-black 2xl:hover:bg-black 2xl:hover:text-white"
          variant="outline"
          onClick={() => router.push(`/property/${property._id}`)}
        >
          View details
        </Button>
      </div>
    </article>
  );
}
