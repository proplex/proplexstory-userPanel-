'use client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import React, { useState } from 'react'
import { ChevronDown, Copy, MapPin, IndianRupee } from 'lucide-react'
import { IOrder } from '@/constants/global'
import { formatCurrency } from '@/lib/utils'

const orderSummary = ({orderValue}: {orderValue: IOrder}) => {
  const [isBreakupOpen, setIsBreakupOpen] = useState(false);
  const fees = [
    { name: "Booking Amount", value: 1000 },
    { name: "Brokerage", value: 500 },
    { name: "Stamp Duty", value: 200 },
    { name: "Service Tax", value: 100 },
  ];
   
  // console.log(orderValue)x
  return (
    <>
               <Card className="mb-4 p-4">
              <div className="flex justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">{orderValue?.asset?.name}</h2>
                  <span className=" flex items-center gap-1 text-gray-500 text-sm ">
                    <MapPin className="w-4 h-4" />
                    {orderValue?.asset?.city}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#6a7381]">Order ID</div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{orderValue?._id.slice(-4)}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy  />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-lg font-semibold">{orderValue?.payment?.tokensBooked} Tokens</div>
                  <div className="text-sm text-[#6a7381]">(Per token:  {formatCurrency(orderValue?.asset?.tokenInformation?.tokenPrice)})</div>
                </div>
                <div>
                  <div className="text-sm text-[#6a7381]">Your investment</div>
                  <div className="text-lg justify-end flex items-center gap-1 font-semibold">
                    {formatCurrency(orderValue?.payment?.totalOrderValue)}
                  </div>
                </div>
              </div>

              <div>
                {/* <Button
                  variant="link"
                  onClick={() => setIsBreakupOpen(!isBreakupOpen)}
                  className="text-[#52c1b9] flex justify-end w-full h-auto mt-2"
                >
                  {isBreakupOpen ? "Collapse break-up" : "See break-up"}
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isBreakupOpen ? "rotate-180" : ""}`} />
                </Button>

                {isBreakupOpen && (
                  <div className="mt-4 space-y-3 border-t pt-4">
                    {orderValue?.breakup
                      .filter((f: any) => f.name !== "Booking Amount") // Exclude Booking Amount
                      .map((f: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">{f.name}</span>
                          <span className="font-medium">KES {f.value}</span>
                        </div>
                      ))}
                  </div>
                )} */}
              </div>
            </Card>
    </>
  )
}

export default orderSummary
