import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import UpcomingPayouts from './upcomingPayouts'
import MyreturnsTable from './MyreturnsTable'
import TransactionTable from './TransactionTable'

const MyTransitions = () => {
  return (
    <>
        <Card className='w-full shadow-none rounded-lg p-4'>
            
                <Tabs defaultValue='upcoming_payouts' className='w-full p-4'>
                    <TabsList className=' bg-transparent gap-3'>
                        <TabsTrigger value='upcoming_payouts' className='w-full px-4 py-2 border shadow-none rounded-full data-[state=active]:bg-black data-[state=active]:text-white'>Upcoming Payouts</TabsTrigger>
                        <TabsTrigger value='my_returns' className='w-full px-4 py-2 border shadow-none b rounded-full data-[state=active]:bg-black data-[state=active]:text-white'>My Returns</TabsTrigger>
                        <TabsTrigger value='order_history' className='w-full px-4 py-2 border shadow-none rounded-full data-[state=active]:bg-black data-[state=active]:text-white'>Order History</TabsTrigger>

                    </TabsList>
                    <TabsContent value='upcoming_payouts' className='mt-6 space-y-6'>
                        <UpcomingPayouts
                        upcoming_rent_amount={10000}
                        distribution_date={"2025-09-10"}
                        period='Monthly'
                        tokens={450}
                        annual_yield={6.9}
                        account='Wallet'
                        />
                    </TabsContent>
                    <TabsContent value='my_returns' className='mt-6 space-y-6'>
                        <MyreturnsTable/>
                    </TabsContent>
                    <TabsContent value='order_history' className='mt-6 space-y-6'>
                        <TransactionTable/>
                    </TabsContent>

                </Tabs>
            
        </Card>
    </>
  )
}

export default MyTransitions
