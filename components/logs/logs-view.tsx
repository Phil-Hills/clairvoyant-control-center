"use client"

import { useState, useEffect, useRef } from "react"
import { LogsTable } from "@/components/logs/logs-table"
import { LogDetailDrawer } from "@/components/logs/log-detail-drawer"
import { useToast } from "@/hooks/use-toast"

// Mock log data
import { mockLogs } from "@/lib/mock-logs"

export type LogEntry = {
  id: string
  timestamp: Date
  agentId: string
  agentName: string
  severity: "info" | "warning" | "error" | "critical"
  message: string
  source: string
  taskId?: string
  metadata?: any
  tags?: string[]
}

export function LogsView() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(mockLogs)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isLiveStream, setIsLiveStream] = useState(false)
  const [newLogsCount, setNewLogsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Function to simulate fetching new logs
  const fetchNewLogs = () => {
    // In a real implementation, this would be an API call
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      agentId: ["agent-1", "agent-2", "agent-3", "agent-4", "agent-5"][Math.floor(Math.random() * 5)],
      agentName: ["Data Processor", "Content Analyzer", "Notification Service", "Log Analyzer", "Sentiment Analyzer"][
        Math.floor(Math.random() * 5)
      ],
      severity: ["info", "warning", "error", "critical"][Math.floor(Math.random() * 4)] as LogEntry["severity"],
      message: `New log message generated at ${new Date().toISOString()}`,
      source: ["cloud-function", "pubsub", "vertex-ai", "scheduler"][Math.floor(Math.random() * 4)],
      taskId: Math.random() > 0.5 ? `task-${Math.floor(Math.random() * 1000)}` : undefined,
      metadata: {
        requestId: `req-${Math.floor(Math.random() * 10000)}`,
        duration: `${Math.floor(Math.random() * 1000)}ms`,
        status: Math.random() > 0.3 ? "success" : "failure",
      },
      tags: ["generated", "live-stream"],
    }

    setLogs((prevLogs) => [newLog, ...prevLogs])
    setNewLogsCount((prev) => prev + 1)
  }

  // Effect to handle live streaming
  useEffect(() => {
    if (isLiveStream) {
      // Start streaming
      streamIntervalRef.current = setInterval(fetchNewLogs, 5000)

      // Show toast notification
      toast({
        title: "Live Stream Active",
        description: "Logs will update every 5 seconds",
      })
    } else {
      // Stop streaming
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current)
        streamIntervalRef.current = null
      }
    }

    // Cleanup on unmount
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current)
      }
    }
  }, [isLiveStream, toast])

  // Handle log selection
  const handleLogSelect = (log: LogEntry) => {
    setSelectedLog(log)
    setIsDetailOpen(true)
  }

  // Reset new logs counter
  const resetNewLogsCount = () => {
    setNewLogsCount(0)
  }

  return (
    <div className="relative">
      <LogsTable
        logs={logs}
        onLogSelect={handleLogSelect}
        isLoading={isLoading}
        newLogsCount={newLogsCount}
        onNewLogsReset={resetNewLogsCount}
      />

      {isLiveStream && newLogsCount > 0 && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg animate-pulse">
          Streaming {newLogsCount} new log{newLogsCount !== 1 ? "s" : ""}
        </div>
      )}

      <LogDetailDrawer log={selectedLog} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
    </div>
  )
}
