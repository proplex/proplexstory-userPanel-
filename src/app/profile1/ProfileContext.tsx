import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useInvestorApi from '@/hooks/user/useInvestorApi'
import useUpdateInvestorApi from '@/hooks/user/useUpdateInvestorApi'

interface ProfileContextType {
    data: any
    loading: boolean
    updateProfile: (values: any) => Promise<boolean>
    fetchData: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const { data, fetchData, loading: investorLoading } = useInvestorApi()
    console.log('Profile Data is here :::::', data)
    const { updateInvestor, loading: updateLoading } = useUpdateInvestorApi()

    const updateProfile = async (values: any) => {
        try {
            const response = await updateInvestor(values)
            console.log('Update response:', response)

            if (response) {
                toast.success('Profile updated successfully')
                await fetchData()
                return true
            } else {
                toast.error('Failed to update profile')
                return false
            }
        } catch (error) {
            toast.error('Failed to update profile')
            return false
        }
    }

    return (
        <ProfileContext.Provider
            value={{
                data,
                loading: investorLoading || updateLoading,
                updateProfile,
                fetchData,
            }}
        >
            {children}
        </ProfileContext.Provider>
    )
}

export function useProfile() {
    const context = useContext(ProfileContext)
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider')
    }
    return context
} 