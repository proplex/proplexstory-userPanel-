import Header from "@/components/common/Header";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Proplex",
    default: "proplex Orders",
  },
  description: "proplex Orders",
  icons: {
    icon: [
      { rel: 'icon', type: 'image/svg+xml', url: '/favicon.png' },
    ]
  },
  manifest: "/manifest.json",
  openGraph: {
        title: "proplex Orders",
    description: "proplex Orders",
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
