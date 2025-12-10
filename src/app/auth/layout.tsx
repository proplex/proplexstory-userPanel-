import type { Metadata } from "next";
import GlobalRyzerProvider from "../provider";

export const metadata: Metadata = {
  title: {
    template: "%s | proplex",
    default: "proplex Authentication",
  },
  description: "proplex Authentication",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <GlobalRyzerProvider>
        {children}
      </GlobalRyzerProvider>
    </div>
  );
} 