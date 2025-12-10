"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFetchAllAssets } from "@/hooks/project/useFetchAssets";
import HomeClientWrapper from "./HomeClientWrapper";
import { withClientNavigation } from "@/lib/client-wrappers";

const HomePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("all");
  const [city, setCity] = useState("all"); 
  const [assetStatus, setAssetStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const assetCategory = searchParams?.get("assetCategory");

  const { properties, pagination, loading } = useFetchAllAssets(
    page,
    10,
    sort,
    searchQuery,
    false,
    city,
    assetStatus
  );

  useEffect(() => {
    if (!assetCategory) {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("assetCategory", "all");
      if(searchParams?.get("assetCategory") !== "all") {
        router.replace(`?${params.toString()}`);
      }
    }
    setPage(1);
  }, [assetCategory, searchParams, router]);

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
    <div>
      <HomeClientWrapper
        projects={properties}
        loading={loading}
        onSortChange={handleSortChange}
        onCityChange={handleCityChange}
        currentSort={sort}
        currentCity={city} 
        pager={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onAssetStatusChange={handleAssetStatusChange}
        assetStatus={assetStatus}
      />
    </div>
  );
};

export default withClientNavigation(HomePageContent);
