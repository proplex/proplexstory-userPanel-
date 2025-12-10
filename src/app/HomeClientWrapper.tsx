"use client";

import { Suspense } from "react";
import TopPartnersSkeleton from "@/assets/skeleton/PartnerSkeleton";
import ProjectsSkeleton from "@/assets/skeleton/Projects";
import ProjectNav from "@/components/projects/PropertyNav";
import { UniversalPagination } from "@/components/common/UniversalPagination";
import dynamic from "next/dynamic";
import { useState } from "react";
const ProjectsListing = dynamic(
  () => import("@/components/projects/PropertyListing"),
  {
    ssr: false,
    loading: () => <ProjectsSkeleton />,
  }
);

const Header = dynamic(() => import("@/components/common/Header"), {
  ssr: false,
  loading: () => <div className="w-full h-16 bg-gray-100 animate-pulse" />,
});

interface HomeClientWrapperProps {
  projects: any[];
  loading: boolean;
  onSortChange: (sort: string) => void;
  onCityChange: (city: string) => void; 
  currentSort: string;
  currentCity: string; 
  pager: any;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onAssetStatusChange?: (value: string) => void;
  assetStatus: string;
}

const HomeClientWrapper = ({
  projects,
  loading,
  onPageChange,
  onSortChange,
  onCityChange, 
  currentSort,
  currentCity, 
  pager,
  onSearch,
  searchQuery,
  onAssetStatusChange,
  assetStatus,
}: HomeClientWrapperProps) => {
  const handleOnsortchange = (sort: string) => {
    onSortChange(sort);
  };
  const handleOnCityChange = (city: string) => {
    onCityChange(city);
  };
  const handleAssetStatusChange = (value: string) => {
    onAssetStatusChange?.(value);
  }
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <main className="max-w-6xl mx-auto flex flex-col gap-6 items-stretch p-3">
          <section className="w-full flex flex-col items-center justify-center">
            <ProjectNav onSearch={onSearch} searchQuery={searchQuery} />
            <ProjectsListing
              properties={projects}
              loading={loading}
              onSortChange={handleOnsortchange}
              onCityChange={handleOnCityChange}
              currentSort={currentSort}
              currentCity={currentCity}
              pager={pager}
              onPageChange={onPageChange}
              onAssetStatusChange={handleAssetStatusChange}
              assetStatus={assetStatus}
            />
            {pager.totalPages > 1 && (
              <UniversalPagination
                currentPage={pager.page}
                totalPages={pager.totalPages}
                onPageChange={onPageChange}
              />
            )}
          </section>
        </main>
      </Suspense>
    </div>
  );
};

export default HomeClientWrapper;
