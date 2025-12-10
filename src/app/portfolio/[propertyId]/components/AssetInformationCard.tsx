"use client"

import { InfoIcon } from "@/components/common/InfoIcon"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, DollarSign, TrendingUp, Ruler, Layers, BuildingIcon, ChartArea, Building } from "lucide-react"
import dynamic from "next/dynamic";
const FandoraCard = dynamic(() => import("@/components/cards/RyzerCard"), { ssr: false });
type AssetInfoItem = {
  label: string
  value: string
  icon: React.ReactNode
  tooltipdata: string 
}

const assetInfo: AssetInfoItem[] = [
  {
    label: "Asset Type",
    value: "Commercial Building",
    icon: <BuildingIcon className="h-5 w-5 text-gray-500" />,
    tooltipdata: "Grade A office space",

  },
  {
    label: "Total Asset Value",
    value: "₹2,65,000.00",
    icon: <DollarSign className="h-5 w-5 text-gray-500" />,
    tooltipdata: "Professionally appraised value",
  },
  {
    label: "Projected Appreciation",
    value: "8.4% per annum",
    icon: <TrendingUp className="h-5 w-5 text-gray-500" />,
    tooltipdata: "Based on  Valuation Reports",
  },
  {
    label: "Price per SQT",
    value: "₹1,000",
    icon: <Ruler className="h-5 w-5 text-gray-500" />,
    tooltipdata: "Competitive market rate",
  },
  {
    label: "Total Area (SFT)",
    value: "5,000",
    icon: <ChartArea className="h-5 w-5 text-gray-500" />,
    tooltipdata: "Gross Carpet area ",
  },
]

export default function AssetInformationCard() {
  return (
     <FandoraCard title="Asset Information" tooltipData={false} isCollapsible={true} icon={<Building   size={16} className=" text-gray-600" />}    >

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {assetInfo.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">{item.label} <InfoIcon size={12} tooltip={item.tooltipdata as string}/></p>
              <p className="font-medium">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </FandoraCard>
  )
}
//