"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ChevronRight, ChevronDown, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { LogEntry } from "@/components/logs/logs-view"
import { JsonViewer } from "@/components/logs/json-viewer"

interface LogsTableProps {
  logs: LogEntry[]
  onLogSelect: (log: LogEntry) => void
  isLoading: boolean
  newLogsCount: number
  onNewLogsReset: () => void
}

export function LogsTable({ logs, onLogSelect, isLoading, newLogsCount, onNewLogsReset }: LogsTableProps) {
  const [expandedLogs, setExpandedLogs] = useState<string[]>([])
  const [highlightedLogs, setHighlightedLogs] = useState<string[]>([])

  // Handle expanding/collapsing a log row
  const toggleLogExpanded = (logId: string) => {
    setExpandedLogs((prev) => (prev.includes(logId) ? prev.filter((id) => id !== logId) : [...prev, logId]))
  }

  // Highlight new logs with animation
  useEffect(() => {
    if (newLogsCount > 0) {
      const newLogIds = logs.slice(0, newLogsCount).map((log) => log.id)
      setHighlightedLogs(newLogIds)

      // Remove highlight after animation completes
      const timer = setTimeout(() => {
        setHighlightedLogs([])
        onNewLogsReset()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [newLogsCount, logs, onNewLogsReset])

  // Get severity badge based on log level
  const getSeverityBadge = (severity: LogEntry["severity"]) => {
    switch (severity) {
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            INFO
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            WARNING
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            ERROR
          </Badge>
        )
      case "critical":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            CRITICAL
          </Badge>
        )
      default:
        return null
    }
  }

  // Get source badge
  const getSourceBadge = (source: string) => {
    switch (source) {
      case "cloud-function":
        return (
          <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20">
            Cloud Function
          </Badge>
        )
      case "pubsub":
        return (
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
            Pub/Sub
          </Badge>
        )
      case "vertex-ai":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Vertex AI
          </Badge>
        )
      case "scheduler":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Scheduler
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            {source}
          </Badge>
        )
    }
  }

  // Render expanded log details
  const renderExpandedLogDetails = (log: LogEntry) => {
    return (
      <div className="px-4 py-3 bg-muted/30 rounded-b-md border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Log Details</h4>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground">Agent:</span>
                <span className="col-span-2">{log.agentName}</span>
              </div>
              {log.taskId && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-muted-foreground">Task ID:</span>
                  <span className="col-span-2 font-mono">{log.taskId}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground">Source:</span>
                <span className="col-span-2">{getSourceBadge(log.source)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground">Timestamp:</span>
                <span className="col-span-2">{format(log.timestamp, "PPpp")}</span>
              </div>
              {log.tags && log.tags.length > 0 && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-muted-foreground">Tags:</span>
                  <div className="col-span-2 flex flex-wrap gap-1">
                    {log.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {log.metadata && (
            <div>
              <JsonViewer data={log.metadata} title="Metadata" />
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onLogSelect(log)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Full Details
          </Button>
        </div>
      </div>
    )
  }

  // Mobile card view for logs
  const renderMobileLogCard = (log: LogEntry) => {
    const isExpanded = expandedLogs.includes(log.id)
    const isHighlighted = highlightedLogs.includes(log.id)

    return (
      <div
        key={log.id}
        className={`mb-4 border rounded-md overflow-hidden transition-colors ${
          isHighlighted ? "border-primary bg-primary/5" : ""
        }`}
      >
        <div className="p-4 cursor-pointer flex items-center justify-between" onClick={() => toggleLogExpanded(log.id)}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getSeverityBadge(log.severity)}
              <span className="text-xs text-muted-foreground">{format(log.timestamp, "HH:mm:ss")}</span>
            </div>
            <div className="font-medium">{log.agentName}</div>
            <div className="text-sm">{log.message}</div>
            <div className="flex items-center gap-2 mt-1">
              {getSourceBadge(log.source)}
              {log.taskId && <span className="text-xs text-muted-foreground font-mono">{log.taskId}</span>}
            </div>
          </div>
          <div>
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {isExpanded && renderExpandedLogDetails(log)}
      </div>
    )
  }

  return (
    <TooltipProvider>
      {/* Desktop view */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: "40px" }}></TableHead>
              <TableHead style={{ width: "160px" }}>Timestamp</TableHead>
              <TableHead style={{ width: "100px" }}>Severity</TableHead>
              <TableHead style={{ width: "150px" }}>Agent</TableHead>
              <TableHead>Message</TableHead>
              <TableHead style={{ width: "140px" }}>Source</TableHead>
              <TableHead style={{ width: "100px" }}>Task ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-6 w-6" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <>
                  <TableRow
                    key={log.id}
                    className={`${expandedLogs.includes(log.id) ? "border-b-0" : ""} ${
                      highlightedLogs.includes(log.id) ? "bg-primary/5 animate-highlight" : ""
                    }`}
                  >
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleLogExpanded(log.id)}>
                        {expandedLogs.includes(log.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger className="text-xs text-muted-foreground">
                          {format(log.timestamp, "HH:mm:ss")}
                        </TooltipTrigger>
                        <TooltipContent>{format(log.timestamp, "PPpp")}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                    <TableCell>{log.agentName}</TableCell>
                    <TableCell>
                      <div className="truncate max-w-md" title={log.message}>
                        {log.message}
                      </div>
                    </TableCell>
                    <TableCell>{getSourceBadge(log.source)}</TableCell>
                    <TableCell>
                      {log.taskId ? (
                        <span className="font-mono text-xs">{log.taskId}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedLogs.includes(log.id) && (
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={7} className="p-0">
                        {renderExpandedLogDetails(log)}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          // Loading skeleton for mobile
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-md p-4 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="text-center p-8 border rounded-md">No logs found.</div>
        ) : (
          logs.map((log) => renderMobileLogCard(log))
        )}
      </div>
    </TooltipProvider>
  )
}
