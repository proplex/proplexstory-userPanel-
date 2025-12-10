"use client"

import type React from "react"

import { useState } from "react"
import {
 
  Building,
  TrendingUp,
  DollarSign,
  LayoutGrid,
  Tag,
  Users,
  Percent,
  Info,
  Star,
  ChartArea,
  Ruler,
  Building2,
  Banknote,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toTitleCase } from "@/lib/format.utility"
import FandoraCrew from "@/components/cards/BudgetCard/FandoraCrew"
import dynamic from "next/dynamic"
import { formatCurrency } from "@/lib/utils"
import { InfoIcon } from "@/components/common/InfoIcon"
const FandoraCard = dynamic(() => import("@/components/cards/RyzerCard"), { ssr: false });


export enum AssetStyle {
  TOWER = "tower",
  VILLA = "villa",
  BUILDING = "building",
  DEVELOPED_LAND = "developed-land",
  INDIVIDUAL_LAND = "individual-land",
}

export interface IKeyHighlights {
  assetStyle: AssetStyle
  projectedAppreciation: number
  totalAssetValue: number
  totalAreaSqft: number
  pricePerSqft: number
  ownershipType?: string
  spvName?: string
  instrumentType: string

}

interface HighlightItemProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  info?: React.ReactElement
}

const HighlightItem = ({ icon, label, value,  info }: HighlightItemProps) => (
  <div className="flex items-start gap-4 p-2">
    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">{icon}</div>
    <div className="flex-grow">
      <div className="flex items-center gap-2">
        <p className="text-gray-600 text-sm">{label}</p>
        {info }
      </div>
      <div className="flex items-center gap-2">
        <p className="text-md font-semibold text-gray-900">{value}</p>      
      </div>
    </div>
  </div>
)



export const KeyHighlights = ({ keyHighlights }: { keyHighlights: IKeyHighlights }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const formatAssetStyle = (style: AssetStyle) => {
    switch (style) {
      case AssetStyle.BUILDING:
        return "Commercial Building"
      case AssetStyle.TOWER:
        return "Tower"
      case AssetStyle.VILLA:
        return "Villa"
      case AssetStyle.DEVELOPED_LAND:
        return "Developed Land"
      case AssetStyle.INDIVIDUAL_LAND:
        return "Individual Land"
      default:
        return style
    }
  }

  return (
    
   
      
    <FandoraCard title="Key Highlights" tooltipData={false} isCollapsible={true} icon={<Sparkles   size={16} className=" text-gray-600" />}    >
    
        <div className="grid grid-cols-1  rounded-xl md:grid-cols-2 gap-2 p-4 bg-gray-50 m-2">
          <HighlightItem
            icon={<Building size={16} className=" text-gray-600" />}
            label="Asset Style"
            value={formatAssetStyle(keyHighlights.assetStyle)}
            info={
            <InfoIcon size={12} tooltip="Asset Style is the type of asset that the property is. It is used to categorize the property and is used to determine the type of property that it is." />
            }
          />

          <HighlightItem
            icon={<TrendingUp size={16} className=" text-gray-600" />}
            label="Estimated Gross Yields"
            value={
              <>
                {keyHighlights.projectedAppreciation}%{" "}
                <span className="text-black text-sm font-bold">P.a</span>
              </>
            }
          />
          <HighlightItem
            icon={<Banknote size={16} className=" text-gray-600" />}
            label="Total Asset Value"
            value={formatCurrency(keyHighlights.totalAssetValue)}
          />

          <HighlightItem
            icon={<ChartArea size={16} className=" text-gray-600" />}
            label="Total Area (SFT)"
            value={keyHighlights.totalAreaSqft.toLocaleString()}
          />

          <HighlightItem
            icon={<Ruler size={16} className=" text-gray-600" />}
            label="Price per SQT"
            value={formatCurrency(keyHighlights.pricePerSqft)}
          />

          <HighlightItem
            icon={<Users size={16} className=" text-gray-600" />}
            label="Ownership Type"
            value={keyHighlights.ownershipType || "LLP Partnership"}
          />

          <HighlightItem
            icon={<Building2 size={16} className=" text-gray-600" />}
            label="SPV Name"
            value={keyHighlights.spvName || "LLP Partnership"}
          />

          <HighlightItem
            icon={<Percent size={16} className=" text-gray-600" />}
            label="Instrument Type"
            value={toTitleCase(keyHighlights.instrumentType)}
          />
        </div>
         </FandoraCard>
   
  )
}
