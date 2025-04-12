"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Activity, PlusCircle, ArrowRight, CheckCircle, XCircle, PauseCircle, MessageSquare } from "lucide-react"
import Link from "next/link"
import { AskAgentDrawer } from "@/components/agents/ask-agent-drawer"

export default function HomePage() {
  const [askAgentOpen, setAskAgentOpen] = useState(false)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome to Clairvoyant</h1>
            <p className="text-muted-foreground mt-1">Your AI agent orchestration platform for Google Cloud</p>
          </div>
          <Button onClick={() => setAskAgentOpen(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Ask an Agent
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Agent Status</CardTitle>
              <CardDescription>Overview of your AI agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <span className="mr-1 h-2 w-2 rounded-full bg-green-500" />
                      Active
                    </Badge>
                    <span>8 agents</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/agents">View</Link>
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      <span className="mr-1 h-2 w-2 rounded-full bg-yellow-500" />
                      Idle
                    </Badge>
                    <span>3 agents</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/agents">View</Link>
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      <span className="mr-1 h-2 w-2 rounded-full bg-red-500" />
                      Error
                    </Badge>
                    <span>1 agent</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/agents">View</Link>
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <Button className="w-full" asChild>
                  <Link href="/agents/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Agent
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest agent operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Data Processor completed task</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PauseCircle className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Content Analyzer paused</p>
                    <p className="text-xs text-muted-foreground">20 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Notification Service error</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/logs">
                    View All Activity
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/agents/create">
                  <Bot className="mr-2 h-4 w-4" />
                  Create New Agent
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/tasks">
                  <Activity className="mr-2 h-4 w-4" />
                  View Active Tasks
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/logs">
                  <Activity className="mr-2 h-4 w-4" />
                  Check Recent Logs
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/gcp-resources">
                  <Activity className="mr-2 h-4 w-4" />
                  Monitor Resources
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Agents</CardTitle>
            <CardDescription>Your most recently created or updated agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Data Processor",
                  status: "active",
                  description: "Processes incoming data from various sources",
                },
                { name: "Content Analyzer", status: "idle", description: "Analyzes content using Vertex AI models" },
                {
                  name: "Notification Service",
                  status: "error",
                  description: "Sends notifications based on agent activity",
                },
              ].map((agent, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{agent.name}</span>
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
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/agents/${index + 1}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AskAgentDrawer open={askAgentOpen} onOpenChange={setAskAgentOpen} />
    </DashboardLayout>
  )
}
