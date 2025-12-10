"use client"

import React from "react"
import { FileText, CreditCard, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useProfile } from "../ProfileContext"
import { useRouter } from "next/navigation"

export default function KYCVerification() {
  const { data } = useProfile()
  const router = useRouter()
  const verificationStatus = data?.kycCompleted ? "verified" : "pending"
  console.log('verificationStatus is here :::::', verificationStatus)

  const handleCompleteKYC = () => {
    router.push('/kyc')
  }

  

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">KYC Verification</h1>
                  <p className="text-gray-500 text-sm">Identity of the user</p>
                </div>
              </div>
              <Badge
                variant={verificationStatus === "verified" ? "default" : "secondary"}
                className={`px-3 py-1 ${
                  verificationStatus === "verified"
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                }`}
              >
                {verificationStatus === "verified" ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-1" />
                    Pending Verification
                  </>
                )}
              </Badge>
            </div>

            {/* Document Numbers */}
            {/* <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-gray-600 font-medium mb-4">National Number</h3>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 font-mono">XXXX XXXX 1234</span>
                </div>
              </div>
              <div>
                <h3 className="text-gray-600 font-medium mb-4">PAN Number</h3>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 font-mono">ABCDE1234F</span>
                </div>
              </div>
            </div> */}

            {/* Status Section */}
            {verificationStatus === "pending" ? (
                <div className="flex flex-col items-center justify-center text-center p-6 bg-orange-50 border border-orange-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">KYC Verification Required</h3>
                  <p className="text-orange-700 mb-6 max-w-md">
                    Complete your KYC verification to unlock all features and start investing. This is a one-time process that helps us verify your identity.
                  </p>
                  <Button
                    onClick={handleCompleteKYC}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2 rounded-lg font-medium"
                  >
                    Complete Your KYC
                  </Button>
                </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Verification Complete</h3>
                    <p className="text-green-700 mb-4">
                      Your KYC verification has been approved. You now have full access to all features.
                    </p>
                    <div className="bg-white border border-green-200 rounded-lg p-3 inline-flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-800 text-sm font-medium">Verified on: 27/05/2025</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
