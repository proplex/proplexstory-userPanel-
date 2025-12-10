"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/utils";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import React from "react";

interface BalanceRow {
  asset: string;
  symbol: string;
  methods: string[];
  available: number;
  fiatValue: string;
}

interface BalanceTableProps {
  balances: BalanceRow[];
}

type SortKey = "asset" | "available" | "fiatValue";

export const BalanceTable: React.FC<BalanceTableProps> = ({ balances }) => {
  const [selectedCurrency, setSelectedCurrency] = React.useState<string>("all");
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortKey;
    direction: "asc" | "desc";
  } | null>(null);

  const filteredBalances = balances.filter((row) => {
    if (selectedCurrency === "all") return true;
    return row.symbol.toLowerCase() === selectedCurrency;
  });

  const sortedBalances = React.useMemo(() => {
    if (!sortConfig) return filteredBalances;

    return [...filteredBalances].sort((a, b) => {
      let aVal: string | number = a[sortConfig.key];
      let bVal: string | number = b[sortConfig.key];

      if (sortConfig.key === "fiatValue") {
        aVal = parseFloat(String(aVal).replace(/[^0-9.-]+/g, ""));
        bVal = parseFloat(String(bVal).replace(/[^0-9.-]+/g, ""));
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredBalances, sortConfig]);

  const requestSort = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
    return <ChevronDown className="inline w-4 h-4 ml-1 text-gray-600" />;
    }
    if (sortConfig.direction === "asc") {
      return <ChevronUp className="inline w-4 h-4 ml-1 text-gray-600" />;
    }
    return <ChevronDown className="inline w-4 h-4 ml-1 text-gray-600" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Balances</h2>
          <div className="flex items-center gap-2">
            <p>Display in:</p>
            <Select
              onValueChange={(val) => setSelectedCurrency(val)}
              defaultValue="all"
            >
              <SelectTrigger className="w-[70px] text-sm h-8">
                <SelectValue placeholder="ALL" />
              </SelectTrigger>
              <SelectContent className="text-sm">
                <SelectItem value="all">ALL</SelectItem>
                <SelectItem value="usd">Ksh</SelectItem>
                <SelectItem value="inr">INR</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden m-4 border rounded-xl">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col className="w-4/6" />
            <col className="w-1/6" />
            <col className="w-1/6" />
          </colgroup>
          <thead>
            <tr className="text-sm text-gray-500 font-normal border-b tracking-wide bg-gray-100">
              <th
                className="text-left px-4 py-3 cursor-pointer select-none"
                onClick={() => requestSort("asset")}
              >
                Currency Type {renderSortIcon("asset")}
              </th>
              <th
                className="text-left px-4 py-3 cursor-pointer select-none"
                onClick={() => requestSort("available")}
              >
                Available {renderSortIcon("available")}
              </th>
              <th
                className="text-left px-4 py-3 cursor-pointer select-none"
                onClick={() => requestSort("fiatValue")}
              >
                Fiat Value {renderSortIcon("fiatValue")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBalances.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-gray-500 text-center">
                  No balances found.
                </td>
              </tr>
            ) : (
              sortedBalances.map((row, index) => {
                const flag = countries.find(
                  (c) => c.code === row.symbol
                )?.flag;
                return (
                  <tr
                    key={row.symbol}
                    className={`text-sm tracking-wide ${
                      index !== sortedBalances.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden flex items-center justify-center">
                          <img
                            src="/Kenya-Logo.png"
                            alt={row.asset}
                            className=""
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold text-md">
                            {row.asset}
                          </div>
                          <div className="text-xs text-gray-500">
                            Methods: {row.methods.join(" / ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {row.available.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-left">{row.fiatValue}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
