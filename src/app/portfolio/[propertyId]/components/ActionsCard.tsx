"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ActionItem {
  id: number
  label: string
  labelColor: string
  title: string
  description: string
  actionText: string
  actionHref: string
  timeAgo?: string
}

const actions: ActionItem[] = [
  {
    id: 1,
    label: "Profile",
    labelColor: "bg-green-100 text-green-600",
    title: "Join Our Community",
    description: "Be part of our community and share your insights.",
    actionText: "Join",
    actionHref: "#",
  },
  {
    id: 2,
    label: "Profile",
    labelColor: "bg-red-100 text-red-600",
    title: "Manage Notifications",
    description: "Set your notification preferences",
    actionText: "Manage",
    actionHref: "#",
  },
  {
    id: 3,
    label: "Profile",
    labelColor: "bg-yellow-100 text-yellow-600",
    title: "Add Nominee",
    description: "Ensure asset transfer in case of emergency.",
    actionText: "Add",
    actionHref: "#",
  },
  {
    id: 4,
    label: "Governance",
    labelColor: "bg-blue-100 text-blue-600",
    title: "Voting Needed",
    description: "Proposal to upgrade parking area. Voting closes in 3 days.",
    actionText: "Cast Vote",
    actionHref: "#",
    timeAgo: "2 days ago",
  },
]

export default function ActionsCard() {
  return (
    <Card className="w-full rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-gray-800">Actions</h2>
        <Link
          href="#"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        {actions.map((action) => (
          <div
            key={action.id}
            className="rounded-xl border p-3 bg-white hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between mb-1">
              <Badge
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${action.labelColor}`}
                variant="secondary"
              >
                {action.label}
              </Badge>
              {action.timeAgo && (
                <span className="text-xs text-gray-400">{action.timeAgo}</span>
              )}
            </div>

            <h3 className="text-sm font-semibold text-gray-900">
              {action.title}
            </h3>
            <p className="text-xs text-gray-500">{action.description}</p>

            <Link
              href={action.actionHref}
              className="text-xs font-medium text-primary mt-1 inline-block hover:underline w-full text-right"
            >
              {action.actionText}
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
