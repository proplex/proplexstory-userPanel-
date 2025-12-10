import Header from "@/components/common/Header";
import type { Metadata, Viewport } from "next";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | proplex",
    default: "Explore Projects | proplex",
  },
  description: "Invest in Real World Assets through proplex. Participate in fractional ownership and co-own Real World Projects, Earn Passive Income and enjoy Capital Appreciation.",
  keywords: [
    "Real Estate ", 
    "IP investment", 
    "film", 
    "fractional ownership", 
    "web series investments", 
    "RWA assets   Investment", 
    "Fractional ownership", 
    "intellectual property", 
   " compliant token offerings",
"escrow-protected payments",
"trustee-managed escrow",
"Portfolio management",
"low minimum investment",
"secondary market liquidity",
"proplex investments",
"invest in property",
"fractional property shares",
"real estate Kenya",
"African real estate investing",
    "co-own content",
    "democratising IP investments"
  ],
  icons: {
    icon: [
      { rel: 'icon', type: 'image/svg+xml', url: '/favincon.svg' },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Explore Projects | proplex",
    description: "Invest in intellectual property (IP) of films, music, web series, and sports. Participate in fractional ownership and co-own creative projects.",
    url: "https://proplex.app",
    siteName: "proplex",
    type: "website",
  },
};

export default function ProjectsLayout({
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