// app/profile/page.tsx
import { redirect } from 'next/navigation'
import {Suspense} from 'react'

export default function ProfilePage() {
  <Suspense fallback={<div>Loading...</div>}>

  </Suspense>
  redirect('/profile1/personal')
}
