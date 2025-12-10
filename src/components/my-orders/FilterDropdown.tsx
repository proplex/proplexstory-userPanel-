"use client"

import * as React from "react"
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'

const DropdownMenu = dynamic(
  () => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenu),
  { ssr: false }
)
const DropdownMenuTrigger = dynamic(
  () => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuTrigger),
  { ssr: false }
)
const DropdownMenuContent = dynamic(
  () => import("@/components/ui/dropdown-menu").then(mod => mod.DropdownMenuContent),
  { ssr: false }
)
const Switch = dynamic(
  () => import("@/components/ui/switch").then(mod => mod.Switch),
  { ssr: false }
)

interface FilterOption {
  id: string
  label: string
  enabled: boolean
}

const defaultFilters: FilterOption[] = [
  { id: "awaiting-100%-investment", label: "Awaiting 100% Investment", enabled: false },
  { id: "document-signature-pending", label: "Document Signature Pending", enabled: false },
  { id: "full-payment-pending", label: "Full Payment Pending", enabled: false },
  { id: "token-transfer-pending", label: "Token Transfer Pending", enabled: false },
  { id: "order-completed", label: "Order Completed", enabled: false },
  { id: "order-cancelled", label: "Order Cancelled", enabled: false },
  { id: "order-failed", label: "Order Failed", enabled: false },
]

interface FilterDropdownProps {
  onFiltersChange: (filters: FilterOption[]) => void
  selectedStatus?: string
}

export function FilterDropdown({ onFiltersChange, selectedStatus }: FilterDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [filters, setFilters] = React.useState<FilterOption[]>(() => 
    defaultFilters.map(filter => ({
      ...filter,
      enabled: filter.id === selectedStatus
    }))
  )

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = (id: string) => {
    setFilters(prev => {
      const newFilters = prev.map(filter => ({
        ...filter,
        enabled: filter.id === id ? !filter.enabled : false
      }))
      onFiltersChange(newFilters)
      return newFilters
    })
  }   

  if (!mounted) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2 rounded-xl bg-gray-100"
        aria-label="Filter options"
      >
        Filter
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 rounded-xl bg-gray-100"
          aria-label="Filter options"
        >
          Filter
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[280px] p-4" align="end">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Select Status</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => setOpen(false)}
            aria-label="Close filter menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center justify-between"
            >
              <span className="text-sm font-medium">{filter.label}</span>
              <Switch
                checked={filter.enabled}
                onCheckedChange={() => handleToggle(filter.id)}
                aria-label={`Toggle ${filter.label} filter`}
              />
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

