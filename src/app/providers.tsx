'use client';

import { Web3Providers } from "@/providers/Web3Providers";
import { Toaster } from "@/components/ui/toaster";
import GlobalRyzerProvider from "./provider";
import ClientLayout from "@/components/layout/ClientLayout";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3Providers>
      <GlobalRyzerProvider>
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </GlobalRyzerProvider>
    </Web3Providers>
  );
}
