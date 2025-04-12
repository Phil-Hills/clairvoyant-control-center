"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AgentMemoryCard } from "@/components/memory/agent-memory-card"
import { EditMemoryDialog } from "@/components/memory/edit-memory-dialog"
import { Bot, Brain, Filter, RefreshCw, Search, Clock, Server, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Mock data for agents
const agents = [
  {
    id: "agent-1",
    name: "Data Processor",
    role: "Data Processing Agent",
    purpose: "Process and transform data from various sources",
    status: "active",
    type: "processor",
    environment: "production",
    lastActivity: "2023-06-15T14:40:00Z",
    lastCommands: [
      { command: "process_csv('sales_data.csv')", timestamp: "2023-06-15T14:30:00Z" },
      { command: "transform_data(sales_data, 'monthly_report')", timestamp: "2023-06-15T14:35:00Z" },
      { command: "export_to_bigquery(monthly_report, 'sales_dataset')", timestamp: "2023-06-15T14:40:00Z" },
    ],
    memory: {
      context: {
        current_task: "Monthly sales report generation",
        data_sources: ["BigQuery", "Cloud Storage", "Pub/Sub"],
        processing_status: "completed",
      },
      variables: {
        report_format: "PDF",
        include_charts: true,
        recipients: ["analytics@example.com", "sales@example.com"],
      },
      state: {
        is_processing: false,
        last_run: "2023-06-15T14:40:00Z",
        error_count: 0,
      },
    },
  },
  {
    id: "agent-2",
    name: "Content Analyzer",
    role: "Content Analysis Agent",
    purpose: "Analyze content using Vertex AI models",
    status: "idle",
    type: "analyzer",
    environment: "production",
    lastActivity: "2023-06-15T13:30:00Z",
    lastCommands: [
      { command: "analyze_sentiment(customer_feedback)", timestamp: "2023-06-15T13:20:00Z" },
      { command: "extract_entities(product_reviews)", timestamp: "2023-06-15T13:25:00Z" },
      { command: "classify_content(support_tickets)", timestamp: "2023-06-15T13:30:00Z" },
    ],
    memory: {
      context: {
        current_task: "Customer feedback analysis",
        models_used: ["text-bison", "text-embedding-gecko"],
        analysis_status: "idle",
      },
      variables: {
        sentiment_threshold: 0.7,
        entity_types: ["PERSON", "ORGANIZATION", "PRODUCT"],
        language: "en",
      },
      state: {
        is_analyzing: false,
        last_run: "2023-06-15T13:30:00Z",
        error_count: 0,
      },
    },
  },
  {
    id: "agent-3",
    name: "Notification Service",
    role: "Notification Agent",
    purpose: "Send notifications based on agent activity",
    status: "error",
    type: "notifier",
    environment: "production",
    lastActivity: "2023-06-15T12:20:00Z",
    lastCommands: [
      { command: "send_email_notification('alert@example.com', 'System Alert')", timestamp: "2023-06-15T12:10:00Z" },
      { command: "send_slack_notification('#alerts', 'System Alert')", timestamp: "2023-06-15T12:15:00Z" },
      { command: "log_notification_failure('email', 'SMTP error')", timestamp: "2023-06-15T12:20:00Z" },
    ],
    memory: {
      context: {
        current_task: "System alert notification",
        channels: ["email", "slack", "sms"],
        notification_status: "failed",
      },
      variables: {
        retry_count: 3,
        priority: "high",
        recipients: ["ops@example.com", "#alerts"],
      },
      state: {
        is_sending: false,
        last_run: "2023-06-15T12:20:00Z",
        error_count: 2,
        error_message: "SMTP connection refused",
      },
    },
  },
  {
    id: "agent-4",
    name: "Scheduler Bot",
    role: "Scheduling Agent",
    purpose: "Manage and schedule tasks for other agents",
    status: "active",
    type: "scheduler",
    environment: "staging",
    lastActivity: "2023-06-15T15:10:00Z",
    lastCommands: [
      { command: "schedule_task('data_processor', 'daily_report', '0 0 * * *')", timestamp: "2023-06-15T15:00:00Z" },
      { command: "list_scheduled_tasks()", timestamp: "2023-06-15T15:05:00Z" },
      {
        command: "update_schedule('content_analyzer', 'weekly_analysis', '0 0 * * 1')",
        timestamp: "2023-06-15T15:10:00Z",
      },
    ],
    memory: {
      context: {
        current_task: "Schedule management",
        active_schedules: 12,
        next_execution: "2023-06-16T00:00:00Z",
      },
      variables: {
        default_timezone: "UTC",
        notification_enabled: true,
        retry_policy: "exponential",
      },
      state: {
        is_scheduling: false,
        last_run: "2023-06-15T15:10:00Z",
        error_count: 0,
      },
    },
  },
  {
    id: "agent-5",
    name: "Security Monitor",
    role: "Security Agent",
    purpose: "Monitor system security and detect anomalies",
    status: "active",
    type: "monitor",
    environment: "development",
    lastActivity: "2023-06-15T14:55:00Z",
    lastCommands: [
      { command: "scan_logs_for_anomalies()", timestamp: "2023-06-15T14:45:00Z" },
      { command: "check_auth_attempts()", timestamp: "2023-06-15T14:50:00Z" },
      { command: "update_security_report()", timestamp: "2023-06-15T14:55:00Z" },
    ],
    memory: {
      context: {
        current_task: "Security monitoring",
        monitored_services: ["IAM", "VPC", "Cloud Functions"],
        alert_level: "normal",
      },
      variables: {
        anomaly_threshold: 0.85,
        scan_frequency: 300,
        alert_channels: ["email", "slack"],
      },
      state: {
        is_scanning: false,
        last_run: "2023-06-15T14:55:00Z",
        error_count: 0,
      },
    },
  },
]

export function MemoryViewer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [envFilter, setEnvFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredAgents = agents.filter((agent) => {
    // Search filter
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.purpose.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter

    // Type filter
    const matchesType = typeFilter === "all" || agent.type === typeFilter

    // Environment filter
    const matchesEnv = envFilter === "all" || agent.environment === envFilter

    // Time filter
    let matchesTime = true
    const lastActivity = new Date(agent.lastActivity)
    const now = new Date()
    const hoursDiff = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60)

    if (timeFilter === "1h") {
      matchesTime = hoursDiff <= 1
    } else if (timeFilter === "24h") {
      matchesTime = hoursDiff <= 24
    } else if (timeFilter === "7d") {
      matchesTime = hoursDiff <= 168 // 7 * 24
    }

    return matchesSearch && matchesStatus && matchesType && matchesEnv && matchesTime
  })

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>Agent Memory Explorer</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Tabs
                value={viewMode}
                onValueChange={(v) => setViewMode(v as "grid" | "table")}
                className="hidden sm:block"
              >
                <TabsList className="h-9">
                  <TabsTrigger value="grid" className="px-3">
                    <Server className="h-4 w-4 mr-2" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="table" className="px-3">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Table
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>
          <CardDescription>View and modify the working memory of your AI agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:w-[130px]"
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {isFilterExpanded ? "Hide Filters" : "Show Filters"}
                </Button>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="idle">Idle</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isFilterExpanded && (
              <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card">
                <div className="flex items-center justify-between w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Type:</span>
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Agent Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="processor">Processor</SelectItem>
                      <SelectItem value="analyzer">Analyzer</SelectItem>
                      <SelectItem value="notifier">Notifier</SelectItem>
                      <SelectItem value="scheduler">Scheduler</SelectItem>
                      <SelectItem value="monitor">Monitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Environment:</span>
                  </div>
                  <Select value={envFilter} onValueChange={setEnvFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Environments</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Last Activity:</span>
                  </div>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="1h">Last Hour</SelectItem>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => {
                    setStatusFilter("all")
                    setTypeFilter("all")
                    setEnvFilter("all")
                    setTimeFilter("all")
                    setSearchQuery("")
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <div className="space-y-2 mt-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Skeleton className="h-[200px] w-full" />
                  </CardContent>
                  <div className="p-2 border-t">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAgents.map((agent) => (
                <AgentMemoryCard
                  key={agent.id}
                  agent={agent}
                  onEdit={() => {
                    setSelectedAgent(agent.id)
                    setIsEditDialogOpen(true)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <ScrollArea className="h-[600px]">
                <table className="w-full">
                  <thead className="sticky top-0 bg-card z-10">
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium">Agent</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Environment</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Last Activity</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgents.map((agent) => (
                      <tr key={agent.id} className="border-b">
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium">{agent.name}</span>
                            <span className="text-xs text-muted-foreground">{agent.role}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge
                            variant="outline"
                            className={cn(
                              agent.status === "active" && "bg-green-500/10 text-green-500 border-green-500/20",
                              agent.status === "idle" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                              agent.status === "error" && "bg-red-500/10 text-red-500 border-red-500/20",
                            )}
                          >
                            {agent.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <span className="capitalize">{agent.type}</span>
                        </td>
                        <td className="p-4 align-middle">
                          <span className="capitalize">{agent.environment}</span>
                        </td>
                        <td className="p-4 align-middle">
                          <span>{new Date(agent.lastActivity).toLocaleString()}</span>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAgent(agent.id)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            Edit Memory
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          )}

          {filteredAgents.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bot className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No agents found</h3>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAgent && (
        <EditMemoryDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          agent={agents.find((a) => a.id === selectedAgent)!}
        />
      )}
    </div>
  )
}
