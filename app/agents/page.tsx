import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function AgentsPage() {
  // Mock data for agents
  const agents = [
    {
      id: "agent-1",
      name: "Data Processor",
      status: "active",
      description: "Processes incoming data from various sources",
      lastRun: "5 minutes ago",
      type: "Scheduled",
    },
    {
      id: "agent-2",
      name: "Content Analyzer",
      status: "idle",
      description: "Analyzes content using Vertex AI models",
      lastRun: "2 hours ago",
      type: "Manual",
    },
    {
      id: "agent-3",
      name: "Notification Service",
      status: "error",
      description: "Sends notifications based on agent activity",
      lastRun: "30 minutes ago",
      type: "Event-driven",
    },
    {
      id: "agent-4",
      name: "Log Analyzer",
      status: "active",
      description: "Analyzes logs for anomalies and patterns",
      lastRun: "15 minutes ago",
      type: "Event-driven",
    },
    {
      id: "agent-5",
      name: "Sentiment Analyzer",
      status: "idle",
      description: "Analyzes sentiment in text using Vertex AI",
      lastRun: "5 hours ago",
      type: "Manual",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
            <p className="text-muted-foreground">Manage your AI agents running in Google Cloud</p>
          </div>
          <Button asChild>
            <Link href="/agents/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Agent
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search agents..." className="pl-8" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="grid gap-4">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{agent.name}</h3>
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
                    </div>
                    <p className="text-muted-foreground">{agent.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Last run: {agent.lastRun}</span>
                      <span>Type: {agent.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                      <Link href={`/agents/${agent.id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/logs?agent=${agent.id}`}>View Logs</Link>
                    </Button>
                    {agent.status === "active" ? (
                      <Button variant="outline">Pause</Button>
                    ) : agent.status === "idle" ? (
                      <Button variant="outline">Resume</Button>
                    ) : (
                      <Button variant="outline">Retry</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
