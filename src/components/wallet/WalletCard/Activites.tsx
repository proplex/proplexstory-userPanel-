import { cn }from '@/lib/utils'
import { Card, CardTitle, CardHeader, CardContent  } from '@/components/ui/card'
import { Info, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

const Activites = (asset: any) => {
  return (
    <div>
       <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-base">Asset Activities</CardTitle>
                <p className="text-sm text-gray-500">Recent updates for this property</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {asset.activities && asset.activities.length > 0 ? (
                  asset.activities.slice(0, 3).map((activity: any) => (
                    <div key={activity.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-start gap-2">
                        <div
                          className={cn(
                            "mt-1 rounded-full p-1",
                            activity.type === "Dividend"
                              ? "bg-green-100 text-green-600"
                              : activity.type === "VoteRequired"
                                ? "bg-amber-100 text-amber-600"
                                : activity.type === "NewTenant"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-purple-100 text-purple-600",
                          )}
                        >
                          <Info className="h-3 w-3" />
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center gap-1">
                            {activity.title}
                            {activity.isNew && <span className="inline-flex h-2 w-2 rounded-full bg-blue-500"></span>}
                          </h4>
                          <p className="text-xs text-gray-500">{activity.date}</p>

                          <div className="mt-2">
                            <p className="text-sm">{activity.description}</p>

                            {activity.amount && (
                              <p className="mt-1 text-sm font-medium text-green-600">
                                +₹{activity.amount.toLocaleString()}
                              </p>
                            )}

                            {activity.type === "VoteRequired" && (
                              <div className="mt-3">
                                <Button size="sm" className="w-full">
                                  Cast your vote
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No recent activities</p>
                  </div>
                )}

                {/* {asset.upcomingEvents && asset.upcomingEvents.length > 0 && (
                  <UpcomingEvents />
                )} */}
{/* 
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1">
                  <span>View All Activities</span>
                  <ChevronRight className="h-4 w-4" />
                </Button> */}
              </CardContent>
            </Card>
    </div>
  )
}

export default Activites
 