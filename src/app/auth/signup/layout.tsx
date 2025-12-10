
import type { Metadata, Viewport } from "next";
import Header from "@/components/common/Header";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | proplex",
    default: "proplex",
  },
  description: "proplex Orders",
  icons: {
    icon: [
      { rel: 'icon', type: 'image/svg+xml', url: '/favicon.png' },
    ]
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "proplex",
    description: "proplex",
    url: "https://proplex.app",
    siteName: "proplex",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
    
      {children}
    </div>
  );
}
