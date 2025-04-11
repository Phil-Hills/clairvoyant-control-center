"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AgentInfoSection } from "@/components/agents/review-sections/agent-info-section"
import { ModelFunctionSection } from "@/components/agents/review-sections/model-function-section"
import { TriggersSection } from "@/components/agents/review-sections/triggers-section"
import { SecretsSection } from "@/components/agents/review-sections/secrets-section"
import { ValidationSection } from "@/components/agents/review-sections/validation-section"
import { JsonExportSection } from "@/components/agents/review-sections/json-export-section"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useMediaQuery } from "@/hooks/use-media-query"

interface PreDeploymentReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agentConfig: any // In a real app, this would be a properly typed agent configuration
  onDeploy: () => Promise<void>
  onEdit: (section: string) => void
}

export function PreDeploymentReviewModal({
  open,
  onOpenChange,
  agentConfig,
  onDeploy,
  onEdit,
}: PreDeploymentReviewModalProps) {
  const { toast } = useToast()
  const [isDeploying, setIsDeploying] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")
  const [dryRunMode, setDryRunMode] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Check if there are any validation issues
  const hasValidationIssues =
    !agentConfig.validations?.endpointValid ||
    !agentConfig.validations?.functionValid ||
    (agentConfig.secrets?.length > 0 && !agentConfig.validations?.secretsValid)

  const handleDeploy = async () => {
    setIsDeploying(true)

    try {
      await onDeploy()

      toast({
        title: "Agent Deployed Successfully",
        description: `Agent "${agentConfig.name}" has been deployed to Google Cloud.`,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Deployment error:", error)

      toast({
        title: "Deployment Failed",
        description: "There was an error deploying the agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review and Deploy Agent</DialogTitle>
          <DialogDescription>
            Please confirm the details below before deploying your agent to Google Cloud.
          </DialogDescription>
        </DialogHeader>

        {hasValidationIssues && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Validation Issues Detected</AlertTitle>
            <AlertDescription>
              Some components of your agent configuration have validation issues. You can still deploy, but the agent
              may not function correctly.
            </AlertDescription>
          </Alert>
        )}

        {isDesktop ? (
          <div className="space-y-6 py-4">
            <AgentInfoSection agentConfig={agentConfig} onEdit={() => onEdit("details")} />
            <ModelFunctionSection agentConfig={agentConfig} onEdit={() => onEdit("model")} />
            <TriggersSection agentConfig={agentConfig} onEdit={() => onEdit("trigger")} />
            <SecretsSection agentConfig={agentConfig} onEdit={() => onEdit("secrets")} />
            <ValidationSection agentConfig={agentConfig} onEdit={() => onEdit("test")} />
            <JsonExportSection agentConfig={agentConfig} />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="py-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4 mt-4">
              <AgentInfoSection agentConfig={agentConfig} onEdit={() => onEdit("details")} />
              <ValidationSection agentConfig={agentConfig} onEdit={() => onEdit("test")} />
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <ModelFunctionSection agentConfig={agentConfig} onEdit={() => onEdit("model")} />
              <TriggersSection agentConfig={agentConfig} onEdit={() => onEdit("trigger")} />
              <SecretsSection agentConfig={agentConfig} onEdit={() => onEdit("secrets")} />
            </TabsContent>

            <TabsContent value="json" className="mt-4">
              <JsonExportSection agentConfig={agentConfig} />
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="dry-run"
              checked={dryRunMode}
              onChange={(e) => setDryRunMode(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="dry-run" className="text-sm">
              Deploy in Dry Run Mode
            </label>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button onClick={handleDeploy} disabled={isDeploying} className="flex-1 sm:flex-none">
              {isDeploying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : dryRunMode ? (
                "Deploy (Dry Run)"
              ) : (
                "Deploy Agent"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
