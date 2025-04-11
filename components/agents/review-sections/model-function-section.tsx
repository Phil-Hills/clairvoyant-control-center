"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, CheckCircle, XCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ModelFunctionSectionProps {
  agentConfig: any
  onEdit: () => void
}

export function ModelFunctionSection({ agentConfig, onEdit }: ModelFunctionSectionProps) {
  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Model & Function Bindings</CardTitle>
              <CardDescription>AI model and cloud function configuration</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit Model & Function</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">Vertex AI Endpoint:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm max-w-[300px] truncate">{agentConfig.vertexEndpoint}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {agentConfig.validations?.endpointValid ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {agentConfig.validations?.endpointValid
                      ? "Endpoint validated successfully"
                      : "Endpoint validation failed"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm font-medium">Cloud Function:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{agentConfig.cloudFunction}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {agentConfig.validations?.functionValid ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {agentConfig.validations?.functionValid
                      ? "Function validated successfully"
                      : "Function validation failed"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {agentConfig.functionRuntime && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Runtime:</span>
                <Badge variant="outline">{agentConfig.functionRuntime}</Badge>
              </div>
            )}

            {agentConfig.codeSource && (
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium">Code Source:</span>
                <span className="text-sm max-w-[300px] truncate">{agentConfig.codeSource}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
