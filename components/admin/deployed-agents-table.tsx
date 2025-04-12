"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FileText, MoreVertical, Pause, Play, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock data for deployed agents
const mockAgents = [
  {
    id: "1",
    name: "log-analyzer",
    status: "active",
    trigger: "scheduler",
    region: "us-central1",
    lastRun: "2023-04-10T15:30:00Z",
  },
  {
    id: "2",
    name: "data-processor",
    status: "paused",
    trigger: "pubsub",
    region: "us-east1",
    lastRun: "2023-04-09T12:15:00Z",
  },
  {
    id: "3",
    name: "alert-notifier",
    status: "active",
    trigger: "manual",
    region: "us-west1",
    lastRun: "2023-04-10T08:45:00Z",
  },
  {
    id: "4",
    name: "resource-monitor",
    status: "error",
    trigger: "scheduler",
    region: "europe-west1",
    lastRun: "2023-04-08T22:10:00Z",
  },
  {
    id: "5",
    name: "security-scanner",
    status: "active",
    trigger: "scheduler",
    region: "us-central1",
    lastRun: "2023-04-10T14:20:00Z",
  },
]

export function DeployedAgentsTable() {
  const { toast } = useToast()
  const [agents, setAgents] = useState(mockAgents)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<(typeof mockAgents)[0] | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "paused":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Paused
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleViewLogs = (agent: (typeof mockAgents)[0]) => {
    toast({
      title: "Viewing logs",
      description: `Redirecting to logs for ${agent.name}...`,
    })
  }

  const handleToggleStatus = (agent: (typeof mockAgents)[0]) => {
    const newStatus = agent.status === "active" ? "paused" : "active"
    setAgents(agents.map((a) => (a.id === agent.id ? { ...a, status: newStatus } : a)))
    toast({
      title: `Agent ${newStatus === "active" ? "resumed" : "paused"}`,
      description: `${agent.name} has been ${newStatus === "active" ? "resumed" : "paused"}.`,
    })
  }

  const handleDeleteClick = (agent: (typeof mockAgents)[0]) => {
    setSelectedAgent(agent)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedAgent) {
      setAgents(agents.filter((a) => a.id !== selectedAgent.id))
      toast({
        title: "Agent deleted",
        description: `${selectedAgent.name} has been deleted.`,
        variant: "destructive",
      })
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Trigger</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Last Run</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell className="font-medium">{agent.name}</TableCell>
              <TableCell>{getStatusBadge(agent.status)}</TableCell>
              <TableCell className="capitalize">{agent.trigger}</TableCell>
              <TableCell>{agent.region}</TableCell>
              <TableCell>{formatDate(agent.lastRun)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewLogs(agent)}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Logs
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(agent)}>
                      {agent.status === "active" ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Resume
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteClick(agent)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the agent <span className="font-semibold">{selectedAgent?.name}</span> and
              all associated resources. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
