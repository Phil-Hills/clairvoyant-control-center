import { AgentBuilderForm } from "@/components/agents/agent-builder/agent-builder-form"

export default function CreateAgentPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Agent</h1>
        <p className="text-muted-foreground">
          Configure model, bindings, triggers, and secrets to deploy an autonomous cloud agent.
        </p>
      </div>
      <AgentBuilderForm />
    </div>
  )
}
