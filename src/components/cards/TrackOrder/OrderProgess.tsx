import React from 'react'

const OrderProgess = ({completedSteps, totalSteps}: {completedSteps: number, totalSteps: number}) => {
  return (
    <div>
          <div className="px-6 py-5  border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Order Progress</h2>
          <span className="text-sm text-gray-500">
            {completedSteps} of {totalSteps} steps completed
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
          <div
            className="bg-emerald-500 h-2.5 rounded-full"
            style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default OrderProgess
