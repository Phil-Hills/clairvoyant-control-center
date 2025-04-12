"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, ExternalLink, RefreshCw } from "lucide-react"
import Link from "next/link"
import type { AgentStatus } from "./command-console"

interface DeploymentStatusProps {
  status: AgentStatus
  error: string | null
  agentName: string
  onReset: () => void
}

export function DeploymentStatus({ status, error, agentName, onReset }: DeploymentStatusProps) {
  if (status !== "success" && status !== "error") {
    return null
  }

  return (
    <Card
      className={`w-full ${status === "error" ? "border-red-500/50" : status === "success" ? "border-green-500/50" : ""}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          {status === "success" ? (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
              Deployment Successful
            </>
          ) : (
            <>
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              Deployment Failed
            </>
          )}
        </CardTitle>
        <CardDescription>
          {status === "success"
            ? `Agent "${agentName}" has been successfully deployed to Google Cloud.`
            : error || "There was an error deploying the agent. Please check the logs."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" && (
          <div className="text-sm">
            <p className="mb-2">The agent is now active and will begin processing according to its configuration.</p>
            <p>You can monitor its activity in the Agents dashboard or view its logs directly.</p>
          </div>
        )}
        {status === "error" && (
          <div className="text-sm">
            <p className="mb-2">The deployment process encountered an error. This could be due to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Invalid configuration in the blueprint</li>
              <li>Insufficient permissions in Google Cloud</li>
              <li>Resource conflicts with existing deployments</li>
              <li>Network or service availability issues</li>
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {status === "success" && (
          <>
            <Button variant="outline" asChild>
              <Link href="/agents">
                <ExternalLink className="mr-2 h-4 w-4" />
                View in Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/logs">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Logs
              </Link>
            </Button>
            <Button onClick={onReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Create Another Agent
            </Button>
          </>
        )}
        {status === "error" && (
          <>
            <Button variant="outline" asChild>
              <Link href="/logs">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Error Logs
              </Link>
            </Button>
            <Button onClick={onReset}>Back to Edit</Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
