import React, { useRef } from "react";
import { IProperty } from "@/constants/global";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import FandoraCard from "@/components/cards/RyzerCard";
import { Building, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  features: IProperty["features"];
  amenities: IProperty["amenities"];
};

const Feature: React.FC<Props> = ({ features, amenities }) => {
  const featureRef = useRef<HTMLDivElement>(null);
  const amenityRef = useRef<HTMLDivElement>(null);

  const scroll = (
    ref: React.RefObject<HTMLDivElement>,
    direction: "left" | "right"
  ) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const renderItems = (
    items: Props["features"],
    ref: React.RefObject<HTMLDivElement>
  ) => (
    <div className="relative w-full max-w-full">
      <button
        onClick={() => scroll(ref, "left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-1 rounded-full"
        aria-label="Scroll left"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto p-2 scroll-smooth no-scrollbar"
      >
        {items.map((item) => (
          <div
            key={item.name}
            className="min-w-[240px] max-w-[240px] flex-shrink-0 rounded-xl shadow-md bg-white"
          >
            <div className="h-32 w-full relative">
              <Image
                src={item.image}
                alt={item.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-xl"
              />
            </div>
            <div className="p-3 space-y-1">
              <h4 className="text-sm font-semibold text-primary">
                {item.name}
              </h4>
              <p className="text-xs text-gray-700">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll(ref, "right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-1 rounded-full"
        aria-label="Scroll right"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  return (
    <FandoraCard
      title="Features & Amenities"
      isCollapsible
      icon={<Building size={16} className="text-gray-600" />}
    >
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="w-full border-b flex  border-gray-200 bg-white rounded-none">
          <TabsTrigger
            value="features"
            className="flex-1 text-black rounded-none -mb-2 flex justify-center items-center
                data-[state=active]:text-primary
                data-[state=active]:bg-transparent
                data-[state=active]:shadow-none
                data-[state=active]:border-b-2
                data-[state=active]:border-b-primary"
          >
            Features
          </TabsTrigger>
          <TabsTrigger
            value="amenities"
            className="flex-1 text-black rounded-none -mb-2 flex justify-center items-center
                data-[state=active]:text-primary
                data-[state=active]:bg-transparent
                data-[state=active]:shadow-none
                data-[state=active]:border-b-2
                data-[state=active]:border-b-primary"
          >
            Amenities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          {renderItems(features, featureRef)}
        </TabsContent>
        <TabsContent value="amenities">
          {renderItems(amenities, amenityRef)}
        </TabsContent>
      </Tabs>
    </FandoraCard>
  );
};

export default Feature;
