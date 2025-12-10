"use client"

import React from "react"
import dynamic from 'next/dynamic'
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import the carousel component with no SSR
const DynamicCarousel = dynamic(() => import('./DynamicCarousel'), {
  ssr: false,
  loading: () => (
    <div className="w-[500px] h-[320px]">
      <Skeleton className="w-full h-full rounded-[10px]" />
    </div>
  )
})

interface CarouselComponentProps {
  images: string[]
  className?: string
  navigation?: boolean
  autoplay?: boolean
}

const CarouselComponent: React.FC<CarouselComponentProps> = ({ images, className, navigation, autoplay }) => {
  return (
    <DynamicCarousel 
      images={images || 
        [
          "/coursel.jpg",
          // "/coursel2.jpg",
          // "/coursel3.jpg",
          // "/coursel4.jpg",
        ]
      } 
      className={className}
      navigation={navigation}
      autoplay={autoplay}
    />
  )
}

export default CarouselComponent