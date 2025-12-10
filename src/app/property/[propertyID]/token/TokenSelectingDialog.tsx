"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ChartLine, Flame, Mail, Minus, Plus, ArrowRight, ArrowDown, ChevronDown, Info, Calendar, Shield, Layers, Bookmark, ShareIcon, IndianRupee, Bold, TrendingUpIcon } from "lucide-react"
import { formatCurrency, roundDownToOneDecimal } from "@/lib/utils";

import { IProperty } from "@/constants/global";

interface TokenSelectingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: () => void
    property: IProperty
    quantity: number
    setQuantity: (quantity: number) => void
    totalPrice: number
    ownerShip: number
}

export default function TokenSelectingDialog({ open, onOpenChange, onSubmit, property, quantity, setQuantity, totalPrice, ownerShip }: TokenSelectingDialogProps) {
    const minimuimToken = property?.tokenInformation?.minimumTokensToBuy
    const maximumToken = property?.tokenInformation?.maximumTokensToBuy
    const [tokenError, setTokenError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly')
    const [showCostBreakDown, setShowCostBreakDown] = useState(false)
    const fees = [...property?.fees?.registration, ...property?.fees?.legal]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                // onInteractOutside={(e) => {
                //     e.preventDefault();
                // }}
                className="w-full max-w-[450px] h-[545px] overflow-y-auto p-4 rounded-xl">
                <DialogHeader className="border-b border-gray-200">
                    <DialogTitle>Buy Property Tokens</DialogTitle>
                    <DialogDescription className="flex items-center gap-1 text-sm ">
                        {property.name} | <span className="text-green-500 flex items-center gap-2">
                            <TrendingUpIcon size={16} /> 1 Property Token = {property?.tokenInformation?.tokenPrice}
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-gray-100 p-4 border border-gray-200 space-y-2 rounded-xl">
                        <div className="flex justify-between ">
                            <h1 className="text-md font-medium"> Buy Property Tokens </h1>
                            <div className="flex items-center">
                                <Flame size={16} />
                                <span className="text-sm text-yellow-700">Tokens Available :  {property?.tokenInformation?.availableTokensToBuy - quantity}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col" >
                                <span className="text-sm text-gray-500">Your Ownership</span>
                                <span className="text-lg text-primary font-bold">{roundDownToOneDecimal(ownerShip)}%</span>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-sm text-end text-gray-500"> Number of Tokens</span>
                                <div className="flex items-center gap-2">
                                    {/* Decrease Button */}
                                    <button
                                        type="button"
                                        className="bg-red-200/40 border border-gray-500/40  rounded-full cursor-pointer shadow p-2 flex items-center justify-center"
                                        onClick={() => {
                                            if (quantity > minimuimToken) {
                                                setQuantity(quantity - 1);
                                                setTokenError(null);
                                            } else {
                                                setTokenError(`You must select at least ${minimuimToken} tokens.`);
                                            }
                                        }}
                                    >
                                        <Minus size={12} className="text-red-500 border border-red-500 rounded-full" />
                                    </button>

                                    <input
                                        type="text"
                                        min={minimuimToken}
                                        max={maximumToken}
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            if (!isNaN(val)) {
                                                setQuantity(val);
                                                if (val < minimuimToken) {
                                                    setTokenError(`Minimum ${minimuimToken} tokens required.`);
                                                } else if (val > maximumToken) {
                                                    setTokenError(`You can only buy up to ${maximumToken} tokens.`);
                                                } else {
                                                    setTokenError(null);
                                                }
                                            }
                                        }}
                                        onBlur={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            if (!isNaN(val)) {
                                                if (val < minimuimToken) {
                                                    setQuantity(minimuimToken);
                                                    setTokenError(`Minimum ${minimuimToken} tokens to required to invest.`);
                                                } else if (val > maximumToken) {
                                                    setQuantity(maximumToken);
                                                    setTokenError(`You can only buy up to ${maximumToken} tokens.`);
                                                } else {
                                                    setQuantity(val);
                                                    setTokenError(null);
                                                }
                                            }
                                        }}
                                        className="w-16 text-center font-bold text-lg bg-gray-100 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />

                                    {/* Increase Button */}
                                    <button
                                        type="button"
                                        className="bg-green-200/40 border border-gray-500/40  rounded-full cursor-pointer shadow p-2 flex items-center justify-center"
                                        onClick={() => {
                                            if (quantity < maximumToken) {
                                                setQuantity(quantity + 1);
                                                setTokenError(null);
                                            } else {
                                                setTokenError(`Maximum Tokens to buy  ${maximumToken} you cant invest more than this .`);
                                            }
                                        }}
                                    >
                                        <Plus size={12} className="text-green-500 border border-green-500 rounded-full" />
                                    </button>
                                </div>

                            </div>
                        </div>
                        {tokenError && <span className="text-red-500 text-sm">{tokenError}</span>}
                        <div className="flex items-center border-t border-gray-200 pt-4 justify-between">
                            <h1 className="text-sm text-black font-medium">Cost Breakdown</h1>
                            <ChevronDown
                                size={16}
                                className={`cursor-pointer transition-transform duration-300 ${showCostBreakDown ? 'rotate-180' : ''}`}
                                onClick={() => setShowCostBreakDown(!showCostBreakDown)}
                            />
                        </div>
                        <div className={`w-full transition-all duration-300 ease-in-out transform ${showCostBreakDown ? 'opacity-100 max-h-[1000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                            <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-1">
                                <div className="flex items-center justify-between p-1  rounded-md">
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-700 font-sans text-sm">Token Value</span>
                                        <span className="text-gray-500 text-sm">({quantity} Tokens)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-700 font-medium">{totalPrice}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                {fees?.filter(fee => fee.status).map((fee) => {
                                        const feeAmount = fee.isPercentage
                                            ? (totalPrice / 100) * fee.value
                                            : Number(fee.value);
                                        return (
                                            <div
                                                key={fee._id}
                                                className="flex items-center justify-between p-1 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-700 font-sans text-sm">{fee?.name}</span>
                                                    <span className="text-gray-500 text-sm">
                                                        {fee?.isPercentage ? '%' : ''}
                                                        {/* {formatCurrency(fee?.value)} */}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="text-gray-700  text-sm font-medium"> {formatCurrency(roundDownToOneDecimal(feeAmount))}</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>


                            </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-100 rounded-md border-t border-gray-200 mt-2">
                            <span className="text-gray-700 font-semibold">Total Investment</span>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-700 font-bold">{formatCurrency(totalPrice)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 ">

                        <div className="bg-gray-100 p-2 border border-gray-200 rounded-xl space-y-2">
                            <div className="flex justify-between">
                                <h1 className="text-md text-black">Est. Annual Returns </h1>
                                <Info size={16} />
                            </div>
                            <div className="flex flex-col gap-2">

                                <h1 className="font-bold text-xl text-green-500">{roundDownToOneDecimal(totalPrice * (property?.investmentPerformance?.irr / 100))}</h1>
                            <h1 className="text-sm text-gray-500">Based on {property?.investmentPerformance?.irr}% Est. ROI</h1>

                            </div>
                        </div>
                        <div className="bg-gray-100 p-2 border border-gray-200 rounded-xl space-y-2">
                            <div className="flex justify-between">
                                <h1 className="text-md text-black">Projected Divided <br/> Yield</h1>
                                <Calendar size={16} />
                            </div>
                            <div className="flex flex-col gap-2">
                            <h1 className="font-bold text-xl text-primary">
                                    {activeTab === 'monthly' ? (roundDownToOneDecimal(totalPrice * (8.5/100))) : (roundDownToOneDecimal(totalPrice * ((8.5*12)/100)))}
                                </h1>
                                <div className="relative bg-gray-200 rounded-lg flex items-center justify-between px-1 py-1">
                                    {/* Sliding background indicator */}
                                    <div
                                        className={`absolute top-1 left-1 w-1/2 h-[20px] rounded-full bg-black transition-transform duration-300 ease-in-out`}
                                        style={{
                                            transform: activeTab === 'monthly' ? 'translateX(0%)' : 'translateX(100%)',
                                        }}
                                    />
                                    <button
                                        className={`relative z-10 w-1/2 text-sm font-medium ${activeTab === 'monthly' ? 'text-white' : 'text-gray-600'
                                            }`}
                                        onClick={() => setActiveTab('monthly')}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        className={`relative z-10 w-1/2 text-sm font-medium ${activeTab === 'yearly' ? 'text-white' : 'text-gray-600'
                                            }`}
                                        onClick={() => setActiveTab('yearly')}
                                    >
                                        Yearly
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-green-500/30 p-2 rounded-xl">
                        {config.map((item, index) => (
                            <div key={index} className="flex flex-col items-center justify-start text-center space-y-2 min-h-[50px]">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                                    {item.icon}
                                </div>
                                <h1 className="text-xs font-bold  text-green-500 break-words">
                                    {item.title}
                                </h1>
                            </div>
                        ))}
                    </div> */}

                    <Button className="text-md w-full bg-primary  text-white flex items-center justify-center gap-2" onClick={() => onSubmit()}>Next <ArrowRight size={16} /></Button>

                </div>
            </DialogContent>
        </Dialog>
    )
}

// const config = [
//     {
//         title: "Legally Protected",
//         icon: <Shield size={16} />,

//     },
//     {
//         title: "Blockchain Secured",
//         icon: <Layers size={16} />,

//     },
//     {
//         title: "Smart Contract",
//         icon: <Bookmark size={16} />,

//     },
//     {
//         title: "Liquid Assets",
//         icon: <ShareIcon size={16} />,

//     },
// ]