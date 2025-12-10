"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { LineChart, Line, YAxis, ResponsiveContainer, CartesianGrid } from "recharts"
import { useState } from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

function transformCashFlowData(
  cashFlowData: {
    date: string
    monthlyTotalValue: number
    monthlyCashFlows: number
    monthlyHoldings: number
  }[],
) {
  return cashFlowData.map((item, index) => ({
    label: item.date || `Point ${index + 1}`,
    total: item.monthlyTotalValue,
    holdings: item.monthlyHoldings,
    cash: item.monthlyCashFlows,
  }))
}

function generateSampleData(points = 6) {
  const data = []
  const baseTotal = 50000
  const baseHoldings = 35000
  const baseCash = 15000

  for (let i = 0; i < points; i++) {
    data.push({
      label: `Month ${i + 1}`,
      total: baseTotal + (Math.random() * 20000 - 5000) + i * 2000,
      holdings: baseHoldings + (Math.random() * 15000 - 3000) + i * 1500,
      cash: baseCash + (Math.random() * 8000 - 2000) + i * 500,
    })
  }
  return data
}

function generateHistoricalTrend(
  currentData: {
    date: string
    monthlyTotalValue: number
    monthlyCashFlows: number
    monthlyHoldings: number
  },
  months = 6,
) {
  const data = []
  const currentDate = new Date(currentData.date)

  // Generate previous months leading up to current data
  for (let i = months - 1; i > 0; i--) {
    const monthDate = new Date(currentDate)
    monthDate.setMonth(monthDate.getMonth() - i)

    // Create realistic trend that leads to current values
    const progress = (months - i) / months
    data.push({
      label: monthDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      total: currentData.monthlyTotalValue * (0.7 + progress * 0.3) + (Math.random() * 10 - 5),
      holdings: currentData.monthlyHoldings * (0.7 + progress * 0.3) + (Math.random() * 8 - 4),
      cash: currentData.monthlyCashFlows * (0.8 + progress * 0.2) + (Math.random() * 5 - 2.5),
    })
  }

  // Add current month's real data as final point
  data.push({
    label: currentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    total: currentData.monthlyTotalValue,
    holdings: currentData.monthlyHoldings,
    cash: currentData.monthlyCashFlows,
  })

  return data
}

const COLORS = {
  total: "#3e54eb",
  holdings: "#4aa8ff",
  cash: "#444444",
  tick: "#9ea3ae",
  text: "#111827",
}

function RightAxisTick({
  x,
  y,
  payload,
}: {
  x?: number
  y?: number
  payload?: { value: number }
}) {
  if (x == null || y == null || !payload) return null
  const v = payload.value
  const currency = v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v.toLocaleString()}`
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="start" fontSize={12} fill={COLORS.tick}>
        {currency}
      </text>
    </g>
  )
}

interface PerformanceCardProps {
  cashFlowBreakdown?: {
    date: string
    monthlyTotalValue: number
    monthlyCashFlows: number
    monthlyHoldings: number
  }
}

export function PerformanceCard({ cashFlowBreakdown }: PerformanceCardProps) {
  const [selected, setSelected] = useState("Last month")

  const performanceData = cashFlowBreakdown ? generateHistoricalTrend(cashFlowBreakdown, 6) : generateSampleData(6)

  return (
    <Card className="w-full rounded-2xl border border-[#e6e6e6] bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-[#1a1b1d]">Performance</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent rounded-xl h-9 px-3 text-[#1a1b1d] border-[#e1e3e8] flex items-center"
              >
                {selected}
                <ChevronDown className="ml-2 h-4 w-4 text-[#6b7280]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setSelected("Last week")}>Last week</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelected("Last month")}>Last month</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelected("Last 3 months")}>Last 3 months</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelected("Last year")}>Last year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <hr />
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData} margin={{ top: 10, right: 56, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="4 6" stroke="#e5e7eb" />
              <YAxis
                orientation="right"
                domain={[0, "dataMax"]}
                axisLine={false}
                tickLine={false}
                tick={<RightAxisTick />}
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Total Value"
                stroke={COLORS.total}
                strokeWidth={2.5}
                dot={false}
                activeDot={false}
              />
              <Line
                type="monotone"
                dataKey="holdings"
                name="My Holdings"
                stroke={COLORS.holdings}
                strokeWidth={2.5}
                dot={false}
                activeDot={false}
              />
              <Line
                type="monotone"
                dataKey="cash"
                name="My Cashflows"
                stroke={COLORS.cash}
                strokeWidth={2.5}
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <hr />
        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS.total }} />
            <span className="text-[#1a1b1d]">Total Value</span>
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS.holdings }} />
            <span className="text-[#1a1b1d]">My Holdings</span>
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS.cash }} />
            <span className="text-[#1a1b1d]">My Cashflows</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PerformanceCard
