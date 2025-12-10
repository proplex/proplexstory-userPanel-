"use client"

import dynamic from 'next/dynamic'

const Header = dynamic(() => import("@/components/common/Header"), { ssr: false })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
} 