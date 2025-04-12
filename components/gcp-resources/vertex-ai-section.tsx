"use client"

import { useState } from "react"
import { Brain, Info } from "lucide-react"
import { ResourceCard } from "@/components/gcp-resources/resource-card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Mock data for Vertex AI endpoints
const mockVertexEndpoints = [
  {
    id: "endpoint-1",
    name: "text-bison",
    displayName: "Text Bison",
    region: "us-central1",
    status: "healthy",
    quotaUsage: {
      tokens: 65,
      requestsPerMinute: 42,
    },
    activity: [
      { time: "12:00", requests: 24 },
      { time: "12:05", requests: 32 },
      { time: "12:10", requests: 28 },
      { time: "12:15", requests: 45 },
      { time: "12:20", requests: 52 },
      { time: "12:25", requests: 38 },
    ],
  },
  {
    id: "endpoint-2",
    name: "gemini-pro",
    displayName: "Gemini Pro",
    region: "us-west1",
    status: "healthy",
    quotaUsage: {
      tokens: 78,
      requestsPerMinute: 56,
    },
    activity: [
      { time: "12:00", requests: 42 },
      { time: "12:05", requests: 48 },
      { time: "12:10", requests: 52 },
      { time: "12:15", requests: 60 },
      { time: "12:20", requests: 58 },
      { time: "12:25", requests: 62 },
    ],
  },
  {
    id: "endpoint-3",
    name: "text-embedding",
    displayName: "Text Embedding",
    region: "europe-west4",
    status: "degraded",
    quotaUsage: {
      tokens: 92,
      requestsPerMinute: 78,
    },
    activity: [
      { time: "12:00", requests: 65 },
      { time: "12:05", requests: 72 },
      { time: "12:10", requests: 68 },
      { time: "12:15", requests: 45 },
      { time: "12:20", requests: 38 },
      { time: "12:25", requests: 42 },
    ],
  },
  {
    id: "endpoint-4",
    name: "image-generator",
    displayName: "Image Generator",
    region: "us-east4",
    status: "unavailable",
    quotaUsage: {
      tokens: 0,
      requestsPerMinute: 0,
    },
    activity: [
      { time: "12:00", requests: 28 },
      { time: "12:05", requests: 32 },
      { time: "12:10", requests: 18 },
      { time: "12:15", requests: 5 },
      { time: "12:20", requests: 0 },
      { time: "12:25", requests: 0 },
    ],
  },
]

export function VertexAISection() {
  const [loading, setLoading] = useState(false)

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-green-500" />
            Healthy
          </Badge>
        )
      case "degraded":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-yellow-500" />
            Degraded
          </Badge>
        )
      case "unavailable":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-red-500" />
            Unavailable
          </Badge>
        )
      default:
        return null
    }
  }

  // Mobile card view for endpoints
  const renderMobileEndpointCard = (endpoint: (typeof mockVertexEndpoints)[0]) => {
    return (
      <div key={endpoint.id} className="mb-4 border rounded-md overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">{endpoint.displayName}</div>
            {getStatusBadge(endpoint.status)}
          </div>

          <div className="text-xs text-muted-foreground mb-3">Region: {endpoint.region}</div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Token Usage</span>
                <span className="text-sm font-medium">{endpoint.quotaUsage.tokens}%</span>
              </div>
              <Progress value={endpoint.quotaUsage.tokens} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Requests/Min</span>
                <span className="text-sm font-medium">{endpoint.quotaUsage.requestsPerMinute}%</span>
              </div>
              <Progress value={endpoint.quotaUsage.requestsPerMinute} className="h-2" />
            </div>
          </div>

          <div className="mt-4 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={endpoint.activity}>
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Bar
                  dataKey="requests"
                  fill={
                    endpoint.status === "healthy"
                      ? "hsl(var(--primary))"
                      : endpoint.status === "degraded"
                        ? "hsl(var(--warning))"
                        : "hsl(var(--destructive))"
                  }
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <ResourceCard
        title="Vertex AI"
        description="Model endpoints and inference activity"
        icon={<Brain className="h-5 w-5" />}
      >
        {/* Desktop view */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Endpoint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Token Usage</TableHead>
                <TableHead>Requests/Min</TableHead>
                <TableHead>Recent Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? // Loading skeleton
                  Array.from({ length: 4 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : mockVertexEndpoints.map((endpoint) => (
                    <TableRow key={endpoint.id}>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center gap-1 cursor-default">
                              {endpoint.displayName}
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Model: {endpoint.name}</p>
                            <p>Region: {endpoint.region}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{getStatusBadge(endpoint.status)}</TableCell>
                      <TableCell>
                        <div className="w-full max-w-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Tokens</span>
                            <span className="text-xs font-medium">{endpoint.quotaUsage.tokens}%</span>
                          </div>
                          <Progress value={endpoint.quotaUsage.tokens} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-full max-w-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Requests</span>
                            <span className="text-xs font-medium">{endpoint.quotaUsage.requestsPerMinute}%</span>
                          </div>
                          <Progress value={endpoint.quotaUsage.requestsPerMinute} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-10 w-32">
                          <ChartContainer
                            config={{
                              requests: {
                                label: "Requests",
                                color:
                                  endpoint.status === "healthy"
                                    ? "hsl(var(--primary))"
                                    : endpoint.status === "degraded"
                                      ? "hsl(var(--warning))"
                                      : "hsl(var(--destructive))",
                              },
                            }}
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={endpoint.activity}>
                                <Bar dataKey="requests" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
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
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ))
            : mockVertexEndpoints.map(renderMobileEndpointCard)}
        </div>
      </ResourceCard>
    </TooltipProvider>
  )
}
