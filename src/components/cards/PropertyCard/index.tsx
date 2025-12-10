"use client";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import useBookmark from "@/hooks/BookMark/useBookmark";

const AssetCard = dynamic(() => import("./AssetCard"), { 
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 rounded-xl" />
    </div>
  )
});

const ProjectCard = ({ property }: { property: any }) => {
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const [isBookmarked, setIsBookmarked] = useState(property?.isBookmarked);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [progressValue, setProgressValue] = useState<number>(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const location = property?.hosted_by?.name || "N/A";

  const [totalShares] = useState(property?.total_token);
  const [invesedToken] = useState(property?.total_token - property?.available_token);
  const [progress, setProgress] = useState(invesedToken / totalShares * 100);

  const navigate = useRouter();
  const { bookmarkProperty } = useBookmark();

  useEffect(() => {
    setIsClient(true);
    setMounted(true);
    const timer = setTimeout(() => {
      const validProgress = isNaN(progress) ? 0 : progress;
      setProgressValue(validProgress);
    }, 500);
    return () => clearTimeout(timer);
  }, [progress]);

  const handleProjectClick = () => {
    return navigate.push(`/projects/${property?.id}`);
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsBookmarkLoading(true);
      const updatedBookmarkStatus = await bookmarkProperty(property.id);
      if (updatedBookmarkStatus) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoOpen(true);
  };

  const handleOpenReviewDialog = () => {
    setIsReviewDialogOpen(true);
  };

  const media_value = property?.media_value;

  // Common props that will be passed to both card variants
  const commonProps = {
    property,
    isBookmarked,
    isBookmarkLoading,
    progressValue,
    handleBookmarkToggle,
    handleProjectClick,
    setIsShareOpen,
    handleVideoClick,
    handleOpenReviewDialog,
    media_value,
    location,
    isShareOpen,
    setIsVideoOpen,
    isVideoOpen,
    isReviewDialogOpen,
    setIsReviewDialogOpen
  };

  if (!isClient || !mounted) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <>
      
        <AssetCard {...commonProps} />
     
    </>
  );
};

export default ProjectCard;