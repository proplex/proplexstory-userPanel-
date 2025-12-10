"use client"
import { defaultPagination } from "@/constants/global";
import api from "@/lib/httpClient";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { IProperty } from "@/constants/global";
import { AssetStyle, IKeyHighlights } from "@/components/projects/financials/key-highlights";

const paginationsItems = {

  limit : 5,
  page : 1,
  totalCount : 10,
  totalPages : 2,

};

export enum EAssetCategory {
  ALL = "all",
  COMMERCIAL = "commercial",
  HOLIDAY_HOMES = "holiday-homes",
  RESIDENTIAL = "residential",
  LAND_PARCEL = "land-parcel",
}

export interface IAsset extends IProperty {
  keyHighlights: IKeyHighlights;
}

export const useFetchPropertyById = (propertyID: string) => {
  const [property, setProperty] = useState<IAsset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const assetResponse = await api.get(`/assets/real-estate/${propertyID}`);
        const assetData: IProperty = assetResponse.data.data;
        const asset: IAsset = {
          ...assetData,
          keyHighlights: {
            assetStyle: assetData.style as AssetStyle,
            projectedAppreciation: assetData.investmentPerformance.targetCapitalAppreciation,
            totalAssetValue: assetData.totalPropertyValueAfterFees,
            totalAreaSqft: assetData.totalNumberOfSfts,
            pricePerSqft: assetData.pricePerSft,
            spvName: assetData.name,
            instrumentType: assetData.instrumentType,
          },
        };
        setProperty(asset);
      } catch (error: any) {
        setError(error);

      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, [propertyID]);

  return { property, error, loading };
};
