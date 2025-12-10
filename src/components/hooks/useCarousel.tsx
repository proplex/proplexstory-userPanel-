"use client"

import { useState } from "react"

export function useCarousel() {
  const [api, setApi] = useState<any>(null)

  return {
    setApi,
    selectedScrollSnap: () => api?.selectedScrollSnap(),
    on: (event: string, callback: () => void) => {
      api?.on(event, callback)
    },
    off: (event: string, callback: () => void) => {
      api?.off(event, callback)
    },
  }
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

