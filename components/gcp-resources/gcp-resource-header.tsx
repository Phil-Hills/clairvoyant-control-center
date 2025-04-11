"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function GcpResourceHeader() {
  const { toast } = useToast()
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Resources Refreshed",
        description: "GCP resource data has been updated.",
      })
    }, 1000)
  }

  const handleAutoRefreshChange = (checked: boolean) => {
    setAutoRefresh(checked)
    toast({
      title: checked ? "Auto-refresh enabled" : "Auto-refresh disabled",
      description: checked
        ? "Resource data will refresh every 30 seconds."
        : "Automatic resource updates have been disabled.",
    })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GCP Resource Monitor</h1>
          <p className="text-muted-foreground">
            Monitor the health, usage, and status of core Google Cloud services powering your agents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh All
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={handleAutoRefreshChange} />
        <Label htmlFor="auto-refresh">Auto-refresh every 30 seconds</Label>
      </div>
    </div>
  )
}
