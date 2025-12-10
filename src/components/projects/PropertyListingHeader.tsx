"use client";

import React from "react";
import {
  ArrowUpDown,
  TrendingUp,
  Globe,
  CircleCheck,
  Clock,
} from "lucide-react";
import dynamic from "next/dynamic";

const Select = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.Select),
  { ssr: false }
);
const SelectContent = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectContent),
  { ssr: false }
);
const SelectItem = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectItem),
  { ssr: false }
);
const SelectTrigger = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectTrigger),
  { ssr: false }
);
const SelectValue = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectValue),
  { ssr: false }
);

interface SortOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ProjectsListingHeaderProps {
  onSearch: (query: string) => void;
  onSort: (value: string) => void;
  onCityChange: (value: string) => void;
  onAssetStatusChange?: (value: string) => void;
  assetStatus?: string;
  currentSort: string;
  currentCity: string;
  searchQuery?: string;
  cityOptions: { value: string; label: string }[];
}

const SORT_OPTIONS: SortOption[] = [
  { value: "all", label: "All" },
  { value: "high-returns", label: "High returns" },
  { value: "low-returns", label: "Low Returns" },
  { value: "newest", label: "Newest" },
  { value: "most-popular", label: "Most Popular" },
];

const ASSET_STATUS_OPTIONS: SortOption[] = [
  { value: "all", label: "All Assets" },
  {
    value: "active",
    label: "Active Assets",
    icon: <Clock className="text-blue-500" size={16} />,
  },
  {
    value: "completed",
    label: "Coming Soon",
    icon: <CircleCheck className="text-green-500" size={16} />,
  },
];

const ProjectsListingHeader: React.FC<ProjectsListingHeaderProps> = ({
  onSort,
  onCityChange,
  currentCity,
  cityOptions,
  onAssetStatusChange,
  assetStatus,
  currentSort,
}) => {
  const handleSortChange = React.useCallback(
    (value: string) => {
      onSort(value);
    },
    [onSort]
  );

  const handleCityChange = React.useCallback(
    (value: string) => {
      onCityChange(value);
    },
    [onCityChange]
  );

  const handleAssetStatusChange = React.useCallback(
    (value: string) => {
      onAssetStatusChange?.(value);
    },
    [onAssetStatusChange]
  );

  const uniqueCityOptions = React.useMemo(() => {
    const seen = new Set<string>();
    return cityOptions
      .filter((option) => {
        const normalized = option.value.trim().toLowerCase();
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      })
      .map((option) => ({
        ...option,
        label:
          option.label.charAt(0).toUpperCase() +
          option.label.slice(1).toLowerCase(),
      }));
  }, [cityOptions]);

  return (
    <div className="w-full sm:text-xs">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="text-gray-800" />
          <h2 className="text-xs lg:text-xl font-bold text-gray-800">
            Trending Assets
          </h2>
        </div>
        <div className="flex items-center justify-center gap-2 sm:text-xs">
          {/* City Filter */}
          <div className="flex items-center justify-center gap-2">
            <Select onValueChange={handleCityChange} value={currentCity || "all"}>
              <SelectTrigger className="bg-transparent border-gray-300 hover:bg-gray-50">
                <p className="text-gray-500 flex items-center gap-1">
                  <Globe className="w-4 h-4 text-gray-700 max-sm:w-2 max-sm:h-2 " />
                </p>
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <p className="px-2">{option.label}</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Asset Status */}
          <div className="flex items-center">
            <Select
              onValueChange={handleAssetStatusChange}
              value={assetStatus || "all"}
            >
              <SelectTrigger className="rounded-lg bg-transparent border-gray-300 hover:bg-gray-50">
                <SelectValue placeholder="Asset Status" />
              </SelectTrigger>
              <SelectContent>
                {ASSET_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="px-2 flex items-center justify-start gap-2">
                      {option.icon && (
                        <span className="text-gray-500">{option.icon}</span>
                      )}
                      {option.label && (
                        <span className="max-sm:text-xs">{option.label}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="flex items-center">
            <Select
              onValueChange={handleSortChange}
              value={currentSort || "all"}
            >
              <SelectTrigger className="w-full rounded-lg bg-transparent border-gray-300 hover:bg-gray-50">
                <p className="text-gray-500 flex items-center gap-1">
                  <ArrowUpDown className="w-4 h-4 text-gray-700" />
                </p>
                <SelectValue placeholder="Sort by: " />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <p className="px-2">{option.label}</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsListingHeader;
