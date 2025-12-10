"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Clock, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Building2, LineChart, BarChart3 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
export function AssetList({ assets }: any) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"highest" | "lowest">("highest")
  const [filterType, setFilterType] = useState<"all" | "realestate" | "fund" | "etf">("all")

  const filteredAssets = assets.filter((asset: any) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.city.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterType === "all" ||
      (filterType === "realestate" && asset.type === "RealEstate") ||
      (filterType === "fund" && asset.type === "Fund") ||
      (filterType === "etf" && asset.type === "ETF")

    return matchesSearch && matchesFilter
  })

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (sortBy === "highest") {
      return b.change - a.change
    } else {
      return a.change - b.change
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search investments..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as "highest" | "lowest")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highest">Highest Growth</SelectItem>
              <SelectItem value="lowest">Lowest Growth</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Invested Assets</TabsTrigger>
          <TabsTrigger value="total">Total Invest Assets</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="mt-4">
          <div className="space-y-3">
            {sortedAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="total" className="mt-4">
          <div className="space-y-3">
            {sortedAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


function AssetCard({ asset }: any) {
  const router = useRouter()

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "RealEstate":
        return <Building2 className="h-6 w-6 text-blue-500" />
      case "Fund":
        return <LineChart className="h-6 w-6 text-purple-500" />
      case "ETF":
        return <BarChart3 className="h-6 w-6 text-green-500" />
      default:
        return <Building2 className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex">
          <div
            className={cn("w-[180px] flex items-center justify-center py-8", {
              "bg-blue-50": asset.type === "RealEstate",
              "bg-purple-50": asset.type === "Fund",
              "bg-green-50": asset.type === "ETF",
            })}
          >
            <div className="flex h-16 w-16 items-center justify-center">{getAssetIcon(asset.type)}</div>
          </div>

          <div className="flex-1 p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{asset.name}</h3>
                  <span
                    className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", {
                      "bg-blue-100 text-blue-700": asset.status === "Pre-Leased",
                      "bg-amber-100 text-amber-700": asset.status === "Under Construction",
                      "bg-green-100 text-green-700": asset.status === "Holiday Homes",
                    })}
                  >
                    {asset.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="inline-block w-1 h-1 rounded-full bg-gray-400" />
                  {asset.location.city}, {asset.location.state}
                </p>
              </div>

              <Button
                variant="link"
                size="sm"
                className="text-blue-600 hover:text-blue-700 font-medium p-0 h-auto flex items-center gap-1"
                onClick={(e) => {
                  e.preventDefault()
                  router.push(`/wallet/portfolio/${asset.id}`)
                }}
              >
                View Details
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">You Invested</p>
                <p className="font-medium">₹{asset.invested.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Current Value</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">₹{asset.currentValue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{asset.change.toFixed(1)}%</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Lock-in</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>
                    {asset.lockInPeriod.duration} {asset.lockInPeriod.unit}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Total Token</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{asset.tokens.owned}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}

// Need to import these icons here to avoid errors

