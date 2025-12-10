"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export type OrderStatus = "Success" | "Pending" | "Cancelled" | "Failed"

export type Order = {
  id: string
  projectName: string
  orderDate: string
  amount: number
  statusDescription: string
  status: OrderStatus
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "projectName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent text-gray-600 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Name
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "orderDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent text-gray-600 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Date
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent text-gray-600 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number
      return <span>₹ {amount.toLocaleString('en-IN')}</span>
    },
  },
  {
    accessorKey: "statusDescription",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent text-gray-600 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status Description
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent text-gray-600 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Status
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus
      return (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${
              status === "Success"
                ? "bg-[#58ac7b]/10 text-[#58ac7b]"
                : status === "Pending"
                ? "bg-[#ffad0d]/10 text-[#ffad0d]"
                : status === "Cancelled"
                ? "bg-gray-100 text-gray-600"
                : "bg-red-100 text-red-600"
            }
          `}
        >
          {status}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: () => {
      return <ChevronRight className="h-4 w-4 text-gray-400" />
    },
  },
]

