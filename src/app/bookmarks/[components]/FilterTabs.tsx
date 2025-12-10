"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const navItems = [
  { id: "all", name: "All" },
  { id: "commercial", name: "Commercial" },
  { id: "holiday-homes", name: "Holiday Homes" },
  { id: "residential", name: "Residential" },
  { id: "land-parcel", name: "Land Parcel" },
];

const FilterTabs = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams?.get("assetCategory") || navItems[0].id;
  const [activeTab, setActiveTab] = useState(initialTab);

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set(key, value);
    router.replace(`?${params.toString()}`);
  };

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    updateSearchParams("assetCategory", id);
  };

  return (
    <div className="w-full">
      {/* 🔹 Mobile: horizontal scroll */}
      <div className="flex md:hidden gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`${
              activeTab === item.id
                ? "bg-primary text-white"
                : "text-gray-700 bg-white border border-gray-300"
            } flex-shrink-0 min-w-max px-4 py-2 text-sm snap-start`}
          >
            {item.name}
          </Button>
        ))}
      </div>

      {/* 🔹 Desktop: inline buttons */}
      <div className="hidden md:flex flex-wrap gap-3 mt-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`${
              activeTab === item.id
                ? "bg-primary text-white"
                : "text-gray-700 bg-white border border-gray-300"
            } px-5 py-2 text-sm`}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterTabs;
