import api from '@/lib/httpClient'
import React, { useState } from 'react'

interface MobileOtpResponse {
  loading: boolean
  error: string
  handleMobileOtp: (mobile: string, countryCode: string) => Promise<boolean>
}

const useMobileOtp = (): MobileOtpResponse => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
  
    const handleMobileOtp = async (mobile: string, countryCode: string): Promise<boolean> => {
        setLoading(true)
        setError("")

        try {
            await api.post("/sms/send-otp", {
                mobile: mobile,
                countryCode: countryCode,
            })
            return true
        }
        catch(err: any) {
            setError(err.message || "Failed to send OTP. Please try again.")
            return false
        }
        finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        handleMobileOtp
    }
}

export default useMobileOtp
