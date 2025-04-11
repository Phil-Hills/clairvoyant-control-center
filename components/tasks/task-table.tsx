"use client"

import { useState } from "react"
import { format, formatDistanceToNow } from "date-fns"
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronRight,
  Cloud,
  Code,
  FileText,
  MoreHorizontal,
  RefreshCw,
  StopCircle,
  Terminal,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for tasks
const mockTasks = [
  {
    id: "task-1a2b3c",
    agentId: "agent-1",
    agentName: "Data Processor",
    status: "running",
    triggerType: "pubsub",
    startTime: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    duration: "2m 15s",
    payload: {
      source: "gs://data-bucket/incoming/file1.json",
      destination: "gs://processed-bucket/output/",
      options: {
        format: "parquet",
        compression: "snappy",
      },
    },
    logs: [
      { timestamp: new Date(Date.now() - 1000 * 60 * 2), level: "INFO", message: "Task started" },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 1.5),
        level: "INFO",
        message: "Processing file gs://data-bucket/incoming/file1.json",
      },
      { timestamp: new Date(Date.now() - 1000 * 60 * 1), level: "INFO", message: "Converted 50% of records" },
    ],
  },
  {
    id: "task-2d3e4f",
    agentId: "agent-2",
    agentName: "Content Analyzer",
    status: "success",
    triggerType: "manual",
    startTime: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    duration: "45s",
    payload: {
      content: "This is a sample text to analyze sentiment and extract entities.",
      options: {
        extractEntities: true,
        analyzeSentiment: true,
      },
    },
    logs: [
      { timestamp: new Date(Date.now() - 1000 * 60 * 15), level: "INFO", message: "Task started" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 14.8), level: "INFO", message: "Analyzing content" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 14.5), level: "INFO", message: "Extracted 3 entities" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 14.2), level: "INFO", message: "Sentiment analysis complete" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 14.1), level: "INFO", message: "Task completed successfully" },
    ],
  },
  {
    id: "task-3f4g5h",
    agentId: "agent-3",
    agentName: "Notification Service",
    status: "failed",
    triggerType: "scheduler",
    startTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    duration: "12s",
    payload: {
      recipients: ["user@example.com", "admin@example.com"],
      subject: "System Alert",
      body: "Disk usage has exceeded 80% threshold.",
    },
    logs: [
      { timestamp: new Date(Date.now() - 1000 * 60 * 30), level: "INFO", message: "Task started" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 29.9), level: "INFO", message: "Preparing email notification" },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 29.8),
        level: "ERROR",
        message: "Failed to connect to SMTP server",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 29.7),
        level: "ERROR",
        message: "Task failed: Connection timeout",
      },
    ],
    error: "Connection timeout when connecting to SMTP server smtp.example.com:587",
  },
  {
    id: "task-4h5i6j",
    agentId: "agent-4",
    agentName: "Log Analyzer",
    status: "retrying",
    triggerType: "pubsub",
    startTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    duration: "3m 20s",
    payload: {
      logSource: "gs://logs-bucket/app-logs/2023-04-11/",
      pattern: "ERROR|CRITICAL",
      outputFormat: "json",
    },
    logs: [
      { timestamp: new Date(Date.now() - 1000 * 60 * 5), level: "INFO", message: "Task started" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 4.5), level: "INFO", message: "Scanning log files" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 4), level: "WARNING", message: "Rate limit reached, backing off" },
      { timestamp: new Date(Date.now() - 1000 * 60 * 3), level: "INFO", message: "Retrying operation" },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        level: "WARNING",
        message: "Rate limit reached again, backing off",
      },
      { timestamp: new Date(Date.now() - 1000 * 60 * 1), level: "INFO", message: "Retrying operation" },
    ],
  },
  {
    id: "task-5i6j7k",
    agentId: "agent-5",
    agentName: "Sentiment Analyzer",
    status: "queued",
    triggerType: "manual",
    startTime: new Date(Date.now() - 1000 * 30), // 30 seconds ago
    duration: "0s",
    payload: {
      text: "I absolutely love the new features in this product! The interface is intuitive and responsive.",
      language: "en",
      features: ["sentiment", "entities", "syntax"],
    },
    logs: [{ timestamp: new Date(Date.now() - 1000 * 30), level: "INFO", message: "Task queued" }],
  },
]

type TaskStatus = "running" | "success" | "failed" | "retrying" | "queued"
type TriggerType = "pubsub" | "manual" | "scheduler"

interface TaskTableProps {
  filterStatus: TaskStatus | null
}

export function TaskTable({ filterStatus }: TaskTableProps) {
  const { toast } = useToast()
  const [expandedTasks, setExpandedTasks] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Filter tasks based on status if filterStatus is provided
  const filteredTasks = filterStatus ? mockTasks.filter((task) => task.status === filterStatus) : mockTasks

  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const handleRetryTask = (taskId: string) => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Task Retry Initiated",
        description: `Task ${taskId} has been queued for retry.`,
      })
    }, 1000)
  }

  const handleCancelTask = (taskId: string) => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Task Cancelled",
        description: `Task ${taskId} has been cancelled.`,
        variant: "destructive",
      })
    }, 1000)
  }

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "running":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            Running
          </Badge>
        )
      case "success":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-green-500" />
            Success
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-red-500" />
            Failed
          </Badge>
        )
      case "retrying":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
            Retrying
          </Badge>
        )
      case "queued":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-purple-500" />
            Queued
          </Badge>
        )
      default:
        return null
    }
  }

  const getTriggerBadge = (triggerType: TriggerType) => {
    switch (triggerType) {
      case "manual":
        return (
          <Badge variant="outline" className="bg-slate-500/10 text-slate-500 border-slate-500/20">
            Manual
          </Badge>
        )
      case "scheduler":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            <Calendar className="mr-1 h-3 w-3" />
            Scheduler
          </Badge>
        )
      case "pubsub":
        return (
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
            <Cloud className="mr-1 h-3 w-3" />
            Pub/Sub
          </Badge>
        )
      default:
        return null
    }
  }

  // Function to render the task details when expanded
  const renderTaskDetails = (task: (typeof mockTasks)[0]) => {
    return (
      <div className="px-4 py-3 bg-muted/30 rounded-b-md border-t">
        <Tabs defaultValue="payload" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="payload">
              <Code className="h-4 w-4 mr-1" />
              Payload
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Terminal className="h-4 w-4 mr-1" />
              Logs
            </TabsTrigger>
            {task.error && (
              <TabsTrigger value="error">
                <AlertCircle className="h-4 w-4 mr-1" />
                Error
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="payload" className="mt-0">
            <div className="bg-muted p-3 rounded-md overflow-auto max-h-64">
              <pre className="text-xs">{JSON.stringify(task.payload, null, 2)}</pre>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="mt-0">
            <div className="bg-muted p-3 rounded-md overflow-auto max-h-64">
              {task.logs.map((log, index) => (
                <div key={index} className="mb-1 text-xs">
                  <span className="text-muted-foreground">{format(log.timestamp, "HH:mm:ss")}</span>
                  <span
                    className={`ml-2 ${
                      log.level === "ERROR"
                        ? "text-red-500"
                        : log.level === "WARNING"
                          ? "text-amber-500"
                          : "text-foreground"
                    }`}
                  >
                    [{log.level}]
                  </span>
                  <span className="ml-2">{log.message}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          {task.error && (
            <TabsContent value="error" className="mt-0">
              <div className="bg-red-500/10 text-red-500 p-3 rounded-md overflow-auto max-h-64">
                <pre className="text-xs">{task.error}</pre>
              </div>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end mt-4 gap-2">
          {(task.status === "failed" || task.status === "retrying") && (
            <Button variant="outline" size="sm" onClick={() => handleRetryTask(task.id)} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Task
            </Button>
          )}

          {(task.status === "running" || task.status === "queued" || task.status === "retrying") && (
            <Button variant="outline" size="sm" onClick={() => handleCancelTask(task.id)} disabled={loading}>
              <StopCircle className="mr-2 h-4 w-4" />
              Cancel Task
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Mobile card view for tasks
  const renderMobileTaskCard = (task: (typeof mockTasks)[0]) => {
    const isExpanded = expandedTasks.includes(task.id)

    return (
      <div key={task.id} className="mb-4 border rounded-md overflow-hidden">
        <div
          className="p-4 cursor-pointer flex items-center justify-between"
          onClick={() => toggleTaskExpanded(task.id)}
        >
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-medium">{task.agentName}</span>
              <span className="text-xs text-muted-foreground ml-2">#{task.id}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {getStatusBadge(task.status as TaskStatus)}
              {getTriggerBadge(task.triggerType as TriggerType)}
            </div>
            <div className="text-xs text-muted-foreground">
              Started {formatDistanceToNow(task.startTime, { addSuffix: true })}
              {task.duration !== "0s" && ` • Duration: ${task.duration}`}
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

        {isExpanded && renderTaskDetails(task)}
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
              <TableHead>Task ID</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
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
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <>
                  <TableRow key={task.id} className={expandedTasks.includes(task.id) ? "border-b-0" : ""}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleTaskExpanded(task.id)}
                      >
                        {expandedTasks.includes(task.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{task.id}</TableCell>
                    <TableCell>{task.agentName}</TableCell>
                    <TableCell>{getStatusBadge(task.status as TaskStatus)}</TableCell>
                    <TableCell>{getTriggerBadge(task.triggerType as TriggerType)}</TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1 text-muted-foreground text-xs">
                          {formatDistanceToNow(task.startTime, { addSuffix: true })}
                        </TooltipTrigger>
                        <TooltipContent>{format(task.startTime, "PPpp")}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{task.duration}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View Details</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toggleTaskExpanded(task.id)}>
                              {expandedTasks.includes(task.id) ? "Hide Details" : "View Details"}
                            </DropdownMenuItem>
                            {(task.status === "failed" || task.status === "retrying") && (
                              <DropdownMenuItem onClick={() => handleRetryTask(task.id)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Retry Task
                              </DropdownMenuItem>
                            )}
                            {(task.status === "running" || task.status === "queued" || task.status === "retrying") && (
                              <DropdownMenuItem onClick={() => handleCancelTask(task.id)}>
                                <StopCircle className="mr-2 h-4 w-4" />
                                Cancel Task
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedTasks.includes(task.id) && (
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={8} className="p-0">
                        {renderTaskDetails(task)}
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
        {loading ? (
          // Loading skeleton for mobile
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-md p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : filteredTasks.length === 0 ? (
          <div className="text-center p-8 border rounded-md">No tasks found.</div>
        ) : (
          filteredTasks.map((task) => renderMobileTaskCard(task))
        )}
      </div>
    </TooltipProvider>
  )
}
