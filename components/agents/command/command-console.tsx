"use client"

import { useState } from "react"
import { CommandInput } from "./command-input"
import { InterpretationOutput } from "./interpretation-output"
import { DeploymentStatus } from "./deployment-status"
import { useToast } from "@/components/ui/use-toast"

export type AgentStatus = "idle" | "interpreting" | "deploying" | "success" | "error"
export type GCPService =
  | "Cloud Functions"
  | "Pub/Sub"
  | "Secret Manager"
  | "Cloud Scheduler"
  | "Vertex AI"
  | "Cloud Storage"

export interface AgentBlueprint {
  name: string
  summary: string
  blueprint: Record<string, any>
  services: GCPService[]
  estimatedCost: string
  deploymentTime: string
}

export function CommandConsole() {
  const [command, setCommand] = useState("")
  const [status, setStatus] = useState<AgentStatus>("idle")
  const [blueprint, setBlueprint] = useState<AgentBlueprint | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [developerMode, setDeveloperMode] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const { toast } = useToast()

  const handleCommandSubmit = async (command: string, devMode: boolean) => {
    setCommand(command)
    setStatus("interpreting")
    setError(null)
    setDeveloperMode(devMode)
    setLogs([])

    if (devMode) {
      setLogs((prev) => [...prev, `[${new Date().toISOString()}] Sending command to Gemini: "${command}"`])
    }

    try {
      // In a real implementation, this would call the /api/agent/ask endpoint
      // const response = await fetch('/api/agent/ask', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ command, developerMode: devMode })
      // });
      // const data = await response.json();

      // Simulate API call to interpret command with Gemini
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (devMode) {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toISOString()}] Gemini processing tokens: 342`,
          `[${new Date().toISOString()}] Analyzing cloud requirements...`,
          `[${new Date().toISOString()}] Generating blueprint...`,
        ])
      }

      // Mock response from Gemini
      const mockBlueprint: AgentBlueprint = {
        name: "pubsub-log-monitor",
        summary: "Create Cloud Function & Pub/Sub trigger in us-central1 to monitor logs and restart crashing agents",
        blueprint: {
          name: "pubsub-log-monitor",
          type: "agent",
          version: "1.0",
          region: "us-central1",
          components: [
            {
              type: "function",
              name: "log-monitor-function",
              runtime: "nodejs18",
              entryPoint: "monitorLogs",
              memory: "256MB",
              timeout: "60s",
              environmentVariables: {
                ALERT_THRESHOLD: "3",
                NOTIFICATION_TOPIC: "agent-alerts",
              },
            },
            {
              type: "pubsub",
              name: "log-events",
              topic: "agent-log-events",
              subscription: {
                name: "log-monitor-sub",
                pushEndpoint: "https://us-central1-project-id.cloudfunctions.net/log-monitor-function",
              },
            },
            {
              type: "secretManager",
              name: "agent-restart-credentials",
              secretId: "agent-restart-key",
            },
          ],
          triggers: [
            {
              type: "pubsub",
              topic: "agent-log-events",
            },
          ],
          actions: [
            {
              type: "restart",
              target: "agent",
              condition: "error_count > 3",
            },
          ],
        },
        services: ["Cloud Functions", "Pub/Sub", "Secret Manager"],
        estimatedCost: "$5.20 - $7.80 per month",
        deploymentTime: "~2 minutes",
      }

      if (devMode) {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toISOString()}] Blueprint generated successfully`,
          `[${new Date().toISOString()}] Response tokens: 578`,
        ])
      }

      setBlueprint(mockBlueprint)
      setStatus("idle")
    } catch (err) {
      setError("Failed to interpret command with Gemini. Please try again.")
      setStatus("error")

      if (devMode) {
        setLogs((prev) => [...prev, `[${new Date().toISOString()}] ERROR: Failed to interpret command`])
      }
    }
  }

  const handleDeploy = async () => {
    if (!blueprint) return

    setStatus("deploying")

    if (developerMode) {
      setLogs((prev) => [
        ...prev,
        `[${new Date().toISOString()}] Deploying blueprint: ${blueprint.name}`,
        `[${new Date().toISOString()}] Initializing deployment to GCP...`,
      ])
    }

    try {
      // In a real implementation, this would call the /api/admin-agent/deploy endpoint
      // const response = await fetch('/api/admin-agent/deploy', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ blueprint: blueprint.blueprint })
      // });
      // const data = await response.json();

      // Simulate API call to deploy blueprint
      await new Promise((resolve) => setTimeout(resolve, 3000))

      if (developerMode) {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toISOString()}] Creating Cloud Function: log-monitor-function`,
          `[${new Date().toISOString()}] Creating Pub/Sub topic: agent-log-events`,
          `[${new Date().toISOString()}] Creating Secret: agent-restart-credentials`,
          `[${new Date().toISOString()}] Binding permissions...`,
          `[${new Date().toISOString()}] Deployment completed successfully in 3.2s`,
        ])
      }

      setStatus("success")
      toast({
        title: "Agent successfully deployed in 3.2s",
        description: `${blueprint.name} is now active in us-central1`,
        variant: "default",
      })
    } catch (err) {
      setStatus("error")
      setError("Failed to deploy agent. Please check your GCP permissions and try again.")

      if (developerMode) {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toISOString()}] ERROR: Deployment failed`,
          `[${new Date().toISOString()}] Reason: Insufficient permissions`,
        ])
      }

      toast({
        title: "Deployment failed",
        description: "There was an error deploying the agent. Check the logs for details.",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setStatus("idle")
    setError(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <CommandInput
        onSubmit={handleCommandSubmit}
        isLoading={status === "interpreting"}
        disabled={status === "deploying" || status === "success"}
      />

      {developerMode && logs.length > 0 && (
        <div className="w-full p-4 rounded-lg border bg-muted/50">
          <h3 className="text-sm font-medium mb-2">Developer Logs</h3>
          <div className="font-mono text-xs space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-muted-foreground">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {blueprint && status !== "error" && (
        <InterpretationOutput
          blueprint={blueprint}
          onDeploy={handleDeploy}
          isDeploying={status === "deploying"}
          isDeployed={status === "success"}
        />
      )}

      {(status === "success" || status === "error") && (
        <DeploymentStatus status={status} error={error} agentName={blueprint?.name || ""} onReset={handleReset} />
      )}
    </div>
  )
}
