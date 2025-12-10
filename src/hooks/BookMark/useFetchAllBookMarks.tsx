import { defaultPagination } from "@/constants/global";
import api from "@/lib/httpClient";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const paginationsItems = {

  limit : 10,
  page : 1,
  totalCount : 0,
  totalPages : 0,
  currentPage : 1,
};

export enum EAssetCategory {
  ALL = "all",
  COMMERCIAL = "commercial",
  HOLIDAY_HOMES = "holiday-homes",
  RESIDENTIAL = "residential",
  LAND_PARCEL = "land-parcel",
}

export const useFetchAllBookMarks = (page = 1, limit = 5, sort?: string , searchQuery?: string ) => {
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
        const categoryQuery = assetCategory ? `category=${assetCategory}` : '';
        const nameQuery = searchQuery ? `&name=${searchQuery}` : '';
        const url = `/assets/bookmark?page=${Number(page)}&limit=${Number(limit)}${nameQuery}`;
        
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
  }, [page, limit, sort, searchQuery]); // <-- ✅ Include searchQuery here
  // console.log(searchParams?.get("assetCategory"))  
  useEffect(() => {
    const type: EAssetCategory = searchParams?.get("assetCategory") as EAssetCategory;
    if (type) {
      if(type === EAssetCategory.ALL){
        setAssetCategory("");
        return;
      }
      setAssetCategory(type);
    }
  }, [searchParams]);

  return { properties, pagination, error, loading };
};