"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CommandInput } from "@/components/agents/command/command-input"
import { InterpretationOutput } from "@/components/agents/command/interpretation-output"
import { StatusPanel } from "@/components/agents/command/status-panel"
import { DeploymentStatus } from "@/components/agents/command/deployment-status"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

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

type CommandConsoleProps = {}

export function CommandConsole({}: CommandConsoleProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("console")
  const [commandHistory, setCommandHistory] = useState<
    {
      command: string
      interpretation: string
      status: "success" | "error" | "pending"
      timestamp: Date
    }[]
  >([])
  const [command, setCommand] = useState("")
  const [status, setStatus] = useState<AgentStatus>("idle")
  const [blueprint, setBlueprint] = useState<AgentBlueprint | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleCommand = (command: string) => {
    // Add command to history with pending status
    const newCommand = {
      command,
      interpretation: "",
      status: "pending" as const,
      timestamp: new Date(),
    }

    setCommandHistory((prev) => [newCommand, ...prev])

    // Simulate processing
    setTimeout(() => {
      setCommandHistory((prev) => {
        const updated = [...prev]
        const index = updated.findIndex((cmd) => cmd === newCommand)

        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            interpretation: generateInterpretation(command),
            status: command.includes("error") ? "error" : "success",
          }
        }

        return updated
      })
    }, 1500)
  }

  const handleCommandSubmit = async (command: string) => {
    setCommand(command)
    setStatus("interpreting")
    setError(null)

    try {
      // In a real implementation, this would call the API
      const response = await fetch("/api/agent/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setBlueprint(data)
      setStatus("idle")
    } catch (err) {
      console.error("Error interpreting command:", err)
      setError("Failed to interpret command with Gemini. Please try again.")
      setStatus("error")

      toast({
        title: "Interpretation failed",
        description: "There was an error processing your command. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeploy = async () => {
    if (!blueprint) return

    setStatus("deploying")

    try {
      const response = await fetch("/api/admin-agent/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprint: blueprint.blueprint }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setStatus("success")

      toast({
        title: "Agent successfully deployed",
        description: `${blueprint.name} is now active in the cloud`,
        variant: "default",
      })
    } catch (err) {
      console.error("Error deploying agent:", err)
      setStatus("error")
      setError("Failed to deploy agent. Please check your GCP permissions and try again.")

      toast({
        title: "Deployment failed",
        description: "There was an error deploying the agent. Check the logs for details.",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setStatus("idle")
    setBlueprint(null)
    setError(null)
  }

  // Helper function to generate a plausible interpretation for demo purposes
  const generateInterpretation = (command: string) => {
    const lowerCommand = command.toLowerCase()

    if (lowerCommand.includes("deploy") || lowerCommand.includes("create")) {
      return "Preparing to deploy new agent. Validating configuration..."
    } else if (lowerCommand.includes("list") || lowerCommand.includes("show")) {
      return "Fetching list of resources..."
    } else if (lowerCommand.includes("delete") || lowerCommand.includes("remove")) {
      return "Preparing to delete resource. This action cannot be undone."
    } else if (lowerCommand.includes("status")) {
      return "Checking system status..."
    } else if (lowerCommand.includes("error") || lowerCommand.includes("fail")) {
      return "Command failed: Invalid syntax or insufficient permissions."
    } else {
      return "Processing command: " + command
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Agent Command Console</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="console" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="console">Console</TabsTrigger>
              <TabsTrigger value="status">System Status</TabsTrigger>
            </TabsList>

            <TabsContent value="console" className="space-y-4">
              <CommandInput onSubmit={handleCommand} isDisabled={isLoading} />

              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-[100px] w-full" />
                  <Skeleton className="h-[100px] w-full" />
                </div>
              ) : commandHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Enter a command to get started.</p>
                  <p className="text-sm mt-2">Try: "deploy agent", "list resources", or "check status"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {commandHistory.map((cmd, index) => (
                    <InterpretationOutput
                      key={index}
                      command={cmd.command}
                      interpretation={cmd.interpretation}
                      status={cmd.status}
                      timestamp={cmd.timestamp}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="status">
              {isLoading ? <Skeleton className="h-[400px] w-full" /> : <StatusPanel />}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Deployment Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <DeploymentStatus />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
