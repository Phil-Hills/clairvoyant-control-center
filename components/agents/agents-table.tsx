"use client"

import { useState } from "react"
import {
  AlertCircle,
  Calendar,
  Clock,
  Cloud,
  ExternalLink,
  FileText,
  MoreHorizontal,
  Pause,
  Play,
  Trash2,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
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

// Mock data for agents
const mockAgents = [
  {
    id: "agent-1",
    name: "Data Processor",
    status: "active",
    cloudFunction: "data-processor-function",
    triggerType: "scheduler",
    lastRun: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: "agent-2",
    name: "Content Analyzer",
    status: "idle",
    cloudFunction: "content-analyzer-function",
    triggerType: "manual",
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
  {
    id: "agent-3",
    name: "Notification Service",
    status: "error",
    cloudFunction: "notification-service-function",
    triggerType: "pubsub",
    lastRun: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
  },
  {
    id: "agent-4",
    name: "Log Analyzer",
    status: "active",
    cloudFunction: "log-analyzer-function",
    triggerType: "pubsub",
    lastRun: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
  },
  {
    id: "agent-5",
    name: "Sentiment Analyzer",
    status: "idle",
    cloudFunction: "sentiment-analyzer-function",
    triggerType: "manual",
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
]

type AgentStatus = "active" | "idle" | "error"

interface AgentsTableProps {
  filterStatus?: AgentStatus
}

export function AgentsTable({ filterStatus }: AgentsTableProps) {
  const { toast } = useToast()
  const [agents, setAgents] = useState(mockAgents)

  // Filter agents based on status if filterStatus is provided
  const filteredAgents = filterStatus ? agents.filter((agent) => agent.status === filterStatus) : agents

  const handlePauseAgent = (agentId: string) => {
    setAgents(agents.map((agent) => (agent.id === agentId ? { ...agent, status: "idle" as AgentStatus } : agent)))
    toast({
      title: "Agent Paused",
      description: "The agent has been paused successfully.",
    })
  }

  const handleResumeAgent = (agentId: string) => {
    setAgents(agents.map((agent) => (agent.id === agentId ? { ...agent, status: "active" as AgentStatus } : agent)))
    toast({
      title: "Agent Resumed",
      description: "The agent has been resumed successfully.",
    })
  }

  const handleDeleteAgent = (agentId: string) => {
    setAgents(agents.filter((agent) => agent.id !== agentId))
    toast({
      title: "Agent Deleted",
      description: "The agent has been deleted successfully.",
      variant: "destructive",
    })
  }

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-green-500" />
            Active
          </Badge>
        )
      case "idle":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-yellow-500" />
            Idle
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <span className="mr-1 h-2 w-2 rounded-full bg-red-500" />
            Error
          </Badge>
        )
      default:
        return null
    }
  }

  const getTriggerBadge = (triggerType: string) => {
    switch (triggerType) {
      case "manual":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
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

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Cloud Function</TableHead>
              <TableHead className="hidden md:table-cell">Trigger Type</TableHead>
              <TableHead className="hidden lg:table-cell">Last Run</TableHead>
              <TableHead className="hidden lg:table-cell">Uptime</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No agents found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>{getStatusBadge(agent.status as AgentStatus)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <span className="truncate max-w-[150px]">{agent.cloudFunction}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View Cloud Function</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View in Google Cloud Console</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{getTriggerBadge(agent.triggerType)}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatDistanceToNow(agent.lastRun, { addSuffix: true })}
                      </TooltipTrigger>
                      <TooltipContent>{format(agent.lastRun, "PPpp")}</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDistanceToNow(agent.startTime)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="hidden sm:flex sm:gap-2">
                        {agent.status === "active" ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePauseAgent(agent.id)}
                              >
                                <Pause className="h-4 w-4" />
                                <span className="sr-only">Pause Agent</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Pause Agent</TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleResumeAgent(agent.id)}
                              >
                                <Play className="h-4 w-4" />
                                <span className="sr-only">Resume Agent</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Resume Agent</TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View Logs</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Logs</TooltipContent>
                        </Tooltip>
                      </div>
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
                          <DropdownMenuItem className="sm:hidden">
                            {agent.status === "active" ? (
                              <Pause className="mr-2 h-4 w-4" />
                            ) : (
                              <Play className="mr-2 h-4 w-4" />
                            )}
                            {agent.status === "active" ? "Pause Agent" : "Resume Agent"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="sm:hidden">
                            <FileText className="mr-2 h-4 w-4" />
                            View Logs
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View in GCP Console
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <AlertCircle className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDeleteAgent(agent.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Agent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
