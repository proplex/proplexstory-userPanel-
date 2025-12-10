"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFetchAllAssets } from "@/hooks/project/useFetchAssets";
import { UniversalPagination } from "@/components/common/UniversalPagination";
import { withClientNavigation } from "@/lib/client-wrappers";

const ProjectsSkeleton = dynamic(() => import("@/assets/skeleton/Projects"), {
  ssr: false,
  loading: () => (
    <div>
      <ProjectsSkeleton />
    </div>
  ),
});

const ProjectsListing = dynamic(
  () => import("@/components/projects/PropertyListing"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full flex items-center justify-center">
        <ProjectsSkeleton />
      </div>
    ),
  }
);

const ProjectNav = dynamic(() => import("@/components/projects/PropertyNav"), {
  ssr: false,
  loading: () => <div></div>,
});

const PropertyPageContent = () => {
  const [sort, setSort] = useState("all");
  const [city, setCity] = useState("all");
  const [page, setPage] = useState(1);
  const [assetStatus, setAssetStatus] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const assetCategory = searchParams?.get("assetCategory");

  useEffect(() => {
    if (!assetCategory) {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("assetCategory", "all");
      router.replace(`?${params.toString()}`);
    }
    setPage(1); 
  }, [assetCategory, searchParams, router]);

  const { properties, pagination, loading } = useFetchAllAssets(
    page,
    10,
    sort,
    searchQuery,
    false,
    city,
    assetStatus,
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAssetStatusChange = (value: string) => {
    setAssetStatus(value);
  };

  return (
    <main className="max-w-6xl mx-auto flex flex-col gap-6 items-stretch p-6">
      <ProjectNav onSearch={handleSearch} searchQuery={searchQuery} />

      <section className="w-full flex flex-col items-center justify-center">
        <ProjectsListing
          properties={properties}
          loading={loading}
          onSortChange={handleSortChange}
          onCityChange={handleCityChange}
          currentSort={sort}
          currentCity={city}
          pager={pagination}
          onPageChange={handlePageChange}
          onAssetStatusChange={handleAssetStatusChange}
          assetStatus={assetStatus}
        />
        {pagination && (
          <UniversalPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </main>
  );
};

export default withClientNavigation(PropertyPageContent);
