import { Check, Clock } from "lucide-react"
import Success from "../../../../public/lottie-animations/Success.json";
import LottieAnimation from "@/components/animation/LottieAnimation";
import Failure from "../../../../public/lottie-animations/Failure.json";
import clock from "../../../../public/lottie-animations/clock1.json";
import clock2 from "../../../../public/lottie-animations/pending.json";
import clock3 from "../../../../public/lottie-animations/current.json";
import Link from "next/link";
interface TimelineItemProps {
  title: string
  description: string
  status: "completed" | "current" | "pending"
  isLast?: boolean
  timestamp?: string
  deadline?: { days: number; hours: number }
  isDocument?: string 
}

export const TimelineItem = ({ title, description, status, isLast, timestamp, deadline, isDocument  }: TimelineItemProps) => {
  // const iconColor = {
  //   completed: "bg-[#52c1b9]",
  //   current: "bg-[#725aec]",
  //   pending: "bg-[#eef1f6]",
  // }[status]

  // const textColor = {
  //   completed: "text-white",
  //   current: "text-white",
  //   pending: "text-[#6a7381]",
  // }[status]
 


  const Icon = () => {
    if (status === "completed") {
      return (
        <div className="relative z-10 size-14 flex items-center justify-center">
          <LottieAnimation
            animationData={Success}
            style={{ width: '100%', height: '100%', zIndex: 20}}
          />
        </div>
      )
    }
    if (status === "current") {
      
      return (
        <div className="relative z-10  size-14 flex items-center justify-center">
          <LottieAnimation
            animationData={clock3}
            style={{ width: '100%', height: '100%', zIndex: 20}}
          />
        </div>
      )
    }
  
    return (
      <div className="relative z-10  size-12 left-1 flex items-center justify-center">
        <LottieAnimation
          animationData={clock}
          style={{ width: '100%', height: '100%', zIndex: 20}}
        />
      </div>
    )
  }

  return (
    <div className="relative">
      {!isLast && (
        <div className="absolute left-[28px] top-10 h-full w-[2px] border-l border-dashed border-[#6c7c99]" />
      )}
      <div className="flex items-center justify-start gap-4">
        <Icon />
        <div className="flex-1 ">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold ${status === "current" ? "text-[#725aec]" : ""}`}>{title}</h3>
           
          {
            isDocument && 
            title === "Document Signatures Required" && 
            status === "completed" && 
            <Link href={`${isDocument}`} className="text-sm text-[#6a7381]">View Document</Link>
          }

              {timestamp && <span className="text-sm text-[#6a7381]">{timestamp}</span>}
            {deadline && deadline.days > 0 && (
              <div className="flex gap-1 text-sm">
                <span className="bg-[#eef1f6] px-2 py-0.5 rounded">
                  {deadline.days.toString().padStart(2, "0")} <span className="text-[#6a7381]">Day</span>
                </span>
                <span className="bg-[#eef1f6] px-2 py-0.5 rounded">
                  {deadline.hours.toString().padStart(2, "0")} <span className="text-[#6a7381]">Hours</span>
                </span>
              </div>
            )}
          </div>
          <p className="text-sm text-[#6a7381]">{description}</p>
        </div>
      </div>
    </div>
  )
}

