"use client"

import { useMemo } from "react"
import type { Order, TrackingStepWithUIState } from "@/constants/global"
import { TrackingStep } from "./TrackingSteps"
import OrderProgess from "./OrderProgess"

interface OrderTrackingProps {
  order: Order
}

export function OrderTracking({ order }: OrderTrackingProps) {
  const trackingWithUIState = useMemo(() => {
    return order.tracking
      .sort((a, b) => a.comingOrder - b.comingOrder)
      .map((step, idx) => {
        let uiState: "completed" | "active" | "inactive"
        
        // If the step is marked as completed, it should be completed
        if (step.isCompleted) {
          uiState = "completed"
        } 
        // If the step status matches current status, it's active
        else if (step.status === order.currentStatus) {
          uiState = "active"
        } 
        // Otherwise, check if any previous step is completed to determine if this should be inactive
        else {
          const previousSteps = order.tracking
            .sort((a, b) => a.comingOrder - b.comingOrder)
            .slice(0, idx)
          
          // If any previous step is completed, this step should be inactive
          // If no previous step is completed, this step should be inactive (not started yet)
          uiState = "inactive"
        }
        
        // Add _id if it doesn't exist (using index as fallback)
        const stepWithId = {
          ...step,
          _id: step._id || `step-${idx}`,
          uiState
        }
        
        return stepWithId
      })
  }, [order])

  const completedSteps = trackingWithUIState.filter((step) => step.uiState === "completed").length
  const totalSteps = trackingWithUIState.length
 
 
  return (
    <div className="space-y-4">
      <div className="bg-white space-y-4 rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <OrderProgess completedSteps={completedSteps} totalSteps={totalSteps} />
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 space-y-2">
          {trackingWithUIState.map((step, index) => (
            <TrackingStep 
              key={step._id} 
              step={step} 
              isLast={index === trackingWithUIState.length - 1} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}
