"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AgentBlueprintBuilder } from "./agent-blueprint-builder"
import { DeployedAgentsTable } from "./deployed-agents-table"
import { GcpResourceMonitor } from "./gcp-resource-monitor"
import { ActionConsole } from "./action-console"
import { Bot, Shield } from "lucide-react"

export function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Agent Panel</h1>
          <p className="text-muted-foreground">Create, manage, and monitor AI agents and GCP resources</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="col-span-1 overflow-hidden rounded-xl border shadow-md">
          <CardHeader className="bg-card/50 p-4">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Agent Blueprint Builder
            </CardTitle>
            <CardDescription>Create new agent blueprints for deployment</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <AgentBlueprintBuilder />
          </CardContent>
        </Card>

        <Card className="col-span-1 overflow-hidden rounded-xl border shadow-md">
          <CardHeader className="bg-card/50 p-4">
            <CardTitle>Action Console</CardTitle>
            <CardDescription>Issue commands to the Admin Agent</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <ActionConsole />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="agents">Deployed Agents</TabsTrigger>
          <TabsTrigger value="resources">GCP Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="agents" className="mt-4">
          <Card className="overflow-hidden rounded-xl border shadow-md">
            <CardHeader className="bg-card/50 p-4">
              <CardTitle>Deployed Agents</CardTitle>
              <CardDescription>View and manage all deployed agents</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DeployedAgentsTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resources" className="mt-4">
          <Card className="overflow-hidden rounded-xl border shadow-md">
            <CardHeader className="bg-card/50 p-4">
              <CardTitle>GCP Resource Monitor</CardTitle>
              <CardDescription>Monitor GCP resources used by your agents</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <GcpResourceMonitor />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
