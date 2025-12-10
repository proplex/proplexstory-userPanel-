import { defaultPagination } from "@/constants/global";
import api from "@/lib/httpClient";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const paginationsItems = {
  limit: 5,
  page: 1,
  totalCount: 10,
  totalPages: 2,
};

export enum EAssetCategory {
  ALL = "all",
  COMMERCIAL = "commercial",
  HOLIDAY_HOMES = "holiday-homes",
  RESIDENTIAL = "residential",
  LAND_PARCEL = "land-parcel",
}

export const useFetchAllAssets = (
  page = 1,
  limit = 5,
  sort?: string,
  searchQuery?: string,
  bookmark: boolean = false,
  city?: string,
  assetStatus: string = "all"  
) => {
  const [properties, setProjects] = useState([]);
  const [pagination, setPagination] = useState(paginationsItems);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assetCategory, setAssetCategory] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const investorId = window.sessionStorage.getItem("userId");
        const categoryQuery = assetCategory ? `category=${assetCategory}` : "";
        const nameQuery = searchQuery ? `&name=${searchQuery}` : "";
        const sortQuery = sort && sort !== "all" ? `&sort=${sort}` : "";
        const cityQuery = city && city !== "all" ? `&city=${city}` : "";
        const assetStatusQuery = assetStatus && assetStatus !== "all" ? `&assetStatus=${assetStatus}`: "";
        const url = `/assets/real-estate?${investorId ? `&investorId=${investorId}` : ''}&${categoryQuery}&page=${Number(
          page
        )}&limit=${Number(limit)}${nameQuery}${
          bookmark ? `&bookmarked=${bookmark}` : ""}${sortQuery}${cityQuery}${assetStatusQuery}`;

        const projectsResponse = await api.get(url);
        setProjects(projectsResponse.data.data);
        setPagination(projectsResponse.data.pagination || defaultPagination);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [assetCategory, page, limit, sort, searchQuery, city, assetStatus]);

  useEffect(() => {
    const type: EAssetCategory = searchParams?.get(
      "assetCategory"
    ) as EAssetCategory;
    if (type) {
      if (type === EAssetCategory.ALL) {
        setAssetCategory("");
        return;
      }
      setAssetCategory(type);
    }
  }, [searchParams]);

  return { properties, pagination, error, loading };
};
