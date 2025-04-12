"use client"

import { useState } from "react"
import { Calendar, ExternalLink, CheckCircle, XCircle, Clock } from "lucide-react"
import { ResourceCard } from "@/components/gcp-resources/resource-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { format, formatDistanceToNow } from "date-fns"

// Mock data for Cloud Scheduler
const mockSchedules = [
  {
    id: "schedule-1",
    name: "daily-data-processing",
    description: "Process daily data batch",
    schedule: "0 0 * * *",
    timeZone: "America/Los_Angeles",
    target: {
      type: "http",
      uri: "https://us-central1-project-id.cloudfunctions.net/data-processor-function",
    },
    agent: "Data Processor",
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    nextRun: new Date(Date.now() + 1000 * 60 * 60 * 16), // 16 hours from now
    lastStatus: "succeeded",
  },
  {
    id: "schedule-2",
    name: "hourly-log-analysis",
    description: "Analyze logs every hour",
    schedule: "0 * * * *",
    timeZone: "UTC",
    target: {
      type: "http",
      uri: "https://us-central1-project-id.cloudfunctions.net/log-analyzer-function",
    },
    agent: "Log Analyzer",
    lastRun: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    nextRun: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes from now
    lastStatus: "succeeded",
  },
  {
    id: "schedule-3",
    name: "weekly-report-generation",
    description: "Generate weekly summary reports",
    schedule: "0 9 * * MON",
    timeZone: "America/New_York",
    target: {
      type: "pubsub",
      topic: "projects/project-id/topics/report-generation",
    },
    agent: "Content Analyzer",
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    nextRun: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4), // 4 days from now
    lastStatus: "succeeded",
  },
  {
    id: "schedule-4",
    name: "daily-notifications",
    description: "Send daily notification digest",
    schedule: "0 17 * * *",
    timeZone: "Europe/London",
    target: {
      type: "http",
      uri: "https://us-central1-project-id.cloudfunctions.net/notification-service-function",
    },
    agent: "Notification Service",
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    nextRun: new Date(Date.now() + 1000 * 60 * 60 * 20), // 20 hours from now
    lastStatus: "failed",
  },
  {
    id: "schedule-5",
    name: "sentiment-analysis-batch",
    description: "Run sentiment analysis on new content",
    schedule: "*/30 * * * *",
    timeZone: "UTC",
    target: {
      type: "http",
      uri: "https://us-central1-project-id.cloudfunctions.net/sentiment-analyzer-function",
    },
    agent: "Sentiment Analyzer",
    lastRun: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    nextRun: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes from now
    lastStatus: "skipped",
  },
]

export function CloudSchedulerSection() {
  const [loading, setLoading] = useState(false)

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Succeeded
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      case "skipped":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Skipped
          </Badge>
        )
      default:
        return null
    }
  }

  // Mobile card view for schedules
  const renderMobileScheduleCard = (schedule: (typeof mockSchedules)[0]) => {
    return (
      <div key={schedule.id} className="mb-4 border rounded-md overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">{schedule.name}</div>
            {getStatusBadge(schedule.lastStatus)}
          </div>

          <div className="text-xs text-muted-foreground mb-1">{schedule.description}</div>

          <div className="text-sm font-mono bg-muted/50 px-2 py-1 rounded mb-3 inline-block">{schedule.schedule}</div>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Agent:</span>
              <span>{schedule.agent}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last run:</span>
              <span>{formatDistanceToNow(schedule.lastRun, { addSuffix: true })}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Next run:</span>
              <span>{formatDistanceToNow(schedule.nextRun, { addSuffix: true })}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time zone:</span>
              <span>{schedule.timeZone}</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mb-1">Target:</div>
          <div className="text-xs font-mono bg-muted/50 px-2 py-1 rounded mb-3 truncate">
            {schedule.target.type}: {schedule.target.uri || schedule.target.topic}
          </div>

          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">View in GCP Console</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <ResourceCard
        title="Cloud Scheduler"
        description="Scheduled jobs and execution status"
        icon={<Calendar className="h-5 w-5" />}
      >
        {/* Desktop view */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Name</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? // Loading skeleton
                  Array.from({ length: 4 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : mockSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-medium cursor-default">{schedule.name}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{schedule.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Target: {schedule.target.type === "http" ? schedule.target.uri : schedule.target.topic}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                          {schedule.schedule}
                        </code>
                        <div className="text-xs text-muted-foreground mt-1">{schedule.timeZone}</div>
                      </TableCell>
                      <TableCell>{schedule.agent}</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm cursor-default">
                              {formatDistanceToNow(schedule.lastRun, { addSuffix: true })}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{format(schedule.lastRun, "PPpp")}</TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm cursor-default">
                              {formatDistanceToNow(schedule.nextRun, { addSuffix: true })}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{format(schedule.nextRun, "PPpp")}</TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{getStatusBadge(schedule.lastStatus)}</TableCell>
                      <TableCell className="text-right">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View in GCP Console</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View in GCP Console</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view */}
        <div className="md:hidden space-y-4">
          {loading
            ? // Loading skeleton for mobile
              Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="border rounded-md p-4 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))
            : mockSchedules.map(renderMobileScheduleCard)}
        </div>
      </ResourceCard>
    </TooltipProvider>
  )
}
