"use client"
import React, { useEffect, useState, Suspense } from 'react'
import { useFetchPropertyById } from '@/hooks/property/useFetchPropertyById';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { IDocument, IProperty, Tenant } from '@/constants/global';
import { ChartLine, ChartColumn, FileText, MessagesSquare, LayoutDashboard, Icon } from 'lucide-react';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import PropertyCosting from '../../../components/projects/financials/PropertyCosting';
import { Button } from '@/components/ui/button';
import InvestingCard from '@/components/cards/PropertyCard/InvestingCard/InvestingCard';
// Define prop types for components
interface PropertyCardProps {
  property: IProperty;
}

interface KeyHighlightsProps {
  keyHighlights: any; // Replace with actual type
}

// Dynamic imports with proper typing
const PropertyCard = dynamic<PropertyCardProps>(() => import('@/components/cards/PropertyCard/PropertyCard').then(mod => mod.PropertyCard), {
  ssr: false,
  loading: () => <LoadingSkeleton />
});

const Tabs = dynamic(() => import('@/components/ui/tabs').then(mod => mod.Tabs), {
  ssr: false,
  loading: () => <LoadingSkeleton />
});

const TabsContent = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsContent), { ssr: false });
const TabsList = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsList), { ssr: false });
const TabsTrigger = dynamic(() => import('@/components/ui/tabs').then(mod => mod.TabsTrigger), { ssr: false });
const Faq = dynamic(() => import('./faq'), { ssr: false });
const DocumentList = dynamic(() => import('./documents/DocumentList'), { ssr: false });
const KeyHighlights = dynamic<KeyHighlightsProps>(() => import('@/components/projects/financials/key-highlights').then(mod => mod.KeyHighlights), { ssr: false });
const TenantInformation = dynamic(() => import('@/components/projects/financials/TenatInformation'), { ssr: false });
const About = dynamic(() => import('./overview/About'), { ssr: false });
const Exits = dynamic(() => import('./documents/exit'), { ssr: false });
const Token = dynamic(() => import('./token'), { ssr: false });
const HostedBy = dynamic(() => import('./overview/HostedBy'), { ssr: false });
const Feature = dynamic(() => import('./overview/Feature'), { ssr: false });
const NearByLocation = dynamic(() => import('./overview/NearByLocation'), { ssr: false });
const Risk = dynamic(() => import('./documents/risk'), { ssr: false });

const PropertyPage = () => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PropertyContent />
    </Suspense>
  );
};

const PropertyContent = () => {
  const params = useParams();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const { property, error, loading } = useFetchPropertyById(params?.propertyID as string);

  useEffect(() => {
    setIsClient(true);
    const token = sessionStorage.getItem("accessToken");
    const refresh = sessionStorage.getItem("refreshToken");
    setAccessToken(token);
    setRefreshToken(refresh);
  }, []);

  // Show loading while checking authentication
  if (!isClient) {
    return <LoadingSkeleton />;
  }


  if (error) {
    return (
      <div className="flex items-center m-auto p-auto justify-center h-screen">
        <p className="text-muted-foreground">Error: {error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center m-auto p-auto justify-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!property) {
    return <LoadingSkeleton />
  }


  return (
    <div className='max-w-6xl mx-auto py-8 px-4 max-sm:p-0' >
      <div className="">
        {/* <PropertyCard property={property} /> */}
        <InvestingCard property={property} />
      </div>
      <div className="w-full flex lg:items-start lg:justify-between gap-5 lg:mt-8 mt-4 flex-col-reverse lg:flex-row mx-auto max-sm:p-2">
        <Tabs defaultValue="overview" className="w-full lg:w-[900px]">
          <TabsList className="sticky h-auto z-20 top-0 inset-x-0 w-full overflow-x-auto scrollbar-hidden backdrop-blur-lg rounded-none bg-emerald-100/20 mb-2 p-1">
            {/* Desktop Tabs */}
            <div className="hidden lg:flex w-full justify-between items-center">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-black data-[state=active]:shadow-none data-[state=active]:text-white text-base flex items-center gap-2 w-1/4 min-w-max py-2 m-0.5 transition-all duration-500 linear"
              >
                <p className="flex items-center gap-2">
                  <LayoutDashboard size={16} />
                  <span className='data-[state=active]:text-[#725AEC]'>Overview</span>
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="growth"
                className="data-[state=active]:bg-black data-[state=active]:shadow-none data-[state=active]:text-white text-base flex items-center gap-2 w-1/4 min-w-max py-2 m-0.5 transition-all duration-500 linear"
              >
                <p className="flex items-center gap-2">
                  <ChartColumn size={16} />
                  <span className='data-[state=active]:text-[#725AEC]'>Growth</span>
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-black data-[state=active]:shadow-none data-[state=active]:text-white text-base flex items-center gap-2 w-1/4 min-w-max py-2 m-0.5 transition-all duration-500 linear"
              >
                <p className="flex items-center gap-2">
                  <FileText size={16} />
                  <span className='data-[state=active]:text-[#725AEC]'>Documents</span>
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="faqs"
                className="data-[state=active]:bg-black data-[state=active]:shadow-none data-[state=active]:text-white text-base flex items-center gap-2 w-1/4 min-w-max py-2 m-0.5 transition-all duration-500 linear"
              >
                <p className="flex items-center gap-2">
                  <MessagesSquare size={16} />
                  <span className='data-[state=active]:text-[#725AEC]'>FAQ</span>
                </p>
              </TabsTrigger>
            </div>

            {/* Mobile Tabs */}
            <div className="lg:hidden flex w-full justify-between items-center">
              <TabsTrigger
                value="overview"
                className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-semibold text-sm flex flex-col items-center gap-1 py-3 border-b-2 border-[#F8FAFC] transition-all duration-500"
              >
                <LayoutDashboard size={16} />
                <span className="text-xs whitespace-nowrap">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="growth"
                className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-semibold text-sm flex flex-col items-center gap-1 py-3 border-b-2 border-[#F8FAFC] transition-all duration-500"
              >
                <ChartColumn size={16} />
                <span className="text-xs whitespace-nowrap">Growth</span>
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-semibold text-sm flex flex-col items-center gap-1 py-3 border-b-2 border-[#F8FAFC] transition-all duration-500"
              >
                <FileText size={16} />
                <span className="text-xs whitespace-nowrap">Documents</span>
              </TabsTrigger>
              <TabsTrigger
                value="faqs"
                className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-semibold text-sm flex flex-col items-center gap-1 py-3 border-b-2 border-[#F8FAFC] transition-all duration-500"
              >
                <MessagesSquare size={16} />
                <span className="text-xs whitespace-nowrap">FAQ</span>
              </TabsTrigger>
            </div>
          </TabsList>

          <div className="">
            <TabsContent value="growth" className="mt-0 space-y-6 max-w-[700px]">
              <KeyHighlights keyHighlights={property.keyHighlights || []} />
              <PropertyCosting {...property} />

              <TenantInformation
                tenants={property.tenants}
                rentInformation={property.rentalInformation}
                totalSft={property.totalNumberOfSfts}
              />
            </TabsContent>

            <TabsContent value="overview" className="mt-0 space-y-6 max-w-[700px]">
              <About description={property.about || ''} />
              <Feature
                features={property.features || []}
                amenities={property.amenities || []}
              />
              <HostedBy hostedBy={property.hostedBy || {}} />

              <NearByLocation
                nearByLocations={property.nearByLocations || []}
                name={property.name || ''}
                lat={property.latitude || 0}
                lng={property.longitude || 0}
                landmark={property.landmark || ''}
              />

            </TabsContent>

            <TabsContent value="documents" className="mt-0 space-y-6 max-w-[700px] ">
              <DocumentList propertyDocument={property.documents || []} />
              <Risk risks={property.riskFactors || []} />
              <Exits exit={property.exitOpportunities || []} />
            </TabsContent>

            <TabsContent value="faqs" className="mt-0 space-y-6 max-w-[700px]">
              <Faq faqs={property.faqs || []} />
            </TabsContent>
          </div>
        </Tabs>

        <div className="lg:sticky lg:top-0 lg:inset-x-0 w-full lg:w-[500px] max-sm:p-1">
          <Token property={property as IProperty}
            kycCompleted={true}
          />
        </div>
      </div>
    </div>
  )
}

export default PropertyPage;