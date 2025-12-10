"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Check } from "lucide-react"

type Step = "amount" | "destination" | "review" | "mfa" | "success"
type WithdrawType = "fiat" | "crypto"

interface WithdrawData {
  type: WithdrawType
  amount: string
  selectedBank?: string
  cryptoAsset?: string
  cryptoNetwork?: string
  walletAddress?: string
  mfaCode?: string
}

interface WithdrawDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WithdrawDialog({ open, onOpenChange }: WithdrawDialogProps) {
  const [currentStep, setCurrentStep] = useState<Step>("amount")
  const [withdrawData, setWithdrawData] = useState<WithdrawData>({
    type: "fiat",
    amount: "62500",
  })

  const availableBalance = 125000
  const banks = [
    { name: "HDFC Bank", code: "9876", ifsc: "HDFC0001234" },
    { name: "ICICI Bank", code: "0001", ifsc: "ICIC0000001" },
    { name: "State Bank of India", code: "0001", ifsc: "SBIN0000001" },
  ]

  const cryptoAssets = [
    { symbol: "USDT", networks: ["TRON", "ETH"] },
    { symbol: "BTC", networks: ["BTC"] },
    { symbol: "ETH", networks: ["ETH"] },
  ]

  const handleClose = () => {
    setCurrentStep("amount")
    setWithdrawData({ type: "fiat", amount: "62500" })
    onOpenChange(false)
  }

  const handleNext = () => {
    if (currentStep === "amount") {
      setCurrentStep("destination")
    } else if (currentStep === "destination") {
      setCurrentStep("review")
    } else if (currentStep === "review") {
      setCurrentStep("mfa")
    } else if (currentStep === "mfa") {
      setCurrentStep("success")
    }
  }

  const handleBack = () => {
    if (currentStep === "destination") {
      setCurrentStep("amount")
    } else if (currentStep === "review") {
      setCurrentStep("destination")
    } else if (currentStep === "mfa") {
      setCurrentStep("review")
    }
  }

  const getStepNumber = (step: Step) => {
    switch (step) {
      case "amount":
        return 1
      case "destination":
        return 2
      case "review":
        return 3
      default:
        return 3
    }
  }

  const isStepActive = (step: Step) => {
    return getStepNumber(step) === getStepNumber(currentStep)
  }

  const isStepCompleted = (step: Step) => {
    return getStepNumber(step) < getStepNumber(currentStep)
  }

  const calculateFees = () => {
    const amount = Number.parseFloat(withdrawData.amount) || 0
    if (withdrawData.type === "fiat") {
      return amount * 0.005 // 0.5% fee
    } else {
      return 10 + 2 // Base fee + network fee
    }
  }

  const calculateNet = () => {
    const amount = Number.parseFloat(withdrawData.amount) || 0
    const fees = calculateFees()
    return amount - fees
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" p-0 gap-0">
        <div className="bg-white rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Withdraw Funds</h2>
              <p className="text-gray-500 mt-1">Fast withdraw with clear visibility of your available balance.</p>
            </div>
            {/* <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button> */}
          </div>

          {/* Progress Steps */}
          {currentStep !== "success" && currentStep !== "mfa" && (
            <div className="flex items-center justify-center gap-8 py-6 border-b">
              <div
                className={`flex items-center gap-3 ${isStepActive("amount") ? "text-black" : isStepCompleted("amount") ? "text-gray-600" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    isStepActive("amount")
                      ? "bg-slate-900 text-white"
                      : isStepCompleted("amount")
                        ? "bg-gray-200 text-black"
                        : "bg-gray-100 text-black"
                  }`}
                >
                  1
                </div>
                <span className="font-medium">Amount</span>
              </div>

              <div
                className={`flex items-center gap-3 ${isStepActive("destination") ? "text-black" : isStepCompleted("destination") ? "text-gray-600" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    isStepActive("destination")
                      ? "bg-slate-900 text-white"
                      : isStepCompleted("destination")
                        ? "bg-gray-200 text-black"
                        : "bg-gray-100 text-black"
                  }`}
                >
                  2
                </div>
                <span className="font-medium">Destination</span>
              </div>

              <div
                className={`flex items-center gap-3 ${isStepActive("review") ? "text-black" : isStepCompleted("review") ? "text-gray-600" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    isStepActive("review")
                      ? "bg-slate-900 text-white"
                      : isStepCompleted("review")
                        ? "bg-gray-200 text-black"
                        : "bg-gray-100 text-black"
                  }`}
                >
                  3
                </div>
                <span className="font-medium">Review</span>
              </div>
            </div>
          )}

          {/* Type Selection */}
          {(currentStep === "amount" || currentStep === "destination" || currentStep === "review") && (
            <div className="flex gap-2 p-6 pb-4">
              <Button
                variant={withdrawData.type === "fiat" ? "default" : "outline"}
                className={`flex-1 ${withdrawData.type === "fiat" ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : ""}`}
                onClick={() => setWithdrawData({ ...withdrawData, type: "fiat" })}
              >
                To Fiat
              </Button>
              <Button
                variant={withdrawData.type === "crypto" ? "default" : "outline"}
                className={`flex-1 ${withdrawData.type === "crypto" ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : ""}`}
                onClick={() => setWithdrawData({ ...withdrawData, type: "crypto" })}
              >
                To Crypto
              </Button>
            </div>
          )}

          {/* Step Content */}
          <div className="p-6 pt-2">
            {currentStep === "amount" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-gray-500">Available Balance</p>
                  <p className="text-3xl font-bold">
                    {withdrawData.type === "fiat" ? `₹${availableBalance.toLocaleString()}.00` : "500.0000 USDT"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <Input
                      type="number"
                      value={withdrawData.amount}
                      onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
                      className="text-lg h-12"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWithdrawData({ ...withdrawData, amount: (availableBalance * 0.25).toString() })}
                    >
                      25%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWithdrawData({ ...withdrawData, amount: (availableBalance * 0.5).toString() })}
                    >
                      50%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWithdrawData({ ...withdrawData, amount: availableBalance.toString() })}
                    >
                      100%
                    </Button>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Min: {withdrawData.type === "fiat" ? "₹100.00" : "10 USDT"}</span>
                    <span>Max: {withdrawData.type === "fiat" ? "₹5,00,000.00" : "100000 USDT"}</span>
                    <span>Daily: {withdrawData.type === "fiat" ? "₹4,00,000.00" : "90000 USDT"}</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNext} className="bg-slate-900 hover:bg-slate-800">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "destination" && withdrawData.type === "fiat" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select bank account</label>
                    <div className="space-y-3">
                      {banks.map((bank) => (
                        <div
                          key={bank.code}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            withdrawData.selectedBank === bank.name
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setWithdrawData({ ...withdrawData, selectedBank: bank.name })}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {bank.name} •••{bank.code}
                              </p>
                              <p className="text-sm text-gray-500">SAVINGS • IFSC {bank.ifsc}</p>
                            </div>
                            {withdrawData.selectedBank === bank.name && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="link" className="mt-3 p-0 h-auto text-blue-600">
                      Add another bank
                    </Button>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button onClick={handleNext} className="bg-slate-900 hover:bg-slate-800">
                      Review
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
                      <div className="w-3 h-2 bg-white rounded-sm" />
                    </div>
                    <span className="font-medium">Available banks in IN</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Currency: INR</p>

                  <div className="space-y-3">
                    {banks.map((bank) => (
                      <div key={bank.code} className="space-y-1">
                        <p className="font-medium text-sm">{bank.name}</p>
                        <p className="text-xs text-gray-500">IFSC e.g. {bank.ifsc.slice(0, -4)}0001</p>
                      </div>
                    ))}
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Request unsupported bank
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "destination" && withdrawData.type === "crypto" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Select
                        value={withdrawData.cryptoAsset}
                        onValueChange={(value) => setWithdrawData({ ...withdrawData, cryptoAsset: value })}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="USDT" />
                        </SelectTrigger>
                        <SelectContent>
                          {cryptoAssets.map((asset) => (
                            <SelectItem key={asset.symbol} value={asset.symbol}>
                              {asset.symbol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select
                        value={withdrawData.cryptoNetwork}
                        onValueChange={(value) => setWithdrawData({ ...withdrawData, cryptoNetwork: value })}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="ETH" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="TRON">TRON</SelectItem>
                          <SelectItem value="BTC">BTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Input
                      placeholder="addsadasdasds"
                      value={withdrawData.walletAddress}
                      onChange={(e) => setWithdrawData({ ...withdrawData, walletAddress: e.target.value })}
                      className="h-12 border-2 border-blue-500"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button onClick={handleNext} className="bg-slate-900 hover:bg-slate-800">
                      Review
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Available assets & networks</h3>

                  <div className="space-y-4">
                    {cryptoAssets.map((asset) => (
                      <div key={asset.symbol}>
                        <p className="font-medium text-sm mb-2">{asset.symbol}</p>
                        <div className="flex gap-2">
                          {asset.networks.map((network) => (
                            <span key={network} className="px-2 py-1 bg-gray-200 text-xs rounded">
                              {network}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Request unsupported asset / chain
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "review" && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Review</h3>

                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">
                      {withdrawData.type === "fiat"
                        ? `₹${Number.parseFloat(withdrawData.amount).toLocaleString()}.00`
                        : `USDT ${withdrawData.amount}.00`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Fees</span>
                    <span className="font-medium">
                      {withdrawData.type === "fiat"
                        ? `₹${calculateFees().toFixed(2)}`
                        : `USDT ${calculateFees().toFixed(2)} + USDT 2.00 network`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Net</span>
                    <span className="font-medium">
                      {withdrawData.type === "fiat"
                        ? `₹${calculateNet().toLocaleString()}.00`
                        : `USDT ${calculateNet().toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Destination</span>
                    <span className="font-medium">
                      {withdrawData.type === "fiat"
                        ? `${withdrawData.selectedBank} ••••9876`
                        : `USDT on ETH → addsad...asds`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">ETA</span>
                    <span className="font-medium">
                      {withdrawData.type === "fiat" ? "Instant via IMPS" : "~1 block"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext} className="bg-slate-900 hover:bg-slate-800">
                    Confirm & Authorize
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "mfa" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Multi-factor authentication</h3>
                  <p className="text-gray-600">
                    Enter the 6-digit code sent to your phone/email or from your authenticator app.
                  </p>
                </div>

                <div>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={withdrawData.mfaCode}
                    onChange={(e) => setWithdrawData({ ...withdrawData, mfaCode: e.target.value })}
                    className="text-center text-2xl h-16 tracking-widest"
                    maxLength={6}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext} className="bg-slate-900 hover:bg-slate-800">
                    Confirm withdraw
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "success" && (
              <div className="text-center space-y-6 py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600" />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold mb-2">Withdrawal pending</h3>
                  <p className="text-gray-600">Reference: REF135512</p>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentStep("amount")
                      setWithdrawData({ type: "fiat", amount: "62500" })
                    }}
                    className="bg-slate-900 hover:bg-slate-800"
                  >
                    Make another
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
