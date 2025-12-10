
import { Card, CardContent } from "@/components/ui/card"

interface PortfolioSummaryProps {
  totalValue: number
  totalInvested: number
  totalEarned: number
  averageGrowth: number
  totalTokens: number
  totalAssets: number
}

export function PortfolioSummary({
  totalValue,
  totalInvested,
  totalEarned,
  averageGrowth,
  totalTokens,
  totalAssets,
}: PortfolioSummaryProps) {
  return (
    <Card className="bg-[#1C2444] text-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Current value</p>
              <div className="flex items-center gap-2">
                <h3 className="text-3xl font-semibold">₹{totalValue.toLocaleString()}</h3>
                <span className="rounded bg-[#15803D33] px-2 py-0.5 text-sm font-medium text-[#15803D]">+79.3%</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Invested value</p>
              <h3 className="text-3xl font-semibold">₹{totalInvested.toLocaleString()}</h3>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <StatCard
              title="Total Earned"
              value={`₹${totalEarned.toLocaleString()}`}
              icon="$"
              bgColor="#C2410C33"
              iconBgColor="#C2410C"
            />
            <StatCard
              title="Avg Growth"
              value={`${averageGrowth.toFixed(1)}%`}
              icon="%"
              bgColor="#0066FF33"
              iconBgColor="#0066FF"
            />
            <StatCard
              title="Total Tokens"
              value={totalTokens.toString()}
              icon="#"
              bgColor="#7C3AED33"
              iconBgColor="#7C3AED"
            />
            <StatCard
              title="Total Assets"
              value={totalAssets.toString()}
              icon="#"
              bgColor="#15803D33"
              iconBgColor="#15803D"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: string
  bgColor: string
  iconBgColor: string
}

function StatCard({ title, value, icon, bgColor, iconBgColor }: StatCardProps) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: bgColor }}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: iconBgColor }}
          >
            <span className="text-white">{icon}</span>
          </div>
          <div>
            <p className="text-xs text-gray-400">{title}</p>
            <p className="text-lg font-medium">{value}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
