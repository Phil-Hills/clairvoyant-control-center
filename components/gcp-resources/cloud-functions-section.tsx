"use client"

import { useState } from "react"
import { Code, ExternalLink } from "lucide-react"
import { ResourceCard } from "@/components/gcp-resources/resource-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for Cloud Functions
const mockCloudFunctions = [
  {
    id: "function-1",
    name: "data-processor-function",
    status: "active",
    invocations: 1245,
    errors: 12,
    errorRate: 0.96,
    memory: {
      allocated: 256,
      used: 187,
      usagePercent: 73,
    },
    cpu: {
      usagePercent: 42,
    },
    region: "us-central1",
    runtime: "nodejs18",
  },
  {
    id: "function-2",
    name: "content-analyzer-function",
    status: "active",
    invocations: 876,
    errors: 5,
    errorRate: 0.57,
    memory: {
      allocated: 512,
      used: 324,
      usagePercent: 63,
    },
    cpu: {
      usagePercent: 38,
    },
    region: "us-west1",
    runtime: "nodejs18",
  },
  {
    id: "function-3",
    name: "notification-service-function",
    status: "throttled",
    invocations: 2145,
    errors: 187,
    errorRate: 8.72,
    memory: {
      allocated: 128,
      used: 118,
      usagePercent: 92,
    },
    cpu: {
      usagePercent: 85,
    },
    region: "us-east4",
    runtime: "nodejs18",
  },
  {
    id: "function-4",
    name: "log-analyzer-function",
    status: "crashed",
    invocations: 345,
    errors: 345,
    errorRate: 100,
    memory: {
      allocated: 256,
      used: 0,
      usagePercent: 0,
    },
    cpu: {
      usagePercent: 0,
    },
    region: "europe-west1",
    runtime: "nodejs18",
  },
  {
    id: "function-5",
    name: "sentiment-analyzer-function",
    status: "active",
    invocations: 1567,
    errors: 23,
    errorRate: 1.47,
    memory: {
      allocated: 1024,
      used: 756,
      usagePercent: 74,
    },
    cpu: {
      usagePercent: 56,
    },
    region: "us-central1",
    runtime: "nodejs18",
  },
]

export function CloudFunctionsSection() {
  const [loading, setLoading] = useState(false)

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-green-500" />
            Active
          </Badge>
        )
      case "throttled":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-yellow-500" />
            Throttled
          </Badge>
        )
      case "crashed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-red-500" />
            Crashed
          </Badge>
        )
      default:
        return null
    }
  }

  // Mobile card view for functions
  const renderMobileFunctionCard = (func: (typeof mockCloudFunctions)[0]) => {
    return (
      <div key={func.id} className="mb-4 border rounded-md overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium truncate max-w-[200px]">{func.name}</div>
            {getStatusBadge(func.status)}
          </div>

          <div className="text-xs text-muted-foreground mb-3">
            Region: {func.region} | Runtime: {func.runtime}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="border rounded-md p-2">
              <div className="text-xs text-muted-foreground">Invocations (daily)</div>
              <div className="text-lg font-semibold">{func.invocations.toLocaleString()}</div>
            </div>
            <div className="border rounded-md p-2">
              <div className="text-xs text-muted-foreground">Error Rate</div>
              <div
                className={`text-lg font-semibold ${func.errorRate > 5 ? "text-red-500" : func.errorRate > 1 ? "text-yellow-500" : ""}`}
              >
                {func.errorRate}%
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Memory ({func.memory.allocated}MB)</span>
                <span className="text-sm font-medium">{func.memory.usagePercent}%</span>
              </div>
              <Progress value={func.memory.usagePercent} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">CPU Usage</span>
                <span className="text-sm font-medium">{func.cpu.usagePercent}%</span>
              </div>
              <Progress value={func.cpu.usagePercent} className="h-2" />
            </div>
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
        title="Cloud Functions"
        description="Function invocations, errors, and resource usage"
        icon={<Code className="h-5 w-5" />}
      >
        {/* Desktop view */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Function Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invocations (daily)</TableHead>
                <TableHead>Error Rate</TableHead>
                <TableHead>Memory Usage</TableHead>
                <TableHead>CPU Usage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
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
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : mockCloudFunctions.map((func) => (
                    <TableRow key={func.id}>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-medium cursor-default">{func.name}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Region: {func.region}</p>
                            <p>Runtime: {func.runtime}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{getStatusBadge(func.status)}</TableCell>
                      <TableCell>{func.invocations.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={func.errorRate > 5 ? "text-red-500" : func.errorRate > 1 ? "text-yellow-500" : ""}
                        >
                          {func.errorRate}%
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">({func.errors})</span>
                      </TableCell>
                      <TableCell>
                        <div className="w-full max-w-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">
                              {func.memory.used}MB / {func.memory.allocated}MB
                            </span>
                            <span className="text-xs font-medium">{func.memory.usagePercent}%</span>
                          </div>
                          <Progress value={func.memory.usagePercent} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-full max-w-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Usage</span>
                            <span className="text-xs font-medium">{func.cpu.usagePercent}%</span>
                          </div>
                          <Progress value={func.cpu.usagePercent} className="h-2" />
                        </div>
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
            : mockCloudFunctions.map(renderMobileFunctionCard)}
        </div>
      </ResourceCard>
    </TooltipProvider>
  )
}
