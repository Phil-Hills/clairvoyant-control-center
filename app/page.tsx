import { Suspense } from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle,
  Clock,
  CloudOff,
  Key,
  PauseCircle,
  RefreshCw,
  Shield,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage your autonomous AI agents running in Google Cloud.</p>
      </div>

      <Suspense fallback={<AgentSummaryCardsSkeleton />}>
        <AgentSummaryCards />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<TaskQueueSnapshotSkeleton />}>
          <TaskQueueSnapshot />
        </Suspense>

        <Suspense fallback={<RecentActivityFeedSkeleton />}>
          <RecentActivityFeed />
        </Suspense>
      </div>
    </div>
  )
}

// Agent Summary Cards
function AgentSummaryCards() {
  // In a real app, this data would come from an API
  const agentStats = {
    active: 8,
    idle: 3,
    failed: 1,
    invocations: 1247,
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
          <Bot className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{agentStats.active}</div>
          <p className="text-xs text-muted-foreground">
            {agentStats.active > 5 ? "All systems operational" : "Some agents need attention"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Idle Agents</CardTitle>
          <PauseCircle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{agentStats.idle}</div>
          <p className="text-xs text-muted-foreground">Ready to be activated</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Failed Agents</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{agentStats.failed}</div>
          <p className="text-xs text-muted-foreground">
            {agentStats.failed === 0 ? "No failures detected" : "Requires attention"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Invocations</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{agentStats.invocations.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Today's agent activity</p>
        </CardContent>
      </Card>
    </div>
  )
}

function AgentSummaryCardsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-4 w-[140px]" />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

// Task Queue Snapshot
function TaskQueueSnapshot() {
  // Mock data for recent tasks
  const recentTasks = [
    {
      id: "task-1a2b3c",
      agent: "Data Processor",
      status: "completed",
      startTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      duration: "45s",
    },
    {
      id: "task-2d3e4f",
      agent: "Content Analyzer",
      status: "running",
      startTime: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
      duration: "2m 10s",
    },
    {
      id: "task-3f4g5h",
      agent: "Notification Service",
      status: "failed",
      startTime: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      duration: "12s",
    },
    {
      id: "task-4h5i6j",
      agent: "Log Analyzer",
      status: "queued",
      startTime: new Date(Date.now() - 1000 * 60 * 1), // 1 minute ago
      duration: "0s",
    },
    {
      id: "task-5i6j7k",
      agent: "Sentiment Analyzer",
      status: "retrying",
      startTime: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
      duration: "3m 20s",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case "running":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            Running
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        )
      case "queued":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            <Clock className="mr-1 h-3 w-3" />
            Queued
          </Badge>
        )
      case "retrying":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
            Retrying
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Queue</CardTitle>
        <CardDescription>Recent task executions from your agents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{task.agent}</span>
                  <span className="text-xs text-muted-foreground font-mono">{task.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(task.status)}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(task.startTime, { addSuffix: true })}
                  </span>
                </div>
              </div>
              <div className="text-sm font-mono">{task.duration}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/tasks">
            View All Tasks
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function TaskQueueSnapshotSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[120px] mb-2" />
        <Skeleton className="h-4 w-[200px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-[150px]" />
                  <Skeleton className="h-5 w-[100px]" />
                </div>
                <Skeleton className="h-5 w-[50px]" />
              </div>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}

// Recent Activity Feed
function RecentActivityFeed() {
  // Mock data for recent activities
  const recentActivities = [
    {
      id: "activity-1",
      type: "deploy",
      message: "Agent Clair-002 deployed successfully",
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      icon: Shield,
      iconColor: "text-green-500",
    },
    {
      id: "activity-2",
      type: "secret",
      message: "Secret EMAIL_TOKEN accessed by Agent-01",
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      icon: Key,
      iconColor: "text-amber-500",
    },
    {
      id: "activity-3",
      type: "error",
      message: "Function lead-scoring-runner crashed",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      icon: AlertTriangle,
      iconColor: "text-red-500",
    },
    {
      id: "activity-4",
      type: "info",
      message: "Agent Data-Processor completed 50 tasks",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      icon: Activity,
      iconColor: "text-blue-500",
    },
    {
      id: "activity-5",
      type: "warning",
      message: "Cloud Function quota at 80% utilization",
      timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
      icon: CloudOff,
      iconColor: "text-orange-500",
    },
  ]

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "deploy":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Deploy
          </Badge>
        )
      case "secret":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Secret
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Error
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Info
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
            Warning
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest events from your AI agents and infrastructure</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-0 before:h-full before:w-[1px] before:bg-border">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="relative">
              <div className="absolute -left-[22px] flex h-4 w-4 items-center justify-center">
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activity.message}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getActivityBadge(activity.type)}
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/logs">
            View All Activity
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function RecentActivityFeedSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[150px] mb-2" />
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-0 before:h-full before:w-[1px] before:bg-border">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[22px] flex h-4 w-4 items-center justify-center">
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-[250px]" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-[70px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}
