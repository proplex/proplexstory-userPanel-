"use client"

import { useEffect, useState } from "react"
import { getTimeRemaining } from "@/lib/utils"
    
interface CountdownTimerProps {
  targetDate: string
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(targetDate)
      setTimeLeft(remaining)

      if (remaining.total <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (timeLeft.total <= 0) {
    return <span className="text-red-500 text-sm font-medium">Time expired</span>
  }

  return (
    <div className="flex gap-1 text-sm font-medium text-blue-600">
      <span>
        {timeLeft.days} {timeLeft.days === 1 ? "Day" : "Days"}
      </span>
      <span>:</span>
      <span>{timeLeft.hours.toString().padStart(2, "0")} Hrs</span>
      <span>:</span>
      <span>{timeLeft.minutes.toString().padStart(2, "0")} Min</span>
      <span>:</span>
      <span>{timeLeft.seconds.toString().padStart(2, "0")} Sec</span>
    </div>
  )
}
