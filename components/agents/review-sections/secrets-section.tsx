"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, CheckCircle, XCircle, KeyRound, AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SecretsSectionProps {
  agentConfig: any
  onEdit: () => void
}

export function SecretsSection({ agentConfig, onEdit }: SecretsSectionProps) {
  // Check if there are any secrets assigned
  const hasSecrets = agentConfig.secrets && agentConfig.secrets.length > 0

  // Get the appropriate status icon for secrets validation
  const getSecretsStatusIcon = () => {
    if (!hasSecrets) return null

    if (agentConfig.validations?.secretsValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Secret Injection</CardTitle>
              {hasSecrets && (
                <Tooltip>
                  <TooltipTrigger asChild>{getSecretsStatusIcon()}</TooltipTrigger>
                  <TooltipContent>
                    {agentConfig.validations?.secretsValid
                      ? "All secrets are valid"
                      : "Some secrets may be invalid or inaccessible"}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit Secrets</span>
            </Button>
          </div>
          <CardDescription>Secrets that will be injected into your agent</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasSecrets ? (
            <div className="text-sm text-muted-foreground">No secrets will be injected into this agent.</div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {agentConfig.secrets.map((secret: any) => (
                  <Badge key={secret.id} variant="outline" className="flex items-center gap-1 px-2 py-1">
                    <KeyRound className="h-3 w-3" />
                    <span>{secret.name}</span>
                    {secret.warning && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                        </TooltipTrigger>
                        <TooltipContent>{secret.warning}</TooltipContent>
                      </Tooltip>
                    )}
                  </Badge>
                ))}
              </div>

              {agentConfig.validations?.secretWarnings && (
                <div className="text-sm text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{agentConfig.validations.secretWarnings}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
