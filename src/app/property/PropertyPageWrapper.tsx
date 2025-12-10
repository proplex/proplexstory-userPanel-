"use client"

import dynamic from "next/dynamic"

const PropertyPageContent = dynamic(() => import("./PropertyPageContent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  ),
})

export default function PropertyPageWrapper() {
  return <PropertyPageContent />
}
