import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { ArrowDownToLine, ArrowUpFromLine, Download, Hourglass } from 'lucide-react';
import React from 'react'
type MyAssetCardProps = {
    current_value: number;
    invested_value: number;
    gained_value: number;
    rental_yield: number;
    total_tokens: number;
    next_distribution_amount: number;
    next_distribution_date: string;
}

const MyAssetCard = ({current_value, invested_value, gained_value, rental_yield, total_tokens, next_distribution_amount, next_distribution_date }: MyAssetCardProps) => {
    const isPostive = gained_value > 0;
  return (
    <div>
      <div className="bg-black text-white p-4 rounded-xl flex flex-col gap-4">
        {/* Current value and invested value */}
        <div className="flex justify-between">
            <div className="">
                <p className='text-xs'>
                    Current Value
                </p>
                <p className='text-2xl text-primary font-semibold'>
                    {formatCurrency(current_value)}
                </p>
            </div>
            <div className="">
                <p className='text-xs'>
                    Invested Value
                </p>
                <p className='text-2xl font-semibold'>
                    {formatCurrency(invested_value)}
                </p>
            </div>
        </div>
        {/* Gained value, rental yield, and total tokens */}
        <div className=" flex gap-4">
            <Card className='text-white border border-[#474747] bg-[#191919] w-full'>
                <CardContent className='p-4'> {/* This CardContent was not closed */}
                    <div className=''>
                        <div className=" flex justify-between">
                            <p className='text-sm'>
                                Gained Value
                            </p>
                            <p className={` px-4 flex text-xs items-center justify-center text-center rounded-xl ${isPostive ? 'bg-green-200 text-green-500' : 'bg-red-200 text-red-500'}`}>
                                {isPostive ? 'Profit' : 'Loss'}
                            </p>

                        </div>
                        <p className={`text-xl font-semibold ${isPostive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPostive ? `${formatCurrency(gained_value)}` : `${formatCurrency(gained_value)}`}
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Card className='text-white border border-[#474747] bg-[#191919] w-full'>
                <CardContent className='p-4'> 
                    <div className=''>
                        <div className=" flex justify-between">
                            <p className='text-sm'>
                                Rental Yield
                            </p>
                            <p className='px-4 text-xs flex items-center justify-center text-center rounded-xl text-[#14B8A6] bg-[#C1FFF8]'>
                                Annualized
                            </p>

                        </div>
                        <p className='text-xl font-semibold text-[#14B8A6] '>
                            {rental_yield}%
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Card className='text-white border border-[#474747] bg-[#191919] w-full'>
                <CardContent className='p-4'> {/* This CardContent was not closed */}
                    <div className=''>
                        <div className=" flex justify-between">
                            <p className='text-sm'>
                                Total Tokens
                            </p>
                            <p className='px-4 text-xs flex items-center justify-center text-center rounded-xl text-[#D4D4D8] bg-[#3D3D3D]'>
                                Holding
                            </p>

                        </div>
                        <p className='text-xl font-semibold '>
                            {total_tokens}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
        <Card className='text-white border border-[#474747] bg-[#191919] w-full'>
            <CardContent className='p-4'>
                <div className=" flex justify-between">
                    <div className="">
                        <p className='text-sm'>Next Distribution:</p>
                        <div>
                            <span className='text-[#FFB90A]'>{formatCurrency(next_distribution_amount)}</span> on {" "}
                            <span>{next_distribution_date ? formatDateTime(next_distribution_date) : 'N/A'}</span>
                        </div>                    
                    </div>
                    <div className="flex items-center border border-[#474747] px-3  py-1 rounded-lg">
                        <p className='flex items-center gap-1 text-sm'>
                            <Hourglass size={14}/>
                            19d 17h
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <div className=" flex justify-end gap-4">
            <Button>
                <ArrowDownToLine/>
                Buy More Tokens
            </Button>
            <Button variant='outline' className='bg-transparent border border-[#474747] text-gray-400 hover:bg-transparent/30 hover:text-gray-200 hover:border-gray-200'>
                <ArrowUpFromLine/>
                Sell Tokens
            </Button>
        </div>
        </div>
      </div>
  )
}

export default MyAssetCard
