"use client";

import RyzerCard from "@/components/cards/RyzerCard";
import NothingFound from "@/components/common/NothingFound";
import { IProperty } from "@/constants/global";
import { Building2, Check } from "lucide-react";
import Image from "next/image";
import React from "react";

const HostedBy = ({ hostedBy }: { hostedBy: IProperty['hostedBy'] }) => {
  if (!hostedBy) {
    return (
      <div>
        <NothingFound text="No hosted by found" />
      </div>
    );
  }
   console.log(hostedBy)
  return (
    <RyzerCard title="Project owned by" isCollapsible={true} icon={<Building2 />}>
      <div className="p-4 space-y-6">
        {/* Top Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={hostedBy.logoURL || "/coursel.jpg"}
                alt={hostedBy.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{hostedBy.name || "Unknown"}</h3>
              <p className="text-sm text-muted-foreground">
                {hostedBy.address || "No address provided"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-medium">
            <Check className="w-4 h-4" />
            Verified
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Projects:</span>
            <span className="font-medium">{hostedBy.totalProjects || "0"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">On-going Projects:</span>
            <span className="font-medium">{hostedBy.onGoingProjects || "0"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Website:</span>
            <a
              href={hostedBy.website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline truncate max-w-[160px] text-right"
            >
              {hostedBy.website || "Not available"}
            </a>
          </div>
        </div>
      </div>
    </RyzerCard>
  );
};

export default HostedBy;
