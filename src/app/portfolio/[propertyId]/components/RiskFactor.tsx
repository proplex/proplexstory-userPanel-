import React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { CircleAlert } from "lucide-react";
const FandoraCard = dynamic(() => import("@/components/cards/RyzerCard"), {
  ssr: false,
});

const RiskFactor = () => {
  return (
    <Card className=" shadow-none p-4">
      <div className="flex gap-2 text-lg font-bold">
        <CircleAlert className="h-6 w-6 bg-[#FFEAEA] p-1 text-red-600 rounded-md" />
        Risk Factors
      </div>
        <div className="p-2 flex flex-col gap-2">
            <FandoraCard
          title="Rental yield risk"
          tooltipData={false}
          isCollapsible={true}
        >
            <p className="text-sm text-[#374151] p-3">
                In finance, risk factors are the building blocks of investing, that help explain the systematic returns in the market, and the possibility of losing money in investments. Disclosure to the exposures of risk factors and extent of the risks are the best way to evaluate your investment
            </p>
        </FandoraCard>
        <FandoraCard
          title="Liquid risk"
          tooltipData={false}
          isCollapsible={true}
        >
            <p className="text-sm text-[#374151] p-3">
                In finance, risk factors are the building blocks of investing, that help explain the systematic returns in the market, and the possibility of losing money in investments. Disclosure to the exposures of risk factors and extent of the risks are the best way to evaluate your investment
            </p>
        </FandoraCard>
        <FandoraCard
          title="Asset Management risk"
          tooltipData={false}
          isCollapsible={true}
        >
            <p className="text-sm text-[#374151] p-3">
                In finance, risk factors are the building blocks of investing, that help explain the systematic returns in the market, and the possibility of losing money in investments. Disclosure to the exposures of risk factors and extent of the risks are the best way to evaluate your investment
            </p>
        </FandoraCard>
        </div>
    </Card>
  );
};

export default RiskFactor;
