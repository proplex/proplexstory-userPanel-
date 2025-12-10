"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDownToLine,
  ArrowRightLeft,
  ArrowUpFromLine,
  Eye,
  Gift,
  TrendingUp,
  SlidersHorizontal,
  X,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import React from "react";
import clsx from "clsx";

interface Transaction {
  type: "deposit" | "withdraw" | "yield" | "reward" | "transfer";
  asset: string;
  amount: string;
  status: "completed" | "in-progress" | "failed" | "cancelled";
  date: string;
  explorerLink?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const filters = [
  "All",
  "Completed",
  "In-Progress",
  "Failed",
  "Cancelled",
  "Deposits",
  "Withdrawal",
  "Yield",
  "Reward",
];

type SortKey = keyof Transaction;

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
}) => {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortKey;
    direction: "asc" | "desc";
  } | null>(null);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilter = (filter: string) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== filter));
  };

  // Apply filtering
  let filteredTransactions = transactions.filter((tx) => {
    if (selectedFilters.length === 0 || selectedFilters.includes("All"))
      return true;

    return selectedFilters.every((filter) => {
      if (filter === "Completed") return tx.status === "completed";
      if (filter === "In-Progress") return tx.status === "in-progress";
      if (filter === "Failed") return tx.status === "failed";
      if (filter === "Cancelled") return tx.status === "cancelled";
      if (filter === "Deposits") return tx.type === "deposit";
      if (filter === "Withdrawal") return tx.type === "withdraw";
      if (filter === "Yield") return tx.type === "yield";
      if (filter === "Reward") return tx.type === "reward";
      return true;
    });
  });

  // Apply sorting
  if (sortConfig) {
    filteredTransactions = [...filteredTransactions].sort((a, b) => {
      const { key, direction } = sortConfig;

      let aVal: string | number = a[key] ?? "";
      let bVal: string | number = b[key] ?? "";

      if (key === "date") {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }

  const requestSort = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key && prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortArrow = (key: SortKey) => {
    if (sortConfig?.key !== key)
      return <ChevronDown className="inline w-4 h-4 ml-1 text-gray-600" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="inline w-4 h-4 ml-1 text-gray-600" />
    ) : (
      <ChevronDown className="inline w-4 h-4 ml-1 text-gray-600" />
    );
  };

  const getTypeIcon = (type: Transaction["type"]) => {
    const base = "w-8 h-8 rounded-full flex items-center justify-center";
    switch (type) {
      case "deposit":
        return (
          <div className={clsx(base, "bg-green-100 text-green-600")}>
            <ArrowDownToLine size={15} />
          </div>
        );
      case "withdraw":
        return (
          <div className={clsx(base, "bg-red-50 text-red-600")}>
            <ArrowUpFromLine size={15} />
          </div>
        );
      case "yield":
        return (
          <div className={clsx(base, "bg-blue-100 text-blue-600")}>
            <TrendingUp size={15} />
          </div>
        );
      case "reward":
        return (
          <div className={clsx(base, "bg-purple-100 text-purple-600")}>
            <Gift size={15} />
          </div>
        );
      case "transfer":
        return (
          <div className={clsx(base, "bg-gray-100 text-gray-600")}>
            <ArrowRightLeft size={15} />
          </div>
        );
    }
  };

  const statusStyles = {
    completed: "bg-green-100 border-green-400 text-green-700",
    "in-progress": "bg-yellow-100 border-yellow-400 text-yellow-700",
    failed: "bg-red-100 border-red-400 text-red-700",
    cancelled: "bg-gray-200 border-gray-400 text-gray-700",
  };

  const getStatusBadge = (status: Transaction["status"]) => (
    <span
      className={`px-2 py-1 border text-xs rounded-full ${statusStyles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="px-4 pt-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">All Transactions</h2>
        <div className="flex items-center">
          {selectedFilters.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 px-4">
              {selectedFilters.map((filter) => (
                <span
                  key={filter}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-black/80 text-white border rounded-full"
                >
                  {filter}
                  <button
                    onClick={() => clearFilter(filter)}
                    className="hover:text-gray-500 text-white"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={`${
                  selectedFilters.length > 0 ? "text-violet-600" : ""
                }`}
                variant="ghost"
              >
                <SlidersHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-40 rounded-xl shadow"
              align="start"
            >
              <DropdownMenuGroup className="space-y-1">
                {filters.map((filter) => (
                  <DropdownMenuItem
                    key={filter}
                    onClick={() => toggleFilter(filter)}
                    className={clsx(
                      "cursor-pointer",
                      selectedFilters.includes(filter) &&
                        "bg-gray-200 font-medium"
                    )}
                  >
                    {filter}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto border m-4 rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-gray-500 border-b bg-gray-100">
              <th
                className="text-center px-4 py-3 cursor-pointer"
                onClick={() => requestSort("type")}
              >
                Type {renderSortArrow("type")}
              </th>
              <th
                className="text-center px-4 py-3 cursor-pointer"
                onClick={() => requestSort("asset")}
              >
                Currency Type {renderSortArrow("asset")}
              </th>
              <th
                className="text-center px-4 py-3 cursor-pointer"
                onClick={() => requestSort("amount")}
              >
                Amount {renderSortArrow("amount")}
              </th>
              <th
                className="text-center px-4 py-3 cursor-pointer"
                onClick={() => requestSort("status")}
              >
                Status {renderSortArrow("status")}
              </th>
              <th
                className="text-center px-4 py-3 cursor-pointer"
                onClick={() => requestSort("date")}
              >
                Date & Time {renderSortArrow("date")}
              </th>
              <th className="text-center px-4 py-3">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-gray-500 text-center">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx, index) => (
                <tr
                  key={index}
                  className={`text-sm text-center ${
                    index !== filteredTransactions.length - 1 ? "border-b" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(tx.type)}
                      <span className="capitalize">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{tx.asset}</td>
                  <td
                    className={clsx(
                      "px-4 py-3 font-medium",
                      tx.amount.trim().startsWith("-")
                        ? "text-red-600"
                        : "text-green-600"
                    )}
                  >
                    {tx.amount}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(tx.status)}</td>
                  <td className="px-4 py-3">{tx.date}</td>
                  <td className="px-4 py-3 text-right">
                    {tx.explorerLink && (
                      <a
                        href={tx.explorerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black font-thin hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </a>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
