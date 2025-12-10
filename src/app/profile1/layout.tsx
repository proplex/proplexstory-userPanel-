'use client'

import SideNavProfile from '@/components/profile/SideNavBar'
import { ProfileProvider, useProfile } from './ProfileContext'
import React from 'react'

function ProfileLayoutContent({ children }: { children: React.ReactNode }) {
  const { data, loading } = useProfile()

  return (
    <div className="flex gap-4 w-full p-4 max-w-6xl mx-auto">
      <SideNavProfile
        name={data?.fullName || ''}
        email={data?.email || ''}
        image={data?.avatar || ''}
        loading={loading}
      />
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <div className="min-h-screen bg-[#f9fafb]">
        {/* 📱 Mobile/Tablet View Message */}
        <div className="flex md:hidden items-center justify-center h-screen text-center px-6">
          <p className="text-lg font-semibold text-gray-600">
            This page is only available on <span className="text-primary">Desktop view</span>.
          </p>
        </div>

        {/* 💻 Desktop View */}
        <div className="hidden md:flex">
          <ProfileLayoutContent>{children}</ProfileLayoutContent>
        </div>
      </div>
    </ProfileProvider>
  )
}
