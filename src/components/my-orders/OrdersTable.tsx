"use client"
import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { Button } from "../ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, CoinsIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useFetchOrder } from "@/hooks/order/useFetchOrders"
import { getStatusClasses } from "@/constants/helper"
import { formatDate, formatString } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import NothingFound from "../common/NothingFound"
import { Input } from "../ui/input"
import CustomDatePicker from "@/constants/CustomDatePicker"
import { ScrollArea } from "../ui/scroll-area"
import { Select, SelectContent, SelectValue, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { InfoIcon } from "../common/InfoIcon"

const Table = dynamic(() => import("@/components/ui/table").then((mod) => mod.Table), { ssr: false })
const TableBody = dynamic(() => import("@/components/ui/table").then((mod) => mod.TableBody), { ssr: false })
const TableCell = dynamic(() => import("@/components/ui/table").then((mod) => mod.TableCell), { ssr: false })
const TableHead = dynamic(() => import("@/components/ui/table").then((mod) => mod.TableHead), { ssr: false })
const TableHeader = dynamic(() => import("@/components/ui/table").then((mod) => mod.TableHeader), { ssr: false })
const TableRow = dynamic(() => import("@/components/ui/table").then((mod) => mod.TableRow), { ssr: false })

export const OrdersTable = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date } | undefined>(undefined)
  const [quickSelect, setQuickSelect] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { data: orders, loading, pagination } = useFetchOrder("fully-paid", dateRange, quickSelect, page, limit)
  const router = useRouter()

  const navigateToOrder = (orderId: string) => {
    router.push(`/my-orders/${orderId}`)
  }

  const handleFiltersChange = (filters: { id: string; enabled: boolean; label: string }[]) => {
    const enabledFilters = filters.filter((filter) => filter.enabled)
    setSelectedStatus(enabledFilters.length > 0 ? enabledFilters[0].id : "")
  }

  const handleQuickSelect = (value: string) => {
    setQuickSelect(value)
    setDateRange(undefined)
  }

  const handleLimitChange = (value: string) => {
    setLimit(Number(value))
    setPage(1)
  }
  const handleRoute = () =>{
    router.back()
  }

  const renderMobileCard = (order: any) => {
    const statusClasses = getStatusClasses(order.currentStatus)

    return (
      <Card key={order._id} className="mb-4 border border-gray-200 cursor-pointer transition-shadow duration-150"
      onClick={() => navigateToOrder(order._id)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
              <span className=" text-black font-semibold">ORD-{order._id.slice(-4)}</span>
              <span className="font-medium items-center text-black">{formatDate(order.createdAt)}</span>
          </div>

          <div className="flex justify-between items-start mb-3">
            <h3 className="text-base font-semibold text-gray-900 mb-1">{formatString(order.assetId.name)}</h3>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1 bg-blue-50 text-blue-500 p-1 rounded-full">
                <CoinsIcon size={12}/>
              </div>
              <span>
                {order.tokensBooked}
              </span>
              <span>-</span>
              <span className="">{order.totalOrderValue} {order.currency.toUpperCase()}</span>
            </div>
            <div className="flex gap-1 items-center ">
              <div
              className={`${statusClasses.textClass} ${statusClasses.bgClass} px-2 py-1 text-xs font-medium rounded-2xl`}
            >
              {statusClasses.text}
            </div>
              <InfoIcon tooltip="Order Status" /> 
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderTableHeader = () => (
    <TableHeader>
      <TableRow className="bg-gray-50">
        <TableHead className="px-2 py-4 text-left text-sm font-medium text-gray-900">Order ID</TableHead>
        <TableHead className="px-2 py-4 text-left text-sm font-medium text-gray-900">Asset Name</TableHead>
        <TableHead className="px-2 py-4 text-left text-sm font-medium text-gray-900">No. of Tokens</TableHead>
        <TableHead className="px-2 py-4 text-left text-sm font-medium text-gray-900">Total Value</TableHead>
        <TableHead className="px-2 py-4 text-left text-sm font-medium text-gray-900">Currency</TableHead>
        <TableHead className="px-2 py-4 text-left text-sm font-medium text-gray-900">Order Date</TableHead>
        <TableHead className="px-2 py-4 text-left text-sm font-medium text-gray-900">Order Status</TableHead>
        <TableHead className="px-2 py-4 text-right text-sm font-medium text-gray-900">Action</TableHead>
      </TableRow>
    </TableHeader>
  )

  const renderTableRow = (order: any) => {
    const statusClasses = getStatusClasses(order.currentStatus)
    return (
      <TableRow key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
        <TableCell className="px-2 py-4 text-sm text-gray-900">{order._id}</TableCell>
        <TableCell className="px-2 py-4 text-sm text-gray-900">{formatString(order.assetId.name)}</TableCell>
        <TableCell className="px-2 py-4 text-sm text-gray-900">
          <div className="text-gray-600 flex items-center justify-start text-sm">
            <div className="flex items-center gap-2 bg-blue-50 p-1 rounded-full">
              <CoinsIcon size={14} />
            </div>
            {order.tokensBooked}
          </div>
        </TableCell>
        <TableCell className="px-2 py-4 text-sm text-gray-900">
          <div className="text-gray-600 flex flex-col items-start justify-start text-sm">
            <span className="font-semibold">{order.totalOrderValue}</span>
          </div>
        </TableCell>
        <TableCell className="px-2 py-4 text-sm text-gray-900">
          <div className="text-gray-600 flex items-center justify-start text-sm">
            <span className="uppercase font-medium">{order.currency}</span>
          </div>
        </TableCell>
        <TableCell className="px-2 py-4 text-sm text-gray-900">{formatDate(order.createdAt)}</TableCell>
        <TableCell className="px-2 py-4">
          <div
            className={`${statusClasses.textClass} ${statusClasses.bgClass} ${statusClasses.rounded} px-3 py-1 text-xs font-medium inline-block`}
          >
            {statusClasses.text}
          </div>
        </TableCell>
        <TableCell className="px-2 py-4 text-right">
          <Button
            variant="ghost"
            onClick={() => navigateToOrder(order._id)}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </TableCell>
      </TableRow>
    )
  }

  const renderMobileSkeletonCards = () => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <Card key={idx} className="mb-4 border border-gray-200"
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <div className="mb-3">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>
        </CardContent>
      </Card>
    ))
  }

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <TableRow key={idx}>
        {Array.from({ length: 6 }).map((_, colIdx) => (
          <TableCell key={colIdx} className="px-6 py-4">
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))
  }

  const handleCustomDateSelect = (dates: { from: Date; to?: Date }) => {
    setDateRange(dates.to ? dates : undefined)
    setQuickSelect("")
  }

  // CLIENT-SIDE FILTER: searchTerm + optional selectedStatus
  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return []

    const q = searchTerm.trim().toLowerCase()

    return orders.filter((order: any) => {
      // status filter (client-side) - optional; if selectedStatus is empty, ignore it
      if (selectedStatus && order.currentStatus !== selectedStatus) return false

      if (!q) return true

      // fields to search
      const orderId = (order._id || "").toLowerCase()
      const assetName = (order.assetId?.name ? formatString(order.assetId.name) : "").toLowerCase()
      const tokens = String(order.tokensBooked || "").toLowerCase()
      const value = String(order.totalOrderValue || "").toLowerCase()
      const currency = String(order.currency || "").toLowerCase()
      const createdAt = (order.createdAt ? formatDate(order.createdAt) : "").toLowerCase()

      return (
        orderId.includes(q) ||
        assetName.includes(q) ||
        tokens.includes(q) ||
        value.includes(q) ||
        currency.includes(q) ||
        createdAt.includes(q)
      )
    })
  }, [orders, searchTerm, selectedStatus])

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <h1 className=" text-2xl font-bold flex items-center gap-2">
          <ArrowLeft className="lg:hidden hover:text-gray/30"  onClick={handleRoute}/> 
        My Orders
        </h1>
        <span className="text-sm text-gray-500 max-sm:hidden max-md:hidden">Manage and track your orders Investment</span>
      </div>

      <div className="flex flex-col md:flex-row p-4 justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2 ">
          <Input
            type="text"
            placeholder="Search orders (ID, asset, tokens, value, currency, date)"
            className="h-[35px]"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
          <CustomDatePicker
            className="w-full lg:w-full md:w-full sm:w-full"
            onDateSelect={handleCustomDateSelect}
            initialDateRange={dateRange}
          />
        </div>
        <div className="">
          <div className="flex items-center justify-between space-x-2">
            <Select value={quickSelect} onValueChange={handleQuickSelect}>
              <SelectTrigger className="w-full h-8">
                <SelectValue placeholder="Quick Select" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </ScrollArea>
              </SelectContent>
            </Select>
            {/* <FilterDropdown onFiltersChange={handleFiltersChange} selectedStatus={selectedStatus} /> */}
          </div>
        </div>
      </div>

      <div className="block lg:hidden px-4">
        {loading ? (
          renderMobileSkeletonCards()
        ) : filteredOrders.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <NothingFound text="No orders found" />
          </div>
        ) : (
          filteredOrders.map((order: any) => renderMobileCard(order))
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <Table className="w-full border rounded-lg border-gray-200 ">
          {renderTableHeader()}
          <TableBody>
            {loading ? renderSkeletonRows() : filteredOrders.map((order: any) => renderTableRow(order))}
            {!loading && filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-8">
                  <div className="flex items-center justify-center w-full">
                    <NothingFound text="No orders found" />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4 px-4 lg:px-0">
          <div className="flex items-center gap-2">
            <Select value={limit.toString()} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-[80px]  focus:ring-0 h-6 border-none">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
