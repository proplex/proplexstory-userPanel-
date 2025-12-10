"use client"
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { usePortfolioStore } from '../data'
const PortfolioSummary = dynamic(() => import('@/components/wallet/WalletCard/Portofolio').then(mod => mod.PortfolioSummary), { ssr: false })
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Building2, LineChart, BarChart3, MapPin, Coins, FileText, Clock, LayoutDashboard } from 'lucide-react'
import Activites from '@/components/wallet/WalletCard/Activites'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

function PortfolioDetails() {
    const params = useParams() as Record<string, string>
    const portfolioID = params?.portfolioID
    const { assets, totalInvested, totalValue, totalEarned, totalTokens, totalAssets, averageGrowth } = usePortfolioStore()
    const router = useRouter()
    const currentAsset = assets.find(asset => asset.id === portfolioID)
    console.log(currentAsset)

    if (!currentAsset) {
        return (
            <div className='max-w-6xl mx-auto w-full py-4'>
                <div className="flex flex-col items-center justify-center h-[50vh]">
                    <h1 className="text-2xl font-bold">Asset not found</h1>
                    <p className="text-sm text-gray-500">The requested asset could not be found in your portfolio</p>
                </div>
            </div>
        )
    }

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
        <div className='max-w-6xl mx-auto w-full py-4'>
          
          <div className="flex flex-col p-3">
            <div className='flex items-center  gap-2'>
            <ArrowLeft size={20} onClick={() => router.back()} className=' cursor-pointer  bg-gray-200 rounded-full p-1   text-gray-900'  />
            <h1 className='text-2xl '> {currentAsset.name}</h1>

            </div>
            <h1 className='text-sm text-gray-500 flex items-center gap-2'>{<MapPin size={16} />}{currentAsset.location.city}, {currentAsset.location.state}</h1>

          </div>

          
            <div className="flex flex-col lg:flex-row justify-between gap-4 ">
                <div className="rounded-lg w-[800px] ">
                    <div className="">
                        <PortfolioSummary
                            totalValue={currentAsset.currentValue}
                            totalInvested={currentAsset.invested}
                            totalEarned={currentAsset.earnings}
                            averageGrowth={currentAsset.change}
                            totalTokens={currentAsset.tokens.owned}
                            totalAssets={1}
                        />
                    </div>
                    <div className="w-full flex lg:items-start lg:justify-between gap-5 lg:mt-8 mt-0 flex-col-reverse lg:flex-row mx-auto">
                        <Tabs defaultValue="growth" className="lg:w-[800px]">
                            <TabsList className="sticky h-auto top-0 inset-x-0 w-full overflow-x-auto scrollbar-hidden backdrop-blur-lg rounded-none bg-[#EEF2FF]/40 border-b border-[#EBEBEB] mb-6 p-0">
                                <div className="hidden p-0 lg:flex w-full justify-between items-center">
                                    <TabsTrigger
                                        value="growth"
                                        className="data-[state=active]:bg-[#EEF2FF] data-[state=active]:shadow-none data-[state=active]:text-[#725AEC] text-base flex items-center gap-2 w-1/4 min-w-max py-2 m-0.5 transition-all duration-500 linear"
                                    >
                                        <p className="flex items-center gap-2">
                                            <Coins size={16} />
                                            <span className='data-[state=active]:text-[#725AEC]'>Tokens</span>
                                        </p>
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="overview"
                                        className="data-[state=active]:bg-[#EEF2FF] data-[state=active]:shadow-none data-[state=active]:text-[#725AEC] text-base flex items-center gap-2 w-1/4 min-w-max py-2 m-0.5 transition-all duration-500 linear"
                                    >
                                        <p className="flex items-center gap-2">
                                            <LayoutDashboard size={16} />
                                            <span className='data-[state=active]:text-[#725AEC]'>My Order</span>
                                        </p>
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="documents"
                                        className="data-[state=active]:bg-[#EEF2FF] data-[state=active]:shadow-none data-[state=active]:text-[#725AEC] text-base flex items-center gap-2 w-1/4 min-w-max py-2 m-0.5 transition-all duration-500 linear"
                                    >
                                        <p className="flex items-center gap-2">
                                            <FileText size={16} />
                                            <span className='data-[state=active]:text-[#725AEC]'>Documents</span>
                                        </p>
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="faqs"
                                        className="data-[state=active]:bg-[#EEF2FF] data-[state=active]:shadow-none data-[state=active]:text-[#725AEC] text-base flex items-center gap-2 w-1/4 min-w-max py-2 m-0.5 transition-all duration-500 linear"
                                    >
                                        <p className="flex items-center gap-2">
                                            <Clock size={16} />
                                            <span className='data-[state=active]:text-[#725AEC]'>Activity</span>
                                        </p>
                                    </TabsTrigger>
                                </div>
                            </TabsList>
                            <TabsContent value="tokens" className="mt-6">
                                {/* Token details content */}
                            </TabsContent>

                            <TabsContent value="orders" className="mt-6">
                                {/* Order details content */}
                            </TabsContent>

                            <TabsContent value="documents" className="mt-6">
                                {/* Documents content */}
                            </TabsContent>

                            <TabsContent value="activity" className="mt-6">
                                {/* Activity content */}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="w-full lg:w-[400px]">
                    <Activites asset={currentAsset} />
                </div>
            </div>
        </div>
    )
}

export default PortfolioDetails
