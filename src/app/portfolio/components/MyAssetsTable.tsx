"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Eye, Filter, Search, X, FileText, ChevronsUpDown, ChevronDown, ChevronUp, Plus, Building2, FileSpreadsheet, ScrollText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Asset as ApiAsset } from "@/constants/global"

type Asset = {
  id: string
  name: string
  category: "Real Estate" | "Bonds" | "Debt" | "Equity" | "IP & Licenses"
  invested: string
  current: string
  returns: string
  returnsSign: "pos" | "neg"
  Icon?: React.ReactNode
}





const categories = ["All", "Real Estate", "Bonds", "Debt", "Equity", "IP & Licenses"] as const
type Category = (typeof categories)[number]

type SortKey = "invested" | "current" | "returns"
type SortDir = "asc" | "desc"

function parseMoney(value: string) {
  // turns "$7,29,357" into 729357
  const num = Number(value.replace(/[^0-9.-]/g, ""))
  return isNaN(num) ? 0 : num
}

// Function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Function to get category icon based on asset type
function getCategoryIcon(category: string): React.ReactNode {
  switch (category) {
    case "Real Estate":
      return <Building2 />
    case "Bonds":
      return <FileSpreadsheet />
    case "Debt":
      return <ScrollText />
    case "Equity":
      return <FileText />
    case "IP & Licenses":
      return <FileText />
    default:
      return <Building2 />
  }
}

// Function to transform API data to component format
function transformApiAssets(apiAssets: ApiAsset[]): Asset[] {
  return apiAssets.map((apiAsset) => {
    const investedAmount = apiAsset.investedAmount
    const currentValue = apiAsset.currentValue
    const returns = currentValue - investedAmount
    const returnsSign = returns >= 0 ? "pos" : "neg"
    
    // Determine category based on asset type (you may need to adjust this logic)
    const category: "Real Estate" | "Bonds" | "Debt" | "Equity" | "IP & Licenses" = "Real Estate"
    
    return {
      id: apiAsset._id,
      name: apiAsset.assetDetails.name,

      category,
      invested: formatCurrency(investedAmount),
      current: formatCurrency(currentValue),
      returns: formatCurrency(Math.abs(returns)),
      returnsSign,
      Icon: getCategoryIcon(category),
    }
  })
}

export default function MyAssetsTable( {assets}: {assets: ApiAsset[]} ) {
  const [selected, setSelected] = useState<Category>("All")
  const [showTag, setShowTag] = useState(true)
  const [sortKey, setSortKey] = useState<SortKey>("invested")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  // Transform API assets to component format
  const transformedAssets = useMemo(() => {
    return transformApiAssets(assets || [])
  }, [assets])

  const filtered = useMemo(() => {
    if (selected === "All") return transformedAssets
    return transformedAssets.filter((a) => a.category === selected)
  }, [transformedAssets, selected])

  const sortedData = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      let av = 0
      let bv = 0
      if (sortKey === "invested") {
        av = parseMoney(a.invested)
        bv = parseMoney(b.invested)
      } else if (sortKey === "current") {
        av = parseMoney(a.current)
        bv = parseMoney(b.current)
      } else {
        av = parseMoney(a.returns) * (a.returnsSign === "neg" ? -1 : 1)
        bv = parseMoney(b.returns) * (b.returnsSign === "neg" ? -1 : 1)
      }
      return sortDir === "asc" ? av - bv : bv - av
    })
    return arr
  }, [filtered, sortKey, sortDir])

  const data = sortedData

  function toggleSort(key: SortKey) {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        return prev
      }
      // default new column to descending like the mock
      setSortDir("desc")
      return key
    })
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">My Assets</h2>
        <div className="flex items-center gap-3">
          <Button
            aria-label="Search"
            className="h-9 w-9 rounded-md border border-gray-200/80 bg-white text-gray-500 hover:bg-gray-50 flex items-center justify-center"
          >
            <Search className="h-4 w-4" />
          </Button>

          {showTag && selected !== "All" && (
            <span className="inline-flex items-center rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
              {selected}
              <p
                aria-label="Remove filter"
                onClick={() => {
                  setSelected("All")
                  setShowTag(false)
                }}
                className="ml-2 text-white/80 hover:text-white bg-none"
              >
                <X className="h-3.5 w-3.5" />
              </p>
            </span>
          )}

          {/* Filter trigger with dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Filter"
                className="h-9 w-9 rounded-md border border-gray-200/80 bg-white text-gray-600 hover:bg-gray-50 flex items-center justify-center"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={selected}
                onValueChange={(v) => {
                  setSelected(v as Category)
                  if (v !== "All") setShowTag(true)
                }}
              >
                {categories.map((cat) => (
                  <DropdownMenuRadioItem key={cat} value={cat}>
                    {cat}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="h-9 rounded-md bg-primary hover:bg-primary/90 px-4 text-white"><Plus /> Invest More</Button>
        </div>
      </div>

      <Card className="rounded-xl border border-gray-200/80">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-gray-500">Assets Name</TableHead>

                <TableHead
                  className="text-gray-500 p-2"
                  aria-sort={sortKey === "invested" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <Button
                    variant={"outline"}
                    onClick={() => toggleSort("invested")}
                    className="inline-flex items-center gap-1 hover:text-foreground bg-transparent shadow-none border-0 px-0 py-0 h-auto"
                  >
                    <span>Invested</span>
                    {sortKey !== "invested" ? (
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
                    ) : sortDir === "asc" ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TableHead>

                <TableHead
                  className="text-gray-500"
                  aria-sort={sortKey === "current" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <Button
                    variant={"outline"}
                    onClick={() => toggleSort("current")}
                    className="inline-flex items-center gap-1 p-2 hover:text-foreground bg-transparent shadow-none border-0 px-0 py-0 h-auto"
                  >
                    <span>Current Value</span>
                    {sortKey !== "current" ? (
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
                    ) : sortDir === "asc" ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TableHead>

                <TableHead
                  className="text-gray-500"
                  aria-sort={sortKey === "returns" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                >
                  <Button
                    variant={"outline"}
                    onClick={() => toggleSort("returns")}
                    className="inline-flex items-center gap-1 hover:text-foreground bg-transparent shadow-none border-0 px-0 py-0 h-auto"
                  >
                    <span>Returns</span>
                    {sortKey !== "returns" ? (
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
                    ) : sortDir === "asc" ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TableHead>

                <TableHead className="text-right text-gray-500 px-8">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((a) => (
                  <TableRow key={a.id} className="hover:bg-transparent">
                    <TableCell className="align-middle px-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-black text-white ">
                          {a.Icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{a.name}</span>
                          <span className="text-xs text-gray-500">
                            {a.category === "Debt" ? "Debt Investment" : a.category}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">{a.invested}</TableCell>
                    <TableCell className="align-middle">{a.current}</TableCell>
                    <TableCell
                      className={cn(
                        "align-middle font-semibold",
                        a.returnsSign === "pos" ? "text-emerald-500" : "text-red-500",
                      )}
                    >
                      {a.returns}
                    </TableCell>
                    <TableCell className="align-middle text-right pr-8">
                      <Button
                        variant={"outline"}
                        aria-label="View asset"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-50 bg-transparent border-none "
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No assets found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
