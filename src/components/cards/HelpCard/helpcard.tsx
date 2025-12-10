import { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"

interface HelpCardProps {
  icon: string // Changed from SVGAElement to string
  title: string
  description: string
  href: string
}

export function HelpCard({ icon, title, description, href }: HelpCardProps) {
  return (
    <Link
      href={href}
      className="block p-4 bg-white rounded-lg border border-gray-200"
    >
      <div className="flex items-center  gap-4">
        <div className="text-[#8968ff] flex-shrink-0">
          <Image
            width={40}
            height={40}
            src={icon}
            alt={`${title} icon`}
            className="object-contain"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#1a1b1d] mb-2">{title}</h3>
          <p className="text-[#6a7381]">{description}</p>
        </div>
      </div>
    </Link>
  )
}

