import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | OwnaMali",
    default: "Proplex ~ Democratising Real Estate Investments",
  },
  description: "Welcome to Proplex, a platform that democratises real estate investments. Co-own properties through fractional ownership.",
  keywords: [
    "content IP investment", 
    "fractional ownership", 
    "real estate co-ownership", 
    "real estate investment", 
    "democratising real estate ownership", 
    "real estate platform", 
    "invest in real estate", 
    "co-own real estate", 
    "proplex platform"
  ],
  icons: {
    icon: [
      { rel: 'icon', type: 'image/svg+xml', url: '/favicon.png' },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Proplex ~ Democratising Real Estate Investments",
    description: "Discover a new way to invest in real estate. Co-own properties and be part of the real estate market.",
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
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}