import api from '@/lib/httpClient'
import React, { useState } from 'react'

type OTPData = {
    mobileNumber: string
    countryCode: string
    password?: string
}
const useSendOTP = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [token, setToken] = useState<string | null>(null)

    const sendOTP = async (data: OTPData) => {
        setIsLoading(true)
        try {
            const response = await api.post('/user/send-otp', data)
            console.log(response)
            console.log(response.data.data._id)
            setToken(response.data.data._id)
            return response
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return { sendOTP, isLoading, error, token }
}

export default useSendOTP
