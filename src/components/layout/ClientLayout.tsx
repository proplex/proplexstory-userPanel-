"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/common/Header";
import { Suspense } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isVerificationPage = pathname === "/verification";

  return (
    <>
      {!isAuthPage && !isVerificationPage && (
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
        </Suspense>
      )}
      {children}
    </>
  );
} 