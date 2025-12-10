export const dynamic = "force-dynamic" // prevents Next.js from prerendering this page

import PropertyPageWrapper from "./PropertyPageWrapper"
import { Suspense } from 'react'
import ProjectsSkeleton from '@/assets/skeleton/Projects'

export default function PropertyPage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <PropertyPageWrapper />
    </Suspense>
  )
}
