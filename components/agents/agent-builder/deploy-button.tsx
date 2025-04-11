"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Rocket } from "lucide-react"
import { PreDeploymentReviewModal } from "@/components/agents/pre-deployment-review-modal"
import { useToast } from "@/hooks/use-toast"

// Mock agent configuration for demonstration
const mockAgentConfig = {
  name: "Content Analyzer",
  description: "Analyzes content and extracts key insights using AI",
  environment: "development",
  region: "us-central1",
  vertexEndpoint: "projects/my-project/locations/us-central1/publishers/google/models/text-bison",
  cloudFunction: "content-analyzer-function",
  functionRuntime: "nodejs18",
  codeSource: "gs://my-bucket/functions/content-analyzer",
  triggerType: "scheduled",
  cronExpression: "0 */6 * * *",
  secrets: [
    { id: "secret-1", name: "OPENAI_API_KEY", type: "api-key" },
    { id: "secret-2", name: "DATABASE_URL", type: "connection-string", warning: "Secret value is empty" },
  ],
  validations: {
    endpointValid: true,
    functionValid: true,
    secretsValid: false,
    secretWarnings: "Some secrets may be missing or invalid",
    lastTestRun: new Date().toISOString(),
  },
}

interface DeployButtonProps {
  onNavigateToSection?: (section: string) => void
}

export function DeployButton({ onNavigateToSection }: DeployButtonProps) {
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleDeploy = async () => {
    // In a real app, this would call an API to deploy the agent
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  }

  const handleEdit = (section: string) => {
    setIsModalOpen(false)

    // Allow time for the modal to close before navigating
    setTimeout(() => {
      if (onNavigateToSection) {
        onNavigateToSection(section)
      } else {
        toast({
          title: "Edit Requested",
          description: `Navigating to ${section} section`,
        })
      }
    }, 300)
  }

  return (
    <>
      <Button onClick={handleOpenModal} disabled={isLoading} className="gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <Rocket className="h-4 w-4" />
            Deploy Agent
          </>
        )}
      </Button>

      <PreDeploymentReviewModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        agentConfig={mockAgentConfig}
        onDeploy={handleDeploy}
        onEdit={handleEdit}
      />
    </>
  )
}
