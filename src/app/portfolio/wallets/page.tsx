"use client";
import React, { useState, useEffect } from "react";
import { Copy, ExternalLink, Check } from "lucide-react";
import { useTransactions } from "@/hooks/transactions/useTransactions";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const WalletsPage = () => {
  const [copiedHash, setCopiedHash] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const limit = 10;

  // Get user ID from session storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Session Storage:", sessionStorage);
      const userIdFromStorage = sessionStorage.getItem("userId");
      console.log("User ID from sessionStorage:", userIdFromStorage);

      if (userIdFromStorage) {
        setUserId(userIdFromStorage);
      } else {
        console.warn("No user ID found in sessionStorage");
      }
    }
  }, []);

  const { transactions, loading, error, pagination } = useTransactions({
    page,
    limit,
    status: statusFilter,
    userId,
  });

  console.log("Transactions:", transactions);
  console.log("Loading:", loading);
  console.log("Error:", error);

  // Function to trim address/hash (first 4 and last 4 characters)
  const trimAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(""), 2000);
  };

  // Function to get Polygon Amoy explorer link
  const getExplorerLink = (txHash: string) => {
    return `https://amoy.polygonscan.com/tx/${txHash}`;
  };

  // Function to get status badge styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format date to relative time (e.g., "2 hours ago")
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Transactions
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Tx Hash
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  From
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  To
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading &&
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={`skeleton-${i}`}>
                      <td colSpan={6} className="px-6 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))}
              {!loading && transactions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
              {!loading &&
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-md">
                          <span className="text-indigo-600 font-medium">
                            {tx.symbol?.substring(0, 3) || "TXN"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tx.transactionType === "transfer"
                              ? "Token Transfer"
                              : tx.transactionType || "Transaction"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tx.symbol || "TOKEN"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-mono text-sm">
                          {tx.from ? trimAddress(tx.from) : "N/A"}
                        </span>
                        <button
                          onClick={() => tx.from && copyToClipboard(tx.from)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          title="Copy address"
                        >
                          {tx.from && copiedHash === tx.from ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-mono text-sm">
                          {tx.to ? trimAddress(tx.to) : "N/A"}
                        </span>
                        <button
                          onClick={() => tx.to && copyToClipboard(tx.to)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          title="Copy address"
                        >
                          {tx.to && copiedHash === tx.to ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {(parseFloat(tx.amount) / 1e18).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 6,
                          }
                        )}{" "}
                        {tx.symbol || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusStyle(
                          tx.status
                        )}`}
                      >
                        {tx.status?.charAt(0).toUpperCase() +
                          tx.status?.slice(1) || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.createdAt ? formatDate(tx.createdAt) : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {tx.txHash && (
                          <>
                            <button
                              onClick={() => copyToClipboard(tx.txHash)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Copy Transaction Hash"
                            >
                              {copiedHash === tx.txHash ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                            <a
                              href={getExplorerLink(tx.txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View on Explorer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`relative inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } mx-auto h-12 w-12`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletsPage;
