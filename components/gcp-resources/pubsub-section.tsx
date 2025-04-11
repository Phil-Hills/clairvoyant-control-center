"use client"

import { TableRow } from "@/components/ui/table"

import { useState } from "react"
import { MessageSquare, ExternalLink, AlertTriangle } from "lucide-react"
import { ResourceCard } from "@/components/gcp-resources/resource-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for Pub/Sub
const mockPubSubTopics = [
  {
    id: "topic-1",
    name: "agent-tasks",
    subscriptions: [
      { name: "agent-tasks-sub", type: "push" },
      { name: "agent-tasks-analytics", type: "pull" },
    ],
    throughput: {
      messagesPerSecond: 42.5,
      trend: "increasing",
    },
    queueDepth: 12,
    hasDeadLetterQueue: false,
    autoScaling: true,
    region: "us-central1",
  },
  {
    id: "topic-2",
    name: "data-processing-events",
    subscriptions: [{ name: "data-processor-sub", type: "pull" }],
    throughput: {
      messagesPerSecond: 18.3,
      trend: "stable",
    },
    queueDepth: 5,
    hasDeadLetterQueue: false,
    autoScaling: true,
    region: "us-central1",
  },
  {
    id: "topic-3",
    name: "notification-events",
    subscriptions: [
      { name: "email-notifications", type: "push" },
      { name: "sms-notifications", type: "push" },
      { name: "analytics-notifications", type: "pull" },
    ],
    throughput: {
      messagesPerSecond: 8.7,
      trend: "decreasing",
    },
    queueDepth: 0,
    hasDeadLetterQueue: false,
    autoScaling: false,
    region: "us-central1",
  },
  {
    id: "topic-4",
    name: "error-events",
    subscriptions: [
      { name: "error-handler", type: "pull" },
      { name: "error-analytics", type: "pull" },
    ],
    throughput: {
      messagesPerSecond: 3.2,
      trend: "increasing",
    },
    queueDepth: 156,
    hasDeadLetterQueue: true,
    autoScaling: false,
    region: "us-west1",
  },
]

export function PubSubSection() {
  const [loading, setLoading] = useState(false)

  // Function to get trend badge
  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case "increasing":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            ↑ Increasing
          </Badge>
        )
      case "decreasing":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            ↓ Decreasing
          </Badge>
        )
      case "stable":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            ↔ Stable
          </Badge>
        )
      default:
        return null
    }
  }

  // Mobile card view for Pub/Sub topics
  const renderMobileTopicCard = (topic: (typeof mockPubSubTopics)[0]) => {
    return (
      <div key={topic.id} className="mb-4 border rounded-md overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium truncate max-w-[200px]">{topic.name}</div>
            {getTrendBadge(topic.throughput.trend)}
          </div>

          <div className="text-xs text-muted-foreground mb-3">
            Region: {topic.region} | Subscriptions: {topic.subscriptions.length}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="border rounded-md p-2">
              <div className="text-xs text-muted-foreground">Messages/Second</div>
              <div className="text-lg font-semibold">{topic.throughput.messagesPerSecond}</div>
            </div>
            <div className="border rounded-md p-2">
              <div className="text-xs text-muted-foreground">Queue Depth</div>
              <div
                className={`text-lg font-semibold ${topic.queueDepth > 100 ? "text-red-500" : topic.queueDepth > 50 ? "text-yellow-500" : ""}`}
              >
                {topic.queueDepth}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {topic.subscriptions.map((sub) => (
              <Badge key={sub.name} variant="secondary" className="text-xs">
                {sub.name} ({sub.type})
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className={`${topic.autoScaling ? "text-green-500" : "text-muted-foreground"}`}>
              Auto-scaling: {topic.autoScaling ? "Enabled" : "Disabled"}
            </span>
            {topic.hasDeadLetterQueue && (
              <div className="flex items-center text-amber-500">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Dead Letter Queue
              </div>
            )}
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
        title="Pub/Sub"
        description="Message throughput and queue status"
        icon={<MessageSquare className="h-5 w-5" />}
      >
        {/* Desktop view */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic Name</TableHead>
                <TableHead>Subscriptions</TableHead>
                <TableHead>Messages/Second</TableHead>
                <TableHead>Queue Depth</TableHead>
                <TableHead>Auto-scaling</TableHead>
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
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : mockPubSubTopics.map((topic) => (
                    <TableRow key={topic.id}>
                      <TableCell>
                        <TooltipTrigger className="font-medium">{topic.name}</TooltipTrigger>
                        <TooltipContent>
                          <p>Region: {topic.region}</p>
                        </TooltipContent>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {topic.subscriptions.map((sub) => (
                            <Badge key={sub.name} variant="secondary" className="text-xs">
                              {sub.name} ({sub.type})
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{topic.throughput.messagesPerSecond}</span>
                          {getTrendBadge(topic.throughput.trend)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            topic.queueDepth > 100 ? "text-red-500" : topic.queueDepth > 50 ? "text-yellow-500" : ""
                          }
                        >
                          {topic.queueDepth}
                        </span>
                        {topic.hasDeadLetterQueue && (
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertTriangle className="h-4 w-4 text-amber-500 ml-2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Dead Letter Queue detected</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={topic.autoScaling ? "text-green-500" : "text-muted-foreground"}>
                          {topic.autoScaling ? "Enabled" : "Disabled"}
                        </span>
                      </TableCell>
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
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-40" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))
            : mockPubSubTopics.map(renderMobileTopicCard)}
        </div>
      </ResourceCard>
    </TooltipProvider>
  )
}
