import React, { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface AssetReviewProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const AssetReview: React.FC<AssetReviewProps> = ({
    open,
    onOpenChange,
}) => {
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState("")

    const getRatingText = (rating: number) => {
        switch (rating) {
          case 1:
            return "Bad Experience"
          case 2:
            return "Average Experience"
          case 3:
            return "Good Experience"
          case 4:
            return "Great Experience"
          case 5:
            return "Excellent Experience"
          default:
            return ""
        }
      }
    return (
     <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[500px] p-0 gap-0">
        <DialogHeader className="p-4 pb-2 flex flex-row items-center border-b border-gray-200 justify-between">
          <DialogTitle className="text-lg font-bold">Property Reviews</DialogTitle>
       
        </DialogHeader>
        <div className="p-4 pt-6 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-lg font-medium">Add Your Review</h2>
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm">Rate this property</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                    <StarIcon filled={rating >= star} className="w-8 h-8" />
                  </button>
                ))}
              </div>
              {rating > 0 && <p className="text-sm font-medium text-[#725ACE]">{getRatingText(rating)}</p>}

            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm">Share your experience</p>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you like about this property investment? Any suggestions for improvement?"
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600">Submit Review</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
 
    )
}

export default AssetReview

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} ${className}`}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>

    )
  }
  