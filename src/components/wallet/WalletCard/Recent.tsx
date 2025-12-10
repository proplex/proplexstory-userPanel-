import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Activity } from "lucide-react"

interface ActivityItem {
  id: string
  title: string
  amount: string
  time: string
  color: string
}

interface RecentActivitiesProps {
  activities?: ActivityItem[]
}

export function RecentActivities({ activities = [] }: RecentActivitiesProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-base font-medium">Recent Activities</CardTitle>
          </div>
          <Button variant="link" className="h-auto p-0 text-blue-600 hover:text-blue-700">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className="w-1.5 h-full min-h-[40px] rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: activity.color }}
                />
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm font-medium" style={{ color: activity.color }}>
                    {activity.amount}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Activity className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No recent activities</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
