'use client';

import { OrdersTable } from "@/components/my-orders/OrdersTable";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function ClientWrapper() {
  const pathname = usePathname();
  const pathSegments = pathname?.split("/").filter((segment) => segment);

  return (
    <main className="min-h-screen p-4 md:p-6 bg-gray-50">
      <section className="h-full w-full max-w-[1200px] mx-auto flex flex-col items-start">
        <div className="w-full h-full bg-white rounded-xl shadow-sm flex flex-col items-stretch gap-6 p-4 md:p-6">
          <OrdersTable />
        </div>
      </section>
    </main>
  );
} 