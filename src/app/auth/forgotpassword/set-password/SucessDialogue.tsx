import LottieAnimation from '@/components/animation/LottieAnimation'
import Success from '../../../../../public/lottie-animations/Success.json'
import React, { useEffect } from 'react'

const SucessDialogue = () => {
  return (
    <div>
        <div className='dialogue-container fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
            <div className='dialogue-box bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
                <div className='text-center'>
                    <div className='mx-auto h-24 w-24 sm:h-28 sm:w-28 mb-4'>
                         <LottieAnimation animationData={Success} style={{ height: '100%' }} />
                    </div>
                    <h2 className='text-2xl font-bold text-gray-800 mb-4'>Success!</h2>
                    <p className='text-gray-600'>Your password has been successfully reset.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SucessDialogue
