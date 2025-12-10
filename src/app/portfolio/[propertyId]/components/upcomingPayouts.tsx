import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowUpRight, Calendar, ChartNoAxesColumnIncreasing, RotateCw, TicketPercent } from 'lucide-react'
import React from 'react'
type UpcomingPayoutsProps = {
    upcoming_rent_amount : number
    distribution_date : string
    period : string
    tokens : number
    annual_yield : number
    account: string
}

const UpcomingPayouts = ({upcoming_rent_amount, distribution_date, period, tokens, annual_yield, account}: UpcomingPayoutsProps) => {
  return (
    <Card className='w-full shadow-none rounded-lg p-4 flex flex-col gap-4'>
      
        <div className=" flex items-center gap-3">
            <p className='text-[#059669]'>
            Upcoming Rental Yield
        </p>
        <p className='text-[#059669] text-xs w-20 text-center bg-[#059669]/20 p-1 rounded-full'>
            Scheduled   
        </p>
        </div>
        <div className=" flex items-center gap-2">
            <p className='text-2xl font-semibold'>
                {formatCurrency(upcoming_rent_amount)}
            </p>
            <p className='text-gray-500 text-sm'>
                (Net Payout)
            </p>
        </div>
        <div className=" p-4 px-6 bg-gray-50 rounded-lg flex items-center justify-between gap-4">
            <div className="">
                <p className='flex items-center gap-1 text-xs text-gray-500 '> <Calendar size={14}/> Distribution Date</p>
                <p className='pl-4'>
                    {formatDate(distribution_date)}
                </p>
            </div>
            <div className="">
                <p className='flex items-center gap-1 text-xs text-gray-500 '> <RotateCw size={14}/> Distribution Period</p>
                <p className='pl-4'>
                    {period}
                </p>
            </div>
            <div className="">
                <p className='flex items-center gap-1 text-xs text-gray-500 '> <TicketPercent size={14}/> Based on</p>
                <p className='pl-4'>
                    {tokens}
                </p>
            </div>
            <div className="">
                <p className='flex items-center gap-1 text-xs text-gray-500 '> <ChartNoAxesColumnIncreasing size={14}/> Annual Yield</p>
                <p className='pl-4'>
                    {annual_yield}%
                </p>
            </div>
        </div>
        <div className=" flex justify-between">
            <p className='text-gray-500 text-sm'>
                Credited to : {account}
            </p>
            <p className='flex items-center text-sm cursor-pointer text-primary'>
                View Past Payouts 
                <ArrowUpRight size={14}/>
            </p>
        </div>
      
    </Card>
  )
}

export default UpcomingPayouts
