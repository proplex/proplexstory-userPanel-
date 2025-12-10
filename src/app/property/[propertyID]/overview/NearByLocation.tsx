"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MapPinIcon } from "lucide-react";
import type { IProperty } from "@/constants/global";

const FandoraCard = dynamic(() => import("@/components/cards/RyzerCard"), {
  ssr: false,
});
const NothingFound = dynamic(() => import("@/components/common/NothingFound"), {
  ssr: false,
});

const NearByLocation = ({
  nearByLocations,
  name,
  lat,
  lng,
  landmark,
}: {
  nearByLocations: IProperty["nearByLocations"];
  name: string;
  lat: number;
  lng: number;
  landmark: string;
}) => {
  // Extract location types dynamically from object keys
  const locationTypes = useMemo(() => {
    if (!nearByLocations || typeof nearByLocations !== "object") {
      return ["school", "gym", "hospital", "cafe", "cinema"];
    }
    return Object.keys(nearByLocations).filter(
      (key: any) =>
        Array.isArray(nearByLocations[key]) && nearByLocations[key].length > 0
    );
  }, [nearByLocations]);

  // Initialize selectedType directly from locationTypes (no useEffect)
  const [selectedType, setSelectedType] = useState<any>(
    locationTypes.length > 0 ? locationTypes[0] : "school"
  );
  const [showAll, setShowAll] = useState(false);

  // Get filtered + sorted locations for current type
  const filteredLocations = useMemo(() => {
    if (
      !nearByLocations ||
      !selectedType ||
      !Array.isArray(nearByLocations[selectedType])
    ) {
      return [];
    }

    return [...nearByLocations[selectedType]].sort((a, b) => {
      const distanceA =
        typeof a.distanceInKm === "number"
          ? a.distanceInKm
          : parseFloat(a.distanceInKm || "0");
      const distanceB =
        typeof b.distanceInKm === "number"
          ? b.distanceInKm
          : parseFloat(b.distanceInKm || "0");
      return distanceA - distanceB;
    });
  }, [nearByLocations, selectedType]);

  return (
    <div className="space-y-6">
      <FandoraCard
        title="Around Property"
        isCollapsible={true}
        icon={<MapPinIcon size={16} className=" text-gray-600" />}
      >
        <div className="border border-gray-200 rounded-lg p-4">
          {/* Property info */}
          <div className="flex items-center justify-between p-2">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
              <p className="text-sm text-gray-500">{landmark}</p>
            </div>
            <Button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps?q=${lat},${lng}`,
                  "_blank"
                )
              }
              className="flex py-2 px-2 border border-gray-100 rounded-md hover:bg-gray-50 hover:text-gray-900"
              variant="outline"
            >
              <MapPinIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-primary ml-2">
                Map View
              </span>
            </Button>
          </div>

          {/* Location type filters */}
          <div className="flex space-x-4 overflow-auto no-scrollbar pb-2">
            {locationTypes.map((type) => (
              <Button
                variant="outline"
                key={type}
                className={`px-4 py-2 w-auto rounded-full hover:bg-black hover:text-white capitalize ${
                  selectedType === type
                    ? "bg-black text-white"
                    : "bg-white border-white"
                }`}
                onClick={() => {
                  setSelectedType(type);
                  setShowAll(false);
                }}
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Locations list */}
          {filteredLocations.length > 0 ? (
            <div className="mt-4 space-y-4">
              {filteredLocations
                .slice(0, showAll ? undefined : 2)
                .map((location) => (
                  <div key={location._id} className="p-4 border rounded-lg">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{location.name}</h3>
                      <span className="text-sm text-gray-500">
                        {typeof location.distanceInKm === "number"
                          ? location.distanceInKm.toFixed(1)
                          : location.distanceInKm}{" "}
                        km
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 mt-1">
                        {location.address}
                      </p>
                      <MapPinIcon className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                ))}
              <div className="flex items-center border-t border-gray-200 justify-center">
                {filteredLocations.length > 5 && (
                  <Button
                    variant="link"
                    className="text-sm flex items-center justify-center"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll
                      ? "Show less"
                      : `View all ${filteredLocations.length} ${selectedType}${
                          filteredLocations.length > 1 ? "s" : ""
                        }`}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <NothingFound text={`No ${selectedType} found nearby`} />
            </div>
          )}
        </div>
      </FandoraCard>
    </div>
  );
};

export default NearByLocation;