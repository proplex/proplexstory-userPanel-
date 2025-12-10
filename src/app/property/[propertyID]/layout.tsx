import Header from "@/components/common/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Project Overview - proplex`,
  description: "DEMOCRATISING CONTENT IP INVESTMENTS. Don't just Consume Content, Co-Own it",
  icons: {
    icon: [
      { rel: 'icon', type: 'image/svg+xml', url: '/favicon.png' },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      {children}
    </div>
  );
}