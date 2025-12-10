"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  FileText,
  Handshake,
  Scale,
  Shield,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Fee {
  _id: string;
  assetId: string;
  type: string;
  name: string;
  value: number;
  isPercentage: boolean;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface IProperty {
  basePropertyValue: number;
  totalPropertyValueAfterFees: number;
  fees?: {
    registration?: Fee[];
    legal?: Fee[];
    platform?: Fee[];
    brokerage?: Fee[];
  };
  tokenPrice: number;
}

const formatCurrencyDisplay = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    // Billions
    return `Kshs ${(amount / 1_000_000_000).toFixed(1)}B`;
  } else if (amount >= 1_000_000) {
    // Millions
    return `Kshs ${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 1_000) {
    // Thousands
    return `Kshs ${(amount / 1_000).toFixed(1)}K`;
  } else {
    // Below 1K → show normally
    return `Kshs ${amount.toLocaleString("en-KE")}`;
  }
};


const formatCurrencyFull = (amount: number) => {
  return `Kshs${amount.toLocaleString("en-KE")}.00`;
};

const Costing = ({
  basePropertyValue,
  totalPropertyValueAfterFees,
  fees,
  tokenPrice,
}: IProperty) => {
  const registrationFeesList =
    fees?.registration?.filter((item) => item.status) || [];
  const legalFeesList = fees?.legal?.filter((item) => item.status) || [];
  const platFormFeeList = fees?.platform?.filter((item) => item.status) || [];
  const brokerageFeeList = fees?.brokerage?.filter((item) => item.status) || [];

  // Registration fee calculation
  const totalRegistrationPercentage = registrationFeesList
    .filter((item) => item.isPercentage === true)
    .reduce((sum, item) => sum + item.value, 0);
  const totalRegistrationFixed = registrationFeesList
    .filter((item) => !item.isPercentage)
    .reduce((sum, item) => sum + item.value, 0);
  const totalRegistrationValue =
    (basePropertyValue * totalRegistrationPercentage) / 100 +
    totalRegistrationFixed;

  // Legal fee calculation
  const totalLegalPercentage = legalFeesList
    .filter((item) => item.isPercentage)
    .reduce((sum, item) => sum + item.value, 0);
  const totalLegalFixed = legalFeesList
    .filter((item) => !item.isPercentage)
    .reduce((sum, item) => sum + item.value, 0);
  const totalLegalValue =
    (basePropertyValue * totalLegalPercentage) / 100 + totalLegalFixed;

  // Platform fee calculation
  const totalPlatFormPercentage = platFormFeeList
    .filter((item) => item.isPercentage)
    .reduce((sum, item) => sum + item.value, 0);
  const totalPlatformFixed = platFormFeeList
    .filter((item) => !item.isPercentage)
    .reduce((sum, item) => sum + item.value, 0);
  const totalPlatformValue =
    (basePropertyValue * totalPlatFormPercentage) / 100 + totalPlatformFixed;

  // Brokerage fee calculation
  const totalBokeragePercentage = brokerageFeeList
    .filter((item) => item.isPercentage)
    .reduce((sum, item) => sum + item.value, 0);
  const totalBokerageFixed = brokerageFeeList
    .filter((item) => !item.isPercentage)
    .reduce((sum, item) => sum + item.value, 0);
  const totalBokerageValue =
    (basePropertyValue * totalBokeragePercentage) / 100 + totalBokerageFixed;

  const totalCost =
    basePropertyValue +
    totalRegistrationValue +
    totalLegalValue +
    totalBokerageValue +
    totalPlatformValue;

  const costData = [
    {
      id: "property",
      title: "Property Price",
      description: "Base property value",
      amount: basePropertyValue,
      displayAmount: formatCurrencyDisplay(basePropertyValue),
      fullAmount: formatCurrencyFull(basePropertyValue),
      icon: DollarSign,
      color: "#77c49e",
    },
    {
      id: "registration",
      title: "Registration Fees",
      description: "Govt registration charges",
      amount: totalRegistrationValue,
      displayAmount: formatCurrencyDisplay(totalRegistrationValue),
      fullAmount: formatCurrencyFull(totalRegistrationValue),
      icon: FileText,
      color: "#6f9cf2",
    },
    {
      id: "legal",
      title: "Legal Fees",
      description: "Documentation & Verification",
      amount: totalLegalValue,
      displayAmount: formatCurrencyDisplay(totalLegalValue),
      fullAmount: formatCurrencyFull(totalLegalValue),
      icon: Scale,
      color: "#eeb462",
    },
    {
      id: "brokerage",
      title: "Brokerage Charges",
      description: "Agent commission fees",
      amount: totalBokerageValue,
      displayAmount: formatCurrencyDisplay(totalBokerageValue),
      fullAmount: formatCurrencyFull(totalBokerageValue),
      icon: Handshake,
      color: "#ee7b7b",
    },
    {
      id: "platform",
      title: "Platform Fees",
      description: "Service platform charges",
      amount: totalPlatformValue,
      displayAmount: formatCurrencyDisplay(totalPlatformValue),
      fullAmount: formatCurrencyFull(totalPlatformValue),
      icon: Smartphone,
      color: "#8a77c4",
    },
  ];

  // Chart data for pie chart
  const chartData = costData
    .filter((item) => item.amount > 0)
    .map((item) => ({
      name: item.title,
      value: item.amount,
      color: item.color,
      displayAmount: item.displayAmount,
      percentage: ((item.amount / totalCost) * 100).toFixed(1),
    }));

  // Custom legend component
  const CustomLegend = () => (
    <div className="space-y-4">
      {costData.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between border rounded-lg p-2"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-700">{item.title}</span>
          </div>
          <div className="text-right">
            <div className=" font-semibold text-gray-900">
              {item.amount > 0
                ? ((item.amount / totalCost) * 100).toFixed(1)
                : "0"}
              %
            </div>
            <div className="text-[10px] text-gray-500">
              {item.displayAmount}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Cost Breakdown Section */}
          <div className="border rounded-lg p-1">
            <h1 className="text-lg font-bold text-gray-900 p-2">
              Cost Breakdown
            </h1>
            <div className="space-y-4 p-2">
              {costData.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Card
                    key={item.id}
                    className="border shadow-none bg-white"
                  >
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm text-gray-900">
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className=" font-semibold text-gray-900">
                            {item.displayAmount}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {item.fullAmount}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <hr />

              {/* Total Investment */}
              <Card className="border border-gray-200 shadow-sm bg-gray-50">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 border rounded-lg bg-white">
                        <TrendingUp className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Total Investment
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrencyDisplay(totalCost)}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {formatCurrencyFull(totalCost)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Cost Distribution Section */}
          <div className="border rounded-lg">
            <h1 className="text-lg font-bold text-gray-900 p-2">
              Cost Distribution
            </h1>
            <Card className=" bg-white border-none shadow-none">
              <CardContent className="p-2">
                <div className="flex flex-col">
                  {/* Donut Chart */}
                  <div className="h-[100px] w-full mb-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25} // smaller inner hole
                          outerRadius={50} // smaller overall size
                          // paddingAngle={2}
                          dataKey="value"
                          // stroke="#ffffff"
                          // strokeWidth={2}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                          <Tooltip
                            formatter={(
                              value: number,
                              name: string,
                              props: any
                            ) => [
                              `${value.toLocaleString()}`, 
                              name,
                            ]}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #ddd",
                              borderRadius: "8px",
                              padding: "4px 8px",
                              fontSize: "12px",
                            }}
                          />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend */}
                  <CustomLegend />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Costing;
