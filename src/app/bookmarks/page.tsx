"use client";
import { Bookmark } from "lucide-react";
import React, { useState, Suspense } from "react";
import { useFetchAllBookMarks } from "@/hooks/BookMark/useFetchAllBookMarks";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/cards/PropertyCard";
import NothingFound from "@/components/common/NothingFound";
import BookmarkSearch from "./[components]/BookmarkSearch";
import FilterTabs from "./[components]/FilterTabs";

const BookmarksContent = () => {
  const [page, setPage] = useState(1);
  const { properties, pagination, error, loading } = useFetchAllBookMarks(
    page,
    10,
    "all",
    undefined
  );

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4">
      {/* Search Bar */}
      <div className="w-full">
        <BookmarkSearch onSearch={() => {}} searchQuery={""} />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start mt-8 sm:mt-10 space-y-2 sm:space-y-0">
        <div className="flex items-center">
          <Bookmark size={24} className="text-primary mr-2" />
          <h1 className="text-lg sm:text-2xl font-bold">Your Bookmarks</h1>
          <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-2 text-sm sm:text-base">
            {properties?.length || 0}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-4 sm:mt-6">
        <FilterTabs />
      </div>

      {/* Listings Section */}
      <section className="w-full flex flex-col mt-6 items-center justify-center">
        <div
          className={`grid w-full gap-4 sm:gap-5 ${
            properties.length > 0
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 place-items-center"
          }`}
        >
           {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="w-full">
          {/* Mobile: horizontal scroll */}
          <div className="md:hidden flex gap-4 overflow-x-auto px-1 snap-x snap-mandatory scroll-smooth">
            {properties.map((project : any) => (
              <div key={project._id} className="min-w-[85%] snap-start">
                <ProjectCard property={project} />
              </div>
            ))}
          </div>

          {/* Desktop: grid layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {properties.map((project : any) => (
              <ProjectCard key={project._id} property={project} />
            ))}
          </div>
          
        </div>
      ) : (
        <NothingFound text="No Assets found" />
      )}
        </div>
      </section>
    </div>
  );
}; 

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookmarksContent />
    </Suspense>
  );
};

export default page;
