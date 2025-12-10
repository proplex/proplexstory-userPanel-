"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronDown, ChevronUp, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ReviewDialogProps {
  isOpen: boolean
  onClose: () => void
  reviews?: any
  userReview?: any // The current user's review object
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({ 
  isOpen, 
  onClose, 
  reviews,
  userReview 
}) => {
  const [expandedReviews, setExpandedReviews] = useState<number[]>([])

  const toggleReview = (index: number) => {
    setExpandedReviews((prev) => 
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  console.log(userReview);
  
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={cn(
            "w-4 h-4",
            index < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
          )}
        />
      ))
  }

  const getInitials = (name = "") => {
    return (
      name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "A"
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // If userReview exists, show it first, then show other reviews
  const allReviews = userReview 
    ? [userReview, ...(Array.isArray(reviews) ? reviews.filter((r: any) => r.id !== userReview.id) : [])]
    : Array.isArray(reviews) ? reviews : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {userReview ? 'Edit Review' : 'Add Review'}
          </DialogTitle>
          <p className="text-sm text-gray-500">
            {allReviews.length > 0 ? `${allReviews.length} ${allReviews.length === 1 ? 'review' : 'reviews'}` : 'No reviews yet'}
          </p>
        </DialogHeader>

        {allReviews.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No reviews yet. Be the first to review!
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {allReviews.map((review: any, index: number) => (
              <div key={review?.id || index} className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3 items-center justify-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review?.user?.avatar} />
                      <AvatarFallback className="bg-gray-100">
                        {getInitials(review?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{review?.user?.name}</h3>
                      {review?.id === userReview?.id && (
                        <span className="text-xs text-blue-500">(Your Review)</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {renderStars(Number(review?.rating))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(review?.created_at)}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex gap-2">
                    <p className={cn(
                      "text-sm text-gray-600",
                      !expandedReviews.includes(index) && "line-clamp-1"
                    )}>
                      {review?.review}
                    </p>
                    {review?.review?.length > 100 && (
                      <button
                        onClick={() => toggleReview(index)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={expandedReviews.includes(index) ? "Show less" : "Show more"}
                      >
                        {expandedReviews.includes(index) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ReviewDialog

