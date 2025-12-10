'use client'
import { ArrowLeft, LocateIcon, MapPin, MapPinCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import MyAssetCard from '../components/MyAssetCard'
import { formatCurrency } from '@/lib/utils'
import PortfolioDashboard from '../components/PortfolioDashboard'
import PortfolioTabs from './components/PortfolioTabs'
import ActionsCard from './components/ActionsCard'

const page = () => {
    const router = useRouter()
    const handleBack = () => {
        router.back()
    }

  return (
    <>
        
        <div className='mb-4'>
            <span className='cursor-pointer w-fit'  onClick={handleBack}>
            <span className="flex text-lg items-center gap-2 w-fit" >
        <ArrowLeft size={16}/>
        The Lakeview Park
        </span> 
        <div className='pl-6 flex items-center gap-1 text-xs'>
            <MapPin size={10}/>
            Rajamundry, Andhra Pradesh
        </div>
        </span>
        </div>
        <div className="flex gap-2">
            <div className="flex flex-col gap-4">
            
        
        <MyAssetCard 
        current_value={155000}
        invested_value={145000} 
        gained_value={10000} 
        rental_yield={6.9}
        total_tokens={450}
        next_distribution_amount={10000}
        next_distribution_date={"2025-09-10"}
        />
        <PortfolioTabs/>
        </div>
        <div className="">
            <ActionsCard/>
        </div>
        </div>
    </>
  )
}

export default page
