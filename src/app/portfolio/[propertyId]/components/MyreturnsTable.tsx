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
    id: "RYZ12***34",
    amount: 2000,
    creditedTo: "Wallet",
    status: "In Progress",
    date: "12-07-2025 12:05",
  },
  {
    id: "RYZ12***34",
    amount: 2000,
    creditedTo: "Wallet",
    status: "Received",
    date: "12-07-2025 12:05",
  },
  {
    id: "RYZ12***34",
    amount: 2000,
    creditedTo: "Wallet",
    status: "Declined",
    date: "12-07-2025 12:05",
  },
]

const statusColors: Record<string, string> = {
  "In Progress": "bg-yellow-100 text-yellow-600 border border-yellow-300",
  Received: "bg-green-100 text-green-600 border border-green-300",
  Declined: "bg-red-100 text-red-600 border border-red-300",
}

export default function MyreturnsTable() {
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
            <SelectValue placeholder="All"/>
          </SelectTrigger>
          <SelectContent className="w-[140px] rounded-xl">
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Received">Received</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-sm text-left border rounded-lg">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs rounded-lg">
            <tr>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Credited To</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 rounded-lg">
            {filteredData.map((tx, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-3 text-gray-800 flex items-center gap-1">{tx.id} <Copy size={12} className="cursor-pointer"/></td>
                <td className="px-4 py-3">₹{tx.amount}</td>
                <td className="px-4 py-3">{tx.creditedTo}</td>
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
