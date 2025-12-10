"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

interface ViewReviewProps {
  isViewReviewDialogOpen: boolean
  setIsViewReviewDialogOpen: (value: boolean) => void
  userReview: any
}

export const ViewReview = ({
  isViewReviewDialogOpen,
  setIsViewReviewDialogOpen,
  userReview
}: ViewReviewProps) => {
  const starRatings = [
    { src: "/1star.svg", hoverBg: "hover:bg-[#FF8888]", selectedBg: "bg-[#FF8888]", rating: "1.00" },
    { src: "/2.svg", hoverBg: "hover:bg-[#FFAEAE]", selectedBg: "bg-[#FFAEAE]", rating: "2.00" },
    { src: "/3star.svg", hoverBg: "hover:bg-[#FFF7B7]", selectedBg: "bg-[#FFF7B7]", rating: "3.00" },
    { src: "/4.svg", hoverBg: "hover:bg-[#BDFFB7]", selectedBg: "bg-[#BDFFB7]", rating: "4.00" },
    { src: "/5.svg", hoverBg: "hover:bg-[#8CFF82]", selectedBg: "bg-[#8CFF82]", rating: "5.00" }
  ]

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "A"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={isViewReviewDialogOpen} onOpenChange={setIsViewReviewDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Your Review</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-3 items-center">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={userReview?.user?.avatar} />
                  <AvatarFallback className="bg-gray-100">
                    {getInitials(userReview?.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{userReview?.user?.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(userReview?.review?.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {starRatings.map((star) => (
                  <div
                    key={star.rating}
                    className={`w-8 h-8 rounded-full flex items-center justify-center 
                      ${userReview?.review?.rating === star.rating ? star.selectedBg : 'bg-gray-100'}`}
                  >
                    <Image
                      src={star.src}
                      alt={`${star.rating} star`}
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {userReview?.review?.review}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewReview;