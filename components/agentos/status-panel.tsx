"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { BellRing, Bot, CheckCircle2, Clock, RefreshCw, Wifi, Activity, AlertTriangle, Cloud } from "lucide-react"
import { useState, useEffect } from "react"
import { useNotificationService } from "@/lib/notification-service"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export function StatusPanel() {
  const [liveLogsEnabled, setLiveLogsEnabled] = useState(false)
  const { notifications } = useNotificationService()
  const [lastRefreshed, setLastRefreshed] = useState(new Date())
  const projectId = process.env.PROJECT_ID || "clairvoyant-project"

  // Filter notifications to get recent actions
  const recentActions = notifications.filter((n) => n.type === "success" || n.type === "error").slice(0, 3)

  const handleRefresh = () => {
    setLastRefreshed(new Date())
  }

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Status Panel</h2>
          <Button variant="ghost" size="icon" title="Refresh status" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Project Information */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Cloud className="mr-2 h-4 w-4 text-primary" />
              GCP Project
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                  <span className="text-sm font-medium">{projectId}</span>
                </div>
                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                  Active
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">Region: us-central1 • Billing enabled • 12 resources</div>
            </div>
          </CardContent>
        </Card>

        {/* Deployed Agents */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Bot className="mr-2 h-4 w-4 text-primary" />
              Active Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                  <span className="text-sm">HealthMonitor</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  us-central1
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                  <span className="text-sm">DataProcessor</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  us-east1
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mr-2" />
                  <span className="text-sm">NotificationService</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  us-west1
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              Active Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Image Processing</span>
                <Badge variant="outline" className="text-xs">
                  Running
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Backup</span>
                <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">
                  Queued
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Actions */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="mr-2 h-4 w-4 text-primary" />
              Recent Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-3">
            <div className="space-y-3 text-sm">
              {recentActions.length > 0 ? (
                recentActions.map((action) => (
                  <div
                    key={action.id}
                    className={cn(
                      "border-l-2 pl-3 py-1",
                      action.type === "success" ? "border-green-500" : "border-red-500",
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center mb-1",
                        action.type === "success" ? "text-green-500" : "text-red-500",
                      )}
                    >
                      {action.type === "success" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                      )}
                      <span className="font-medium">{action.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(action.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="border-l-2 border-blue-500 pl-3 py-1">
                  <div className="flex items-center text-blue-500 mb-1">
                    <Wifi className="h-3.5 w-3.5 mr-1" />
                    <span className="font-medium">System initialized</span>
                  </div>
                  <span className="text-xs text-muted-foreground">just now</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live Logs Toggle */}
        <div className="flex items-center space-x-2 pt-2">
          <Switch id="live-logs" checked={liveLogsEnabled} onCheckedChange={setLiveLogsEnabled} />
          <Label htmlFor="live-logs" className="text-sm cursor-pointer">
            Enable Live Logs
          </Label>
        </div>

        {/* Notification Topic Status */}
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <BellRing className="mr-2 h-4 w-4 text-primary" />
              Notification Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 pb-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                  <span className="text-sm">{process.env.NOTIFICATION_TOPIC || "default-topic"}</span>
                </div>
                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                  Active
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Last message received: {lastRefreshed.toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground text-center pt-2">
          Last refreshed: {lastRefreshed.toLocaleTimeString()}
        </div>
      </div>
    </ScrollArea>
  )
}
