"use client"

import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { toast } from "react-toastify"
import api from "@/lib/httpClient"

interface EmailOtpProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  onVerify?: () => void
  onResend?: () => void
}

const EmailOtp = ({ open, onOpenChange, email, onVerify, onResend }: EmailOtpProps) => {
  const [otp, setOtp] = useState<string>("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setIsVerifying(true)
    try {
      await api.post('/email/verify-otp', {
        otp,
        email
      })
      
      toast.success("Email verified successfully")
      if (onVerify) onVerify()
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to verify OTP. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      await api.post('/email/resend-otp', { email })
      toast.success("OTP resent successfully")
      if (onResend) onResend()
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="bg-gray-50 p-6 space-y-2 border-b">
          <div className="flex items-center gap-2">
            <Mail size={20} className="text-gray-600" />
            <DialogTitle className="text-xl font-semibold">Verify Email</DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 text-sm">
            Enter the OTP sent to your email to verify.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col px-2 py-2">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Email</h2>
          <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-2 border border-blue-100">
            <Mail size={16} className="text-blue-600" />
            <p className="text-gray-700 font-medium">{email}</p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-2 border-y">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600">Enter the OTP sent to your email</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResend} 
              disabled={isResending}
              className="whitespace-nowrap text-sm hover:bg-gray-100"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </Button>
          </div>
        </div>

        <div className="bg-white px-8 py-2">
          <InputOTP 
            value={otp} 
            onChange={setOtp} 
            maxLength={6} 
            containerClassName="flex justify-center gap-4"
          >
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-12 h-12 m-2 text-xl border-gray-200 focus:border-gray-400 rounded-lg"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <DialogFooter className="px-6 py-4 flex justify-end gap-2 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isVerifying}
            className="h-11 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button 
            variant="default" 
            onClick={handleVerify} 
            disabled={isVerifying}
            className="bg-black hover:bg-black/80 h-11 text-sm font-medium"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EmailOtp
