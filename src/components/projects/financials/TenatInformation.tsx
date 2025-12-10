"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Tenant, IRentalInformation } from "@/constants/global";
import { Button } from "@/components/ui/button";
import { toTitleCase } from "@/lib/format.utility";
import FandoraCard from "@/components/cards/RyzerCard";

export default function TenantInformation({
  tenants,
  rentInformation,
  totalSft,
}: {
  tenants: Tenant[];
  rentInformation: IRentalInformation;
  totalSft: number;
}) {
  const [selectedTenant, setSelectedTenant] = useState(tenants[0]?._id || "");
  const [rentView, setRentView] = useState("monthly");

  const activeTenant =
    tenants.find((tenant) => tenant._id === selectedTenant) || tenants[0];

  return (
    <FandoraCard
      title="Tenant Information"
      tooltipData={false}
      isCollapsible={true}
      icon={<Users />}
    >
      <>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div className="text-gray-500 text-sm mb-1">Total Area (SFT)</div>
            <div className="text-base sm:text-lg font-bold">{totalSft}</div>
          </div>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div className="text-gray-500 text-sm mb-1">Rent Per SFT</div>
            <div className="text-base sm:text-lg font-bold">
              {formatCurrency(rentInformation?.rentPerSft)}
            </div>
          </div>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div className="text-gray-500 text-sm mb-1">Vacancy Rate (%)</div>
            <div className="text-base sm:text-lg font-bold">
              {rentInformation?.vacancyRate}%
            </div>
          </div>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div className="text-gray-500 text-sm mb-1">Total SFT Gross Rent</div>
            <div className="text-base sm:text-lg font-bold">
              {formatCurrency(rentInformation?.grossMonthlyRent)}
            </div>
          </div>
        </div>

        {/* Rental Income */}
        <div className="border rounded-lg mb-6">
          <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold">Rental Income</h3>
            <div className="bg-gray-100 rounded-full p-1 self-start sm:self-auto">
              <Tabs value={rentView} onValueChange={setRentView}>
                <TabsList className="bg-transparent flex">
                  <TabsTrigger
                    value="monthly"
                    className={cn(
                      "text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1",
                      rentView === "monthly"
                        ? "bg-white shadow-sm"
                        : "bg-transparent"
                    )}
                  >
                    Monthly Rent
                  </TabsTrigger>
                  <TabsTrigger
                    value="yearly"
                    className={cn(
                      "text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1",
                      rentView === "yearly"
                        ? "bg-white shadow-sm"
                        : "bg-transparent"
                    )}
                  >
                    Yearly Rent
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">Gross Rent</div>
              <div className="text-base sm:text-lg font-bold">
                {formatCurrency(
                  rentView === "monthly"
                    ? rentInformation?.grossMonthlyRent
                    : rentInformation?.grossAnnualRent
                )}
              </div>
            </div>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">Expenses</div>
              <div className="text-base sm:text-lg font-bold">
                {formatCurrency(
                  rentView === "monthly"
                    ? rentInformation?.expenses?.monthlyExpenses
                    : rentInformation?.expenses?.annualExpenses
                )}
              </div>
            </div>
            <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
              <div className="text-gray-500 text-sm mb-1">Net Rent</div>
              <div className="text-base sm:text-lg font-bold text-green-600">
                {formatCurrency(
                  rentView === "monthly"
                    ? rentInformation?.netMonthlyRent
                    : rentInformation?.netAnnualRent
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Current Tenants */}
        <div className="border rounded-lg">
          <div className="p-3 sm:p-4 border-b">
            <h3 className="text-base sm:text-lg font-bold">Current Tenants</h3>
          </div>

          <div className="border-b overflow-x-auto">
            <div className="flex min-w-max">
              {tenants
                .filter((t) => t.status === "active")
                .map((tenant) => (
                  <button
                    key={tenant._id}
                    className={cn(
                      "px-4 sm:px-6 py-3 text-sm whitespace-nowrap",
                      selectedTenant === tenant._id
                        ? "border-b-2 border-blue-600 font-medium"
                        : ""
                    )}
                    onClick={() => setSelectedTenant(tenant._id)}
                  >
                    {tenant?.name}
                  </button>
                ))}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gray-100 overflow-hidden">
                <Image
                  src={activeTenant?.logo || "/coursel.jpg"}
                  alt={activeTenant?.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold">
                  {activeTenant?.name}
                </h4>
                <p className="text-gray-500 text-sm">
                  {toTitleCase(activeTenant?.type)}
                </p>
              </div>
              <div className="sm:ml-auto">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                  Tenant{" "}
                  {tenants?.findIndex((t) => t._id === selectedTenant) + 1}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <InfoBlock label="Lease period" value={`${activeTenant?.leasePeriod} Months`} />
              <InfoBlock label="Start Date" value={formatDate(activeTenant?.startDate)} />
              <InfoBlock label="Lock-in Period" value={`${activeTenant?.lockInPeriod} Months`} />
              <InfoBlock label="Total Occupied SFT" value={activeTenant?.sftsAllocated} />
              <InfoBlock label="Rent Per SFT" value={formatCurrency(activeTenant?.rentPerSft)} />
              <InfoBlock label="Security deposit" value={formatCurrency(activeTenant?.securityDeposit)} />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-200 mt-4 pt-4 gap-3">
              <div>
                <div className="text-gray-500 text-sm">Annual Rent Escalation</div>
                <div className="text-md font-semibold text-green-600">
                  {activeTenant?.annualRentEscalation}% Per year
                </div>
              </div>
              <Button variant="outline" className="flex items-center justify-center w-full sm:w-auto">
                <a
                  href={activeTenant?.agreement}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:text-primary/70"
                >
                  <span className="mr-2">Lease agreement</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </>
    </FandoraCard>
  );
}

/** Reusable info block for cleaner code */
const InfoBlock = ({ label, value }: { label: string; value: any }) => (
  <div>
    <div className="text-gray-500 text-xs sm:text-sm mb-1">{label}</div>
    <div className="text-sm sm:text-md font-semibold">{value}</div>
  </div>
);
