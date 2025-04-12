"use client"

import { useState, useEffect, useCallback } from "react"
import { LogsTable } from "@/components/logs/logs-table"
import { LogDetailDrawer } from "@/components/logs/log-detail-drawer"
import { useToast } from "@/hooks/use-toast"
import { mockLogs } from "@/lib/mock-logs"

// Define the LogEntry type
export interface LogEntry {
  id: string
  timestamp: Date
  agentId: string
  agentName: string
  severity: "info" | "warning" | "error" | "critical"
  message: string
  source: string
  taskId?: string
  metadata?: Record<string, any>
  tags?: string[]
}

export function LogsView() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [liveStream, setLiveStream] = useState(false)
  const [newLogsCount, setNewLogsCount] = useState(0)

  // Function to fetch logs
  const fetchLogs = useCallback(async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate network delay
      setLogs(mockLogs)
    } catch (error) {
      console.error("Error fetching logs:", error)
      toast({
        title: "Error fetching logs",
        description: "There was a problem retrieving the logs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Function to simulate new logs coming in
  const simulateNewLogs = useCallback(() => {
    if (!liveStream) return

    // Create 1-3 new logs
    const count = Math.floor(Math.random() * 3) + 1
    const newLogs: LogEntry[] = Array.from({ length: count }).map((_, index) => {
      const severity = ["info", "warning", "error", "critical"][Math.floor(Math.random() * 4)] as LogEntry["severity"]
      const agentId = `agent-${Math.floor(Math.random() * 5) + 1}`
      const agentNames = {
        "agent-1": "Data Processor",
        "agent-2": "Content Analyzer",
        "agent-3": "Notification Service",
        "agent-4": "Log Analyzer",
        "agent-5": "Sentiment Analyzer",
      }
      const agentName = agentNames[agentId as keyof typeof agentNames]

      return {
        id: `log-${Date.now()}-${index}`,
        timestamp: new Date(),
        agentId,
        agentName,
        severity,
        message: `New ${severity} log message from ${agentName} at ${new Date().toISOString()}`,
        source: ["cloud-function", "vertex-ai", "pubsub", "scheduler"][Math.floor(Math.random() * 4)],
        taskId: Math.random() > 0.5 ? `task-${Math.random().toString(36).substring(2, 8)}` : undefined,
        metadata: {
          timestamp: new Date().toISOString(),
          region: "us-central1",
          eventId: Math.random().toString(36).substring(2, 15),
        },
        tags: ["live-stream", severity],
      }
    })

    setLogs((prevLogs) => [...newLogs, ...prevLogs])
    setNewLogsCount((prev) => prev + count)
  }, [liveStream])

  // Initial fetch
  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Set up live stream interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (liveStream) {
      interval = setInterval(simulateNewLogs, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [liveStream, simulateNewLogs])

  // Handle log selection
  const handleLogSelect = (log: LogEntry) => {
    setSelectedLog(log)
    setIsDetailOpen(true)
  }

  // Reset new logs count
  const resetNewLogsCount = () => {
    setNewLogsCount(0)
  }

  return (
    <div className="space-y-4">
      <LogsTable
        logs={logs}
        onLogSelect={handleLogSelect}
        isLoading={isLoading}
        newLogsCount={newLogsCount}
        onNewLogsReset={resetNewLogsCount}
      />

      {logs.length === 0 && !isLoading && (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">No logs found. Try adjusting your filters or refreshing.</p>
        </div>
      )}

      <LogDetailDrawer log={selectedLog} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
    </div>
  )
}
