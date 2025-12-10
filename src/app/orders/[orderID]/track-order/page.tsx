"use client"

import React, { Suspense } from 'react'
import OrderSummary from '@/components/cards/TrackOrder/orderSummary'
import useFetchOrderById from '@/hooks/order/useFetchOrderById'
import { IOrder, Order } from '@/constants/global'
import NothingFound from '@/components/common/NothingFound'
import ProjectsSkeleton from '@/assets/skeleton/Projects'
import { OrderTracking } from '@/components/cards/TrackOrder/OrderTracking'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MoveRight } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import TransacationFailed from '@/components/cards/TrackOrder/TransacationFailed'
import { withClientNavigation } from '@/lib/client-wrappers'

function TrackOrderContent() {
  const params = useParams();
  const router = useRouter()
  const { order: orderData, loading: orderLoading } = useFetchOrderById(params?.orderID as string)
  
  if (orderData?.tracking[0]?.status === "order-failed") {
    return (
      <div className='max-w-3xl mx-auto'>
        <div className="p-4 m-4">
          <TransacationFailed order={orderData as IOrder} />
        </div>
      </div>  
    )
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <div className="p-4 m-4">
        {orderLoading ? (
          <ProjectsSkeleton />
        ) : orderData ? (
          <div className="">
            <div className="">
              <OrderSummary orderValue={orderData as IOrder} />
            </div>
            <div className="">
              <OrderTracking order={orderData as unknown as Order} />
            </div>
              <div className="p-2 flex justify-between items-center">
                <Button className='bg-white hover:bg-gray-50 border border-gray-300 text-gray-500 flex' onClick={() => router.push('/property')}> <ArrowLeft size={16} className='mr-2' /> Explore More Assets</Button>
                <Button  className='bg-primary text-white flex' onClick={() => router.push('/dashboard')}>View Dashboard <MoveRight size={16} className='ml-2' /></Button>
              </div>
          </div>
        ) : (
          <NothingFound />
        )}
      </div>
    </div>
  )
}

const WrappedTrackOrderContent = withClientNavigation(TrackOrderContent);

function TrackOrderPage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <WrappedTrackOrderContent />
    </Suspense>
  );
}

export default TrackOrderPage;
