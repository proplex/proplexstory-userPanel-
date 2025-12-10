"use client"

import { useState } from "react"
import { Copy, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Sample transaction data
const transactions = [
  {
    id: "OWM12***34",
    tokens: 250,
    amount: 20000,
    status: "Purchased",
    date: "12-07-2025 12:05",
  },
  {
    id: "OWM12***34",
    tokens: 250,
    amount: 25000,
    status: "Purchased",
    date: "12-07-2025 12:05",
  },
  {
    id: "OWM12***34",
    tokens: 250,
    amount: 30000,
    status: "Purchased",
    date: "12-07-2025 12:05",
  },
  {
    id: "OWM12***34",
    tokens: 250,
    amount: 30000,
    status: "In-progress",
    date: "12-07-2025 12:05",
  },
  {
    id: "OWM12***34",
    tokens: 250,
    amount: 30000,
    status: "Sold",
    date: "12-07-2025 12:05",
  },
]

const statusColors: Record<string, string> = {
  Purchased: "bg-green-100 text-green-600 border border-green-300",
  "In-progress": "bg-yellow-100 text-yellow-600 border border-yellow-300",
  Sold: "bg-red-100 text-red-600 border border-red-300",
}

export default function TransactionTable() {
  const [filter, setFilter] = useState("All")

  const filteredData =
    filter === "All"
      ? transactions
      : transactions.filter((tx) => tx.status === filter)

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      {/* Header with filter */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">My Returns</h2>

        <Select onValueChange={(val) => setFilter(val)} defaultValue="All">
          <SelectTrigger className="w-[140px] rounded-full">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Purchased">Purchased</SelectItem>
            <SelectItem value="In-progress">In-progress</SelectItem>
            <SelectItem value="Sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-sm text-left rounded-lg">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Tokens</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((tx, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-3 flex items-center gap-1">{tx.id}<Copy size={12} className="cursor-pointer"/></td>
                <td className="px-4 py-3">{tx.tokens}</td>
                <td className="px-4 py-3">₹{tx.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "px-3 py-1 text-xs rounded-full font-medium",
                      statusColors[tx.status]
                    )}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-3">{tx.date}</td>
                <td className="px-4 py-3">
                  <Eye className="h-4 w-4 text-gray-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
