'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { User } from 'lucide-react'
import React, { useEffect, useState, useCallback } from 'react'
import ProfileTab from './ProfileTab'
import useInvestorApi from '@/hooks/user/useInvestorApi'

const ProfileTabs = () => {
    const {data, fetchData} = useInvestorApi()
    const [profileData, setProfileData] = useState(data)

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        setProfileData(data)
    }, [data])

    const handleProfileUpdate = useCallback(async () => {
        const newData = await fetchData()
        setProfileData(newData)
        
    }, [fetchData])

    return (
        <div>
            <div className="bg-white rounded-lg">
                <Tabs defaultValue='profile'>
                    <TabsList className='flex justify-between'>
                        <TabsTrigger
                            value="profile"
                            className="w-full py-3 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-black rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black transition-colors duration-200"
                        >
                            <span>Profile</span>
                        </TabsTrigger>
                        <TabsTrigger
                            className="w-full py-3 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-black rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black transition-colors duration-200"
                            value="kyc"
                        >
                            <span>KYC</span>
                        </TabsTrigger>
                        <TabsTrigger
                            className="w-full py-3 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-black rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black transition-colors duration-200"
                            value="nominee"
                        >
                            <span>Nominee</span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <ProfileTab data={profileData} onProfileUpdate={handleProfileUpdate} />
                    </TabsContent>
                    <TabsContent value="kyc">
                        Kyc
                    </TabsContent>
                    <TabsContent value="nominee">
                        Nominee
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default ProfileTabs
