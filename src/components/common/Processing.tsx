import { formatTime } from '@/constants/global'
import React from 'react'

const Processing = ({isCompleted, processingTime}: {isCompleted: boolean, processingTime: number}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">

                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {isCompleted ? "Payment Completed!" : "Processing Payment"}
                            </h3>
                            <p className="text-gray-600">
                                {isCompleted
                                    ? "Your investment has been successfully processed. Redirecting to summary..."
                                    : "Please wait while we process your transaction..."
                                }
                            </p>
                            <div className="text-2xl font-mono text-primary">{formatTime(processingTime)}</div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full  transition-all duration-300 ${isCompleted ? 'bg-primary' : 'bg-primary'
                                    }`}
                                style={{ width: `${isCompleted ? 100 : Math.min((processingTime / 120) * 100, 100)}%` }}
                            ></div>
                        </div>

                        <div className="text-sm text-gray-500 text-center">
                            {isCompleted ? (
                                <>
                                    <p className="text-green-600 font-medium">✓ Payment verified</p>
                                    <p className="text-green-600 font-medium">✓ Transaction processed</p>
                                    <p className="text-green-600 font-medium">✓ Investment confirmed</p>
                                </>
                            ) : (
                                <>
                                    <p>• Verifying payment details</p>
                                    <p>• Processing transaction</p>
                                    <p>• Confirming investment</p>
                                </>
                            )}
                        </div>
                    </div>
    </>
  )
}

export default Processing
