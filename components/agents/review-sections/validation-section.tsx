"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { format } from "date-fns"

interface ValidationSectionProps {
  agentConfig: any
  onEdit: () => void
}

export function ValidationSection({ agentConfig, onEdit }: ValidationSectionProps) {
  // Check if a test was run
  const testRun = agentConfig.validations?.lastTestRun

  // Get the overall validation status
  const getOverallStatus = () => {
    if (!testRun) return "untested"

    const allValid =
      agentConfig.validations?.endpointValid &&
      agentConfig.validations?.functionValid &&
      (!agentConfig.secrets?.length || agentConfig.validations?.secretsValid)

    return allValid ? "success" : "warning"
  }

  const status = getOverallStatus()

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Validation Status</CardTitle>
            <CardDescription>Results from testing your agent configuration</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Run Tests</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Status:</span>
            {status === "success" && (
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Ready to Deploy
              </Badge>
            )}
            {status === "warning" && (
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Issues Detected
              </Badge>
            )}
            {status === "untested" && (
              <Badge className="bg-muted/50 text-muted-foreground flex items-center gap-1">Untested</Badge>
            )}
          </div>

          {testRun && (
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">Last Test Run:</span>
              <span className="text-sm">{format(new Date(testRun), "MMM d, yyyy 'at' h:mm a")}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="flex flex-col items-center p-2 border rounded-md">
              <span className="text-xs text-muted-foreground mb-1">Endpoint</span>
              {agentConfig.validations?.endpointValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>

            <div className="flex flex-col items-center p-2 border rounded-md">
              <span className="text-xs text-muted-foreground mb-1">Function</span>
              {agentConfig.validations?.functionValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>

            <div className="flex flex-col items-center p-2 border rounded-md">
              <span className="text-xs text-muted-foreground mb-1">Secrets</span>
              {!agentConfig.secrets?.length ? (
                <span className="text-xs">N/A</span>
              ) : agentConfig.validations?.secretsValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
