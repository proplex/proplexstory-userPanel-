"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic imports for Carousel components
const Carousel = dynamic(() => import("@/components/ui/carousel").then(mod => mod.Carousel), { ssr: false });
const CarouselContent = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselContent), { ssr: false });
const CarouselItem = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselItem), { ssr: false });

interface DynamicCarouselProps {
  images: string[];
  className?: string;
  navigation?: boolean; // Show navigation arrows
  autoplay?: boolean;   // Enable autoplay
}

const DynamicCarousel: React.FC<DynamicCarouselProps> = ({
  images,
  className,
  navigation = false,
  autoplay = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<any>();
  
  // Ref for autoplay plugin
  const autoplayPlugin = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update current index when slide changes
  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api || !mounted) return;

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect, mounted]);

  if (!mounted) return null;

  return (
    <div className="relative w-full">
      <Carousel
        className="w-full max-w-full"
        opts={{
          align: "center",
          loop: true,
        }}
        setApi={setApi}
        plugins={autoplay ? [autoplayPlugin.current] : []} // ✅ Autoplay condition
      >
        <CarouselContent className={cn("rounded-[50px]", className)}>
          {images.map((imageUrl, index) => (
            <CarouselItem key={index} className="basis-full">
              <div className="p-0">
                <Image
                  src={imageUrl || "/coursel.jpg"}
                  alt={`Carousel image ${index + 1}`}
                  width={1200}
                  height={1000}
                  className={cn("w-full h-[400px] object-cover rounded-[10px] shadow-sm", className)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows */}
        {navigation && api && (
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
            <button
              onClick={() => api.scrollPrev()}
              className="bg-white/50 hover:bg-white/75 rounded-full p-1 transition-colors"
            >
              <ChevronLeft className="text-black" size={20} />
            </button>
            <button
              onClick={() => api.scrollNext()}
              className="bg-white/50 hover:bg-white/75 rounded-full p-1 mr-2.5 transition-colors"
            >
              <ChevronRight className="text-black" size={20} />
            </button>
          </div>
        )}
      </Carousel>

      {/* Dots indicators */}
      {navigation && (
      <div className="flex absolute bottom-5 left-0 right-0 items-center justify-center gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-[20px] h-[6px] bg-white"
                : "w-[10px] h-[10px] bg-[#FFFFFF66]"
            }`}
            aria-label={`Slide ${index + 1} of ${images.length}`}
            aria-current={index === currentIndex ? "true" : "false"}
          />
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicCarousel;
