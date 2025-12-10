import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChartArea, ChartNoAxesColumn, FileText, ShoppingCart } from 'lucide-react'
import React from 'react'
import AssetInformationCard from './AssetInformationCard'
import OwnershipSectionCard from './OwnershipSectionCard'
import AssetManager from './AssetManager'
import MyTransitions from './MyTransitions'
import Documents from './Documents'

const PortfolioTabs = () => {
  return (
    <div>
      <Tabs defaultValue="documents" className="w-full lg:w-[900px]">
          <TabsList className="sticky h-auto z-20 top-0 inset-x-0 w-full overflow-x-auto scrollbar-hidden backdrop-blur-lg rounded-none bg-emerald-100/20 mb-2 p-1">
            <div className="hidden lg:flex w-full justify-between items-center">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:shadow-none data-[state=active]:text-white text-base flex items-center gap-2 w-1/4 min-w-max py-3 m-0.5 transition-all duration-500 linear"
              >
                <p className="flex items-center gap-2">
                  <ChartArea size={16} />
                  <span className='data-[state=active]:text-[#725AEC]'>Asset overview</span>
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="my_transitions"
                className="data-[state=active]:bg-primary data-[state=active]:shadow-none data-[state=active]:text-white text-base flex items-center gap-2 w-1/4 min-w-max py-3 m-0.5 transition-all duration-500 linear"
              >
                <p className="flex items-center gap-2">
                  <ShoppingCart size={16} />
                  <span className='data-[state=active]:text-[#725AEC]'>My Transitions</span>
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-primary data-[state=active]:shadow-none data-[state=active]:text-white text-base flex items-center gap-2 w-1/4 min-w-max py-3 m-0.5 transition-all duration-500 linear"
              >
                <p className="flex items-center gap-2">
                  <FileText size={16} />
                  <span className='data-[state=active]:text-[#725AEC]'>Documents</span>
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="data-[state=active]:bg-primary data-[state=active]:shadow-none data-[state=active]:text-white text-base flex items-center gap-2 w-1/4 min-w-max py-3 m-0.5 transition-all duration-500 linear"
              >
                <p className="flex items-center gap-2">
                  <ChartNoAxesColumn size={16} />
                  <span className='data-[state=active]:text-[#725AEC]'>Activities</span>
                </p>
              </TabsTrigger>
            </div>

            
          </TabsList>

          <div className="">
            <TabsContent value="my_transitions" className="mt-0 space-y-6">
              <MyTransitions/>
            </TabsContent>

            <TabsContent value="overview" className="mt-0 space-y-6">
              <AssetInformationCard/>
              <OwnershipSectionCard/>
              <AssetManager
              manager_name='Mani Suresh Narayana'
              manager_role='Senior Asset Manager'
              manager_experience=' 8+ years experience'
              location='Hyderabad, India'
              languages='Telugu, Hindi, English'
              />
            </TabsContent>

            <TabsContent value="documents" className="mt-0 space-y-6 ">
             <Documents/>
              
              
            </TabsContent>

            <TabsContent value="activities" className="mt-0 space-y-6 max-w-[700px]">
               
            </TabsContent>
          </div>
        </Tabs>
    </div>
  )
}

export default PortfolioTabs
