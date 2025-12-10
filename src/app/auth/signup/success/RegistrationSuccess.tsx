"use client"

import LottieAnimation from '@/components/animation/LottieAnimation'
import Success from '../../../../../public/lottie-animations/Success.json'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'

export default function RegistrationSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegistrationSuccessContent />
    </Suspense>
  );
}

function RegistrationSuccessContent() {
  const searchParams = useSearchParams()
  const token = searchParams?.get('token')
  const mobile = searchParams?.get('mobile')
  const router = useRouter()
  console.log(token, mobile)

  return (
    <div className="flex  items-center justify-center bg-gray-50 px-4 py-10">
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-lg space-y-6 text-center">
        <CardHeader>
          <div className="mx-auto h-24 w-24 sm:h-28 sm:w-28">
            <LottieAnimation animationData={Success} style={{ height: '100%' }} />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
            Account Created Successfully!
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-600">
            Welcome to OwnMali! Your account has been created and we're ready to verify your mobile number.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-left text-sm sm:text-base">
          {/* Verification Notice */}
          <div className="rounded-md border border-green-200 bg-green-50 p-4">
            <div className="font-semibold text-green-800">Verification Required</div>
            <p className="text-sm text-green-700">
              We'll send a code to your mobile number {mobile}
            </p>
          </div>

          {/* Next Steps */}
          <div className="text-gray-700 space-y-2">
            <div className="font-semibold">Next Steps:</div>
            <ul className="list-disc list-inside space-y-1">
              <li>Verify your mobile number with the SMS code</li>
              <li>Complete your profile information</li>
              <li>Verify your identity with National ID</li>
              <li>Start exploring property investments</li>
            </ul>
          </div>

          {/* Continue Button */}
            <Button className="w-full rounded bg-[#03a853] py-2 text-white hover:bg-[#03a853]/90 transition-colors mt-4 cursor-pointer" onClick={() => router.push(`/auth/signup/verify?token=${token}&mobile=${mobile}`)} >
              Continue to Verification
            </Button>

          {/* Footer */}
          <div className="pt-2 text-center text-xs text-gray-400">
            Secure authentication powered by <span className="font-medium text-gray-500">proplex</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
