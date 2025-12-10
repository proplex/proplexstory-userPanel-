"use client"
import dynamic from 'next/dynamic'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BarChart3, Building2, LineChart } from "lucide-react"
import { usePortfolioStore } from "./data"

const RecentActivities = dynamic(() => import("@/components/wallet/WalletCard/Recent").then(mod => mod.RecentActivities), { ssr: false })
const PortfolioSummary = dynamic(() => import("@/components/wallet/WalletCard/Portofolio").then(mod => mod.PortfolioSummary), { ssr: false })
const AssetList = dynamic(() => import("@/components/wallet/WalletCard/AssetList").then(mod => mod.AssetList), { ssr: false })

export default function PortfolioDashboard() {
    const { assets, totalInvested, totalValue, totalEarned, totalTokens, totalAssets, averageGrowth } =
        usePortfolioStore()




    return (
        <div className=" max-w-6xl space-y-4 mx-auto w-full">
           

            <div className="flex items-center  justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold">My Portfolio</h2>
                <Button variant="outline" size="sm" className="gap-2">
                    <Bell className="h-4 w-4" />
                    Alerts
                </Button>
            </div>

            <PortfolioSummary
                totalValue={totalValue}
                totalInvested={totalInvested}
                totalEarned={totalEarned}
                averageGrowth={averageGrowth}
                totalTokens={totalTokens}
                totalAssets={totalAssets}
            />

            <div className="grid grid-cols-[1fr,300px] gap-6">
                <AssetList assets={assets} />
                <div className="space-y-4">
                    <RecentActivities activities={defaultActivities} />
                </div>
            </div>


        </div>
    )
}

const defaultActivities = [
    {
      id: "1",
      title: "The Lakeview Park",
      amount: "₹5,000",
      time: "2 hours ago",
      color: "#9333EA", // purple-600
    },
    {
      id: "2",
      title: "Tech Growth Fund",
      amount: "₹1,200",
      time: "Yesterday",
      color: "#2563EB", // blue-600
    },
    {
      id: "3",
      title: "Green Energy ETF",
      amount: "+5.2%",
      time: "2 days ago",
      color: "#16A34A", // green-600
    },
    {
      id: "4",
      title: "Wallet",
      amount: "₹10,000",
      time: "1 week ago",
      color: "#8B5CF6", // violet-500
    },
  ]
  
