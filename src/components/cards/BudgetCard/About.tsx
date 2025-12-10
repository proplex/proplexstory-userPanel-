"use client";

import NothingFound from "@/components/common/NothingFound";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

interface IAboutProps {
  desc: string;
}

const MAX_LENGTH = 300;

const AboutCard: React.FC<IAboutProps> = ({ desc }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldShowToggle = desc.length > MAX_LENGTH;
  const displayedText = isExpanded ? desc : desc.slice(0, MAX_LENGTH);

  return (
    <div className="w-full bg-white rounded-lg">
      {desc ? (
        <div className="p-4 space-y-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-sm text-gray-900">{displayedText}{!isExpanded && shouldShowToggle && '...'}</p>
            {shouldShowToggle && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:underline text-sm font-medium"
              >
                {isExpanded ?  <span className="flex items-center gap-2">Show Less <ChevronUp size={16} /></span> :   <span className="flex items-center gap-2">Show More <ChevronDown size={16} /></span>}
              </button>
            )}
          </div>
        </div>
      ) : (
        <NothingFound text="No description found" />
      )}
    </div>
  );
};

export default AboutCard;
