import { IOrder } from '@/constants/global'
import React from 'react'

const TransacationFailed = ({order}: {order: IOrder}) => {
    console.log(order);
  return (
    <div>
        <div className='flex flex-col gap-4'>   
            <h1 className='text-2xl font-bold'>Transaction Failed</h1>
            <p className='text-sm text-gray-500'>
                Your transaction has failed. Please try again.
            </p>
            <p className='text-sm text-gray-500'>
                If you have any questions, please contact us at <a href='mailto:support@proplex.app' className='text-blue-500'>support@proplex.app</a>.
            </p>
        </div>
    </div>
  )
}

export default TransacationFailed
