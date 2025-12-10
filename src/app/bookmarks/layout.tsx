import Header from "@/components/common/Header";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | ownmali",
    default: "ownmali Bookmarks",
  },
  description: "ownmali Bookmarks",
  icons: {
    icon: [
      { rel: 'icon', type: 'image/svg+xml', url: '/favicon.png' },
    ]
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "ownmali Bookmarks",
    description: "ownmali Bookmarks",
    url: "https://ownmali.app",
    siteName: "ownmali",
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
