import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import MyDocumentTable from './MyDocumentTable'
import AssetDocumentsTable from './AssetDocumentsTable'
import RiskFactor from './RiskFactor'
import ExitOppurtinity from './ExitOppurtinity'

const Documents = () => {
  return (
    <>
        <Card className='w-full shadow-none rounded-lg p-4'>
            
                <Tabs defaultValue='my_documents' className='w-full p-4'>
                    <TabsList className=' bg-transparent gap-3'>
                        <TabsTrigger value='my_documents' className='w-full px-4 py-2 border shadow-none rounded-full data-[state=active]:bg-black data-[state=active]:text-white'>My documents</TabsTrigger>
                        <TabsTrigger value='asset_documents' className='w-full px-4 py-2 border shadow-none b rounded-full data-[state=active]:bg-black data-[state=active]:text-white'>Asset documents</TabsTrigger>
                    </TabsList>
                    <TabsContent value='my_documents' className='mt-6 space-y-6'>
                       <MyDocumentTable/>
                    </TabsContent>
                    <TabsContent value='asset_documents' className='mt-6 space-y-6'>
                        <AssetDocumentsTable/>
                        <RiskFactor/>
                        <ExitOppurtinity/>
                    </TabsContent>
                    


                </Tabs>
            
        </Card>
    </>
  )
}

export default Documents
