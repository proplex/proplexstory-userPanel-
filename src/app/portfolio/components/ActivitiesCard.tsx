import { InfoIcon } from "@/components/common/InfoIcon"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Info, MoveRight } from "lucide-react"

export function ActivitiesCard() {
  return (
    <Card className="rounded-2xl p-4 sm:p-5 w-[360px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Activities</h2>
        <Button className="text-sm flex items-center" variant={"outline"}>
          View All <ArrowRight />
        </Button>
      </div>

      {/* Subheading */}
      <p className="mt-2 text-sm text-neutral-500">Recent updates for this property</p>

      {/* Timeline / Items */}
      <div className="mt-4 space-y-5">
        {/* Item 1 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              Rental Income
            </span>
          </div>
          <div className="text-xs text-neutral-500">Distributed on July 1, 2025</div>
          <div className="rounded-xl border border-neutral-200 bg-white p-3 text-[15px] leading-6 text-neutral-800">
            Quarterly rental income has been credited to your wallet.
          </div>
        </div>

        {/* Item 2 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
              Rental Income
              <InfoIcon tooltip="This is the rental income for the property." size={14} className="text-amber-700" aria-hidden="true" />
            </span>
          </div>
          <div className="text-xs text-neutral-500">Expires in 3 days</div>

          <div className="space-y-3">
            <div className="rounded-xl border border-neutral-200 bg-white p-3 text-[15px] leading-6 text-neutral-800">
              New proposal to renovate lobby area. your vote is needed.
            </div>
            <Button variant={"outline"} className="w-full rounded-lg border bg-neutral-100 px-4 py-2.5 text-sm font-mediumc">
              Cast your vote
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ActivitiesCard
