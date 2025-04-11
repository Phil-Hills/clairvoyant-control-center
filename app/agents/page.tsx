import { AgentsTable } from "@/components/agents/agents-table"
import { CreateAgentButton } from "@/components/agents/create-agent-button"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AgentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground">Manage your AI agents running in Google Cloud.</p>
        </div>
        <CreateAgentButton />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Agents</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="idle">Idle</TabsTrigger>
            <TabsTrigger value="error">Error</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              Filter
            </Button>
          </div>
        </div>
        <TabsContent value="all" className="space-y-4">
          <AgentsTable />
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <AgentsTable filterStatus="active" />
        </TabsContent>
        <TabsContent value="idle" className="space-y-4">
          <AgentsTable filterStatus="idle" />
        </TabsContent>
        <TabsContent value="error" className="space-y-4">
          <AgentsTable filterStatus="error" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
