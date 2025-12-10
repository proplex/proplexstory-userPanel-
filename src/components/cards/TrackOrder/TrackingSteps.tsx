import { Check, CheckCircle2, Clock } from "lucide-react"
import type { TrackingStepWithUIState } from "@/constants/global"
import { formatDate, formatDateTime } from "@/lib/utils"
import { CountdownTimer } from "./CountDownTimer"

interface TrackingStepProps {
  step: TrackingStepWithUIState
  isLast: boolean
}

export function TrackingStep({ step, isLast }: TrackingStepProps) {
  return (
    <div className="relative pb-8">
      {/* Vertical line */}
      {!isLast && (
        <div
          className={`absolute left-4 top-8 -ml-px h-full w-1 ${
            step.uiState === "inactive" ? "bg-gray-100" : "bg-gradient-to-b from-blue-400 to-blue-600"
          }`}
          aria-hidden="true"
        />
      )}

      <div className="relative flex items-start space-x-3">
        {/* Icon */}
        <div>
          {step.uiState === "completed" ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Check className="h-5 w-5 text-green-500" />
            </div>
          ) : step.uiState === "active" ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <h3
              className={`text-base font-semibold ${
                step.uiState === "inactive"
                  ? "text-gray-500"
                  : step.uiState === "active"
                    ? "text-blue-600"
                    : "text-green-600"
              }`}
            >
              {step.title}
            </h3>
            <span className="text-sm text-gray-500">{step.completedAt && formatDateTime(step.completedAt)}</span>
            {step.uiState === "active" && !step.isCompleted && step.dueDate && (
              <div className="flex flex-col">
                <CountdownTimer targetDate={step.dueDate} />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{step.description}</p>

          <div className="mt-2">
            {step.uiState === "completed" && step.completedAt && (
              <span className="text-sm text-gray-500">Completed on {formatDateTime(step.completedAt)}</span>
            )}

          
            {step.status === "property-tokens-transfer-pending" && (
              <button className="mt-2 bg-blue-600/20 text-blue-600 px-2 py-1 rounded-full inline-flex items-center text-sm font-medium">
                <span className="mr-1"></span> View Transfer Status
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
