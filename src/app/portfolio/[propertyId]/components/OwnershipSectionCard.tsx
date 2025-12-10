"use client";

import { InfoIcon } from "@/components/common/InfoIcon";
import {
  Users,
  Percent,
  FileText,
  Coins,
  Vote,
  Download,
  ArrowUpRight,
  User,
} from "lucide-react";
import dynamic from "next/dynamic";
const FandoraCard = dynamic(() => import("@/components/cards/RyzerCard"), { ssr: false });

type ownershipItem = {
  label: string;
  value: string;
  icon: React.ReactNode;
  tooltipdata: string;
  secondaryIcon?: React.ReactNode;
};

const ownership: ownershipItem[] = [
  {
    label: "Ownership Type",
    value: "LLP Partnership",
    icon: <Users className="h-5 w-5 text-gray-500" />,
    tooltipdata: "Limited liability protection",
  },
  {
    label: "Instrument Type",
    value: "Equity",
    icon: <Percent className="h-5 w-5 text-gray-500" />,
    tooltipdata: "Limited liability protection",
  },
  {
    label: "SPV Name",
    value: "LLP Patnership",
    icon: <FileText className="h-5 w-5 text-gray-500" />,
    tooltipdata: "Dedicated entity",
  },
  {
    label: "Tokens Status",
    value: "Issued",
    icon: <Coins className="h-5 w-5 text-gray-500" />,
    secondaryIcon: <Download size={16}/>,
    tooltipdata: "Download the token certificate",
  },
  {
    label: "Tokens Name",
    value: "PROP001",
    icon: <Coins className="h-5 w-5 text-gray-500" />,
    secondaryIcon: <ArrowUpRight size={16}/>,
    tooltipdata: "Token name on Blockchain",
  },
  {
    label: "Voting Rights",
    value: "Yes",
    icon: <Vote className="h-5 w-5 text-gray-500" />,
    tooltipdata: "Investor can caste his vote",
  },
];

export default function OwnershipSectionCard() {
  return (
     <FandoraCard title="OwnerShip & Legal" tooltipData={false} isCollapsible={true} icon={<User   size={16} className=" text-gray-600" />}    >

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {ownership.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                {item.label}{" "}
                {<InfoIcon size={12} tooltip={item.tooltipdata as string} />}
              </p>

              {item.value && item.value == "Issued" ? (
                <div className="flex items-center gap-2">
                <p className="text-sm text-primary border border-primary bg-primary/20 w-16 text-center rounded-xl">
                  {item.value}
                </p>
                {item.secondaryIcon}
                </div>
              ) : (
               <div className="flex items-center gap-2">
                 <p className="font-medium">{item.value}</p>
                 {item.secondaryIcon}
               </div>
              )}
              
            </div>
          </div>
        ))}
      </div>
    </FandoraCard>
  );
}
